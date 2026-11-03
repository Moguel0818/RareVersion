/*
 * AllMovieRelease — configuração
 * Edite este arquivo antes de publicar.
 *
 * ATENÇÃO: este arquivo é público (fica no repositório do GitHub e no site).
 * Nunca coloque aqui a chave do TMDB nem a chave de administrador:
 * as duas ficam só nas Propriedades do script, no Apps Script.
 */
window.AMR_CONFIG = {
  // Nome que aparece no topo e na aba do navegador. Troque por "DifferentCuts" se preferir.
  SITE_NAME: "AllMovieRelease",

  // URL do Web App do Google Apps Script (termina em /exec). Veja backend/Code.gs e o README.
  // Vazio = modo demonstração: a fila fica só no navegador e o TMDB não é consultado.
  APPS_SCRIPT_URL: "",

  // Deixe vazio no site publicado. Com o repositório público, a chave ficaria exposta a qualquer pessoa.
  // A chave do TMDB fica no Apps Script (propriedade TMDB_KEY), que faz o papel de intermediário.
  // Para testar só no seu navegador, use a aba Configurações da Moderação (#admin), que não grava no arquivo.
  TMDB_API_KEY: "",

  // Filme em destaque no topo da página inicial (use o id do catálogo).
  FEATURED: "star-wars-1977",

  // "auto" segue o idioma do navegador; ou fixe em "pt" ou "en".
  DEFAULT_LANG: "auto"
};
