---
name: Oren Mizrahi, bar mitzvah teacher
description: A boy's first tallit in Hebrew RTL; cool white wool, tekhelet stripes with a thin black line, a silver atarah, jewelled atarah bands on the photos, woven-label buttons.
colors:
  wool: "#f4f5f2"
  wool-deep: "#e9ebe6"
  tekhelet: "#22418f"
  tekhelet-deep: "#18306e"
  tekhelet-soft: "#dfe6f6"
  stripe-black: "#141a2c"
  atarah: "#1b2230"
  silver: "#cfd3da"
  ink: "#141a2c"
  muted-ink: "#4a5068"
  whatsapp: "#25d366"
  parochet-velvet: "#1a2152"
  parochet-silver: "#cfd3da"
typography:
  display:
    fontFamily: "Felix007, system-ui, sans-serif"
    fontSize: "clamp(2.2rem, 9vw, 4.4rem)"
    fontWeight: 400
    lineHeight: 1.25
  headline:
    fontFamily: "Felix007, system-ui, sans-serif"
    fontSize: "clamp(1.9rem, 6vw, 2.7rem)"
    fontWeight: 400
    lineHeight: 1.25
  title:
    fontFamily: "Felix007, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 400
    lineHeight: 1.25
  body:
    fontFamily: "Felix007, system-ui, -apple-system, Segoe UI, Arial, sans-serif"
    fontSize: "1.1rem"
    fontWeight: 400
    lineHeight: 1.75
  hand:
    fontFamily: "Gveret Levin, Felix007, sans-serif"
    fontSize: "1.9rem"
    fontWeight: 400
    lineHeight: 1.25
  verse:
    fontFamily: "Stam (Stam Ashkenaz CLM + Noto marks)"
    fontSize: "clamp(2rem, 9vw, 3.6rem)"
    fontWeight: 400
    lineHeight: 1.9
rounded:
  label: "6px"
  phone: "2.6rem"
  photo: "0"
spacing:
  section: "5rem"
  gutter: "1.25rem"
  container: "68rem"
---

# Design System: Oren Mizrahi, bar mitzvah teacher

## Overview

The site is the boy's first tallit. The visitor drags open a midnight-blue velvet parochet (the ark curtain) and finds the white wool behind it: holiness he will wear, and learning tied in knot after knot. Every surface comes from the shul's textiles and silver, so the sacred opening and the learning page are one world. No parchment as a ground, no notebook, no school stationery.

- **Ground:** cool white wool with a fine diagonal twill (two 45° repeating gradients at 2.5 to 3.5% ink).
- **Stripes:** the tallit stripe group (a wide tekhelet band, two thin tekhelet bands and one thin black line between them) runs full width behind the hero photo, behind Oren in About, and above and below the story band.
- **Atarah:** the header and the contact section are the dark atarah with a silver zigzag embroidery edge.
- **Jewelled atarah:** each photo is held by a silver band set with tekhelet sapphires and brilliant-cut diamonds in prong settings (`#atarah` SVG symbol, `.jewels`).

## Colors

- **Tekhelet** `#22418f` is the deep colour: headings' second lines, buttons, stripes, the story band, knots. Deep `#18306e` for hover.
- **Atarah** `#1b2230` with **silver** `#cfd3da`: header, contact section, phone frame, accessibility button.
- **Wool** `#f4f5f2` is the page; **wool-deep** `#e9ebe6` the testimonials section.
- **Stripe-black** `#141a2c` appears only as the one thin line in a stripe group and as ink.
- **WhatsApp green** `#25d366` only on the floating round button.
- The parochet is midnight-blue velvet (`#1a2152`) with silver embroidery, crown and fringe, matching the atarah.

### Named Rules

**The No Flag Rule.** Tekhelet on white always carries the thin black line or the silver: a bare two-blue-stripe band on white reads as the Israeli flag.

**The No Black Atarah Rule.** The photo bands are silver with tekhelet and clear stones, never black.

## Typography

**Text:** felix007 (one face, one weight) for every heading, paragraph, button and label. The page never fakes bold (`font-synthesis-weight: none`); emphasis is colour.
**Hand:** Gveret Levin for Oren's own marks: the wordmark, "האח הגדול בדרך", captions, the testimonials note, "יחס חם של אח גדול לכל תלמיד!", the signature.
**Verse:** Stam, built by `tools/build-verse-font.py` (Stam Ashkenaz CLM letters with Noto Serif Hebrew niqqud and cantillation).

Every heading has a line height of exactly 1.25em. Never Rubik, Assistant or Frank Ruhl Libre. Under the "readable font" option all faces fall back to the system sans.

## Layout

Section order: hero, about, the big day (story), how it works, testimonials, warm photo, contact, footer.

- **Hero:** desktop is one centred group (title at natural width, photo 25rem) with the stripes behind the photo's lower part; mobile is centred text, then the photo.
- **About:** text with Oren standing (background removed) on a stripe; on mobile the figure follows the text.
- **How it works:** desktop puts the verse card sticky in one column and the three knot steps in the other; the verse loses cantillation, then niqqud, as each step crosses the reading line. Mobile keeps the verse sticky above the steps.
- **Testimonials:** the phone is 9:19.5 and the chat animates (typing, messages, loop, pause button).

## Components

- **Woven label (button):** tekhelet fill, 6px corners, a dashed white stitch 7px inside, soft shadow. Wool variant (tekhelet text) in the header and on the atarah.
- **Floating WhatsApp:** a 3.6rem (3.9rem desktop) green circle bottom right, logo only, with the prepared message; the accessibility button sits bottom left.
- **Knots:** each step mark is a wound knot; past and current knots fill tekhelet.
- **Yad:** a silver Torah pointer walks the first story paragraph on scroll (hidden with stop-animations).
- **Footer credit:** "פותח, עוצב ונבנה באהבה על ידי ראובן עמית בן דוד. 2026." with the RA logo linking to WhatsApp.

## Do's and Don'ts

### Do:
- Keep every photo held by the jewelled atarah, never by tape.
- Keep the stripe group intact (wide, thin, black, thin).
- Keep all motion off under reduced motion and the site's "stop animations".

### Don't:
- Don't use parchment, notebook rules or sticky notes.
- Don't add a bottom WhatsApp bar or tzitzit; the round button is the persistent action.
- Don't set body text in Gveret Levin or fake a bold weight.
