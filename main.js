/* ---- HERO PHOTO ROTATOR ----------------------------------------------
   Add photos by dropping files in the repo root and listing them here.
   One entry = static image, no rotation. Two or more = crossfade.
   Keep them wide (1600px+) and reasonably compressed.                  */
const HERO_PHOTOS = [
  '/mmdc-hero-1.webp',
  '/mmdc-hero-2.webp',
  '/mmdc-hero-3.webp',
  '/mmdc-hero-4.webp',
  '/mmdc-hero-5.webp',
  '/mmdc-hero-6.webp'
];

(function initHero(){
  const mount = document.getElementById('hero-rotator');
  if (!mount || !HERO_PHOTOS.length) return;

  const hero = mount.closest('.hero');
  requestAnimationFrame(() => hero && hero.classList.add('loaded'));

  // Only the first photo gets a background up front. Setting background-image
  // on the others would make the browser fetch all of them on load, about
  // 2.7MB before anyone has scrolled, which is the wrong default on phone
  // data at a track. The rest are attached just before they are needed.
  HERO_PHOTOS.forEach((src, i) => {
    const el = document.createElement('div');
    el.className = 'hero-slide' + (i === 0 ? ' is-active' : '');
    el.dataset.src = src;
    if (i === 0) { el.style.backgroundImage = "url('" + src + "')"; el.dataset.loaded = '1'; }
    mount.appendChild(el);
  });

  if (HERO_PHOTOS.length < 2) return;

  const slides = Array.from(mount.querySelectorAll('.hero-slide'));
  let idx = 0, timer = null, prevTimer = null;

  function attach(i){
    const el = slides[(i + slides.length) % slides.length];
    if (el.dataset.loaded) return;
    el.style.backgroundImage = "url('" + el.dataset.src + "')";
    el.dataset.loaded = '1';
  }

  const dots = document.createElement('div');
  dots.className = 'hero-dots';
  slides.forEach((_, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('aria-label', 'Show photo ' + (i + 1));
    b.setAttribute('aria-current', i === 0 ? 'true' : 'false');
    b.addEventListener('click', () => { attach(i); show(i); restart(); });
    dots.appendChild(b);
  });
  mount.parentElement.appendChild(dots);

  function show(next){
    const target = (next + slides.length) % slides.length;
    if (target === idx) return;
    attach(target);
    const outgoing = slides[idx];
    slides.forEach(el => el.classList.remove('is-prev'));
    outgoing.classList.remove('is-active');
    outgoing.classList.add('is-prev');
    dots.children[idx].setAttribute('aria-current','false');
    idx = target;
    slides[idx].classList.add('is-active');
    dots.children[idx].setAttribute('aria-current','true');
    attach(idx + 1);              // stage the next one so its fade is not a blank
    clearTimeout(prevTimer);
    prevTimer = setTimeout(() => outgoing.classList.remove('is-prev'), 1700);
  }
  function start(){ timer = setInterval(() => show(idx + 1), 6000); }
  function restart(){ clearInterval(timer); start(); }

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduced) {
    // Stage photo two only once the page has settled, so it never competes
    // with the first paint.
    if (document.readyState === 'complete') setTimeout(() => attach(1), 1200);
    else window.addEventListener('load', () => setTimeout(() => attach(1), 1200));
    start();
  }
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) clearInterval(timer);
    else if (!reduced) restart();
  });
})();

/* ---- SOCIAL DROPDOWN --------------------------------------------------
   Hover opens it on devices that can hover; tap toggles it on those that
   cannot. Binding both to the same element makes hover open the menu and
   the click that follows close it again.                                */
(function initSocial(){
  const wrap = document.querySelector('.nav-social');
  if (!wrap) return;
  const trigger = wrap.querySelector('.nav-social-trigger');
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  function setOpen(open){
    wrap.classList.toggle('open', open);
    trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  if (canHover) {
    wrap.addEventListener('mouseenter', () => setOpen(true));
    wrap.addEventListener('mouseleave', () => setOpen(false));
  }

  // Tap/click always works, including on hover devices where the menu is shut.
  trigger.addEventListener('click', e => {
    e.stopPropagation();
    setOpen(!wrap.classList.contains('open'));
  });

  trigger.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setOpen(!wrap.classList.contains('open'));
    }
  });

  document.addEventListener('click', e => { if (!wrap.contains(e.target)) setOpen(false); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setOpen(false); });
  wrap.addEventListener('focusout', () => {
    setTimeout(() => { if (!wrap.contains(document.activeElement)) setOpen(false); }, 0);
  });
})();
