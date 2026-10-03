/* ==========================================================================
   CHARLES — PORTFOLIO SCRIPT
   All interactivity: theme toggle, loader, nav, canvas network background,
   typing effect, counters, skill bars, project filter, scroll reveal,
   scroll-to-top, custom cursor, contact form.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------
     1. LOADING SCREEN
     ------------------------------------------------------------------ */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('hidden'), 400);
  });

  /* ------------------------------------------------------------------
     2. THEME TOGGLE (persisted, with safe fallback if storage blocked)
     ------------------------------------------------------------------ */
  const themeToggle = document.getElementById('theme-toggle');
  const root = document.documentElement;

  function saveTheme(value){
    try{ localStorage.setItem('theme', value); }
    catch(e){ /* storage unavailable — theme just won't persist this session */ }
  }

  themeToggle.addEventListener('click', () => {
    const current = root.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    saveTheme(next);
  });

  /* ------------------------------------------------------------------
     3. STICKY NAV + ACTIVE LINK HIGHLIGHTING
     ------------------------------------------------------------------ */
  const header = document.getElementById('site-header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
  });

  const sections = document.querySelectorAll('main section[id]');
  const navItems = document.querySelectorAll('.nav-link');
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        navItems.forEach(item => item.classList.remove('active'));
        const activeLinks = document.querySelectorAll(`.nav-link[href="#${entry.target.id}"]`);
        activeLinks.forEach(link => link.classList.add('active'));
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach(section => navObserver.observe(section));

  /* ------------------------------------------------------------------
     4. TYPING ANIMATION (rotating roles)
     ------------------------------------------------------------------ */
  const roles = ['Web Developer'];
  const typedEl = document.getElementById('typed-role');
  let roleIndex = 0, charIndex = 0, deleting = false;

  function typeLoop(){
    const current = roles[roleIndex];
    if(!deleting){
      charIndex++;
      typedEl.textContent = current.slice(0, charIndex);
      if(charIndex === current.length){
        deleting = true;
        setTimeout(typeLoop, 1400);
        return;
      }
    } else {
      charIndex--;
      typedEl.textContent = current.slice(0, charIndex);
      if(charIndex === 0){
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
      }
    }
    setTimeout(typeLoop, deleting ? 40 : 80);
  }

  if(prefersReducedMotion){
    typedEl.textContent = roles[0];
  } else {
    typeLoop();
  }

  /* ------------------------------------------------------------------
     5. HERO CANVAS — NETWORK / NODE BACKGROUND
     ------------------------------------------------------------------ */
  const canvas = document.getElementById('hero-canvas');
  const ctx = canvas.getContext('2d');
  let nodes = [];
  let mouse = { x: null, y: null };

  function resizeCanvas(){
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;
  }

  function createNodes(){
    const count = Math.min(70, Math.floor((canvas.width * canvas.height) / 18000));
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3
    }));
  }

  function drawNetwork(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const linkDist = 140;

    nodes.forEach(node => {
      node.x += node.vx;
      node.y += node.vy;
      if(node.x < 0 || node.x > canvas.width) node.vx *= -1;
      if(node.y < 0 || node.y > canvas.height) node.vy *= -1;
    });

    for(let i = 0; i < nodes.length; i++){
      for(let j = i + 1; j < nodes.length; j++){
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if(dist < linkDist){
          ctx.strokeStyle = `rgba(120,130,255,${1 - dist / linkDist})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
      ctx.fillStyle = 'rgba(168,133,255,0.9)';
      ctx.beginPath();
      ctx.arc(nodes[i].x, nodes[i].y, 1.8, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(drawNetwork);
  }

  if(canvas){
    resizeCanvas();
    createNodes();
    if(!prefersReducedMotion){
      drawNetwork();
    } else {
      // draw a single static frame for reduced-motion users
      ctx.clearRect(0,0,canvas.width,canvas.height);
      nodes.forEach(n => {
        ctx.fillStyle = 'rgba(168,133,255,0.9)';
        ctx.beginPath();
        ctx.arc(n.x, n.y, 1.8, 0, Math.PI*2);
        ctx.fill();
      });
    }
    window.addEventListener('resize', () => {
      resizeCanvas();
      createNodes();
    });
  }

  /* ------------------------------------------------------------------
     6. SCROLL REVEAL
     ------------------------------------------------------------------ */
  const revealItems = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealItems.forEach(item => revealObserver.observe(item));

  /* ------------------------------------------------------------------
     7. ANIMATED COUNTERS
     ------------------------------------------------------------------ */
  const counters = document.querySelectorAll('.stat-number');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-count'), 10);
        let current = 0;
        const duration = 1400;
        const stepTime = 16;
        const steps = duration / stepTime;
        const increment = target / steps;

        const timer = setInterval(() => {
          current += increment;
          if(current >= target){
            el.textContent = target;
            clearInterval(timer);
          } else {
            el.textContent = Math.floor(current);
          }
        }, stepTime);

        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.4 });
  counters.forEach(counter => counterObserver.observe(counter));

  /* ------------------------------------------------------------------
     8. SKILL BAR FILL ON SCROLL
     ------------------------------------------------------------------ */
  const skillBars = document.querySelectorAll('.skill-bar');
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        const pct = entry.target.getAttribute('data-skill');
        entry.target.querySelector('.skill-fill').style.width = pct + '%';
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.01 });
  skillBars.forEach(bar => skillObserver.observe(bar));

  /* ------------------------------------------------------------------
     9. PROJECT FILTERING
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
     10. SCROLL TO TOP BUTTON
     ------------------------------------------------------------------ */
  const scrollTopBtn = document.getElementById('scroll-top');
  window.addEventListener('scroll', () => {
    scrollTopBtn.classList.toggle('visible', window.scrollY > 500);
  });
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  });

  /* ------------------------------------------------------------------
     11. CUSTOM CURSOR
     ------------------------------------------------------------------ */
  const cursorDot = document.getElementById('cursor-dot');
  const cursorRing = document.getElementById('cursor-ring');
  if(window.matchMedia('(pointer:fine)').matches){
    window.addEventListener('mousemove', (e) => {
      cursorDot.style.left = e.clientX + 'px';
      cursorDot.style.top = e.clientY + 'px';
      cursorRing.style.left = e.clientX + 'px';
      cursorRing.style.top = e.clientY + 'px';
    });
    document.querySelectorAll('a, button').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursorRing.style.width = '50px';
        cursorRing.style.height = '50px';
        cursorRing.style.opacity = '0.35';
      });
      el.addEventListener('mouseleave', () => {
        cursorRing.style.width = '34px';
        cursorRing.style.height = '34px';
        cursorRing.style.opacity = '0.6';
      });
    });
  }

  /* ------------------------------------------------------------------
     12. CONTACT FORM (front-end only — needs a backend/service attached)
     ------------------------------------------------------------------ */
  const form = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    // TODO: replace this with a real submission — e.g. fetch() to your
    // API route, or a service like Formspree / EmailJS.
    formStatus.textContent = "Thanks! This form isn't connected to a backend yet — wire it up to Formspree, EmailJS, or your own API route.";
    form.reset();
  });

  /* ------------------------------------------------------------------
     13. FOOTER YEAR
     ------------------------------------------------------------------ */
  document.getElementById('year').textContent = new Date().getFullYear();

});