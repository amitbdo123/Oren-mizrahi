// Renders the composition frame by frame with Chromium (Playwright).
// Usage: node render.js frames <outDir> [from] [to] [step]   — PNG frames
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
(async () => {
  const [, , mode = 'frames', outDir = path.join(__dirname, '../build/frames'), from = '0', to = '449', step = '1'] = process.argv;
  fs.mkdirSync(outDir, { recursive: true });
  const b = await chromium.launch({ args: ['--allow-file-access-from-files', '--disable-web-security'] });
  const p = await (await b.newContext({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 })).newPage();
  const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('requestfailed', r => errs.push('failed: ' + r.url()));
  await p.goto('file://' + path.join(__dirname, 'composition.html'));
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(500);
  for (let f = +from; f <= +to; f += +step) {
    await p.evaluate(f => window.renderFrame(f), f);
    await p.screenshot({ path: path.join(outDir, String(f).padStart(4, '0') + '.png') });
  }
  console.log('frames', from, '→', to, 'errors:', errs);
  await b.close();
})();
