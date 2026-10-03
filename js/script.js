/* ==========================================================================
   CHARLES — PORTFOLIO SCRIPT
   Shared across all pages: active nav link, scroll reveal, project filter
   (projects page only), contact form (contact page only), footer year.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ------------------------------------------------------------------
     ACTIVE NAV LINK (based on current file name, since each page is
     its own file rather than a single-page anchor scroll)
     ------------------------------------------------------------------ */
  const currentPage = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link[data-page]').forEach(link => {
    if (link.getAttribute('data-page') === currentPage) {
      link.classList.add('active');
    }
  });

  /* ------------------------------------------------------------------
     SCROLL REVEAL — one simple fade-in, no stagger
     ------------------------------------------------------------------ */
  const revealItems = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealItems.forEach(item => revealObserver.observe(item));

  /* ------------------------------------------------------------------
     PROJECT FILTERING (only present on projects.html)
     ------------------------------------------------------------------ */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const matches = filter === 'all' || card.getAttribute('data-category') === filter;
        card.classList.toggle('hidden', !matches);
      });
    });
  });

  /* ------------------------------------------------------------------
     CONTACT FORM (opens a prefilled WhatsApp message)
     ------------------------------------------------------------------ */
  const form = document.getElementById('contact-form');
  if (form) {
    const formStatus = document.getElementById('form-status');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!form.reportValidity()) return;

      const formData = new FormData(form);
      const message = [
        `Name: ${formData.get('name')}`,
        `Email: ${formData.get('email')}`,
        `Subject: ${formData.get('subject')}`,
        '',
        String(formData.get('message'))
      ].join('\n');
      const whatsappUrl = `https://wa.me/2349128327370?text=${encodeURIComponent(message)}`;
      const whatsappWindow = window.open(whatsappUrl, '_blank');

      formStatus.replaceChildren();
      if (whatsappWindow) {
        whatsappWindow.opener = null;
        formStatus.textContent = 'WhatsApp opened with your message. Review it, then tap Send.';
      } else {
        formStatus.append('Your message is ready. ');
        const whatsappLink = document.createElement('a');
        whatsappLink.href = whatsappUrl;
        whatsappLink.target = '_blank';
        whatsappLink.rel = 'noopener';
        whatsappLink.textContent = 'Open WhatsApp';
        formStatus.append(whatsappLink);
      }
    });
  }

  /* ------------------------------------------------------------------
     FOOTER YEAR
     ------------------------------------------------------------------ */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});
