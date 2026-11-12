/* Functional regressions against the actual built scripts, without transmitting messages. */
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
async function environment(filename) {
  const { parseHTML } = await import('linkedom');
  const { window } = parseHTML(fs.readFileSync(path.join(root, 'dist', filename), 'utf8'));
  const { document } = window;
  const opened = [], shared = [], revoked = [], observers = [];
  const storage = new Map();
  const location = { href: 'https://verdesia.ma/' + (filename === 'index.html' ? '' : filename) };
  const win = { document, location, scrollY: 0, addEventListener() {}, scrollTo() {}, matchMedia: () => ({ matches: false, addEventListener() {} }), open: (...args) => opened.push(args) };
  for (const element of document.querySelectorAll('*')) {
    element.getBoundingClientRect = () => ({ top: 0, left: 0, right: 700, bottom: element.id === 'header' ? 100 : 500, width: 700, height: 400 });
    element.scrollTo = options => { element.scrollLeft = options.left || 0; };
    if (element.localName === 'video') {
      element.paused = true; element.play = async () => { element.paused = false; }; element.pause = () => { element.paused = true; }; element.load = () => {};
    }
    if (element.localName === 'dialog') {
      element.open = false;
      element.showModal = () => { element.open = true; element.setAttribute('open', ''); element.dispatchEvent(new window.Event('toggle')); };
      element.close = () => { element.open = false; element.removeAttribute('open'); element.dispatchEvent(new window.Event('close')); };
    }
    if (element.localName === 'form') {
      element.reportValidity = () => true;
      element.elements = { namedItem: name => element.querySelector(`[name="${name}"]`) };
    }
    if (element.localName === 'select') Object.defineProperty(element, 'selectedOptions', { get: () => [element.querySelector('option[selected]') || element.querySelector('option')] });
  }
  const context = {
    window: win, document, location, URL: class extends URL { static createObjectURL(file) { return 'blob:' + file.name; } static revokeObjectURL(url) { revoked.push(url); } },
    history: { replaceState: (_, __, url) => { location.href = String(url); } },
    localStorage: { getItem: key => storage.get(key), setItem: (key, value) => storage.set(key, value) },
    navigator: { canShare: () => true, share: async data => { shared.push(data); } },
    NodeFilter: { SHOW_ELEMENT: 1, SHOW_TEXT: 4 }, Event: window.Event,
    MutationObserver: class { observe() {} }, ResizeObserver: class { observe() {} },
    IntersectionObserver: class { constructor(callback) { this.callback = callback; this.elements = []; observers.push(this); } observe(element) { this.elements.push(element); } },
    requestAnimationFrame: callback => callback(), setTimeout: () => 1, clearTimeout() {},
    FormData: class { constructor(form) { this.form = form; } get(name) { const field = this.form.querySelector(`[name="${name}"]`); return field?.localName === 'select' ? field.selectedOptions[0].getAttribute('value') || field.selectedOptions[0].textContent : field?.value; } },
  };
  vm.createContext(context);
  for (const script of document.querySelectorAll('script[src]')) vm.runInContext(fs.readFileSync(path.join(root, 'dist', script.getAttribute('src')), 'utf8'), context, { filename: script.getAttribute('src') });
  document.dispatchEvent(new window.Event('DOMContentLoaded'));
  const click = element => element.dispatchEvent(new window.Event('click', { bubbles: true, cancelable: true }));
  const change = element => element.dispatchEvent(new window.Event('change', { bubbles: true }));
  const submit = async form => { form.dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true })); await new Promise(resolve => setImmediate(resolve)); };
  return { window, context, document, click, change, submit, opened, shared, revoked, observers, location, storage };
}
async function main() {
  for (const filename of ['index.html', 'ar/index.html', 'amenager-mon-jardin.html', 'ar/amenager-mon-jardin.html', 'realisations.html', 'ar/realisations.html', 'devis.html', 'ar/devis.html', 'contact.html', 'ar/contact.html']) {
    const env = await environment(filename);
    const { document: doc, click } = env;
    const originalLanguage = doc.documentElement.lang;
    const bodyCopy = doc.body.textContent.replace(/\s+/g, ' ').trim();
    click(doc.querySelector('[data-language-toggle]'));
    assert.notEqual(doc.documentElement.lang, originalLanguage, `${filename}: language switch`);
    assert.equal(doc.documentElement.dir, originalLanguage === 'fr' ? 'rtl' : 'ltr');
    assert(new URL(env.location.href).pathname.startsWith(doc.documentElement.lang === 'fr' ? '/' : '/ar/'));
    click(doc.querySelector('[data-language-toggle]'));
    assert.equal(doc.documentElement.lang, originalLanguage);
    // Runtime-generated carousel/status labels are excluded from static text round-trip checks.
    for (const heading of doc.querySelectorAll('main h1,main h2,main h3')) assert(heading.textContent.trim());
    assert.equal(doc.body.textContent.replace(/\s+/g, ' ').trim(), bodyCopy, `${filename}: copy after FR/AR round trip`);
    click(doc.querySelector('#burger')); assert(doc.querySelector('#menu-mobile').open);
    click(doc.querySelector('#menu-mobile .fermer')); assert(!doc.querySelector('#menu-mobile').open);
    click(doc.querySelector('[data-info="privacy"]')); assert(doc.querySelector('#info-dialog').open);
    doc.querySelector('#info-dialog').close();
  }
  for (const filename of ['devis.html', 'ar/devis.html']) {
    const env = await environment(filename); const doc = env.document;
    const form = doc.querySelector('#quote-form'), input = doc.querySelector('input[type="file"]');
    doc.querySelector('[name="nom"]').value = 'Test client';
    doc.querySelector('[name="ville"]').value = 'Casablanca';
    doc.querySelector('[name="telephone"]').value = '0600000000';
    doc.querySelector('option[value="plantation"]').setAttribute('selected', '');
    const photo = name => ({ name, type: 'image/jpeg', size: 100, lastModified: 1 });
    const a = photo('a.jpg'), b = photo('b.jpg'), c = photo('c.jpg');
    input.files = [a, b]; env.change(input);
    input.files = [b, c]; env.change(input);
    assert.equal(doc.querySelectorAll('.garden-photo-preview figure').length, 3);
    env.click(doc.querySelector('.garden-photo-preview button'));
    assert.equal(doc.querySelectorAll('.garden-photo-preview figure').length, 2);
    const previews = [...doc.querySelectorAll('.garden-photo-preview img')].map(img => img.src);
    env.click(doc.querySelector('[data-language-toggle]'));
    assert.equal(doc.querySelector('[name="nom"]').value, 'Test client');
    assert.deepEqual([...doc.querySelectorAll('.garden-photo-preview img')].map(img => img.src), previews);
    await env.submit(form);
    assert.equal(env.shared.length, 1);
    assert.equal(env.shared[0].files.map(file => file.name).join(','), 'b.jpg,c.jpg');
    assert(env.shared[0].text.includes('Test client'));
    assert.equal(doc.querySelector('#request-dialog').open, false, 'No extra quote confirmation');
    assert.equal(env.opened.length, 0);
    doc.querySelectorAll('.garden-photo-preview button').forEach(button => env.click(button));
    await env.submit(form); assert.equal(env.opened.length, 1);
    assert(env.opened[0][0].startsWith('https://wa.me/212660273737?text='));
  }
  const portfolio = await environment('realisations.html');
  const media = portfolio.document.querySelectorAll('.lightbox');
  portfolio.click(media[0]); assert(portfolio.document.querySelector('#photo-dialog').open);
  assert(portfolio.document.querySelector('#photo-dialog figure img').src.startsWith('/assets/images/'));
  portfolio.document.querySelector('#photo-dialog').close();
  portfolio.click(portfolio.document.querySelector('[data-media-type="video"]'));
  assert.equal(portfolio.document.querySelector('#photo-dialog figure video').hidden, false);
  assert.equal(portfolio.document.querySelector('#photo-dialog figure video').paused, false);
  portfolio.document.querySelector('#photo-dialog').close();
  assert.equal(portfolio.document.querySelector('#photo-dialog figure video').paused, true);
  console.log('OK: built scripts on all 10 pages; FR/AR round trips; menu/dialogs; quote fields and photos preserved; accumulated uploads/removal; direct WhatsApp sharing; photo/video lightbox. No messages sent.');
}
main().catch(error => { console.error(error.stack); process.exitCode = 1; });
