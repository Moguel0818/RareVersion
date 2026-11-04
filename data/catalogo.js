/*
 * RareVersion — catálogo curado de filmes
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
  updated: "2026-11-03",

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
      releases: [
        {
          date: "1996-10-29",
          country: "US",
          format: "vhs",
          label: "Walt Disney Home Video",
          version: "ts-vhs-ld-1996",
          note: { pt: "Também em LaserDisc; EUA e Canadá; sem extras.", en: "Also on LaserDisc; US and Canada; no extras." },
          src: ["ts_wiki"]
        },
        {
          date: "1996-12-18",
          country: "US",
          format: "ld",
          label: "Walt Disney Home Video",
          name: { pt: "Deluxe widescreen, 4 discos, THX", en: "Deluxe widescreen box, 4 discs, THX" },
          version: "ts-vhs-ld-1996",
          src: ["ts_wiki"]
        },
        {
          date: "2000-10-17",
          country: "US",
          format: "dvd",
          label: "Walt Disney",
          name: { pt: "Ultimate Toy Box com Toy Story 2, 3 discos, THX", en: "Ultimate Toy Box with Toy Story 2, 3 discs, THX" },
          version: "ts-dvd-2000",
          src: ["ts_wiki"]
        },
        {
          date: "2001-03-20",
          country: "US",
          format: "dvd",
          label: "Walt Disney",
          name: { pt: "Edição avulsa", en: "Standalone release" },
          version: "ts-dvd-2000",
          src: ["ts_wiki"]
        },
        {
          date: "2005-09-06",
          country: "US",
          format: "dvd",
          label: "Walt Disney",
          name: { pt: "Edição de 10º aniversário, 2 discos", en: "10th Anniversary Edition, 2 discs" },
          version: "ts-dvd-2005",
          src: ["ts_wiki"]
        },
        {
          date: "2010-03-23",
          country: "US",
          format: "bd",
          label: "Disney / Pixar",
          name: { pt: "Edição Especial, Blu-ray + DVD", en: "Special Edition, Blu-ray + DVD" },
          version: "ts-bd-2010",
          src: ["ts_wiki"]
        },
        {
          date: "2011-11-01",
          country: "US",
          format: "3d",
          label: "Disney / Pixar",
          name: { pt: "Trilogia em 3D", en: "3D trilogy set" },
          version: "ts-bd-2010",
          src: ["ts_wiki"]
        },
        {
          date: "2019-06-04",
          country: "US",
          format: "4k",
          label: "Disney / Pixar",
          name: { pt: "4K UHD + Blu-ray", en: "4K UHD + Blu-ray" },
          version: "ts-uhd-2019",
          src: ["ts_br4k"]
        },
        {
          date: "2019-11-12",
          country: "US",
          format: "stream",
          label: "Disney+",
          version: "ts-disney-plus",
          src: ["ts_ao"]
        }
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
          scores: {
            fidelity: {
              v: 3,
              why: { pt: "Vieram da versão em película, com cores próximas às do cinema, mas com a resolução e o ruído do vídeo analógico.", en: "Sourced from the film version, with colors close to the theatrical ones, but with the resolution and noise of analog video." },
              src: ["ts_wiki", "ts_cb", "ts_ao"]
            },
            picture: { v: 1, why: { pt: "Definição de VHS e LaserDisc.", en: "VHS and LaserDisc resolution." }, src: ["ts_wiki"] },
            extras: {
              v: 3,
              why: { pt: "A caixa Deluxe de LaserDisc tem storyboards, story reels e comentário; o VHS não tem extras.", en: "The Deluxe LaserDisc box has storyboards, story reels and commentary; the VHS has no extras." },
              src: ["ts_wiki"]
            }
          },
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
          scores: {
            fidelity: {
              v: 2,
              why: { pt: "Imagem direto do digital, limpa e sem grão, com cores diferentes das do cinema.", en: "Picture straight from the digital files, clean and grainless, with colors unlike the theatrical ones." },
              src: ["ts_wiki", "ts_cb"]
            },
            picture: {
              v: 3,
              why: { pt: "Foi disco de demonstração por anos, com certificação THX; hoje fica limitado pela definição padrão.", en: "It was a demo disc for years, with THX certification; today it is limited by standard definition." },
              src: ["ts_wiki", "ts_tt"]
            },
            extras: {
              v: 4,
              why: { pt: "Caixa com Toy Story 2 e um disco só de extras.", en: "A box set with Toy Story 2 and a disc of extras." },
              src: ["ts_wiki"]
            }
          },
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
          scores: {
            fidelity: {
              v: 3,
              why: { pt: "Última edição feita a partir dos renders de 1995, mas ainda com as cores do digital, não as da película.", en: "The last edition made from the 1995 renders, but still with the digital colors, not the film ones." },
              src: ["ts_lmw", "ts_wiki"]
            },
            picture: {
              v: 3,
              why: { pt: "Citada em fóruns de preservação como a melhor fonte oficial do render original.", en: "Cited in preservation forums as the best official source of the original render." },
              src: ["ts_lmw"]
            },
            extras: {
              v: 4,
              why: { pt: "Edição dupla com novos extras.", en: "A two-disc edition with new extras." },
              src: ["ts_wiki"]
            }
          },
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
          scores: {
            fidelity: {
              v: 3,
              why: { pt: "Novo render em resolução maior: muito nítido, com cores mais próximas da película que o DVD e o streaming, porém mais frias e sem o visual de filme.", en: "A new render at higher resolution: very sharp, with colors closer to film than the DVD and streaming, but colder and without the film look." },
              src: ["ts_ao", "ts_wiki"]
            },
            picture: {
              v: 5,
              why: { pt: "Nota máxima de vídeo em análises técnicas (5/5 no Blu-ray.com).", en: "Top video marks in technical reviews (5/5 at Blu-ray.com)." },
              src: ["ts_tt3d", "ts_br4k"]
            }
          },
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
          scores: {
            fidelity: {
              v: 2,
              why: { pt: "Fonte 2K com HDR, que intensifica brancos e cores, e proporção 1.78:1 em vez da 1.85:1 do cinema.", en: "A 2K source with HDR that intensifies whites and colors, and a 1.78:1 ratio instead of the theatrical 1.85:1." },
              src: ["ts_br4k", "ts_hddn"]
            },
            picture: {
              v: 4,
              why: { pt: "Melhora confiável sobre o Blu-ray, mas não drástica (vídeo 4/5 no Blu-ray.com); os serrilhados do render ficam mais visíveis.", en: "A solid but not drastic upgrade over the Blu-ray (video 4/5 at Blu-ray.com); render aliasing becomes more visible." },
              src: ["ts_br4k", "ts_hddn"]
            }
          },
          reviews: [{ src: "ts_br4k", label: "Blu-ray.com", scale: 5, video: 4 }],
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
          scores: {
            fidelity: {
              v: 1,
              why: { pt: "Cores cruas, com verdes intensos que na película ficariam mais escuros, segundo a Animation Obsessive.", en: "Raw colors, with intense greens that would be darker on film, according to Animation Obsessive." },
              src: ["ts_ao", "ts_cb"]
            }
          },
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
          scores: {
            fidelity: {
              v: 5,
              why: { pt: "O mais perto do visual do cinema: cores mais quentes, grão e renders suavizados pela película. Cada scan tem sua cor, e nenhum reproduz exatamente a projeção de 1995.", en: "The closest to the theatrical look: warmer colors, grain and renders softened by film. Each scan has its own color, and none exactly reproduces the 1995 projection." },
              src: ["ts_ao", "ts_cb"]
            },
            picture: {
              v: 3,
              why: { pt: "Varia de scan para scan e carrega o desgaste das cópias.", en: "Varies from scan to scan and carries the wear of the prints." },
              src: ["ts_cb"]
            }
          },
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
      releases: [
        {
          date: "1982-05",
          country: "US",
          format: "vhs",
          label: "",
          version: "sw-vhs-1982",
          note: { pt: "Primeiro em locadoras; também em Betamax, LaserDisc e CED.", en: "Rental first; also on Betamax, LaserDisc and CED." },
          src: ["sw_w1", "sw_htf"]
        },
        {
          date: "1993-09-15",
          country: "US",
          format: "ld",
          label: "",
          name: { pt: "Caixa de 9 LaserDiscs CAV, remasterização THX", en: "9-disc CAV LaserDisc box, THX remaster" },
          version: "sw-ld-1993",
          src: ["sw_arch", "sw_w1"]
        },
        {
          date: "1995-06-16",
          country: "US",
          format: "vhs",
          label: "",
          name: { pt: "VHS “Faces”, anunciado como a última vez do original em fita", en: "“Faces” VHS, billed as the last time for the original on tape" },
          version: "sw-ld-1993",
          src: ["sw_w1"]
        },
        {
          date: "1997-08-26",
          country: "US",
          format: "vhs",
          label: "",
          name: { pt: "Edição Especial, widescreen ou pan & scan", en: "Special Edition, widescreen or pan & scan" },
          version: "sw-se-1997",
          src: ["sw_w1"]
        },
        {
          date: "1997-11-26",
          country: "US",
          format: "ld",
          label: "",
          name: { pt: "Edição Especial", en: "Special Edition" },
          version: "sw-se-1997",
          src: ["sw_w1"]
        },
        {
          date: "2004-09",
          country: "US",
          format: "dvd",
          label: "20th Century Fox",
          name: { pt: "Caixa da trilogia", en: "Trilogy box set" },
          version: "sw-dvd-2004",
          src: ["sw_w1"]
        },
        {
          date: "2006-09-12",
          country: "US",
          format: "dvd",
          label: "20th Century Fox",
          name: { pt: "Edição limitada com o original como disco bônus", en: "Limited Edition with the original as a bonus disc" },
          version: "sw-gout-2006",
          src: ["sw_sv06", "sw_w1"]
        },
        {
          date: "2011-09",
          country: "US",
          format: "bd",
          label: "20th Century Fox",
          name: { pt: "The Complete Saga", en: "The Complete Saga" },
          version: "sw-bd-2011",
          src: ["sw_w1"]
        },
        {
          date: "2019-11-12",
          country: "US",
          format: "stream",
          label: "Disney+",
          version: "sw-uhd-2019",
          src: ["sw_wdw"]
        },
        {
          date: "2020-03-31",
          country: "US",
          format: "4k",
          label: "Disney / Lucasfilm",
          name: { pt: "4K UHD + Blu-ray", en: "4K UHD + Blu-ray" },
          version: "sw-uhd-2019",
          src: ["sw_tt4k", "sw_w1"]
        }
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
          scores: {
            fidelity: {
              v: 2,
              why: { pt: "Montagem original, mas com laterais cortadas nas edições em tela cheia; LaserDisc e CED de 1985 rodam 3% mais rápido.", en: "The original cut, but with the sides cropped in full-screen editions; the 1985 LaserDisc and CED run 3% fast." },
              src: ["sw_w1", "sw_htf"]
            },
            picture: {
              v: 1,
              why: { pt: "Imagem fraca para os padrões atuais.", en: "Weak picture by today's standards." },
              src: ["sw_htf"]
            },
            audio: {
              v: 2,
              why: { pt: "Desde 1985, uma mixagem que junta trechos das três mixagens de 1977.", en: "Since 1985, a mix combining parts of the three 1977 mixes." },
              src: ["sw_w1"]
            }
          },
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
          scores: {
            fidelity: {
              v: 3,
              why: { pt: "Montagem original com os ajustes de 1981, mas com limpeza digital e cores diferentes das do cinema.", en: "The original cut with the 1981 tweaks, but with digital cleanup and colors unlike the theatrical ones." },
              src: ["sw_w1", "sw_arch"]
            },
            picture: {
              v: 2,
              why: { pt: "Referência em definição padrão para o original até hoje.", en: "Still the standard-definition reference for the original." },
              src: ["sw_arch", "sw_sv"]
            },
            audio: { v: 3, why: { pt: "Nova mixagem THX.", en: "A new THX mix." }, src: ["sw_arch"] }
          },
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
          scores: {
            fidelity: {
              v: 1,
              why: { pt: "Acrescenta cenas e efeitos digitais; Greedo passa a atirar primeiro.", en: "Adds digital scenes and effects; Greedo now shoots first." },
              src: ["sw_w1"]
            }
          },
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
          scores: {
            fidelity: {
              v: 1,
              why: { pt: "Mais mudanças e uma correção de cor que provocou forte reação dos fãs.", en: "More changes and a color correction that drew a strong fan backlash." },
              src: ["sw_w1", "sw_sv"]
            },
            picture: {
              v: 3,
              why: { pt: "Imagem limpa para um DVD, mas com cores muito diferentes das do cinema.", en: "A clean picture for a DVD, but with colors very different from the theatrical ones." },
              src: ["sw_sv"]
            }
          },
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
          scores: {
            fidelity: {
              v: 3,
              why: { pt: "É a montagem original de cinema, mas a imagem vem de um master de 1993 com limpeza digital.", en: "It is the original theatrical cut, but the picture comes from a 1993 master with digital cleanup." },
              src: ["sw_w1", "sw_sv06"]
            },
            picture: {
              v: 1,
              why: { pt: "Não anamórfica, o que derruba a definição em TVs widescreen (vídeo 2/5 na Sound & Vision).", en: "Non-anamorphic, which cuts the resolution on widescreen TVs (video 2/5 at Sound & Vision)." },
              src: ["sw_sv06", "sw_sv"]
            }
          },
          reviews: [{ src: "sw_sv06", label: "Sound & Vision", scale: 5, video: 2 }],
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
          scores: {
            fidelity: {
              v: 1,
              why: { pt: "Novas alterações (sabre azul, pedras na caverna de R2-D2) e cores muito saturadas.", en: "New changes (blue lightsaber, rocks in R2-D2's cave) and heavily saturated colors." },
              src: ["sw_w1", "sw_sv"]
            },
            picture: {
              v: 3,
              why: { pt: "Primeira vez em HD, mas com saturação exagerada.", en: "The first time in HD, but oversaturated." },
              src: ["sw_sv", "sw_tt4k"]
            },
            audio: {
              v: 5,
              why: { pt: "Áudio DTS-HD MA 6.1 muito elogiado.", en: "Highly praised DTS-HD MA 6.1 audio." },
              src: ["sw_sv"]
            }
          },
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
          scores: {
            fidelity: {
              v: 1,
              why: { pt: "Traz a montagem mais alterada de todas, incluindo o “Maclunkey” de Greedo.", en: "It has the most altered cut of all, including Greedo's “Maclunkey”." },
              src: ["sw_w1", "sw_wdw"]
            },
            picture: {
              v: 5,
              why: { pt: "Para várias análises, a melhor imagem que o filme já teve em casa (vídeo B+ na The Digital Bits).", en: "For several reviewers, the best picture the film has had at home (video B+ at The Digital Bits)." },
              src: ["sw_db4k", "sw_tt4k"]
            },
            audio: {
              v: 3,
              why: { pt: "Nova mixagem em Dolby Atmos; as mixagens de 1977 não estão no disco.", en: "A new Dolby Atmos mix; the 1977 mixes are not on the disc." },
              src: ["sw_db4k", "sw_w1"]
            }
          },
          reviews: [{ src: "sw_db4k", label: "The Digital Bits", video: "B+" }],
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
          scores: {
            fidelity: {
              v: 4,
              why: { pt: "Restauração de uma única cópia 35mm, sem misturar fontes, com grão de película.", en: "A restoration of a single 35mm print, with no mixing of sources, and film grain." },
              src: ["sw_ssett", "sw_ssepl"]
            },
            picture: {
              v: 3,
              why: { pt: "Em 1080p, com as limitações da cópia; depois superada pelo 4K77.", en: "In 1080p, with the print's limitations; later surpassed by 4K77." },
              src: ["sw_ssepl"]
            }
          },
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
          scores: {
            fidelity: {
              v: 5,
              why: { pt: "Escaneado em 4K direto de uma cópia de 1977, com montagem original, grão e cores de época.", en: "Scanned in 4K straight from a 1977 print, with the original cut, grain and period colors." },
              src: ["sw_w2", "sw_eng"]
            },
            picture: {
              v: 4,
              why: { pt: "Resolução real de 4K, com as marcas naturais de uma cópia de cinema.", en: "True 4K resolution, with the natural marks of a theatrical print." },
              src: ["sw_eng"]
            }
          },
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
          scores: {
            fidelity: {
              v: 3,
              why: { pt: "Desfaz as alterações quadro a quadro, mas é uma reconstrução que mistura dezenas de fontes, algumas de menor resolução.", en: "Undoes the changes frame by frame, but it is a reconstruction mixing dozens of sources, some of lower resolution." },
              src: ["sw_w2", "sw_vice"]
            },
            picture: {
              v: 4,
              why: { pt: "Imagem limpa e moderna, com cor corrigida.", en: "A clean, modern picture with corrected color." },
              src: ["sw_w2", "sw_upx"]
            }
          },
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
          scores: {
            fidelity: {
              v: 2,
              why: { pt: "Não busca o original: é uma nova versão a partir da Edição Especial de 2004.", en: "It does not aim for the original: it is a new version built from the 2004 Special Edition." },
              src: ["sw_rev"]
            },
            picture: {
              v: 3,
              why: { pt: "Cor e falhas corrigidas e efeitos refeitos sobre a base de 2004.", en: "Color and flaws fixed and effects redone on the 2004 base." },
              src: ["sw_rev"]
            }
          },
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
        { need: "fidelidade", version: "kk-bd-arrow-2018", why: {
          pt: "Restauração do negativo em SDR e estéreo original sem compressão: é a edição que menos reinterpreta o filme de 1988.",
          en: "A restoration of the negative in SDR with the original uncompressed stereo: the edition that reinterprets the 1988 film the least." } },
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
      links: {
        bluray: "https://www.blu-ray.com/Killer-Klowns-from-Outer-Space/132093/",
        dvdcompare: "https://www.dvdcompare.net/comparisons/film.php?fid=20970"
      },
      score_note: { pt: "Arrow (2018) e Scream Factory (2024) partem, ao que tudo indica, do mesmo scan 4K do negativo. A diferença está no acabamento: a Arrow é SDR, com o estéreo original sem compressão; a Scream tem 4K com HDR e um 5.1 criticado.", en: "Arrow (2018) and Scream Factory (2024) apparently start from the same 4K scan of the negative. The difference is in the finish: Arrow is SDR with the original uncompressed stereo; Scream has 4K with HDR and a criticized 5.1." },
      releases: [
        {
          date: "2001-08-28",
          country: "US",
          format: "dvd",
          label: "MGM",
          name: { pt: "Midnite Movies, edição especial", en: "Midnite Movies Special Edition" },
          version: "kk-dvd-2001",
          specs: "16:9 · Dolby Digital 2.0",
          src: ["kk_brdvd"]
        },
        {
          date: "2012-09-11",
          country: "US",
          format: "bd",
          label: "MGM",
          version: "kk-bd-mgm-2012",
          specs: { pt: "1080p · DTS-HD MA 2.0 · região livre", en: "1080p · DTS-HD MA 2.0 · region free" },
          src: ["kk_br12", "kk_dvdc"]
        },
        {
          date: "2012",
          country: "CA",
          format: "bd",
          label: "MGM / 20th Century Fox",
          version: "kk-bd-mgm-2012",
          note: { pt: "Edição canadense, igual à americana.", en: "Canadian edition, same as the US one." },
          src: ["kk_dvdc"]
        },
        {
          date: "",
          country: "US",
          format: "bd",
          label: "MGM",
          name: { pt: "Steelbook", en: "SteelBook" },
          version: "kk-bd-mgm-2012",
          src: ["kk_dvdc"],
          src_urls: ["https://www.blu-ray.com/movies/Killer-Klowns-from-Outer-Space-Blu-ray/218230/"]
        },
        {
          date: "",
          country: "US",
          format: "bd",
          label: "MGM (Walmart)",
          name: { pt: "Capa de Halloween (faceplate)", en: "Halloween faceplate" },
          version: "kk-bd-mgm-2012",
          src: ["kk_dvdc"],
          src_urls: ["https://www.blu-ray.com/movies/Killer-Klowns-from-Outer-Space-with-Halloween-FP-Blu-ray/111057/"]
        },
        {
          date: "",
          country: "US",
          format: "bd",
          label: "MGM",
          name: { pt: "4 cartões da Mondo e ingresso de Alien: Covenant", en: "4 Mondo cards and Alien: Covenant movie cash" },
          version: "kk-bd-mgm-2012",
          version_sure: false,
          src_urls: ["https://www.blu-ray.com/movies/Killer-Klowns-from-Outer-Space-Blu-ray/178170/"]
        },
        {
          date: "2014-09-15",
          country: "GB",
          format: "bd",
          label: "Arrow Video",
          name: { pt: "Blu-ray + DVD", en: "Blu-ray + DVD" },
          version: "kk-bd-arrow-2014",
          specs: { pt: "1080p · LPCM 2.0 · região B", en: "1080p · LPCM 2.0 · region B" },
          src: ["kk_br14p", "kk_br14"]
        },
        {
          date: "2014-09-15",
          country: "GB",
          format: "bd",
          label: "Arrow Video",
          name: { pt: "Steelbook limitado", en: "Limited Edition SteelBook" },
          version: "kk-bd-arrow-2014",
          src: ["kk_hcf14"],
          src_urls: ["https://www.blu-ray.com/movies/Killer-Klowns-from-Outer-Space-Blu-ray/104501/"]
        },
        {
          date: "",
          country: "GB",
          format: "bd",
          label: "Arrow Video / EverythingBlu",
          name: { pt: "Blu Pick Series BPS001 (steelbook)", en: "Blu Pick Series BPS001 (SteelBook)" },
          version: "kk-bd-arrow-2014",
          version_sure: false,
          src_urls: ["https://www.blu-ray.com/movies/Killer-Klowns-from-Outer-Space-Blu-ray/150154/"]
        },
        {
          date: "2018-04-09",
          country: "GB",
          format: "bd",
          label: "Arrow Video",
          name: { pt: "Edição especial, restauração 4K", en: "Special Edition, 4K restoration" },
          version: "kk-bd-arrow-2018",
          specs: { pt: "1080p · DTS-HD MA 5.1 · LPCM 2.0 · região B", en: "1080p · DTS-HD MA 5.1 · LPCM 2.0 · region B" },
          src: ["kk_ff18", "kk_dvdc"],
          src_urls: ["https://www.blu-ray.com/movies/Killer-Klowns-from-Outer-Space-Blu-ray/195433/"]
        },
        {
          date: "2018-04-24",
          country: "US",
          format: "bd",
          label: "Arrow Video",
          name: { pt: "Edição especial, restauração 4K", en: "Special Edition, 4K restoration" },
          version: "kk-bd-arrow-2018",
          specs: { pt: "1080p · DTS-HD MA 5.1 · LPCM 2.0 · regiões A e B", en: "1080p · DTS-HD MA 5.1 · LPCM 2.0 · regions A and B" },
          note: { pt: "A primeira tiragem veio com luva, capa reversível e livreto.", en: "The first pressing came with a slipcover, reversible sleeve and booklet." },
          src: ["kk_br18", "kk_dvdc"]
        },
        {
          date: "2018",
          country: "CA",
          format: "bd",
          label: "Arrow Video",
          version: "kk-bd-arrow-2018",
          src: ["kk_dvdc"]
        },
        {
          date: "2019-10-24",
          country: "DE",
          format: "bd",
          label: "Koch Media",
          name: { pt: "Mediabook Blu-ray + DVD", en: "Mediabook Blu-ray + DVD" },
          version: "kk-bd-arrow-2018",
          version_sure: false,
          specs: { pt: "Áudio alemão em DTS-HD MA 5.1", en: "German audio in DTS-HD MA 5.1" },
          note: { pt: "Anunciado com novo scan 4K; a origem do master não foi confirmada.", en: "Announced with a new 4K scan; the master's origin is unconfirmed." },
          src: ["kk_ad19"]
        },
        {
          date: "2022-11-10",
          country: "DE",
          format: "bd",
          label: "Plaion Pictures",
          name: { pt: "Mediabook Blu-ray + DVD, capa B (exclusivo da Amazon)", en: "Mediabook Blu-ray + DVD, cover B (Amazon exclusive)" },
          version: "kk-bd-arrow-2018",
          version_sure: false,
          src: ["kk_ad22"]
        },
        {
          date: "2024-05-14",
          country: "US",
          format: "4k",
          label: "Scream Factory",
          name: { pt: "35th Anniversary Edition, 4K UHD + Blu-ray", en: "35th Anniversary Edition, 4K UHD + Blu-ray" },
          version: "kk-uhd-scream-2024",
          specs: "2160p · Dolby Vision / HDR10 · DTS-HD MA 5.1 + 2.0",
          src: ["kk_br4k", "kk_dvdc"]
        },
        {
          date: "2024-05-14",
          country: "US",
          format: "4k",
          label: "Scream Factory",
          name: { pt: "Steelbook limitado, 4K UHD + Blu-ray", en: "Limited Edition SteelBook, 4K UHD + Blu-ray" },
          version: "kk-uhd-scream-2024",
          src: ["kk_br4ks"]
        },
        {
          date: "2024-05-14",
          country: "CA",
          format: "4k",
          label: "Shout! Studios",
          name: { pt: "35th Anniversary Edition", en: "35th Anniversary Edition" },
          version: "kk-uhd-scream-2024",
          src: ["kk_dvdc"]
        },
        {
          date: "2024-10-28",
          country: "GB",
          format: "bd",
          label: "Final Cut Entertainment",
          note: { pt: "Edição simples, região B; a origem do master não foi informada.", en: "Standard edition, region B; the master's origin wasn't stated." },
          src: ["kk_hmv24"],
          src_urls: ["https://www.blu-ray.com/movies/Killer-Klowns-from-Outer-Space-Blu-ray/367868/"]
        },
        {
          date: "",
          country: "US",
          format: "digital",
          label: "iTunes, Google Play, Prime Video, Vudu",
          src: ["kk_brt"]
        },
        {
          date: "",
          country: "BR",
          format: "stream",
          label: "Prime Video",
          name: { pt: "Como “Palhaços Assassinos do Espaço Sideral”", en: "As “Palhaços Assassinos do Espaço Sideral”" },
          note: { pt: "No catálogo em 2025, segundo o Omelete.", en: "In the catalog in 2025, according to Omelete." },
          src: ["kk_om25"]
        }
      ],
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
          scores: {
            fidelity: {
              v: 2,
              why: { pt: "Transferências antigas em definição padrão, bem abaixo do que o negativo guarda.", en: "Old standard-definition transfers, far below what the negative holds." },
              src: ["kk_md"]
            },
            picture: {
              v: 1,
              why: { pt: "Imagem de VHS e LaserDisc, superada já pelo DVD de 2001.", en: "VHS and LaserDisc picture, already surpassed by the 2001 DVD." },
              src: ["kk_md"]
            }
          },
          src: ["kk_md", "kk_db18"]
        },
        {
          id: "kk-dvd-2001", type: "official",
          name: { pt: "DVD MGM “Midnite Movies” (2001)", en: "MGM “Midnite Movies” DVD (2001)" },
          by: "MGM Home Entertainment", released: "2001-08-28", cut: "theatrical",
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
          scores: {
            fidelity: {
              v: 3,
              why: { pt: "Primeira transferência caprichada, em widescreen 1.85:1 anamórfico; o diálogo sai um pouco de sincronia perto dos 17 minutos.", en: "The first proper transfer, in anamorphic 1.85:1 widescreen; dialogue drifts slightly out of sync around the 17-minute mark." },
              src: ["kk_md", "kk_brdvd", "kk_de"]
            },
            picture: {
              v: 2,
              why: { pt: "Boa para um DVD da época, limitada pela definição padrão.", en: "Good for a DVD of its time, limited by standard definition." },
              src: ["kk_md"]
            },
            audio: {
              v: 2,
              why: { pt: "Dolby Digital 2.0, com o mesmo problema de sincronia.", en: "Dolby Digital 2.0, with the same sync issue." },
              src: ["kk_brdvd", "kk_de"]
            },
            extras: {
              v: 4,
              why: { pt: "Comentário dos irmãos Chiodo e documentários sobre produção e efeitos, reaproveitados por quase todas as edições seguintes.", en: "The Chiodo brothers' commentary and featurettes on the production and effects, reused by nearly every later edition." },
              src: ["kk_md"]
            }
          },
          src: ["kk_md", "kk_de"]
        },
        {
          id: "kk-bd-mgm-2012", type: "official",
          name: { pt: "Blu-ray MGM (2012)", en: "MGM Blu-ray (2012)" },
          by: "MGM", released: "2012-09-11", cut: "theatrical",
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
          scores: {
            fidelity: {
              v: 3,
              why: { pt: "Master antigo da MGM, com sujeira de cópia e pretos fracos; abre com o logo da MGM e repete o problema de sincronia do DVD.", en: "MGM's older master, with print damage and weak blacks; it opens with the MGM logo and repeats the DVD's sync issue." },
              src: ["kk_br12", "kk_dvdc"]
            },
            picture: {
              v: 3,
              why: { pt: "Boa granulação e cores vivas para um master antigo (vídeo 4/5 no Blu-ray.com), mas superado pelo scan 4K.", en: "Good grain and vivid color for an old master (video 4/5 at Blu-ray.com), but surpassed by the 4K scan." },
              src: ["kk_br12", "kk_mc12"]
            },
            audio: {
              v: 2,
              why: { pt: "DTS-HD MA 2.0 limpo, mas básico, com a falha de sincronia entre 17 e 18 minutos (áudio 2,5/5 no Blu-ray.com).", en: "Clean but basic DTS-HD MA 2.0, with the sync flaw between 17 and 18 minutes (audio 2.5/5 at Blu-ray.com)." },
              src: ["kk_br12", "kk_tb12"]
            },
            extras: {
              v: 4,
              why: { pt: "Traz os extras do DVD de 2001 (extras 4,5/5 no Blu-ray.com).", en: "Carries over the 2001 DVD extras (extras 4.5/5 at Blu-ray.com)." },
              src: ["kk_br12"]
            }
          },
          reviews: [{ src: "kk_br12", label: "Blu-ray.com", date: "2012-09-13", scale: 5, video: 4, audio: 2.5, extras: 4.5 }],
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
          scores: {
            fidelity: {
              v: 3,
              why: { pt: "Reaproveita o master da MGM; a imagem é a mesma das edições anteriores.", en: "Reuses MGM's master; the picture matches the earlier editions." },
              src: ["kk_br14", "kk_dbrb"]
            },
            picture: {
              v: 3,
              why: { pt: "Mesma imagem do Blu-ray da MGM.", en: "Same picture as the MGM Blu-ray." },
              src: ["kk_br14", "kk_md"]
            },
            audio: {
              v: 3,
              why: { pt: "Estéreo 2.0 original em PCM sem compressão. Não achamos análise que confirme se a falha de sincronia foi corrigida.", en: "Original 2.0 stereo in uncompressed PCM. We found no review confirming whether the sync flaw was fixed." },
              src: ["kk_br14p", "kk_br14"]
            },
            extras: {
              v: 4,
              why: { pt: "Os extras da MGM mais entrevistas novas, um passeio pelo estúdio dos Chiodo e livreto.", en: "MGM's extras plus new interviews, a tour of the Chiodo studio and a booklet." },
              src: ["kk_dvdc", "kk_hcf14"]
            }
          },
          src: ["kk_br14", "kk_md", "kk_dbrb"]
        },
        {
          id: "kk-bd-arrow-2018", type: "official",
          name: { pt: "Blu-ray Arrow Video (2018), restauração 4K", en: "Arrow Video Blu-ray (2018), 4K restoration" },
          by: "Arrow Video", released: "2018-04-09", cut: "theatrical",
          source: { pt: "Nova restauração a partir de scan 4K do negativo original da câmera", en: "New restoration from a 4K scan of the original camera negative" },
          res: "1080p", aspect: "1.85:1", formats: ["Blu-ray", "DVD"],
          audio: [{ pt: "DTS-HD MA 5.1 e estéreo, remasterizados", en: "Remastered DTS-HD MA 5.1 and stereo" }],
          summary: {
            pt: "A grande virada: scan 4K do negativo original, com mais detalhe e cor, abertura com o logo original da Trans World Entertainment e cerca de cinco horas de extras. Saiu em abril de 2018, no dia 9 no Reino Unido e no dia 24 nos EUA.",
            en: "The big turning point: a 4K scan of the original negative, with more detail and color, the original Trans World Entertainment logo and about five hours of extras. Released in April 2018: on the 9th in the UK and the 24th in the US." },
          differences: [
            { pt: "Restauração exclusiva da Arrow na época", en: "Arrow-exclusive restoration at the time" }
          ],
          reception: { level: "aclamado", note: { pt: "Tratada como a edição definitiva em HD (vídeo nota A na The Digital Bits).", en: "Treated as the definitive HD edition (video A at The Digital Bits)." } },
          availability: "check", best_for: ["colecionador"],
          scores: {
            fidelity: {
              v: 5,
              why: { pt: "Restauração a partir de scan 4K do negativo original, em SDR, com o estéreo original em PCM e o logo da Trans World. Para fidelidade ao lançamento de 1988, é a opção mais segura.", en: "A restoration from a 4K scan of the original negative, in SDR, with the original stereo in PCM and the Trans World logo. For fidelity to the 1988 release, it is the safest pick." },
              src: ["kk_br18", "kk_dvdc", "kk_db18"]
            },
            picture: {
              v: 4,
              why: { pt: "Salto claro de detalhe sobre o Blu-ray da MGM, cores mais quentes e grão natural (vídeo 5/5 no Blu-ray.com). Fica abaixo só do 4K.", en: "A clear jump in detail over the MGM Blu-ray, warmer color and natural grain (video 5/5 at Blu-ray.com). Only the 4K tops it." },
              src: ["kk_br18", "kk_mc18"]
            },
            audio: {
              v: 4,
              why: { pt: "Estéreo LPCM 2.0 limpo e um 5.1 que usa pouco os canais traseiros (áudio 4/5 no Blu-ray.com).", en: "Clean LPCM 2.0 stereo and a 5.1 that uses the rear channels sparingly (audio 4/5 at Blu-ray.com)." },
              src: ["kk_br18", "kk_mc18"]
            },
            extras: {
              v: 5,
              why: { pt: "Cerca de cinco horas de extras, incluindo os curtas antigos dos Chiodo (extras 5/5 no Blu-ray.com).", en: "About five hours of extras, including the Chiodos' early shorts (extras 5/5 at Blu-ray.com)." },
              src: ["kk_br18", "kk_dvdc"]
            }
          },
          reviews: [
            { src: "kk_br18", label: "Blu-ray.com", date: "2018-04-19", scale: 5, video: 5, audio: 4, extras: 5 },
            { src: "kk_db18", label: "The Digital Bits", video: "A" }
          ],
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
          reception: { level: "bem_avaliado", note: { pt: "Vídeo nota A na The Digital Bits e 4,5/5 no Blu-ray.com; áudio considerado mediano.", en: "Video A at The Digital Bits and 4.5/5 at Blu-ray.com; audio considered average." } },
          availability: "in_print", best_for: ["imagem", "oficial"],
          scores: {
            fidelity: {
              v: 4,
              why: { pt: "Scan 4K do negativo, ao que tudo indica o mesmo usado pela Arrow. O HDR com Dolby Vision é uma releitura das cores, algumas análises notam pretos esmagados e há um breve corte no áudio perto de 1h43.", en: "A 4K scan of the negative, apparently the same one Arrow used. The Dolby Vision HDR reinterprets the color, some reviews note crushed blacks, and there is a brief audio edit near 1:43." },
              src: ["kk_db4k", "kk_br4ks", "kk_mc4k"]
            },
            picture: {
              v: 5,
              why: { pt: "A melhor imagem que o filme já teve em casa: 4K nativo, cores intensas e grão fino (vídeo A na The Digital Bits e 4,5/5 no Blu-ray.com).", en: "The best picture the film has had at home: native 4K, vivid color and fine grain (video A at The Digital Bits and 4.5/5 at Blu-ray.com)." },
              src: ["kk_db4k", "kk_br4ks", "kk_avn"]
            },
            audio: {
              v: 3,
              why: { pt: "O 5.1 fica concentrado na frente e irregular, e as análises divergem (C na The Digital Bits, 4/5 no Blu-ray.com). Inclui faixa 2.0.", en: "The 5.1 is front-heavy and uneven, and reviews disagree (C at The Digital Bits, 4/5 at Blu-ray.com). A 2.0 track is included." },
              src: ["kk_db4k", "kk_br4ks", "kk_mc4k"]
            },
            extras: {
              v: 4,
              why: { pt: "Repete quase tudo das edições anteriores, mas sem parte do material exclusivo da Arrow.", en: "Repeats almost everything from earlier editions, but lacks some of Arrow's exclusive material." },
              src: ["kk_mc4k", "kk_dvdc"]
            }
          },
          reviews: [
            { src: "kk_br4ks", label: "Blu-ray.com", date: "2024-05-18", scale: 5, video: 4.5, audio: 4, extras: 5 },
            { src: "kk_db4k", label: "The Digital Bits", date: "2024-05-30", video: "A", audio: "C", extras: "B+" },
            { src: "kk_avn", label: "AV Nirvana", scale: 5, video: 4.5 }
          ],
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
      releases: [
        {
          date: "1986-05-27",
          country: "US",
          format: "vhs",
          label: "Walt Disney Home Video",
          name: { pt: "Linha Walt Disney Classics", en: "Walt Disney Classics line" },
          version: "al-vhs",
          src: ["al_vhs"]
        },
        {
          date: "2004",
          country: "US",
          format: "dvd",
          label: "Walt Disney Home Entertainment",
          name: { pt: "Masterpiece Edition, 2 discos", en: "Masterpiece Edition, 2 discs" },
          version: "al-dvds",
          src: ["al_dvdv"]
        },
        {
          date: "2010",
          country: "US",
          format: "dvd",
          label: "Walt Disney Studios",
          name: { pt: "Special Un-Anniversary Edition, 2 discos", en: "Special Un-Anniversary Edition, 2 discs" },
          version: "al-dvds",
          src: ["al_dvdv"]
        },
        {
          date: "2011-02-01",
          country: "US",
          format: "bd",
          label: "Walt Disney Studios",
          name: { pt: "Edição de 60º aniversário", en: "60th Anniversary Edition" },
          version: "al-bd-2011",
          src: ["al_db"]
        },
        {
          date: "2026-05-05",
          country: "US",
          format: "4k",
          label: "Walt Disney Studios",
          name: { pt: "Edição de 75º aniversário, 4K UHD + Blu-ray", en: "75th Anniversary Edition, 4K UHD + Blu-ray" },
          version: "al-uhd-2026",
          src: ["al_pr"]
        }
      ],
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
          scores: {
            fidelity: {
              v: 3,
              why: { pt: "Master antigo em definição padrão; vale sobretudo pela dublagem clássica de 1951.", en: "An older standard-definition master; it is valued mostly for the classic 1951 dub." },
              src: ["al_vhs"]
            },
            picture: { v: 1, why: { pt: "Imagem limitada do VHS.", en: "Limited VHS picture." }, src: ["al_vhs"] }
          },
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
          scores: {
            fidelity: {
              v: 3,
              why: { pt: "Boas transferências para o formato, anteriores à restauração de 2011.", en: "Good transfers for the format, predating the 2011 restoration." },
              src: ["al_dvdv"]
            },
            picture: {
              v: 2,
              why: { pt: "Boas edições para o formato, superadas pelo Blu-ray.", en: "Good editions for the format, surpassed by the Blu-ray." },
              src: ["al_dvdv"]
            },
            extras: {
              v: 4,
              why: { pt: "A Masterpiece Edition (2004) trouxe disco duplo com extras, repetidos quase todos em 2010.", en: "The 2004 Masterpiece Edition brought a two-disc set of extras, almost all repeated in 2010." },
              src: ["al_dvdv"]
            }
          },
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
          scores: {
            fidelity: {
              v: 4,
              why: { pt: "Restauração completa e cores vivas, com a mixagem mono original incluída.", en: "A full restoration with vivid colors, including the original mono mix." },
              src: ["al_sv", "al_db"]
            },
            picture: {
              v: 4,
              why: { pt: "Nota máxima de imagem em várias análises (10/10 na Sound & Vision); hoje superada pelo 4K.", en: "Top picture marks in several reviews (10/10 at Sound & Vision); now surpassed by the 4K." },
              src: ["al_sv", "al_tt"]
            },
            audio: {
              v: 4,
              why: { pt: "Mono original em Dolby Digital 2.0 e um 5.1 novo.", en: "The original mono in Dolby Digital 2.0 and a new 5.1." },
              src: ["al_db"]
            },
            extras: {
              v: 4,
              why: { pt: "Muitos extras, incluindo a canção inédita do gato (“I'm Odd”).", en: "Plenty of extras, including the Cat's unreleased song (“I'm Odd”)." },
              src: ["al_db", "al_htf"]
            }
          },
          reviews: [{ src: "al_sv", label: "Sound & Vision", scale: 10, video: 10 }],
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
          scores: {
            fidelity: {
              v: 5,
              why: { pt: "Nova restauração dos negativos de nitrato pela Walt Disney Film Restoration, chamada de lançamento de referência por Robert A. Harris.", en: "A new restoration from the nitrate negatives by Walt Disney Film Restoration, called a reference release by Robert A. Harris." },
              src: ["al_rah", "al_pr"]
            },
            picture: {
              v: 5,
              why: { pt: "Mais definição do que qualquer edição anterior; o HDR realça as cores, sobretudo os vermelhos.", en: "More detail than any previous edition; the HDR boosts the colors, especially the reds." },
              src: ["al_htf", "al_rah"]
            },
            audio: {
              v: 4,
              why: { pt: "DTS-HD MA 5.1 e o mono original.", en: "DTS-HD MA 5.1 and the original mono." },
              src: ["al_pr"]
            },
            extras: {
              v: 3,
              why: { pt: "Os extras ficam todos no Blu-ray de 2011 incluso.", en: "All extras are on the included 2011 Blu-ray." },
              src: ["al_htf"]
            }
          },
          reviews: [
            { src: "al_htf", label: "Home Theater Forum", scale: 5, overall: 4.5 },
            { src: "al_rah", label: "Robert A. Harris", text: { pt: "“reference quality”", en: "“reference quality”" } }
          ],
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
    kk_brt: { t: "Blu-ray.com — Killer Klowns from Outer Space (página do filme e edições)", u: "https://www.blu-ray.com/Killer-Klowns-from-Outer-Space/132093/" },
    kk_brdvd: { t: "Blu-ray.com — Killer Klowns DVD (MGM, 2001)", u: "https://www.blu-ray.com/dvd/Killer-Klowns-from-Outer-Space-DVD/1254/" },
    kk_br12: { t: "Blu-ray.com — Killer Klowns Blu-ray (MGM, 2012), ficha e análise", u: "https://www.blu-ray.com/movies/Killer-Klowns-from-Outer-Space-Blu-ray/50301/" },
    kk_br14p: { t: "Blu-ray.com — Killer Klowns Blu-ray + DVD (Arrow, Reino Unido, 2014)", u: "https://www.blu-ray.com/movies/Killer-Klowns-from-Outer-Space-Blu-ray/104491/" },
    kk_br18: { t: "Blu-ray.com — Killer Klowns Blu-ray Remastered (Arrow, EUA, 2018), ficha e análise", u: "https://www.blu-ray.com/movies/Killer-Klowns-from-Outer-Space-Blu-ray/195586/" },
    kk_br4k: { t: "Blu-ray.com — Killer Klowns 4K, 35th Anniversary Edition (Scream Factory, 2024)", u: "https://www.blu-ray.com/movies/Killer-Klowns-from-Outer-Space-4K-Blu-ray/356845/" },
    kk_br4ks: { t: "Blu-ray.com — Killer Klowns 4K SteelBook (Scream Factory, 2024), ficha e análise", u: "https://www.blu-ray.com/movies/Killer-Klowns-from-Outer-Space-4K-Blu-ray/356858/" },
    kk_dvdc: { t: "DVDCompare — Killer Klowns From Outer Space (Blu-ray), comparação de edições", u: "https://www.dvdcompare.net/comparisons/film.php?fid=20970" },
    kk_db4k: { t: "The Digital Bits — Killer Klowns: 35th Anniversary Edition (4K UHD, 2024)", u: "https://digitalbits.com/item/killer-klowns-35th-scream-2024-uhd" },
    kk_ad19: { t: "areaDVD — Killer Klowns: Mediabook da Koch Media com remaster 4K (2019)", u: "https://www.areadvd.de/news/killer-klowns-mit-4k-remaster-auf-blu-ray-disc/" },
    kk_ad22: { t: "areaDVD — Killer Klowns: novo Mediabook da Plaion Pictures (2022)", u: "https://www.areadvd.de/news/killer-klowns-from-outer-space-erscheint-mit-4k-remaster-als-exklusives-blu-ray-disc-mediabook/" },
    kk_hmv24: { t: "HMV — Killer Klowns from Outer Space Blu-ray (Final Cut, 2024)", u: "https://hmv.com/store/film-tv/blu-ray/killer-klowns-from-outer-space-(2)" },
    kk_ff18: { t: "Fetch — Arrow Video: Killer Klowns no Reino Unido (9/4/2018)", u: "https://fetch.fm/arrow-video/arrow-video-killer-klowns-from-outer-space/" },
    kk_hcf14: { t: "Horror Cult Films — Arrow lança Killer Klowns em DVD, Blu-ray e steelbook (2014)", u: "https://horrorcultfilms.co.uk/?p=98936" },
    kk_om25: { t: "Omelete — Palhaços Assassinos do Espaço Sideral no Prime Video (2025)", u: "https://www.omelete.com.br/filmes/palhacos-assassinos-do-espaco-sideral-pode-ter-remake-com-ryan-gosling" },
    kk_mc12: { t: "Mighty Chroma — Killer Klowns Blu-ray (MGM, 2012), resumo de análises", u: "https://mightychroma.me/review/7e5ffc32-601b-5573-b61a-cf199dc5ef85" },
    kk_mc18: { t: "Mighty Chroma — Killer Klowns Blu-ray (Arrow, 2018), resumo de análises", u: "https://mightychroma.me/review/ab499c55-f69f-527a-9fa0-5d11c235ab6d" },
    kk_tb12: { t: "TheaterByte — Killer Klowns Blu-ray (MGM, 2012)", u: "https://theaterbyte.com/killer-klowns-from-outer-space-blu-ray-review" },

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
