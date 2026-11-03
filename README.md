# AllMovieRelease — guia do projeto

Catálogo público das versões de cada filme: lançamentos oficiais (VHS, LaserDisc, DVD, Blu-ray, 4K, streaming), fan scans de película, restaurações e edições de fãs, montagens e dublagens brasileiras. Interface em fileiras estilo Netflix, em PT-BR e inglês, com dados localizados do TMDB e uma fila de aprovação para tudo o que entra no site.

O site é estático (HTML, CSS e JavaScript), então é publicado de graça no GitHub Pages, como o tracker do Acervo. A parte dinâmica (sugestões, aprovação, TMDB e radar) fica num Google Apps Script ligado a uma planilha, também de graça, no mesmo esquema da wiki Entre Margens.

---

## 1. O que tem na pasta

```
index.html            página única do site
.nojekyll             arquivo vazio: faz o GitHub Pages publicar os arquivos como estão
css/style.css         visual (cores e fontes no topo do arquivo)
js/config.js          configurações: nome do site, URL do Apps Script, filme em destaque
js/i18n.js            todos os textos da interface em PT-BR e inglês
js/core.js            dados, idioma, TMDB e comunicação com o Apps Script
js/views.js           telas (início, filme, novos lançamentos, sobre, busca)
js/admin.js           tela de moderação (#admin)
js/app.js             rotas, eventos, sugestões e comparador
data/catalogo.js      o catálogo curado (filmes, versões, dublagens, fontes)
data/fila-demo.js     itens de exemplo para testar a fila no modo demonstração
assets/               imagens (coloque aqui o logo oficial do TMDB)
backend/Code.gs       o servidor no Google Apps Script
```

## 2. Testar no computador

Abra o `index.html` com dois cliques. Sem configurar nada, o site roda em **modo demonstração**:

- a fila de sugestões e as aprovações ficam guardadas só no seu navegador;
- o TMDB não é consultado, então aparecem as artes de reserva (etiquetas com ano e título) no lugar dos pôsteres.

Vá em `#admin` (link "Moderação" no rodapé) para testar aprovar e rejeitar os itens de exemplo.

### Como a página de cada filme se organiza
Cada filme tem quatro abas, e o endereço muda junto (dá para mandar o link direto de uma aba):

| aba | endereço | o que mostra |
|---|---|---|
| Guia e avaliação | `#killer-klowns-1988` | "Qual versão assistir?" e a tabela de notas por critério, com destaques como "Mais fiel ao original" |
| Versões | `#killer-klowns-1988/versoes` | linha do tempo, todas as versões com detalhes, comparador, montagens, dublagens e fontes |
| Lançamentos | `#killer-klowns-1988/lancamentos` | todas as edições pelo mundo (data, país, formato, selo, master usado e fonte), com filtros |
| Galeria | `#killer-klowns-1988/galeria` | pôsteres por idioma, fundos e logos do TMDB, com visualização ampliada |

## 3. Publicar no GitHub Pages

O GitHub Pages publica o site direto de um repositório. No plano gratuito o repositório precisa ser **público**, ou seja, qualquer pessoa pode ler todos os arquivos dele. Por isso a chave do TMDB e a chave de administrador **nunca** entram em arquivo nenhum: elas ficam só nas Propriedades do script (seção 4).

### 3.1 Primeira publicação (tudo pelo site do GitHub)
1. Em github.com, clique em **New repository**. Nome: `allmovierelease`. Visibilidade: **Public**. Deixe desmarcado "Add a README file" (o pacote já traz um) e clique em **Create repository**.
2. Na página do repositório vazio, clique em **uploading an existing file**. Abra a pasta `allmovierelease` no computador e arraste **o que está dentro dela**: `index.html`, `README.md`, `.nojekyll` e as pastas `css`, `js`, `data`, `assets` e `backend`. Clique em **Commit changes**.
   - O `index.html` precisa ficar na raiz do repositório. Se você arrastar a pasta `allmovierelease` inteira, ele vai parar em `allmovierelease/index.html` e o site não abre.
   - Mac e Linux escondem arquivos que começam com ponto. Se o `.nojekyll` não aparecer, crie pelo GitHub: **Add file → Create new file**, nome `.nojekyll`, conteúdo vazio, **Commit changes**.
   - A pasta `backend` pode ir junto: o `Code.gs` não tem chave nenhuma e assim fica guardado com o resto do projeto.
3. Vá em **Settings → Pages**. Em **Build and deployment**, escolha **Source: Deploy from a branch**, depois **Branch: main** e a pasta **/ (root)**. Clique em **Save**.
4. Em alguns minutos o endereço aparece no topo dessa mesma página: `https://moguel0818.github.io/allmovierelease/`.

Sobre o endereço: cada repositório comum vira uma subpasta de `moguel0818.github.io`, com o nome do repositório. Por isso `allmovierelease` fica mais limpo do que `AllMovieRelease.github.io` (que viraria `/AllMovieRelease.github.io/`, como acontece com o Acervo). Só um repositório chamado exatamente `moguel0818.github.io` publica na raiz, e cada conta tem um só desses. Para um endereço próprio, veja o domínio na seção 10.

### 3.2 Atualizar o site
- **Um arquivo**: abra o arquivo no repositório, clique no lápis (**Edit this file**), cole o conteúdo novo e clique em **Commit changes**.
- **Vários arquivos**: entre na pasta certa (por exemplo `data/`), use **Add file → Upload files** e arraste os arquivos. O GitHub substitui os que têm o mesmo nome.
- Cada commit publica sozinho. A mudança costuma aparecer em um ou dois minutos e pode levar até uns 10. Se a página não mudar, recarregue com Ctrl+F5.
- Tudo fica registrado em **Commits**: dá para ver o que mudou no catálogo e quando, e voltar atrás se algo der errado.
- Se preferir trabalhar com as pastas no computador, o aplicativo GitHub Desktop envia as mudanças com um clique.

### 3.3 Alternativa: Neocities
Também funciona no Neocities: crie uma pasta (por exemplo `allmovierelease`), envie `index.html` e as pastas `css`, `js`, `data` e `assets` mantendo a estrutura, e acesse `https://SEU-USUARIO.neocities.org/allmovierelease/`. A diferença é que lá o domínio próprio só existe no plano pago (Supporter).

## 4. Ligar a fila de aprovação e o TMDB (Apps Script)

### 4.1 Chave do TMDB
1. Crie uma conta em themoviedb.org.
2. Em Configurações → API, solicite uma chave para uso pessoal.
3. Copie a "Chave da API" (curta) ou o "Token de leitura da API" (longo). Qualquer um serve.

A chave fica guardada no Apps Script, que consulta o TMDB pelo site. Assim ela não aparece no código público.

### 4.2 Planilha e script
1. Crie uma planilha no Google Sheets, por exemplo **AllMovieRelease - banco**.
2. Na planilha: **Extensões → Apps Script**. Apague o que estiver lá e cole o conteúdo de `backend/Code.gs`. Salve.
3. No menu de funções, escolha **setup** e clique em **Executar**. O Google vai pedir autorização. Se aparecer "App não verificado", clique em Avançado → Acessar: é o seu próprio script.
4. Abra **Execuções** (ou o registro) e copie a **chave de administrador** que o `setup` mostrou. Guarde bem: é ela que abre a Moderação.
5. Clique na engrenagem (**Configurações do projeto**) → **Propriedades do script** → **Adicionar propriedade**: nome `TMDB_KEY`, valor = sua chave do TMDB.
6. **Implantar → Nova implantação** → tipo **App da Web**:
   - Executar como: **Eu**
   - Quem pode acessar: **Qualquer pessoa**
7. Copie a URL que termina em `/exec` e cole em `js/config.js`, no campo `APPS_SCRIPT_URL` (no GitHub: abra o arquivo, lápis, cole, **Commit changes**). Essa URL pode ficar pública sem problema: o navegador de qualquer visitante precisa dela, e ela não abre a Moderação, que exige a chave de administrador.

Pronto: as sugestões dos visitantes caem na aba **Sugestoes** da planilha e aparecem na Moderação do site, e os pôsteres e sinopses do TMDB passam a aparecer.

> Mudou o `Code.gs` depois? Vá em **Implantar → Gerenciar implantações → lápis → Versão: Nova versão → Implantar**. A URL continua a mesma.
> Se você já tinha implantado uma versão antiga, cole o `Code.gs` novo e faça isso: a Galeria usa a ação nova `tmdb_images`.

### 4.3 Atribuição do TMDB (obrigatória)
Os termos do TMDB pedem o logo oficial e o aviso "This product uses the TMDB API but is not endorsed or certified by TMDB." numa área de créditos. O aviso já está no rodapé e na página Sobre. Falta só baixar um logo aprovado em themoviedb.org/about/logos-attribution e salvar como `assets/tmdb-logo.svg`.

### 4.4 Sem Apps Script: a chave do TMDB nas Configurações
Qualquer visitante pode ver as capas colando a própria chave do TMDB: ícone de engrenagem no topo (ou "Configurações" no rodapé) → **Chave da API do TMDB** → **Salvar e testar**. O site testa a chave no TMDB antes de guardar.

- A chave fica só no navegador daquele aparelho (não vai para o GitHub nem para a planilha) e é enviada apenas ao TMDB.
- Com ela aparecem os pôsteres, os fundos, as sinopses do TMDB e a aba **Galeria** de cada filme.
- Em **Dados deste aparelho** dá para apagar a cópia local do TMDB e desfazer as capas escolhidas.
- Nunca coloque a chave em `js/config.js`: o repositório é público.

### 4.5 Capas para todos os visitantes, sem chave
As imagens do TMDB carregam sem chave; a chave só é necessária para descobrir quais imagens existem. Por isso dá para "fixar" capas no catálogo:

1. Abra `#admin` uma vez (isso libera o botão **Fixar no catálogo** nesta sessão do navegador).
2. Com a sua chave salva, vá à aba **Galeria** do filme, clique num pôster ou fundo e use **Fixar no catálogo**.
3. Em **Moderação → Exportar**, copie ou baixe o `catalogo.js` novo (ele traz os campos `poster` e `backdrop`) e envie para a pasta `data/` do repositório.

Depois disso, todo visitante vê essas capas, mesmo sem chave e sem Apps Script. O botão **Usar como capa neste aparelho** é diferente: muda a capa só para quem clicou.

## 5. Radar automático de novos scans

O radar lê feeds RSS/Atom uma vez por dia e coloca na fila o que tiver palavras como 35mm, scan, restoration ou technicolor. Nada vai ao ar sem a sua aprovação.

- Para ligar: no Apps Script, execute a função **instalarRadarDiario** (uma vez).
- Para rodar na hora: botão "Rodar o radar agora" na aba Radar da Moderação.
- Para mudar as fontes: edite a propriedade `RADAR_FEEDS` (uma linha por fonte):

```
https://fanrestore.com/syndication.php | *
https://fanedit.org/feed/ | restoration, 35mm, 16mm, scan, preservation
https://www.reddit.com/r/fanedits/new/.rss | 35mm, scan, restoration
https://highdefdiscnews.com/feed/ | restoration, restored, remastered, 4k uhd
```

O `*` aceita todos os itens daquele feed. Sem nada depois da barra, vale a lista da propriedade `RADAR_PALAVRAS`. Alguns sites bloqueiam leitores automáticos; os erros aparecem no registro de execução do Apps Script.

Itens do radar chegam só com título e link. Na fila, use **Converter em versão**, complete os campos (filme, tipo, ano, resumo) e aprove.

## 6. Como moderar

Acesse `SEU-SITE/#admin` e entre com a chave de administrador.

- **Fila**: aprove ou rejeite. Antes de aprovar, dá para corrigir os dados em "Editar dados (JSON)".
- **Histórico**: o que já foi decidido, com a sua nota.
- **Radar de scans**: fontes monitoradas e botão para rodar agora.
- **Catálogo**: lista dos filmes e "Adicionar filme pelo TMDB" (busca e cria a ficha com título e sinopse em PT e EN).
- **Galeria (na página do filme)**: depois de abrir a Moderação, o botão **Fixar no catálogo** aparece na imagem ampliada (veja 4.5).
- **Exportar**: gera um `catalogo.js` novo juntando o catálogo base com tudo o que foi aprovado e as capas fixadas. De tempos em tempos, substitua o `data/catalogo.js` do repositório por ele (pasta `data/` → **Add file → Upload files**). Assim o catálogo base fica completo mesmo se a planilha sumir, e o histórico do GitHub guarda cada versão do catálogo.

## 7. Editar o catálogo à mão

Tudo está em `data/catalogo.js`. Textos aceitam `{ pt: "...", en: "..." }`.

### Filme
| campo | o que é |
|---|---|
| `id` | endereço da página, só letras minúsculas, números e hífens (`toy-story-1995`) |
| `tmdb` | número do filme no TMDB (está na URL do filme no site do TMDB) |
| `title`, `overview` | título e sinopse de reserva; o TMDB substitui quando está ligado |
| `intro` | o resumo do "caso" das versões, escrito por você |
| `accent`, `accent2` | duas cores da arte de reserva |
| `guide` | o "Qual versão assistir?": `{ need, version, why }` ou `{ need, dub, why }` |
| `cuts` | montagens, com `note` e `changes` |
| `dubs` | dublagens brasileiras: ano, estúdio, direção, elenco, observação |
| `wanted` | o que ainda falta documentar (vira "Procura-se") |
| `releases` | as edições do filme pelo mundo (aba Lançamentos; veja abaixo) |
| `links` | páginas com a lista completa de edições: `{ bluray: "https://www.blu-ray.com/...", dvdcompare: "https://www.dvdcompare.net/..." }` |
| `score_note` | observação curta que aparece acima da tabela de notas |
| `poster`, `backdrop` | caminhos de imagem do TMDB (`"/abc123.jpg"`) fixados pela Galeria; podem ser `{ pt, en }` |

Valores de `need`: `fidelidade`, `imagem`, `oficial`, `dublagem`, `colecionador`.

### Lançamento (edição)
```js
{
  date: "2018-04-24",          // AAAA, AAAA-MM ou AAAA-MM-DD; "" quando não se sabe
  country: "US",               // código de país com duas letras (BR, US, GB, DE, CA, JP...)
  format: "bd",                // vhs | beta | ced | ld | dvd | umd | bd | 3d | 4k | digital | stream | tv | 35mm | 70mm
  label: "Arrow Video",
  name: { pt: "Edição especial", en: "Special Edition" },
  version: "kk-bd-arrow-2018", // master usado (id de uma versão); deixe sem quando não se sabe
  version_sure: false,         // opcional: marca o master como "provável"
  specs: { pt: "1080p · DTS-HD MA 5.1", en: "1080p · DTS-HD MA 5.1" },
  note: { pt: "...", en: "..." },
  src: ["kk_br18"],            // chaves do dicionário "sources"
  src_urls: ["https://www.blu-ray.com/movies/..."]
}
```
A lista é ordenada pela data. Cada edição mostra o link da página de origem: é o crédito à base de onde o dado veio.

### Versão
```js
{
  id: "sw-4k77",
  type: "fan_scan",            // theatrical | official | fan_scan | fan_restoration | fan_edit
  name: { pt: "Project 4K77", en: "Project 4K77" },
  by: "Team Negative1",
  released: "2018-05",          // AAAA, AAAA-MM ou AAAA-MM-DD
  cut: "theatrical",            // id de uma montagem do filme
  source: { pt: "Cópia Technicolor de 1977 escaneada em 4K", en: "..." },
  res: "4K / 1080p", hdr: "", aspect: "2.39:1",
  formats: ["file"],            // "file" = arquivo digital não oficial
  audio: [{ pt: "...", en: "..." }],
  dubs: ["sw-dub-1983"],        // dublagens presentes nesta versão
  summary: { pt: "...", en: "..." },
  differences: [{ pt: "...", en: "..." }],
  reception: { level: "aclamado", note: { pt: "...", en: "..." } },
  availability: "unofficial",   // in_print | out_of_print | streaming | unofficial | archive | upcoming | check
  best_for: ["fidelidade"],
  editions: [{ year: 2018, format: "...", region: "...", label: "...", note: "..." }],
  scores: {                     // notas da aba Guia e avaliação (1 a 5), cada uma com justificativa e fonte
    fidelity: { v: 5, why: { pt: "...", en: "..." }, src: ["sw_w2"] },
    picture:  { v: 4, why: { pt: "...", en: "..." }, src: ["sw_eng"] }
    // também: audio, extras
  },
  reviews: [                    // notas publicadas por análises, com crédito
    { src: "kk_br18", label: "Blu-ray.com", date: "2018-04-19", scale: 5, video: 5, audio: 4, extras: 5 },
    { src: "kk_db18", label: "The Digital Bits", video: "A" }
  ],
  src: ["sw_w2"],               // chaves do dicionário "sources" no fim do arquivo
  src_urls: ["https://..."]     // ou links diretos
}
```

Níveis de `reception`: `aclamado`, `bem_avaliado`, `misto`, `controverso`, `criticado`, `referencia` (exibição original), `em_breve`, `sem_dados`. A recepção resume o que análises e comunidades disseram, sempre com fonte.

### Como dar as notas
- **Fidelidade**: quão perto a versão fica do filme exibido no cinema (montagem, enquadramento, cor, textura de película). Uma restauração com HDR pode ter imagem 5 e fidelidade 4.
- **Imagem**: qualidade técnica (definição, compressão, limpeza sem exageros).
- **Áudio**: se a mixagem original está presente e como soa.
- **Extras**: comentários, documentários e outros materiais.
- Sem dado confiável, não dê nota: a célula aparece como "–". Os destaques ("Mais fiel ao original", "Melhor imagem"...) saem sozinhos da maior nota de cada critério.

## 8. Política de conteúdo

O site documenta versões. **Não hospeda nem linka arquivos para download**, oficiais ou de fãs. O formulário e o Apps Script recusam links de serviços de compartilhamento e torrents. Isso protege o site contra pedidos de remoção e mantém o foco: comparar, explicar e apontar fontes (análises, fóruns, comparações).

**Bases de lançamentos (Blu-ray.com, DVDCompare e outras)**: use como ponto de partida, sempre com crédito. Copie só fatos (data, país, selo, formato, especificações), escreva com as suas palavras e coloque o link da página de origem na edição. Não copie textos de análises nem imagens de capas dessas bases; as capas do site vêm do TMDB, que permite o uso pela API.

## 9. Personalizar

- **Nome**: `SITE_NAME` em `js/config.js` (por exemplo `"DifferentCuts"`).
- **Destaque da página inicial**: `FEATURED` em `js/config.js`.
- **Idioma padrão**: `DEFAULT_LANG` (`"auto"`, `"pt"` ou `"en"`).
- **Cores e fontes**: bloco `:root` no topo de `css/style.css`.

## 10. Próximos passos sugeridos

1. **Páginas indexáveis**: hoje cada filme vive em `#id-do-filme`, que o Google indexa mal. Para o site ser encontrado, o passo seguinte é gerar uma página estática por filme (`/filme/star-wars-1977/`) a partir do catálogo. No GitHub isso pode ser automático: uma GitHub Action roda um script a cada mudança no catálogo e gera as páginas.
2. **Domínio próprio**: no GitHub Pages não tem mensalidade, você paga só o registro do domínio. Em **Settings → Pages → Custom domain**, digite o domínio, crie no registrador os registros DNS que a ajuda do GitHub indica ("Managing a custom domain for your GitHub Pages site") e marque **Enforce HTTPS**. A mesma ajuda mostra como verificar o domínio na sua conta, o que impede outra pessoa de usá-lo no GitHub.
3. **Contribuições e licença**: com o repositório público, quem conhece o GitHub pode propor mudanças no catálogo por pull request; você vê a diferença linha a linha e aprova, como na fila. Vale escolher uma licença para deixar claro como outros podem reutilizar o trabalho, por exemplo MIT para o código e CC BY-SA 4.0 (a mesma da Wikipédia) para os textos do catálogo.
4. **Comparações de imagem**: quadros lado a lado com controle deslizante, a partir de capturas que você mesmo fizer ou de links para sites de comparação.
5. **Nota da comunidade**: votos dos visitantes por versão, guardados na planilha.
6. **Páginas por grupo e selo**: Team Negative1, Arrow Video, Scream Factory etc.
7. **Mais filmes**: entram pela fila, com o radar ajudando a encontrar lançamentos novos.
