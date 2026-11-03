/**
 * AllMovieRelease — servidor no Google Apps Script (gratuito)
 * ===========================================================
 * O que este script faz:
 *   1. Recebe as sugestões do site e guarda na aba "Sugestoes" (a fila de moderação).
 *   2. Deixa você aprovar ou rejeitar pela tela de Moderação do site (#admin), com a sua chave.
 *   3. Entrega ao site os itens aprovados (aba "Aprovados").
 *   4. Consulta o TMDB por você, sem expor a sua chave no site (com cache).
 *   5. Roda um radar diário que lê feeds RSS/Atom de fóruns e sites e põe na fila
 *      o que parecer lançamento de scan, restauração ou edição. Nada vai ao ar sem você aprovar.
 *
 * Instalação (o passo a passo detalhado está no README):
 *   1. Crie uma planilha no Google Sheets (ex.: "AllMovieRelease - banco").
 *   2. Na planilha: Extensões → Apps Script. Apague o conteúdo e cole este arquivo inteiro.
 *   3. Escolha a função setup no menu e clique em Executar (autorize o acesso).
 *      A sua chave de administrador aparece no registro de execução. Guarde-a.
 *   4. Configurações do projeto (engrenagem) → Propriedades do script → adicione TMDB_KEY
 *      com a sua chave do TMDB (a "Chave da API" curta ou o "Token de leitura" longo).
 *   5. Implantar → Nova implantação → Tipo: App da Web
 *      Executar como: Eu  |  Quem pode acessar: Qualquer pessoa  → Implantar.
 *   6. Copie a URL que termina em /exec e cole em js/config.js, no campo APPS_SCRIPT_URL.
 *   7. (Opcional) Execute instalarRadarDiario para ligar o radar automático.
 *
 * Sempre que mudar este código: Implantar → Gerenciar implantações → editar (lápis) →
 * Versão: Nova versão → Implantar. A URL continua a mesma.
 */

const ABA_SUG = 'Sugestoes';
const ABA_APR = 'Aprovados';
const ABA_VISTOS = 'RadarVistos';
const COL_SUG = ['id', 'criado_em', 'tipo', 'status', 'film_id', 'tmdb_id', 'titulo', 'dados_json', 'fonte_url', 'contato', 'origem', 'nota_admin', 'revisado_em'];
const COL_APR = ['id', 'tipo', 'film_id', 'dados_json', 'aprovado_em', 'fonte_url', 'sugestao_id'];
const COL_VISTOS = ['link', 'visto_em'];

// Uma fonte por linha: URL | palavras-chave separadas por vírgula (ou * para aceitar tudo).
// Teste cada uma: alguns sites bloqueiam leitores automáticos.
const FEEDS_PADRAO = [
  'https://fanrestore.com/syndication.php | *',
  'https://fanedit.org/feed/ | restoration, restauração, 35mm, 16mm, scan, preservation, despecialized',
  'https://www.reddit.com/r/fanedits/new/.rss | 35mm, 16mm, scan, restoration, preservation',
  'https://highdefdiscnews.com/feed/ | restoration, restored, remastered, 4k uhd'
].join('\n');
const PALAVRAS_PADRAO = '35mm, 70mm, 16mm, scan, restoration, restored, restauração, restaurado, preservation, technicolor, print';

const LINK_BLOQUEADO = /(magnet:|\.torrent\b|mega\.(nz|io)|mediafire\.|1fichier\.|rapidgator\.|uploaded\.net|zippyshare\.|transfer\.it|wetransfer\.|we\.tl\/|drive\.google\.com\/(file|uc)|dropbox\.com\/(s|scl)\/|pixeldrain\.|gofile\.io|krakenfiles\.|nitroflare\.|turbobit\.|filefactory\.|katfile\.|send\.cm|terabox\.|anonfiles\.|bayfiles\.|1337x\.|thepiratebay\.|rarbg\.|nyaa\.si|usenet|nzb)/i;
const MAX_SUGESTOES_10MIN = 40;   // limite geral contra spam
const MAX_NOVOS_POR_FEED = 10;    // por rodada do radar

/* ------------------------------------------------------------------ */
/* Configuração inicial e radar automático                              */
/* ------------------------------------------------------------------ */
function setup() {
  aba_(ABA_SUG, COL_SUG);
  aba_(ABA_APR, COL_APR);
  aba_(ABA_VISTOS, COL_VISTOS);
  const props = PropertiesService.getScriptProperties();
  if (!props.getProperty('ADMIN_KEY')) props.setProperty('ADMIN_KEY', Utilities.getUuid().replace(/-/g, ''));
  if (!props.getProperty('RADAR_FEEDS')) props.setProperty('RADAR_FEEDS', FEEDS_PADRAO);
  if (!props.getProperty('RADAR_PALAVRAS')) props.setProperty('RADAR_PALAVRAS', PALAVRAS_PADRAO);
  Logger.log('Pronto! Sua chave de administrador é: ' + props.getProperty('ADMIN_KEY'));
  Logger.log('Para trocar a chave, edite a propriedade ADMIN_KEY em Configurações do projeto.');
  if (!props.getProperty('TMDB_KEY')) Logger.log('Falta a propriedade TMDB_KEY (sua chave do TMDB).');
}

function instalarRadarDiario() {
  ScriptApp.getProjectTriggers()
    .filter((t) => t.getHandlerFunction() === 'radarDiario')
    .forEach((t) => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger('radarDiario').timeBased().everyDays(1).atHour(6).create();
  Logger.log('Radar diário instalado (por volta das 6h).');
}

function radarDiario() {
  const r = radar_();
  Logger.log('Radar: ' + r.novos + ' novos. Erros: ' + (r.erros.join(' | ') || 'nenhum'));
}

/* ------------------------------------------------------------------ */
/* Pontos de entrada do Web App                                         */
/* ------------------------------------------------------------------ */
function doGet(e) {
  const p = (e && e.parameter) || {};
  try {
    switch (p.action) {
      case 'approved':
        return json_({ ok: true, items: aprovados_() });
      case 'tmdb_search':
        return json_(tmdb_('search/movie', { query: texto_(p.q, 120), language: idioma_(p.lang), include_adult: 'false' }, 21600));
      case 'tmdb_movie': {
        const id = parseInt(p.id, 10);
        if (!id) return json_({ ok: false, error: 'id_invalido' });
        return json_(tmdb_('movie/' + id, { language: idioma_(p.lang) }, 21600));
      }
      case 'ping':
        return json_({ ok: true, app: 'AllMovieRelease' });
      default:
        return json_({ ok: false, error: 'acao_desconhecida' });
    }
  } catch (err) {
    return json_({ ok: false, error: String((err && err.message) || err) });
  }
}

function doPost(e) {
  let b = {};
  try {
    b = JSON.parse((e && e.postData && e.postData.contents) || '{}');
  } catch (err) {
    return json_({ ok: false, error: 'json_invalido' });
  }
  try {
    if (b.action === 'suggest') return json_(sugerir_(b));
    if (!admin_(b.key)) return json_({ ok: false, error: 'nao_autorizado' });
    switch (b.action) {
      case 'admin_check': return json_({ ok: true });
      case 'admin_list': return json_(listarAdmin_());
      case 'admin_decide': return json_(decidir_(b));
      case 'admin_add': return json_(adicionar_(b));
      case 'admin_radar': return json_(radar_());
      default: return json_({ ok: false, error: 'acao_desconhecida' });
    }
  } catch (err) {
    return json_({ ok: false, error: String((err && err.message) || err) });
  }
}

/* ------------------------------------------------------------------ */
/* Sugestões e moderação                                                */
/* ------------------------------------------------------------------ */
function sugerir_(b) {
  if (b.website) return { ok: true }; // campo-armadilha preenchido = robô; finge que deu certo
  if (['film', 'version', 'correction'].indexOf(b.tipo) < 0) return { ok: false, error: 'tipo_invalido' };
  const bruto = JSON.stringify(b);
  if (bruto.length > 12000) return { ok: false, error: 'grande_demais' };
  if (LINK_BLOQUEADO.test(bruto)) return { ok: false, error: 'link_de_download' };
  const fonte = texto_(b.fonte_url, 500);
  if (fonte && !/^https?:\/\//i.test(fonte)) return { ok: false, error: 'link_invalido' };

  const cache = CacheService.getScriptCache();
  const n = Number(cache.get('sug_n') || 0);
  if (n >= MAX_SUGESTOES_10MIN) return { ok: false, error: 'muitas_sugestoes' };
  cache.put('sug_n', String(n + 1), 600);

  const dados = b.dados && typeof b.dados === 'object' ? b.dados : {};
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    aba_(ABA_SUG, COL_SUG).appendRow([
      Utilities.getUuid(), new Date().toISOString(), b.tipo, 'pending',
      seguro_(texto_(b.film_id, 80)), Number(b.tmdb_id) || '', seguro_(texto_(b.titulo, 200)),
      JSON.stringify(dados), seguro_(fonte), seguro_(texto_(b.contato, 80)), 'site', '', ''
    ]);
  } finally {
    lock.releaseLock();
  }
  return { ok: true };
}

function listarAdmin_() {
  const todas = linhas_(aba_(ABA_SUG, COL_SUG)).map(itemSug_);
  const pendentes = todas.filter((i) => i.status === 'pending').sort((a, b) => (a.criado_em < b.criado_em ? 1 : -1));
  const historico = todas.filter((i) => i.status !== 'pending')
    .sort((a, b) => String(b.revisado_em).localeCompare(String(a.revisado_em))).slice(0, 80);
  return {
    ok: true,
    pending: pendentes,
    history: historico,
    feeds: feeds_().map((f) => ({ url: f.url, kw: f.todos ? '*' : f.palavras.join(', ') })),
    radar_last: prop_('RADAR_ULTIMO', '')
  };
}

function decidir_(b) {
  const sh = aba_(ABA_SUG, COL_SUG);
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const r = linhas_(sh).find((x) => String(x.id) === String(b.id));
    if (!r) return { ok: false, error: 'nao_encontrado' };
    if (r.status !== 'pending') return { ok: false, error: 'ja_decidido' };
    const aprovar = b.decision === 'approve';
    const dados = b.dados && typeof b.dados === 'object' ? b.dados : parse_(r.dados_json, {});
    const json = JSON.stringify(dados);
    if (json.length > 45000) return { ok: false, error: 'grande_demais' };
    const agora = new Date().toISOString();
    const col = (nome) => COL_SUG.indexOf(nome) + 1;
    sh.getRange(r._row, col('status')).setValue(aprovar ? 'approved' : 'rejected');
    sh.getRange(r._row, col('nota_admin')).setValue(seguro_(texto_(b.nota, 300)));
    sh.getRange(r._row, col('revisado_em')).setValue(agora);
    sh.getRange(r._row, col('dados_json')).setValue(json);
    if (aprovar) {
      const filmId = texto_(r.film_id || dados.film_id || (dados.film && dados.film.id) || '', 80);
      aba_(ABA_APR, COL_APR).appendRow(['a-' + r.id, r.tipo, seguro_(filmId), json, agora, seguro_(r.fonte_url || ''), String(r.id)]);
      CacheService.getScriptCache().remove('aprovados');
    }
    return { ok: true };
  } finally {
    lock.releaseLock();
  }
}

// Adição direta pela moderação (ex.: filme novo escolhido no TMDB)
function adicionar_(b) {
  const it = b.item || {};
  if (['film', 'version', 'version_new_film', 'correction'].indexOf(it.tipo) < 0) return { ok: false, error: 'tipo_invalido' };
  const json = JSON.stringify(it.dados && typeof it.dados === 'object' ? it.dados : {});
  if (json.length > 45000) return { ok: false, error: 'grande_demais' };
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    aba_(ABA_APR, COL_APR).appendRow(['a-' + Utilities.getUuid(), it.tipo, seguro_(texto_(it.film_id, 80)), json, new Date().toISOString(), '', 'moderacao']);
    CacheService.getScriptCache().remove('aprovados');
  } finally {
    lock.releaseLock();
  }
  return { ok: true };
}

function aprovados_() {
  const cache = CacheService.getScriptCache();
  const hit = cache.get('aprovados');
  if (hit) return JSON.parse(hit);
  const itens = linhas_(aba_(ABA_APR, COL_APR)).map((r) => ({
    id: String(r.id), tipo: r.tipo, film_id: r.film_id, dados: parse_(r.dados_json, {}),
    aprovado_em: str_(r.aprovado_em), fonte_url: r.fonte_url
  }));
  const s = JSON.stringify(itens);
  if (s.length < 95000) cache.put('aprovados', s, 120);
  return itens;
}

/* ------------------------------------------------------------------ */
/* TMDB (intermediário com cache; a chave nunca vai para o navegador)   */
/* ------------------------------------------------------------------ */
function tmdb_(caminho, params, ttl) {
  const chave = prop_('TMDB_KEY', '');
  if (!chave) return { ok: false, error: 'tmdb_sem_chave' };
  const qs = Object.keys(params)
    .filter((k) => params[k] !== '' && params[k] != null)
    .map((k) => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]));
  const cacheKey = 'tmdb:' + Utilities.base64EncodeWebSafe(
    Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, caminho + '?' + qs.join('&')));
  const cache = CacheService.getScriptCache();
  const hit = cache.get(cacheKey);
  if (hit) return JSON.parse(hit);

  const opcoes = { muteHttpExceptions: true, headers: { accept: 'application/json' } };
  if (chave.length > 40) opcoes.headers.Authorization = 'Bearer ' + chave;
  else qs.push('api_key=' + encodeURIComponent(chave));
  const resp = UrlFetchApp.fetch('https://api.themoviedb.org/3/' + caminho + '?' + qs.join('&'), opcoes);
  if (resp.getResponseCode() !== 200) return { ok: false, error: 'tmdb_' + resp.getResponseCode() };
  const corpo = resp.getContentText();
  if (corpo.length < 95000) cache.put(cacheKey, corpo, Math.min(ttl || 21600, 21600));
  return JSON.parse(corpo);
}

function idioma_(l) { return l === 'en-US' ? 'en-US' : 'pt-BR'; }

/* ------------------------------------------------------------------ */
/* Radar de novos scans                                                  */
/* ------------------------------------------------------------------ */
function feeds_() {
  return String(prop_('RADAR_FEEDS', FEEDS_PADRAO)).split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l && l.charAt(0) !== '#')
    .map((l) => {
      const partes = l.split('|');
      const kw = (partes[1] || '').trim();
      const lista = kw === '*' ? '' : (kw || prop_('RADAR_PALAVRAS', PALAVRAS_PADRAO));
      return {
        url: partes[0].trim(),
        todos: kw === '*',
        palavras: lista.split(',').map((s) => normaliza_(s.trim())).filter(Boolean)
      };
    });
}

function radar_() {
  const vistosSh = aba_(ABA_VISTOS, COL_VISTOS);
  const vistos = new Set(linhas_(vistosSh).map((r) => String(r.link)));
  const sugSh = aba_(ABA_SUG, COL_SUG);
  const erros = [];
  let novos = 0;
  feeds_().forEach((f) => {
    try {
      const resp = UrlFetchApp.fetch(f.url, { muteHttpExceptions: true, followRedirects: true, headers: { 'User-Agent': 'AllMovieRelease-radar/1.0' } });
      if (resp.getResponseCode() !== 200) { erros.push(f.url + ' → HTTP ' + resp.getResponseCode()); return; }
      let doFeed = 0;
      itensFeed_(resp.getContentText()).slice(0, 50).forEach((it) => {
        if (!it.link || vistos.has(it.link)) return;
        vistos.add(it.link);
        vistosSh.appendRow([seguro_(it.link), new Date().toISOString()]);
        const alvo = normaliza_(it.title + ' ' + (it.summary || ''));
        const bate = f.todos || f.palavras.some((p) => alvo.indexOf(p) >= 0);
        if (!bate || LINK_BLOQUEADO.test(it.link) || doFeed >= MAX_NOVOS_POR_FEED) return;
        doFeed++;
        novos++;
        sugSh.appendRow([
          Utilities.getUuid(), new Date().toISOString(), 'radar', 'pending', '', '',
          seguro_(texto_(it.title, 200)),
          JSON.stringify({ feed: f.url, link: it.link, title: it.title, pubDate: it.date }),
          seguro_(it.link), '', 'radar:' + host_(f.url), '', ''
        ]);
      });
    } catch (err) {
      erros.push(f.url + ' → ' + ((err && err.message) || err));
    }
  });
  PropertiesService.getScriptProperties().setProperty('RADAR_ULTIMO', new Date().toISOString());
  return { ok: true, novos: novos, erros: erros };
}

// Lê RSS 2.0 e Atom
function itensFeed_(xml) {
  const raiz = XmlService.parse(xml).getRootElement();
  const nome = raiz.getName().toLowerCase();
  const out = [];
  if (nome === 'rss') {
    const canal = raiz.getChild('channel');
    (canal ? canal.getChildren('item') : []).forEach((i) => out.push({
      title: filho_(i, 'title'), link: filho_(i, 'link'), date: filho_(i, 'pubDate'), summary: filho_(i, 'description').slice(0, 400)
    }));
  } else if (nome === 'feed') {
    const ns = raiz.getNamespace();
    raiz.getChildren('entry', ns).forEach((e) => {
      let link = '';
      e.getChildren('link', ns).forEach((l) => {
        const rel = l.getAttribute('rel');
        const href = l.getAttribute('href');
        if (!link && href && (!rel || rel.getValue() === 'alternate')) link = href.getValue();
      });
      out.push({
        title: (e.getChildText('title', ns) || '').trim(),
        link: link,
        date: e.getChildText('updated', ns) || e.getChildText('published', ns) || '',
        summary: (e.getChildText('summary', ns) || e.getChildText('content', ns) || '').slice(0, 400)
      });
    });
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* Utilidades                                                           */
/* ------------------------------------------------------------------ */
function aba_(nome, colunas) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(nome);
  if (!sh) {
    sh = ss.insertSheet(nome);
    sh.appendRow(colunas);
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, colunas.length).setFontWeight('bold');
  }
  return sh;
}

function linhas_(sh) {
  const valores = sh.getDataRange().getValues();
  const cab = valores.shift() || [];
  return valores.map((r, i) => {
    const o = { _row: i + 2 };
    cab.forEach((h, j) => { o[h] = r[j]; });
    return o;
  });
}

function itemSug_(r) {
  return {
    id: String(r.id), criado_em: str_(r.criado_em), tipo: r.tipo, status: r.status, film_id: r.film_id,
    tmdb_id: r.tmdb_id, titulo: r.titulo, dados: parse_(r.dados_json, {}), fonte_url: r.fonte_url,
    contato: r.contato, origem: r.origem, nota_admin: r.nota_admin, revisado_em: str_(r.revisado_em)
  };
}

function admin_(key) {
  const cache = CacheService.getScriptCache();
  const falhas = Number(cache.get('adm_falhas') || 0);
  if (falhas > 20) return false; // muitas tentativas erradas: espera 10 minutos
  const certa = prop_('ADMIN_KEY', '');
  const ok = !!certa && typeof key === 'string' && key === certa;
  if (!ok) cache.put('adm_falhas', String(falhas + 1), 600);
  return ok;
}

function json_(obj) { return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON); }
function prop_(k, d) { const v = PropertiesService.getScriptProperties().getProperty(k); return v == null || v === '' ? d : v; }
function parse_(s, d) { try { return JSON.parse(s); } catch (e) { return d; } }
function texto_(v, max) { return String(v == null ? '' : v).slice(0, max || 500); }
function str_(v) { return v instanceof Date ? v.toISOString() : String(v == null ? '' : v); }
function filho_(el, nome) { const c = el.getChild(nome); return c ? c.getText().trim() : ''; }
function host_(u) { const m = String(u).match(/^https?:\/\/([^\/]+)/i); return m ? m[1].replace(/^www\./, '') : ''; }
function normaliza_(s) { return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase(); }
// Impede que um texto enviado vire fórmula na planilha (=, +, -, @)
function seguro_(v) { const s = String(v == null ? '' : v); return /^[=+\-@]/.test(s) ? "'" + s : s; }
