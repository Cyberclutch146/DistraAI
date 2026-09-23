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
4. **Calm motion.** Entrances are short fades or slides (150–350 ms) and are
   fully suppressed under `prefers-reduced-motion`.
5. **Everything is a token.** Colours, shadows, and radii come from CSS custom
   properties; components never hardcode a colour.

## Palette

| Token            | Value     | Use                                             |
| ---------------- | --------- | ------------------------------------------------ |
| `--bg-primary`   | `#f9f5ec` | Page canvas (parchment)                          |
| `--bg-surface`   | `#fdfbf6` | Cards and panels                                 |
| `--bg-elevated`  | `#fffdf8` | Floating elements (map overlays, dropdowns)      |
| `--bg-wash`      | `#f4eee1` | Muted fills, bold section bands                  |
| `--bg-surface-hover` | `#efe8d8` | Hover fills, skeletons                       |
| `--text-primary` | `#26211b` | Headings, body ink                               |
| `--text-secondary` | `#6a6054` | Supporting copy                                |
| `--text-tertiary` | `#8a7d6e` | Meta, captions, timestamps                     |
| `--border-subtle` | `#e2d8c6` | Hairlines inside cards                           |
| `--border-strong` | `#cfc2ac` | Structural borders (section rules)               |
| `--accent`       | `#b05a36` | Terracotta — actions, active states              |
| `--accent-hover` | `#96492b` | Accent hover                                    |
| `--accent-subtle` | `#f4e2d6` | Accent tint for pills / toggles                  |
| `--risk-low`     | `#5b8049` | Moss                                             |
| `--risk-moderate`| `#b8892a` | Ochre                                            |
| `--risk-high`    | `#c4512c` | Burnt orange                                     |
| `--risk-critical`| `#a0281b` | Deep red                                         |

Risk colours are also exported as a JS map in `src/lib/risk-colors.ts`
(`RISK_COLORS`), used by the map component for GeoJSON fills.

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

- `btn-primary` — terracotta pill: primary actions and the CTA.
- `btn-ghost` — hairline-outlined button for secondary actions.
- `btn-soft` — tinted button for tertiary, within-panel actions.

### Rules and separators

- `index-rule` — editorial number-plus-rule leader (e.g. `01 ——`).
- `divide-*` / `border-border-subtle` — card hairlines throughout.

### Motion

- `animate-fade-in`, `animate-slide-up`, `animate-clip-reveal`,
  `animate-scale-in` — short staggered entrances used with a
  `style={{ animationDelay }}` on list items.
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
- **Monogram avatar.** A circle with the person's initials in accent on a paper
  surface — always initials, never emoji or gradients.

## Accessibility notes

- Text on parchment uses `--text-secondary`/`--text-primary`, never pure black,
  preserving warmth without dropping contrast below WCAG AA for body copy.
- Interactive states always have a visible hover/active change; focus rings use
  the accent colour.
- Motion is disabled for `prefers-reduced-motion` users.