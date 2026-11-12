/* Production compiler: preserve source pages/assets; publish only dist/. */
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const vm = require('node:vm');
const sharp = require('sharp');
const esbuild = require('esbuild');
let parseHTML;
const workspace = path.resolve(__dirname, '..');
process.chdir(workspace);
const output = path.join(workspace, 'dist');
const pages = ['index.html', 'amenager-mon-jardin.html', 'realisations.html', 'devis.html', 'contact.html'];
const cssFiles = ['css/reference.css', 'css/styles.css', 'css/pages.css', 'css/i18n.css'];
const site = JSON.parse(fs.readFileSync('data/site.json', 'utf8'));
const origin = 'https://verdesia.ma';
const production = process.env.CONTEXT ? process.env.CONTEXT === 'production' : process.env.SITE_ENV === 'production';
const fingerprint = buffer => crypto.createHash('sha256').update(buffer).digest('hex').slice(0, 16);
const report = { environment: production ? 'production' : 'preview', images: {}, pages: {}, scripts: {}, styles: {} };
const escapeXML = text => String(text).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[c]);
function write(filename, contents) {
  const destination = path.join(output, filename);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.writeFileSync(destination, contents);
}
function asset(folder, name, ext, bytes) {
  const filename = `assets/${folder}/${name}.${fingerprint(bytes)}.${ext}`;
  write(filename, bytes);
  return '/' + filename;
}
function copyAsset(source, folder = 'media') {
  const bytes = fs.readFileSync(source);
  return asset(folder, path.basename(source, path.extname(source)).replace(/[^a-z0-9]+/gi, '-').toLowerCase(), path.extname(source).slice(1), bytes);
}
function translator() {
  const context = { URL, location: { href: origin + '/?lang=ar' }, localStorage: { getItem: () => null }, document: { documentElement: {}, addEventListener() {} }, window: {} };
  const code = fs.readFileSync('js/i18n.js', 'utf8').replace('window.verdesiaI18n = { t,', 'window.verdesiaI18n = { keys: Object.keys(translations), t,');
  vm.runInNewContext(code, context);
  return context.window.verdesiaI18n;
}
const translation = translator();
const translate = translation.t;
const existingTranslations = new Set(translation.keys);
const reversePairs = {};
function ar(text) {
  const result = translate(text, 'ar');
  if (result !== text && !existingTranslations.has(text)) reversePairs[text] = result;
  return result;
}
const documents = new Map();
const images = new Map();
const otherAssets = new Map();
function local(value) { return value && !/^(?:[a-z]+:|\/\/|#)/i.test(value); }
function sourcePath(value) { return decodeURI(value.split(/[?#]/)[0].replace(/^\//, '')); }
function candidates(image, sizes) {
  const list = image.variants;
  return { src: list[list.length - 1].url, srcset: list.map(v => `${v.url} ${v.width}w`).join(', '), sizes };
}
function sizesFor(img) {
  if (img.closest('.home-project-card')) return '(max-width: 420px) calc(100vw - 40px), (max-width: 767px) calc((100vw - 56px) / 2), (max-width: 1500px) calc((100vw - 128px) / 3), 480px';
  if (img.closest('.project-carousel')) return '(max-width: 767px) calc(100vw - 48px), (max-width: 1248px) calc((100vw - 48px) * 0.586), 704px';
  if (img.closest('.garden-visual, .garden-step-media')) return '(max-width: 767px) calc(100vw - 40px), (max-width: 1440px) 48vw, 700px';
  return '100vw';
}
async function prepareImage(source) {
  const input = fs.readFileSync(source);
  const cacheDir = path.join(workspace, '.preview/image-cache', fingerprint(input) + '-lossless-v3');
  const cacheManifest = path.join(cacheDir, 'manifest.json');
  let cached;
  if (fs.existsSync(cacheManifest)) {
    cached = JSON.parse(fs.readFileSync(cacheManifest, 'utf8'));
    if (cached.configuration === 'mobile-widths-v4' && cached.variants.every(v => fs.existsSync(path.join(cacheDir, path.basename(v.url))))) {
      for (const variant of cached.variants) write(variant.url.slice(1), fs.readFileSync(path.join(cacheDir, path.basename(variant.url))));
      const entry = { ...cached, source }; images.set(source, entry); report.images[source] = entry;
      return;
    }
  }
  const metadata = await sharp(input).metadata();
  const oriented = metadata.orientation && metadata.orientation >= 5;
  const width = oriented ? metadata.height : metadata.width;
  const height = oriented ? metadata.width : metadata.height;
  const cap = Math.min(width, 2560);
  const oldWidths = [...new Set([...([480, 768, 1024, 1440, 1920, cap].filter(w => w <= cap)), width])];
  const widths = [...new Set([...([400, 480, 640, 768, 840, 1024, 1200, 1440, 1920, cap].filter(w => w <= cap)), width])].sort((a, b) => a - b);
  const name = path.basename(source, path.extname(source)).replace(/[^a-z0-9]+/gi, '-').toLowerCase();
  const variants = [];
  for (const target of widths) {
    const previous = cached?.variants.find(v => v.width === target);
    if (previous && fs.existsSync(path.join(cacheDir, path.basename(previous.url)))) {
      write(previous.url.slice(1), fs.readFileSync(path.join(cacheDir, path.basename(previous.url))));
      variants.push(previous); continue;
    }
    if (cached && (cached.attemptedWidths || oldWidths).includes(target) && !previous) continue;
    // No crop, sharpening, colour grading, enlargement or additional lossy compression.
    let encoded = await sharp(input).autoOrient().resize({ width: target, withoutEnlargement: true }).keepIccProfile().webp({ lossless: true, effort: 6 }).toBuffer();
    let ext = 'webp';
    if (target < width && encoded.length >= input.length) continue;
    if (target === width && input.length <= encoded.length) {
      encoded = input;
      ext = metadata.format === 'jpeg' ? 'jpg' : metadata.format;
    }
    const url = asset('images', `${name}-${target}w`, ext, encoded);
    variants.push({ width: target, height: Math.round(target * height / width), url, bytes: encoded.length });
  }
  const entry = { source, originalBytes: input.length, originalFormat: metadata.format, width, height, variants, configuration: 'mobile-widths-v4', attemptedWidths: widths };
  images.set(source, entry);
  report.images[source] = entry;
  fs.mkdirSync(cacheDir, { recursive: true });
  for (const variant of variants) fs.copyFileSync(path.join(output, variant.url), path.join(cacheDir, path.basename(variant.url)));
  fs.writeFileSync(cacheManifest, JSON.stringify(entry));
}
function setMeta(doc, name, content, property = false) {
  const meta = doc.createElement('meta');
  meta.setAttribute(property ? 'property' : 'name', name);
  meta.setAttribute('content', content);
  doc.head.append(meta);
}
function canonicalPath(page, language) {
  return (language === 'ar' ? '/ar/' : '/') + (page === 'index.html' ? '' : page);
}
function seo(doc, page, language) {
  const canonical = origin + canonicalPath(page, language);
  doc.documentElement.lang = language === 'ar' ? 'ar-MA' : 'fr';
  doc.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  doc.documentElement.setAttribute('data-static-locales', 'true');
  doc.documentElement.setAttribute('data-page', page);
  doc.querySelector('meta[name="robots"]').setAttribute('content', production ? 'index,follow,max-image-preview:large' : 'noindex,nofollow');
  const descriptionSources = {
    'index.html': '.home-hero-subtitle', 'amenager-mon-jardin.html': '.garden-lead',
    'realisations.html': '.project-description', 'devis.html': '.quote-hero .texte-centre', 'contact.html': '.contact-hero .texte-centre',
  };
  const description = doc.querySelector(descriptionSources[page])?.textContent.trim().replace(/\s+/g, ' ') || doc.querySelector('meta[name="description"]').content;
  // Reuse approved page copy verbatim rather than introducing new business claims.
  doc.querySelector('meta[name="description"]').setAttribute('content', language === 'ar' ? ar(description) : description);
  const link = doc.createElement('link'); link.rel = 'canonical'; link.href = canonical; doc.head.append(link);
  for (const [locale, code] of [['fr', 'fr-MA'], ['ar', 'ar-MA'], ['fr', 'x-default']]) {
    const alternate = doc.createElement('link'); alternate.rel = 'alternate'; alternate.hreflang = code;
    alternate.href = origin + canonicalPath(page, locale); doc.head.append(alternate);
  }
  setMeta(doc, 'og:type', 'website', true);
  setMeta(doc, 'og:site_name', 'Verdesia', true);
  setMeta(doc, 'og:title', doc.title, true);
  setMeta(doc, 'og:description', doc.querySelector('meta[name="description"]').content, true);
  setMeta(doc, 'og:url', canonical, true);
  setMeta(doc, 'og:locale', language === 'ar' ? 'ar_MA' : 'fr_MA', true);
  setMeta(doc, 'og:image', origin + report.socialImage, true);
  setMeta(doc, 'twitter:card', 'summary_large_image');
  const schema = doc.createElement('script'); schema.type = 'application/ld+json';
  schema.textContent = JSON.stringify({ '@context': 'https://schema.org', '@type': 'LocalBusiness', '@id': origin + '/#business', name: site.businessName, url: origin + '/', telephone: site.phoneHref, address: { '@type': 'PostalAddress', streetAddress: site.address, addressLocality: 'Bouskoura', postalCode: '27820', addressCountry: 'MA' }, geo: { '@type': 'GeoCoordinates', latitude: site.latitude, longitude: site.longitude }, areaServed: ['Casablanca', 'Bouskoura'], sameAs: [site.instagram, site.facebook], image: origin + report.socialImage }).replaceAll('<', '\\u003c');
  doc.head.append(schema);
}
function translateDocument(doc) {
  const walker = doc.createTreeWalker(doc.documentElement, 4);
  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (!node.textContent.trim() || node.parentElement?.closest('script,style,[data-no-translate]')) continue;
    const clean = node.textContent.trim().replace(/\s+/g, ' ');
    node.textContent = node.textContent.replace(/\S[\s\S]*\S|\S/, () => ar(clean));
  }
  for (const element of doc.querySelectorAll('*')) {
    if (element.closest('[data-no-translate]')) continue;
    for (const attr of ['aria-label', 'aria-roledescription', 'placeholder', 'alt', 'title', 'data-caption']) if (element.hasAttribute(attr)) element.setAttribute(attr, ar(element.getAttribute(attr)));
  }
  for (const iframe of doc.querySelectorAll('iframe[src*="maps.google.com"]')) { const url = new URL(iframe.src); url.searchParams.set('hl', 'ar'); iframe.src = url.href; }
  for (const link of doc.querySelectorAll('a[href^="https://wa.me/"]')) { const url = new URL(link.href); if (url.searchParams.has('text')) { url.searchParams.set('text', ar(url.searchParams.get('text'))); link.href = url.href; } }
  for (const button of doc.querySelectorAll('[data-language-toggle]')) {
    button.setAttribute('aria-pressed', 'true'); button.setAttribute('aria-label', 'Passer en français');
    button.querySelector('[lang="fr"]').classList.remove('active-language');
    button.querySelector('[lang="ar-MA"]').classList.add('active-language');
  }
}
async function main() {
  ({ parseHTML } = await import('linkedom'));
  // Guard recursive cleanup: this compiler owns only workspace/dist.
  if (output !== path.join(workspace, 'dist')) throw Error('Unsafe output directory');
  fs.rmSync(output, { recursive: true, force: true });
  fs.mkdirSync(output, { recursive: true });
  require('./build-pages.cjs');
  const referenced = new Set();
  for (const page of pages) {
    const { document } = parseHTML(fs.readFileSync(page, 'utf8'));
    documents.set(page, document);
    for (const img of document.querySelectorAll('img[src]')) if (local(img.getAttribute('src'))) referenced.add(sourcePath(img.getAttribute('src')));
  }
  // Small queue keeps memory bounded on Netlify and on development machines.
  const queue = [...referenced];
  await Promise.all(Array.from({ length: 2 }, async () => { while (queue.length) await prepareImage(queue.shift()); }));
  report.socialImage = asset('images', 'verdesia-social', 'jpg', await sharp('assets/images/jardin-mediterraneen.jpg').resize({ width: 1200, withoutEnlargement: true }).jpeg({ quality: 94, mozjpeg: true }).toBuffer());
  const fonts = new Map();
  for (const name of fs.readdirSync('assets/fonts')) fonts.set('assets/fonts/' + name, copyAsset('assets/fonts/' + name, 'fonts'));
  let css = cssFiles.map(file => fs.readFileSync(file, 'utf8')).join('\n');
  for (const [source, url] of fonts) css = css.replaceAll('../' + source, '../fonts/' + url.split('/').pop());
  for (const match of [...css.matchAll(/url\(([^)]+)\)/g)]) {
    const value = match[1].replace(/^['"]|['"]$/g, '');
    if (!value.startsWith('../assets/')) continue;
    const source = value.slice(3);
    if (!otherAssets.has(source)) otherAssets.set(source, copyAsset(source, 'icons'));
    css = css.replaceAll(value, '../icons/' + otherAssets.get(source).split('/').pop());
  }
  const minCSS = esbuild.transformSync(css, { loader: 'css', minify: true, legalComments: 'none', charset: 'utf8', target: ['chrome100', 'safari15.4', 'firefox100'] }).code;
  const cssURL = asset('build', 'site', 'css', Buffer.from(minCSS));
  report.styles = { beforeBytes: Buffer.byteLength(css), afterBytes: Buffer.byteLength(minCSS), url: cssURL };
  for (const page of pages) {
    const originalDoc = documents.get(page);
    for (const language of ['fr', 'ar']) {
      const { document: doc } = parseHTML(originalDoc.toString());
      if (language === 'ar') translateDocument(doc);
      for (const img of doc.querySelectorAll('img[src]')) {
        const entry = images.get(sourcePath(img.getAttribute('src'))); if (!entry) continue;
        const responsive = candidates(entry, sizesFor(img));
        // These covers crop to a text-driven height. Viewport width alone can
        // undersample the visible crop, especially on phones. Keep their full
        // original resolution and use the lossless encoding for byte savings.
        if (img.getAttribute('fetchpriority') === 'high') {
          const native = entry.variants.at(-1);
          responsive.src = native.url;
          responsive.srcset = `${native.url} ${native.width}w`;
        }
        for (const [attr, value] of Object.entries(responsive)) img.setAttribute(attr, value);
        // Preserve existing aspect ratio declarations; fill only missing dimensions.
        if (!img.hasAttribute('width')) img.setAttribute('width', entry.width);
        if (!img.hasAttribute('height')) img.setAttribute('height', entry.height);
        if (!img.hasAttribute('decoding')) img.setAttribute('decoding', 'async');
      }
      for (const video of doc.querySelectorAll('video[src]')) {
        const source = sourcePath(video.getAttribute('src'));
        if (!otherAssets.has(source)) otherAssets.set(source, copyAsset(source));
        video.setAttribute('src', otherAssets.get(source));
        const poster = images.get(sourcePath(video.getAttribute('poster') || ''));
        if (poster) video.setAttribute('poster', poster.variants.find(v => v.width >= 768)?.url || poster.variants.at(-1).url);
      }
      for (const expand of doc.querySelectorAll('[data-media-type="video"]')) expand.setAttribute('data-src', otherAssets.get(sourcePath(expand.getAttribute('data-src'))));
      for (const link of doc.querySelectorAll('a.lightbox[href]')) {
        const entry = images.get(sourcePath(link.getAttribute('href'))); if (entry) link.href = entry.variants.at(-1).url;
      }
      for (const link of doc.querySelectorAll('a[href]')) {
        const href = link.getAttribute('href');
        if (!local(href) || !/\.html(?:[?#]|$)/.test(href)) continue;
        const url = new URL(href, origin + '/');
        const name = url.pathname.split('/').pop();
        link.href = canonicalPath(name, language) + url.hash;
      }
      for (const icon of doc.querySelectorAll('link[rel="icon"]')) { const source = sourcePath(icon.href); if (!otherAssets.has(source)) otherAssets.set(source, copyAsset(source, 'icons')); icon.href = otherAssets.get(source); }
      for (const preload of doc.querySelectorAll('link[as="font"]')) preload.href = fonts.get(sourcePath(preload.getAttribute('href')));
      for (const style of doc.querySelectorAll('link[rel="stylesheet"]')) style.remove();
      const style = doc.createElement('link'); style.rel = 'stylesheet'; style.href = cssURL; doc.head.append(style);
      const hero = doc.querySelector('img[fetchpriority="high"]');
      if (hero) {
        const preload = doc.createElement('link');
        preload.setAttribute('rel', 'preload'); preload.setAttribute('as', 'image');
        preload.setAttribute('href', hero.getAttribute('src'));
        preload.setAttribute('imagesrcset', hero.getAttribute('srcset'));
        preload.setAttribute('imagesizes', hero.getAttribute('sizes'));
        preload.setAttribute('fetchpriority', 'high');
        doc.head.insertBefore(preload, doc.head.querySelector('link[as="font"]'));
      }
      for (const script of doc.querySelectorAll('script[src]')) { script.setAttribute('data-build-source', script.getAttribute('src')); script.setAttribute('defer', ''); }
      seo(doc, page, language);
      documents.set(`${language}/${page}`, doc);
    }
  }
  // Every translated static string remains reversible when switching without a reload.
  const runtimeSources = ['js/i18n.js', 'js/main.js', 'js/pages.js'];
  const scriptURLs = new Map();
  for (const file of runtimeSources) {
    let code = fs.readFileSync(file, 'utf8');
    if (file === 'js/i18n.js') code = code.replace('const reverse = new Map(', `Object.assign(translations, ${JSON.stringify(reversePairs)});\n  const reverse = new Map(`);
    const minified = esbuild.transformSync(code, { loader: 'js', minify: true, legalComments: 'none', charset: 'utf8', target: 'es2020' }).code;
    const url = asset('build', path.basename(file, '.js'), 'js', Buffer.from(minified));
    scriptURLs.set(file, url); report.scripts[file] = { beforeBytes: Buffer.byteLength(code), afterBytes: Buffer.byteLength(minified), url };
  }
  for (const language of ['fr', 'ar']) for (const page of pages) {
    const doc = documents.get(`${language}/${page}`);
    for (const script of doc.querySelectorAll('script[data-build-source]')) { script.src = scriptURLs.get(script.getAttribute('data-build-source')); script.removeAttribute('data-build-source'); }
    const bootstrap = doc.createElement('script');
    // Tiny synchronous preference setup retains the existing first-paint font/direction behaviour.
    bootstrap.textContent = `try{var l=new URL(location.href).searchParams.get('lang')||(${JSON.stringify(language)}==='ar'?'ar':localStorage.getItem('verdesia-language'))||'fr';document.documentElement.lang=l==='ar'?'ar-MA':'fr';document.documentElement.dir=l==='ar'?'rtl':'ltr'}catch(e){}`;
    doc.head.insertBefore(bootstrap, doc.head.firstChild);
    const html = '<!doctype html>\n' + doc.documentElement.outerHTML + '\n';
    const filename = language === 'ar' ? `ar/${page}` : page;
    write(filename, html);
    const used = [...new Set([...doc.querySelectorAll('img[src]')].map(img => img.getAttribute('src')))];
    report.pages[filename] = { htmlBytes: Buffer.byteLength(html), defaultImageBytes: used.reduce((n, url) => n + fs.statSync(path.join(output, url)).size, 0), images: used };
  }
  const urls = ['fr', 'ar'].flatMap(language => pages.map(page => origin + canonicalPath(page, language)));
  write('sitemap.xml', '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + urls.map(url => `<url><loc>${escapeXML(url)}</loc></url>`).join('\n') + '\n</urlset>\n');
  write('robots.txt', production ? `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n` : 'User-agent: *\nDisallow: /\n');
  // Netlify already revalidates HTML. Avoid overlapping Cache-Control rules that could merge.
  write('_headers', `/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n${production ? '' : '  X-Robots-Tag: noindex, nofollow\n'}\n/assets/*\n  Cache-Control: public, max-age=31536000, immutable\n`);
  write('_redirects', '/index.html / 301!\n/ar/index.html /ar/ 301!\n');
  write('404.html', '<!doctype html><html lang="fr"><meta charset="utf-8"><title>Verdesia</title><meta name="robots" content="noindex"><a href="/">Verdesia</a></html>');
  fs.mkdirSync('.preview', { recursive: true });
  fs.writeFileSync('.preview/optimization-report.json', JSON.stringify(report, null, 2) + '\n');
  console.log(`Optimized ${pages.length * 2} static pages and ${images.size} images; ${production ? 'indexable production' : 'non-indexable preview'} in dist/.`);
}
main().catch(error => { console.error(error); process.exitCode = 1; });
