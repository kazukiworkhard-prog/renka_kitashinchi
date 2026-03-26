/* ── SLIDESHOW ── */
let slideIdx = 0;
let slideTimer = null;
const SLIDE_INTERVAL = 4000;

function initSlideshow() {
  startSlideshow();
}

function startSlideshow() {
  clearInterval(slideTimer);
  slideTimer = setInterval(() => nextSlide(), SLIDE_INTERVAL);
}

function nextSlide() {
  goSlide((slideIdx + 1) % 4);
}


function goSlide(n) {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.slide-dot');
  slides.forEach(s => s.classList.remove('active'));
  dots.forEach(d => d.classList.remove('active'));
  slides[n]?.classList.add('active');
  dots[n]?.classList.add('active');
  slideIdx = n;
}


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
    if (Math.abs(dx) > 40) { clearInterval(dishTimer); goDish(dishIdx + (dx < 0 ? 1 : -1)); dishTimer = setInterval(() => goDish(dishIdx + 1), 4500); }
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