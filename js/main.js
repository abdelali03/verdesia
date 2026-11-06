/* Plain JavaScript: navigation, project gallery, lightbox and testimonials. */
(() => {
  'use strict';
  const $ = (selector, root = document) => root?.querySelector(selector) || null;
  const $$ = (selector, root = document) => [...(root?.querySelectorAll(selector) || [])];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const menu = $('#menu-mobile');
  const burger = $('#burger');
  const photo = $('#photo-dialog');
  const contact = $('#contact-dialog');
  const info = $('#info-dialog');
  const dialogs = [menu, photo, contact, info, $('#request-dialog')].filter(Boolean);

  function syncModalState() {
    document.documentElement.classList.toggle('modal-open', dialogs.some(dialog => dialog.open));
    burger.setAttribute('aria-expanded', String(menu.open));
  }
  function openDialog(dialog) {
    dialogs.forEach(other => { if (other !== dialog && other.open) other.close(); });
    if (!dialog.open) dialog.showModal();
    syncModalState();
  }
  dialogs.forEach(dialog => {
    dialog.addEventListener('close', syncModalState);
    dialog.addEventListener('click', event => {
      if (event.target !== dialog || dialog === photo) return;
      const rect = dialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
    });
  });
  burger.addEventListener('click', () => openDialog(menu));
  $('.fermer', menu).addEventListener('click', () => menu.close());
  $$('.dialog-close').forEach(button => button.addEventListener('click', () => button.closest('dialog').close()));
  $$('nav a', menu).forEach(link => link.addEventListener('click', () => menu.close()));
  $$('a[href="#contact"]').forEach(link => link.addEventListener('click', event => {
    event.preventDefault();
    openDialog(contact);
  }));
  const hero = $('.hero-visuel');
  const header = $('#header');
  function updateHeader() {
    const transparent = hero ? hero.getBoundingClientRect().bottom > header.getBoundingClientRect().bottom : false;
    document.body.classList.toggle('header-transparent', transparent);
    document.body.classList.toggle('header-blanc', !transparent);
  }
  let scrollQueued = false;
  window.addEventListener('scroll', () => {
    if (scrollQueued) return;
    scrollQueued = true;
    requestAnimationFrame(() => { updateHeader(); scrollQueued = false; });
  }, { passive: true });
  window.addEventListener('resize', updateHeader);
  updateHeader();

  // Original tab semantics are retained so the tabs work with pointer and keyboard.
  const gallery = $('.bloc-galerie');
  const tabs = $$('[role="tab"]', gallery);
  function selectTab(tab, focus = false) {
    tabs.forEach(item => {
      const selected = item === tab;
      item.setAttribute('aria-selected', String(selected));
      item.tabIndex = selected ? 0 : -1;
      document.getElementById(item.getAttribute('aria-controls')).hidden = !selected;
    });
    if (focus) tab.focus();
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectTab(tab));
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next !== undefined) { event.preventDefault(); selectTab(tabs[next], true); }
    });
  });
  selectTab(tabs[0]);

  let photoLinks = [];
  let photoIndex = 0;
  function showPhoto(index) {
    photoIndex = (index + photoLinks.length) % photoLinks.length;
    const link = photoLinks[photoIndex];
    const originalImage = $('img', link);
    $('figure img', photo).src = link.href;
    $('figure img', photo).alt = originalImage?.alt || 'Réalisation paysagère';
    $('figcaption', photo).textContent = originalImage?.alt || '';
    $('.photo-counter', photo).textContent = `${photoIndex + 1} / ${photoLinks.length}`;
    $('.photo-prev', photo).hidden = photoLinks.length < 2;
    $('.photo-next', photo).hidden = photoLinks.length < 2;
  }
  $$('a.lightbox').forEach(link => link.addEventListener('click', event => {
    event.preventDefault();
    photoLinks = $$('a.lightbox', link.closest('[role="tabpanel"], .project-carousel'));
    showPhoto(photoLinks.indexOf(link));
    openDialog(photo);
  }));
  $('.photo-close', photo).addEventListener('click', () => photo.close());
  $('.photo-prev', photo).addEventListener('click', () => showPhoto(photoIndex - 1));
  $('.photo-next', photo).addEventListener('click', () => showPhoto(photoIndex + 1));
  photo.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight') { event.preventDefault(); showPhoto(photoIndex + 1); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); showPhoto(photoIndex - 1); }
  });
  photo.addEventListener('click', event => {
    if (event.target === $('figure', photo)) photo.close();
  });
  let touchStartX = null;
  photo.addEventListener('touchstart', event => { touchStartX = event.changedTouches[0].clientX; }, { passive: true });
  photo.addEventListener('touchend', event => {
    if (touchStartX === null) return;
    const distance = event.changedTouches[0].clientX - touchStartX;
    if (Math.abs(distance) > 60) showPhoto(photoIndex + (distance < 0 ? 1 : -1));
    touchStartX = null;
  }, { passive: true });

  if ($('.bloc-temoignages .carrousel')) {
  const carousel = $('.bloc-temoignages .carrousel');
  const track = $('.elements', carousel);
  const slides = $$('.element', track);
  const pagination = $('.pagination', carousel);
  const previous = $('.precedent', carousel);
  const next = $('.suivant', carousel);
  let activeSlide = 0;
  let autoplay = null;
  let visible = false;
  let hovering = false;
  let focused = false;
  const bullets = slides.map((slide, index) => {
    slide.id = `temoignage-${index + 1}`;
    const item = document.createElement('li');
    const button = document.createElement('button');
    button.type = 'button';
    button.setAttribute('aria-label', `Témoignage ${index + 1}`);
    button.setAttribute('aria-controls', slide.id);
    button.addEventListener('click', () => { goToSlide(index); restartAutoplay(); });
    item.append(button); pagination.append(item);
    return button;
  });
  track.setAttribute('aria-label', 'Témoignages clients');
  track.tabIndex = 0;
  function updatePagination(index) {
    activeSlide = index;
    bullets.forEach((bullet, i) => bullet.setAttribute('aria-current', String(i === index)));
    previous.disabled = index === 0;
    next.disabled = index === slides.length - 1;
  }
  function goToSlide(index, smooth = true) {
    index = Math.max(0, Math.min(slides.length - 1, index));
    track.scrollTo({ left: slides[index].offsetLeft - slides[0].offsetLeft, behavior: smooth && !reducedMotion.matches ? 'smooth' : 'instant' });
    updatePagination(index);
  }
  previous.addEventListener('click', () => { goToSlide(activeSlide - 1); restartAutoplay(); });
  next.addEventListener('click', () => { goToSlide(activeSlide + 1); restartAutoplay(); });
  let trackQueued = false;
  track.addEventListener('scroll', () => {
    if (trackQueued) return;
    trackQueued = true;
    requestAnimationFrame(() => {
      const step = slides[1].offsetLeft - slides[0].offsetLeft;
      if (step) updatePagination(Math.max(0, Math.min(slides.length - 1, Math.round(track.scrollLeft / step))));
      trackQueued = false;
    });
  }, { passive: true });
  track.addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    goToSlide(activeSlide + (event.key === 'ArrowRight' ? 1 : -1));
    restartAutoplay();
  });
  function restartAutoplay() {
    clearInterval(autoplay);
    if (!visible || hovering || focused || document.hidden || reducedMotion.matches) return;
    autoplay = setInterval(() => goToSlide((activeSlide + 1) % slides.length), 6500);
  }
  carousel.addEventListener('mouseenter', () => { hovering = true; restartAutoplay(); });
  carousel.addEventListener('mouseleave', () => { hovering = false; restartAutoplay(); });
  carousel.addEventListener('focusin', () => { focused = true; restartAutoplay(); });
  carousel.addEventListener('focusout', event => { focused = carousel.contains(event.relatedTarget); restartAutoplay(); });
  track.addEventListener('pointerdown', () => clearInterval(autoplay));
  track.addEventListener('pointerup', restartAutoplay);
  document.addEventListener('visibilitychange', restartAutoplay);
  reducedMotion.addEventListener('change', restartAutoplay);
  new IntersectionObserver(entries => { visible = entries[0].isIntersecting; restartAutoplay(); }, { threshold: .5 }).observe(carousel);
  new ResizeObserver(() => goToSlide(activeSlide, false)).observe(track);
  updatePagination(0);
  }

  $$('[data-info]').forEach(button => button.addEventListener('click', () => {
    const privacy = button.dataset.info === 'privacy';
    $('#info-title').textContent = privacy ? 'Confidentialité' : 'Mentions légales';
    $('#info-text').textContent = privacy
      ? 'Les formulaires préparent un message dans votre navigateur, sans conserver vos coordonnées sur ce site. Vous choisissez ensuite de le transmettre sur WhatsApp. La carte Google Maps et les liens vers Facebook, Instagram et WhatsApp font appel à des services externes soumis à leurs propres règles de confidentialité.'
      : 'Pépinière Greenouala Bouskoura — Verdesia. Ouled Malek Hamri, Bouskoura 27820, Maroc. Téléphone : +212 660 273737. Les informations juridiques complètes de l’éditeur et de l’hébergeur seront ajoutées avant la publication définitive.';
    openDialog(info);
  }));
})();
