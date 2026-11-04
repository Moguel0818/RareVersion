/*
 * RareVersion — configuração
 * Edite este arquivo antes de publicar.
 *
 * ATENÇÃO: este arquivo é público (fica no repositório do GitHub e no site).
 * Nunca coloque aqui a chave de administrador: ela fica só nas Propriedades do script, no Apps Script.
 */
window.AMR_CONFIG = {
  // Nome que aparece no topo, na aba do navegador e nos textos do site.
  SITE_NAME: "RareVersion",

  // URL do Web App do Google Apps Script (termina em /exec). Veja backend/Code.gs e o README.
  // Vazio = modo demonstração: a fila de sugestões fica só no navegador.
  APPS_SCRIPT_URL: "",

  // Chave do TMDB usada por todos os visitantes: capas, sinopses e Galeria sem precisar colar nada.
  // Ela fica visível para quem abrir o código do site. Se alguém abusar dela, o TMDB pode bloqueá-la;
  // nesse caso, gere outra em themoviedb.org → Configurações → API e troque aqui.
  // Para deixar a chave escondida, apague-a daqui e use o Apps Script (propriedade TMDB_KEY).
  TMDB_API_KEY: "fb4485cc86084177afdf28e19e44460f",

  // Filme em destaque no topo da página inicial (use o id do catálogo).
  FEATURED: "star-wars-1977",

  // "auto" segue o idioma do navegador; ou fixe em "pt" ou "en".
  DEFAULT_LANG: "auto"
};
