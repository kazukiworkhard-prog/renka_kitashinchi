// Hero video autoplay (mobile-safe)
(function(){
  var v = document.getElementById('hero-video');
  if(!v) return;
  v.muted = true;

  function tryPlay(){
    v.play().catch(function(){});
  }

  // Try immediately
  tryPlay();

  // Try again when enough data is ready
  v.addEventListener('canplay', tryPlay, {once: true});

  // Try again after loader hides (1.8s)
  setTimeout(tryPlay, 2000);
})();

const hamburger = document.getElementById('nav-hamburger');
const drawer = document.getElementById('nav-drawer');

hamburger.addEventListener('click', () => {
  const isOpen = hamburger.classList.toggle('open');
  drawer.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', isOpen);
});

// ── DISH GALLERY SLIDER ──
const dishSlides = document.querySelectorAll('.dish-slide');
const dishDots   = document.querySelectorAll('.dish-dot');
let dishIdx = 0;
let dishTimer = null;

function goDish(n) {
  dishSlides[dishIdx].classList.remove('active');
  dishDots[dishIdx].classList.remove('active');
  dishIdx = (n + dishSlides.length) % dishSlides.length;
  dishSlides[dishIdx].classList.add('active');
  dishDots[dishIdx].classList.add('active');
}

dishDots.forEach((dot, i) => dot.addEventListener('click', () => { clearInterval(dishTimer); goDish(i); dishTimer = setInterval(() => goDish(dishIdx + 1), 4500); }));
document.querySelector('.dish-prev').addEventListener('click', () => { clearInterval(dishTimer); goDish(dishIdx - 1); dishTimer = setInterval(() => goDish(dishIdx + 1), 4500); });
document.querySelector('.dish-next').addEventListener('click', () => { clearInterval(dishTimer); goDish(dishIdx + 1); dishTimer = setInterval(() => goDish(dishIdx + 1), 4500); });
dishTimer = setInterval(() => goDish(dishIdx + 1), 4500);

// スワイプ対応
(function(){
  const sl = document.querySelector('.dish-slider');
  let sx = 0;
  sl.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, { passive: true });
  sl.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - sx;
    if (Math.abs(dx) > 28) { clearInterval(dishTimer); goDish(dishIdx + (dx < 0 ? 1 : -1)); dishTimer = setInterval(() => goDish(dishIdx + 1), 4500); }
  }, { passive: true });
})();

// リンクをタップしたら閉じてからスクロール
drawer.querySelectorAll('.nav-drawer-link').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = link.getAttribute('href');
    const target = document.querySelector(targetId);

    hamburger.classList.remove('open');
    drawer.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');

    if (target) {
      // ドロワーのCSSアニメーション（0.55s）完了後にスクロール
      setTimeout(() => {
        const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 64;
        const top = target.getBoundingClientRect().top + window.scrollY - navH;
        window.scrollTo({ top, behavior: 'smooth' });
      }, 560);
    }
  });
});