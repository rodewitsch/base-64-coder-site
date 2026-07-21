/* =============================================
   Base64Coder FAQ — Accordion (site version)
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
  const accordions = document.querySelectorAll('.accordion');

  for (let i = 0; i < accordions.length; i++) {
    accordions[i].addEventListener('click', function () {
      this.classList.toggle('active');
      const panel = this.nextElementSibling;
      if (panel.style.display === 'block') {
        panel.style.display = 'none';
      } else {
        panel.style.display = 'block';
      }
    });
  }
});
