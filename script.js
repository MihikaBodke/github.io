// ── Navbar scroll shadow ──
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// ── Mobile menu ──
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
function closeMobile() { mobileMenu.classList.remove('open'); }

// ── Typewriter effect ──
const typewriterEl = document.getElementById('typewriter');
const phrases = ['Product Manager', 'Data Enthusiast', 'Problem Solver', 'Product Manager'];
let phraseIdx = 0, charIdx = 0, deleting = false;

function type() {
  const phrase = phrases[phraseIdx];
  if (!deleting) {
    typewriterEl.textContent = phrase.slice(0, charIdx + 1);
    charIdx++;
    if (charIdx === phrase.length) {
      if (phraseIdx === phrases.length - 1) return; // stay on final phrase
      setTimeout(() => { deleting = true; type(); }, 1800);
      return;
    }
  } else {
    typewriterEl.textContent = phrase.slice(0, charIdx - 1);
    charIdx--;
    if (charIdx === 0) {
      deleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
    }
  }
  setTimeout(type, deleting ? 45 : 88);
}
setTimeout(type, 1200);

// ── Scroll-reveal animations ──
const aosEls = document.querySelectorAll('[data-aos]');
const aoObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const idx = Array.from(aosEls).indexOf(e.target);
      e.target.style.transitionDelay = `${(idx % 4) * 0.1}s`;
      e.target.classList.add('visible');
      aoObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });
aosEls.forEach(el => aoObserver.observe(el));

// ── Flip cards ──
document.querySelectorAll('.flip-card').forEach(card => {
  card.addEventListener('click', () => card.classList.toggle('flipped'));
});

// ── Carousel ──
const track    = document.getElementById('carouselTrack');
const dotsWrap = document.getElementById('carouselDots');

// Keep a stable ordered reference to all slides
let slideOrder = Array.from(track.querySelectorAll('.carousel-slide'));
let current    = 0;

// Build dots
slideOrder.forEach((_, i) => {
  const dot = document.createElement('div');
  dot.className = 'dot' + (i === 0 ? ' active' : '');
  dot.addEventListener('click', () => goTo(i));
  dotsWrap.appendChild(dot);
});

function goTo(n) {
  current = ((n % slideOrder.length) + slideOrder.length) % slideOrder.length;

  // Reorder DOM: rotate so current slide is first (leftmost)
  const reordered = [
    ...slideOrder.slice(current),
    ...slideOrder.slice(0, current)
  ];
  reordered.forEach(s => track.appendChild(s));

  // Active class only on the first (leftmost) card
  reordered[0].classList.add('active');
  reordered.slice(1).forEach(s => s.classList.remove('active'));

  // Sync dots back to the real index
  dotsWrap.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i === current));
}

// Clicking a non-active slide advances to it
slideOrder.forEach((slide, i) => {
  slide.addEventListener('click', () => {
    // find which position in the current DOM order this slide sits at
    const domIdx = Array.from(track.children).indexOf(slide);
    if (domIdx > 0) goTo(current + domIdx);
  });
});

document.getElementById('prevBtn').addEventListener('click', () => goTo(current - 1));
document.getElementById('nextBtn').addEventListener('click', () => goTo(current + 1));

// Auto-advance
let autoPlay = setInterval(() => goTo(current + 1), 4800);
track.addEventListener('mouseenter', () => clearInterval(autoPlay));
track.addEventListener('mouseleave', () => { autoPlay = setInterval(() => goTo(current + 1), 4800); });

// Touch swipe
let touchStartX = 0;
track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
track.addEventListener('touchend', e => {
  const diff = touchStartX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 40) goTo(diff > 0 ? current + 1 : current - 1);
});

// ── Contact form → Formspree ──
document.getElementById('contactForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  const btn = this.querySelector('.btn-submit');
  btn.textContent = 'Sending…';
  btn.disabled = true;

  try {
    const res = await fetch('https://formspree.io/f/mnjkdwer', {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: new FormData(this)
    });
    if (res.ok) {
      document.getElementById('formSuccess').classList.add('show');
      this.reset();
      setTimeout(() => document.getElementById('formSuccess').classList.remove('show'), 5000);
    } else {
      alert('Something went wrong. Please email me directly at mbodke2@illinois.edu');
    }
  } catch {
    alert('Something went wrong. Please email me directly at mbodke2@illinois.edu');
  }

  btn.textContent = 'Send message';
  btn.disabled = false;
});

// ── Active nav highlight on scroll ──
const sections = document.querySelectorAll('section[id]');
const navAs    = document.querySelectorAll('.nav-links a, .mobile-menu a');
window.addEventListener('scroll', () => {
  let id = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 90) id = s.id; });
  navAs.forEach(a => {
    a.style.color = a.getAttribute('href') === `#${id}` ? 'var(--purple)' : '';
  });
}, { passive: true });

// ── Scroll arrow ──
document.querySelector('.hero-scroll')?.addEventListener('click', e => {
  e.preventDefault();
  document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
});
