/* ===== KDTech Agency - Main JS ===== */

// Navbar scroll + hamburger
const navbar = document.querySelector('.navbar');
const hamburger = document.querySelector('.hamburger');
hamburger?.addEventListener('click', () => navbar.classList.toggle('open'));

window.addEventListener('scroll', () => {
  if (window.scrollY > 40) navbar.classList.add('scrolled');
  else navbar.classList.remove('scrolled');
  // scroll top btn
  const btn = document.querySelector('.scroll-top');
  if (btn) btn.classList.toggle('visible', window.scrollY > 400);
});

// Scroll top
document.querySelector('.scroll-top')?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// FAQ accordion
document.querySelectorAll('.faq-question').forEach(q => {
  q.addEventListener('click', () => {
    const item = q.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

// Fade-in observer
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
}, { threshold: 0.12 });
document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// Smooth nav links
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); navbar.classList.remove('open'); }
  });
});

// Counter animation
function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  const duration = 1800;
  const step = target / (duration / 16);
  let current = 0;
  const timer = setInterval(() => {
    current += step;
    if (current >= target) { el.textContent = el.dataset.suffix ? target + el.dataset.suffix : target + '+'; clearInterval(timer); }
    else el.textContent = Math.floor(current) + (el.dataset.suffix || '+');
  }, 16);
}
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { animateCounter(e.target); counterObserver.unobserve(e.target); } });
}, { threshold: 0.5 });
document.querySelectorAll('[data-target]').forEach(el => counterObserver.observe(el));

// Lead Form submit
const leadForm = document.getElementById('leadForm');
leadForm?.addEventListener('submit', async function(e) {
  e.preventDefault();
  const btn = this.querySelector('[type="submit"]');
  const originalText = btn.innerHTML;
  btn.innerHTML = '<span>Enviando...</span>';
  btn.disabled = true;

  const data = Object.fromEntries(new FormData(this).entries());
  data.source = window.location.href;
  data.lang = document.documentElement.lang || 'pt-BR';
  data.date = new Date().toISOString();

  try {
    const res = await fetch('crm/save-lead.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (json.success) {
      this.reset();
      const success = document.getElementById('formSuccess');
      if (success) { success.style.display = 'flex'; setTimeout(() => success.style.display = 'none', 6000); }
    }
  } catch {
    alert('Erro ao enviar. Tente pelo WhatsApp!');
  }
  btn.innerHTML = originalText;
  btn.disabled = false;
});
