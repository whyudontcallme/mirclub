
// burger + year
const b=document.getElementById('burger'), m=document.getElementById('mnav'); b&&b.addEventListener('click',()=>m.classList.toggle('open')); const y=document.getElementById('year'); if(y) y.textContent=(new Date()).getFullYear();
// slider with autoplay + pause + swipe
const track=document.getElementById('track'); const prev=document.getElementById('prev'); const next=document.getElementById('next');
function scrollByCards(d){ if(!track) return; const w=track.querySelector('.card')?.getBoundingClientRect().width||300; track.scrollBy({left:d*(w+12),behavior:'smooth'}); }
prev&&prev.addEventListener('click',()=>scrollByCards(-1)); next&&next.addEventListener('click',()=>scrollByCards(1));
let autoplayId=null; const slider=document.querySelector('.slider'); if(slider?.dataset.autoplay==='true'){ const interval=parseInt(slider.dataset.interval||'3000',10);
  const start=()=>{ stop(); autoplayId=setInterval(()=>scrollByCards(1), interval); }; const stop=()=>{ if(autoplayId) clearInterval(autoplayId); autoplayId=null; };
  slider.addEventListener('mouseenter',stop); slider.addEventListener('mouseleave',start); start();
  let startX=0; track?.addEventListener('touchstart',e=>{startX=e.touches[0].clientX}); track?.addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-startX; if(Math.abs(dx)>30){scrollByCards(dx>0?-1:1);}});
}
// Duplicate banner-ticker content for seamless loop
const tt=document.getElementById('tickerTrack'); if(tt && tt.children.length){ tt.insertAdjacentHTML('beforeend', tt.innerHTML); }
// Theme toggle (3 modes) with localStorage
function applyTheme(t) {
  // Ставим на <html> — так быстрее и без FOUC
  document.documentElement.setAttribute('data-theme', t);
  localStorage.setItem('theme3', t);
  document.querySelectorAll('.theme-toggle button')
    .forEach(b => b.classList.toggle('active', b.dataset.theme === t));
}

// Берём сохранённую или fallback к "default"
applyTheme(localStorage.getItem('theme3') || 'default');

// Слушаем клики по кнопкам переключателя
document.querySelectorAll('.theme-toggle button')
  .forEach(btn => btn.addEventListener('click', () => applyTheme(btn.dataset.theme)));

const saved = localStorage.getItem('theme3') || 'default';
applyTheme(saved);

document.querySelectorAll('.theme-toggle button')
  .forEach(btn => btn.addEventListener('click', () => applyTheme(btn.dataset.theme)));

