---
target: hero
total_score: 25
max_score: 32
na_heuristics: 7,10
p0_count: 0
p1_count: 1
target_identity: "file:/home/user/Oren-mizrahi/public/index.html"
target_fingerprint: "sha256:2228c8a97780303218d82324eb04e4707cc891ffc57b8f55aa7ff323dec92946"
target_path: /home/user/Oren-mizrahi/public/index.html
timestamp: 2026-11-01T06-28-29Z
slug: public-index-html
---
Method: dual-agent (A: design review · B: detector + browser)
Target: hero section of public/index.html

| # | Heuristic | Score | Key issue |
|---|---|---|---|
| 1 | Visibility of system status | 2 | No :active/pressed state on the CTA |
| 2 | Match with real world | 4 | Parent language, WhatsApp, ark-shaped frame |
| 3 | User control | 3 | Plain link, nothing traps |
| 4 | Consistency | 3 | Off-palette blue focus ring, tracked Hebrew |
| 5 | Error prevention | 3 | Pre-filled WhatsApp text |
| 6 | Recognition | 4 | |
| 7 | Flexibility | n/a | single-goal Persuade page |
| 8 | Aesthetic & minimalist | 3 | Desktop dead zone, gold too faint |
| 9 | Error recovery | 3 | No fallback if WhatsApp is not installed |
| 10 | Help | n/a | landing hero |
| Total | | 25/32 | Good (78%) |

Specificity: mostly authored (photo, arch=ark, terracotta, Frank Ruhl); arch+pill and tracked role line are category-generic. Wordmark is the place for one owned gesture.
Detector: 1 warning cream-palette (false positive: palette pinned by brief). No other rules fired. Contrast all >=6.98:1, targets >=44px, CTA above the fold, no overflow at 320px. 13 requests ~142KB; Latin font subsets ~68KB (48%).

Priority issues:
- [P1] No CTA in the thumb zone and no persistent CTA once the page grows; no pressed state. Fix: sticky bottom WhatsApp bar on mobile after the hero button leaves view, :active state. (/impeccable adapt, harden)
- [P2] Entrance animation starts LCP image and CTA at opacity 0 (ghost CTA ~1.5s). Fix: image visible immediately, CTA without fade, keep headline rise. (/impeccable animate)
- [P2] Desktop composition: wordmark floats over the gutter, dead zone under CTA, arch cuts curtain lettering mid-letter. Fix: align wordmark to the grid, rebalance vertical centering, adjust crop. (/impeccable layout)
- [P2] Reflow at 200% zoom: pill button becomes a 3-line blob, orphan word, 2px overflow. Fix: lower clamp floor, smaller radius, icon handling. (/impeccable adapt)
- [P3] Wordmark generic, Hebrew letter-spacing .28em hurts legibility, gold almost invisible. Fix: stronger name, tracking <=.05em, more visible gold arch border. (/impeccable typeset, delight)
- [P3 perf] Latin font subsets 68KB for digits/punctuation. Fix: subset or drop Latin files and let fallback cover digits, or one Latin weight. (/impeccable optimize)

Personas: Jordan - no hint of where Oren teaches; desktop has no scroll cue. Riley - 195px blob button, extra tab stop on wordmark. Casey - CTA top-middle, ghost CTA on slow connection. Anxious parent - only verbal reassurance is grey fine print; differentiator (real Torah scroll + audience) not hinted above the fold.
