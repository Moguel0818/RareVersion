/* AllMovieRelease — núcleo: utilidades, idioma, dados, TMDB e servidor (Apps Script) */
(function () {
  'use strict';
  const AMR = (window.AMR = window.AMR || {});
  const CONFIG = window.AMR_CONFIG || {};

  /* ---------------- utilidades ---------------- */
  const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  AMR.esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ESC[c]);
  AMR.fold = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  AMR.clone = (o) => JSON.parse(JSON.stringify(o));
  AMR.uid = (p) => (p || 'id') + '-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  AMR.slug = (s) => AMR.fold(s).replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60);
  AMR.isTopWindow = (function () { try { return window.self === window.top; } catch (e) { return false; } })();
  AMR.safeColor = (c, d) => (/^#[0-9a-f]{3,8}$/i.test(String(c || '')) ? c : d);
  AMR.safeUrl = (u) => (/^https?:\/\//i.test(String(u || '')) ? String(u) : '');
  AMR.host = (u) => { try { return new URL(u).hostname.replace(/^www\./, ''); } catch (e) { return ''; } };

  function makeStore(getStore) {
    return {
      get(k, d) { try { const v = getStore().getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
      set(k, v) { try { getStore().setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } },
      del(k) { try { getStore().removeItem(k); } catch (e) { /* sem armazenamento */ } }
    };
  }
  AMR.storage = makeStore(() => window.localStorage);
  AMR.session = makeStore(() => window.sessionStorage);

  // Configuração: o config.js manda; a moderação pode testar valores só neste navegador.
  AMR.cfg = (key) => {
    const local = AMR.storage.get('amr.cfg', {}) || {};
    if (local[key]) return local[key];
    return CONFIG[key] || '';
  };

  /* ---------------- idioma ---------------- */
  const I18N = window.AMR_I18N || { pt: {}, en: {} };
  function detectLang() {
    const saved = AMR.storage.get('amr.lang', null);
    if (saved === 'pt' || saved === 'en') return saved;
    if (CONFIG.DEFAULT_LANG === 'pt' || CONFIG.DEFAULT_LANG === 'en') return CONFIG.DEFAULT_LANG;
    return String(navigator.language || 'pt').toLowerCase().indexOf('pt') === 0 ? 'pt' : 'en';
  }
  AMR.lang = detectLang();
  AMR.t = (key, vars) => {
    let s = I18N[AMR.lang] && I18N[AMR.lang][key];
    if (s == null) s = I18N.pt && I18N.pt[key];
    if (s == null) s = key;
    if (vars) Object.keys(vars).forEach((k) => { s = s.split('{' + k + '}').join(vars[k]); });
    return s;
  };
  // Texto localizado: aceita "texto" ou { pt, en }
  AMR.L = (v) => {
    if (v == null) return '';
    if (typeof v === 'string' || typeof v === 'number') return String(v);
    if (v[AMR.lang] != null && v[AMR.lang] !== '') return v[AMR.lang];
    return v.pt != null && v.pt !== '' ? v.pt : (v.en != null ? v.en : '');
  };
  AMR.setLang = (l) => {
    AMR.lang = l === 'en' ? 'en' : 'pt';
    AMR.storage.set('amr.lang', AMR.lang);
    document.documentElement.lang = AMR.lang === 'pt' ? 'pt-BR' : 'en';
  };
  AMR.locale = () => (AMR.lang === 'pt' ? 'pt-BR' : 'en-US');
  AMR.plural = (n, oneKey, manyKey) => (n === 1 ? AMR.t(oneKey) : AMR.t(manyKey, { n }));

  /* ---------------- datas ---------------- */
  AMR.parseDate = (s) => {
    const m = String(s || '').match(/^(\d{4})(?:-(\d{1,2}))?(?:-(\d{1,2}))?/);
    return m ? { y: +m[1], m: m[2] ? +m[2] : null, d: m[3] ? +m[3] : null } : null;
  };
  AMR.year = (s) => { const p = AMR.parseDate(s); return p ? p.y : null; };
  // Ano com fração, para posicionar na linha do tempo
  AMR.yearFrac = (s) => { const p = AMR.parseDate(s); if (!p) return null; return p.y + ((p.m || 6) - 1) / 12 + ((p.d || 15) - 1) / 365; };
  AMR.dateKey = (s) => { const p = AMR.parseDate(s); return p ? p.y * 10000 + (p.m || 6) * 100 + (p.d || 15) : 0; };
  AMR.fmtDate = (s, label) => {
    if (label) return AMR.L(label);
    const p = AMR.parseDate(s);
    if (!p) return '';
    try {
      if (p.d) return new Intl.DateTimeFormat(AMR.locale(), { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(Date.UTC(p.y, p.m - 1, p.d));
      if (p.m) return new Intl.DateTimeFormat(AMR.locale(), { month: 'short', year: 'numeric', timeZone: 'UTC' }).format(Date.UTC(p.y, p.m - 1, 1));
    } catch (e) { /* Intl indisponível */ }
    return String(p.y);
  };

  /* ---------------- links proibidos (download) ---------------- */
  AMR.BLOCKED_LINK = /(magnet:|\.torrent\b|mega\.(nz|io)|mediafire\.|1fichier\.|rapidgator\.|uploaded\.net|zippyshare\.|transfer\.it|wetransfer\.|we\.tl\/|drive\.google\.com\/(file|uc)|dropbox\.com\/(s|scl)\/|pixeldrain\.|gofile\.io|krakenfiles\.|nitroflare\.|turbobit\.|filefactory\.|katfile\.|send\.cm|terabox\.|anonfiles\.|bayfiles\.|1337x\.|thepiratebay\.|rarbg\.|nyaa\.si|usenet|nzb)/i;
  AMR.isBlockedLink = (s) => AMR.BLOCKED_LINK.test(String(s || ''));

  /* ---------------- rede ---------------- */
  async function fetchWithTimeout(url, opts, ms) {
    const ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
    const timer = ctrl ? setTimeout(() => ctrl.abort(), ms || 10000) : null;
    try { return await fetch(url, Object.assign({}, opts || {}, ctrl ? { signal: ctrl.signal } : {})); }
    finally { if (timer) clearTimeout(timer); }
  }
  AMR.fetchWithTimeout = fetchWithTimeout;

  /* ---------------- catálogo ---------------- */
  const BASE = AMR.clone(window.AMR_CATALOG || { films: [], sources: {} });
  AMR.sources = BASE.sources || {};
  AMR.catalogUpdated = BASE.updated || '';
  AMR.films = [];
  AMR.approved = [];
  let filmIndex = {};
  let versionIndex = {};

  function normalizeFilm(f) {
    f.versions = Array.isArray(f.versions) ? f.versions : [];
    f.cuts = Array.isArray(f.cuts) && f.cuts.length ? f.cuts : [{ id: 'theatrical', name: { pt: 'Versão de cinema', en: 'Theatrical version' } }];
    f.dubs = Array.isArray(f.dubs) ? f.dubs : [];
    f.guide = Array.isArray(f.guide) ? f.guide : [];
    f.notes = Array.isArray(f.notes) ? f.notes : [];
    f.versions.forEach((v) => {
      v.type = ['official', 'theatrical', 'fan_scan', 'fan_restoration', 'fan_edit'].indexOf(v.type) >= 0 ? v.type : 'official';
      v.cut = v.cut || 'theatrical';
    });
    return f;
  }

  function pushNote(f, text, url, date) {
    if (!text) return;
    const key = JSON.stringify(text);
    if (f.notes.some((n) => JSON.stringify(n.text) === key)) return; // evita repetir após exportar
    f.notes.push({ text, url: url || '', date: date || '' });
  }

  function applyApproved(item, films) {
    const d = item.dados || {};
    const addFilm = (fd) => {
      if (!fd || typeof fd !== 'object') return null;
      const id = fd.id || AMR.slug((fd.original_title || AMR.L(fd.title) || 'filme') + '-' + (fd.year || ''));
      if (filmIndex[id]) return filmIndex[id];
      const f = normalizeFilm(Object.assign({ community: true }, AMR.clone(fd), { id }));
      films.push(f);
      filmIndex[id] = f;
      return f;
    };
    if (item.tipo === 'film') {
      addFilm(d.film || d);
    } else if (item.tipo === 'version' || item.tipo === 'version_new_film' || item.tipo === 'radar') {
      const f = d.film ? addFilm(d.film) : filmIndex[item.film_id || d.film_id];
      if (f && d.version && typeof d.version === 'object') {
        const v = Object.assign({ community: true }, AMR.clone(d.version));
        v.id = v.id || 'c-' + item.id;
        if (!f.versions.some((x) => x.id === v.id)) f.versions.push(v);
        normalizeFilm(f);
      } else if (f && (d.texto || d.note)) {
        pushNote(f, d.texto || d.note, item.fonte_url, item.aprovado_em);
      }
    } else if (item.tipo === 'correction' || item.tipo === 'update') {
      const f = filmIndex[item.film_id || d.film_id];
      if (f) pushNote(f, d.texto || d.text || d.note, item.fonte_url, item.aprovado_em);
    }
  }

  AMR.rebuild = () => {
    const films = AMR.clone(BASE.films).map(normalizeFilm);
    filmIndex = {};
    films.forEach((f) => { filmIndex[f.id] = f; });
    (AMR.approved || []).forEach((item) => { try { applyApproved(item, films); } catch (e) { console.warn('Item aprovado ignorado', item, e); } });
    versionIndex = {};
    films.forEach((f) => {
      f.versions.forEach((v) => { versionIndex[v.id] = { film: f, v }; });
      const c = AMR.tmdbCache(f.tmdb);
      if (c) f.tmdbx = c;
    });
    AMR.films = films;
  };
  AMR.film = (id) => filmIndex[id] || null;
  AMR.findVersion = (id) => versionIndex[id] || null;
  AMR.allVersions = () => {
    const out = [];
    AMR.films.forEach((f) => f.versions.forEach((v) => out.push({ film: f, v })));
    return out;
  };
  AMR.baseCatalog = () => BASE;

  /* ---------------- TMDB ---------------- */
  const TMDB_IMG = 'https://image.tmdb.org/t/p/';
  AMR.tmdb = {
    key() { return AMR.cfg('TMDB_API_KEY') || AMR.storage.get('amr.admin.tmdbKey', ''); },
    mode() {
      if (AMR.cfg('APPS_SCRIPT_URL')) return 'proxy';
      if (this.key()) return 'direct';
      return 'off';
    },
    async request(kind, params) {
      const mode = this.mode();
      if (mode === 'off') throw new Error('tmdb_off');
      if (mode === 'proxy') {
        if (kind === 'search') return AMR.backend.get('tmdb_search', { q: params.query, lang: params.language });
        return AMR.backend.get('tmdb_movie', { id: params.id, lang: params.language });
      }
      const key = this.key();
      const path = kind === 'search' ? 'search/movie' : 'movie/' + encodeURIComponent(params.id);
      const url = new URL('https://api.themoviedb.org/3/' + path);
      url.searchParams.set('language', params.language || 'pt-BR');
      if (kind === 'search') { url.searchParams.set('query', params.query); url.searchParams.set('include_adult', 'false'); }
      const headers = { accept: 'application/json' };
      if (key.length > 40) headers.Authorization = 'Bearer ' + key; else url.searchParams.set('api_key', key);
      const r = await fetchWithTimeout(url.toString(), { headers }, 9000);
      if (!r.ok) throw new Error('tmdb_' + r.status);
      return r.json();
    },
    movie(id, lang) { return this.request('movie', { id, language: lang }); },
    search(q, lang) { return this.request('search', { query: q, language: lang }); },
    img(path, size) { return path ? TMDB_IMG + (size || 'w500') + path : ''; }
  };

  // Cache local dos dados do TMDB (7 dias; os termos do TMDB permitem até 6 meses)
  AMR.tmdbCache = (id) => {
    if (!id) return null;
    const c = AMR.storage.get('amr.tmdb.' + id, null);
    if (!c || !c.d || Date.now() - (c.t || 0) > 7 * 864e5) return null;
    return c.d;
  };
  AMR.tmdbToFilmData = (pt, en) => ({
    complete: true,
    poster: (pt && pt.poster_path) || (en && en.poster_path) || '',
    posterLang: { pt: (pt && pt.poster_path) || '', en: (en && en.poster_path) || '' },
    backdrop: (en && en.backdrop_path) || (pt && pt.backdrop_path) || '',
    title: { pt: (pt && pt.title) || '', en: (en && en.title) || '' },
    overview: { pt: (pt && pt.overview) || '', en: (en && en.overview) || '' },
    tagline: { pt: (pt && pt.tagline) || '', en: (en && en.tagline) || '' },
    runtime: (en && en.runtime) || (pt && pt.runtime) || 0,
    genres: { pt: ((pt && pt.genres) || []).map((g) => g.name), en: ((en && en.genres) || []).map((g) => g.name) }
  });
  AMR.enrichFilm = async (f) => {
    if (!f || !f.tmdb || AMR.tmdb.mode() === 'off') return false;
    if (f.tmdbx && f.tmdbx.complete) return false;
    try {
      const res = await Promise.all([AMR.tmdb.movie(f.tmdb, 'pt-BR'), AMR.tmdb.movie(f.tmdb, 'en-US')]);
      const d = AMR.tmdbToFilmData(res[0], res[1]);
      AMR.storage.set('amr.tmdb.' + f.tmdb, { t: Date.now(), d });
      f.tmdbx = d;
      return true;
    } catch (e) {
      return false;
    }
  };

  /* Ajudantes de exibição: TMDB primeiro, catálogo como reserva */
  AMR.filmTitle = (f) => (f.tmdbx && AMR.L(f.tmdbx.title)) || AMR.L(f.title) || f.original_title || '';
  AMR.filmOverview = (f) => (f.tmdbx && AMR.L(f.tmdbx.overview)) || AMR.L(f.overview);
  AMR.filmRuntime = (f) => (f.tmdbx && f.tmdbx.runtime) || f.runtime || '';
  AMR.filmPoster = (f, size) => {
    const x = f.tmdbx;
    if (!x) return '';
    const p = (x.posterLang && x.posterLang[AMR.lang]) || x.poster;
    return AMR.tmdb.img(p, size || 'w342');
  };
  AMR.filmBackdrop = (f, size) => (f.tmdbx && f.tmdbx.backdrop ? AMR.tmdb.img(f.tmdbx.backdrop, size || 'w1280') : '');

  /* ---------------- servidor (Apps Script) e modo demonstração ---------------- */
  const DEMO = { queue: 'amr.demo.queue', approved: 'amr.demo.approved', seeded: 'amr.demo.seeded' };
  AMR.backend = {
    url() { return AMR.cfg('APPS_SCRIPT_URL'); },
    mode() { return this.url() ? 'live' : 'demo'; },

    async get(action, params) {
      const u = new URL(this.url());
      u.searchParams.set('action', action);
      Object.keys(params || {}).forEach((k) => u.searchParams.set(k, params[k]));
      const r = await fetchWithTimeout(u.toString(), {}, 15000);
      const j = await r.json();
      if (j && j.ok === false) throw new Error(j.error || 'erro');
      return j;
    },
    async post(payload) {
      // Corpo em texto puro: evita a verificação CORS prévia que o Apps Script não responde.
      const r = await fetchWithTimeout(this.url(), { method: 'POST', body: JSON.stringify(payload) }, 20000);
      const j = await r.json();
      if (j && j.ok === false) throw new Error(j.error || 'erro');
      return j;
    },

    demoSeed() {
      if (AMR.storage.get(DEMO.seeded, false)) return;
      AMR.storage.set(DEMO.queue, AMR.clone(window.AMR_DEMO_QUEUE || []));
      AMR.storage.set(DEMO.approved, []);
      AMR.storage.set(DEMO.seeded, true);
    },
    demoQueue() { return AMR.storage.get(DEMO.queue, []) || []; },
    demoApproved() { return AMR.storage.get(DEMO.approved, []) || []; },
    demoReset() { Object.keys(DEMO).forEach((k) => AMR.storage.del(DEMO[k])); },

    async approved() {
      if (this.mode() === 'demo') { this.demoSeed(); return this.demoApproved(); }
      const j = await this.get('approved');
      return j.items || [];
    },
    async suggest(s) {
      if (this.mode() === 'demo') {
        this.demoSeed();
        const q = this.demoQueue();
        q.unshift(Object.assign({ id: AMR.uid('s'), status: 'pending', criado_em: new Date().toISOString(), origem: 'site' }, s));
        AMR.storage.set(DEMO.queue, q);
        return { ok: true, demo: true };
      }
      return this.post(Object.assign({ action: 'suggest' }, s));
    },
    async adminCheck(key) {
      if (this.mode() === 'demo') return { ok: true };
      return this.post({ action: 'admin_check', key });
    },
    async adminList(key) {
      if (this.mode() === 'demo') {
        this.demoSeed();
        const q = this.demoQueue();
        return { ok: true, pending: q.filter((i) => i.status === 'pending'), history: q.filter((i) => i.status !== 'pending').slice(0, 60), feeds: [] };
      }
      return this.post({ action: 'admin_list', key });
    },
    async adminDecide(key, id, decision, dados, nota) {
      if (this.mode() === 'demo') {
        const q = this.demoQueue();
        const it = q.find((i) => i.id === id);
        if (!it) throw new Error('nao_encontrado');
        it.status = decision === 'approve' ? 'approved' : 'rejected';
        it.nota_admin = nota || '';
        it.revisado_em = new Date().toISOString();
        if (dados) it.dados = dados;
        AMR.storage.set(DEMO.queue, q);
        if (decision === 'approve') {
          const ap = this.demoApproved();
          ap.push({ id: 'a-' + it.id, tipo: it.tipo, film_id: it.film_id || (it.dados && it.dados.film_id) || '', dados: it.dados, aprovado_em: it.revisado_em, fonte_url: it.fonte_url || '' });
          AMR.storage.set(DEMO.approved, ap);
        }
        return { ok: true };
      }
      return this.post({ action: 'admin_decide', key, id, decision, dados, nota });
    },
    async adminAdd(key, item) {
      if (this.mode() === 'demo') {
        const ap = this.demoApproved();
        ap.push(Object.assign({ id: AMR.uid('a'), aprovado_em: new Date().toISOString() }, item));
        AMR.storage.set(DEMO.approved, ap);
        return { ok: true };
      }
      return this.post({ action: 'admin_add', key, item });
    },
    async radarRun(key) {
      if (this.mode() === 'demo') throw new Error('demo');
      return this.post({ action: 'admin_radar', key });
    }
  };
})();
