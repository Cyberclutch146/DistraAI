# Realtime — auth and the live chat

The community chat at `/chat` is DistraAI's **first real backend**. Everything
else on the dashboard still runs on bundled fixtures, but chat is backed by
Firebase: Google sign-in for identity, Cloud Firestore for an append-only
message log, and an `onSnapshot` listener for live delivery.

This doc covers setup, the data contract, the security rules, and how to extend
it. For how the rest of the app gets its data, see
[data-layer.md](data-layer.md).

## At a glance

| Concern         | Where                                            | Notes                                    |
| --------------- | ------------------------------------------------ | ---------------------------------------- |
| SDK init        | `src/lib/firebase.ts`                            | Singleton, **client-only**, fail-soft     |
| Identity        | `src/state/auth-context.tsx`                     | `AuthProvider` + `useAuth()`             |
| Message stream  | `src/lib/use-chat.ts`                            | `useChat(user)` — listener + send        |
| Pure mapping    | `src/lib/chat-messages.ts`                       | Types + `toChatMessages`, unit tested    |
| UI              | `src/components/chat/ChatRoom.tsx`               | Sign-in gate, bubbles, composer          |
| Route           | `src/app/chat/{page,view}.tsx`                   | Mirrors the other views                  |
| Access control  | `firestore.rules`                                | Deployed via `firebase.json`             |

## Setup

### 1. Create the Firebase project

In the [Firebase Console](https://console.firebase.google.com):

1. Create a project.
2. **Build → Authentication → Sign-in method** → enable **Google**. No client
   ID is needed; the web SDK handles the OAuth flow via popup.
3. **Build → Firestore Database** → create a database in production mode.
4. **Project Settings → General → Your apps → Web app** → register an app and
   copy the config values.

### 2. Configure the environment

Copy the config into `.env.local` (see [`.env.example`](../.env.example)):

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=…
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=…
NEXT_PUBLIC_FIREBASE_PROJECT_ID=…
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=…
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=…
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=   # optional
```

`NEXT_PUBLIC_` values are inlined into the browser bundle at build time, so
**rebuild after changing them** — a running dev server will not pick them up.

> The web config is not a secret. Anyone can read it from the shipped bundle;
> that is by design. Authorisation is enforced by `firestore.rules`, so treat
> the rules file as the security boundary and review it like one.

**Leaving the config out is safe.** `NEXT_PUBLIC_` values are inlined at build
time, so a missing `.env.local` produces a build with no config at all — the
normal state of a fresh clone. `src/lib/firebase.ts` detects that
(`isFirebaseConfigured`) and exports `null` handles instead of initialising the
SDK, so nothing throws. `AuthProvider` reports `configured: false`, `useChat`
never subscribes, and `/chat` renders a panel explaining how to enable it. The
rest of the dashboard is completely unaffected.

This guard is load-bearing, not defensive decoration. `getAuth()` throws
*synchronously* with `auth/invalid-api-key` when `apiKey` is absent, and
`AuthProvider` is mounted in the **root layout** — so without the guard a
missing `.env.local` turns into an HTTP 500 on every route in the app.

### 3. Deploy the security rules

`firebase.json` points at `firestore.rules`. Authenticate the CLI once, then
deploy:

```bash
npm install -g firebase-tools
firebase login
firebase use --add          # pick your project, writes .firebaserc
firebase deploy --only firestore:rules
```

Rules are **not** applied by `next dev` or `next build`. Until they are
deployed, Firestore uses the project's default (often deny-all, sometimes
open in test mode) and the chat will error or leak. Deploy before testing.

`firebase.json` intentionally declares only `firestore` — the Next.js app is
hosted elsewhere, not on Firebase Hosting.

## How it works

### Identity — `src/state/auth-context.tsx`

`AuthProvider` is mounted once in `src/app/layout.tsx`, wrapping the whole app,
so `useAuth()` is available on every route even though only `/chat` consumes
it today.

```ts
const { user, loading, configured, signIn, signOut } = useAuth();
```

- `loading` is `true` until the first `onAuthStateChanged` callback resolves.
  Gate UI on it — otherwise a signed-in user sees the sign-in gate flash. It
  starts `false` when `configured` is `false`, because there is no session to
  resolve.
- `configured` is `false` when the build had no Firebase credentials.
  `signIn()` then rejects with a descriptive error, and `/chat` shows setup
  instructions instead of a button that cannot work.
- `signIn()` opens a `signInWithPopup` Google window; `signOut()` ends the
  session.
- `useAuth` throws if called outside the provider. That is deliberate: a
  missing provider is a wiring bug, not a state to render around.

### Messages — `src/lib/use-chat.ts`

```ts
const { messages, loading, error, sendMessage } = useChat(user);
```

`useChat` opens one `onSnapshot` listener on the `chat_messages` collection
and returns the newest 120 messages, oldest-first, plus a `sendMessage` write.

The listener is gated on `user`. `firestore.rules` denies anonymous reads, so
subscribing before sign-in would only earn a `permission-denied` error. The
`onSnapshot` error callback is therefore not optional: without it Firestore
throws the failure unhandled, and the room would just sit there empty. A
denied or failed read is surfaced through `error` and rendered as an
explanation instead of a silent empty state.

The query is ordered `"desc"` and reversed in code, and that detail matters:

```ts
query(collection(db, "chat_messages"), orderBy("createdAt", "desc"), limit(120));
```

Firestore applies `limit` **after** ordering. An `asc` query would return the
*oldest* 120 documents, so once the collection passed 120 messages the room
would freeze on its oldest page and never show anything new. Querying `desc`
keeps the recent tail; `toChatMessages` reverses it back into reading order for
rendering.

`sendMessage` writes with `serverTimestamp()`, so the message time comes from the
server rather than the sender's clock — two people in different timezones still
agree on the ordering. Firestore's local latency compensation means the sender
sees their own message in the snapshot immediately, at an *estimated* timestamp,
so it lands at the top of the `desc` query straight away and is corrected in
place once the server acknowledges. The `new Date()` fallback in
`toChatMessages` only matters for a document with a genuinely missing
`createdAt`, which `firestore.rules` is meant to prevent.

### The document contract

`chat_messages/{docId}`:

| Field         | Type              | Notes                                    |
| ------------- | ----------------- | ---------------------------------------- |
| `uid`         | `string`          | Author's Firebase uid                    |
| `displayName` | `string`          | Falls back to `"Anonymous"` when absent  |
| `photoURL`    | `string \| null`  | Google avatar, or `null`                 |
| `text`        | `string`          | Trimmed, 1–1000 characters               |
| `createdAt`   | `Timestamp`       | `serverTimestamp()` on write             |

Firestore is schemaless, so `ChatDoc` in `src/lib/chat-messages.ts` is a
*promise*, not a guarantee — it is enforced by the rules below. That is why
`useChat` carries one documented cast from `DocumentData` to `ChatDoc`, and why
the pure mapper lives in its own SDK-free module so it can be unit tested in a
plain Node environment.
## Security rules

`firestore.rules` is the access control for the whole database. It is short
enough to read in full:

```rules
match /chat_messages/{messageId} {
  allow read: if request.auth != null;
  allow create: if request.auth != null
    && request.resource.data.uid == request.auth.uid
    && request.resource.data.text is string
    && request.resource.data.text.size() > 0
    && request.resource.data.text.size() <= 1000
    && request.resource.data.displayName is string
    && (request.resource.data.photoURL is string || request.resource.data.photoURL == null)
    && request.resource.data.createdAt is timestamp
    && request.resource.data.keys().hasOnly(['uid', 'displayName', 'photoURL', 'text', 'createdAt']);
  allow update, delete: if false;
}
```

What each clause buys you:

| Clause                                  | Stops                                                        |
| --------------------------------------- | ------------------------------------------------------------ |
| `request.auth != null` on read          | Anonymous browsing of the whole log                          |
| `uid == request.auth.uid`               | Impersonating another member                                 |
| `text is string` and size bounds        | Non-string payloads, empty messages, and unbounded writes    |
| `hasOnly([...])`                        | Smuggling extra fields that other code would later trust     |
| `allow update, delete: if false`        | Editing or erasing history — the log is append-only          |
| Trailing `match /{document=**}`         | Any collection added later is denied until explicitly opened  |

The last line matters most: this database is **deny-by-default**. Adding a new
collection requires adding a `match` block here, or the feature will fail
closed with a permission error.

## Extending

### A new realtime collection

1. Add a `match /your_collection/{id}` block to `firestore.rules`, scoped as
   narrowly as possible, and redeploy.
2. Add a hook next to `src/lib/use-chat.ts` following the same shape: a
   `useEffect` that opens `onSnapshot` and returns its `unsubscribe`, plus a
   `useCallback` write.
3. Keep the pure mapping (and its types) in a separate SDK-free module so it
   stays unit testable — see `src/lib/chat-messages.ts` and
   `src/lib/__tests__/use-chat.test.ts`.
4. Consume it through `useAuth()`/`useX(user)` in a client component. Do not
   route it through `src/lib/data-client.ts` — see the boundary note below.

### Presence and typing indicators

Both are natural extensions: presence is a `chat_presence/{uid}` document with
an `onSnapshot` plus `onDisconnect`, and typing indicators want a
`chat_typing/{room}` document with a short TTL. Both need new rules blocks, and
presence is a **write** path, so it must not inherit `chat_messages`'
append-only policy — give it its own `match` with explicit update/delete
permissions.

## Known limitations

- **One global room.** Every message lands in `chat_messages`; there are no
  per-region channels, even though `/chat` sits inside `RegionProvider`.
- **No history paging.** The 120-message window is the whole history the client
  ever sees; older messages are not reachable from the UI.
- **No moderation.** Deleting or editing a message is forbidden by rules, so
  there is no way to retract a mistake short of editing the rules and
  redeploying.
- **No rate limiting.** Firestore rules cap message *size*, not message
  *frequency*. A client can still write in a tight loop.
- **No offline writes.** `sendMessage` needs connectivity; there is no local
  queue, so a message composed offline is lost on submit.
- **No environment indicator.** There is no banner telling signed-in users
  whether `firestore.rules` has actually been deployed; the room shows a
  read error instead of a distinct "rules not deployed" state.
- **Chat is the exception to the fixture rule.** Everything else in the app is
  mock data with no persistence.
