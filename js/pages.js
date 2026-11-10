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
    const addPhotos = $('[data-add-photos]', form);
    const photoStatus = $('#photo-status', form);
    const deliveryStatus = $('.form-delivery-status', form);
    let selectedPhotos = [];
    let previewUrls = [];
    function renderPhotos() {
      previewUrls.forEach(url => URL.revokeObjectURL(url));
      previewUrls = [];
      preview.replaceChildren();
      preview.hidden = !selectedPhotos.length;
      addPhotos.hidden = !selectedPhotos.length;
      selectedPhotos.forEach(file => {
        const figure = document.createElement('figure');
        const image = document.createElement('img');
        const caption = document.createElement('figcaption');
        const remove = document.createElement('button');
        const url = URL.createObjectURL(file);
        previewUrls.push(url);
        image.src = url;
        image.alt = `Photo de votre jardin : ${file.name}`;
        caption.textContent = file.name;
        remove.type = 'button';
        remove.className = 'text-link';
        remove.textContent = 'Retirer';
        remove.setAttribute('aria-label', `Retirer ${file.name}`);
        remove.addEventListener('click', () => {
          selectedPhotos = selectedPhotos.filter(photo => photo !== file);
          renderPhotos();
          photoStatus.textContent = selectedPhotos.length ? `${selectedPhotos.length} photo(s) sélectionnée(s).` : 'Aucune photo sélectionnée.';
          deliveryStatus.textContent = '';
        });
        figure.append(image, caption, remove);
        preview.append(figure);
      });
    }
    input?.addEventListener('change', () => {
      const rejected = [];
      for (const file of input.files) {
        if (!file.type.startsWith('image/') || file.size > 10 * 1024 * 1024) { rejected.push(file.name); continue; }
        if (!selectedPhotos.some(photo => photo.name === file.name && photo.size === file.size && photo.lastModified === file.lastModified)) selectedPhotos.push(file);
      }
      input.value = '';
      renderPhotos();
      photoStatus.textContent = `${selectedPhotos.length} photo(s) sélectionnée(s).${rejected.length ? ` Fichiers non ajoutés : ${rejected.join(', ')}. Choisissez des images de 10 Mo maximum chacune.` : ''}`;
      deliveryStatus.textContent = '';
    });
    addPhotos?.addEventListener('click', () => input.click());
    form.addEventListener('reset', () => {
      selectedPhotos = [];
      if (preview) renderPhotos();
      if (photoStatus) photoStatus.textContent = '';
      if (deliveryStatus) deliveryStatus.textContent = '';
    });
    form.addEventListener('submit', async event => {
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
      const whatsappUrl = `https://wa.me/${document.body.dataset.whatsapp}?text=${encodeURIComponent(message)}`;
      if (form.dataset.whatsappForm === 'devis') {
        deliveryStatus.textContent = '';
        if (selectedPhotos.length) {
          const files = [...selectedPhotos];
          let canShare = false;
          try { canShare = typeof navigator.canShare === 'function' && navigator.canShare({ files }); } catch {}
          if (canShare && typeof navigator.share === 'function') {
            try { await navigator.share({ text: message, files }); }
            catch (error) {
              if (error.name !== 'AbortError') deliveryStatus.textContent = 'Le partage n’a pas pu s’ouvrir. Vos photos sont conservées : réessayez depuis ce bouton.';
            }
            return;
          }
          deliveryStatus.textContent = 'Votre navigateur ne permet pas de transmettre les photos à WhatsApp. Elles ne sont pas envoyées. Utilisez un appareil proposant le partage de fichiers, ou joignez-les dans WhatsApp après ouverture du message.';
        }
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
        return;
      }
      $('#request-summary').textContent = message;
      $('#request-send').href = whatsappUrl;
      $('#request-dialog').showModal();
      document.documentElement.classList.add('modal-open');
    });
  });
})();
