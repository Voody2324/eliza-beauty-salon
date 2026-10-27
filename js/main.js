// Mobilmenü, görgetett fejléc, finom belépő animációk
(() => {
  const fejlec = document.querySelector('.fejlec');
  const gomb = document.querySelector('.hamburger');

  gomb?.addEventListener('click', () => {
    const nyitva = fejlec.classList.toggle('nyitva');
    gomb.setAttribute('aria-expanded', String(nyitva));
    document.body.style.overflow = nyitva ? 'hidden' : '';
  });
  fejlec?.querySelectorAll('.menu a').forEach((a) =>
    a.addEventListener('click', () => {
      fejlec.classList.remove('nyitva');
      gomb?.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    })
  );

  const gorget = () => fejlec?.classList.toggle('gorgetve', window.scrollY > 8);
  gorget();
  window.addEventListener('scroll', gorget, { passive: true });

  const elemek = document.querySelectorAll('.mozog, .kep-felfed, .lepesek');
  if (!('IntersectionObserver' in window)) {
    elemek.forEach((el) => el.classList.add('lathato'));
    return;
  }
  const figyelo = new IntersectionObserver(
    (bejegyzesek) =>
      bejegyzesek.forEach((b) => {
        if (b.isIntersecting) {
          b.target.classList.add('lathato');
          figyelo.unobserve(b.target);
        }
      }),
    { rootMargin: '0px 0px -8% 0px', threshold: 0.12 }
  );
  elemek.forEach((el) => figyelo.observe(el));
})();
