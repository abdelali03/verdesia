/* Verify real page copy coverage and in-place switching without a browser dependency. */
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const source = fs.readFileSync('js/i18n.js', 'utf8');
const pages = ['index.html', 'amenager-mon-jardin.html', 'realisations.html', 'devis.html', 'contact.html'];
const listeners = {};
let mutationCallback;
const storage = new Map();
const element = (tag, attributes = {}, parent = null) => ({
  nodeType: 1, tag, attributes, parentElement: parent,
  getAttribute(name) { return this.attributes[name] ?? null; },
  hasAttribute(name) { return name in this.attributes; },
  setAttribute(name, value) { this.attributes[name] = String(value); },
  closest(selector) { return selector.includes('[data-no-translate]') && this.attributes['data-no-translate'] !== undefined ? this : null; },
  matches(selector) { return selector === 'a[href]' && tag === 'a'; },
});
const root = element('html');
const heading = element('h1', {}, root);
const text = { nodeType: 3, parentElement: heading, textContent: '  Création et aménagement de jardins à Bouskoura  ' };
const input = element('input', { placeholder: 'Votre nom' }, root);
input.value = 'Test client';
input.files = [{ name: 'jardin.jpg' }];
const originalFiles = input.files;
const link = element('a', { href: 'devis.html' }, root);
const dynamic = { nodeType: 3, parentElement: heading, textContent: '2 photo(s) sélectionnée(s).' };
const toggle = element('button', { 'data-no-translate': '' }, root);
const classes = {};
toggle.querySelector = selector => ({ classList: { toggle: (_, active) => { classes[selector] = active; } } });
toggle.addEventListener = (name, listener) => { listeners[`toggle:${name}`] = listener; };
const nodes = [heading, text, input, link, dynamic, toggle];
const document = {
  documentElement: root,
  addEventListener: (name, listener) => { listeners[name] = listener; },
  dispatchEvent() {},
  querySelectorAll: () => [toggle],
  createTreeWalker: () => {
    let index = -1;
    return { currentNode: root, nextNode() { index++; this.currentNode = nodes[index]; return Boolean(this.currentNode); } };
  },
};
const context = {
  document, window: {}, URL, location: { href: 'https://example.test/index.html' },
  localStorage: { getItem: key => storage.get(key), setItem: (key, value) => storage.set(key, value) },
  history: { replaceState: (_, __, url) => { context.location.href = String(url); } },
  NodeFilter: { SHOW_ELEMENT: 1, SHOW_TEXT: 4 }, Event: class {},
  MutationObserver: class { constructor(callback) { mutationCallback = callback; } observe() {} },
};
vm.runInNewContext(source, context, { filename: 'js/i18n.js' });
listeners.DOMContentLoaded();
assert.equal(root.lang, 'fr');
listeners['toggle:click']();
const { t } = context.window.verdesiaI18n;
assert.equal(root.lang, 'ar-MA');
assert.equal(root.dir, 'rtl');
assert.match(text.textContent, /كنصممو/);
assert.match(input.attributes.placeholder, /السمية/);
assert.equal(input.value, 'Test client');
assert.equal(input.files, originalFiles);
assert.equal(storage.get('verdesia-language'), 'ar');
assert.equal(link.attributes.href, 'devis.html?lang=ar');
assert.equal(toggle.attributes['aria-pressed'], 'true');
assert.equal(classes['[lang="ar-MA"]'], true);
dynamic.textContent = '3 photo(s) sélectionnée(s).';
mutationCallback([{ type: 'characterData', target: dynamic }]);
assert.equal(dynamic.textContent, '3 تصاور مختارة.');
for (const copy of ['Bonjour Verdesia, je souhaite demander un devis.', 'Type de projet', 'Plantation de végétaux']) assert.match(t(copy), /[\u0600-\u06ff]/);
const preserve = new Set(['VERDESIA', 'FR', 'Mourad El khaoudi', 'Badr', 'Yassine Elkabbaj', 'Mohammed Magroud', 'Florent Lepora', 'Karim Mankar bennis', 'GPS : 33.4883929, -7.6462018']);
const decode = text => text.replaceAll('&amp;', '&').replaceAll('&#39;', "'").replaceAll('&quot;', '"').replaceAll('&lt;', '<').replaceAll('&gt;', '>');
let checked = 0;
for (const page of pages) {
  const raw = fs.readFileSync(page, 'utf8');
  const html = raw.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, '');
  assert.ok(/data-language-toggle/.test(raw), `${page}: missing language control`);
  assert.ok(/src="js\/i18n.js"/.test(raw), `${page}: missing translation script`);
  assert.ok(/href="css\/i18n.css"/.test(raw), `${page}: missing RTL styles`);
  for (const token of html.split(/(<[^>]+>)/)) {
    const values = token.startsWith('<') ? [...token.matchAll(/(?:aria-label|aria-roledescription|placeholder|alt|title)="([^"]+)"/g)].map(match => match[1]) : [token.trim()];
    for (const value of values) {
      const clean = decode(value).trim().replace(/\s+/g, ' ');
      if (!clean || !/[a-zA-Z]/.test(clean) || preserve.has(clean)) continue;
      assert.notEqual(t(clean), clean, `${page}: untranslated text: ${clean}`);
      assert.equal(t(t(clean), 'fr'), clean, `${page}: French restoration failed: ${clean}`);
      checked++;
    }
  }
}
listeners['toggle:click']();
assert.equal(root.lang, 'fr');
assert.equal(root.dir, 'ltr');
assert.equal(text.textContent, '  Création et aménagement de jardins à Bouskoura  ');
assert.equal(input.attributes.placeholder, 'Votre nom');
assert.equal(dynamic.textContent, '3 photo(s) sélectionnée(s).');
assert.equal(link.attributes.href, 'devis.html?lang=fr');
assert.equal(input.files, originalFiles);
for (const [query, saved, expected] of [['?lang=ar', 'fr', 'ar'], ['?lang=fr', 'ar', 'fr'], ['', 'ar', 'ar'], ['', null, 'fr'], ['?lang=unknown', 'ar', 'fr']]) {
  const isolated = {
    URL, location: { href: `https://example.test/devis.html${query}` },
    localStorage: { getItem: () => saved },
    document: { documentElement: {}, addEventListener() {} }, window: {},
  };
  vm.runInNewContext(source, isolated);
  assert.equal(isolated.window.verdesiaI18n.language, expected);
  assert.equal(isolated.document.documentElement.dir, expected === 'ar' ? 'rtl' : 'ltr');
}
console.log(`OK: ${checked} page strings/labels translated and reversible; live switch, RTL, persistence, links, dynamic feedback and form data preserved.`);
