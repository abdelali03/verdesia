/* Production-artifact checks: content/structure parity, SEO, links and delivery. */
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');
const pages = ['index.html', 'amenager-mon-jardin.html', 'realisations.html', 'devis.html', 'contact.html'];
const read = file => fs.readFileSync(path.join(dist, file), 'utf8');
function target(url) {
  const pathname = decodeURI(new URL(url, 'https://verdesia.ma/').pathname);
  return pathname.endsWith('/') ? pathname.slice(1) + 'index.html' : pathname.slice(1);
}
async function main() {
  const { parseHTML } = await import('linkedom');
  const report = JSON.parse(fs.readFileSync(path.join(root, '.preview/optimization-report.json'), 'utf8'));
  const production = report.environment === 'production';
  const docs = new Map();
  const descriptions = new Set();
  let checkedLinks = 0;
  for (const language of ['fr', 'ar']) for (const page of pages) {
    const filename = language === 'ar' ? `ar/${page}` : page;
    const { document: doc } = parseHTML(read(filename)); docs.set(filename, doc);
    const expectedPath = (language === 'ar' ? '/ar/' : '/') + (page === 'index.html' ? '' : page);
    assert.equal(doc.documentElement.lang, language === 'ar' ? 'ar-MA' : 'fr');
    assert.equal(doc.documentElement.dir, language === 'ar' ? 'rtl' : 'ltr');
    assert.equal(doc.querySelector('link[rel="canonical"]').getAttribute('href'), 'https://verdesia.ma' + expectedPath, `${filename}: canonical`);
    assert.equal(doc.querySelectorAll('link[rel="alternate"][hreflang]').length, 3, `${filename}: language alternates`);
    const robots = doc.querySelector('meta[name="robots"]').content;
    assert.equal(robots.includes('noindex'), !production, `${filename}: indexing environment`);
    const ids = [...doc.querySelectorAll('[id]')].map(e => e.id); assert.equal(new Set(ids).size, ids.length);
    assert.equal(doc.querySelectorAll('h1').length, 1);
    const description = doc.querySelector('meta[name="description"]').content;
    assert(!descriptions.has(description), `${filename}: repeated description`); descriptions.add(description);
    assert.equal(doc.querySelectorAll('link[rel="stylesheet"]').length, 1, `${filename}: consolidated stylesheet`);
    assert.equal(doc.querySelectorAll('script[src]:not([defer])').length, 0, `${filename}: blocking script`);
    const schema = JSON.parse(doc.querySelector('script[type="application/ld+json"]').textContent);
    assert.equal(schema['@type'], 'LocalBusiness'); assert.equal(schema.telephone, '+212660273737');
    assert(!schema.review && !schema.aggregateRating, 'No invented ratings');
    for (const img of doc.querySelectorAll('img[src]')) {
      assert(img.hasAttribute('width') && img.hasAttribute('height'), `${filename}: missing image dimensions`);
      assert(img.hasAttribute('srcset') && img.hasAttribute('sizes'), `${filename}: missing responsive image`);
    }
    const hero = doc.querySelector('img[fetchpriority="high"]');
    assert(hero && hero.getAttribute('loading') !== 'lazy', `${filename}: hero priority`);
    const nativeCover = Object.values(report.images).find(image => image.variants.at(-1).url === hero.getAttribute('src'));
    assert(nativeCover, `${filename}: full-resolution cover must be retained`);
    assert.equal(hero.getAttribute('srcset'), `${hero.getAttribute('src')} ${nativeCover.width}w`, `${filename}: avoid undersampling text-driven cover crops`);
    const preload = doc.querySelector('link[as="image"]');
    assert.equal(preload.getAttribute('imagesrcset'), hero.getAttribute('srcset'), `${filename}: preload must select the same hero candidate`);
    assert.equal(preload.getAttribute('imagesizes'), hero.getAttribute('sizes'));
    for (const element of doc.querySelectorAll('[src], [href], [poster], [data-src], img[srcset]')) {
      const urls = ['src', 'href', 'poster', 'data-src'].map(name => element.getAttribute(name)).filter(Boolean);
      if (element.hasAttribute('srcset')) urls.push(...element.getAttribute('srcset').split(',').map(item => item.trim().split(/\s+/)[0]));
      for (const url of urls) {
        if (/^(?:https?:|tel:|mailto:|data:|blob:|#)/.test(url)) continue;
        const resolved = target(url);
        assert(fs.existsSync(path.join(dist, resolved)), `${filename}: missing ${url}`); checkedLinks++;
        const fragment = new URL(url, 'https://verdesia.ma/').hash.slice(1);
        if (fragment && resolved.endsWith('.html')) {
          const { document: destination } = parseHTML(read(resolved));
          assert(destination.getElementById(fragment), `${filename}: broken fragment ${url}`);
        }
      }
    }
    for (const video of doc.querySelectorAll('video[src]')) {
      assert.equal(video.getAttribute('preload'), 'none');
      assert(video.hasAttribute('muted') && video.hasAttribute('playsinline') && video.hasAttribute('controls'));
    }
    if (language === 'fr') {
      const { document: original } = parseHTML(fs.readFileSync(path.join(root, page), 'utf8'));
      const normalized = doc => doc.body.textContent.replace(/\s+/g, ' ').trim();
      assert.equal(normalized(doc), normalized(original), `${filename}: visible wording changed`);
      const structure = doc => [...doc.body.querySelectorAll('*')].map(e => `${e.localName}|${e.id}|${e.className}`).join('\n');
      assert.equal(structure(doc), structure(original), `${filename}: layout markup changed`);
    }
  }
  assert.equal(docs.get('index.html').querySelectorAll('#faq details').length, 6);
  const quote = docs.get('devis.html');
  assert(quote.querySelector('input[type="file"][multiple]'));
  assert(!quote.querySelector('input[type="email"]').required);
  assert.equal(docs.get('realisations.html').querySelectorAll('.project-slide').length, 33);
  const styleURL = docs.get('index.html').querySelector('link[rel="stylesheet"]').href;
  const css = read(target(styleURL));
  for (const match of css.matchAll(/url\(([^)]+)\)/g)) {
    const url = match[1].replace(/^['"]|['"]$/g, '');
    if (url.startsWith('data:')) continue;
    const file = path.resolve(path.dirname(path.join(dist, target(styleURL))), url);
    assert(file.startsWith(dist + path.sep) && fs.existsSync(file), `Missing CSS asset ${url}`);
  }
  const headers = read('_headers'); assert(headers.includes('max-age=31536000, immutable'));
  assert.equal(headers.includes('X-Robots-Tag: noindex'), !production);
  assert.equal(read('robots.txt').includes('Disallow: /'), !production);
  assert.equal((read('sitemap.xml').match(/<loc>/g) || []).length, 10);
  for (const forbidden of ['package.json', 'README.md', 'node_modules', '.preview', 'data', 'pages', 'scripts']) assert(!fs.existsSync(path.join(dist, forbidden)), `Source leaked into deployment: ${forbidden}`);
  // CSS rules and all original image/video/font bytes remain intact in the workspace.
  const baseline = path.join(root, '.preview/baseline');
  if (fs.existsSync(baseline)) {
    const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
    for (const name of ['reference.css', 'styles.css', 'pages.css', 'i18n.css']) assert.equal(hash(path.join(root, 'css', name)), hash(path.join(baseline, 'css', name)), `Visual CSS changed: ${name}`);
    function verify(folder) {
      for (const entry of fs.readdirSync(path.join(baseline, folder), { withFileTypes: true })) {
        const relative = path.join(folder, entry.name);
        if (entry.isDirectory()) verify(relative);
        else assert.equal(hash(path.join(root, relative)), hash(path.join(baseline, relative)), `Original asset changed: ${relative}`);
      }
    }
    verify('assets');
  }
  console.log(`OK: 10 ${report.environment} pages; ${checkedLinks} local asset/route references; responsive images; SEO; all 33 media slides; unchanged French body structure, wording, CSS and original assets.`);
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
