/*
 * AllMovieRelease — catálogo curado
 * ------------------------------------------------------------
 * Este arquivo é o "banco de dados" base do site. Edite à vontade.
 * Itens aprovados pela fila de moderação são somados a ele em tempo real;
 * use "Moderação → Exportar" para gerar uma versão nova deste arquivo.
 *
 * Campos de texto aceitam { pt: "...", en: "..." }.
 *
 * FILME
 *   id            slug usado no endereço (#toy-story-1995)
 *   tmdb          id do filme no The Movie Database (dados localizados e pôsteres)
 *   title / overview / intro    textos de reserva (o TMDB substitui título e sinopse quando disponível)
 *   accent/accent2  cores da arte de reserva (quando não há pôster)
 *   guide         "Qual versão assistir?": { need, version | dub, why }
 *                 needs: fidelidade | imagem | oficial | dublagem | colecionador
 *   cuts          montagens (cortes) do filme
 *   dubs          dublagens brasileiras
 *   wanted        o que ainda falta documentar (aparece como "Procura-se")
 *
 * VERSÃO
 *   type          theatrical (exibição em cinema) | official | fan_scan | fan_restoration | fan_edit
 *   released      "AAAA-MM-DD", "AAAA-MM" ou "AAAA"
 *   cut           id da montagem
 *   res / hdr / aspect / formats / audio
 *   reception     { level, note }  level: aclamado | bem_avaliado | misto | controverso | criticado | referencia | em_breve
 *   availability  in_print | out_of_print | streaming | unofficial | archive | upcoming | check
 *   best_for      mesmas chaves de "needs"
 *   src           chaves do dicionário "sources" lá embaixo
 *
 * POLÍTICA: o catálogo documenta versões. Não guardamos nem linkamos arquivos para download.
 */
window.AMR_CATALOG = {
  schema: 1,
  updated: "2026-11-02",

  films: [
    /* ============================================================
     * TOY STORY (1995)
     * ============================================================ */
    {
      id: "toy-story-1995",
      tmdb: 862,
      year: 1995,
      original_title: "Toy Story",
      title: { pt: "Toy Story: Um Mundo de Aventuras", en: "Toy Story" },
      overview: {
        pt: "Woody, um boneco caubói, é o brinquedo favorito de Andy até a chegada de Buzz Lightyear, um patrulheiro espacial cheio de recursos. A rivalidade entre os dois acaba levando ambos para longe de casa.",
        en: "Woody, a pull-string cowboy doll, is Andy's favorite toy until Buzz Lightyear, a gadget-packed space ranger, arrives. Their rivalry ends up stranding both of them far from home."
      },
      runtime: 81,
      director: "John Lasseter",
      accent: "#3f7fd0",
      accent2: "#f2c230",
      intro: {
        pt: "Toy Story nasceu no computador, mas foi feito para ser visto em película: cada quadro foi gravado em negativo 35mm, e a equipe da Pixar ajustou as cores prevendo como elas mudariam na cópia. As primeiras edições caseiras vieram dessa versão em filme. A partir dos anos 2000, as edições passaram a sair direto dos arquivos digitais, e desde 2009 usam uma nova renderização. Por isso, cor, contraste e textura mudam bastante de uma versão para outra.",
        en: "Toy Story was born on a computer but made to be seen on film: every frame was recorded onto 35mm negative, and Pixar tuned the colors anticipating how they would shift on print. The first home editions came from that film version. From the 2000s on, editions came straight from the digital files, and since 2009 they use a brand-new render. That is why color, contrast and texture vary so much between versions."
      },
      guide: [
        { need: "fidelidade", version: "ts-35mm-scans", why: {
          pt: "É o caminho mais próximo do visual de cinema: cores mais quentes, imagem macia e grão de película. A cor muda de scan para scan, conforme a cópia e a correção feita.",
          en: "The closest way to the theatrical look: warmer colors, a soft image and film grain. Color varies from scan to scan, depending on the print and the grading." } },
        { need: "imagem", version: "ts-uhd-2019", why: {
          pt: "Melhor imagem oficial, com HDR. O ganho de detalhe sobre o Blu-ray é pequeno, porque a fonte é 2K.",
          en: "Best official picture, with HDR. The detail gain over the Blu-ray is modest because the source is 2K." } },
        { need: "oficial", version: "ts-bd-2010", why: {
          pt: "Entre as edições digitais oficiais, é a que a Animation Obsessive considera mais próxima das cores originais, ainda que mais fria.",
          en: "Among the official digital editions, Animation Obsessive considers it the closest to the original colors, though colder." } },
        { need: "colecionador", version: "ts-vhs-ld-1996", why: {
          pt: "A caixa de LaserDisc Deluxe (1996) tem certificação THX e extras, e as edições dessa época vinham da versão em película.",
          en: "The 1996 Deluxe LaserDisc box is THX-certified and full of extras, and editions from that era came from the film version." } },
        { need: "dublagem", dub: "ts-dub-1995", why: {
          pt: "Há uma única dublagem brasileira registrada: a de 1995, com Alexandre Lippiani como Woody e Guilherme Briggs como Buzz.",
          en: "There is a single recorded Brazilian dub: the 1995 one, with Alexandre Lippiani as Woody and Guilherme Briggs as Buzz." } }
      ],
      cuts: [
        { id: "theatrical", name: { pt: "Versão de cinema (1995)", en: "Theatrical version (1995)" },
          note: {
            pt: "Não existem montagens alternativas oficiais. A diferença entre as versões está na imagem: película, transferência digital direta ou a nova renderização de 2009.",
            en: "There are no alternate official cuts. The differences are in the image: film, direct digital transfer or the 2009 re-render." } }
      ],
      dubs: [
        { id: "ts-dub-1995", name: { pt: "Dublagem original (1995)", en: "Original Brazilian dub (1995)" },
          year: 1995, studio: "Double Sound (Rio de Janeiro)", director: "Garcia Neto",
          cast: [["Woody", "Alexandre Lippiani"], ["Buzz Lightyear", "Guilherme Briggs"], ["Sr. Cabeça de Batata", "Antônio Patiño"], ["Rex", "Marco Antônio Costa"], ["Betty", "Telma da Costa"]],
          note: {
            pt: "Tradução e adaptação musical de Renato Rosenberg. Estreou no Brasil em janeiro de 1996. Lippiani morreu em 1997; a partir de Toy Story 2, Woody passou a ser dublado por Marco Ribeiro.",
            en: "Translation and song adaptation by Renato Rosenberg. Premiered in Brazil in January 1996. Lippiani died in 1997; from Toy Story 2 on, Woody was voiced by Marco Ribeiro." },
          src: ["ts_dub", "ts_dub2", "ts_lip"] }
      ],
      versions: [
        {
          id: "ts-cinema-1995", type: "theatrical",
          name: { pt: "Cópia 35mm de cinema", en: "35mm theatrical print" },
          by: "Disney / Pixar", released: "1995-11-22", cut: "theatrical",
          source: { pt: "Quadros renderizados em 1536×922 e gravados um a um em negativo 35mm", en: "Frames rendered at 1536×922 and recorded one by one onto 35mm negative" },
          res: "35mm", aspect: "1.85:1", formats: ["35mm"],
          summary: {
            pt: "A forma como o filme foi pensado para ser visto. A gravação em película levava cerca de nove horas para cada 30 segundos, e a equipe calibrou os monitores para imitar o filme.",
            en: "How the film was meant to be seen. Recording to film took about nine hours for every 30 seconds, and the team calibrated its monitors to mimic the film stock." },
          differences: [
            { pt: "Verdes escurecem e azuis ficam menos saturados, de propósito: as cores digitais foram ajustadas para a película", en: "Greens darken and blues desaturate, by design: the digital colors were tuned for film" },
            { pt: "Imagem macia e com grão, que disfarça a baixa resolução dos renders", en: "A soft, grainy image that hides the low resolution of the renders" },
            { pt: "Cada cópia de exibição envelhece de um jeito; o desbotamento varia", en: "Each release print ages differently; fading varies" }
          ],
          reception: { level: "referencia", note: { pt: "É o ponto de comparação para todas as outras versões.", en: "The baseline every other version is compared against." } },
          availability: "archive", best_for: [],
          src: ["ts_ao", "ts_wiki"]
        },
        {
          id: "ts-vhs-ld-1996", type: "official",
          name: { pt: "VHS e LaserDisc (1996)", en: "VHS and LaserDisc (1996)" },
          by: "Walt Disney Home Video", released: "1996-10-29", cut: "theatrical",
          source: { pt: "Transferência a partir da versão em película", en: "Transferred from the film version" },
          res: "SD", aspect: { pt: "Varia; o LaserDisc Deluxe é widescreen", en: "Varies; the Deluxe LaserDisc is widescreen" },
          formats: ["VHS", "LaserDisc"],
          summary: {
            pt: "As primeiras edições caseiras vieram da versão em filme, por isso guardam boa parte do visual do cinema, ainda que na resolução limitada do vídeo analógico.",
            en: "The first home editions came from the film version, so they keep much of the theatrical look, within the limited resolution of analog video." },
          differences: [
            { pt: "Cores próximas às da cópia 35mm", en: "Colors close to the 35mm print" },
            { pt: "Baixa resolução e ruído típicos de VHS e LaserDisc", en: "Low resolution and noise typical of VHS and LaserDisc" },
            { pt: "A caixa Deluxe de LaserDisc (18/12/1996) tem THX e extras como storyboards, story reels e comentário", en: "The Deluxe LaserDisc box (Dec 18, 1996) is THX-certified with extras such as storyboards, story reels and commentary" }
          ],
          reception: { level: "misto", note: { pt: "Valorizado como referência de cor entre as mídias oficiais, mas limitado pela resolução.", en: "Valued as a color reference among official media, but limited by resolution." } },
          availability: "out_of_print", best_for: ["colecionador"],
          editions: [
            { year: 1996, format: "VHS / LaserDisc", region: { pt: "EUA e Canadá", en: "US and Canada" }, label: "Walt Disney Home Video", note: { pt: "29/10/1996, sem extras", en: "Oct 29, 1996, no extras" } },
            { year: 1996, format: "LaserDisc (4 discos)", region: { pt: "EUA", en: "US" }, label: "Walt Disney Home Video", note: { pt: "Deluxe widescreen com THX, 18/12/1996", en: "Deluxe widescreen box with THX, Dec 18, 1996" } }
          ],
          src: ["ts_wiki", "ts_cb", "ts_ao"]
        },
        {
          id: "ts-dvd-2000", type: "official",
          name: { pt: "DVD “Ultimate Toy Box” (2000)", en: "“Ultimate Toy Box” DVD (2000)" },
          by: "Walt Disney Home Entertainment", released: "2000-10-17", cut: "theatrical",
          source: { pt: "Transferência digital direta dos arquivos de computador, sem passar pela película", en: "Direct digital transfer from the computer files, with no film stage" },
          res: "SD", formats: ["DVD"],
          summary: {
            pt: "Primeiro DVD do filme, em caixa com Toy Story 2 e um disco de extras, com certificação THX. Aqui a película sai de cena: a imagem vem direto do digital.",
            en: "The film's first DVD, boxed with Toy Story 2 and a bonus disc, THX-certified. Film leaves the picture here: the image comes straight from the digital files." },
          differences: [
            { pt: "Imagem limpa e sem grão", en: "Clean, grainless image" },
            { pt: "Cores diferentes das do cinema; fãs descrevem as edições digitais desse período como mais saturadas", en: "Colors differ from the theatrical ones; fans describe the digital editions of this era as more saturated" }
          ],
          reception: { level: "misto", note: { pt: "Foi disco de demonstração por anos, mas hoje é lembrado por se afastar das cores originais.", en: "It was a demo disc for years, but today it is remembered for drifting from the original colors." } },
          availability: "out_of_print", best_for: [],
          editions: [
            { year: 2000, format: "DVD (3 discos)", region: { pt: "EUA", en: "US" }, label: "Walt Disney", note: { pt: "Ultimate Toy Box com Toy Story 2, 17/10/2000, THX", en: "Ultimate Toy Box with Toy Story 2, Oct 17, 2000, THX" } },
            { year: 2001, format: "DVD", region: { pt: "EUA", en: "US" }, label: "Walt Disney", note: { pt: "Edição avulsa, 20/03/2001", en: "Standalone release, Mar 20, 2001" } }
          ],
          src: ["ts_wiki", "ts_cb", "ts_tt"]
        },
        {
          id: "ts-dvd-2005", type: "official",
          name: { pt: "DVD 10º Aniversário (2005)", en: "10th Anniversary DVD (2005)" },
          by: "Walt Disney Home Entertainment", released: "2005-09-06", cut: "theatrical",
          source: { pt: "Master digital anterior à nova renderização de 2009", en: "Digital master predating the 2009 re-render" },
          res: "SD", formats: ["DVD", "UMD"],
          audio: [{ pt: "Nova mixagem DTS", en: "New DTS sound mix" }],
          summary: {
            pt: "Edição dupla com novos extras e nova mixagem DTS. Em fóruns de preservação, é citada como a melhor fonte oficial da renderização original de 1995, já que tudo a partir de 2009 vem do re-render.",
            en: "A two-disc edition with new extras and a new DTS mix. On preservation forums it is cited as the best official source of the original 1995 render, since everything from 2009 on comes from the re-render." },
          differences: [
            { pt: "Última geração de edições baseada nos renders de 1995", en: "The last generation of editions based on the 1995 renders" }
          ],
          reception: { level: "bem_avaliado", note: { pt: "Lembrada por colecionadores como a edição que preserva os renders originais com mais qualidade.", en: "Remembered by collectors as the edition that best preserves the original renders." } },
          availability: "out_of_print", best_for: ["colecionador"],
          src: ["ts_wiki", "ts_lmw"]
        },
        {
          id: "ts-bd-2010", type: "official",
          name: { pt: "Blu-ray (2010), re-renderizado", en: "Blu-ray (2010), re-rendered" },
          by: "Disney / Pixar", released: "2010-03-23", cut: "theatrical",
          source: { pt: "Nova renderização em 2K dos arquivos originais, feita em 2009 para o relançamento em 3D", en: "A new 2K render of the original files, made in 2009 for the 3D re-release" },
          res: "1080p", aspect: "1.78:1", formats: ["Blu-ray", "Blu-ray 3D", "DVD"],
          audio: [{ pt: "Inglês DTS-HD Master Audio 5.1", en: "English DTS-HD Master Audio 5.1" }],
          summary: {
            pt: "A Pixar voltou aos arquivos de 1995 e renderizou tudo de novo em resolução maior. O resultado é muito nítido, mas já não é o mesmo filme “fotografado” em película.",
            en: "Pixar went back to the 1995 files and rendered everything again at a higher resolution. The result is very sharp, but it is no longer the same film “photographed” onto film." },
          differences: [
            { pt: "Bem mais detalhe que qualquer edição anterior", en: "Far more detail than any earlier edition" },
            { pt: "Cores mais próximas da película que o DVD e o streaming, porém com visual mais frio", en: "Colors closer to the film than the DVD and streaming, but with a colder look" },
            { pt: "Versão 3D em Blu-ray 3D (2011)", en: "3D version on Blu-ray 3D (2011)" }
          ],
          reception: { level: "aclamado", note: { pt: "Nota máxima de vídeo em análises técnicas (5/5 no Blu-ray.com).", en: "Top video marks in technical reviews (5/5 at Blu-ray.com)." } },
          availability: "check", best_for: ["imagem", "oficial"],
          editions: [
            { year: 2010, format: "Blu-ray + DVD", region: { pt: "EUA", en: "US" }, label: "Disney / Pixar", note: { pt: "Edição Especial, 23/03/2010", en: "Special Edition combo, Mar 23, 2010" } },
            { year: 2011, format: "Blu-ray 3D", region: { pt: "EUA", en: "US" }, label: "Disney / Pixar", note: { pt: "Trilogia em 3D, 01/11/2011", en: "3D trilogy set, Nov 1, 2011" } }
          ],
          src: ["ts_tt3d", "ts_ao", "ts_br4k", "ts_wiki"]
        },
        {
          id: "ts-uhd-2019", type: "official",
          name: { pt: "4K UHD Blu-ray (2019)", en: "4K UHD Blu-ray (2019)" },
          by: "Disney / Pixar", released: "2019-06-04", cut: "theatrical",
          source: { pt: "Upscale para 4K do master 2K re-renderizado", en: "4K upscale of the re-rendered 2K master" },
          res: "4K (upscale)", hdr: "HDR10", aspect: "1.78:1", formats: ["4K UHD", "Blu-ray"],
          audio: [
            { pt: "Inglês Dolby Atmos / TrueHD 7.1", en: "English Dolby Atmos / TrueHD 7.1" },
            { pt: "Disco americano: francês e espanhol (DD 5.1 EX) e japonês (DTS-HD MA 5.1); sem português", en: "US disc: French and Spanish (DD 5.1 EX) and Japanese (DTS-HD MA 5.1); no Portuguese" }
          ],
          summary: {
            pt: "O HDR deixa brancos e cores mais intensos, mas o ganho de detalhe é pequeno, já que a fonte é 2K. Serrilhados da renderização original ficam um pouco mais visíveis.",
            en: "HDR makes whites and colors more intense, but the detail gain is small since the source is 2K. Aliasing from the original render becomes a bit more visible." },
          differences: [
            { pt: "Proporção 1.78:1 (a original de cinema é 1.85:1)", en: "1.78:1 aspect ratio (the theatrical original is 1.85:1)" },
            { pt: "O Blu-ray incluso é praticamente idêntico ao de 2010", en: "The included Blu-ray is essentially identical to the 2010 disc" }
          ],
          reception: { level: "bem_avaliado", note: { pt: "Melhora confiável sobre o Blu-ray, mas não drástica (vídeo 4/5 no Blu-ray.com).", en: "A reliable but not dramatic step up from the Blu-ray (video 4/5 at Blu-ray.com)." } },
          availability: "in_print", best_for: ["imagem"],
          src: ["ts_br4k", "ts_hddn"]
        },
        {
          id: "ts-disney-plus", type: "official",
          name: { pt: "Disney+ (streaming)", en: "Disney+ (streaming)" },
          by: "Disney", released: "2019-11-12", cut: "theatrical",
          source: { pt: "Master digital atual da Disney", en: "Disney's current digital master" },
          formats: ["Streaming"],
          summary: {
            pt: "O jeito mais fácil de ver o filme hoje. A Animation Obsessive aponta cores cruas, com verdes intensos que, na película, ficariam mais escuros.",
            en: "The easiest way to watch the film today. Animation Obsessive points to raw colors, with intense greens that would have darkened on film." },
          differences: [
            { pt: "Verdes muito vivos (os soldadinhos, por exemplo), diferentes do visual do cinema", en: "Very vivid greens (the army men, for instance), unlike the theatrical look" },
            { pt: "Imagem digital limpa, sem grão", en: "Clean digital image, no grain" }
          ],
          reception: { level: "controverso", note: { pt: "Criticado por quem compara com as cópias 35mm.", en: "Criticized by those who compare it with the 35mm prints." } },
          availability: "streaming", best_for: [],
          src: ["ts_ao", "ts_cb"]
        },
        {
          id: "ts-35mm-scans", type: "fan_scan",
          name: { pt: "Scans de cópias 35mm", en: "35mm print scans" },
          by: { pt: "Colecionadores e preservacionistas", en: "Collectors and preservationists" },
          released: "2025", cut: "theatrical",
          source: { pt: "Cópias de exibição 35mm de 1995 escaneadas por colecionadores", en: "1995 35mm release prints scanned by collectors" },
          res: { pt: "Varia por scan", en: "Varies by scan" }, aspect: "1.85:1", formats: ["file"],
          summary: {
            pt: "Scans de cópias de cinema viralizaram entre 2025 e 2026 e reacenderam o debate: muita gente reconheceu ali o Toy Story da infância, mais quente e suave que as versões digitais.",
            en: "Scans of theatrical prints went viral in 2025–2026 and reignited the debate: many people recognized the Toy Story of their childhood, warmer and softer than the digital versions." },
          differences: [
            { pt: "Cores mais quentes e imagem mais suave, com grão", en: "Warmer colors and a softer, grainy image" },
            { pt: "Texturas e serrilhados dos renders de 1995 ficam menos evidentes", en: "Textures and aliasing from the 1995 renders are less noticeable" },
            { pt: "A cor depende da cópia, do scanner e da correção de cada scan; nenhum reproduz exatamente a projeção de 1995", en: "Color depends on the print, the scanner and each scan's grading; none exactly reproduces the 1995 projection" }
          ],
          reception: { level: "bem_avaliado", note: { pt: "Muito elogiado nas comparações nas redes, com a ressalva de que cada scan tem sua própria cor.", en: "Widely praised in online comparisons, with the caveat that each scan has its own color." } },
          availability: "unofficial", best_for: ["fidelidade"],
          src: ["ts_ao", "ts_cb"]
        }
      ]
    },

    /* ============================================================
     * STAR WARS (1977)
     * ============================================================ */
    {
      id: "star-wars-1977",
      tmdb: 11,
      year: 1977,
      original_title: "Star Wars",
      title: { pt: "Star Wars: Episódio IV – Uma Nova Esperança", en: "Star Wars" },
      aka: { pt: ["Guerra nas Estrelas"], en: ["A New Hope", "Episode IV"] },
      overview: {
        pt: "Luke Skywalker, um jovem fazendeiro, se une a um velho cavaleiro Jedi, a um contrabandista e à Princesa Leia para enfrentar o Império e sua estação de batalha, a Estrela da Morte.",
        en: "Farm boy Luke Skywalker teams up with an old Jedi knight, a smuggler and Princess Leia to take on the Empire and its battle station, the Death Star."
      },
      runtime: 121,
      director: "George Lucas",
      accent: "#d8b45a",
      accent2: "#3b5d8f",
      intro: {
        pt: "Poucos filmes têm tantas versões. Star Wars foi alterado em 1981, 1997, 2004, 2011 e 2019, e a versão de cinema de 1977 nunca saiu oficialmente em alta definição. Isso deu origem a scans de cópias 35mm e a reconstruções feitas por fãs. Em junho de 2025, o BFI exibiu uma cópia IB Technicolor original em Londres, e em fevereiro de 2027 uma restauração oficial do original volta aos cinemas.",
        en: "Few films have this many versions. Star Wars was altered in 1981, 1997, 2004, 2011 and 2019, and the 1977 theatrical version was never officially released in high definition. That gave rise to 35mm print scans and fan reconstructions. In June 2025 the BFI screened an original IB Technicolor print in London, and in February 2027 an official restoration of the original returns to theaters."
      },
      guide: [
        { need: "fidelidade", version: "sw-4k77", why: {
          pt: "Escaneado em 4K a partir de uma cópia Technicolor de 1977, com grão e cores de época: o mais perto do cinema que existe hoje. A restauração oficial de 2027 deve virar a alternativa oficial.",
          en: "Scanned in 4K from a 1977 Technicolor print, with period grain and color: the closest thing to the theater available today. The 2027 official restoration should become the official alternative." } },
        { need: "imagem", version: "sw-uhd-2019", why: {
          pt: "A melhor imagem oficial, mas na montagem mais alterada de todas.",
          en: "The best official picture, but in the most altered cut of all." } },
        { need: "oficial", version: "sw-uhd-2019", why: {
          pt: "É o que se encontra hoje (Disney+ e 4K). O original oficial só saiu no DVD de 2006, em qualidade baixa, até a restauração de 2027.",
          en: "It is what you can find today (Disney+ and 4K). The official original only came out on the 2006 DVD, in low quality, until the 2027 restoration." } },
        { need: "dublagem", dub: "sw-dub-1983", why: {
          pt: "A dublagem clássica da Herbert Richers (1983), feita sobre a versão de cinema, exibida na TV e lançada em VHS.",
          en: "The classic Herbert Richers dub (1983), made on the theatrical version, aired on TV and released on VHS." } },
        { need: "colecionador", version: "sw-ld-1993", why: {
          pt: "A caixa Definitive Collection (1993) foi por décadas a melhor mídia oficial do original.",
          en: "The Definitive Collection box (1993) was for decades the best official medium for the original." } }
      ],
      cuts: [
        { id: "theatrical", name: { pt: "Versão original de cinema (antes de 1997)", en: "Original theatrical cut (pre-1997)" },
          note: {
            pt: "Estreou em maio de 1977. No relançamento de 10/04/1981 ganhou “Episódio IV – Uma Nova Esperança” no letreiro, um novo fundo de estrelas e efeitos refeitos na perseguição inicial. As edições caseiras anteriores a 1997 partem desta montagem.",
            en: "Opened in May 1977. The April 10, 1981 re-release added “Episode IV – A New Hope” to the crawl, a new starfield and reworked effects in the opening chase. Home editions before 1997 are based on this cut." } },
        { id: "se1997", name: { pt: "Edição Especial (1997)", en: "Special Edition (1997)" },
          changes: [
            { pt: "Greedo passa a atirar primeiro em Han Solo", en: "Greedo now shoots first at Han Solo" },
            { pt: "Cena com Jabba restaurada, com Jabba em CGI", en: "A Jabba scene restored, with a CGI Jabba" },
            { pt: "Cena de Biggs em Yavin 4; criaturas e ruas de Mos Eisley em CGI", en: "Biggs scene on Yavin 4; CGI creatures and streets in Mos Eisley" },
            { pt: "Ondas de choque nas explosões de Alderaan e da Estrela da Morte", en: "Shockwaves on the Alderaan and Death Star explosions" }
          ] },
        { id: "dvd2004", name: { pt: "Revisão do DVD (2004)", en: "2004 DVD revision" },
          changes: [
            { pt: "Han e Greedo atiram quase ao mesmo tempo", en: "Han and Greedo fire almost simultaneously" },
            { pt: "Jabba em CGI de maior resolução; textos em Aurebesh", en: "Higher-resolution CGI Jabba; Aurebesh text" },
            { pt: "Nova correção de cor, muito criticada", en: "A new, heavily criticized color grade" }
          ] },
        { id: "bd2011", name: { pt: "Revisão do Blu-ray (2011)", en: "2011 Blu-ray revision" },
          changes: [
            { pt: "Tiro de Greedo encurtado em alguns quadros", en: "Greedo's shot shortened by a few frames" },
            { pt: "Sabre de luz de Luke corrigido para azul", en: "Luke's lightsaber corrected to blue" },
            { pt: "Pedras na frente da caverna onde R2-D2 se esconde", en: "Rocks added in front of the cave where R2-D2 hides" }
          ] },
        { id: "d2019", name: { pt: "Revisão Disney+ / 4K (2019)", en: "Disney+ / 4K revision (2019)" },
          changes: [
            { pt: "Greedo diz “Maclunkey” antes do tiroteio", en: "Greedo says “Maclunkey” before the shootout" },
            { pt: "Ajustes de cor, composição e efeitos re-renderizados", en: "Color and compositing tweaks, re-rendered effects" }
          ] }
      ],
      dubs: [
        { id: "sw-dub-1983", name: { pt: "Dublagem clássica (1983)", en: "Classic dub (1983)" },
          year: 1983, studio: "Herbert Richers (Rio de Janeiro)", director: "Garcia Neto",
          cast: [["Luke Skywalker", "Mário Jorge Andrade"], ["Princesa Leia", "Ilka Pinheiro"], ["Han Solo", "Francisco Milani"], ["Obi-Wan Kenobi", "Isaac Bardavid"], ["C-3PO", "Orlando Drummond"], ["Darth Vader", "Silvio Navas"]],
          note: {
            pt: "Feita para a Rede Manchete em 1983, sobre a versão de cinema, com o título Guerra nas Estrelas. Também foi lançada oficialmente em VHS.",
            en: "Made for Rede Manchete in 1983, on the theatrical version, under the title Guerra nas Estrelas. Also officially released on VHS." },
          src: ["sw_dub", "sw_dubn"] },
        { id: "sw-dub-1997", name: { pt: "Redublagem (1997)", en: "Redub (1997)" },
          year: 1997, studio: "Delart (Rio de Janeiro)", director: "Pádua Moreira",
          cast: [["Luke Skywalker", "Marcus Jardym"], ["Princesa Leia", "Vera Miranda"], ["C-3PO", "Carlos Seidl"], ["Darth Vader", "Pádua Moreira"]],
          note: {
            pt: "Feita para a 20th Century Fox na época da Edição Especial, com tradução de Allan Lima.",
            en: "Made for 20th Century Fox around the Special Edition, translated by Allan Lima." },
          src: ["sw_dub", "sw_dub4"] },
        { id: "sw-dub-2015", name: { pt: "Redublagem (2015)", en: "Redub (2015)" },
          year: 2015, studio: "Delart (Rio de Janeiro)", director: "Sérgio Cantú",
          cast: [["Luke Skywalker", "Andreas Avancini"], ["Princesa Leia", "Mabel Cezar"], ["Han Solo", "Guilherme Briggs"]],
          note: {
            pt: "Feita para a Disney, com tradução de Guilherme Briggs. No Episódio IV, só estreou em 2021, direto no Disney+, por causa dos direitos da 20th Century Fox sobre o filme.",
            en: "Made for Disney, translated by Guilherme Briggs. For Episode IV it only premiered in 2021, straight to Disney+, because of 20th Century Fox's rights to the film." },
          src: ["sw_dub", "sw_dub4"] }
      ],
      versions: [
        {
          id: "sw-cinema-1977", type: "theatrical",
          name: { pt: "Exibição original (1977)", en: "Original theatrical run (1977)" },
          by: "20th Century Fox / Lucasfilm", released: "1977-05-25", cut: "theatrical",
          source: { pt: "Cópias 35mm (Technicolor no Reino Unido, Eastmancolor na maioria dos outros países) e cópias 70mm", en: "35mm prints (Technicolor in the UK, Eastmancolor in most other countries) and 70mm prints" },
          res: "35mm / 70mm", aspect: "2.39:1", formats: ["35mm", "70mm"],
          audio: [{ pt: "Três mixagens em 1977: mono, Dolby Stereo e seis canais (70mm)", en: "Three 1977 mixes: mono, Dolby Stereo and six-track (70mm)" }],
          summary: {
            pt: "O filme como estreou, antes de qualquer subtítulo ou alteração. Em junho de 2025, o BFI exibiu em Londres uma cópia IB Technicolor britânica original e sem desbotamento, pela primeira vez em décadas.",
            en: "The film as it opened, before any subtitle or alteration. In June 2025 the BFI screened an original, unfaded British IB Technicolor print in London, publicly for the first time in decades." },
          differences: [
            { pt: "Sem “Episódio IV – Uma Nova Esperança” no letreiro", en: "No “Episode IV – A New Hope” in the crawl" },
            { pt: "Cópias Eastmancolor desbotam para tons rosados ou marrons; as Technicolor britânicas mantêm a cor", en: "Eastmancolor prints fade to pink or brown tones; the British Technicolor prints hold their color" }
          ],
          reception: { level: "referencia", note: { pt: "O ponto de comparação de todas as versões.", en: "The baseline for every version." } },
          availability: "archive", best_for: [],
          src: ["sw_w1", "sw_bfi", "sw_npr"]
        },
        {
          id: "sw-vhs-1982", type: "official",
          name: { pt: "VHS, Betamax, LaserDisc e CED (1982–1992)", en: "VHS, Betamax, LaserDisc and CED (1982–1992)" },
          by: "20th Century Fox Video / CBS/Fox", released: "1982-05", cut: "theatrical",
          source: { pt: "Telecine em definição padrão", en: "Standard-definition telecine" },
          res: "SD", aspect: { pt: "Tela cheia (pan & scan); widescreen em edições de 1989 e 1992", en: "Full screen (pan & scan); widescreen in 1989 and 1992 editions" },
          formats: ["VHS", "Betamax", "LaserDisc", "CED"],
          audio: [{ pt: "Desde 1985: mixagem que junta os trechos preferidos de Lucas das três mixagens de 1977", en: "From 1985: a mix combining Lucas's preferred takes from the three 1977 mixes" }],
          summary: {
            pt: "As primeiras fitas e discos chegaram em 1982, de início para locadoras. A leva de 1985 trouxe áudio melhorado; o LaserDisc e o CED dela rodam 3% mais rápido para caber em um único disco.",
            en: "The first tapes and discs arrived in 1982, initially for rental. The 1985 batch brought improved audio; its LaserDisc and CED run 3% fast to fit on a single disc." },
          differences: [
            { pt: "Laterais cortadas nas edições em tela cheia", en: "Sides cropped in full-screen editions" },
            { pt: "LaserDisc e CED de 1985 acelerados em 3%", en: "1985 LaserDisc and CED sped up by 3%" }
          ],
          reception: { level: "misto", note: { pt: "Valor histórico e nostálgico; imagem fraca para os padrões atuais.", en: "Historic and nostalgic value; weak picture by today's standards." } },
          availability: "out_of_print", best_for: ["colecionador"],
          src: ["sw_w1", "sw_htf"]
        },
        {
          id: "sw-ld-1993", type: "official",
          name: { pt: "LaserDisc “Definitive Collection” (1993) e VHS “Faces” (1995)", en: "“Definitive Collection” LaserDisc (1993) and “Faces” VHS (1995)" },
          by: "20th Century Fox / Lucasfilm", released: "1993-09-15", cut: "theatrical",
          source: { pt: "Nova transferência em vídeo, com limpeza de sujeira e arranhões e cores reequilibradas", en: "A new video transfer with dirt and scratch removal and rebalanced color" },
          res: "SD", aspect: "Widescreen (letterbox)", formats: ["LaserDisc", "VHS"],
          audio: [{ pt: "Nova mixagem THX", en: "New THX mix" }],
          summary: {
            pt: "Caixa de nove LaserDiscs CAV com remasterização THX. O VHS “Faces” (16/06/1995) foi anunciado como a última vez das versões originais em fita, e o LaserDisc widescreen de 1995 usa a mesma transferência de 1993.",
            en: "A nine-disc CAV LaserDisc box with THX remastering. The “Faces” VHS (June 16, 1995) was billed as the last time for the original versions on tape, and the 1995 widescreen LaserDisc reuses the 1993 transfer." },
          differences: [
            { pt: "Montagem original, com os ajustes de 1981", en: "Original cut, with the 1981 tweaks" },
            { pt: "Limpeza digital e cores diferentes das do cinema", en: "Digital cleanup and colors that differ from the theatrical ones" }
          ],
          reception: { level: "bem_avaliado", note: { pt: "Referência em definição padrão para o original até hoje.", en: "Still the standard-definition reference for the original." } },
          availability: "out_of_print", best_for: ["colecionador"],
          src: ["sw_w1", "sw_arch", "sw_sv"]
        },
        {
          id: "sw-se-1997", type: "official",
          name: { pt: "Edição Especial (1997)", en: "Special Edition (1997)" },
          by: "Lucasfilm / 20th Century Fox", released: "1997-01-31", cut: "se1997",
          source: { pt: "Restauração para os 20 anos do filme, com cenas novas e efeitos em CGI", en: "A 20th-anniversary restoration with new scenes and CGI effects" },
          res: "35mm / SD", formats: ["35mm", "VHS", "LaserDisc"],
          summary: {
            pt: "Relançada nos cinemas para os 20 anos do filme, a Edição Especial acrescentou cenas e efeitos digitais. A mudança mais famosa: Greedo passa a atirar primeiro em Han Solo.",
            en: "Re-released in theaters for the film's 20th anniversary, the Special Edition added scenes and digital effects. The most famous change: Greedo now shoots first at Han Solo." },
          differences: [
            { pt: "Novas cenas e criaturas em CGI", en: "New scenes and CGI creatures" },
            { pt: "Lançada em VHS em 26/08/1997 (widescreen ou pan & scan) e em LaserDisc em 26/11/1997", en: "Released on VHS on Aug 26, 1997 (widescreen or pan & scan) and on LaserDisc on Nov 26, 1997" }
          ],
          reception: { level: "controverso", note: { pt: "Sucesso de bilheteria, mas as alterações dividem os fãs até hoje.", en: "A box-office hit, but its changes still divide fans." } },
          availability: "out_of_print", best_for: [],
          src: ["sw_w1", "sw_htf"]
        },
        {
          id: "sw-dvd-2004", type: "official",
          name: { pt: "DVD da trilogia (2004)", en: "Trilogy DVD (2004)" },
          by: "20th Century Fox / Lucasfilm", released: "2004-09", cut: "dvd2004",
          source: { pt: "Novo master digital com THX", en: "New THX digital master" },
          res: "SD", formats: ["DVD"],
          summary: {
            pt: "Primeira vez da trilogia em DVD, já com mais mudanças: Han e Greedo atiram quase juntos, Jabba ganha nova CGI e o filme recebe uma correção de cor que gerou forte reação dos fãs.",
            en: "The trilogy's DVD debut, with even more changes: Han and Greedo fire almost together, Jabba gets new CGI and the film receives a color grade that drew a strong fan backlash." },
          differences: [
            { pt: "Montagem de 2004", en: "2004 cut" },
            { pt: "Cores bem diferentes das do cinema", en: "Colors far from the theatrical ones" }
          ],
          reception: { level: "controverso", note: { pt: "A nova cor e as alterações provocaram protestos, que levaram à edição de 2006 com o original.", en: "The new color and changes sparked protests that led to the 2006 edition with the original." } },
          availability: "out_of_print", best_for: [],
          src: ["sw_w1", "sw_sv"]
        },
        {
          id: "sw-gout-2006", type: "official",
          name: { pt: "DVD Limited Edition (2006), disco bônus “GOUT”", en: "Limited Edition DVD (2006), “GOUT” bonus disc" },
          by: "20th Century Fox / Lucasfilm", released: "2006-09-12", cut: "theatrical",
          source: { pt: "Master do LaserDisc de 1993, com poucos ajustes", en: "The 1993 LaserDisc master, minimally tweaked" },
          res: "SD", aspect: { pt: "Widescreen não anamórfico (letterbox em 4:3)", en: "Non-anamorphic widescreen (letterboxed 4:3)" }, formats: ["DVD"],
          summary: {
            pt: "Depois dos protestos, a versão original veio como disco bônus. Foi a única vez que ela saiu em mídia digital oficial, mas a imagem vem de um master de 1993 e não é anamórfica, o que derruba a definição em TVs widescreen.",
            en: "After the protests, the original version came as a bonus disc. It was the only time it was released on official digital media, but the picture comes from a 1993 master and is non-anamorphic, which cuts resolution on widescreen TVs." },
          differences: [
            { pt: "Montagem original de cinema", en: "Original theatrical cut" },
            { pt: "Imagem não anamórfica, de master antigo", en: "Non-anamorphic picture from an old master" }
          ],
          reception: { level: "misto", note: { pt: "Celebrado por existir, criticado pela qualidade (vídeo 2/5 na Sound & Vision).", en: "Celebrated for existing, criticized for its quality (video 2/5 at Sound & Vision)." } },
          availability: "out_of_print", best_for: ["colecionador"],
          src: ["sw_sv", "sw_sv06", "sw_w1"]
        },
        {
          id: "sw-bd-2011", type: "official",
          name: { pt: "Blu-ray (2011)", en: "Blu-ray (2011)" },
          by: "20th Century Fox / Lucasfilm", released: "2011-09", cut: "bd2011",
          source: { pt: "Master HD da saga completa", en: "HD master for the complete saga" },
          res: "1080p", formats: ["Blu-ray"],
          audio: [{ pt: "Inglês DTS-HD Master Audio 6.1", en: "English DTS-HD Master Audio 6.1" }],
          summary: {
            pt: "Estreia em alta definição, com novas alterações e uma imagem muito saturada, que só foi suavizada na versão 4K.",
            en: "The high-definition debut, with new alterations and a heavily saturated picture that was only toned down in the 4K version." },
          differences: [
            { pt: "Sabre de Luke azul, pedras na caverna de R2-D2, tiro de Greedo encurtado", en: "Luke's saber turned blue, rocks at R2-D2's cave, Greedo's shot shortened" },
            { pt: "Cores muito saturadas", en: "Heavily saturated colors" }
          ],
          reception: { level: "controverso", note: { pt: "Áudio elogiado; cores e alterações criticadas.", en: "Audio praised; colors and alterations criticized." } },
          availability: "out_of_print", best_for: [],
          src: ["sw_w1", "sw_sv", "sw_tt4k"]
        },
        {
          id: "sw-uhd-2019", type: "official",
          name: { pt: "Disney+ 4K (2019) e 4K UHD Blu-ray (2020)", en: "Disney+ 4K (2019) and 4K UHD Blu-ray (2020)" },
          by: "Lucasfilm / Disney", released: "2019-11-12", cut: "d2019",
          source: { pt: "Novo master 4K com HDR", en: "New 4K HDR master" },
          res: "4K", hdr: { pt: "Dolby Vision (Disney+) / HDR10 (disco)", en: "Dolby Vision (Disney+) / HDR10 (disc)" }, aspect: "2.39:1",
          formats: ["Streaming", "4K UHD", "Blu-ray", "DVD"],
          audio: [
            { pt: "Inglês Dolby Atmos (nova mixagem)", en: "English Dolby Atmos (new mix)" },
            { pt: "Disney+ Brasil: redublagem Delart de 2015 (desde 2021)", en: "Disney+ Brazil: 2015 Delart redub (since 2021)" }
          ],
          summary: {
            pt: "A versão oficial com melhor imagem, com cores mais naturais que as do Blu-ray de 2011 e muito detalhe nas maquetes de 1977. Em troca, traz a montagem mais alterada de todas, incluindo o “Maclunkey” de Greedo. O disco 4K saiu em 31/03/2020.",
            en: "The official version with the best picture, with more natural colors than the 2011 Blu-ray and lots of detail in the 1977 models. In exchange, it carries the most altered cut of all, including Greedo's “Maclunkey.” The 4K disc came out on March 31, 2020." },
          differences: [
            { pt: "Para várias análises, a melhor imagem que o filme já teve em casa", en: "For several reviewers, the best the film has ever looked at home" },
            { pt: "Os efeitos em CGI de 1997 parecem mais datados ao lado das maquetes em 4K", en: "The 1997 CGI looks more dated next to the 4K models" },
            { pt: "Blu-ray e DVD da Disney também passaram a usar esta versão", en: "Disney's Blu-ray and DVD also switched to this version" }
          ],
          reception: { level: "bem_avaliado", note: { pt: "Imagem muito elogiada (vídeo B+ na The Digital Bits), mas a montagem segue alterada.", en: "Picture widely praised (video B+ at The Digital Bits), but the cut remains altered." } },
          availability: "in_print", best_for: ["imagem", "oficial"], dubs: ["sw-dub-2015"],
          src: ["sw_db4k", "sw_tt4k", "sw_wdw", "sw_mc", "sw_w1"]
        },
        {
          id: "sw-sse-2016", type: "fan_scan",
          name: { pt: "Silver Screen Edition (2016)", en: "Silver Screen Edition (2016)" },
          by: "Team Negative1", released: "2016-02", cut: "theatrical",
          source: { pt: "Uma única cópia 35mm da época, escaneada quadro a quadro em 1080p e limpa manualmente", en: "A single period 35mm print, scanned frame by frame at 1080p and cleaned by hand" },
          res: "1080p", formats: ["file"],
          summary: {
            pt: "Anos de trabalho de um grupo de fãs para restaurar uma única cópia 35mm. Diferente de projetos anteriores, não mistura várias fontes. Depois veio o 4K77, em resolução maior.",
            en: "Years of work by a fan group to restore a single 35mm print. Unlike earlier projects, it does not mix several sources. 4K77 followed later, at a higher resolution." },
          differences: [
            { pt: "Grão e textura de película", en: "Film grain and texture" },
            { pt: "Fonte única, sem montagem de várias mídias", en: "Single source, no patchwork of media" }
          ],
          reception: { level: "bem_avaliado", note: { pt: "Recebida como a primeira versão em HD a partir de uma única cópia.", en: "Received as the first HD version from a single print." } },
          availability: "unofficial", best_for: [],
          src: ["sw_ssett", "sw_ssepl"]
        },
        {
          id: "sw-4k77", type: "fan_scan",
          name: { pt: "Project 4K77", en: "Project 4K77" },
          by: "Team Negative1", released: "2018-05", cut: "theatrical",
          source: { pt: "97% de uma única cópia Technicolor de 1977 (dublada em espanhol), escaneada e limpa em 4K; o resto vem de outra cópia e de alguns quadros do Blu-ray oficial", en: "97% from a single 1977 Technicolor print (dubbed in Spanish), scanned and cleaned in 4K; the rest from another print and a few frames of the official Blu-ray" },
          res: "4K / 1080p", formats: ["file"],
          summary: {
            pt: "O projeto que virou referência entre os fãs do original: imagem escaneada em 4K direto da película, com grão e cores de época. Saiu em maio de 2018, primeiro em 4K e depois em 1080p, e ganhou revisões.",
            en: "The project that became the reference among fans of the original: an image scanned in 4K straight from film, with period grain and color. Released in May 2018, first in 4K and then in 1080p, with later revisions." },
          differences: [
            { pt: "Montagem original de cinema, sem as alterações de 1997 em diante", en: "Original theatrical cut, without the 1997-onward changes" },
            { pt: "Grão de película preservado; aparência dos anos 70", en: "Film grain preserved; a 1970s look" },
            { pt: "Não é upscale: a imagem foi escaneada em 4K", en: "Not an upscale: the image was scanned in 4K" }
          ],
          reception: { level: "aclamado", note: { pt: "Para muitos fãs, a experiência mais próxima do cinema de 1977.", en: "For many fans, the experience closest to the 1977 theater." } },
          availability: "unofficial", best_for: ["fidelidade"],
          src: ["sw_w2", "sw_eng"]
        },
        {
          id: "sw-despecialized", type: "fan_restoration",
          name: { pt: "Despecialized Edition (Harmy), v2.7", en: "Despecialized Edition (Harmy), v2.7" },
          by: "Petr “Harmy” Harmáček", released: "2011", cut: "theatrical",
          source: { pt: "Reconstrução em HD: base no Blu-ray de 2011, com o LaserDisc de 1993 como guia e trechos do DVD de 2006, de cópias 35mm, 70mm e 16mm, de transmissões em HD e de fotos das pinturas originais", en: "An HD reconstruction: based on the 2011 Blu-ray, with the 1993 LaserDisc as a guide and material from the 2006 DVD, 35mm, 70mm and 16mm prints, HD broadcasts and photos of the original matte paintings" },
          res: "HD", formats: ["file"],
          summary: {
            pt: "Começou em 2010 como projeto de um fã tcheco que queria mostrar o original ao irmão mais novo. Quadro a quadro, desfaz as alterações das Edições Especiais usando dezenas de fontes. A primeira versão saiu em 2011; a atual de Star Wars é a 2.7.",
            en: "It began in 2010 as a Czech fan's project to show the original to his little brother. Frame by frame, it undoes the Special Edition changes using dozens of sources. The first version came out in 2011; Star Wars is currently at v2.7." },
          differences: [
            { pt: "Imagem limpa e moderna, com cor corrigida", en: "Clean, modern picture with corrected color" },
            { pt: "É uma reconstrução: mistura fontes, e alguns trechos vêm de material de menor resolução", en: "It is a reconstruction: it mixes sources, and some shots come from lower-resolution material" }
          ],
          reception: { level: "aclamado", note: { pt: "Muito elogiada; alguns críticos lembram que é uma reconstrução, não uma preservação pura.", en: "Widely praised; some critics note it is a reconstruction, not a pure preservation." } },
          availability: "unofficial", best_for: [],
          src: ["sw_w2", "sw_vice", "sw_upx"]
        },
        {
          id: "sw-revisited", type: "fan_edit",
          name: { pt: "Star Wars: Revisited (Adywan)", en: "Star Wars: Revisited (Adywan)" },
          by: "Adywan", released: "2008", cut: "dvd2004",
          source: { pt: "Baseado no DVD de 2004, com cor, som e efeitos retrabalhados", en: "Based on the 2004 DVD, with reworked color, sound and effects" },
          res: "SD / HD", formats: ["file"],
          summary: {
            pt: "Um fan edit ambicioso: parte da Edição Especial de 2004, corrige cor e falhas visuais, refaz efeitos e reverte mudanças que incomodavam os fãs. Lançado em 2008, está entre os mais bem avaliados do Internet Fanedit Database.",
            en: "An ambitious fan edit: it starts from the 2004 Special Edition, fixes color and visual flaws, redoes effects and rolls back changes that bothered fans. Released in 2008, it is among the top-rated entries on the Internet Fanedit Database." },
          differences: [
            { pt: "Não é o original: é uma nova versão criada por um fã", en: "Not the original: a new version made by a fan" },
            { pt: "Cor e som retrabalhados; efeitos refeitos", en: "Reworked color and sound; redone effects" }
          ],
          reception: { level: "aclamado", note: { pt: "Avaliações altíssimas no IFDB (fanedit.org).", en: "Very high ratings on the IFDB (fanedit.org)." } },
          availability: "unofficial", best_for: [],
          src: ["sw_rev", "sw_rev2"]
        },
        {
          id: "sw-restoration-2027", type: "official", upcoming: true,
          name: { pt: "Restauração oficial do original (2027)", en: "Official restoration of the original (2027)" },
          by: "Lucasfilm / Disney", released: "2027-02-19", cut: "theatrical",
          source: { pt: "Nova restauração da versão de cinema de 1977", en: "A new restoration of the 1977 theatrical version" },
          res: { pt: "Cinema (inclui IMAX 70mm)", en: "Theatrical (incl. IMAX 70mm)" }, formats: ["IMAX", "IMAX 70mm"],
          summary: {
            pt: "Para os 50 anos do filme, a Lucasfilm anunciou em dezembro de 2025 a volta da versão de 1977 aos cinemas em 19/02/2027, numa restauração inédita. Depois veio a confirmação de sessões em IMAX, inclusive com cópias IMAX 70mm em salas selecionadas.",
            en: "For the film's 50th anniversary, Lucasfilm announced in December 2025 that the 1977 version returns to theaters on February 19, 2027, in a brand-new restoration. IMAX screenings followed, including IMAX 70mm prints in select venues." },
          differences: [
            { pt: "Primeira vez que o original sai oficialmente em alta qualidade", en: "The first official high-quality release of the original" },
            { pt: "Ainda não há anúncio de lançamento em casa", en: "No home release has been announced yet" }
          ],
          reception: { level: "em_breve", note: { pt: "Estreia em 19/02/2027.", en: "Opens February 19, 2027." } },
          availability: "upcoming", best_for: [],
          src: ["sw_2027a", "sw_2027b", "sw_2027c"]
        }
      ]
    },

    /* ============================================================
     * KILLER KLOWNS FROM OUTER SPACE (1988)
     * ============================================================ */
    {
      id: "killer-klowns-1988",
      tmdb: 16296,
      year: 1988,
      original_title: "Killer Klowns from Outer Space",
      title: { pt: "Palhaços Assassinos do Espaço Sideral", en: "Killer Klowns from Outer Space" },
      aka: { pt: ["Palhaços Assassinos"], en: [] },
      overview: {
        pt: "Uma nave em forma de tenda de circo pousa numa cidadezinha americana, e dela saem alienígenas com cara de palhaço que prendem as pessoas em casulos de algodão-doce. Um casal de jovens tenta avisar a polícia, que não acredita.",
        en: "A circus-tent spaceship lands near a small American town, and out come clown-faced aliens who trap people in cotton-candy cocoons. A young couple tries to warn the police, who won't believe them."
      },
      runtime: 86,
      director: "Stephen Chiodo",
      accent: "#d9443a",
      accent2: "#f1d24b",
      intro: {
        pt: "O cult dos irmãos Chiodo quase não passou nos cinemas e virou clássico no vídeo. A história dos lançamentos é de upgrades: dos VHS e LaserDiscs ao DVD da MGM, até a restauração 4K a partir do negativo original, feita para a Arrow Video em 2018, e o 4K UHD da Scream Factory em 2024.",
        en: "The Chiodo brothers' cult film barely played in theaters and became a classic on video. Its release history is one of upgrades: from VHS and LaserDisc to MGM's DVD, up to the 4K restoration from the original negative made for Arrow Video in 2018, and Scream Factory's 4K UHD in 2024."
      },
      guide: [
        { need: "imagem", version: "kk-uhd-scream-2024", why: {
          pt: "4K do negativo original com Dolby Vision. O áudio é o ponto mais fraco apontado nas análises.",
          en: "4K from the original negative with Dolby Vision. Audio is the weak spot reviewers point out." } },
        { need: "oficial", version: "kk-uhd-scream-2024", why: {
          pt: "A edição mais recente e fácil de encontrar.",
          en: "The most recent and easiest edition to find." } },
        { need: "colecionador", version: "kk-bd-arrow-2018", why: {
          pt: "Restauração 4K exclusiva, logo original da Trans World Entertainment e cerca de cinco horas de extras.",
          en: "Exclusive 4K restoration, the original Trans World Entertainment logo and about five hours of extras." } }
      ],
      cuts: [
        { id: "theatrical", name: { pt: "Versão de cinema (1988)", en: "Theatrical version (1988)" },
          note: { pt: "Não há montagens alternativas conhecidas.", en: "No alternate cuts are known." } }
      ],
      dubs: [],
      dubs_note: {
        pt: "Ainda não confirmamos os dados da dublagem brasileira (estúdio, ano e elenco). Se você conhece, sugira uma correção com fonte.",
        en: "We have not yet confirmed the Brazilian dub details (studio, year and cast). If you know them, suggest a correction with a source."
      },
      wanted: {
        pt: "Procura-se: scans de cópias 35mm e dados da dublagem brasileira e dos VHS lançados no Brasil.",
        en: "Wanted: 35mm print scans and details on the Brazilian dub and Brazilian VHS releases."
      },
      versions: [
        {
          id: "kk-cinema-1988", type: "theatrical",
          name: { pt: "Exibição original (1988)", en: "Original theatrical run (1988)" },
          by: "Trans World Entertainment", released: "1988-05-27", cut: "theatrical",
          source: { pt: "Cópias 35mm", en: "35mm prints" },
          res: "35mm", aspect: "1.85:1", formats: ["35mm"],
          summary: {
            pt: "Teve lançamento modesto nos cinemas; o sucesso veio depois, no home video.",
            en: "It had a modest theatrical release; success came later, on home video." },
          differences: [],
          reception: { level: "referencia", note: { pt: "Ponto de comparação das demais versões.", en: "The baseline for the other versions." } },
          availability: "archive", best_for: [],
          src: ["kk_db18"]
        },
        {
          id: "kk-vhs-ld", type: "official",
          name: { pt: "VHS e LaserDisc", en: "VHS and LaserDisc" },
          released: "1988-12", released_label: { pt: "Fim dos anos 80", en: "Late 1980s" }, cut: "theatrical",
          source: { pt: "Transferências antigas em definição padrão", en: "Older standard-definition transfers" },
          res: "SD", formats: ["VHS", "LaserDisc"],
          summary: {
            pt: "Foi no vídeo que o filme ganhou fama. As transferências dessa época foram superadas pelo DVD de 2001.",
            en: "Video is where the film found its fame. Transfers from this era were surpassed by the 2001 DVD." },
          differences: [],
          reception: { level: "misto", note: { pt: "Valor nostálgico; imagem bem inferior às edições posteriores.", en: "Nostalgic value; picture far below later editions." } },
          availability: "out_of_print", best_for: ["colecionador"],
          src: ["kk_md", "kk_db18"]
        },
        {
          id: "kk-dvd-2001", type: "official",
          name: { pt: "DVD MGM “Midnite Movies” (2001)", en: "MGM “Midnite Movies” DVD (2001)" },
          by: "MGM Home Entertainment", released: "2001", cut: "theatrical",
          source: { pt: "Nova transferência da MGM", en: "New MGM transfer" },
          res: "SD", aspect: "1.85:1 (16:9)", formats: ["DVD"],
          summary: {
            pt: "A primeira transferência caprichada do filme, numa edição econômica da linha Midnite Movies, com extras sobre a produção e os efeitos.",
            en: "The film's first proper transfer, in a budget Midnite Movies edition with extras on the production and effects." },
          differences: [
            { pt: "Diálogo um pouco fora de sincronia perto dos 17 minutos (o Blu-ray MGM repete o problema)", en: "Dialogue slightly out of sync around the 17-minute mark (the MGM Blu-ray repeats it)" }
          ],
          reception: { level: "bem_avaliado", note: { pt: "Muito bem recebido na época.", en: "Very well received at the time." } },
          availability: "out_of_print", best_for: [],
          src: ["kk_md", "kk_de"]
        },
        {
          id: "kk-bd-mgm-2012", type: "official",
          name: { pt: "Blu-ray MGM (2012)", en: "MGM Blu-ray (2012)" },
          by: "MGM", released: "2012", cut: "theatrical",
          source: { pt: "Master antigo da MGM em HD", en: "MGM's older HD master" },
          res: "1080p", aspect: "1.85:1", formats: ["Blu-ray"],
          summary: {
            pt: "Primeiro Blu-ray americano, sem nova restauração e com uma capa muito criticada.",
            en: "The first US Blu-ray, with no new restoration and much-criticized cover art." },
          differences: [
            { pt: "Mesmo problema de sincronia de diálogo do DVD", en: "Same dialogue sync issue as the DVD" }
          ],
          reception: { level: "misto", note: { pt: "Superado pelas edições da Arrow.", en: "Surpassed by Arrow's editions." } },
          availability: "out_of_print", best_for: [],
          src: ["kk_de", "kk_dvdt", "kk_md"]
        },
        {
          id: "kk-bd-arrow-2014", type: "official",
          name: { pt: "Blu-ray Arrow Video, Reino Unido (2014)", en: "Arrow Video Blu-ray, UK (2014)" },
          by: "Arrow Video", released: "2014-09-15", cut: "theatrical",
          source: { pt: "Transferência fornecida pela MGM, a mesma das edições anteriores", en: "MGM-supplied transfer, the same as earlier editions" },
          res: "1080p", aspect: "1.85:1", formats: ["Blu-ray", "DVD"],
          audio: [{ pt: "Estéreo 2.0 original (PCM sem compressão)", en: "Original 2.0 stereo (uncompressed PCM)" }],
          summary: {
            pt: "Edição britânica de região B, também em steelbook, cheia de extras. A imagem reaproveita o master da MGM.",
            en: "A Region B British edition, also in steelbook, packed with extras. The picture reuses MGM's master." },
          differences: [],
          reception: { level: "bem_avaliado", note: { pt: "Elogiada pelos extras; imagem igual à das edições MGM.", en: "Praised for its extras; picture identical to the MGM editions." } },
          availability: "out_of_print", best_for: [],
          src: ["kk_br14", "kk_md", "kk_dbrb"]
        },
        {
          id: "kk-bd-arrow-2018", type: "official",
          name: { pt: "Blu-ray Arrow Video (2018), restauração 4K", en: "Arrow Video Blu-ray (2018), 4K restoration" },
          by: "Arrow Video", released: "2018-03", cut: "theatrical",
          source: { pt: "Nova restauração a partir de scan 4K do negativo original da câmera", en: "New restoration from a 4K scan of the original camera negative" },
          res: "1080p", aspect: "1.85:1", formats: ["Blu-ray", "DVD"],
          audio: [{ pt: "DTS-HD MA 5.1 e estéreo, remasterizados", en: "Remastered DTS-HD MA 5.1 and stereo" }],
          summary: {
            pt: "A grande virada: scan 4K do negativo original, com mais detalhe e cor, abertura com o logo original da Trans World Entertainment e cerca de cinco horas de extras. Saiu em março (Reino Unido) e abril (EUA) de 2018.",
            en: "The big turning point: a 4K scan of the original negative, with more detail and color, the original Trans World Entertainment logo and about five hours of extras. Released in March (UK) and April (US) 2018." },
          differences: [
            { pt: "Restauração exclusiva da Arrow na época", en: "Arrow-exclusive restoration at the time" }
          ],
          reception: { level: "aclamado", note: { pt: "Tratada como a edição definitiva em HD (vídeo nota A na The Digital Bits).", en: "Treated as the definitive HD edition (video A at The Digital Bits)." } },
          availability: "check", best_for: ["colecionador"],
          src: ["kk_db18", "kk_bd18", "kk_isle", "kk_md"]
        },
        {
          id: "kk-uhd-scream-2024", type: "official",
          name: { pt: "4K UHD Scream Factory (2024)", en: "Scream Factory 4K UHD (2024)" },
          by: "Scream Factory / Shout Studios", released: "2024-05-14", cut: "theatrical",
          source: { pt: "Master 4K do negativo original, aparentemente parecido com o da Arrow", en: "4K master from the original negative, apparently similar to Arrow's" },
          res: "4K", hdr: "Dolby Vision / HDR10", aspect: "1.85:1", formats: ["4K UHD", "Blu-ray"],
          audio: [{ pt: "Inglês DTS-HD MA 5.1 e DTS-HD MA 2.0 mono", en: "English DTS-HD MA 5.1 and DTS-HD MA 2.0 mono" }],
          summary: {
            pt: "A edição mais recente: cores vivas com Dolby Vision e textura de filme preservada. O áudio é o ponto fraco apontado pelas análises.",
            en: "The latest edition: vivid colors with Dolby Vision and preserved film texture. Audio is the weak spot reviewers point out." },
          differences: [
            { pt: "Também há edição em steelbook", en: "Also available as a steelbook" }
          ],
          reception: { level: "bem_avaliado", note: { pt: "Vídeo 4,5/5 na AV Nirvana; áudio considerado mediano.", en: "Video 4.5/5 at AV Nirvana; audio considered average." } },
          availability: "in_print", best_for: ["imagem", "oficial"],
          src: ["kk_avn", "kk_mc4k"]
        }
      ]
    },

    /* ============================================================
     * ALICE NO PAÍS DAS MARAVILHAS (1951)
     * ============================================================ */
    {
      id: "alice-1951",
      tmdb: 12092,
      year: 1951,
      original_title: "Alice in Wonderland",
      title: { pt: "Alice no País das Maravilhas", en: "Alice in Wonderland" },
      overview: {
        pt: "Entediada numa tarde de verão, Alice segue um Coelho Branco apressado e cai num mundo absurdo, onde encontra o Chapeleiro Maluco, um gato que some no ar e a temperamental Rainha de Copas.",
        en: "Bored on a summer afternoon, Alice follows a hurried White Rabbit and tumbles into an absurd world, where she meets the Mad Hatter, a cat who vanishes into thin air and the hot-tempered Queen of Hearts."
      },
      runtime: 75,
      director: "Clyde Geronimi, Wilfred Jackson, Hamilton Luske",
      accent: "#5a6fd6",
      accent2: "#e3557a",
      intro: {
        pt: "Animação em Technicolor que fracassou na estreia e virou clássico com o tempo. Teve várias edições em VHS e DVD, um Blu-ray restaurado em 2011 e, em 2026, uma restauração 4K feita a partir dos negativos de nitrato originais. No Brasil, tem duas dublagens: a clássica de 1951 e uma redublagem feita para o SBT.",
        en: "A Technicolor animation that flopped on release and became a classic over time. It had several VHS and DVD editions, a restored Blu-ray in 2011 and, in 2026, a 4K restoration from the original nitrate negatives. In Brazil it has two dubs: the classic 1951 one and a redub made for SBT."
      },
      guide: [
        { need: "imagem", version: "al-uhd-2026", why: {
          pt: "Restauração 4K dos negativos originais, chamada de lançamento de referência por Robert A. Harris.",
          en: "A 4K restoration from the original negatives, called reference quality by Robert A. Harris." } },
        { need: "oficial", version: "al-uhd-2026", why: {
          pt: "A edição mais nova, em 4K e em digital.",
          en: "The newest edition, in 4K and digital." } },
        { need: "dublagem", version: "al-bd-2011", why: {
          pt: "As edições brasileiras em DVD e Blu-ray trazem a dublagem clássica de 1951, com as canções em português.",
          en: "Brazilian DVD and Blu-ray editions carry the classic 1951 dub, with the songs in Portuguese." } },
        { need: "colecionador", version: "al-vhs", why: {
          pt: "Os VHS brasileiros guardam a dublagem de 1951 nas capas e vinhetas de época.",
          en: "Brazilian VHS tapes preserve the 1951 dub with period covers and bumpers." } }
      ],
      cuts: [
        { id: "theatrical", name: { pt: "Versão de cinema (1951)", en: "Theatrical version (1951)" },
          note: { pt: "Sem montagens alternativas conhecidas. Voltou aos cinemas em relançamentos, como o de 1974.", en: "No alternate cuts are known. It returned to theaters in re-releases, such as 1974's." } }
      ],
      dubs: [
        { id: "al-dub-1951", name: { pt: "Dublagem clássica (1951)", en: "Classic dub (1951)" },
          year: 1951, studio: "Continental Discos (Rio de Janeiro)", director: { pt: "Gilberto Souto (direção e supervisão)", en: "Gilberto Souto (director and supervisor)" },
          cast: [["Alice", "Therezinha Marçal"], ["Chapeleiro Maluco", "Otávio França"], ["Lebre de Março", "Orlando Drummond"], ["Rainha de Copas", "Sarah Nobre"], ["Mestre Gato", "Jorge Goulart"], ["Dodô", "Almirante"]],
          note: {
            pt: "Encomendada pela própria Disney, com canções dubladas pelo Trio Madrigal e pelo Trio Melodia. Braguinha participou da versão brasileira e indicou a voz de Alice. É a dublagem dos VHS, DVDs e Blu-ray brasileiros.",
            en: "Commissioned by Disney itself, with songs performed by Trio Madrigal and Trio Melodia. Braguinha took part in the Brazilian version and picked Alice's voice. It is the dub on Brazilian VHS, DVD and Blu-ray releases." },
          src: ["al_dub", "al_ther", "al_will", "al_blog"] },
        { id: "al-dub-1991", name: { pt: "Redublagem para o SBT (1991)", en: "SBT redub (1991)" },
          year: 1991, studio: "Herbert Richers (Rio de Janeiro)",
          cast: [["Alice", "Adriana Torres"]],
          note: {
            pt: "Encomendada pelo SBT, sem as canções dubladas. Foi exibida no início de 1991 e depois trocada pela dublagem clássica, até no próprio canal. Não saiu em mídia caseira. Alguns registros datam esta dublagem de 1995.",
            en: "Commissioned by SBT, without dubbed songs. Aired in early 1991 and later replaced by the classic dub, even on SBT itself. Never released on home media. Some records date this dub to 1995." },
          src: ["al_ufjf", "al_blog", "al_dub"] }
      ],
      wanted: {
        pt: "Procura-se: scan de cópia IB Technicolor 35mm. Cópias 35mm com a dublagem brasileira de 1951 existem em arquivos; a Cinemateca Portuguesa exibiu uma em 2022.",
        en: "Wanted: a scan of a 35mm IB Technicolor print. 35mm prints with the 1951 Brazilian dub survive in archives; the Portuguese Cinemateca screened one in 2022."
      },
      versions: [
        {
          id: "al-cinema-1951", type: "theatrical",
          name: { pt: "Exibição original (1951)", en: "Original theatrical run (1951)" },
          by: "Walt Disney Productions / RKO", released: "1951-07-26", cut: "theatrical",
          source: { pt: "Cópias 35mm em Technicolor, a partir de negativos de exposição sucessiva em nitrato", en: "35mm Technicolor prints from nitrate successive-exposure negatives" },
          res: "35mm", aspect: "1.37:1", formats: ["35mm"],
          summary: {
            pt: "Estreou em Londres em 26/07/1951 e não agradou à crítica nem ao público da época. No Brasil, chegou com dublagem própria, feita no mesmo ano.",
            en: "Premiered in London on July 26, 1951, and pleased neither critics nor audiences at the time. In Brazil it arrived with its own dub, made the same year." },
          differences: [
            { pt: "As cópias IB Technicolor (dye transfer) dos relançamentos são lembradas pelas cores", en: "The IB Technicolor (dye transfer) re-release prints are remembered for their color" },
            { pt: "Em 2022, a Cinemateca Portuguesa exibiu uma cópia 35mm com a dublagem brasileira de 1951", en: "In 2022 the Portuguese Cinemateca screened a 35mm print with the 1951 Brazilian dub" }
          ],
          reception: { level: "referencia", note: { pt: "Ponto de comparação das demais versões.", en: "The baseline for the other versions." } },
          availability: "archive", best_for: [],
          src: ["al_twdc", "al_cpt", "al_rah"]
        },
        {
          id: "al-vhs", type: "official",
          name: { pt: "VHS (1986–2000)", en: "VHS (1986–2000)" },
          by: "Walt Disney Home Video", released: "1986-05-27", cut: "theatrical",
          source: { pt: "Transferências em definição padrão", en: "Standard-definition transfers" },
          res: "SD", aspect: "1.33:1", formats: ["VHS"],
          summary: {
            pt: "Saiu na linha Walt Disney Classics em 1986 e foi relançado nos anos 90 e em 2000. Os VHS brasileiros trazem a dublagem clássica de 1951.",
            en: "Released in the Walt Disney Classics line in 1986 and reissued in the 1990s and in 2000. Brazilian VHS tapes carry the classic 1951 dub." },
          differences: [],
          reception: { level: "misto", note: { pt: "Valor nostálgico e de dublagem; imagem limitada.", en: "Nostalgic and dubbing value; limited picture." } },
          availability: "out_of_print", best_for: ["colecionador", "dublagem"], dubs: ["al-dub-1951"],
          src: ["al_vhs", "al_blog"]
        },
        {
          id: "al-dvds", type: "official",
          name: { pt: "DVDs (2000, 2004 e 2010)", en: "DVDs (2000, 2004 and 2010)" },
          by: "Walt Disney Home Entertainment", released: "2000", cut: "theatrical",
          source: { pt: "Transferências digitais para DVD", en: "Digital transfers for DVD" },
          res: "SD", aspect: "1.33:1", formats: ["DVD"],
          summary: {
            pt: "Três edições em DVD em dez anos. A Masterpiece Edition (2004) trouxe disco duplo com extras, e a Un-Anniversary (2010), lançada junto com o filme de Tim Burton, repete quase todos eles.",
            en: "Three DVD editions in ten years. The Masterpiece Edition (2004) brought a two-disc set of extras, and the Un-Anniversary Edition (2010), released alongside Tim Burton's film, repeats almost all of them." },
          differences: [],
          reception: { level: "bem_avaliado", note: { pt: "Boas edições para o formato; superadas pelo Blu-ray.", en: "Good editions for the format; surpassed by the Blu-ray." } },
          availability: "out_of_print", best_for: [], dubs: ["al-dub-1951"],
          editions: [
            { year: 2004, format: "DVD (2 discos)", region: { pt: "EUA", en: "US" }, label: "Walt Disney Home Entertainment", note: { pt: "Masterpiece Edition", en: "Masterpiece Edition" } },
            { year: 2010, format: "DVD (2 discos)", region: { pt: "EUA", en: "US" }, label: "Walt Disney Studios", note: { pt: "Special Un-Anniversary Edition", en: "Special Un-Anniversary Edition" } }
          ],
          src: ["al_dvdv"]
        },
        {
          id: "al-bd-2011", type: "official",
          name: { pt: "Blu-ray 60º Aniversário (2011)", en: "60th Anniversary Blu-ray (2011)" },
          by: "Walt Disney Studios", released: "2011-02-01", cut: "theatrical",
          source: { pt: "Restauração digital da Lowry Digital a partir do negativo original", en: "Lowry Digital restoration from the original negative" },
          res: "1080p", aspect: "1.33:1", formats: ["Blu-ray", "DVD"],
          audio: [
            { pt: "Inglês DTS-HD MA 5.1 (mixagem Disney Enhanced Home Theater)", en: "English DTS-HD MA 5.1 (Disney Enhanced Home Theater mix)" },
            { pt: "Mono original em Dolby Digital 2.0", en: "Original mono in Dolby Digital 2.0" }
          ],
          summary: {
            pt: "Estreia em alta definição, com restauração completa, cores vivas e uma canção inédita do gato (“I'm Odd”) entre os extras. As edições brasileiras trazem a dublagem clássica de 1951.",
            en: "The high-definition debut, with a full restoration, vivid colors and a newly found Cheshire Cat song (“I'm Odd”) among the extras. Brazilian editions carry the classic 1951 dub." },
          differences: [
            { pt: "Inclui a mixagem mono original", en: "Includes the original mono mix" }
          ],
          reception: { level: "aclamado", note: { pt: "Nota máxima de imagem em várias análises (10/10 na Sound & Vision).", en: "Top picture marks in several reviews (10/10 at Sound & Vision)." } },
          availability: "check", best_for: ["dublagem"], dubs: ["al-dub-1951"],
          src: ["al_tt", "al_sv", "al_db", "al_htf", "al_blog"]
        },
        {
          id: "al-uhd-2026", type: "official",
          name: { pt: "4K UHD 75º Aniversário (2026)", en: "75th Anniversary 4K UHD (2026)" },
          by: "Walt Disney Studios", released: "2026-05-05", cut: "theatrical",
          source: { pt: "Nova restauração 4K dos negativos originais de nitrato (Technicolor de exposição sucessiva): 324 mil quadros escaneados em nove meses de trabalho", en: "New 4K restoration from the original nitrate negatives (Technicolor successive exposure): 324,000 frames scanned over nine months" },
          res: "4K", hdr: "Dolby Vision", formats: ["4K UHD", "Digital"],
          audio: [{ pt: "Inglês DTS-HD MA 5.1 e mono original (Dolby 2.0)", en: "English DTS-HD MA 5.1 and original mono (Dolby 2.0)" }],
          summary: {
            pt: "Restauração da equipe Walt Disney Film Restoration para os 75 anos, com estreia mundial no TCM Classic Film Festival. Robert A. Harris a chamou de lançamento de referência. O Blu-ray incluso é o mesmo disco de 2011.",
            en: "A Walt Disney Film Restoration project for the 75th anniversary, premiered at the TCM Classic Film Festival. Robert A. Harris called it reference quality. The included Blu-ray is the same 2011 disc." },
          differences: [
            { pt: "Mais definição do que qualquer edição anterior", en: "More resolution than any earlier edition" },
            { pt: "O HDR realça as cores, sobretudo os vermelhos", en: "HDR makes colors pop, especially the reds" },
            { pt: "Os extras ficam todos no Blu-ray de 2011 incluso", en: "All extras live on the included 2011 Blu-ray" }
          ],
          reception: { level: "aclamado", note: { pt: "“Reference quality”, segundo Robert A. Harris; 4,5 estrelas no Home Theater Forum.", en: "“Reference quality,” per Robert A. Harris; 4.5 stars at Home Theater Forum." } },
          availability: "in_print", best_for: ["imagem", "oficial"],
          src: ["al_pr", "al_twdc", "al_tcm", "al_rah", "al_htf"]
        }
      ]
    }
  ],

  /* Fontes citadas (título no idioma da fonte) */
  sources: {
    ts_ao:   { t: "Animation Obsessive — The ‘Toy Story’ You Remember (Nov 2025)", u: "https://animationobsessive.substack.com/p/the-toy-story-you-remember" },
    ts_cb:   { t: "Creative Bloq — People are comparing Pixar's digital Toy Story with a 35mm scan (Jul 2026)", u: "https://www.creativebloq.com/entertainment/movies-tv-shows/people-are-comparing-pixars-digital-toy-story-with-a-scan-of-the-original-35mm-film-and-theyre-stunned-by-what-they-found" },
    ts_wiki: { t: "Wikipedia — Toy Story (home media)", u: "https://en.wikipedia.org/wiki/Toy_Story" },
    ts_br4k: { t: "Blu-ray.com — Toy Story 4K Blu-ray review (2019)", u: "https://www.blu-ray.com/movies/Toy-Story-4K-Blu-ray/239498/" },
    ts_tt3d: { t: "TweakTown — Toy Story 3D Blu-ray review", u: "https://www.tweaktown.com/reviews/4496/toy_story_3d_1995_blu_ray_review/index.html" },
    ts_tt:   { t: "TweakTown — Toy Story Blu-ray review", u: "https://www.tweaktown.com/reviews/3333/toy_story_bluray_movie_review/index.html" },
    ts_hddn: { t: "High-Def Disc News — Toy Story 4K UHD review", u: "https://highdefdiscnews.com/2019/06/06/toy-story-4k-uhd-blu-ray-review/" },
    ts_lmw:  { t: "Lost Media Wiki forums — Toy Story original theatrical version", u: "https://forums.lostmediawiki.com/thread/3612/story-original-theatrical-version-1995" },
    ts_dub:  { t: "A Memória da Dublagem — Toy Story", u: "https://a-memoria-da-dublagem.weebly.com/dublagem-toy-story.html" },
    ts_dub2: { t: "Dublanet — Toy Story: Um Mundo de Aventuras", u: "https://www.dublanet.com.br/comunidade/showthread.php?mode=linear&tid=14729&pid=339081" },
    ts_lip:  { t: "Pixar Wiki (PT) — Alexandre Lippiani", u: "https://pixar.fandom.com/pt-br/wiki/Alexandre_Lippiani" },

    sw_w1:    { t: "Wikipedia — Changes in Star Wars re-releases", u: "https://en.wikipedia.org/wiki/Changes_in_Star_Wars_re-releases" },
    sw_w2:    { t: "Wikipedia — Harmy's Despecialized Edition (incl. 4K77)", u: "https://en.wikipedia.org/wiki/Harmy%27s_Despecialized_Edition" },
    sw_sv:    { t: "Sound & Vision — Remaster Class: Star Wars", u: "https://www.soundandvision.com/content/remaster-class-star-wars" },
    sw_sv06:  { t: "Sound & Vision — The First Star Wars Trilogy Limited Editions", u: "https://www.soundandvision.com/node/81814" },
    sw_htf:   { t: "Home Theater Forum — Star Wars: a brief history of the original trilogy on video", u: "https://www.hometheaterforum.com/star-wars-a-brief-history-of-the-original-trilogy-at-home/" },
    sw_arch:  { t: "Archivum — Star Wars home video releases", u: "https://www.archivum.wiki/article/star_wars_home_video_releases" },
    sw_bfi:   { t: "BFI — Film on Film Festival 2025 line-up (original release print)", u: "https://www.bfi.org.uk/news/bfi-film-film-festival-line-up-star-wars-twin-peaks" },
    sw_npr:   { t: "NPR — This is not the ‘Star Wars’ you thought you knew", u: "https://www.npr.org/transcripts/nx-s1-5432435" },
    sw_db4k:  { t: "The Digital Bits — Star Wars: A New Hope (4K UHD review)", u: "https://digitalbits.com/item/star-wars-a-new-hope-uhd" },
    sw_tt4k:  { t: "TweakTown — A New Hope 4K Blu-ray review", u: "https://www.tweaktown.com/reviews/9448/star-wars-episode-iv-new-hope-4k-blu-ray/index.html" },
    sw_wdw:   { t: "WDWNT — Greedo gets the last word in the Disney+ 4K version (2019)", u: "https://wdwnt.com/2019/11/video-greedo-gets-the-last-word-in-a-new-change-found-in-star-wars-a-new-hope-new-4k-transfers-of-star-wars-films-discovered-on-disney/" },
    sw_mc:    { t: "Movie-Censorship — Fox Blu-ray vs Disney 4K remaster", u: "https://www.movie-censorship.com/report.php?ID=813935" },
    sw_ssett: { t: "TweakTown — Original Star Wars 35mm fan preservation released (2016)", u: "https://www.tweaktown.com/news/49900/original-star-wars-35mm-fan-preservation-released/index.html" },
    sw_ssepl: { t: "The Playlist — New scan of an original 1977 35mm print vs the Blu-ray", u: "https://theplaylist.net/watch-new-scan-of-an-original-1977-35mm-print-of-star-wars-vs-the-official-blu-ray-release-20160218/" },
    sw_eng:   { t: "Engadget — Meet the upscalers (4K77)", u: "https://engadget.com/meet-the-upscalers-star-wars-140000459.html" },
    sw_vice:  { t: "Vice — ‘Star Wars: Despecialized Edition’ restores the original trilogy", u: "https://vice.com/en/article/star-wars-despecialized-edition-removes-alterations-to-the-original-trilogy" },
    sw_upx:   { t: "Uproxx — Meet the fan behind the Despecialized Edition", u: "https://uproxx.com/?p=1291960" },
    sw_rev:   { t: "Fanedit.org — Star Wars Episode IV: 2004 Special Edition Revisited (reviews)", u: "https://fanedit.org/star-wars-ep-iv-2004-special-edition-revisited/reviews/" },
    sw_rev2:  { t: "Fanedit.org — The Empire Strikes Back: Revisited (history)", u: "https://fanedit.org/star-wars-the-empire-strikes-back-revisited/" },
    sw_2027a: { t: "/Film — The original Star Wars is coming back to theaters", u: "https://slashfilm.com/2044287/star-wars-episode-iv-a-new-hope-original-theatrical-cut-re-release" },
    sw_2027b: { t: "RedShark News — Original 1977 cut returning for the 50th anniversary (Dec 2025)", u: "https://www.redsharknews.com/star-wars-original-1977-theatrical-cut-returning-to-cinemas-for-50th-anniversary" },
    sw_2027c: { t: "Engadget — Star Wars coming to IMAX 70mm in 2027", u: "https://engadget.com/2253591/the-first-and-latest-star-wars-films-are-coming-to-imax-70mm-in-2027/" },
    sw_dub:   { t: "Dublagem Wiki — Star Wars", u: "https://dublagem.fandom.com/wiki/Star_Wars" },
    sw_dub4:  { t: "Dublagem Wiki — Star Wars Episódio IV: Uma Nova Esperança", u: "https://dublagem.fandom.com/wiki/Star_Wars_Epis%C3%B3dio_IV:_Uma_Nova_Esperan%C3%A7a" },
    sw_dubn:  { t: "Dublanet — Guerra nas Estrelas (1ª dublagem)", u: "https://www.dublanet.com.br/comunidade/showthread.php?tid=208" },

    kk_md:   { t: "Mondo Digital — Killer Klowns from Outer Space", u: "https://mondo-digital.com/killerklowns" },
    kk_de:   { t: "DVD Exotica — Dueling Blus: Killer Klowns from Outer Space", u: "https://www.dvdexotica.com/2018/01/dueling-blus-killer-klowns-from-outer.html" },
    kk_db18: { t: "The Digital Bits — Killer Klowns: Special Edition (Arrow, 2018)", u: "https://digitalbits.com/reviews/item/killer-klowns-from-outer-space-se-brd" },
    kk_dbrb: { t: "The Digital Bits — Killer Klowns (Region B, 2014)", u: "https://digitalbits.com/item/killer-klowns-from-outer-space-rb-bd" },
    kk_dvdt: { t: "DVD Talk — Killer Klowns from Outer Space (Arrow, 2018)", u: "https://www.dvdtalk.com/reviews/review/72977" },
    kk_br14: { t: "Blu-ray.com — Arrow announces Killer Klowns (2014)", u: "https://m.blu-ray.com/news/newsitem.php?id=14876" },
    kk_bd18: { t: "Bloody Disgusting — Arrow's new Killer Klowns restoration (2018)", u: "https://bloody-disgusting.com/home-video/3475581/arrow-video-bringing-killer-klowns-blu-ray-brand-new-restoration/" },
    kk_isle: { t: "The Movie Isle — Arrow's Killer Klowns (2018)", u: "https://themovieisle.com/2018/04/25/blu-ray-review-arrow-videos-killer-klowns-form-outer-space-collectors-edition/" },
    kk_avn:  { t: "AV Nirvana — Killer Klowns 4K Blu-ray review (2024)", u: "https://www.avnirvana.com/threads/killer-klowns-from-outer-space-4k-blu-ray-review.13684/latest" },
    kk_mc4k: { t: "Mighty Chroma — Killer Klowns 4K UHD reviews roundup", u: "https://mightychroma.me/review/a88d124d-5beb-59cd-b888-59f257145f81" },

    al_htf:  { t: "Home Theater Forum — Alice in Wonderland (1951) UHD review", u: "https://www.hometheaterforum.com/alice-in-wonderland-1951-uhd-review/" },
    al_rah:  { t: "Robert A. Harris — A few words about… Alice in Wonderland (1951) in 4K UHD", u: "https://www.hometheaterforum.com/a-few-words-about-alice-in-wonderland-1951-in-4k-uhd/" },
    al_pr:   { t: "Disney press release — Alice in Wonderland 4K UHD (Apr 2026)", u: "https://hometheaterforum.com/community/threads/bvhe-press-release-alice-in-wonderland-1951-4k-uhd-blu-ray.388746/" },
    al_twdc: { t: "The Walt Disney Company — Alice in Wonderland at 75", u: "https://thewaltdisneycompany.com/news/alice-wonderland-75-anniversary/" },
    al_tcm:  { t: "TCM Classic Film Festival — Alice in Wonderland world premiere restoration", u: "https://filmfestival.tcm.com/?p=8050" },
    al_tt:   { t: "TweakTown — Alice in Wonderland (1951) Blu-ray review", u: "https://www.tweaktown.com/reviews/4175/alice_in_wonderland_1951_blu_ray_movie_review/index.html" },
    al_sv:   { t: "Sound & Vision — Alice in Wonderland 60th Anniversary (Blu-ray)", u: "https://www.soundandvision.com/content/alice-wonderland-60th-anniversary-special-edition-blu-ray" },
    al_db:   { t: "The Digital Bits — Alice in Wonderland: 60th Anniversary Edition", u: "https://digitalbits.com/reviews/item/alice-in-wonderland-60th-anniversary-edition" },
    al_dvdv: { t: "DVD Verdict — Alice in Wonderland: Un-Anniversary Edition", u: "https://dvdverdict.com/reviews/aliceunanniversary.php" },
    al_vhs:  { t: "Retro Media Library — Alice in Wonderland VHS releases", u: "https://retromedialibrary.fandom.com/wiki/File:Aliceinwonderland_ukvhs.jpg" },
    al_cpt:  { t: "Cinemateca Portuguesa — Alice in Wonderland (sessão de 29/08/2022)", u: "https://www.cinemateca.pt/CinematecaSite/media/Documentos/2022-08-29_ALICE-IN-WONDERLAND.pdf" },
    al_dub:  { t: "Dublagem Wiki — Alice no País das Maravilhas", u: "https://dublagem.fandom.com/wiki/Alice_no_Pa%C3%ADs_das_Maravilhas" },
    al_ther: { t: "Dublagem Wiki — Therezinha Marçal", u: "https://dublagem.fandom.com/wiki/Therezinha_Mar%C3%A7al" },
    al_will: { t: "WILLDUBGURU — Alice no país das Maravilhas: elenco brasileiro", u: "https://www.non-disneyinternationaldubbingcredits.com/alice-no-paiacutes-das-maravilhas--alice-in-wonderland-brazilian-portuguese-voice-cast.html" },
    al_ufjf: { t: "UFJF — Dublagens de Alice (TCC sobre as versões de 1951 e 1991)", u: "https://www2.ufjf.br/bachareladotraducao/wp-content/uploads/sites/166/2020/08/Sophia-Martins.pdf" },
    al_blog: { t: "O Mundo das Ilusões — Alice no País das Maravilhas (Disney, 1951)", u: "https://silasig.blogspot.com/2014/08/alice-no-pais-das-maravilhas-1951.html" },

    r_imax:  { t: "Hypebeast — Star Wars heads to IMAX for the first time (Sep 2026)", u: "https://hypebeast.com/2026/9/star-wars-imax-70mm-50th-anniversary-re-release-announcement-info" }
  }
};
