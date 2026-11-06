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

  const projectCarousels = [];
  const visibility = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const control = projectCarousels.find(item => item.element === entry.target);
      if (control) control.setVisible(entry.isIntersecting);
    });
  }, { threshold: .4 });
  $$('[data-carousel]').forEach((element, carouselIndex) => {
    const track = $('.project-track', element);
    const slides = $$('.project-slide', element);
    const pagination = $('.project-pagination', element);
    const previous = $('.project-prev', element);
    const next = $('.project-next', element);
    let active = 0;
    let visible = false;
    let paused = false;
    let timer = null;
    let scrolling = false;
    slides.forEach((slide, index) => { slide.id = `project-${carouselIndex + 1}-photo-${index + 1}`; });
    const buttons = slides.map((slide, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.setAttribute('aria-label', `Photo ${index + 1} sur ${slides.length}`);
      button.setAttribute('aria-controls', slide.id);
      button.addEventListener('click', () => { goTo(index); restart(); });
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
    function restart() {
      clearInterval(timer);
      if (!visible || paused || document.hidden || reducedMotion.matches || document.querySelector('dialog[open]') || element.closest('[hidden]')) return;
      timer = setInterval(() => goTo(active + 1), 5000);
    }
    previous.addEventListener('click', () => { goTo(active - 1); restart(); });
    next.addEventListener('click', () => { goTo(active + 1); restart(); });
    track.addEventListener('keydown', event => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      goTo(event.key === 'Home' ? 0 : event.key === 'End' ? slides.length - 1 : active + (event.key === 'ArrowRight' ? 1 : -1));
      restart();
    });
    track.addEventListener('scroll', () => {
      if (scrolling) return;
      scrolling = true;
      requestAnimationFrame(() => {
        if (track.clientWidth) update(Math.max(0, Math.min(slides.length - 1, Math.round(track.scrollLeft / track.clientWidth))));
        scrolling = false;
      });
    }, { passive: true });
    element.addEventListener('mouseenter', () => { paused = true; restart(); });
    element.addEventListener('mouseleave', () => { paused = element.contains(document.activeElement); restart(); });
    element.addEventListener('focusin', () => { paused = true; restart(); });
    element.addEventListener('focusout', event => { paused = element.contains(event.relatedTarget); restart(); });
    track.addEventListener('pointerdown', () => { paused = true; restart(); });
    track.addEventListener('pointerup', () => { paused = element.matches(':hover') || element.contains(document.activeElement); restart(); });
    document.addEventListener('visibilitychange', restart);
    reducedMotion.addEventListener('change', restart);
    $$('dialog').forEach(dialog => { dialog.addEventListener('close', restart); dialog.addEventListener('toggle', restart); });
    new ResizeObserver(() => { if (track.clientWidth) goTo(active, false); }).observe(track);
    const control = { element, setVisible(value) { visible = value; restart(); }, reset() { goTo(0, false); restart(); } };
    projectCarousels.push(control);
    visibility.observe(element);
    update(0);
  });
  const fieldNames = {
    type_client: 'Vous êtes', societe: 'Société', civilite: 'Civilité', nom: 'Nom', prenom: 'Prénom',
    adresse: 'Adresse', code_postal: 'Code postal', ville: 'Ville', email: 'Email', telephone: 'Téléphone',
    service: 'Service souhaité', objet: 'Sujet', demande: 'Votre demande',
  };
  $$('[data-whatsapp-form], [data-email-form]').forEach(form => {
    const clientType = $('[name="type_client"]', form);
    const company = $('.element-societe', form);
    function updateCompany() {
      if (!company) return;
      const required = Boolean(clientType.value && clientType.value !== 'particulier');
      company.hidden = !required;
      const input = $('input', company);
      input.disabled = !required;
      input.required = required;
    }
    clientType?.addEventListener('change', updateCompany);
    updateCompany();
    const antiSpam = $('[name="anti_spam"]', form);
    antiSpam?.addEventListener('input', () => antiSpam.setCustomValidity(antiSpam.value && Number(antiSpam.value) !== 12 ? 'Vérifiez le résultat de l’opération.' : ''));
    form.addEventListener('submit', event => {
      if (antiSpam) antiSpam.setCustomValidity(Number(antiSpam.value) !== 12 ? 'Vérifiez le résultat de l’opération.' : '');
      if (!form.reportValidity()) {
        event.preventDefault();
        return;
      }
      // Email quotes use the form's native POST to the configured mail service.
      if (form.hasAttribute('data-email-form')) return;
      event.preventDefault();
      const lines = [form.dataset.whatsappForm === 'devis' ? 'Bonjour Verdesia, je souhaite demander un devis.' : 'Bonjour Verdesia, je souhaite vous contacter.', ''];
      const data = new FormData(form);
      Object.entries(fieldNames).forEach(([key, label]) => {
        const value = data.get(key);
        if (!value || !String(value).trim()) return;
        const select = form.elements.namedItem(key);
        const displayed = select?.tagName === 'SELECT' ? select.selectedOptions[0].textContent.trim() : String(value).trim();
        lines.push(`${label} : ${displayed}`);
      });
      if (data.has('newsletter[]')) lines.push('Je souhaite recevoir vos actualités.');
      const message = lines.join('\n');
      $('#request-summary').textContent = message;
      $('#request-send').href = `https://wa.me/${document.body.dataset.whatsapp}?text=${encodeURIComponent(message)}`;
      $('#request-dialog').showModal();
      document.documentElement.classList.add('modal-open');
    });
  });
})();
