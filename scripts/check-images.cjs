/* Compare decoded pixels, not file extensions or a subjective quality setting. */
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const sharp = require('sharp');
const root = path.resolve(__dirname, '..');
const digest = pixels => crypto.createHash('sha256').update(pixels).digest('hex');
async function main() {
  const report = JSON.parse(fs.readFileSync(path.join(root, '.preview/optimization-report.json'), 'utf8'));
  let checked = 0;
  for (const image of Object.values(report.images)) {
    for (const variant of image.variants) {
      const generated = path.join(root, 'dist', variant.url);
      const expected = await sharp(path.join(root, image.source)).autoOrient().resize({ width: variant.width, withoutEnlargement: true }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
      const actual = await sharp(generated).autoOrient().removeAlpha().raw().toBuffer({ resolveWithObject: true });
      assert.equal(actual.info.width, expected.info.width, `${image.source}: width`);
      assert.equal(actual.info.height, expected.info.height, `${image.source}: aspect ratio`);
      assert.equal(digest(actual.data), digest(expected.data), `${variant.url}: additional compression/colour differences`);
      if (variant.width < image.width) assert(variant.bytes < image.originalBytes, 'Responsive variant must save bytes');
      checked++;
    }
  }
  console.log(`OK: ${checked} image variants match reference decoded pixels exactly at their output size. No added lossy compression, cropping or colour changes.`);
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
