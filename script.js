// =========================================================
// M Bhavana — Portfolio Interactions
// =========================================================

const REDUCE_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initMobileNav();
  initActiveSectionTracking();
  initScrollReveal();
  initScrollProgress();
  initContactForm();
  initProjectFilter();
  initHeroParticles();
  initHeroGlow();
  initButtonRipple();
  initTiltCards();
});

/* ---------- Sticky header shadow ---------- */
function initHeaderScroll() {
  const header = document.getElementById('siteHeader');
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 12);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ---------- Mobile hamburger menu ---------- */
function initMobileNav() {
  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('mainNav');
  if (!hamburger || !nav) return;

  hamburger.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  nav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ---------- Active nav-link indicator via IntersectionObserver ---------- */
function initActiveSectionTracking() {
  const links = Array.from(document.querySelectorAll('.nav-link'));
  if (!links.length) return;

  const sections = links
    .map(link => document.getElementById(link.dataset.section))
    .filter(Boolean);

  if (!sections.length) return;

  const setActive = (id) => {
    links.forEach(link => {
      link.classList.toggle('active', link.dataset.section === id);
    });
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setActive(entry.target.id);
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px', threshold: 0 });

  sections.forEach(section => observer.observe(section));
}

/* ---------- Scroll-reveal for elements with .reveal ---------- */
function initScrollReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  // Hero items reveal immediately on load (handled by CSS delays),
  // everything else reveals on scroll into view.
  const heroItems = document.querySelectorAll('.hero .reveal');
  heroItems.forEach(el => el.classList.add('in-view'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // small stagger for siblings entering together
        const delay = Math.min(index * 60, 240);
        setTimeout(() => entry.target.classList.add('in-view'), delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  items.forEach(el => {
    if (!el.closest('.hero')) observer.observe(el);
  });
}

/* ---------- Scroll progress bar ---------- */
function initScrollProgress() {
  const bar = document.getElementById('progressBar');
  if (!bar) return;

  const onScroll = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = progress + '%';
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ---------- Project filter (no page reload, animated show/hide) ---------- */
function initProjectFilter() {
  const buttons = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.project-card');
  if (!buttons.length || !cards.length) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const EXIT_MS = 220;

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      cards.forEach((card, index) => {
        const match = filter === 'all' || card.dataset.category === filter;

        if (match) {
          // Bring matching cards back into the flow, then fade/scale them in.
          card.style.display = '';
          requestAnimationFrame(() => {
            card.classList.remove('is-hidden');
          });
        } else if (reduceMotion) {
          card.style.display = 'none';
        } else {
          // Fade out first, then remove from layout once the transition ends.
          card.classList.add('is-hidden');
          setTimeout(() => {
            if (card.classList.contains('is-hidden')) card.style.display = 'none';
          }, EXIT_MS);
        }
      });
    });
  });
}

/* ---------- Contact form validation ---------- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const fields = {
    name: { el: document.getElementById('name'), error: document.getElementById('nameError') },
    email: { el: document.getElementById('email'), error: document.getElementById('emailError') },
    subject: { el: document.getElementById('subject'), error: document.getElementById('subjectError') },
    message: { el: document.getElementById('message'), error: document.getElementById('messageError') },
  };
  const note = document.getElementById('formNote');

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function validateField(key) {
    const { el, error } = fields[key];
    const value = el.value.trim();
    let message = '';

    if (!value) {
      message = 'This field is required.';
    } else if (key === 'email' && !emailPattern.test(value)) {
      message = 'Please enter a valid email address.';
    } else if (key === 'message' && value.length < 10) {
      message = 'Message should be at least 10 characters.';
    }

    error.textContent = message;
    el.classList.toggle('invalid', Boolean(message));
    return !message;
  }

  Object.keys(fields).forEach(key => {
    const { el } = fields[key];
    el.addEventListener('blur', () => validateField(key));
    el.addEventListener('input', () => {
      if (el.classList.contains('invalid')) validateField(key);
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const results = Object.keys(fields).map(validateField);
    const allValid = results.every(Boolean);

    if (!allValid) {
      note.textContent = 'Please fix the highlighted fields before sending.';
      note.style.color = '#E0503C';
      return;
    }

    // No backend/email service is connected in this static site.
    // We acknowledge the message locally instead of claiming it was sent.
    note.textContent = "Thanks! This form isn't connected to an email service yet — please reach out directly via email or LinkedIn for now.";
    note.style.color = 'var(--primary-dark)';
    form.reset();
  });
}

/* ---------- Hero particle network (canvas) ---------- */
function initHeroParticles() {
  const canvas = document.getElementById('heroParticles');
  const hero = document.getElementById('home');
  if (!canvas || !hero) return;

  // Respect reduced-motion preference: leave a static, empty canvas.
  if (REDUCE_MOTION) return;

  const ctx = canvas.getContext('2d');
  let width, height, dpr;
  let particles = [];
  let mouse = { x: null, y: null, active: false };
  let rafId = null;

  const DENSITY = 12000;     // px^2 per particle — lower = more particles
  const MAX_PARTICLES = 90;
  const LINK_DIST = 130;
  const MOUSE_LINK_DIST = 170;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = hero.clientWidth;
    height = hero.clientHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const count = Math.min(MAX_PARTICLES, Math.round((width * height) / DENSITY));
    particles = Array.from({ length: count }, () => spawnParticle());
  }

  function spawnParticle() {
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.6 + 1,
    };
  }

  function step() {
    ctx.clearRect(0, 0, width, height);

    // Move + draw particles
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < -10) p.x = width + 10;
      if (p.x > width + 10) p.x = -10;
      if (p.y < -10) p.y = height + 10;
      if (p.y > height + 10) p.y = -10;

      // gentle drift toward the cursor
      if (mouse.active) {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 160 && dist > 0.01) {
          p.vx += (dx / dist) * 0.0025;
          p.vy += (dy / dist) * 0.0025;
        }
      }

      // gentle speed cap so drift doesn't accumulate forever
      const speed = Math.hypot(p.vx, p.vy);
      const maxSpeed = 0.6;
      if (speed > maxSpeed) {
        p.vx = (p.vx / speed) * maxSpeed;
        p.vy = (p.vy / speed) * maxSpeed;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(7, 152, 193, 0.55)';
      ctx.fill();
    }

    // Connect nearby particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.hypot(dx, dy);
        if (dist < LINK_DIST) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(37, 182, 220, ${0.18 * (1 - dist / LINK_DIST)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      // Connect particles to the cursor when it's nearby
      if (mouse.active) {
        const dx = particles[i].x - mouse.x, dy = particles[i].y - mouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < MOUSE_LINK_DIST) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(216, 135, 75, ${0.22 * (1 - dist / MOUSE_LINK_DIST)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    rafId = requestAnimationFrame(step);
  }

  function onPointerMove(e) {
    const rect = hero.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    mouse.active = true;
  }

  function onPointerLeave() {
    mouse.active = false;
  }

  resize();
  step();

  window.addEventListener('resize', resize);
  hero.addEventListener('mousemove', onPointerMove);
  hero.addEventListener('mouseleave', onPointerLeave);

  // Pause the animation loop when the hero is off-screen to save battery/CPU.
  const visibilityObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && rafId === null) {
        rafId = requestAnimationFrame(step);
      } else if (!entry.isIntersecting && rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    });
  }, { threshold: 0 });
  visibilityObserver.observe(hero);
}

/* ---------- Soft cursor-follow glow behind the hero visual ---------- */
function initHeroGlow() {
  const hero = document.getElementById('home');
  const glow = document.getElementById('heroGlow');
  if (!hero || !glow || REDUCE_MOTION) return;

  // Only enable on devices with a real pointer (skip touch).
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    hero.style.setProperty('--glow-x', `${e.clientX - rect.left}px`);
    hero.style.setProperty('--glow-y', `${e.clientY - rect.top}px`);
    hero.classList.add('glow-active');
  });

  hero.addEventListener('mouseleave', () => hero.classList.remove('glow-active'));
}

/* ---------- Expanding ripple on button press ---------- */
function initButtonRipple() {
  const buttons = document.querySelectorAll('.btn');
  if (!buttons.length || REDUCE_MOTION) return;

  buttons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 2;
      const ripple = document.createElement('span');
      ripple.className = 'btn-ripple';
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
      btn.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  });
}

/* ---------- Subtle pointer-follow 3D tilt for cards ---------- */
function initTiltCards() {
  const cards = document.querySelectorAll('.tilt-card');
  if (!cards.length || REDUCE_MOTION) return;
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  const MAX_TILT = 6; // degrees

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;   // 0 -> 1
      const py = (e.clientY - rect.top) / rect.height;   // 0 -> 1
      const ry = (px - 0.5) * MAX_TILT * 2;
      const rx = (0.5 - py) * MAX_TILT * 2;
      card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px) scale(1.015)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}
