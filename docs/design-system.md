# Design System — The Field Dispatch

DistraAI's interface is styled like a field log: warm paper, ink-black type, a
single accent, and earthy signal colours. Everything is defined in
`src/app/globals.css` and consumed through Tailwind CSS v4 utilities.

## Design principles

1. **Paper, not glass.** Surfaces are warm and matte. No gradients, no
   `backdrop-blur` glazing except on small overlays over the map, no glow.
2. **Type does the hierarchy.** Display serifs carry weight; the layout stays
   quiet and lets glyphs speak.
3. **One accent.** Terracotta is reserved for actions, the active page, and the
   occasional emphasis. It is never decorative noise.
4. **Drawn, not typed.** Icons are inline SVG. **No emoji in the product** —
   they render inconsistently across platforms, ignore the palette, and cannot
   inherit `currentColor`.
5. **Calm motion.** Entrances are short fades or slides (150–350 ms) and are
   fully suppressed under `prefers-reduced-motion`.
6. **Everything is a token.** Colours, shadows, and radii come from CSS custom
   properties; components never hardcode a colour.

## Palette

Source of truth: `src/app/globals.css` `:root`. The values below are mirrored
here for reference — if they ever disagree, `globals.css` wins.

### Canvas and surfaces

| Token                | Value     | Use                                             |
| -------------------- | --------- | ------------------------------------------------ |
| `--bg-primary`       | `#f9f5ec` | Page canvas (parchment)                          |
| `--bg-surface`       | `#fdfbf6` | Cards and panels                                 |
| `--bg-surface-hover` | `#f2ebdd` | Pressed / hover fills, skeletons                 |
| `--bg-elevated`      | `#fffdf8` | Floating elements (map overlays, dropdowns)      |
| `--bg-wash`          | `#f4eee1` | Muted fills, bold section bands                  |

### Rules and ink

| Token              | Value     | Use                                        |
| ------------------ | --------- | ------------------------------------------- |
| `--border-subtle`  | `#e2d8c6` | Hairlines inside cards                      |
| `--border-strong`  | `#cfc2ac` | Structural borders (section rules)          |
| `--border-focus`   | `#b05a36` | Focus ring colour (mirrors the accent)      |
| `--text-primary`   | `#26211b` | Headings, body ink                          |
| `--text-secondary` | `#6a6054` | Supporting copy                             |
| `--text-tertiary`  | `#8a7d6e` | Meta, captions, timestamps                  |
| `--text-on-accent` | `#fbf6ee` | Text **on** an accent fill                  |

### Accent

| Token             | Value     | Use                                           |
| ----------------- | --------- | ---------------------------------------------- |
| `--accent`        | `#b05a36` | Terracotta — actions, active states           |
| `--accent-hover`  | `#96492b` | Accent hover                                  |
| `--accent-muted`  | `#e8d2c4` | Soft tint for active states                   |
| `--accent-subtle` | `#f6eae0` | Accent tint for pills / toggles               |

`--text-on-accent` exists because text sitting on a terracotta fill needs a
warm off-white rather than pure `#fff`, and because a literal hex in a
component is a token violation. Use `text-text-on-accent` on any accent-filled
surface — buttons, selected chips, chat bubbles, monogram avatars — and
`text-text-on-accent/60` for de-emphasised text on the same fill.

### Risk severity

| Token             | Value     | Use          |
| ----------------- | --------- | ------------ |
| `--risk-low`      | `#5b8049` | Moss         |
| `--risk-moderate` | `#b8892a` | Ochre        |
| `--risk-high`     | `#c4512c` | Burnt orange |
| `--risk-critical` | `#a0281b` | Deep red     |

Risk colours are reserved for risk indicators — never decoration — and are also
exported as a JS map in `src/lib/risk-colors.ts` (`RISK_COLORS`), used by the
map component for GeoJSON fills.

### Radii

`--radius-sm: 8px` · `--radius-md: 10px` · `--radius-lg: 14px` ·
`--radius-xl: 20px` · `--radius-pill: 999px`

## Typography

| Face             | Variable            | Role                                        |
| ---------------- | ------------------- | -------------------------------------------- |
| Fraunces         | `var(--font-fraunces)` | Display serifs — headlines, scores         |
| Karla            | `var(--font-karla)` | Body text                                    |
| JetBrains Mono   | `var(--font-jetbrains-mono)` | Data, coordinates, IDs, timestamps |

Fonts are configured in `src/app/layout.tsx` via `next/font/google`. Utility
helpers:

- `serif-display` — Fraunces, with optical sizing and soft/wonk axes enabled.
- `font-data` — JetBrains Mono for numerals and labels.
- `eyebrow` — small-caps Karla label above a headline (like a field-log rubric).
- `eyebrow-xs` — smaller variant for inline tags and card headers.

## Icons and glyphs

**Emoji are banned in product code.** They are not in the design language, they
fall back to a system font (so a flood marker may render as a monochrome
outline, or a tofu box), and they cannot take `currentColor`.

The pattern, as used in `ChatRoom.tsx`, `CommunityPreview.tsx`, and
`TopNav.tsx`:

```tsx
<svg
  className="h-4 w-4 text-accent"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  strokeWidth={1.5}
  aria-hidden="true"
>
  <path strokeLinecap="round" strokeLinejoin="round" d="…" />
</svg>
```

- `stroke="currentColor"` + a Tailwind text colour, so the icon re-colours with
  its context.
- `aria-hidden="true"` when the icon is decorative and adjacent text already
  carries the meaning; drop it (and add a `<title>`) only when the icon is the
  sole label.
- Icon-only buttons need `aria-label` (see the send button in `ChatRoom.tsx`).
- Spinner states swap the same `<svg>` box for an animated one rather than
  introducing a second visual language.
- A few typographic arrows (`→`, `↑`, `↓`, `—`) remain in prose and trend
  readouts; they are text, not pictograms, and are fine.

Data shapes do not carry icon slots. `InsightData` has no `icon` field, and
`LayerToggle`'s layer table is `{ id, label }` — a component that wants a glyph
draws it itself.

## Reusable classes

### Type helpers

- `eyebrow`, `eyebrow-xs` — sectional labels.
- `serif-display` — Fraunces text.
- `font-data` — mono text.
- `link-editorial` — underlined inline links that flip the underline to accent.

### Surfaces

| Class             | Use                                          |
| ----------------- | --------------------------------------------- |
| `card`            | Standard panel, warm-tinted shadow            |
| `card-static`     | Panel without hover movement                  |
| `card-tint`       | Panel with a subtle wash background           |
| `card-glass`      | Translucent elevated panel (map overlays)     |

### Buttons

- `btn-primary` — terracotta pill: primary actions and the CTA. Text on it must
  use `text-text-on-accent`.
- `btn-ghost` — hairline-outlined button for secondary actions.
- `btn-soft` — tinted button for tertiary, within-panel actions.

### Rules and separators

- `index-rule` — editorial number-plus-rule leader (e.g. `01 ——`).
- `divide-*` / `border-border-subtle` — card hairlines throughout.

### Motion

- `animate-fade-in`, `animate-slide-up`, `animate-clip-reveal`,
  `animate-scale-in` — short staggered entrances used with a
  `style={{ animationDelay }}` on list items.
- `animate-pulse` — skeleton loading states.
- All animations honour `prefers-reduced-motion`.

### Shadows (tokens)

- `shadow-card`, `shadow-card-hover`, `shadow-pop` — two warm-tinted elevation
  levels plus a "lifted" pop shadow for dropdowns and toggles.

## Component recipes

These are conventions, not a library:

- **Evidence card.** `card-tint` with an `eyebrow-xs` label and a `font-data`
  value rendered large — see the dashboard `DataCard`.
- **Legibility chip.** `card-glass` + `border-border-subtle` + `shadow-card`,
  used by `MapLegend`, `LayerToggle`, and the region chip on the map.
- **Severity entry.** A small vertical colour bar (from the risk palette) at the
  left edge of an alert row, with severity as a mono uppercase tag.
- **Monogram avatar.** A circle with the person's initials in
  `text-text-on-accent` on an accent fill — always initials or a real photo,
  never emoji or gradients. Used in `TopNav` and the chat bubble list.
- **Chat bubble.** Accent-filled with `text-text-on-accent` for your own
  messages, `bg-bg-surface` with a `border-border-subtle` hairline for everyone
  else's. The tail corner is squared off (`rounded-tr-md` / `rounded-tl-md`) to
  point at the author.

## Accessibility notes

- Text on parchment uses `--text-secondary`/`--text-primary`, never pure black,
  preserving warmth without dropping contrast below WCAG AA for body copy.
- Interactive states always have a visible hover/active change; focus rings use
  the accent colour (`--border-focus`).
- Motion is disabled for `prefers-reduced-motion` users.
- Decorative SVG is `aria-hidden`; icon-only controls carry an `aria-label`.

## Known exceptions

One place in the app writes colour literals instead of tokens: the Leaflet zone
popup in `src/components/map/RiskMap.tsx` is built as an HTML string, so its
`color` and `border-bottom` values are hand-written to mirror
`--text-primary`, `--text-tertiary`, `--text-secondary`, and
`--border-subtle`. Leaflet takes markup, not JSX, so there is no way to
reference a CSS custom property there without templating the values in. Keep
the literals in sync with the tokens by hand.

`src/lib/risk-colors.ts` is the other literal set, and it is intentional: the
GeoJSON `fillColor` Leaflet receives has to be a concrete colour string.
