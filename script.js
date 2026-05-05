/* GOLD MINERS — landing page logic */

const STORAGE_KEY = 'goldminers_data_v1';

const DEFAULTS = {
  settings: {
    fbUrl: 'https://www.facebook.com/your-page-here',
    statPaid: '$2.4M+',
    statPlayers: '12,800+',
    freebarShow: true,
    freebarText: 'GET $5 FREE PLAY',
    freebarSubtext: 'Redeemable instantly on Messenger',
    freebarCta: 'CLAIM NOW',
    tickerShow: true,
    tickerText: 'DAILY FREEPLAYS ★ INSTANT CASHOUTS ★ 24/7 SUPPORT ★ JOIN OUR FB GROUP ★ NEW PLAYER MATCH 200%'
  },
  bonuses: [
    { id: 'b1', icon: '🎁', amount: '$500', title: 'Welcome Match',     desc: '200% match on your first deposit. Bigger pickaxe, deeper vein.', badge: 'HOT', cta: 'Claim Bonus' },
    { id: 'b2', icon: '⚡', amount: '$50',  title: 'No Deposit Nugget',  desc: 'Sign up and walk away with $50 free. No card required.',       badge: 'NEW', cta: 'Grab Free' },
    { id: 'b3', icon: '👑', amount: '$2000',title: 'VIP Vault',          desc: 'Exclusive high-roller bonus for our top miners.',              badge: 'VIP', cta: 'Go VIP' },
    { id: 'b4', icon: '🔄', amount: '25%',  title: 'Daily Reload',       desc: 'Reload your wallet, reload your bonus. Every single day.',     badge: '',    cta: 'Reload Now' },
    { id: 'b5', icon: '🎰', amount: '100',  title: 'Free Spins Pack',    desc: '100 free spins on the hottest games this week.',               badge: 'HOT', cta: 'Spin Free' },
    { id: 'b6', icon: '💎', amount: '$1000',title: 'Weekend Strike',     desc: 'Saturday & Sunday only. Strike while the gold is hot.',        badge: '',    cta: 'Strike Now' }
  ],
  games: [
    { id: 'g1',  name: 'GAME VAULT',       img: '', g1: '#1a0033', g2: '#ff00aa', hot: true  },
    { id: 'g2',  name: 'ULTRA PANDA',      img: '', g1: '#3a1a0c', g2: '#ff8800', hot: false },
    { id: 'g3',  name: 'FIRE KIRIN',       img: '', g1: '#0a3a1a', g2: '#10ff80', hot: true  },
    { id: 'g4',  name: 'V BLINK',          img: '', g1: '#1a0a3a', g2: '#7a30ff', hot: false },
    { id: 'g5',  name: 'YOLO 777',         img: '', g1: '#3a0a3a', g2: '#c020ff', hot: true  },
    { id: 'g6',  name: 'E-GAME',           img: '', g1: '#0a1a3a', g2: '#ffd700', hot: false },
    { id: 'g7',  name: 'GAMEROOM ONLINE',  img: '', g1: '#3a1a0a', g2: '#ffaa20', hot: false },
    { id: 'g8',  name: 'MR ALL IN ONE',    img: '', g1: '#0a3a1a', g2: '#30ff80', hot: false },
    { id: 'g9',  name: 'LUCKY STARS',      img: '', g1: '#1a0a3a', g2: '#ff60c0', hot: true  },
    { id: 'g10', name: 'ORION STARS',      img: '', g1: '#2a0a3a', g2: '#a050ff', hot: false },
    { id: 'g11', name: 'JUWA 2.0',         img: '', g1: '#3a0a14', g2: '#e02040', hot: true  },
    { id: 'g12', name: 'MAFIA 777 CASINO', img: '', g1: '#1a0604', g2: '#ff5010', hot: false },
    { id: 'g13', name: 'PANDA MASTER',     img: '', g1: '#3a0a0a', g2: '#ff2040', hot: true  }
  ],
  freeplays: [
    { id: 'f1', spins: 50,  title: 'Daily Login',    desc: 'Open Facebook Messenger, claim 50 spins. Every day.' },
    { id: 'f2', spins: 100, title: 'Refer A Miner',  desc: 'Bring a friend, score 100 spins on us.' },
    { id: 'f3', spins: 25,  title: 'Lucky Hour',     desc: 'Active 8–10pm daily. 25 free spins, just for showing up.' }
  ],
  cashouts: [
    { id: 'c1', amount: '$1,250', name: 'Maria L.',  img: '' },
    { id: 'c2', amount: '$3,400', name: 'James T.',  img: '' },
    { id: 'c3', amount: '$840',   name: 'Sasha K.',  img: '' },
    { id: 'c4', amount: '$2,100', name: 'Diego R.',  img: '' },
    { id: 'c5', amount: '$680',   name: 'Priya N.',  img: '' },
    { id: 'c6', amount: '$5,000', name: 'Marcus B.', img: '' },
    { id: 'c7', amount: '$1,475', name: 'Aisha M.',  img: '' },
    { id: 'c8', amount: '$920',   name: 'Tomas G.',  img: '' }
  ],
  reviews: [
    { id: 'r1', name: 'Maria L.',  role: 'Miner since 2024', stars: 5, text: 'Cashed out twice in one week. Support team is friendly and the freeplays add up fast. Best sweepstakes group I have joined.' },
    { id: 'r2', name: 'James T.',  role: 'Daily Player',     stars: 5, text: 'I have tried a lot of these. Gold Miners actually pays out — same day, every time. The VIP bonus is unreal.' },
    { id: 'r3', name: 'Sasha K.',  role: 'Weekend Warrior',  stars: 5, text: 'The Facebook group makes it feel like a community, not a casino. Plus the daily 50 free spins literally never stops giving.' },
    { id: 'r4', name: 'Diego R.',  role: 'New Miner',        stars: 5, text: 'Joined last month with the welcome bonus. Already up $2,100. Wish I had found this sooner.' },
    { id: 'r5', name: 'Priya N.',  role: 'Casual Player',    stars: 4, text: 'Easy to use, easy to cashout. The reload bonus keeps me coming back. Solid operation top to bottom.' },
    { id: 'r6', name: 'Marcus B.', role: 'VIP Member',       stars: 5, text: 'The VIP treatment is no joke. Personal manager, instant cashouts, exclusive promos. This is the gold standard.' }
  ]
};

/* ---------------- DATA LAYER ---------------- */

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        settings:  { ...DEFAULTS.settings,  ...(parsed.settings  || {}) },
        bonuses:   parsed.bonuses   || DEFAULTS.bonuses,
        games:     parsed.games     || DEFAULTS.games,
        freeplays: parsed.freeplays || DEFAULTS.freeplays,
        cashouts:  parsed.cashouts  || DEFAULTS.cashouts,
        reviews:   parsed.reviews   || DEFAULTS.reviews
      };
    }
  } catch (e) {}
  if (typeof window !== 'undefined' && window.GOLDMINERS_BAKED) {
    return JSON.parse(JSON.stringify(window.GOLDMINERS_BAKED));
  }
  return structuredClone(DEFAULTS);
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

window.GoldMiners = { loadData, saveData, DEFAULTS, STORAGE_KEY };

/* ---------------- RENDER ---------------- */

const data = loadData();
const fbUrl = data.settings.fbUrl;

function applyFbLinks() {
  document.querySelectorAll('[data-fb-link]').forEach(el => {
    el.setAttribute('href', fbUrl);
    el.setAttribute('target', '_blank');
    el.setAttribute('rel', 'noopener');
  });
}

function renderBonuses() {
  const grid = document.getElementById('bonus-grid');
  if (!grid) return;
  grid.innerHTML = data.bonuses.map(b => `
    <a class="bonus-card reveal" href="${fbUrl}" target="_blank" rel="noopener">
      ${b.badge ? `<span class="bonus-card__badge badge--${b.badge.toLowerCase()}">${b.badge}</span>` : ''}
      <div class="bonus-card__icon">${b.icon || '🎁'}</div>
      <div class="bonus-card__amount">${b.amount}</div>
      <div class="bonus-card__title">${b.title}</div>
      <div class="bonus-card__desc">${b.desc}</div>
      <div class="bonus-card__cta">${b.cta || 'Claim Now'} →</div>
    </a>
  `).join('');
}

function escAttr(s) { return String(s ?? '').replace(/"/g, '&quot;').replace(/</g, '&lt;'); }
function escHTML(s) { return String(s ?? '').replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c])); }

function renderGames() {
  const grid = document.getElementById('games-grid');
  if (!grid) return;
  grid.innerHTML = data.games.map(g => `
    <a class="game-card reveal ${g.img ? 'has-img' : ''}" href="${fbUrl}" target="_blank" rel="noopener">
      ${g.hot ? `<span class="game-card__hot">★ HOT</span>` : ''}
      <div class="game-card__art game-card__art--placeholder" style="--g1:${escAttr(g.g1)};--g2:${escAttr(g.g2)};">
        <span>${escHTML(g.name)}</span>
        ${g.img ? `<img src="${escAttr(g.img)}" alt="${escAttr(g.name)}" onerror="this.parentElement.parentElement.classList.remove('has-img');this.remove()" />` : ''}
      </div>
      <div class="game-card__overlay">
        ${g.img ? `<div class="game-card__name">${escHTML(g.name)}</div>` : ''}
        <div class="game-card__play">PLAY NOW →</div>
      </div>
    </a>
  `).join('');
}

function renderFreeplays() {
  const grid = document.getElementById('freeplay-grid');
  if (!grid) return;
  grid.innerHTML = data.freeplays.map(f => `
    <a class="freeplay-card reveal" href="${fbUrl}" target="_blank" rel="noopener">
      <div class="freeplay-card__top">
        <span class="freeplay-card__pill">FREE</span>
        <span class="freeplay-card__pill">DAILY</span>
      </div>
      <div class="freeplay-card__spins">${f.spins}<small>FREE SPINS</small></div>
      <div class="freeplay-card__title">${f.title}</div>
      <div class="freeplay-card__desc">${f.desc}</div>
      <div class="freeplay-card__btn">CLAIM ON FACEBOOK →</div>
    </a>
  `).join('');
}

function renderCashouts() {
  const grid = document.getElementById('cashout-grid');
  if (!grid) return;
  grid.innerHTML = data.cashouts.map(c => `
    <div class="cashout-card reveal" data-amount="${c.amount}" data-name="${c.name}" data-img="${c.img}">
      ${c.img
        ? `<img class="cashout-card__img" src="${c.img}" alt="Cashout for ${c.name}" />`
        : `<div class="cashout-card__placeholder">
             <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
               <rect x="3" y="6" width="18" height="13" rx="2"/>
               <path d="M3 10h18M7 15h2"/>
             </svg>
             <span>CASHOUT SCREENSHOT</span>
           </div>`}
      <div class="cashout-card__overlay">
        <div class="cashout-card__amount">${c.amount}</div>
        <div class="cashout-card__name">${c.name}</div>
      </div>
    </div>
  `).join('');

  grid.querySelectorAll('.cashout-card').forEach(card => {
    card.addEventListener('click', () => {
      const img = card.dataset.img;
      if (!img) return;
      const lb = document.getElementById('lightbox');
      document.getElementById('lightbox-img').src = img;
      document.getElementById('lightbox-cap').textContent = `${card.dataset.amount} — ${card.dataset.name}`;
      lb.classList.add('is-open');
      lb.setAttribute('aria-hidden', 'false');
    });
  });
}

function renderReviews() {
  const grid = document.getElementById('review-grid');
  if (!grid) return;
  grid.innerHTML = data.reviews.map(r => {
    const initials = r.name.split(/\s+/).map(s => s[0]).slice(0,2).join('').toUpperCase();
    const stars = '★'.repeat(r.stars) + '☆'.repeat(5 - r.stars);
    return `
      <div class="review-card reveal">
        <div class="review-card__stars">${stars}</div>
        <div class="review-card__text">${r.text}</div>
        <div class="review-card__who">
          <div class="review-card__avatar">${initials}</div>
          <div>
            <div class="review-card__name">${r.name}</div>
            <div class="review-card__role">${r.role}</div>
          </div>
        </div>
      </div>`;
  }).join('');
}

function renderStats() {
  const p = document.getElementById('stat-paid');
  const m = document.getElementById('stat-players');
  if (p) p.textContent = data.settings.statPaid;
  if (m) m.textContent = data.settings.statPlayers;
}

function renderTicker() {
  const ticker = document.getElementById('ticker');
  const track = document.getElementById('ticker-track');
  if (!ticker || !track) return;
  const s = data.settings;
  if (s.tickerShow === false) {
    ticker.style.display = 'none';
    return;
  }
  ticker.style.display = '';
  const text = (s.tickerText || '').trim() || 'DAILY FREEPLAYS ★ INSTANT CASHOUTS';
  const decorated = '★ ' + text.replace(/\s*★\s*/g, ' ★ ') + ' ';
  const repeated = decorated.repeat(4);
  track.innerHTML = `<span>${escHTML(repeated)}</span><span>${escHTML(repeated)}</span>`;
}

function renderFreebar() {
  const bar = document.getElementById('freebar');
  if (!bar) return;
  const s = data.settings;
  if (s.freebarShow === false) {
    bar.classList.add('is-hidden');
    return;
  }
  const t = document.getElementById('freebar-text');
  const sub = document.getElementById('freebar-sub');
  const cta = document.getElementById('freebar-cta');
  if (t && s.freebarText) t.textContent = s.freebarText;
  if (sub && s.freebarSubtext) sub.firstChild ? (sub.textContent = s.freebarSubtext) : sub.textContent = s.freebarSubtext;
  if (cta && s.freebarCta) {
    const svg = cta.querySelector('svg');
    cta.textContent = s.freebarCta + ' ';
    if (svg) cta.appendChild(svg);
  }
}

/* ---------------- INTERACTIONS ---------------- */

function buildParticles() {
  const layer = document.getElementById('particles');
  if (!layer) return;
  const count = 26;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const left = Math.random() * 100;
    const dx = (Math.random() - 0.5) * 200;
    const dur = 8 + Math.random() * 12;
    const delay = -Math.random() * dur;
    const size = 3 + Math.random() * 4;
    p.style.cssText = `
      left: ${left}vw;
      top: -10px;
      width: ${size}px;
      height: ${size}px;
      animation-duration: ${dur}s;
      animation-delay: ${delay}s;
      --dx: ${dx}px;
    `;
    layer.appendChild(p);
  }
}

function setupReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    els.forEach(e => e.classList.add('is-visible'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        entry.target.style.transitionDelay = `${(i % 6) * 60}ms`;
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  els.forEach(e => io.observe(e));
}

function setupNav() {
  const nav = document.getElementById('nav');
  if (!nav) return;
  let lastY = 0;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    nav.classList.toggle('scrolled', y > 30);
    lastY = y;
  }, { passive: true });
}

function setupLightbox() {
  const lb = document.getElementById('lightbox');
  const close = document.getElementById('lightbox-close');
  if (!lb || !close) return;
  function shut() {
    lb.classList.remove('is-open');
    lb.setAttribute('aria-hidden', 'true');
  }
  close.addEventListener('click', shut);
  lb.addEventListener('click', (e) => { if (e.target === lb) shut(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') shut(); });
}

function setYear() {
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
}

/* ---------------- BOOT ---------------- */

document.addEventListener('DOMContentLoaded', () => {
  applyFbLinks();
  renderBonuses();
  renderGames();
  renderFreeplays();
  renderCashouts();
  renderReviews();
  renderStats();
  renderTicker();
  renderFreebar();
  buildParticles();
  setupReveal();
  setupNav();
  setupLightbox();
  setYear();
});
