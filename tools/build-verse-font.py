# Usage (from the repo root):
#   python3 tools/build-verse-font.py tools/verse-font-src/stam-ashkenaz-clm.woff tools/verse-font-src/noto-serif-hebrew-verse-500.woff2 public/fonts/stam-ashkenaz-verse.woff2
# Requires: pip install fonttools brotli
# בונה גופן לפסוק: אותיות Stam Ashkenaz CLM + סימני ניקוד וטעמים מ-Noto Serif Hebrew, עם עוגנים חדשים
import sys
from fontTools.ttLib import TTFont
from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen
from fontTools.feaLib.builder import addOpenTypeFeaturesFromString
from fontTools import subset

stam_path, noto_path, out_path = sys.argv[1:4]
MARK_SCALE = float(sys.argv[4]) if len(sys.argv) > 4 else 1.0
stam = TTFont(stam_path); noto = TTFont(noto_path)
scm, ncm = stam.getBestCmap(), noto.getBestCmap()
sgs, ngs = stam.getGlyphSet(), noto.getGlyphSet()
k = stam['head'].unitsPerEm / noto['head'].unitsPerEm * MARK_SCALE

BELOW = [0x05B0, 0x05B2, 0x05B5, 0x05B7, 0x05B8]       # שווא, חטף פתח, צירה, פתח, קמץ
TAAM_BELOW = [0x05A5, 0x0596, 0x0591, 0x05BD]           # מרכא, טפחא, אתנח, מתג: משמאל לתנועה
ABOVE = [0x05B9]                                         # חולם
CENTER = [0x05BC]                                        # דגש
ALL = BELOW + TAAM_BELOW + ABOVE + CENTER

def bounds(gs, name):
    p = BoundsPen(gs); gs[name].draw(p); return p.bounds

glyf = stam['glyf']
mark_anchor = {}
for cp in ALL:
    sname, nname = scm[cp], ncm[cp]
    pen = TTGlyphPen(None)
    ngs[nname].draw(TransformPen(pen, (k, 0, 0, k, 0, 0)))
    glyf[sname] = pen.glyph()
    stam['hmtx'][sname] = (0, 0)
    sgs = stam.getGlyphSet()
    x0, y0, x1, y1 = bounds(sgs, sname)
    cx = round((x0 + x1) / 2)
    if cp in BELOW or cp in TAAM_BELOW: mark_anchor[cp] = (cx, round(y1))
    elif cp in ABOVE: mark_anchor[cp] = (cx, round(y0))
    else: mark_anchor[cp] = (cx, round((y0 + y1) / 2))

letters = [cp for cp in range(0x05D0, 0x05EB) if cp in scm]
GAP = 120
fea = ['languagesystem DFLT dflt;', 'languagesystem hebr dflt;']
cls = {'below': BELOW, 'taam': TAAM_BELOW, 'above': ABOVE, 'center': CENTER}
for c, cps in cls.items():
    for cp in cps:
        ax, ay = mark_anchor[cp]
        fea.append(f'markClass {scm[cp]} <anchor {ax} {ay}> @{c.upper()};')
fea.append('feature mark {')
for cp in letters:
    g = scm[cp]; b = bounds(sgs, g)
    if not b: continue
    x0, y0, x1, y1 = b; w = stam['hmtx'][g][0]
    cx = round((x0 + x1) / 2)
    base_y = 0 if y0 < -60 else y0                       # אותיות עם זנב: מתחת לקו הבסיס של הגוף
    below_y = round(base_y - GAP)
    if cp == 0x05DA:                                     # ך: הקמץ בתוך האות, בחלל שמתחת לגג
        below_y = round(y1 * 0.36); cx = round(x0 + (x1 - x0) * 0.42)
    taam_x = round(cx - (x1 - x0) * 0.32)
    above_x = round(x0 + (x1 - x0) * 0.2) if cp == 0x05D5 else cx   # חולם מלא: משמאל למעלה
    fea.append(f'  pos base {g} <anchor {cx} {below_y}> mark @BELOW <anchor {taam_x} {below_y}> mark @TAAM <anchor {above_x} {round(y1 + GAP)}> mark @ABOVE <anchor {cx} {round((y0 + y1) / 2 if cp != 0x05DA else y1 * 0.7)}> mark @CENTER;')
fea.append('} mark;')
bases = ' '.join(scm[cp] for cp in letters)
marks = ' '.join(scm[cp] for cp in ALL)
fea.append(f'table GDEF {{ GlyphClassDef [{bases}], , [{marks}], ; }} GDEF;')
for t in ('GPOS', 'GDEF'):
    if t in stam: del stam[t]
addOpenTypeFeaturesFromString(stam, '\n'.join(fea), tables=['GPOS', 'GDEF'])

opts = subset.Options(); opts.flavor = 'woff2'; opts.layout_features = ['*']
ss = subset.Subsetter(opts); ss.populate(unicodes=[0x20] + letters + ALL); ss.subset(stam)
stam.flavor = 'woff2'; stam.save(out_path)
print('saved', out_path)
