/* GOLD MINERS — admin panel logic */

const GM = window.GoldMiners;
const adminLoad = GM.loadData;
const adminSave = GM.saveData;
const adminDefaults = GM.DEFAULTS;
const adminStorageKey = GM.STORAGE_KEY;

let state = adminLoad();

const toast = (msg) => {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('is-show');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => t.classList.remove('is-show'), 1800);
};

function persist() {
  adminSave(state);
  toast('SAVED');
}

/* ---------------- TABS ---------------- */

document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('is-active'));
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('is-active'));
    tab.classList.add('is-active');
    document.querySelector(`[data-panel="${tab.dataset.tab}"]`).classList.add('is-active');
  });
});

/* ---------------- SETTINGS ---------------- */

document.getElementById('fb-url').value = state.settings.fbUrl;
document.getElementById('stat-paid').value = state.settings.statPaid;
document.getElementById('stat-players').value = state.settings.statPlayers;

document.getElementById('save-settings').addEventListener('click', () => {
  state.settings.fbUrl = document.getElementById('fb-url').value.trim();
  state.settings.statPaid = document.getElementById('stat-paid').value.trim();
  state.settings.statPlayers = document.getElementById('stat-players').value.trim();
  persist();
});

/* ---------------- HELPERS ---------------- */

function uid() { return 'i' + Math.random().toString(36).slice(2, 9); }

function readFileAsDataURL(file) {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result);
    r.onerror = rej;
    r.readAsDataURL(file);
  });
}

function fileDropEl({ id, currentValue, onUpload, label = 'UPLOAD IMAGE' }) {
  const wrap = document.createElement('label');
  wrap.className = 'file-drop' + (currentValue ? ' has-file' : '');
  wrap.innerHTML = `
    <span class="file-drop__label">${label}</span>
    <span class="file-drop__hint">${currentValue ? 'Image set — click to replace' : 'Click to choose PNG / JPG'}</span>
    <input type="file" accept="image/*" id="${id}" />
  `;
  wrap.querySelector('input').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const dataUrl = await readFileAsDataURL(file);
    onUpload(dataUrl);
    wrap.classList.add('has-file');
    wrap.querySelector('.file-drop__hint').textContent = 'Image set — click to replace';
  });
  return wrap;
}

/* ---------------- BONUSES ---------------- */

function renderBonusList() {
  const list = document.getElementById('list-bonuses');
  list.innerHTML = '';
  state.bonuses.forEach((b, idx) => {
    const item = document.createElement('div');
    item.className = 'item';
    item.innerHTML = `
      <button class="item__del">DELETE</button>
      <div class="item__preview">
        <div class="item__preview-thumb">${b.icon || '🎁'}</div>
        <div class="item__preview-meta"><strong>${b.title || 'Untitled'}</strong><small>${b.amount || ''} ${b.badge ? '• ' + b.badge : ''}</small></div>
      </div>
      <div class="item__grid">
        <label class="field"><span>Icon (emoji)</span><input data-k="icon" value="${escAttr(b.icon)}"/></label>
        <label class="field"><span>Amount</span><input data-k="amount" value="${escAttr(b.amount)}"/></label>
        <label class="field"><span>Title</span><input data-k="title" value="${escAttr(b.title)}"/></label>
        <label class="field"><span>Badge (HOT / NEW / VIP / blank)</span><input data-k="badge" value="${escAttr(b.badge)}"/></label>
      </div>
      <label class="field" style="margin-top:14px"><span>Description</span><textarea data-k="desc">${escHTML(b.desc)}</textarea></label>
      <label class="field" style="margin-top:14px"><span>CTA Text</span><input data-k="cta" value="${escAttr(b.cta)}"/></label>
    `;
    item.querySelector('.item__del').addEventListener('click', () => {
      state.bonuses.splice(idx, 1); persist(); renderBonusList();
    });
    item.querySelectorAll('[data-k]').forEach(input => {
      input.addEventListener('input', () => {
        b[input.dataset.k] = input.value;
        const meta = item.querySelector('.item__preview-meta');
        meta.innerHTML = `<strong>${b.title || 'Untitled'}</strong><small>${b.amount || ''} ${b.badge ? '• ' + b.badge : ''}</small>`;
        item.querySelector('.item__preview-thumb').textContent = b.icon || '🎁';
        adminSave(state);
      });
    });
    list.appendChild(item);
  });
}

/* ---------------- GAMES ---------------- */

function renderGameList() {
  const list = document.getElementById('list-games');
  list.innerHTML = '';
  state.games.forEach((g, idx) => {
    const item = document.createElement('div');
    item.className = 'item';

    const previewImg = g.img
      ? `<img class="item__preview-img" src="${g.img}" alt=""/>`
      : `<div class="item__preview-thumb" style="background:linear-gradient(135deg,${g.g1},${g.g2});color:#fff;font-size:11px;text-align:center;padding:4px;line-height:1.1">${shortName(g.name)}</div>`;

    item.innerHTML = `
      <button class="item__del">DELETE</button>
      <div class="item__preview">
        ${previewImg}
        <div class="item__preview-meta"><strong>${g.name || 'Untitled'}</strong><small>${g.hot ? '★ HOT' : 'standard'}</small></div>
      </div>
      <div class="item__grid">
        <label class="field"><span>Game Name</span><input data-k="name" value="${escAttr(g.name)}"/></label>
        <label class="field"><span>Mark as HOT?</span>
          <select data-k="hot">
            <option value="false" ${!g.hot ? 'selected' : ''}>No</option>
            <option value="true" ${g.hot ? 'selected' : ''}>Yes — show HOT badge</option>
          </select>
        </label>
      </div>
      <label class="field" style="margin-top:14px"><span>Image URL (or upload below)</span><input data-k="img" value="${escAttr(g.img)}" placeholder="images/games/your-image.png"/></label>
      <div class="file-slot" style="margin-top:10px"></div>
      <div class="item__grid" style="margin-top:14px">
        <label class="field"><span>Fallback Color 1</span>
          <span class="field-color"><input type="color" data-k="g1" value="${normColor(g.g1)}"/><input data-k="g1" value="${escAttr(g.g1)}"/></span>
        </label>
        <label class="field"><span>Fallback Color 2</span>
          <span class="field-color"><input type="color" data-k="g2" value="${normColor(g.g2)}"/><input data-k="g2" value="${escAttr(g.g2)}"/></span>
        </label>
      </div>
    `;

    item.querySelector('.file-slot').appendChild(fileDropEl({
      id: 'file-' + g.id,
      currentValue: g.img,
      label: 'UPLOAD GAME LOGO',
      onUpload: (dataUrl) => {
        g.img = dataUrl;
        item.querySelector('[data-k="img"]').value = dataUrl.slice(0, 60) + '…';
        const preview = item.querySelector('.item__preview');
        preview.firstElementChild.outerHTML = `<img class="item__preview-img" src="${dataUrl}" alt=""/>`;
        adminSave(state);
        toast('LOGO UPLOADED');
      }
    }));

    item.querySelector('.item__del').addEventListener('click', () => {
      state.games.splice(idx, 1); persist(); renderGameList();
    });

    item.querySelectorAll('[data-k]').forEach(input => {
      input.addEventListener('input', () => {
        const key = input.dataset.k;
        let val = input.value;
        if (key === 'hot') val = val === 'true';
        g[key] = val;
        const meta = item.querySelector('.item__preview-meta');
        meta.innerHTML = `<strong>${g.name || 'Untitled'}</strong><small>${g.hot ? '★ HOT' : 'standard'}</small>`;
        adminSave(state);
      });
    });

    list.appendChild(item);
  });
}

function shortName(name) {
  return (name || '').split(' ').map(w => w[0]).slice(0, 3).join('');
}
function normColor(c) {
  if (!c) return '#000000';
  if (/^#[0-9a-f]{6}$/i.test(c)) return c;
  if (/^#[0-9a-f]{3}$/i.test(c)) return c;
  return '#000000';
}

/* ---------------- FREEPLAYS ---------------- */

function renderFreeplayList() {
  const list = document.getElementById('list-freeplays');
  list.innerHTML = '';
  state.freeplays.forEach((f, idx) => {
    const item = document.createElement('div');
    item.className = 'item';
    item.innerHTML = `
      <button class="item__del">DELETE</button>
      <div class="item__preview">
        <div class="item__preview-thumb">🎰</div>
        <div class="item__preview-meta"><strong>${f.title || 'Untitled'}</strong><small>${f.spins || 0} free spins</small></div>
      </div>
      <div class="item__grid">
        <label class="field"><span>Spins</span><input type="number" data-k="spins" value="${escAttr(f.spins)}"/></label>
        <label class="field"><span>Title</span><input data-k="title" value="${escAttr(f.title)}"/></label>
      </div>
      <label class="field" style="margin-top:14px"><span>Description</span><textarea data-k="desc">${escHTML(f.desc)}</textarea></label>
    `;
    item.querySelector('.item__del').addEventListener('click', () => {
      state.freeplays.splice(idx, 1); persist(); renderFreeplayList();
    });
    item.querySelectorAll('[data-k]').forEach(input => {
      input.addEventListener('input', () => {
        f[input.dataset.k] = input.dataset.k === 'spins' ? Number(input.value) : input.value;
        item.querySelector('.item__preview-meta').innerHTML =
          `<strong>${f.title || 'Untitled'}</strong><small>${f.spins || 0} free spins</small>`;
        adminSave(state);
      });
    });
    list.appendChild(item);
  });
}

/* ---------------- CASHOUTS ---------------- */

function renderCashoutList() {
  const list = document.getElementById('list-cashouts');
  list.innerHTML = '';
  state.cashouts.forEach((c, idx) => {
    const item = document.createElement('div');
    item.className = 'item';
    const previewImg = c.img
      ? `<img class="item__preview-img" src="${c.img}" alt=""/>`
      : `<div class="item__preview-thumb">$</div>`;
    item.innerHTML = `
      <button class="item__del">DELETE</button>
      <div class="item__preview">
        ${previewImg}
        <div class="item__preview-meta"><strong>${c.amount || '$0'}</strong><small>${c.name || 'Anonymous'}</small></div>
      </div>
      <div class="item__grid">
        <label class="field"><span>Amount</span><input data-k="amount" value="${escAttr(c.amount)}"/></label>
        <label class="field"><span>Player Name</span><input data-k="name" value="${escAttr(c.name)}"/></label>
      </div>
      <div class="file-slot" style="margin-top:14px"></div>
    `;
    item.querySelector('.file-slot').appendChild(fileDropEl({
      id: 'cfile-' + c.id,
      currentValue: c.img,
      label: 'UPLOAD CASHOUT SCREENSHOT',
      onUpload: (dataUrl) => {
        c.img = dataUrl;
        item.querySelector('.item__preview').firstElementChild.outerHTML =
          `<img class="item__preview-img" src="${dataUrl}" alt=""/>`;
        adminSave(state);
        toast('SCREENSHOT UPLOADED');
      }
    }));
    item.querySelector('.item__del').addEventListener('click', () => {
      state.cashouts.splice(idx, 1); persist(); renderCashoutList();
    });
    item.querySelectorAll('[data-k]').forEach(input => {
      input.addEventListener('input', () => {
        c[input.dataset.k] = input.value;
        item.querySelector('.item__preview-meta').innerHTML =
          `<strong>${c.amount || '$0'}</strong><small>${c.name || 'Anonymous'}</small>`;
        adminSave(state);
      });
    });
    list.appendChild(item);
  });
}

/* ---------------- REVIEWS ---------------- */

function renderReviewList() {
  const list = document.getElementById('list-reviews');
  list.innerHTML = '';
  state.reviews.forEach((r, idx) => {
    const item = document.createElement('div');
    item.className = 'item';
    const initials = (r.name || '?').split(/\s+/).map(s => s[0]).slice(0,2).join('').toUpperCase();
    item.innerHTML = `
      <button class="item__del">DELETE</button>
      <div class="item__preview">
        <div class="item__preview-thumb">${initials}</div>
        <div class="item__preview-meta"><strong>${r.name || 'Anonymous'}</strong><small>${'★'.repeat(r.stars || 0)}</small></div>
      </div>
      <div class="item__grid--3 item__grid">
        <label class="field"><span>Name</span><input data-k="name" value="${escAttr(r.name)}"/></label>
        <label class="field"><span>Role</span><input data-k="role" value="${escAttr(r.role)}"/></label>
        <label class="field"><span>Stars</span>
          <select data-k="stars">
            ${[1,2,3,4,5].map(n => `<option value="${n}" ${r.stars === n ? 'selected' : ''}>${n} ★</option>`).join('')}
          </select>
        </label>
      </div>
      <label class="field" style="margin-top:14px"><span>Review Text</span><textarea data-k="text">${escHTML(r.text)}</textarea></label>
    `;
    item.querySelector('.item__del').addEventListener('click', () => {
      state.reviews.splice(idx, 1); persist(); renderReviewList();
    });
    item.querySelectorAll('[data-k]').forEach(input => {
      input.addEventListener('input', () => {
        const key = input.dataset.k;
        r[key] = key === 'stars' ? Number(input.value) : input.value;
        const initials = (r.name || '?').split(/\s+/).map(s => s[0]).slice(0,2).join('').toUpperCase();
        item.querySelector('.item__preview-thumb').textContent = initials;
        item.querySelector('.item__preview-meta').innerHTML =
          `<strong>${r.name || 'Anonymous'}</strong><small>${'★'.repeat(r.stars || 0)}</small>`;
        adminSave(state);
      });
    });
    list.appendChild(item);
  });
}

/* ---------------- ADD BUTTONS ---------------- */

document.querySelectorAll('[data-add]').forEach(btn => {
  btn.addEventListener('click', () => {
    const kind = btn.dataset.add;
    if (kind === 'bonuses') {
      state.bonuses.push({ id: uid(), icon: '🎁', amount: '$100', title: 'New Bonus', desc: 'Edit me.', badge: '', cta: 'Claim Now' });
      renderBonusList();
    } else if (kind === 'games') {
      state.games.push({ id: uid(), name: 'NEW GAME', img: '', g1: '#1a0a3a', g2: '#a050ff', hot: false });
      renderGameList();
    } else if (kind === 'freeplays') {
      state.freeplays.push({ id: uid(), spins: 25, title: 'New Freeplay', desc: 'Edit me.' });
      renderFreeplayList();
    } else if (kind === 'cashouts') {
      state.cashouts.push({ id: uid(), amount: '$0', name: 'Player Name', img: '' });
      renderCashoutList();
    } else if (kind === 'reviews') {
      state.reviews.push({ id: uid(), name: 'New Player', role: 'Miner', stars: 5, text: 'Edit this review.' });
      renderReviewList();
    }
    adminSave(state);
    toast('ADDED');
  });
});

/* ---------------- IMPORT / EXPORT / RESET ---------------- */

document.getElementById('btn-export').addEventListener('click', () => {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'gold-miners-data.json';
  a.click();
  URL.revokeObjectURL(url);
  toast('EXPORTED');
});

document.getElementById('btn-import').addEventListener('click', () => {
  document.getElementById('import-file').click();
});
document.getElementById('import-file').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const text = await file.text();
    const parsed = JSON.parse(text);
    state = parsed;
    adminSave(state);
    renderAll();
    toast('IMPORTED');
  } catch (err) {
    toast('IMPORT FAILED');
  }
});

document.getElementById('btn-reset').addEventListener('click', () => {
  if (!confirm('Reset all content to defaults? This wipes your customisations.')) return;
  localStorage.removeItem(adminStorageKey);
  state = JSON.parse(JSON.stringify(adminDefaults));
  renderAll();
  toast('RESET');
});

/* ---------------- ESCAPING ---------------- */

function escHTML(s) {
  return String(s ?? '').replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
}
function escAttr(s) {
  return String(s ?? '').replace(/"/g, '&quot;');
}

/* ---------------- INIT ---------------- */

function renderAll() {
  document.getElementById('fb-url').value = state.settings.fbUrl;
  document.getElementById('stat-paid').value = state.settings.statPaid;
  document.getElementById('stat-players').value = state.settings.statPlayers;
  renderBonusList();
  renderGameList();
  renderFreeplayList();
  renderCashoutList();
  renderReviewList();
}

renderAll();
