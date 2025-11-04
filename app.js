// small helpers: burger + year
const b = document.getElementById('burger');
const m = document.getElementById('mnav');
if (b && m) b.addEventListener('click', () => m.classList.toggle('open'));
const y = document.getElementById('year'); if (y) y.textContent = (new Date()).getFullYear();

// ===== optimized slider & tickers =====
const track = document.getElementById('track');
const prev = document.getElementById('prev');
const next = document.getElementById('next');

// clone nodes (safer and faster than innerHTML reflow) and cache sizes
function tripleCloneList(list) {
  const items = Array.from(list.children);
  const count = items.length;
  list.dataset.loopN = String(count);
  // append clones instead of reserializing HTML
  items.forEach(node => list.appendChild(node.cloneNode(true)));
  items.forEach(node => list.appendChild(node.cloneNode(true)));
  return count;
}

let cardStep = 312; // fallback
function computeCardStep() {
  const c = track?.querySelector('.card');
  if (!c) return cardStep;
  const w = c.getBoundingClientRect().width;
  // gap in CSS is 12px or similar; keep small buffer
  cardStep = Math.round(w) + 12;
  return cardStep;
}

if (track) {
  const originalCount = tripleCloneList(track);
  // start in middle block
  requestAnimationFrame(() => {
    computeCardStep();
    track.scrollLeft = cardStep * originalCount;
  });
}

function normalizeLoop() {
  if (!track) return;
  const n = parseInt(track.dataset.loopN || '0', 10);
  if (!n) return;
  const block = cardStep * n;
  const left = track.scrollLeft;
  // use thresholds to avoid thrashing
  if (left < block * 0.75) {
    // jump right
    track.scrollLeft = left + block;
  } else if (left > block * 1.75) {
    // jump left
    track.scrollLeft = left - block;
  }
}

function scrollByCards(d) {
  if (!track) return;
  track.scrollBy({ left: d * cardStep, behavior: 'smooth' });
  // schedule normalization after animation
  setTimeout(() => requestAnimationFrame(normalizeLoop), 450);
}

prev && prev.addEventListener('click', () => scrollByCards(-1));
next && next.addEventListener('click', () => scrollByCards(1));

// autoplay with stop/start and resilient to visibility changes
let autoplayId = null;
const slider = document.querySelector('.slider');
if (slider?.dataset.autoplay === 'true') {
  const interval = parseInt(slider.dataset.interval || '7000', 10);
  const start = () => { stop(); autoplayId = setInterval(() => scrollByCards(1), interval); };
  const stop = () => { if (autoplayId) { clearInterval(autoplayId); autoplayId = null; } };
  start();
  // pause on visibility change to reduce wasted work
  document.addEventListener('visibilitychange', () => document.hidden ? stop() : start());
  // touch swipe (small, non-blocking handlers)
  let startX = 0;
  track?.addEventListener('touchstart', e => { startX = e.touches[0].clientX; });
  track?.addEventListener('touchend', e => { const dx = e.changedTouches[0].clientX - startX; if (Math.abs(dx) > 30) { scrollByCards(dx > 0 ? -1 : 1); } });
}

// Duplicate banner-ticker content via cloning (avoid innerHTML)
const tt = document.getElementById('tickerTrack');
if (tt && tt.children.length) {
  const items = Array.from(tt.children);
  items.forEach(n => tt.appendChild(n.cloneNode(true)));
}

// Duplicate reviews rows via cloning
['reviewsTrack1', 'reviewsTrack2', 'reviewsTrack3'].forEach(id => {
  const row = document.getElementById(id);
  if (row && row.children.length) {
    const items = Array.from(row.children);
    items.forEach(n => row.appendChild(n.cloneNode(true)));
  }
});

// Theme toggle (3 modes) with localStorage
function applyTheme(t) {
  document.documentElement.setAttribute('data-theme', t);
  localStorage.setItem('theme3', t);
  document.querySelectorAll('.theme-toggle button').forEach(b => b.classList.toggle('active', b.dataset.theme === t));
}
applyTheme(localStorage.getItem('theme3') || 'default');
document.querySelectorAll('.theme-toggle button').forEach(btn => btn.addEventListener('click', () => applyTheme(btn.dataset.theme)));

// responsive: debounce resize and recompute measurements
let resizeTimer = null;
window.addEventListener('resize', () => {
  if (resizeTimer) clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    computeCardStep();
    normalizeLoop();
  }, 150);
});

