import { describe, expect, it } from "vitest";
import { toChatMessages, type ChatDoc, type ChatDocLike } from "../chat-messages";

/** Minimal stand-in for a Firestore Timestamp. */
function ts(iso: string) {
  const date = new Date(iso);
  return { toDate: () => date } as unknown as NonNullable<ChatDoc["createdAt"]>;
}

function doc(id: string, data: ChatDoc): ChatDocLike {
  return { id, data: () => data };
}

function messageDoc(
  id: string,
  text: string,
  createdAt: string | null
): ChatDocLike {
  return doc(id, {
    uid: "user-1",
    displayName: "Ravi",
    photoURL: null,
    text,
    createdAt: createdAt === null ? null : ts(createdAt),
  });
}

describe("toChatMessages", () => {
  it("maps every field off the snapshot document", () => {
    const [message] = toChatMessages([
      doc("m1", {
        uid: "user-9",
        displayName: "Anjali",
        photoURL: "https://example.test/a.png",
        text: "Water rising at the bridge",
        createdAt: ts("2026-04-02T10:00:00.000Z"),
      }),
    ]);

    expect(message).toEqual({
      id: "m1",
      uid: "user-9",
      displayName: "Anjali",
      photoURL: "https://example.test/a.png",
      text: "Water rising at the bridge",
      createdAt: new Date("2026-04-02T10:00:00.000Z"),
    });
  });

  it("reverses a newest-first snapshot into reading order", () => {
    // Firestore returns orderBy('createdAt', 'desc') + limit(N) newest-first.
    const snapshot = [
      messageDoc("m3", "newest", "2026-04-02T12:00:00.000Z"),
      messageDoc("m2", "middle", "2026-04-02T11:00:00.000Z"),
      messageDoc("m1", "oldest", "2026-04-02T10:00:00.000Z"),
    ];

    expect(toChatMessages(snapshot).map((m) => m.text)).toEqual([
      "oldest",
      "middle",
      "newest",
    ]);
  });

  it("keeps a null photoURL as null", () => {
    const [message] = toChatMessages([messageDoc("m1", "hi", null)]);
    expect(message.photoURL).toBeNull();
  });

  it("falls back to the current time when createdAt is missing", () => {
    const before = Date.now();
    const [message] = toChatMessages([messageDoc("m1", "just sent", null)]);

    expect(message.createdAt).toBeInstanceOf(Date);
    expect(message.createdAt.getTime()).toBeGreaterThanOrEqual(before);
  });

  it("returns an empty list for an empty snapshot", () => {
    expect(toChatMessages([])).toEqual([]);
  });

  it("does not mutate the source snapshot", () => {
    const snapshot = [
      messageDoc("m2", "newer", "2026-04-02T11:00:00.000Z"),
      messageDoc("m1", "older", "2026-04-02T10:00:00.000Z"),
    ];
    const ids = snapshot.map((d) => d.id);

    toChatMessages(snapshot);

    expect(snapshot.map((d) => d.id)).toEqual(ids);
  });
});
