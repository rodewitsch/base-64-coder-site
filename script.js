/**
 * Base64Coder Landing Page — Scripts
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- Nav scroll effect ---
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');

  const onScroll = () => {
    if (window.scrollY > 10) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // initial check

  // --- Mobile menu toggle ---
  navToggle.addEventListener('click', () => {
    nav.classList.toggle('open');
  });

  // Close mobile menu on link click
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
    });
  });

  // --- Smooth reveal observer ---
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px',
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  // Observe sections for smooth entry
  document.querySelectorAll('.feature-card, .faq-item, .format-item').forEach(el => {
    observer.observe(el);
  });
});
