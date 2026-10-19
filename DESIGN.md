# DESIGN.md · ML Lab (Anggit Pratama)

Dark, editorial, quiet. A personal academic portfolio, not a SaaS dashboard.
Source of truth: the hero, navbar, XP chip and identity modal redesign. Apply to every page.

## 1. Principles
1. **Hairlines over boxes.** Structure comes from 1px lines and spacing, not bordered cards, pills or fills.
2. **One accent, used rarely.** Emerald marks only: the active item, progress, the NIM/identity, focus.
3. **Three voices.** Inter = content. JetBrains Mono = metadata, labels, indexes. Instrument Serif italic = people and level only (name, "02").
4. **Index, don't badge.** Use numbered mono indexes (01, 02) and plain mono captions. No chips, no status pills, no colored badges.
5. **Read-only portfolio.** No edit/save/cancel affordances. Detail views are read-only; the cue is "Detail ↗", always visible.
6. **Keep the background.** The hero mesh animation and the dotted grid stay untouched.

## 2. Tokens
| Token | Value | Use |
|---|---|---|
| --bg | #090B0E | page |
| --panel | #0F1319 | surfaces (card gradient #121821 → #0C1015) |
| --line | rgba(255,255,255,.08) | every border/divider |
| --text | #F3F5F7 | headings, values |
| --mute | #8B93A1 | body copy |
| --dim | #5E6674 | labels, captions, indexes |
| --acc | #34D399 | accent (glow: rgba(52,211,153,.55)) |
| gray gradient | #C9D1DC → #7C8696 | last word of a headline |
| faint | #2B323D | separators inside text (slashes) |

Fonts: `Inter` 400/500/600/800 · `JetBrains Mono` 400/500 · `Instrument Serif` italic 400. Fallbacks required (system-ui, ui-monospace, Georgia).

## 3. Type scale
- **Display h1:** 800, clamp(52px, 8.4vw, 92px), line-height .98, tracking -0.045em. Final word uses the gray gradient.
- **Section title:** Inter 800, 30px, tracking -0.035em. **Row title:** Inter 500, 19–20px.
- **Body:** 18px / 1.7 / --mute, max-width 600px. Key term in --text, weight 500.
- **Eyebrow:** mono 11.5px, uppercase, tracking .22em. 44px emerald hairline + label (--text) + 3px dot + subject (--mute).
- **Label:** mono 10px, uppercase, tracking .2em, --dim.
- **Meta:** mono 11–12px, tracking .06em, --dim.
- **Serif:** italic 34px (name), 32px (level numeral). Nothing else.

## 4. Layout
Page padding `7vw`; content max-width 1100–1200px. Vertical rhythm 26 / 30 / 34px between eyebrow, headline, copy, blocks. Breakpoints: 1180px (hide nav captions), 820px (stack grids), 620px (modal one column).

## 5. Components
- **Navbar:** brand left; menu with no container. Each link = mono superscript index + label + optional mono caption (hidden < 1180px). Active: white label, emerald index, 1px emerald underline (fades at both ends, glow). Hover: underline draws to 50%. Hairline under the whole bar.
- **XP chip:** left hairline divider; mono "LEVEL" label over serif numeral; `350 / 1400 XP` mono; 2px track, emerald fill with glow and a white end-dot.
- **Credential plate:** 3 columns split by hairlines, top and bottom borders only. Label / value pairs. Name in serif italic, NIM in emerald mono. Whole first cell is a button with "Detail ↗" visible at rest.
- **Stack line:** mono 12px --dim, items separated by `/` in --faint.
- **Buttons:** primary = white fill, dark text, soft white shadow, 8px radius. Secondary = hairline ghost. Nothing else is filled.
- **Detail modal (read-only):** blurred backdrop, hairline card, emerald top highlight, eyebrow + title + one-line description, identity strip, 2-column static fields (numbered mono label, value, underline). Close via ESC key, Esc, or backdrop. No footer buttons.
- **List row (curriculum):** `index | title + meta | status`, separated by hairlines. Hover: faint emerald wash from the left, index turns emerald, arrow appears.
- **Stat strip:** like the plate. Hairline-divided cells, mono label, large Inter 600 number.
- **Footer:** hairline top, logo, 2 link columns, mono copyright. Tech stack as plain mono text, not pills.

## 6. Motion
Fade-up 14px, .8s, cubic-bezier(.2,.7,.2,1), 80ms stagger, text blocks only. Hover/focus transitions .3s. Wrap in `prefers-reduced-motion: no-preference`.

## 7. Accessibility
Visible focus: 1px emerald outline, 4px offset. Interactive blocks get role/aria-label. Contrast: body --mute on --bg, labels --dim only for non-essential metadata.

## 8. Don'ts
No pills or colored badges · no bordered cards for plain lists · no cyan/blue buttons or neon fills · no all-caps bold mono titles · no more than one emerald element per block · no serif outside names/level · no edit/save actions.

## 9. Page recipe
Eyebrow → display h1 → body → hairline block (plate / stats) → content (rows, sections) → CTA → footer. Same nav and XP chip on every page; the active index is emerald.