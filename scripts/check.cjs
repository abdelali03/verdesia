const fs = require('node:fs');
const path = require('node:path');
const { Script } = require('node:vm');
const pages = ['index.html', 'amenager-mon-jardin.html', 'realisations.html', 'devis.html', 'contact.html'];
const errors = [];
const htmlByPage = new Map(pages.map(page => [page, fs.readFileSync(page, 'utf8')]));
const idsByPage = new Map(pages.map(page => [page, [...htmlByPage.get(page).matchAll(/\bid="([^"]+)"/g)].map(m => m[1])]));
for (const [page, html] of htmlByPage) {
  const ids = idsByPage.get(page);
  if (new Set(ids).size !== ids.length) errors.push(`${page}: duplicate HTML IDs`);
  if ((html.match(/<h1\b/g) || []).length !== 1) errors.push(`${page}: expected one main heading`);
  if (!html.includes('+212 660 273737')) errors.push(`${page}: business phone missing`);
  if (/01 39 44 99 33|tel:\+331|Magny-les-Hameaux|sauvajejardinier|linkedin\.com/.test(html)) errors.push(`${page}: stale contact information`);
  if (/\uFFFD|Am\?nager|r\?alisations/.test(html)) errors.push(`${page}: invalid text encoding`);
  for (const match of html.matchAll(/\b(?:src|href)="([^"]+)"/g)) {
    const url = match[1];
    if (/^(https?:|tel:|mailto:|data:)/.test(url)) continue;
    const [filename, fragment] = url.split('#');
    const target = filename || page;
    if (!fs.existsSync(target)) { errors.push(`${page}: missing file ${target}`); continue; }
    if (fragment && idsByPage.has(target) && !idsByPage.get(target).includes(fragment)) errors.push(`${page}: missing anchor ${url}`);
  }
  if (/<script[^>]+https?:/.test(html)) errors.push(`${page}: unexpected remote script`);
  if (/<script[^>]+ld\+json/.test(html)) errors.push(`${page}: temporary reviews in structured data`);
}
for (const filename of ['css/reference.css', 'css/styles.css', 'css/pages.css', 'css/i18n.css']) {
  for (const match of fs.readFileSync(filename, 'utf8').matchAll(/url\(([^)]+)\)/g)) {
    const url = match[1].replace(/^['"]|['"]$/g, '');
    if (url.startsWith('data:')) continue;
    if (!fs.existsSync(path.resolve(path.dirname(filename), url))) errors.push(`Missing CSS asset: ${url}`);
  }
}
for (const filename of ['js/main.js', 'js/pages.js', 'js/i18n.js']) new Script(fs.readFileSync(filename, 'utf8'), { filename });
const assets = JSON.parse(fs.readFileSync('assets/asset-sources.json', 'utf8')).files;
for (const asset of assets) if (!fs.existsSync(asset.local) || !fs.statSync(asset.local).size) errors.push(`Missing/empty asset: ${asset.local}`);
const projects = JSON.parse(fs.readFileSync('data/projects.json', 'utf8'));
if (projects.length !== 4) errors.push('Expected exactly 4 projects');
for (const [index, project] of projects.entries()) {
  const folder = `assets/images/projets/projet${index + 1}`;
  const expected = fs.readdirSync(folder).filter(file => /\.(jpe?g|png|webp|mp4)$/i.test(file)).map(file => `${folder}/${file}`).sort();
  const actual = project.media.map(item => item.src).sort();
  if (JSON.stringify(actual) !== JSON.stringify(expected)) errors.push(`${project.id}: photos or videos missing/duplicated`);
  for (const item of project.media) {
    if (!fs.existsSync(item.src)) errors.push(`${project.id}: missing media ${item.src}`);
    if (item.type !== (/\.mp4$/i.test(item.src) ? 'video' : 'image')) errors.push(`${project.id}: incorrect media type`);
    if (!htmlByPage.get('realisations.html').includes(item.src)) errors.push(`${project.id}: media not rendered`);
  }
  for (const image of project.featured) {
    if (!actual.includes(image) || !htmlByPage.get('index.html').includes(image)) errors.push(`${project.id}: featured image missing`);
  }
}
if (/Croquis|galerie-grand-|Fairmont|Bombardier|Tramway/.test(htmlByPage.get('index.html') + htmlByPage.get('realisations.html'))) errors.push('Stale gallery or project content');
const quote = htmlByPage.get('devis.html');
for (const field of ['nom', 'telephone', 'ville', 'service']) {
  if (!new RegExp(`<(?:input|select)[^>]+name="${field}"[^>]+required`).test(quote)) errors.push(`Missing required quote field ${field}`);
}
if (/<input[^>]+name="email"[^>]+required/.test(quote) || /<(?:input|textarea)[^>]+name="(?:prenom|description)"/.test(quote)) errors.push('Quote form has unwanted fields');
if (!/<input[^>]+type="file"[^>]+accept="image\/\*"/.test(quote)) errors.push('Missing optional garden photo');
const location = JSON.parse(fs.readFileSync('data/site.json', 'utf8'));
if (!htmlByPage.get('devis.html').includes('data-whatsapp-form="devis"')) errors.push('Missing WhatsApp quote form');
if (htmlByPage.get('devis.html').includes('formsubmit.co')) errors.push('Unexpected email submission service');
for (const page of ['contact.html', 'devis.html']) {
  if (!htmlByPage.get(page).includes(`${location.latitude}, ${location.longitude}`)) errors.push(`${page}: GPS missing`);
  if (!htmlByPage.get(page).includes(`cid=${location.mapsCid}`)) errors.push(`${page}: wrong map`);
}
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log(`OK: ${pages.length} pages, local links and anchors, ${assets.length} assets, ${projects.length} projects, shared contact data, valid JavaScript.`);
