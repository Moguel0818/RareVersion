/* RareVersion — núcleo: utilidades, idioma, dados, TMDB e servidor (Apps Script) */
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
    if (s.indexOf('{site}') >= 0) s = s.split('{site}').join(AMR.cfg('SITE_NAME') || 'RareVersion');
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
  AMR.BLOCKED_LINK = /(magnet:|\.torrent\b|mega\.(nz|io)|mediafire\.|1fichier\.|rapidgator\.|uploaded\.net|zippyshare\.|transfer\.it|wetransfer\.|we\.tl\/|drive\.google\.com\/(file|uc)|dropbox\.com\/(s|scl)\/|pixeldrain\.|gofile\.io|krakenfiles\.|nitroflare\.|turbobit\.|filefactory\.|katfile\.|send\.cm|terabox\.|anonfiles\.|bayfiles\.|1337x\.|thepiratebay\.|rarbg\.|nyaa\.si|usenet|nzb|archive\.org\/download\/|\.(flac|mp3|wav|m4a|ogg|mkv|mp4|avi|iso|zip|rar|7z)(\?|#|$))/i;
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
    f.releases = Array.isArray(f.releases) ? f.releases : [];
    f.links = f.links && typeof f.links === 'object' ? f.links : {};
    f.versions.forEach((v) => {
      v.type = ['official', 'theatrical', 'fan_scan', 'fan_restoration', 'fan_edit'].indexOf(v.type) >= 0 ? v.type : 'official';
      v.cut = v.cut || 'theatrical';
      v.scores = v.scores && typeof v.scores === 'object' ? v.scores : {};
      v.reviews = Array.isArray(v.reviews) ? v.reviews : [];
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
    AMR.rebuildMusic();
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
  const KEY_STORE = 'amr.tmdb.key';
  AMR.tmdb = {
    // Chave colada pelo visitante nas Configurações (fica só neste aparelho)
    userKey() { return String(AMR.storage.get(KEY_STORE, '') || AMR.storage.get('amr.admin.tmdbKey', '') || '').trim(); },
    setUserKey(k) {
      AMR.storage.del('amr.admin.tmdbKey');
      if (k) AMR.storage.set(KEY_STORE, String(k).trim()); else AMR.storage.del(KEY_STORE);
    },
    key() { return this.userKey() || AMR.cfg('TMDB_API_KEY'); },
    // A chave do visitante tem prioridade; sem ela, o servidor (Apps Script); sem os dois, desligado
    mode() {
      if (this.userKey()) return 'direct';
      if (AMR.cfg('APPS_SCRIPT_URL')) return 'proxy';
      if (AMR.cfg('TMDB_API_KEY')) return 'direct';
      return 'off';
    },
    looksLikeKey(k) { k = String(k || '').trim(); return /^[a-f0-9]{32}$/i.test(k) || /^eyJ[\w-]+\.[\w-]+\.[\w-]+$/.test(k); },
    directUrl(path, params, key) {
      const url = new URL('https://api.themoviedb.org/3/' + path);
      Object.keys(params || {}).forEach((p) => { if (params[p] !== '' && params[p] != null) url.searchParams.set(p, params[p]); });
      const headers = { accept: 'application/json' };
      if (key.length > 40) headers.Authorization = 'Bearer ' + key; else url.searchParams.set('api_key', key);
      return { url: url.toString(), headers };
    },
    async direct(path, params, key) {
      const req = this.directUrl(path, params, key || this.key());
      const r = await fetchWithTimeout(req.url, { headers: req.headers }, 9000);
      if (!r.ok) throw new Error('tmdb_' + r.status);
      return r.json();
    },
    // Testa uma chave sem salvar: 'ok', 'bad' (recusada) ou 'net' (sem conexão)
    async test(key) {
      try { await this.direct('configuration', {}, String(key || '').trim()); return 'ok'; }
      catch (e) { return /tmdb_(401|403)/.test(String(e && e.message)) ? 'bad' : 'net'; }
    },
    async request(kind, params) {
      const mode = this.mode();
      if (mode === 'off') throw new Error('tmdb_off');
      if (mode === 'proxy') {
        if (kind === 'search') return AMR.backend.get('tmdb_search', { q: params.query, lang: params.language });
        if (kind === 'images') return AMR.backend.get('tmdb_images', { id: params.id });
        return AMR.backend.get('tmdb_movie', { id: params.id, lang: params.language });
      }
      if (kind === 'search') return this.direct('search/movie', { query: params.query, language: params.language || 'pt-BR', include_adult: 'false' });
      if (kind === 'images') return AMR.trimImages(await this.direct('movie/' + encodeURIComponent(params.id) + '/images', {}));
      return this.direct('movie/' + encodeURIComponent(params.id), { language: params.language || 'pt-BR' });
    },
    movie(id, lang) { return this.request('movie', { id, language: lang }); },
    search(q, lang) { return this.request('search', { query: q, language: lang }); },
    images(id) { return this.request('images', { id }); },
    img(path, size) { return path ? TMDB_IMG + (size || 'w500') + path : ''; }
  };

  // Lista de imagens enxuta: [caminho, idioma, largura, altura, nota] (o mesmo formato do Apps Script)
  AMR.trimImages = (r) => {
    const m = (a, n) => (Array.isArray(a) ? a : []).slice(0, n).map((i) => (Array.isArray(i) ? i
      : [i.file_path, i.iso_639_1 || '', i.width || 0, i.height || 0, Math.round((i.vote_average || 0) * 10) / 10]))
      .filter((i) => typeof i[0] === 'string' && /^\/[\w.-]+$/.test(i[0]));
    return { posters: m(r && r.posters, 300), backdrops: m(r && r.backdrops, 150), logos: m(r && r.logos, 80) };
  };

  // Galeria: busca uma vez por filme e guarda por 7 dias
  const galleryMem = {};
  AMR.gallery = {
    get(id) {
      if (galleryMem[id]) return galleryMem[id];
      const c = AMR.storage.get('amr.tmdbimg.' + id, null);
      if (c && c.d && Date.now() - (c.t || 0) < 7 * 864e5) { galleryMem[id] = { state: 'ok', data: c.d }; return galleryMem[id]; }
      return null;
    },
    async load(id) {
      const cur = this.get(id);
      if (cur && (cur.state === 'ok' || cur.state === 'loading')) return cur;
      galleryMem[id] = { state: 'loading' };
      try {
        const d = AMR.trimImages(await AMR.tmdb.images(id));
        galleryMem[id] = { state: 'ok', data: d };
        AMR.storage.set('amr.tmdbimg.' + id, { t: Date.now(), d });
      } catch (e) {
        galleryMem[id] = { state: 'error' };
      }
      return galleryMem[id];
    },
    reset() { Object.keys(galleryMem).forEach((k) => delete galleryMem[k]); }
  };

  // Apaga a cópia local do TMDB (dados dos filmes e galerias)
  AMR.clearTmdbCache = () => {
    try {
      const ls = window.localStorage;
      const keys = [];
      for (let i = 0; i < ls.length; i++) { const k = ls.key(i); if (/^amr\.tmdb(img)?\.\d+$/.test(k)) keys.push(k); }
      keys.forEach((k) => ls.removeItem(k));
    } catch (e) { /* sem armazenamento */ }
    AMR.gallery.reset();
    AMR.films.forEach((f) => { delete f.tmdbx; });
  };

  /* Capas escolhidas: no aparelho (visitante) e fixadas pela moderação (vão para o Exportar) */
  const COVER_KEY = 'amr.covers';
  const PIN_KEY = 'amr.admin.pins';
  const okPath = (p) => (typeof p === 'string' && /^\/[\w.-]+$/.test(p) ? p : '');
  AMR.covers = {
    all() { return AMR.storage.get(COVER_KEY, {}) || {}; },
    get(filmId) { return this.all()[filmId] || {}; },
    set(filmId, kind, path) {
      const all = this.all();
      const cur = Object.assign({}, all[filmId]);
      if (okPath(path)) cur[kind] = path; else delete cur[kind];
      if (Object.keys(cur).length) all[filmId] = cur; else delete all[filmId];
      AMR.storage.set(COVER_KEY, all);
    },
    clear(filmId) { const all = this.all(); if (filmId) delete all[filmId]; AMR.storage.set(COVER_KEY, filmId ? all : {}); }
  };
  AMR.pins = {
    all() { return AMR.storage.get(PIN_KEY, {}) || {}; },
    get(filmId) { return this.all()[filmId] || {}; },
    set(filmId, kind, path) {
      const all = this.all();
      const cur = Object.assign({}, all[filmId]);
      if (okPath(path)) cur[kind] = path; else delete cur[kind];
      if (Object.keys(cur).length) all[filmId] = cur; else delete all[filmId];
      AMR.storage.set(PIN_KEY, all);
    },
    count() { return Object.keys(this.all()).length; }
  };
  // Quem abriu a Moderação nesta sessão pode fixar capas no catálogo
  AMR.isCurator = () => !!(AMR.session.get('amr.curator', false) || AMR.session.get('amr.admin.key', ''));

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
  AMR.filmPosterPath = (f) => {
    const x = f.tmdbx;
    return okPath(AMR.covers.get(f.id).poster) || okPath(AMR.pins.get(f.id).poster) || okPath(AMR.L(f.poster)) ||
      (x ? okPath((x.posterLang && x.posterLang[AMR.lang]) || x.poster) : '');
  };
  AMR.filmBackdropPath = (f) => okPath(AMR.covers.get(f.id).backdrop) || okPath(AMR.pins.get(f.id).backdrop) ||
    okPath(AMR.L(f.backdrop)) || (f.tmdbx ? okPath(f.tmdbx.backdrop) : '');
  AMR.filmPoster = (f, size) => AMR.tmdb.img(AMR.filmPosterPath(f), size || 'w342');
  AMR.filmBackdrop = (f, size) => AMR.tmdb.img(AMR.filmBackdropPath(f), size || 'w1280');

  /* ---------------- lançamentos (edições) ---------------- */
  const FORMAT_ORDER = ['35mm', '70mm', 'vhs', 'beta', 'ced', 'ld', 'dvd', 'umd', 'bd', '3d', '4k', 'digital', 'stream', 'tv'];
  AMR.FORMAT_ORDER = FORMAT_ORDER;
  // Junta as edições do filme (releases) com as edições antigas guardadas dentro das versões (editions)
  AMR.releasesOf = (f) => {
    const out = [];
    (f.releases || []).forEach((r, i) => {
      if (!r || typeof r !== 'object') return;
      out.push(Object.assign({ _i: i }, r, { format: FORMAT_ORDER.indexOf(r.format) >= 0 ? r.format : 'other', country: String(r.country || '').toUpperCase().slice(0, 2) }));
    });
    f.versions.forEach((v) => (v.editions || []).forEach((e, i) => {
      out.push({ _i: 1000 + i, legacy: true, date: String(e.year || ''), country: '', format: 'other', formatText: e.format, regionText: e.region, label: e.label, note: e.note, version: v.id });
    }));
    out.sort((a, b) => (AMR.dateKey(a.date) || 9e9) - (AMR.dateKey(b.date) || 9e9) || a._i - b._i);
    return out;
  };

  /* ---------------- nomes de países e idiomas (Intl) ---------------- */
  const dn = {};
  function displayName(type, code) {
    if (!code) return '';
    try {
      const k = type + AMR.lang;
      dn[k] = dn[k] || new Intl.DisplayNames([AMR.locale()], { type });
      return dn[k].of(code) || code;
    } catch (e) { return code; }
  }
  AMR.countryName = (code) => displayName('region', String(code || '').toUpperCase());
  AMR.languageName = (code) => {
    const n = displayName('language', String(code || '').toLowerCase());
    return n ? n.charAt(0).toUpperCase() + n.slice(1) : '';
  };

  /* ---------------- músicas ---------------- */
  const MBASE = AMR.clone(window.AMR_MUSIC || { artists: [], sources: {} });
  Object.keys(MBASE.sources || {}).forEach((k) => { if (!AMR.sources[k]) AMR.sources[k] = MBASE.sources[k]; });
  const MTYPES = ['studio', 'demo', 'live', 'session', 'alternate', 'remix'];
  const MSTATUS = ['released', 'bside', 'unreleased'];
  AMR.MUSIC_TYPES = MTYPES;
  AMR.PHOTO_KINDS = ['photo', 'flyer', 'ticket', 'press', 'other'];
  AMR.music = { artists: [], updated: MBASE.updated || '' };
  let artistIndex = {};

  function normArtist(a) {
    a.songs = Array.isArray(a.songs) ? a.songs : [];
    a.sessions = Array.isArray(a.sessions) ? a.sessions : [];
    a.members = Array.isArray(a.members) ? a.members : [];
    a.links = a.links && typeof a.links === 'object' ? a.links : {};
    a.photos = (Array.isArray(a.photos) ? a.photos : []).filter((p) => p && AMR.safeUrl(p.url) && !AMR.isBlockedLink(p.url));
    a.photos.forEach((p) => { p.kind = AMR.PHOTO_KINDS.indexOf(p.kind) >= 0 ? p.kind : 'photo'; });
    a.songs.forEach((s) => {
      s.status = MSTATUS.indexOf(s.status) >= 0 ? s.status : 'released';
      s.versions = Array.isArray(s.versions) ? s.versions : [];
      s.versions.forEach((v) => { v.type = MTYPES.indexOf(v.type) >= 0 ? v.type : 'live'; });
    });
    a.sessions.forEach((x) => {
      x.kind = MTYPES.indexOf(x.kind) >= 0 ? x.kind : 'live';
      x.tracks = Array.isArray(x.tracks) ? x.tracks : [];
    });
    return a;
  }

  // Itens de música aprovados na moderação: { artist | artist_id, song | song_id, version, session }
  function applyMusic(item, artists, index) {
    const d = item.dados || {};
    let a = index[d.artist_id || (d.artist && d.artist.id) || ''];
    if (!a && d.artist && (d.artist.name || d.artist.id)) {
      a = normArtist(Object.assign({ community: true }, AMR.clone(d.artist), { id: d.artist.id || AMR.slug(d.artist.name) }));
      artists.push(a);
      index[a.id] = a;
    }
    if (!a) return;
    if (d.session && typeof d.session === 'object') {
      const x = Object.assign({ community: true }, AMR.clone(d.session));
      x.id = x.id || 'c-' + item.id;
      if (!a.sessions.some((y) => y.id === x.id)) a.sessions.push(x);
    }
    if (Array.isArray(d.photos)) {
      a.photos = Array.isArray(a.photos) ? a.photos : [];
      d.photos.forEach((p, i) => {
        if (!p || typeof p !== 'object' || a.photos.some((q) => q.url === p.url)) return;
        a.photos.push(Object.assign({ community: true }, AMR.clone(p), { id: p.id || 'c-' + item.id + '-' + i }));
      });
    }
    let s = null;
    const sid = d.song_id || (d.song && (d.song.id || AMR.slug(d.song.title || '')));
    if (sid) s = a.songs.find((y) => y.id === sid);
    if (!s && d.song && d.song.title) {
      s = Object.assign({ community: true, versions: [] }, AMR.clone(d.song), { id: sid });
      a.songs.push(s);
    }
    if (s && d.version && typeof d.version === 'object') {
      const v = Object.assign({ community: true }, AMR.clone(d.version));
      v.id = v.id || 'c-' + item.id;
      if (!s.versions.some((y) => y.id === v.id)) s.versions.push(v);
    }
    normArtist(a);
  }

  AMR.rebuildMusic = () => {
    const artists = AMR.clone(MBASE.artists || []).map(normArtist);
    const index = {};
    artists.forEach((a) => { index[a.id] = a; });
    (AMR.approved || []).forEach((item) => {
      if (item.tipo === 'music') { try { applyMusic(item, artists, index); } catch (e) { console.warn('Item de música ignorado', item, e); } }
    });
    artists.sort((p, q) => String(p.sort || p.name).localeCompare(String(q.sort || q.name)));
    artistIndex = index;
    AMR.music.artists = artists;
  };
  AMR.artist = (id) => artistIndex[id] || null;
  AMR.song = (a, id) => (a ? a.songs.find((s) => s.id === id) || null : null);
  AMR.recording = (a, id) => (a ? a.sessions.find((x) => x.id === id) || null : null);
  AMR.sessionPlace = (x) => [x.venue, x.city].filter(Boolean).join(', ');

  // Versões de uma música: as cadastradas nela + as faixas das gravações (shows, sessões, fitas)
  AMR.songVersions = (a, s) => {
    const out = s.versions.map((v) => Object.assign({}, v));
    a.sessions.forEach((x) => x.tracks.forEach((tr) => {
      if (tr.song !== s.id) return;
      out.push({
        id: x.id + '-' + tr.n, type: x.kind, date: x.date, session: x.id, track: tr.n, length: tr.length, file: tr.file,
        trackNote: tr.note, title: x.title, place: AMR.sessionPlace(x), source_type: x.source_type,
        availability: x.archive && x.archive.id ? 'archive' : x.availability || '', quality: x.quality, src: x.src, src_urls: x.src_urls
      });
    }));
    out.sort((p, q) => (AMR.dateKey(p.date) || 9e9) - (AMR.dateKey(q.date) || 9e9));
    return out;
  };
  AMR.isRare = (v) => v.type !== 'studio';

  /* APIs de música, sem chave: MusicBrainz (dados abertos), Cover Art Archive (capas) e Internet Archive (gravações) */
  async function fetchJson(url) {
    const r = await fetchWithTimeout(url, { headers: { accept: 'application/json' } }, 12000);
    if (!r.ok) throw new Error('http_' + r.status);
    return r.json();
  }
  const normName = (x) => AMR.fold(x).replace(/[’'`´]/g, '').trim();
  const MB = 'https://musicbrainz.org/ws/2/';
  const mbMem = {};
  AMR.mb = {
    async artistId(a) {
      if (a.mbid) return a.mbid;
      const key = 'amr.mb.id.' + a.id;
      const c = AMR.storage.get(key, null);
      if (c) return c;
      const r = await fetchJson(MB + 'artist?fmt=json&limit=5&query=' + encodeURIComponent('artist:"' + a.name.replace(/[’]/g, "'") + '"'));
      const list = r.artists || [];
      const best = list.find((x) => normName(x.name) === normName(a.name)) || list[0];
      if (!best) throw new Error('mb_not_found');
      AMR.storage.set(key, best.id);
      return best.id;
    },
    get(a) {
      if (mbMem[a.id]) return mbMem[a.id];
      const c = AMR.storage.get('amr.mb.rg.' + a.id, null);
      if (c && c.d && Date.now() - (c.t || 0) < 7 * 864e5) { mbMem[a.id] = { state: 'ok', data: c.d, mbid: c.mbid }; return mbMem[a.id]; }
      return null;
    },
    async load(a) {
      const cur = this.get(a);
      if (cur && cur.state !== 'error') return cur;
      mbMem[a.id] = { state: 'loading' };
      try {
        const id = await this.artistId(a);
        const r = await fetchJson(MB + 'release-group?fmt=json&limit=100&artist=' + encodeURIComponent(id));
        const d = (r['release-groups'] || []).map((g) => ({ id: g.id, title: g.title, date: g['first-release-date'] || '', type: g['primary-type'] || '', sec: g['secondary-types'] || [] }));
        mbMem[a.id] = { state: 'ok', data: d, mbid: id };
        AMR.storage.set('amr.mb.rg.' + a.id, { t: Date.now(), d, mbid: id });
      } catch (e) {
        mbMem[a.id] = { state: 'error' };
      }
      return mbMem[a.id];
    },
    reset(a) { delete mbMem[a.id]; AMR.storage.del('amr.mb.rg.' + a.id); }
  };
  AMR.caa = (rgid, size) => 'https://coverartarchive.org/release-group/' + encodeURIComponent(rgid) + '/front-' + (size || 250);
  const okIa = (id) => /^[\w.-]+$/.test(String(id || ''));
  AMR.ia = {
    ok: okIa,
    // Player oficial do Internet Archive: a gravação inteira (lista de faixas) ou uma faixa só
    embed(id, file) {
      if (!okIa(id)) return '';
      return 'https://archive.org/embed/' + id + (file ? '/' + String(file).split('/').map(encodeURIComponent).join('/') : '&playlist=1');
    },
    details(id) { return okIa(id) ? 'https://archive.org/details/' + id : ''; },
    // "https://archive.org/details/abc" ou "abc" -> "abc"
    parse(input) {
      const m = String(input || '').trim().match(/archive\.org\/(?:details|embed|metadata)\/([\w.-]+)/i);
      const id = m ? m[1] : String(input || '').trim();
      return okIa(id) ? id : '';
    },
    metadata(id) { return fetchJson('https://archive.org/metadata/' + encodeURIComponent(id)); }
  };

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
