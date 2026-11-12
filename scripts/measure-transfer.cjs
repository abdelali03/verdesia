/* File-backed budget model, explicitly not a browser waterfall or Lighthouse score. */
const fs = require('node:fs');
const path = require('node:path');
const zlib = require('node:zlib');
const root = path.resolve(__dirname, '..');
function slot(sizes, viewport) {
  for (const item of sizes.split(',')) {
    const clean = item.trim();
    const condition = /^\(max-width:\s*(\d+)px\)\s*(.*)$/.exec(clean);
    if (condition && viewport > Number(condition[1])) continue;
    const expression = (condition ? condition[2] : clean).replace(/calc\(/g, '(').replace(/([\d.]+)vw/g, (_, n) => String(Number(n) * viewport / 100)).replace(/([\d.]+)px/g, '$1');
    if (!/^[\d\s.+*/()-]+$/.test(expression)) throw Error('Unexpected generated sizes expression');
    return Function(`"use strict"; return (${expression});`)();
  }
  return viewport;
}
async function main() {
  const { parseHTML } = await import('linkedom');
  const { document: original } = parseHTML(fs.readFileSync(path.join(root, 'index.html'), 'utf8'));
  const { document: optimized } = parseHTML(fs.readFileSync(path.join(root, 'dist/index.html'), 'utf8'));
  const before = [...new Set([...original.querySelectorAll('img[src]')].map(img => img.getAttribute('src')))];
  const originalImageBytes = before.reduce((n, file) => n + fs.statSync(path.join(root, file)).size, 0);
  const models = [];
  for (const [viewport, dpr] of [[390, 1], [390, 2], [390, 3], [1440, 1], [1440, 2]]) {
    const selected = new Set();
    for (const img of optimized.querySelectorAll('img[src]')) {
      const required = slot(img.getAttribute('sizes'), viewport) * dpr;
      const variants = img.getAttribute('srcset').split(',').map(s => { const [url, width] = s.trim().split(/\s+/); return { url, width: Number(width.slice(0, -1)) }; });
      selected.add((variants.find(v => v.width >= required) || variants.at(-1)).url);
    }
    const imageBytes = [...selected].reduce((n, file) => n + fs.statSync(path.join(root, 'dist', file)).size, 0);
    const textFiles = ['index.html', ...[...optimized.querySelectorAll('script[src],link[rel="stylesheet"]')].map(e => e.getAttribute('src') || e.getAttribute('href'))];
    const compressedTextBytes = textFiles.reduce((n, file) => n + zlib.brotliCompressSync(fs.readFileSync(path.join(root, 'dist', file))).length, 0);
    // Conservative: include every font, even though a browser loads only the weights it uses.
    const fontBytes = fs.readdirSync(path.join(root, 'dist/assets/fonts')).reduce((n, file) => n + fs.statSync(path.join(root, 'dist/assets/fonts', file)).size, 0);
    models.push({ viewport, dpr, allPageImageBytes: imageBytes, estimatedPageBytes: imageBytes + compressedTextBytes + fontBytes, imageReductionPercent: Number(((1 - imageBytes / originalImageBytes) * 100).toFixed(1)) });
  }
  const result = { note: 'All homepage images after scrolling; conservative srcset selection model, not measured browser transfer. Cache cold. Includes all fonts. Browser selection and lazy loading may differ.', originalImageBytes, models };
  fs.writeFileSync(path.join(root, '.preview/transfer-budget.json'), JSON.stringify(result, null, 2) + '\n');
  console.log(JSON.stringify(result, null, 2));
}
main().catch(error => { console.error(error); process.exitCode = 1; });
