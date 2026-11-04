---
name: Oren Mizrahi, bar mitzvah teacher
description: A big brother's school notebook in Hebrew RTL; blue rules, a red margin, yellow marker, red-pen notes and taped polaroids.
colors:
  ink-blue: "#1f3a8a"
  ink-blue-deep: "#162b6b"
  red-pen: "#c2412d"
  marker-yellow: "#f8dd6b"
  sticky-note: "#fff4b8"
  notebook-blue: "#b8c6e6"
  rule-line: "rgb(120 150 210 / 0.22)"
  margin-red: "rgb(214 69 58 / 0.45)"
  paper: "#fdfcf7"
  paper-deep: "#f4f1e6"
  ink: "#1c2236"
  muted-ink: "#4a5068"
  polaroid-white: "#ffffff"
  outgoing-bubble: "#dfe7f8"
  parochet-velvet: "#5e1219"
  parochet-gold: "#e2c482"
typography:
  display:
    fontFamily: "Felix007, system-ui, sans-serif"
    fontSize: "clamp(1.6rem, 8.5vw, 4.1rem)"
    fontWeight: 500
    lineHeight: 1.25
    letterSpacing: "-0.005em"
  headline:
    fontFamily: "Felix007, system-ui, sans-serif"
    fontSize: "clamp(1.75rem, 6vw, 2.6rem)"
    fontWeight: 500
    lineHeight: 1.25
  title:
    fontFamily: "Felix007, system-ui, sans-serif"
    fontSize: "1.4rem"
    fontWeight: 500
    lineHeight: 1.25
  body:
    fontFamily: "Felix007, system-ui, -apple-system, Segoe UI, Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.75
  body-ruled:
    fontFamily: "Felix007, system-ui, -apple-system, Segoe UI, Arial, sans-serif"
    fontSize: "1.1rem"
    fontWeight: 400
    lineHeight: "2rem"
  label:
    fontFamily: "Felix007, system-ui, -apple-system, Segoe UI, Arial, sans-serif"
    fontSize: "0.8rem"
    fontWeight: 600
    letterSpacing: "0.04em"
  hand:
    fontFamily: "Gveret Levin, Felix007, sans-serif"
    fontSize: "1.7rem"
    fontWeight: 400
    lineHeight: 1.2
  verse:
    fontFamily: "Stam (Stam Ashkenaz CLM + Noto marks), Felix007, sans-serif"
    fontSize: "clamp(2rem, 9vw, 3.1rem)"
    fontWeight: 500
    lineHeight: 1.9
rounded:
  note: "2px"
  photo: "3px"
  checkbox: "8px"
  control: "10px"
  sticker: "12px"
  panel: "14px"
  pill: "999px"
  round: "50%"
spacing:
  hairline: "0.5rem"
  gap: "1rem"
  line: "2rem"
  block: "2.75rem"
  section: "4.5rem"
  section-wide: "6.5rem"
  container: "68rem"
  measure: "34rem"
components:
  button-primary:
    backgroundColor: "{colors.ink-blue}"
    textColor: "{colors.polaroid-white}"
    typography: "{typography.label}"
    rounded: "{rounded.sticker}"
    padding: "0.85rem 1.75rem"
    height: "3.25rem"
  button-primary-hover:
    backgroundColor: "{colors.ink-blue-deep}"
    textColor: "{colors.polaroid-white}"
    rounded: "{rounded.sticker}"
  button-primary-sm:
    backgroundColor: "{colors.ink-blue}"
    textColor: "{colors.polaroid-white}"
    rounded: "{rounded.sticker}"
    padding: "0.5rem 1.25rem"
    height: "2.75rem"
  button-primary-lg:
    backgroundColor: "{colors.ink-blue}"
    textColor: "{colors.polaroid-white}"
    rounded: "{rounded.sticker}"
    padding: "0.85rem 2.25rem"
    height: "3.6rem"
  nav-toggle:
    backgroundColor: "transparent"
    textColor: "{colors.ink-blue}"
    rounded: "{rounded.control}"
    size: "2.75rem"
  step-checkbox:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink-blue}"
    rounded: "{rounded.checkbox}"
    size: "2.5rem"
  step-checkbox-active:
    backgroundColor: "{colors.ink-blue}"
    textColor: "{colors.polaroid-white}"
    rounded: "{rounded.checkbox}"
    size: "2.5rem"
  polaroid:
    backgroundColor: "{colors.polaroid-white}"
    rounded: "{rounded.photo}"
    padding: "0.6rem 0.6rem 2.8rem"
  sticky-note:
    backgroundColor: "{colors.sticky-note}"
    textColor: "{colors.ink}"
    typography: "{typography.verse}"
    rounded: "{rounded.note}"
    padding: "1rem 1rem 0.9rem"
  chat-bubble-incoming:
    backgroundColor: "{colors.polaroid-white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.panel}"
    padding: "0.6rem 0.8rem 0.7rem"
  chat-bubble-outgoing:
    backgroundColor: "{colors.outgoing-bubble}"
    textColor: "{colors.ink}"
    rounded: "18px"
    padding: "0.8rem 1rem"
  a11y-option:
    backgroundColor: "{colors.polaroid-white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    height: "44px"
  a11y-option-pressed:
    backgroundColor: "{colors.ink-blue}"
    textColor: "{colors.polaroid-white}"
    rounded: "{rounded.control}"
    height: "44px"
---

# Design System: Oren Mizrahi, bar mitzvah teacher

## Overview

**Creative North Star: "The Big Brother's Notebook"**

The site is a page out of an older brother's Hebrew school notebook: warm off-white paper ruled in faint blue every 2rem, a red margin line on the right (the RTL side, where a Hebrew notebook keeps it), headings written in one confident ink blue, key phrases swiped with a yellow highlighter, and Oren's own notes in red pen in his handwriting. Photos are polaroids taped onto the page; the main button is a blue sticker stuck on slightly crooked. It reads as personal and close, a teenager who is serious about the work, never as a school brochure or a template.

Playfulness lives in the materials (paper, marker, tape, pen) and never in the copy. The serious work is done by the words, the Torah material and the verse: the verse sits on a yellow sticky note and sheds its cantillation and then its vowels across the three steps, a Torah yad pointer follows the words of the first story paragraph as it scrolls, and the testimonials arrive as a WhatsApp conversation on Oren's phone. The notebook frames these; it does not compete with them. The approved opening is the exception to the paper world: a full-screen burgundy velvet parochet with an embroidered gold frame, dragged open into light, after which the notebook appears.

Density is calm and single-column on mobile (where parents arrive from a WhatsApp link), opening to two columns on desktop. Every path ends in one WhatsApp message.

**Key Characteristics:**
- Ruled paper is the ground on every page; running text sits exactly on the 2rem rules.
- One deep colour (ink blue) carries headings, buttons and Oren's name; red pen is for decoration and notes only.
- Yellow marker highlights the one phrase in each heading that matters.
- Handwriting (Gveret Levin) is Oren's voice: his name, his notes, his signature. Never body copy.
- Physical objects (sticker, polaroid, tape, sticky note) carry soft, low shadows and slight rotations.
- Hebrew RTL first; every motion has a still final state.

## Colors

A cool paper-and-ink palette: one deep blue, one red pen, one yellow marker, on warm off-white.

### Primary
- **Notebook Ink Blue** (`ink-blue`): the single deep colour. Headings' accent line, the WhatsApp sticker buttons, Oren's handwritten name and signature, step titles, links, the yad pointer on the story lead, pressed states. White text on it passes AA comfortably.
- **Pressed-Nib Blue** (`ink-blue-deep`): hover and active state of the sticker button, the accessibility launcher, bold proof lines and focus rings.

### Secondary
- **Correction Red Pen** (`red-pen`): decoration and Oren's notes only. The hero note "האח הגדול בדרך", the story turn line, the about subtitle, the hand-drawn flourish under the wordmark, underlines on footer and story links, list markers, the active-nav underline, the checkmark on the goal step and the yad on the desktop rail. Measured about 5:1 on paper, so it may carry large handwritten text, but never a button or body paragraph.

### Tertiary
- **Highlighter Yellow** (`marker-yellow`): the marker swipe behind one phrase per heading, the tape on polaroids (at 75% opacity), and text selection.
- **Sticky-Note Yellow** (`sticky-note`): the background of the verse note only.
- **Parochet Velvet** (`parochet-velvet`) and **Embroidery Gold** (`parochet-gold`): the opening curtain only, with its gradient folds (`#74181e` to `#4a0d15`), gold frame, fringe and light. They never appear in the notebook itself.

### Neutral
- **Notebook Paper** (`paper`): page background, header, panels, step checkboxes at rest.
- **Second Sheet** (`paper-deep`): image placeholders and hover fill in the mobile nav. New sections ("a new page") use a translucent `rgb(238 233 214 / .45)` over the paper so the rules continue through them.
- **Notebook Rule Blue** (`notebook-blue`): borders of panels and the accessibility controls, the dashed path between steps, the scrollbar, the sticky bar's top edge.
- **Rule Line** (`rule-line`): the horizontal ruling, a 1px line every 2rem.
- **Margin Red** (`margin-red`): the 1.5px vertical margin line, 0.7rem from the right edge on mobile and 3rem on desktop.
- **Pencil Ink** (`ink`): all body text and the hero headline.
- **Faded Ink** (`muted-ink`): secondary text, captions, the verse caption, legal dates.
- **Polaroid White** (`polaroid-white`): polaroid frames, the sticker's white die-cut edge, incoming chat bubbles, accessibility option buttons.
- **Sent-Message Blue** (`outgoing-bubble`): the outgoing pre-written WhatsApp bubble in the contact section.

### Named Rules
**The One Ink Rule.** Ink blue is the only deep colour for anything a parent must read as an action or a heading accent. Red pen never fills a button or carries running text.

**The One Swipe Rule.** The yellow marker highlights one phrase per heading (the hero's "הבן שלכם הבא." and each section title). It is never a panel fill or a background.

**The Legacy Names Rule.** In code the variables keep older names: `--cream` is paper, `--terracotta` is ink blue, `--terracotta-dark` is the deep blue, `--gold` is the red pen, `--gold-soft` is the rule blue, `--highlight` is the marker. Use the variables, read them by these meanings.

## Typography

**Display and Body Font:** felix007 (one face, one weight) for every heading, paragraph, button and label
**Hand Font:** Gveret Levin 400, the twist: Oren's name, red-pen notes, captions, signature
**Verse Font:** Stam Ashkenaz CLM (Torah-scroll letters) with niqqud and cantillation from Noto Serif Hebrew, built by `tools/build-verse-font.py`, for the verse only

**Character:** One friendly hand-drawn sans for everything Oren says, and his own handwriting for the personal marks. felix007 has a single weight, so the page never fakes bold (`font-synthesis-weight: none`); emphasis comes from ink colour and the yellow marker. Every heading has a line height of exactly 1.25em. All faces are self-hosted with `font-display: swap`. The root size is 112.5% (18px). Never Rubik, Assistant or Frank Ruhl Libre.

### Hierarchy
- **Display** (felix007, `clamp(1.6rem, 8.5vw, 4.1rem)` on mobile and `clamp(3rem, 4.6vw, 4.1rem)` on desktop, line-height 1.25em): the hero headline only, balanced, two lines, the second in ink blue with the marker.
- **Headline** (felix007, `clamp(1.75rem, 6vw, 2.6rem)`, 1.25em): section titles, balanced, with the marker. The contact title runs to `clamp(1.8rem, 7vw, 3rem)` at max 18ch; the story lead to `clamp(1.45rem, 5.6vw, 2.1rem)` (2.3rem on desktop).
- **Title** (felix007, 1.4rem, 1.25em): step titles in ink blue; legal h2 at 1.35rem.
- **Body** (felix007, 1rem, 1.75): default copy. Running paragraphs in the story, steps and about section sit on the rules at exactly `2rem` line-height (1.08 to 1.1rem size) with 2rem between paragraphs, aligned to the ruling in JS; measure about 34rem.
- **Label** (felix007, 0.8rem, 0.04em tracking): the role line under the wordmark; buttons use felix007 at 1.05rem.
- **Hand** (Gveret Levin 400, 1.45 to 2.6rem, 1 to 1.2): the wordmark (1.65 to 2.35rem), the hero note (1.7rem, 2rem desktop, rotated -3deg), the story turn, the about subtitle (1.9rem), polaroid captions (1.45rem), the signature (2.6rem), chat and compose names.
- **Verse** (Noto Serif Hebrew 500, `clamp(2rem, 9vw, 3.1rem)`, 3.4rem desktop, 1.9): the one verse on the sticky note.

### Named Rules
**The Never Frank Ruhl Rule.** Frank Ruhl Libre is never used, anywhere, for any role (client decision).

**The Hand Is Oren Rule.** Gveret Levin is reserved for Oren's own marks: his name, notes, captions and signature. It never sets body copy, buttons or navigation. Under the "readable font" option it falls back to felix007.

**The Ruled Line Rule.** Running text sits on the 2rem rules. Paragraph spacing is one rule (2rem), not an arbitrary margin.

## Layout

A centred container of `min(100% - 2.5rem, 68rem)`. Mobile is a single column with centred hero text; at 56rem the hero becomes `1.15fr .85fr` (text start, polaroid end), the steps become three columns joined by a horizontal dashed path running right to left, the testimonials sit beside the phone (`1fr auto`, max 50rem), and the about section becomes `.85fr 1.15fr`. Section padding is 4.5rem on mobile and 6 to 7rem on desktop. Reading measure stays near 34rem; legal pages use 42rem.

The header is sticky (4rem, 4.75rem desktop) on paper with a rule-blue bottom border; on mobile the nav drops under it behind a toggle and the WhatsApp button collapses to an icon below 30rem. A fixed WhatsApp bar appears at the bottom on mobile once the hero button scrolls away, and hides near the contact section, on short landscape screens (max-height 30rem) and on desktop. The verse note is sticky under the header while the steps scroll past it. The desktop yad rail appears only from 76rem. At 20rem (200% zoom) the header sheds the role line, flourish and header button. Scroll padding keeps focused elements clear of the fixed bars.

Breakpoints: 20rem, 30rem, 56rem, 76rem; plus max-height 30rem.

## Elevation & Depth

Depth is physical, not interface depth: objects are lying on paper. Shadows are soft, cool (tinted `rgb(20 30 60)`), offset downward and blurred, never hard or coloured. Rotations (-1deg to -4deg, +1.5deg) do as much depth work as shadows. The page itself is flat; a new section is marked by a dashed perforation line on top, not by a lift.

### Shadow Vocabulary
- **Sticker** (`box-shadow: 0 0 0 3px #ffffff, 0 7px 16px -7px rgb(20 30 60 / .45)`): the primary button; a white die-cut edge plus a short drop. Hover lifts to `0 12px 22px -8px`, press drops to `0 3px 8px -4px`.
- **Polaroid** (`box-shadow: 0 16px 30px -16px rgb(20 30 60 / .5)`): taped photos at rest.
- **Sticky note** (`box-shadow: 0 10px 18px -12px rgb(20 30 60 / .45)`): the verse note.
- **Bubble** (`box-shadow: 0 1px 1.5px rgb(20 30 60 / .14)`): chat bubbles.
- **Panel** (`box-shadow: 0 18px 40px -18px rgb(20 30 60 / .45)`): the accessibility panel and mobile nav drop.
- **Header on scroll** (`box-shadow: 0 10px 24px -18px rgb(20 30 60 / .35)`): appears only after scrolling.

### Named Rules
**The Lying-On-Paper Rule.** Every shadow is a soft, downward, cool-tinted blur under a physical object. No hard offset shadows, no coloured shadows, no glows.

## Shapes

Small, papery corners: 2px on the sticky note, 3px on polaroids, 8px on the checkbox step marks, 10px on controls, 12px on sticker buttons, 14px on panels and chat bubbles (with a 3px corner where the tail meets). Circles are kept for avatars, the accessibility launcher and the chat toggle. Pills appear only on the parochet's "open" button. The highlighter has deliberately uneven ends (`border-radius: .2em .6em .25em .7em / .15em .4em .2em .45em`) and two slightly rotated layers (178.4deg and 181.2deg) so it looks hand-swiped. Hand-drawn SVG strokes (the flourish, pen arrow, checkmark) use round caps. Tape is a translucent yellow strip, 6.5rem by 1.7rem, rotated -4deg across the top of each photo.

## Components

### Buttons
Character: a blue sticker stuck on the page.
- **Shape:** 12px corners, minimum height 3.25rem (2.75rem small, 3.6rem large).
- **Primary:** ink blue fill, white felix007 text at 1.05rem, WhatsApp icon at 1.35rem, padding 0.85rem 1.75rem, a 3px white die-cut edge and the sticker shadow, rotated -1deg. Full-width and header instances are not rotated.
- **Hover / Focus:** on hover-capable devices it darkens to the deep blue and lifts 2px; press settles 1px down. Focus is a 3px deep-blue outline offset 4px. Transitions run 0.35s on `cubic-bezier(.22, .61, .36, 1)` and are removed under reduced motion.
- **Secondary:** none. Text links are ink blue, bold, with a thin red-pen underline offset 0.3em.

### Polaroid (signature)
Character: a real photo taped into the notebook.
- White frame with 0.6rem sides and a 2.8rem bottom, 3px corners, rotated +1.5deg (or -2deg for the second photo), the polaroid shadow, a yellow tape strip across the top, and a handwritten ink-blue caption in the bottom margin.
- Entrance (motion allowed only, driven by the visitor's scroll): nothing happens until the visitor scrolls; when a polaroid scrolls up past 72% of the viewport it lands into its tilt over 0.7s, then the tape stretches on over 0.38s. Photos already on screen at load wait for the first scroll.

### Highlighter
- Two-layer yellow swipe behind one phrase, starting from the right (RTL writing direction), clone-decorated across line breaks. With motion allowed, the hero phrase draws itself once, 1.5s after the site appears (or after the parochet opens), over 1s; every other marker is scroll-linked: its width follows the visitor's scroll (from 88% to 58% of the viewport) and never draws on its own. Otherwise it is simply there.

### Steps as a to-do list
- Square checkboxes (2.5rem, 8px corners, 2px ink-blue border, paper fill) with the step number in felix007; the active step fills ink blue with a white number. The goal step carries a red-pen checkmark and keeps its paper fill. A dashed rule-blue path (6px dash, 5px gap) links them: vertical on mobile, horizontal on desktop.

### Verse sticky note
- Sticky-note yellow, 2px corners, the note shadow, max 34rem, sticky under the header. Three stacked layers of the verse cross-fade (1.1s) from full cantillation to unpointed text, with a caption naming the stage.

### Chat (testimonials and contact)
- A dark phone body holding a WhatsApp-style chat: paper header with a ring-framed avatar, white incoming bubbles with a tail, messages revealed one by one with a typing indicator, and a play/pause/replay control. The contact section shows one outgoing light-blue bubble with the pre-written message above the large sticker button.

### Yad pointer (signature)
- A tilted (-35deg) ink-blue Torah pointer whose fingertip follows the current word as the page scrolls, with the current word turning ink blue. It runs on one element only: the first story paragraph (the story lead, the only text marked for it); it was removed from the story body and the about paragraphs at the client's request, so new surfaces should not spread it to other running text. The yad text takes a looser line-height (1.8 on the lead) to leave room for the pointer. On desktop from 76rem a separate red-pen yad also rides a fixed rail in the margin to show scroll progress. Both are hidden under reduced motion and "stop animations".

### Navigation
- felix007 links, 48px targets on mobile in a drop-down panel, 44px on desktop inline in the header. Hover turns ink blue; the current section gets a 2px red-pen underline on desktop and ink blue text. The mobile toggle is a 2.75rem square with a 2px ink-blue border and 10px corners.

### Accessibility tool
- A 2.75rem deep-blue circular launcher opens a paper panel (14px corners, rule-blue border) with text size, high contrast, stop animations, highlight links and readable font. Options are white 44px buttons with 10px corners; pressed options fill ink blue. High contrast swaps the palette to pure white and black, removes the ruling, and deepens blue and red.

### Wordmark
- No logo exists: Oren's name in Gveret Levin ink blue, a red-pen hand-drawn flourish under it, and the role in a small felix007 label.

## Do's and Don'ts

### Do:
- **Do** keep ruled paper (1px rule every 2rem, red margin on the right) as the ground of every page, and set running text at a 2rem line-height on it.
- **Do** use ink blue (`ink-blue`) as the one deep colour for headings' accents, buttons and Oren's name.
- **Do** give each heading at most one yellow marker phrase, swiped from the right.
- **Do** keep Gveret Levin for Oren's own marks: name, notes, captions, signature.
- **Do** make physical objects (sticker, polaroid, tape, sticky note) feel placed: small rotations and soft, cool, downward shadows.
- **Do** write Hebrew RTL first, with logical properties (`inset-inline`, `padding-inline-start`).
- **Do** meet IS 5568 / WCAG 2.1 AA: 44px minimum targets, a visible 3px focus outline, AA contrast, and keyboard and screen-reader paths for every interaction.
- **Do** skip every animation and transition under `prefers-reduced-motion` and under the site's own "stop animations" option, showing each element in its final state.

### Don't:
- **Don't** use Frank Ruhl Libre, in any role (client decision).
- **Don't** use long dashes (em or en dash) in copy.
- **Don't** fill buttons or set body text in red pen; it is for notes and decoration.
- **Don't** use hard offset shadows or coloured shadows; the sticker's only edge is its 3px white die-cut.
- **Don't** let the playful materials replace the serious content; the copy, the Torah material and the verse carry the weight.
- **Don't** add the word-following yad to more running text; it belongs to the story lead only.
- **Don't** bring the parochet's velvet and gold into the notebook; they belong to the opening only.
- **Don't** add a logo, invented testimonials, numbers or images.
