/* RareVersion — painel de moderação (fila de aprovação, radar, catálogo, exportação) */
(function () {
  'use strict';
  const A = window.AMR;
  const esc = A.esc;
  const t = A.t;
  const L = A.L;
  const V = A.views;
  const KEY = 'amr.admin.key';

  const S = (A.adminState = { key: A.session.get(KEY, ''), tab: 'queue', data: null, loading: false, error: '', tmdbResults: null, tmdbError: '' });

  const fmtDateTime = (iso) => {
    if (!iso) return '';
    try { return new Intl.DateTimeFormat(A.locale(), { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(iso)); } catch (e) { return String(iso).slice(0, 16).replace('T', ' '); }
  };

  async function load() {
    S.loading = true;
    S.error = '';
    try {
      S.data = await A.backend.adminList(S.key);
    } catch (e) {
      const msg = String((e && e.message) || e);
      if (msg.indexOf('nao_autorizado') >= 0) { S.key = ''; A.session.del(KEY); S.error = ''; A.toast(t('ad_key_err'), 'error'); }
      else S.error = msg;
    }
    S.loading = false;
    A.rerender();
  }

  async function reloadAll() {
    S.data = await A.backend.adminList(S.key);
    try { A.approved = await A.backend.approved(); } catch (e) { /* mantém o que já tinha */ }
    A.rebuild();
    A.rerender();
  }

  /* ---------------- tela ---------------- */
  V.admin = function () {
    const live = A.backend.mode() === 'live';
    const head = '<header class="page-head"><h1>' + esc(t('ad_title')) + '</h1>' +
      '<p class="mode ' + (live ? 'live' : 'demo') + '"><span class="dot" aria-hidden="true"></span>' + esc(live ? t('ad_mode_live') : t('ad_mode_demo')) + '</p>' +
      (live ? '' : '<p class="lead">' + esc(t('ad_mode_demo_lead')) + '</p>') + '</header>';
    if (live && !S.key) {
      return '<section class="page admin">' + head +
        '<form class="login" data-form="admin-login"><label for="ad-key">' + esc(t('ad_key')) + '</label>' +
        '<input id="ad-key" name="key" type="password" autocomplete="current-password" required>' +
        '<button class="btn primary" type="submit">' + esc(t('ad_login')) + '</button></form></section>';
    }
    A.session.set('amr.curator', true); // pode fixar capas no catálogo pela Galeria
    if (!S.data && !S.loading && !S.error) setTimeout(load, 0);
    const pending = S.data ? S.data.pending.length : 0;
    const versions = A.allVersions().length;
    const tabs = [['queue', 'ad_tab_queue', pending], ['history', 'ad_tab_history'], ['radar', 'ad_tab_radar'], ['catalog', 'ad_tab_catalog'], ['music', 'ad_tab_music'], ['export', 'ad_tab_export'], ['config', 'ad_tab_config']];
    const tabBar = '<div class="ad-tabs" role="tablist">' + tabs.map((tb) =>
      '<button type="button" role="tab" class="ad-tab' + (S.tab === tb[0] ? ' on' : '') + '" aria-selected="' + (S.tab === tb[0]) + '" data-action="adm-tab" data-tab="' + tb[0] + '">' +
        esc(t(tb[1])) + (tb[2] ? ' <span class="count">' + tb[2] + '</span>' : '') + '</button>').join('') + '</div>';
    const body = { queue: queueTab, history: historyTab, radar: radarTab, catalog: catalogTab, music: musicTab, export: exportTab, config: configTab }[S.tab] || queueTab;
    return '<section class="page admin">' + head +
      '<p class="ad-stats">' + esc(t('ad_stats', { f: A.films.length, v: versions, p: pending })) +
        (live ? ' <button type="button" class="link-btn" data-action="adm-logout">' + esc(t('ad_logout')) + '</button>' : '') + '</p>' +
      tabBar + '<div class="ad-body" role="tabpanel">' + body() + '</div></section>';
  };

  function loadingOrError() {
    if (S.error) return '<p class="error">' + esc(t('ad_err_load', { e: S.error })) + '</p>';
    if (!S.data) return '<p class="muted">' + esc(t('loading')) + '</p>';
    return '';
  }

  function kindLabel(tipo) { return t('ad_kind_' + tipo); }

  function preview(it) {
    const d = it.dados || {};
    const parts = [];
    if (it.tipo === 'music') {
      const a = A.artist(d.artist_id);
      const so = a && d.song_id ? A.song(a, d.song_id) : null;
      const who = (a && a.name) || (d.artist && d.artist.name) || '';
      const what = (so && so.title) || (d.song && d.song.title) || '';
      parts.push('<p><strong>' + esc(who) + (what ? ' — ' + esc(what) : '') + '</strong>' + (d.song && !so ? ' <span class="chip ms-unreleased">' + esc(t('ms_unreleased')) + '</span>' : '') + '</p>');
      if (d.version) parts.push('<p class="badges">' + V.mtBadge(d.version.type || 'live') + (d.version.date ? '<span class="chip">' + esc(A.fmtDate(d.version.date)) + '</span>' : '') + (L(d.version.title) ? '<span class="chip">' + esc(L(d.version.title)) + '</span>' : '') + '</p>' + (L(d.version.summary) ? '<p>' + esc(L(d.version.summary)) + '</p>' : ''));
      if (Array.isArray(d.photos) && d.photos.length) {
        parts.push('<div class="qphotos">' + d.photos.map((p) => '<a class="qph" href="' + esc(A.safeUrl(p.url) || '#') + '" target="_blank" rel="noopener noreferrer"><img src="' + esc(A.safeUrl(p.url) || '') + '" alt="" loading="lazy" referrerpolicy="no-referrer" data-keep="1">' +
          '<span><strong>' + esc(t('pk1_' + (p.kind || 'photo'))) + '</strong>' + (p.date ? ' · ' + esc(p.date) : '') + (L(p.caption) ? '<br>' + esc(L(p.caption)) : '') +
          (p.credit ? '<br>' + esc(t('ph_credit', { x: p.credit })) : '') + (p.added_by ? '<br>' + esc(t('ph_by', { x: p.added_by })) : '') +
          (A.safeUrl(p.source) ? '<br>' + esc(t('ph_source')) + ': ' + esc(A.host(p.source)) : '') + '</span></a>').join('') + '</div>');
      }
      if (d.session) parts.push('<p class="badges">' + V.mtBadge(d.session.kind || 'live') + '<strong>' + esc(L(d.session.title)) + '</strong>' + (d.session.date ? '<span class="chip">' + esc(A.fmtDate(d.session.date)) + '</span>' : '') + '<span class="chip">' + esc(t('mu_tracks')) + ': ' + ((d.session.tracks || []).length) + '</span></p>');
      return '<div class="qprev">' + parts.join('') + '</div>';
    }
    if (d.film) parts.push('<p><strong>' + esc(L(d.film.title) || d.film.original_title || '') + '</strong> ' + (d.film.year ? '(' + esc(d.film.year) + ')' : '') + (d.film.tmdb ? ' <span class="muted">TMDB ' + esc(d.film.tmdb) + '</span>' : '') + '</p>');
    if (d.version) {
      parts.push('<p class="badges">' + V.typeBadge(d.version.type || 'official') + '<strong>' + esc(L(d.version.name)) + '</strong>' +
        (d.version.released ? '<span class="chip">' + esc(A.fmtDate(d.version.released)) + '</span>' : '') +
        (d.version.by ? '<span class="chip">' + esc(L(d.version.by)) + '</span>' : '') + '</p>' +
        (d.version.summary ? '<p>' + esc(L(d.version.summary)) + '</p>' : ''));
    }
    if (d.texto) parts.push('<p>' + esc(L(d.texto)) + '</p>');
    if (it.tipo === 'radar' && d.feed) parts.push('<p class="muted">' + esc(d.feed) + (d.pubDate ? ' (' + esc(String(d.pubDate).slice(0, 16)) + ')' : '') + '</p>');
    return parts.length ? '<div class="qprev">' + parts.join('') + '</div>' : '';
  }

  function qItem(it) {
    const id = esc(it.id);
    const src = A.safeUrl(it.fonte_url);
    return '<article class="qitem">' +
      '<header class="qhead"><span class="chip kind">' + esc(kindLabel(it.tipo)) + '</span>' + (it.demo ? '<span class="chip">' + esc(t('ad_example')) + '</span>' : '') +
        '<h3>' + esc(it.titulo || '') + '</h3><time datetime="' + esc(it.criado_em || '') + '">' + esc(fmtDateTime(it.criado_em)) + '</time></header>' +
      '<p class="qmeta"><span>' + esc(t('ad_from')) + ': ' + esc(it.origem || '') + '</span>' +
        (it.contato ? '<span>' + esc(t('ad_contact')) + ': ' + esc(it.contato) + '</span>' : '') +
        '<span>' + esc(t('ad_source')) + ': ' + (src ? '<a href="' + esc(src) + '" target="_blank" rel="noopener noreferrer">' + esc(A.host(src)) + '</a>' : '<em>' + esc(t('ad_no_source')) + '</em>') + '</span></p>' +
      preview(it) +
      '<details class="qedit"><summary>' + esc(t('ad_edit')) + '</summary>' +
        '<textarea id="qjson-' + id + '" rows="12" spellcheck="false" aria-label="JSON">' + esc(JSON.stringify(it.dados || {}, null, 2)) + '</textarea>' +
        '<p class="muted small">IDs: ' + A.films.map((f) => esc(f.id)).join(', ') + '</p>' +
        (it.tipo === 'radar' ? '<button type="button" class="btn small ghost" data-action="adm-template" data-id="' + id + '">' + esc(t('ad_template')) + '</button>' : '') +
      '</details>' +
      '<label class="qnote"><span>' + esc(t('ad_note')) + '</span><input type="text" id="qnote-' + id + '" maxlength="300"></label>' +
      '<div class="qactions">' +
        '<button type="button" class="btn primary small" data-action="adm-decide" data-decision="approve" data-id="' + id + '">' + esc(t('ad_approve')) + '</button>' +
        '<button type="button" class="btn ghost small" data-action="adm-decide" data-decision="reject" data-id="' + id + '">' + esc(t('ad_reject')) + '</button>' +
      '</div></article>';
  }

  function queueTab() {
    const le = loadingOrError();
    if (le) return le;
    if (!S.data.pending.length) return '<p class="muted">' + esc(t('ad_empty')) + '</p>';
    return '<div class="qlist">' + S.data.pending.map(qItem).join('') + '</div>';
  }

  function historyTab() {
    const le = loadingOrError();
    if (le) return le;
    const h = S.data.history || [];
    if (!h.length) return '<p class="muted">' + esc(t('ad_history_empty')) + '</p>';
    return '<ul class="hist">' + h.map((it) =>
      '<li><span class="chip ' + (it.status === 'approved' ? 'ok' : 'no') + '">' + esc(it.status === 'approved' ? t('ad_approved') : t('ad_rejected')) + '</span>' +
      '<span class="chip kind">' + esc(kindLabel(it.tipo)) + '</span><strong>' + esc(it.titulo || '') + '</strong>' +
      '<time>' + esc(fmtDateTime(it.revisado_em)) + '</time>' + (it.nota_admin ? '<em>' + esc(it.nota_admin) + '</em>' : '') + '</li>').join('') + '</ul>';
  }

  function radarTab() {
    const live = A.backend.mode() === 'live';
    const feeds = (S.data && S.data.feeds) || [];
    return '<div class="prose"><p>' + esc(t('ad_radar_lead')) + '</p>' +
      (live
        ? '<p><button type="button" class="btn primary" data-action="adm-radar">' + esc(t('ad_radar_run')) + '</button></p>' +
          (S.data && S.data.radar_last ? '<p class="muted">' + esc(fmtDateTime(S.data.radar_last)) + '</p>' : '')
        : '<p class="muted">' + esc(t('ad_radar_demo')) + '</p>') +
      (feeds.length ? '<h3>' + esc(t('ad_radar_feeds')) + '</h3><ul class="feeds">' + feeds.map((f) => '<li><code>' + esc(f.url) + '</code>' + (f.kw ? ' <span class="muted">' + esc(f.kw) + '</span>' : '') + '</li>').join('') + '</ul>' : '') +
      '<p class="muted">' + esc(t('ad_radar_hint')) + '</p></div>';
  }

  function catalogTab() {
    const rows = A.films.slice().sort((a, b) => a.year - b.year).map((f) => {
      const fan = f.versions.filter((v) => String(v.type).indexOf('fan_') === 0).length;
      return '<tr><td><a href="#' + esc(f.id) + '">' + esc(A.filmTitle(f)) + '</a>' + (f.community ? ' <span class="chip community">' + esc(t('fp_community')) + '</span>' : '') + '</td>' +
        '<td>' + esc(f.year || '') + '</td><td>' + f.versions.length + '</td><td>' + fan + '</td><td>' + f.dubs.length + '</td><td><code>' + esc(f.id) + '</code></td></tr>';
    }).join('');
    const tmdbOn = A.tmdb.mode() !== 'off';
    let results = '';
    if (S.tmdbError) results = '<p class="error">' + esc(S.tmdbError) + '</p>';
    else if (S.tmdbResults) {
      results = '<ul class="tmdb-pick">' + S.tmdbResults.slice(0, 8).map((r) =>
        '<li>' + (r.poster_path ? '<img src="' + esc(A.tmdb.img(r.poster_path, 'w92')) + '" alt="" width="34" height="51" loading="lazy">' : '<span class="sr-noimg" aria-hidden="true"></span>') +
        '<span>' + esc(r.title || r.original_title) + ' <small>' + esc((r.release_date || '').slice(0, 4)) + '</small></span>' +
        '<button type="button" class="btn small" data-action="adm-add-tmdb" data-tmdb="' + esc(r.id) + '">' + esc(t('ad_add')) + '</button></li>').join('') + '</ul>';
    }
    return '<p class="muted">' + esc(t('ad_cat_lead')) + '</p>' +
      '<div class="table-wrap"><table class="eds"><thead><tr><th scope="col">' + esc(t('sg_film')) + '</th><th scope="col">' + esc(t('sg_year')) + '</th><th scope="col">' + esc(t('fp_versions')) + '</th><th scope="col">' + esc(t('nw_fan')) + '</th><th scope="col">' + esc(t('fp_dubs')) + '</th><th scope="col">ID</th></tr></thead><tbody>' + rows + '</tbody></table></div>' +
      '<h3>' + esc(t('ad_cat_add')) + '</h3>' +
      (tmdbOn
        ? '<form class="inline-form" data-form="adm-tmdb-search"><label class="sr-only" for="ad-tmdb-q">' + esc(t('ad_cat_add_ph')) + '</label><input id="ad-tmdb-q" name="q" type="search" placeholder="' + esc(t('ad_cat_add_ph')) + '" required><button class="btn" type="submit">' + esc(t('ad_cat_search')) + '</button></form>' + results
        : '<p class="muted">' + esc(t('s_tmdb_off')) + '</p>') +
      '<h3>' + esc(t('ad_cat_manual')) + '</h3>' +
      '<form class="grid-form" data-form="adm-manual">' +
        '<label><span>' + esc(t('ad_cat_title_pt')) + ' *</span><input name="pt" required maxlength="160"></label>' +
        '<label><span>' + esc(t('ad_cat_title_en')) + '</span><input name="en" maxlength="160"></label>' +
        '<label><span>' + esc(t('sg_year')) + ' *</span><input name="year" inputmode="numeric" pattern="[0-9]{4}" required maxlength="4"></label>' +
        '<label><span>' + esc(t('ad_cat_tmdb_id')) + '</span><input name="tmdb" inputmode="numeric" pattern="[0-9]*" maxlength="9"></label>' +
        '<button class="btn" type="submit">' + esc(t('ad_add')) + '</button></form>';
  }

  function buildExport() {
    const clean = (f) => {
      const o = A.clone(f);
      delete o.tmdbx;
      delete o.community;
      (o.versions || []).forEach((v) => {
        delete v.community;
        if (!v.scores || !Object.keys(v.scores).length) delete v.scores;
        if (!v.reviews || !v.reviews.length) delete v.reviews;
      });
      if (!o.notes || !o.notes.length) delete o.notes;
      if (!o.releases || !o.releases.length) delete o.releases;
      if (!o.links || !Object.keys(o.links).length) delete o.links;
      const pin = A.pins.get(o.id); // capas fixadas pela Galeria
      if (pin.poster) o.poster = pin.poster;
      if (pin.backdrop) o.backdrop = pin.backdrop;
      return o;
    };
    const out = { schema: 1, updated: new Date().toISOString().slice(0, 10), films: A.films.map(clean), sources: A.sources };
    return '/*\n * RareVersion — catálogo exportado pela Moderação em ' + new Date().toISOString() + '\n * Formato dos campos: veja o README.\n */\nwindow.AMR_CATALOG = ' + JSON.stringify(out, null, 2) + ';\n';
  }

  function exportTab() {
    return '<p>' + esc(t('ad_export_lead')) + '</p>' +
      (A.pins.count() ? '<p class="chip ok">' + esc(t('ad_pins', { n: A.pins.count() })) + '</p>' : '') +
      '<p class="actions"><button type="button" class="btn primary" data-action="adm-copy">' + esc(t('ad_export_copy')) + '</button>' +
      (A.isTopWindow ? '<button type="button" class="btn ghost" data-action="adm-download">' + esc(t('ad_export_dl')) + '</button>' : '') + '</p>' +
      '<label class="sr-only" for="ad-export">catalogo.js</label><textarea id="ad-export" class="export" rows="16" readonly spellcheck="false">' + esc(buildExport()) + '</textarea>';
  }

  function configTab() {
    const cfg = A.storage.get('amr.cfg', {}) || {};
    return '<form class="grid-form one" data-form="adm-config">' +
      '<label><span>' + esc(t('ad_cfg_backend')) + '</span><input name="url" type="url" placeholder="https://script.google.com/macros/s/…/exec" value="' + esc(cfg.APPS_SCRIPT_URL || '') + '"><small>' + esc(t('ad_cfg_backend_hint')) + '</small></label>' +
      '<label><span>' + esc(t('ad_cfg_tmdb')) + '</span><input name="tmdb" type="password" autocomplete="off" value="' + esc(A.tmdb.userKey()) + '"><small>' + esc(t('ad_cfg_tmdb_hint')) + '</small></label>' +
      '<button class="btn primary" type="submit">' + esc(t('ad_cfg_save')) + '</button></form>' +
      (A.backend.mode() === 'demo' ? '<p><button type="button" class="btn ghost" data-action="adm-reset">' + esc(t('ad_cfg_reset')) + '</button></p>' : '');
  }

  /* ---------------- músicas: importar do Internet Archive e exportar ---------------- */
  function secs(x) {
    if (x == null || x === '') return '';
    if (/^\d+:\d\d(:\d\d)?$/.test(String(x))) return String(x).replace(/^0(\d:)/, '$1');
    const n = Math.round(Number(x));
    if (!n) return '';
    const h = Math.floor(n / 3600), m = Math.floor((n % 3600) / 60), sec = n % 60;
    return (h ? h + ':' + String(m).padStart(2, '0') : m) + ':' + String(sec).padStart(2, '0');
  }
  function guessSource(text) {
    const x = String(text || '').toLowerCase();
    if (/\bsbd\b|soundboard|mesa/.test(x)) return 'soundboard';
    if (/\bfm\b|broadcast|radio|rádio/.test(x)) return 'fm';
    if (/\baud\b|audience|plateia/.test(x)) return 'audience';
    if (/\btv\b|television/.test(x)) return 'tv';
    if (/demo|cassette|tape/.test(x)) return 'cassette';
    return 'unknown';
  }
  async function iaImport(form) {
    const fd = new FormData(form);
    S.iaInput = String(fd.get('ia') || '');
    S.iaArtist = String(fd.get('artist') || '');
    S.iaError = '';
    S.iaDraft = null;
    const id = A.ia.parse(S.iaInput);
    if (!id) { S.iaError = 'identificador inválido'; A.rerender(); return; }
    A.toast(t('loading'));
    try {
      const m = await A.ia.metadata(id);
      const md = (m && m.metadata) || null;
      if (!md) throw new Error('item não encontrado');
      const one = (v) => (Array.isArray(v) ? v[0] : v) || '';
      let artistId = S.iaArtist;
      let artistObj = null;
      if (artistId === '__new') {
        const name = String(fd.get('newartist') || one(md.creator) || '').trim();
        if (!name) throw new Error(t('ad_mu_new_artist'));
        artistId = A.slug(name);
        artistObj = { id: artistId, name };
      }
      const a = A.artist(artistId);
      const fold = (x) => A.fold(String(x || '')).replace(/^\d+[\s.)-]*/, '').replace(/[’'"?!.,()]/g, '').replace(/\s+/g, ' ').trim();
      const audio = (m.files || []).filter((f) => f.source === 'original' && /\.(flac|mp3|ogg|wav|shn|m4a|aiff?)$/i.test(f.name || ''))
        .sort((p, q) => (Number(p.track) || 0) - (Number(q.track) || 0) || String(p.name).localeCompare(String(q.name), undefined, { numeric: true }));
      let matched = 0;
      const tracks = audio.map((f, i) => {
        const title = String(f.title || String(f.name).replace(/\.[^.]+$/, ''));
        const so = a ? a.songs.find((x) => fold(x.title) === fold(title)) : null;
        const tr = { n: parseInt(f.track, 10) || i + 1 };
        if (so) { tr.song = so.id; matched++; } else tr.title = { pt: title, en: title };
        const len = secs(f.length);
        if (len) tr.length = len;
        tr.file = f.name;
        return tr;
      });
      const date = String(one(md.date) || '').slice(0, 10);
      const venue = String(one(md.venue) || '');
      const city = String(one(md.coverage) || '');
      const source = [one(md.source), one(md.lineage), one(md.notes), one(md.title)].join(' ');
      const title = String(one(md.title) || id);
      const session = {
        id: A.slug([artistId, date, venue || city].filter(Boolean).join('-')).slice(0, 70) || A.slug(id),
        kind: String(fd.get('kind') || 'live'), date,
        title: { pt: title, en: title }, venue, city,
        source_type: guessSource(source),
        lineage: { pt: String(one(md.lineage) || one(md.source) || ''), en: String(one(md.lineage) || one(md.source) || '') },
        notes: { pt: '', en: '' },
        archive: { id, added: String(one(md.addeddate) || one(md.publicdate) || '').slice(0, 10), collection: [].concat(md.collection || []).join(', ') },
        tracks,
        src_urls: [A.ia.details(id)]
      };
      const dados = Object.assign(artistObj ? { artist: artistObj } : { artist_id: artistId }, { session });
      S.iaDraft = { matched, total: tracks.length, item: { tipo: 'music', titulo: (a ? a.name : artistObj.name) + ': ' + title, fonte_url: A.ia.details(id), dados } };
    } catch (e) {
      S.iaError = String((e && e.message) || e);
    }
    A.rerender();
  }
  async function iaAdd() {
    const ta = document.getElementById('ad-ia-json');
    if (!ta) return;
    let item;
    try { item = JSON.parse(ta.value); } catch (e) { A.toast('JSON: ' + e.message, 'error'); return; }
    if (!item || item.tipo !== 'music' || !item.dados) { A.toast('JSON', 'error'); return; }
    try {
      await A.backend.adminAdd(S.key, item);
      S.iaDraft = null;
      A.toast(t('ad_mu_added'));
      await reloadAll();
    } catch (e) { A.toast(String((e && e.message) || e), 'error'); }
  }
  function buildMusicExport() {
    const used = new Set();
    const mark = (o) => { (o.src || []).forEach((k) => used.add(k)); (o.intro_src || []).forEach((k) => used.add(k)); };
    const artists = A.music.artists.map((a) => {
      const o = A.clone(a);
      delete o.community;
      mark(o);
      (o.sessions || []).forEach((x) => { delete x.community; mark(x); });
      (o.photos || []).forEach((p) => { delete p.community; });
      if (o.photos && !o.photos.length) delete o.photos;
      (o.songs || []).forEach((so) => { delete so.community; mark(so); (so.versions || []).forEach((v) => { delete v.community; mark(v); }); });
      return o;
    });
    const sources = {};
    Array.from(used).sort().forEach((k) => { if (A.sources[k]) sources[k] = A.sources[k]; });
    const out = { schema: 1, updated: new Date().toISOString().slice(0, 10), artists, sources };
    return '/*\n * RareVersion — catálogo de músicas exportado pela Moderação em ' + new Date().toISOString() + '\n * Formato dos campos: veja a seção "Músicas" do README.\n */\nwindow.AMR_MUSIC = ' + JSON.stringify(out, null, 2) + ';\n';
  }
  function musicTab() {
    const opts = A.music.artists.map((a) => '<option value="' + esc(a.id) + '"' + (S.iaArtist === a.id ? ' selected' : '') + '>' + esc(a.name) + '</option>').join('') +
      '<option value="__new"' + (S.iaArtist === '__new' ? ' selected' : '') + '>' + esc(t('ad_mu_new_artist')) + '</option>';
    let html = '<section class="ad-sec"><h3>' + esc(t('ad_mu_import')) + '</h3><p class="muted">' + esc(t('ad_mu_import_lead')) + '</p>' +
      '<form class="grid-form" data-form="adm-ia">' +
        '<label><span>' + esc(t('ad_mu_id')) + '</span><input name="ia" required placeholder="https://archive.org/details/…" value="' + esc(S.iaInput || '') + '"></label>' +
        '<label><span>' + esc(t('ad_mu_artist')) + '</span><select name="artist">' + opts + '</select></label>' +
        '<label><span>' + esc(t('ad_mu_new_artist')) + '</span><input name="newartist" maxlength="120"></label>' +
        '<label><span>' + esc(t('ad_mu_kind')) + '</span><select name="kind">' + ['live', 'demo', 'session'].map((k) => '<option value="' + k + '">' + esc(t('mt_' + k)) + '</option>').join('') + '</select></label>' +
        '<button class="btn primary" type="submit">' + esc(t('ad_mu_fetch')) + '</button></form>';
    if (S.iaError) html += '<p class="error">' + esc(t('ad_mu_fail', { e: S.iaError })) + '</p>';
    if (S.iaDraft) {
      html += '<p class="chip ok">' + esc(t('ad_mu_match', { n: S.iaDraft.matched, t: S.iaDraft.total })) + '</p>' +
        '<p class="muted">' + esc(t('ad_mu_preview')) + '</p>' +
        '<label class="sr-only" for="ad-ia-json">JSON</label><textarea id="ad-ia-json" class="export" rows="14" spellcheck="false">' + esc(JSON.stringify(S.iaDraft.item, null, 2)) + '</textarea>' +
        '<p class="actions"><button type="button" class="btn primary" data-action="adm-ia-add">' + esc(t('ad_mu_add')) + '</button></p>';
    }
    html += '</section><section class="ad-sec"><h3>' + esc(t('ad_mu_export')) + '</h3><p class="muted">' + esc(t('ad_mu_export_lead')) + '</p>' +
      '<p class="actions"><button type="button" class="btn primary" data-action="adm-mu-copy">' + esc(t('ad_mu_copy')) + '</button>' +
      (A.isTopWindow ? '<button type="button" class="btn ghost" data-action="adm-mu-dl">' + esc(t('ad_mu_dl')) + '</button>' : '') + '</p>' +
      '<label class="sr-only" for="ad-mu-export">musica.js</label><textarea id="ad-mu-export" class="export" rows="10" readonly spellcheck="false">' + esc(buildMusicExport()) + '</textarea></section>';
    return html;
  }
  async function copyFrom(id) {
    const ta = document.getElementById(id);
    if (!ta) return;
    try { await navigator.clipboard.writeText(ta.value); A.toast(t('ad_copied')); }
    catch (e) { ta.focus(); ta.select(); let ok = false; try { ok = document.execCommand('copy'); } catch (e2) { ok = false; } A.toast(ok ? t('ad_copied') : t('ad_copy_fail'), ok ? '' : 'error'); }
  }
  function downloadText(text, name) {
    const blob = new Blob([text], { type: 'text/javascript;charset=utf-8' });
    const el = document.createElement('a');
    el.href = URL.createObjectURL(blob);
    el.download = name;
    document.body.appendChild(el);
    el.click();
    setTimeout(() => { URL.revokeObjectURL(el.href); el.remove(); }, 500);
  }

  /* ---------------- ações ---------------- */
  async function decide(id, decision) {
    const it = S.data && S.data.pending.find((i) => i.id === id);
    if (!it) return;
    let dados = it.dados || null;
    const ta = document.getElementById('qjson-' + id);
    if (ta) {
      try { dados = JSON.parse(ta.value); } catch (e) { A.toast(t('ad_json_err', { e: e.message }), 'error'); return; }
    }
    const needsVersion = ['version', 'version_new_film', 'radar'].indexOf(it.tipo) >= 0;
    if (decision === 'approve' && needsVersion && !(dados && (dados.version || dados.texto || dados.note))) {
      A.toast(t('ad_need_version'), 'error');
      return;
    }
    const noteEl = document.getElementById('qnote-' + id);
    try {
      A.toast(t('ad_working'));
      await A.backend.adminDecide(S.key, id, decision, dados, noteEl ? noteEl.value : '');
      A.toast(decision === 'approve' ? t('ad_approved') : t('ad_rejected'));
      await reloadAll();
    } catch (e) {
      A.toast(String((e && e.message) || e), 'error');
    }
  }

  function template(id) {
    const it = S.data && S.data.pending.find((i) => i.id === id);
    const ta = document.getElementById('qjson-' + id);
    if (!it || !ta) return;
    let cur = {};
    try { cur = JSON.parse(ta.value) || {}; } catch (e) { /* começa do zero */ }
    const title = it.titulo || cur.title || '';
    const tpl = {
      film_id: it.film_id || cur.film_id || '',
      version: cur.version || {
        id: A.slug(title).slice(0, 40) || A.uid('v'),
        type: 'fan_scan',
        name: { pt: title, en: title },
        by: '',
        released: String(cur.pubDate || '').slice(0, 7),
        cut: 'theatrical',
        source: { pt: '', en: '' },
        res: '',
        formats: ['file'],
        summary: { pt: '', en: '' },
        reception: { level: 'sem_dados' },
        availability: 'unofficial',
        src_urls: [it.fonte_url || cur.link].filter(Boolean)
      }
    };
    if (cur.film) tpl.film = cur.film;
    ta.value = JSON.stringify(tpl, null, 2);
    const det = ta.closest('details');
    if (det) det.open = true;
    ta.focus();
  }

  async function addFromTmdb(tmdbId) {
    const id = Number(tmdbId);
    if (A.films.some((f) => Number(f.tmdb) === id)) { A.toast(t('ad_cat_exists'), 'error'); return; }
    try {
      A.toast(t('ad_working'));
      const res = await Promise.all([A.tmdb.movie(id, 'pt-BR'), A.tmdb.movie(id, 'en-US')]);
      const pt = res[0];
      const en = res[1];
      const year = parseInt(String(en.release_date || pt.release_date || '').slice(0, 4), 10) || null;
      const slug = A.slug((en.original_title || en.title || pt.title) + '-' + (year || ''));
      if (A.film(slug)) { A.toast(t('ad_cat_exists'), 'error'); return; }
      const film = {
        id: slug, tmdb: id, year: year,
        original_title: en.original_title || en.title,
        title: { pt: pt.title || en.title, en: en.title || pt.title },
        overview: { pt: pt.overview || '', en: en.overview || '' },
        runtime: en.runtime || pt.runtime || null,
        accent: '#c9a24a', accent2: '#3b5d8f',
        versions: []
      };
      await A.backend.adminAdd(S.key, { tipo: 'film', film_id: slug, dados: { film } });
      A.storage.set('amr.tmdb.' + id, { t: Date.now(), d: A.tmdbToFilmData(pt, en) });
      S.tmdbResults = null;
      A.toast(t('ad_cat_added'));
      await reloadAll();
    } catch (e) {
      A.toast(String((e && e.message) || e), 'error');
    }
  }

  async function copyExport() {
    const ta = document.getElementById('ad-export');
    if (!ta) return;
    try {
      await navigator.clipboard.writeText(ta.value);
      A.toast(t('ad_copied'));
    } catch (e) {
      ta.focus();
      ta.select();
      let ok = false;
      try { ok = document.execCommand('copy'); } catch (e2) { ok = false; }
      A.toast(ok ? t('ad_copied') : t('ad_copy_fail'), ok ? '' : 'error');
    }
  }

  function downloadExport() {
    const blob = new Blob([buildExport()], { type: 'text/javascript;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'catalogo.js';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }

  A.adminAction = async function (action, el) {
    switch (action) {
      case 'adm-tab':
        S.tab = el.dataset.tab;
        A.rerender();
        break;
      case 'adm-decide':
        await decide(el.dataset.id, el.dataset.decision);
        break;
      case 'adm-template':
        template(el.dataset.id);
        break;
      case 'adm-radar':
        try {
          A.toast(t('ad_working'));
          const r = await A.backend.radarRun(S.key);
          A.toast(t('ad_radar_done', { n: r.novos || 0 }));
          await reloadAll();
        } catch (e) { A.toast(String((e && e.message) || e), 'error'); }
        break;
      case 'adm-add-tmdb':
        await addFromTmdb(el.dataset.tmdb);
        break;
      case 'adm-copy':
        await copyExport();
        break;
      case 'adm-ia-add':
        await iaAdd();
        break;
      case 'adm-mu-copy':
        await copyFrom('ad-mu-export');
        break;
      case 'adm-mu-dl':
        downloadText(buildMusicExport(), 'musica.js');
        break;
      case 'adm-download':
        downloadExport();
        break;
      case 'adm-reset':
        A.backend.demoReset();
        S.data = null;
        A.approved = [];
        A.rebuild();
        A.toast(t('ad_cfg_reset_done'));
        A.rerender();
        break;
      case 'adm-logout':
        S.key = '';
        S.data = null;
        A.session.del(KEY);
        A.rerender();
        break;
      default:
        break;
    }
  };

  A.adminSubmit = async function (formName, form) {
    const fd = new FormData(form);
    if (formName === 'admin-login') {
      const key = String(fd.get('key') || '').trim();
      try {
        await A.backend.adminCheck(key);
        S.key = key;
        A.session.set(KEY, key);
        S.data = null;
        A.rerender();
      } catch (e) {
        A.toast(t('ad_key_err'), 'error');
      }
    } else if (formName === 'adm-tmdb-search') {
      const q = String(fd.get('q') || '').trim();
      if (!q) return;
      S.tmdbError = '';
      try {
        const r = await A.tmdb.search(q, A.lang === 'pt' ? 'pt-BR' : 'en-US');
        S.tmdbResults = r.results || [];
      } catch (e) {
        S.tmdbResults = null;
        S.tmdbError = t('s_tmdb_fail');
      }
      A.rerender();
    } else if (formName === 'adm-manual') {
      const pt = String(fd.get('pt') || '').trim();
      const en = String(fd.get('en') || '').trim() || pt;
      const year = parseInt(String(fd.get('year') || ''), 10) || null;
      const tmdb = parseInt(String(fd.get('tmdb') || ''), 10) || null;
      const id = A.slug((en || pt) + '-' + (year || ''));
      if (A.film(id)) { A.toast(t('ad_cat_exists'), 'error'); return; }
      try {
        await A.backend.adminAdd(S.key, { tipo: 'film', film_id: id, dados: { film: { id, tmdb, year, original_title: en, title: { pt, en }, versions: [] } } });
        A.toast(t('ad_cat_added'));
        await reloadAll();
      } catch (e) { A.toast(String((e && e.message) || e), 'error'); }
    } else if (formName === 'adm-ia') {
      await iaImport(form);
    } else if (formName === 'adm-config') {
      const cfg = A.storage.get('amr.cfg', {}) || {};
      const url = String(fd.get('url') || '').trim();
      if (url) cfg.APPS_SCRIPT_URL = url; else delete cfg.APPS_SCRIPT_URL;
      A.storage.set('amr.cfg', cfg);
      const key = String(fd.get('tmdb') || '').trim();
      A.tmdb.setUserKey(key);
      A.toast(t('ad_cfg_saved'));
      setTimeout(() => window.location.reload(), 600);
    }
  };
})();
