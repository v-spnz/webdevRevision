/* ============================================================
   COMP721 Revision Guide — script.js
   Handles: accordion, mark-as-reviewed, progress, scroll spy
   ============================================================ */

/* ── AUTO COUNT TOTAL TOPICS (UPDATED) ─────────────────────── */
let TOTAL_TOPICS = 0;
const done = new Set();

/* ── ACCORDION ─────────────────────────────────────────────── */
function toggle(id) {
  const body = document.getElementById('body-' + id);
  const card = body.closest('.topic');
  const chev = document.getElementById('chev-' + id);
  const isOpen = body.classList.contains('open');

  body.classList.toggle('open', !isOpen);
  card.classList.toggle('open', !isOpen);

  if (chev) chev.textContent = isOpen ? '▾' : '▴';
}

/* ── MARK AS REVIEWED ──────────────────────────────────────── */
function markDone(id) {
  if (done.has(id)) return;
  done.add(id);

  const btn = document.getElementById('done-' + id);
  if (btn) {
    btn.classList.add('marked');
    btn.disabled = true;
    btn.innerHTML = `
      <div class="done-circle" style="background:currentColor">
        <span style="color:#080806;font-size:9px;font-weight:700">✓</span>
      </div>
      Reviewed
    `;
  }

  updateProgress();
}

/* ── PROGRESS ──────────────────────────────────────────────── */
function updateProgress() {
  const count = done.size;
  const pct = TOTAL_TOPICS === 0 ? 0 : Math.round((count / TOTAL_TOPICS) * 100);

  // Top progress bar
  const line = document.getElementById('progress-line');
  if (line) line.style.width = pct + '%';

  // Nav counter
  const navDone = document.getElementById('nav-done');
  const navTotal = document.getElementById('nav-total');

  if (navDone) navDone.textContent = count;
  if (navTotal) navTotal.textContent = TOTAL_TOPICS;
}

/* ── SCROLL SPY ────────────────────────────────────────────── */
function initScrollSpy() {
  const sections = document.querySelectorAll('.week-section');
  const navLinks = document.querySelectorAll('.nav-link[data-week]');
  if (!sections.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach(l => l.classList.remove('active'));

          const match = document.querySelector(
            `.nav-link[data-week="${entry.target.id}"]`
          );

          if (match) match.classList.add('active');
        }
      });
    },
    { threshold: 0.2 }
  );

  sections.forEach(s => observer.observe(s));
}

/* ── INIT ─────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  // Count all topics dynamically
  TOTAL_TOPICS = document.querySelectorAll('.topic').length;

  initScrollSpy();
  updateProgress();
});