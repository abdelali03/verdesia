/* Behaviours specific to projects, forms and shared floating controls. */
(() => {
  'use strict';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const backToTop = $('#back-to-top');
  function updateTopButton() { backToTop.hidden = window.scrollY < 400; }
  window.addEventListener('scroll', updateTopButton, { passive: true });
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reducedMotion.matches ? 'instant' : 'smooth' }));
  updateTopButton();

  const videoVisibility = new Map();
  function syncVideos() {
    const blocked = document.hidden || document.querySelector('dialog[open]');
    videoVisibility.forEach((visible, video) => {
      if (visible && !blocked && !reducedMotion.matches) video.play().catch(() => {});
      else video.pause();
    });
  }
  const visibility = new IntersectionObserver(entries => {
    entries.forEach(entry => videoVisibility.set(entry.target, entry.isIntersecting && entry.intersectionRatio >= .6));
    syncVideos();
  }, { threshold: [0, .6] });
  $$('.project-slide video').forEach(video => {
    video.muted = true;
    videoVisibility.set(video, false);
    visibility.observe(video);
  });
  document.addEventListener('visibilitychange', syncVideos);
  reducedMotion.addEventListener('change', syncVideos);
  $$('dialog').forEach(dialog => {
    dialog.addEventListener('close', syncVideos);
    dialog.addEventListener('toggle', syncVideos);
  });
  $$('[data-carousel]').forEach((element, carouselIndex) => {
    const track = $('.project-track', element);
    const slides = $$('.project-slide', element);
    const pagination = $('.project-pagination', element);
    const previous = $('.project-prev', element);
    const next = $('.project-next', element);
    let active = 0;
    let scrolling = false;
    slides.forEach((slide, index) => { slide.id = `project-${carouselIndex + 1}-photo-${index + 1}`; });
    const buttons = slides.map((slide, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.setAttribute('aria-label', `${$('video', slide) ? 'Vidéo' : 'Photo'} ${index + 1} sur ${slides.length}`);
      button.setAttribute('aria-controls', slide.id);
      button.addEventListener('click', () => goTo(index));
      pagination.append(button);
      return button;
    });
    function update(index) {
      active = index;
      buttons.forEach((button, i) => button.setAttribute('aria-current', String(i === index)));
    }
    function goTo(index, smooth = true) {
      index = (index + slides.length) % slides.length;
      track.scrollTo({ left: index * track.clientWidth, behavior: smooth && !reducedMotion.matches ? 'smooth' : 'instant' });
      update(index);
    }
    previous.addEventListener('click', () => goTo(active - 1));
    next.addEventListener('click', () => goTo(active + 1));
    track.addEventListener('keydown', event => {
      if (event.target.tagName === 'VIDEO') return;
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      goTo(event.key === 'Home' ? 0 : event.key === 'End' ? slides.length - 1 : active + (event.key === 'ArrowRight' ? 1 : -1));
    });
    track.addEventListener('scroll', () => {
      if (scrolling) return;
      scrolling = true;
      requestAnimationFrame(() => {
        if (track.clientWidth) update(Math.max(0, Math.min(slides.length - 1, Math.round(track.scrollLeft / track.clientWidth))));
        scrolling = false;
      });
    }, { passive: true });
    new ResizeObserver(() => { if (track.clientWidth) goTo(active, false); }).observe(track);
    update(0);
  });
  const fieldNames = {
    nom: 'Nom', prenom: 'Prénom', ville: 'Ville', email: 'Email', telephone: 'Téléphone',
    service: 'Type de projet', objet: 'Sujet', demande: 'Votre message',
  };
  $$('[data-whatsapp-form]').forEach(form => {
    const input = $('input[type="file"]', form);
    const preview = $('.garden-photo-preview', form);
    let previewUrl;
    function updatePhoto() {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      const file = input.files[0];
      input.setCustomValidity(file && (!file.type.startsWith('image/') || file.size > 10 * 1024 * 1024) ? 'Choisissez une image de moins de 10 Mo.' : '');
      preview.hidden = !file || !input.validity.valid;
      if (!preview.hidden) {
        previewUrl = URL.createObjectURL(file);
        $('img', preview).src = previewUrl;
      } else $('img', preview).removeAttribute('src');
      if (!input.validity.valid) input.reportValidity();
    }
    input?.addEventListener('change', updatePhoto);
    $('[data-remove-photo]', form)?.addEventListener('click', () => { input.value = ''; updatePhoto(); });
    form.addEventListener('submit', event => {
      event.preventDefault();
      if (!form.reportValidity()) {
        return;
      }
      const lines = [form.dataset.whatsappForm === 'devis' ? 'Bonjour Verdesia, je souhaite demander un devis.' : 'Bonjour Verdesia, je souhaite vous contacter.', ''];
      const data = new FormData(form);
      Object.entries(fieldNames).forEach(([key, label]) => {
        const value = data.get(key);
        if (!value || !String(value).trim()) return;
        const select = form.elements.namedItem(key);
        const displayed = select?.tagName === 'SELECT' ? select.selectedOptions[0].textContent.trim() : String(value).trim();
        lines.push(`${label} : ${displayed}`);
      });
      const message = lines.join('\n');
      $('#request-summary').textContent = message;
      $('#request-send').href = `https://wa.me/${document.body.dataset.whatsapp}?text=${encodeURIComponent(message)}`;
      const file = input?.files[0];
      const note = $('#request-photo-note');
      const share = $('#request-share');
      const canShare = file && typeof navigator.canShare === 'function' && navigator.canShare({ files: [file] });
      note.hidden = !file;
      note.textContent = file ? canShare ? `Photo sélectionnée : ${file.name}. Utilisez « Partager avec la photo », puis choisissez WhatsApp et notre contact. Si vous ouvrez WhatsApp avec le bouton ci-dessous, joignez la photo manuellement.` : `Photo sélectionnée : ${file.name}. Après avoir ouvert WhatsApp, joignez cette photo à votre message avec le bouton de pièce jointe.` : '';
      share.hidden = !canShare;
      share.onclick = canShare ? async () => {
        try { await navigator.share({ text: message, files: [file] }); }
        catch (error) {
          if (error.name !== 'AbortError') note.textContent = 'Le partage de la photo n’est pas disponible. Ouvrez WhatsApp ci-dessous et joignez votre photo au message.';
        }
      } : null;
      $('#request-dialog').showModal();
      document.documentElement.classList.add('modal-open');
    });
  });
})();
