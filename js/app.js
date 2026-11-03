/* AllMovieRelease — inicialização, rotas, busca, sugestões, comparação e eventos */
(function () {
  'use strict';
  const A = window.AMR;
  const esc = A.esc;
  const t = A.t;
  const L = A.L;
  const V = A.views;
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (sel, root) => (root || document).querySelector(sel);

  A.state = { compare: new Set(), compareFilm: null, guideNeed: {}, typeFilter: {}, newsFilter: 'fan', pendingFocus: null, route: '' };

  const BRAND_MARK = '<svg class="brand-mark" viewBox="0 0 30 22" width="30" height="22" aria-hidden="true">' +
    '<rect x="1" y="1" width="28" height="20" rx="3" fill="none" stroke="currentColor" stroke-width="2"/>' +
    '<rect x="8.5" y="5" width="13" height="12" rx="1.5" fill="currentColor"/>' +
    '<g fill="currentColor"><rect x="3.4" y="4" width="2.6" height="2.4" rx=".6"/><rect x="3.4" y="9.8" width="2.6" height="2.4" rx=".6"/><rect x="3.4" y="15.6" width="2.6" height="2.4" rx=".6"/>' +
    '<rect x="24" y="4" width="2.6" height="2.4" rx=".6"/><rect x="24" y="9.8" width="2.6" height="2.4" rx=".6"/><rect x="24" y="15.6" width="2.6" height="2.4" rx=".6"/></g></svg>';

  /* ---------------- moldura do site ---------------- */
  function siteName() { return A.cfg('SITE_NAME') || 'AllMovieRelease'; }

  function header() {
    const r = A.state.route;
    const nav = [['', 'nav_home'], ['filmes', 'nav_films'], ['novos', 'nav_new'], ['sobre', 'nav_about']].map((n) =>
      '<a href="#' + n[0] + '"' + ((r === n[0] || (n[0] === '' && r === '')) ? ' aria-current="page"' : '') + '>' + esc(t(n[1])) + '</a>').join('');
    return '<a class="skip" href="#main">' + (A.lang === 'pt' ? 'Pular para o conteúdo' : 'Skip to content') + '</a>' +
      '<header class="topbar"><div class="topbar-inner">' +
        '<a class="brand" href="#">' + BRAND_MARK + '<span>' + esc(siteName()) + '</span></a>' +
        '<nav class="mainnav" aria-label="' + esc(siteName()) + '">' + nav + '</nav>' +
        '<div class="search" role="search">' +
          '<label class="sr-only" for="q">' + esc(t('search_label')) + '</label>' +
          '<input id="q" type="search" autocomplete="off" spellcheck="false" placeholder="' + esc(t('search_ph')) + '" aria-controls="search-panel">' +
          '<div class="search-panel" id="search-panel" hidden></div>' +
        '</div>' +
        '<div class="lang" role="group" aria-label="' + esc(t('lang_group')) + '">' +
          '<button type="button" data-action="lang" data-lang="pt" aria-pressed="' + (A.lang === 'pt') + '">PT</button>' +
          '<button type="button" data-action="lang" data-lang="en" aria-pressed="' + (A.lang === 'en') + '">EN</button>' +
        '</div>' +
        '<button type="button" class="btn small primary suggest-btn" data-action="suggest">' + esc(t('nav_suggest')) + '</button>' +
      '</div></header>';
  }

  function footer() {
    return '<footer class="site-foot"><div class="foot-inner">' +
      '<p class="foot-brand">' + BRAND_MARK + '<span>' + esc(siteName()) + '</span></p>' +
      '<p>' + esc(t('ft_tag')) + ' ' + esc(t('ft_policy')) + '</p>' +
      '<p class="muted">' + esc(t('ft_tmdb')) + '</p>' +
      '<p class="muted">' + esc(t('ft_updated', { d: A.fmtDate(A.catalogUpdated) })) +
        (A.backend.mode() === 'demo' ? ' <span class="chip">' + esc(t('ft_demo')) + '</span>' : '') + '</p>' +
      '<nav class="foot-nav"><a href="#sobre">' + esc(t('nav_about')) + '</a><a href="#admin">' + esc(t('nav_admin')) + '</a></nav>' +
    '</div></footer>';
  }

  function vtypeOptions() {
    return ['official', 'fan_scan', 'fan_restoration', 'fan_edit'].map((tp) => '<option value="' + tp + '">' + esc(t('type_' + tp)) + '</option>').join('');
  }
  function filmOptions() {
    return '<option value="">' + esc(t('sg_choose')) + '</option>' +
      A.films.slice().sort((a, b) => A.filmTitle(a).localeCompare(A.filmTitle(b))).map((f) => '<option value="' + esc(f.id) + '">' + esc(A.filmTitle(f) + ' (' + f.year + ')') + '</option>').join('');
  }

  function dialogs() {
    return '<dialog id="dlg-suggest" class="dlg" aria-labelledby="sg-h">' +
      '<form class="sg-form" data-form="suggest" novalidate>' +
        '<div class="dlg-head"><h2 id="sg-h">' + esc(t('sg_title')) + '</h2>' +
          '<button type="button" class="icon-btn" data-action="close-dialog" aria-label="' + esc(t('close')) + '">&times;</button></div>' +
        '<div class="dlg-body">' +
          '<fieldset class="kind"><legend>' + esc(t('sg_kind')) + '</legend>' +
            '<label><input type="radio" name="kind" value="version" checked> ' + esc(t('sg_kind_version')) + '</label>' +
            '<label><input type="radio" name="kind" value="film"> ' + esc(t('sg_kind_film')) + '</label>' +
            '<label><input type="radio" name="kind" value="fix"> ' + esc(t('sg_kind_fix')) + '</label>' +
          '</fieldset>' +
          '<div class="kgroup" data-kinds="film">' +
            '<div class="row2"><label><span>' + esc(t('sg_film_title')) + ' *</span><input name="ftitle" maxlength="160"></label>' +
            '<label class="narrow"><span>' + esc(t('sg_year')) + '</span><input name="fyear" inputmode="numeric" maxlength="4"></label></div>' +
            '<input type="hidden" name="ftmdb">' +
          '</div>' +
          '<div class="kgroup" data-kinds="version fix">' +
            '<label><span>' + esc(t('sg_film')) + ' *</span><select name="film_id">' + filmOptions() + '</select></label>' +
          '</div>' +
          '<div class="kgroup" data-kinds="version">' +
            '<label><span>' + esc(t('sg_vname')) + ' *</span><input name="vname" maxlength="160"></label>' +
            '<div class="row2"><label><span>' + esc(t('sg_vtype')) + '</span><select name="vtype">' + vtypeOptions() + '</select></label>' +
            '<label class="narrow"><span>' + esc(t('sg_vyear')) + '</span><input name="vyear" maxlength="10" placeholder="2024"></label></div>' +
            '<label><span>' + esc(t('sg_vby')) + '</span><input name="vby" maxlength="120"></label>' +
            '<label><span>' + esc(t('sg_desc')) + '</span><textarea name="vdesc" rows="3" maxlength="1500"></textarea></label>' +
          '</div>' +
          '<div class="kgroup" data-kinds="fix">' +
            '<label><span>' + esc(t('sg_fix')) + ' *</span><textarea name="fix" rows="4" maxlength="2000"></textarea></label>' +
          '</div>' +
          '<label><span>' + esc(t('sg_link')) + '</span><input name="link" type="url" maxlength="500" placeholder="https://"></label>' +
          '<label><span>' + esc(t('sg_name')) + '</span><input name="contact" maxlength="80" autocomplete="nickname"></label>' +
          '<div class="hp" aria-hidden="true"><label>Website<input name="website" tabindex="-1" autocomplete="off"></label></div>' +
          '<p class="policy">' + esc(t('sg_policy')) + '</p>' +
          (A.backend.mode() === 'demo' ? '<p class="muted small">' + esc(t('sg_demo')) + '</p>' : '') +
          '<p class="form-msg" role="status" aria-live="polite"></p>' +
        '</div>' +
        '<div class="dlg-foot"><button type="button" class="btn ghost" data-action="close-dialog">' + esc(t('cancel')) + '</button>' +
          '<button type="submit" class="btn primary">' + esc(t('sg_send')) + '</button></div>' +
      '</form></dialog>' +
      '<dialog id="dlg-compare" class="dlg wide" aria-labelledby="cmp-h">' +
        '<div class="dlg-head"><h2 id="cmp-h">' + esc(t('cmp_title')) + '</h2>' +
          '<button type="button" class="icon-btn" data-action="close-dialog" aria-label="' + esc(t('close')) + '">&times;</button></div>' +
        '<div class="dlg-body" id="cmp-body"></div>' +
      '</dialog>';
  }

  function renderShell() {
    document.body.innerHTML = header() +
      '<main id="main" tabindex="-1"></main>' +
      footer() + dialogs() +
      '<div class="cmp-tray" id="cmp-tray" hidden></div>' +
      '<div class="toasts" id="toasts" aria-live="polite"></div>';
  }

  /* ---------------- rotas ---------------- */
  function currentRoute() {
    let h = '';
    try { h = decodeURIComponent((window.location.hash || '').replace(/^#/, '')); } catch (e) { h = ''; }
    return h === 'inicio' ? '' : h;
  }

  function viewFor(r) {
    if (r === '') return V.home();
    if (r === 'filmes') return V.films();
    if (r === 'novos') return V.news();
    if (r === 'sobre') return V.about();
    if (r === 'admin') return V.admin();
    const f = A.film(r);
    return f ? V.film(f) : V.notFound();
  }

  function titleFor(r) {
    const names = { '': '', filmes: t('nav_films'), novos: t('nw_title'), sobre: t('nav_about'), admin: t('nav_admin') };
    let page = names[r];
    if (page === undefined) { const f = A.film(r); page = f ? A.filmTitle(f) : t('nf_title'); }
    return page ? page + ' · ' + siteName() : siteName();
  }

  function updateNav() {
    document.querySelectorAll('.mainnav a').forEach((a) => {
      const target = (a.getAttribute('href') || '').replace(/^#/, '');
      if (target === A.state.route) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
  }

  function route() {
    const r = currentRoute();
    const changedPage = r !== A.state.route;
    A.state.route = r;
    if (changedPage && A.state.compareFilm && A.state.compareFilm !== r) { A.state.compare.clear(); A.state.compareFilm = null; }
    const main = $('#main');
    main.innerHTML = viewFor(r);
    document.title = titleFor(r);
    updateNav();
    hideSearch();
    updateTray();
    if (A.state.pendingFocus) {
      const pf = A.state.pendingFocus;
      A.state.pendingFocus = null;
      requestAnimationFrame(() => (pf.version ? focusVersion(pf.version) : focusSection(pf.section)));
    } else if (changedPage) {
      window.scrollTo(0, 0);
    }
  }

  // Redesenha a tela atual sem perder a posição de rolagem
  A.rerender = function () {
    const y = window.scrollY;
    const main = $('#main');
    if (!main) return;
    const active = document.activeElement;
    const activeId = active && active.id;
    main.innerHTML = viewFor(A.state.route);
    document.title = titleFor(A.state.route);
    updateTray();
    window.scrollTo(0, y);
    if (activeId) { const el = document.getElementById(activeId); if (el && el.focus) el.focus({ preventScroll: true }); }
  };

  function fullRender() {
    renderShell();
    route();
  }

  function flash(el) {
    el.classList.remove('flash');
    void el.offsetWidth;
    el.classList.add('flash');
    setTimeout(() => el.classList.remove('flash'), 1800);
  }

  function focusVersion(id) {
    let el = document.getElementById('v-' + id);
    if (!el) {
      const hit = A.findVersion(id);
      if (hit && A.state.typeFilter[hit.film.id]) { A.state.typeFilter[hit.film.id] = 'all'; A.rerender(); el = document.getElementById('v-' + id); }
    }
    if (!el) return;
    el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
    flash(el);
    const h = el.querySelector('h3');
    if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
  }

  function focusSection(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    const h = el.querySelector('h2');
    if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
  }

  /* ---------------- avisos ---------------- */
  A.toast = function (msg, kind) {
    const box = $('#toasts');
    if (!box || !msg) return;
    const el = document.createElement('div');
    el.className = 'toast' + (kind ? ' ' + kind : '');
    el.textContent = msg;
    box.appendChild(el);
    setTimeout(() => { el.classList.add('out'); setTimeout(() => el.remove(), 400); }, kind === 'error' ? 5200 : 2800);
  };

  /* ---------------- busca ---------------- */
  let searchTimer = null;
  function showSearch(html) {
    const p = $('#search-panel');
    if (!p) return;
    if (!html) { p.hidden = true; p.innerHTML = ''; return; }
    p.innerHTML = html;
    p.hidden = false;
  }
  function hideSearch() { const p = $('#search-panel'); if (p) { p.hidden = true; } }

  async function tmdbSearch(q) {
    const box = $('#sr-tmdb');
    if (!box) return;
    if (A.tmdb.mode() === 'off') { box.innerHTML = '<p class="sr-none">' + esc(t('s_tmdb_off')) + '</p>'; return; }
    box.innerHTML = '<p class="sr-none">' + esc(t('s_searching')) + '</p>';
    try {
      const r = await A.tmdb.search(q, A.lang === 'pt' ? 'pt-BR' : 'en-US');
      box.innerHTML = V.tmdbResults(r.results || []);
    } catch (e) {
      box.innerHTML = '<p class="sr-none">' + esc(t('s_tmdb_fail')) + '</p>';
    }
  }

  /* ---------------- sugestões ---------------- */
  function openDialog(id) {
    const d = document.getElementById(id);
    if (!d) return null;
    if (typeof d.showModal === 'function') { if (!d.open) d.showModal(); } else d.setAttribute('open', '');
    return d;
  }
  function closeDialog(d) {
    if (!d) return;
    if (typeof d.close === 'function') d.close(); else d.removeAttribute('open');
  }

  function syncKind(form) {
    const kind = (form.querySelector('input[name="kind"]:checked') || {}).value || 'version';
    form.querySelectorAll('.kgroup').forEach((g) => { g.hidden = (g.dataset.kinds || '').split(' ').indexOf(kind) < 0; });
  }

  function openSuggest(opts) {
    const d = openDialog('dlg-suggest');
    if (!d) return;
    const form = d.querySelector('form');
    form.reset();
    const msg = form.querySelector('.form-msg');
    msg.textContent = '';
    msg.className = 'form-msg';
    const kind = opts.kind || (opts.film ? 'version' : 'version');
    const radio = form.querySelector('input[name="kind"][value="' + kind + '"]');
    if (radio) radio.checked = true;
    if (opts.film) form.elements.film_id.value = opts.film;
    if (opts.title) form.elements.ftitle.value = opts.title;
    if (opts.year) form.elements.fyear.value = opts.year;
    form.elements.ftmdb.value = opts.tmdb || '';
    syncKind(form);
    const first = form.querySelector('.kgroup:not([hidden]) input, .kgroup:not([hidden]) select');
    if (first) setTimeout(() => first.focus(), 30);
  }

  async function submitSuggest(form) {
    const f = form.elements;
    const msg = form.querySelector('.form-msg');
    const kind = (form.querySelector('input[name="kind"]:checked') || {}).value || 'version';
    const val = (n) => String((f[n] && f[n].value) || '').trim();
    const setMsg = (text, cls) => { msg.textContent = text; msg.className = 'form-msg' + (cls ? ' ' + cls : ''); };
    const link = val('link');
    const allText = [link, val('vdesc'), val('fix'), val('vname'), val('ftitle')].join(' ');
    if (A.isBlockedLink(allText)) { setMsg(t('sg_err_link'), 'error'); return; }
    if (link && !A.safeUrl(link)) { setMsg(t('sg_err_link'), 'error'); return; }

    let payload = null;
    if (kind === 'film') {
      if (!val('ftitle')) { setMsg(t('sg_err_required'), 'error'); return; }
      const year = parseInt(val('fyear'), 10) || null;
      const tmdb = parseInt(val('ftmdb'), 10) || null;
      payload = {
        tipo: 'film', tmdb_id: tmdb, titulo: val('ftitle') + (year ? ' (' + year + ')' : ''),
        dados: { film: { title: { pt: val('ftitle'), en: val('ftitle') }, original_title: val('ftitle'), year, tmdb } }
      };
    } else {
      const filmId = val('film_id');
      const film = A.film(filmId);
      if (!film) { setMsg(t('sg_err_required'), 'error'); return; }
      if (kind === 'version') {
        if (!val('vname')) { setMsg(t('sg_err_required'), 'error'); return; }
        payload = {
          tipo: 'version', film_id: filmId, tmdb_id: film.tmdb || null, titulo: A.filmTitle(film) + ': ' + val('vname'),
          dados: {
            film_id: filmId,
            version: {
              id: A.slug(filmId + '-' + val('vname')).slice(0, 60),
              type: val('vtype') || 'official',
              name: { pt: val('vname'), en: val('vname') },
              by: val('vby'),
              released: val('vyear'),
              cut: 'theatrical',
              summary: { pt: val('vdesc'), en: val('vdesc') },
              reception: { level: 'sem_dados' },
              availability: val('vtype') === 'official' ? 'check' : 'unofficial',
              src_urls: link ? [link] : []
            }
          }
        };
      } else {
        if (!val('fix')) { setMsg(t('sg_err_required'), 'error'); return; }
        payload = { tipo: 'correction', film_id: filmId, tmdb_id: film.tmdb || null, titulo: A.filmTitle(film), dados: { film_id: filmId, texto: { pt: val('fix'), en: val('fix') } } };
      }
    }
    payload.fonte_url = link;
    payload.contato = val('contact');
    // Armadilha para robôs: o campo escondido só é preenchido por spam
    if (val('website')) { setMsg(t('sg_sent'), 'ok'); return; }
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    try {
      const r = await A.backend.suggest(payload);
      setMsg(r && r.demo ? t('sg_sent') + ' ' + t('sg_demo') : t('sg_sent'), 'ok');
      setTimeout(() => closeDialog(form.closest('dialog')), 1600);
      if (A.state.route === 'admin') { A.adminState.data = null; A.rerender(); }
    } catch (e) {
      setMsg(t('sg_err_send'), 'error');
    } finally {
      btn.disabled = false;
    }
  }

  /* ---------------- comparação ---------------- */
  function updateTray() {
    const tray = $('#cmp-tray');
    if (!tray) return;
    const n = A.state.compare.size;
    const onFilm = A.state.compareFilm && A.state.compareFilm === A.state.route;
    if (!n || !onFilm) { tray.hidden = true; tray.innerHTML = ''; return; }
    tray.innerHTML = '<span>' + esc(n === 1 ? t('cmp_one') : t('cmp_selected', { n })) + '</span>' +
      '<button type="button" class="btn small ghost" data-action="cmp-clear">' + esc(t('cmp_clear')) + '</button>' +
      '<button type="button" class="btn small primary" data-action="cmp-open"' + (n < 2 ? ' aria-disabled="true"' : '') + '>' + esc(t('cmp_open')) + '</button>';
    tray.hidden = false;
  }

  function openCompare() {
    if (A.state.compare.size < 2) { A.toast(t('cmp_min')); return; }
    const items = Array.from(A.state.compare).map((id) => A.findVersion(id)).filter(Boolean)
      .sort((a, b) => A.dateKey(a.v.released) - A.dateKey(b.v.released));
    const d = openDialog('dlg-compare');
    if (d) $('#cmp-body').innerHTML = V.compareTable(items);
  }

  /* ---------------- eventos ---------------- */
  function onClick(e) {
    const focusLink = e.target.closest('[data-focus-version],[data-focus-section]');
    if (focusLink && focusLink.tagName === 'A') {
      const target = (focusLink.getAttribute('href') || '').replace(/^#/, '');
      const pf = focusLink.dataset.focusVersion ? { version: focusLink.dataset.focusVersion } : { section: focusLink.dataset.focusSection };
      if (target === A.state.route) {
        e.preventDefault();
        hideSearch();
        pf.version ? focusVersion(pf.version) : focusSection(pf.section);
      } else {
        A.state.pendingFocus = pf;
      }
      return;
    }
    const el = e.target.closest('[data-action]');
    if (!el) {
      if (!e.target.closest('.search')) hideSearch();
      return;
    }
    const action = el.dataset.action;
    if (action === 'compare') return; // tratado no evento change
    if (action.indexOf('adm-') === 0) { e.preventDefault(); A.adminAction(action, el); return; }
    switch (action) {
      case 'lang':
        if (el.dataset.lang !== A.lang) {
          A.setLang(el.dataset.lang);
          const y = window.scrollY;
          fullRender();
          window.scrollTo(0, y);
          A.toast(t('toast_lang'));
        }
        break;
      case 'suggest':
        e.preventDefault();
        hideSearch();
        openSuggest({ kind: el.dataset.kind, film: el.dataset.film, title: el.dataset.title, year: el.dataset.year, tmdb: el.dataset.tmdb });
        break;
      case 'close-dialog':
        closeDialog(el.closest('dialog'));
        break;
      case 'need':
        A.state.guideNeed[el.dataset.film] = el.dataset.need;
        A.rerender();
        break;
      case 'focus-version':
        focusVersion(el.dataset.version);
        break;
      case 'goto':
        focusSection(el.dataset.target);
        break;
      case 'type-filter':
        A.state.typeFilter[el.dataset.film] = el.dataset.type;
        A.rerender();
        break;
      case 'news-filter':
        A.state.newsFilter = el.dataset.filter;
        A.rerender();
        break;
      case 'strip': {
        const track = document.getElementById(el.dataset.target);
        if (track) track.scrollBy({ left: Number(el.dataset.dir) * track.clientWidth * 0.85, behavior: reduceMotion ? 'auto' : 'smooth' });
        break;
      }
      case 'cmp-open':
        openCompare();
        break;
      case 'cmp-clear':
        A.state.compare.clear();
        A.state.compareFilm = null;
        document.querySelectorAll('input[data-action="compare"]').forEach((c) => { c.checked = false; });
        updateTray();
        break;
      case 'tmdb-search':
        tmdbSearch(el.dataset.q);
        break;
      default:
        break;
    }
  }

  function onChange(e) {
    const el = e.target;
    if (el.matches('input[data-action="compare"]')) {
      const id = el.dataset.version;
      const hit = A.findVersion(id);
      if (!hit) return;
      if (A.state.compareFilm && A.state.compareFilm !== hit.film.id) A.state.compare.clear();
      A.state.compareFilm = hit.film.id;
      if (el.checked) {
        if (A.state.compare.size >= 4) { el.checked = false; A.toast(t('cmp_max')); return; }
        A.state.compare.add(id);
      } else {
        A.state.compare.delete(id);
      }
      updateTray();
    } else if (el.name === 'kind' && el.closest('form[data-form="suggest"]')) {
      syncKind(el.closest('form'));
    }
  }

  function onSubmit(e) {
    const form = e.target.closest('form[data-form]');
    if (!form) return;
    e.preventDefault();
    const name = form.dataset.form;
    if (name === 'suggest') submitSuggest(form);
    else if (A.adminSubmit) A.adminSubmit(name, form);
  }

  function onInput(e) {
    if (e.target.id !== 'q') return;
    const q = e.target.value;
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => showSearch(V.searchResults(q)), 120);
  }

  function onKeydown(e) {
    if (e.target.id === 'q') {
      if (e.key === 'Escape') { e.target.value = ''; hideSearch(); }
      if (e.key === 'Enter') {
        const first = document.querySelector('#search-panel .sr-item');
        if (first) { e.preventDefault(); first.click(); }
      }
      if (e.key === 'ArrowDown') {
        const first = document.querySelector('#search-panel a, #search-panel button');
        if (first) { e.preventDefault(); first.focus(); }
      }
    } else if (e.key === 'Escape' && e.target.closest && e.target.closest('#search-panel')) {
      hideSearch();
      const q = $('#q');
      if (q) q.focus();
    }
  }

  function onFocusIn(e) {
    if (e.target.id === 'q' && e.target.value.trim()) showSearch(V.searchResults(e.target.value));
  }

  // Imagens que não carregam (sem rede, bloqueio ou TMDB fora) saem de cena e deixam a arte de reserva
  function onImgError(e) {
    const el = e.target;
    if (el && el.tagName === 'IMG') {
      const p = el.closest('.poster');
      if (p) p.classList.remove('has-img');
      el.remove();
    }
  }

  /* ---------------- dados remotos ---------------- */
  async function loadRemote() {
    try {
      A.approved = await A.backend.approved();
      A.rebuild();
      A.rerender();
    } catch (e) {
      console.warn('[AllMovieRelease] Itens aprovados indisponíveis:', e);
    }
    if (A.tmdb.mode() !== 'off') {
      let changed = false;
      for (const f of A.films) {
        if (await A.enrichFilm(f)) changed = true;
      }
      if (changed) A.rerender();
    }
  }

  function init() {
    A.setLang(A.lang);
    A.rebuild();
    fullRender();
    window.addEventListener('hashchange', route);
    document.addEventListener('click', onClick);
    document.addEventListener('change', onChange);
    document.addEventListener('submit', onSubmit);
    document.addEventListener('input', onInput);
    document.addEventListener('keydown', onKeydown);
    document.addEventListener('focusin', onFocusIn);
    document.addEventListener('error', onImgError, true);
    loadRemote();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
