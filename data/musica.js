/*
 * RareVersion — catálogo de músicas: versões raras (demos, ao vivo, sessões) e músicas inéditas.
 * Formato dos campos: veja a seção "Músicas" do README.
 * Para ouvir, o site usa o player oficial do Internet Archive. Nunca coloque links diretos para baixar arquivos.
 */
window.AMR_MUSIC = {
  schema: 1,
  updated: "2026-11-04",
  artists: [
    {
      id: "til-tuesday",
      name: "'Til Tuesday",
      sort: "Til Tuesday",
      mbid: "",
      origin: { pt: "Boston, Massachusetts, EUA", en: "Boston, Massachusetts, USA" },
      years: "1982–1989",
      accent: "#e0607e",
      accent2: "#6c8fd6",
      members: [
        { name: "Aimee Mann", role: { pt: "voz e baixo", en: "vocals and bass" } },
        { name: "Robert Holmes", role: { pt: "guitarra e voz", en: "guitar and vocals" } },
        { name: "Joey Pesce", role: { pt: "teclados", en: "keyboards" } },
        { name: "Michael Hausman", role: { pt: "bateria", en: "drums" } }
      ],
      intro: { pt: "Banda new wave de Boston, ativa de 1982 a 1989. Ganhou o Rock 'n' Roll Rumble da rádio WBCN em 1983, assinou com a Epic em 1984 e estourou em 1985 com “Voices Carry”. Antes do primeiro disco, já tocava ao vivo músicas que nunca chegaram aos álbuns. Em maio de 2025, voltou a se apresentar no Cruel World Festival, em Pasadena.", en: "A new wave band from Boston, active from 1982 to 1989. It won radio station WBCN's Rock 'n' Roll Rumble in 1983, signed with Epic in 1984 and broke through in 1985 with “Voices Carry”. Before the first album, it was already playing songs live that never made it onto the records. In May 2025, it played again at the Cruel World Festival in Pasadena." },
      intro_src: ["tt_wiki", "tt_wliv", "tt_sfm25"],
      links: {
        wikipedia: "https://en.wikipedia.org/wiki/%27Til_Tuesday",
        archive: "https://archive.org/search?query=%22Til+Tuesday%22",
        musicbrainz: "https://musicbrainz.org/search?query=%27Til+Tuesday&type=artist",
        concerts: "https://www.concertarchives.org/bands/til-tuesday--1084059"
      },
      wanted: { pt: "Procura-se: a faixa 3 do show de 1984 (sem título), outras gravações de 1983 a 1985 e a demo de “Love in a Vacuum” em boa qualidade.", en: "Wanted: track 3 of the 1984 show (untitled), other recordings from 1983 to 1985 and the “Love in a Vacuum” demo in good quality." },
      sessions: [
        {
          id: "tt-1984-03-01-spit",
          kind: "live",
          date: "1984-03-01",
          title: { pt: "Ao vivo no Spit, Boston", en: "Live at Spit, Boston" },
          venue: "Spit",
          city: "Boston, MA",
          country: "US",
          source_type: "fm",
          quality: 3,
          quality_note: { pt: "Boa gravação de rádio, com a voz baixa nas duas primeiras músicas.", en: "A good radio recording, with low vocals in the first two songs." },
          lineage: { pt: "Transmissão da rádio WFNX 101.7 FM gravada em fita Maxell XLII, passada por um deck Tascam 112 para WAV no SoundForge e convertida para FLAC. As três últimas músicas vieram de uma reprise da transmissão.", en: "WFNX 101.7 FM broadcast recorded to a Maxell XLII cassette, played through a Tascam 112 deck into WAV in SoundForge and converted to FLAC. The last three songs come from a rebroadcast." },
          notes: { pt: "Show de março de 1984, um ano antes do primeiro disco, com sete músicas que não entraram nos álbuns. A mixagem melhora a partir de “Winning the War”. Quem enviou pede que a gravação não seja vendida.", en: "A March 1984 show, a year before the first album, with seven songs that never made the albums. The mix improves from “Winning the War” on. The uploader asks that the recording not be sold." },
          archive: {
            id: "03_20210111_20210111_2229",
            runtime: "62:45",
            uploader: "dharmanovel",
            added: "2021-01-11",
            collection: "Recordings of Independent Origin"
          },
          tracks: [
            {
              n: 1,
              title: { pt: "Apresentação do locutor", en: "Radio announcer introduction" },
              length: "0:21",
              file: "01.flac"
            },
            {
              n: 2,
              song: "maybe-monday",
              length: "3:19",
              file: "02.flac",
              note: { pt: "voz baixa na mixagem", en: "vocals low in the mix" }
            },
            {
              n: 3,
              title: { pt: "Sem título na página do Internet Archive", en: "Untitled on the Internet Archive page" },
              length: "7:28",
              file: "03.flac",
              note: { pt: "procura-se: qual música é esta?", en: "wanted: which song is this?" }
            },
            {
              n: 4,
              song: "winning-the-war",
              length: "3:45",
              file: "04.flac",
              note: { pt: "a mixagem melhora a partir daqui", en: "the mix improves from here" }
            },
            {
              n: 5,
              song: "im-gonna-do-my-best",
              length: "3:16",
              file: "05.flac",
              note: { pt: "apresentada como música nova, escrita na véspera", en: "introduced as a brand-new song, written the day before" }
            },
            { n: 6, song: "dont-watch-me-bleed", length: "4:01", file: "06.flac" },
            { n: 7, song: "you-know-the-rest", length: "3:48", file: "07.flac" },
            { n: 8, song: "are-you-serious", length: "3:25", file: "08.flac" },
            { n: 9, song: "just-three-words", length: "3:25", file: "09.flac" },
            { n: 10, song: "tension", length: "4:31", file: "10.flac" },
            {
              n: 11,
              song: "voices-carry",
              length: "4:33",
              file: "11.flac",
              note: { pt: "um ano antes da versão de estúdio: vale comparar a letra", en: "a year before the studio version: worth comparing the lyrics" }
            },
            { n: 12, song: "love-in-a-vacuum", length: "3:58", file: "12.flac" },
            { n: 13, song: "no-more-crying", length: "4:20", file: "13.flac" },
            {
              n: 14,
              song: "you-just-cant-give-it-up",
              length: "3:11",
              file: "14.flac",
              note: { pt: "da reprise da transmissão", en: "from the rebroadcast" }
            },
            {
              n: 15,
              song: "i-could-get-used-to-this",
              length: "3:24",
              file: "15.flac",
              note: { pt: "da reprise da transmissão", en: "from the rebroadcast" }
            },
            { n: 16, title: { pt: "Pausa antes do bis", en: "Encore break" }, length: "1:04", file: "16.flac" },
            {
              n: 17,
              song: "love-or-money",
              length: "4:55",
              file: "17.flac",
              note: { pt: "bis, com o encerramento do locutor; da reprise da transmissão", en: "encore, with the announcer's wrap-up; from the rebroadcast" }
            }
          ],
          src: ["tt_ia84"]
        }
      ],
      songs: [
        {
          id: "voices-carry",
          title: "Voices Carry",
          status: "released",
          year: 1985,
          first: { pt: "Single e álbum Voices Carry (1985)", en: "Voices Carry single and album (1985)" },
          note: { pt: "O maior sucesso da banda. Segundo a Wikipédia, a Epic achou a letra original muito comercial, mas pediu para tirar dela os elementos lésbicos antes do lançamento.", en: "The band's biggest hit. According to Wikipedia, Epic found the original lyric very commercial but asked for its lesbian elements to be removed before release." },
          versions: [
            {
              id: "vc-single-1985",
              type: "studio",
              date: "1985-03-28",
              title: { pt: "Single (Epic)", en: "Single (Epic)" },
              length: "4:20",
              by: { pt: "Produção: Mike Thorne", en: "Produced by Mike Thorne" },
              availability: "official",
              summary: { pt: "Versão de estúdio gravada no R.P.M. Sound, em Nova York, e lançada em single em 28/03/1985, com “Are You Serious?” no lado B.", en: "Studio version recorded at R.P.M. Sound in New York and released as a single on March 28, 1985, with “Are You Serious?” on the B-side." },
              src: ["tt_wvc"]
            }
          ],
          src: ["tt_wvc"]
        },
        {
          id: "love-in-a-vacuum",
          title: "Love in a Vacuum",
          status: "released",
          year: 1985,
          first: { pt: "Single e álbum Voices Carry (1985)", en: "Voices Carry single and album (1985)" },
          note: { pt: "Gravada pela primeira vez em 1983, antes do contrato com a Epic, numa demo que tocou muito na rádio WBCN.", en: "First recorded in 1983, before the Epic deal, on a demo that got heavy play on WBCN radio." },
          versions: [
            {
              id: "liv-demo-1983",
              type: "demo",
              date: "1983",
              title: { pt: "Demo de 1983", en: "1983 demo" },
              by: { pt: "Produção: Ian Taylor", en: "Produced by Ian Taylor" },
              source_type: "studio",
              availability: "official",
              summary: { pt: "Demo produzida por Ian Taylor logo depois da vitória no Rock 'n' Roll Rumble da WBCN. Saiu de forma independente em 1983 e ajudou a chamar a atenção da Epic. Na AllMusic, Joe Viglione preferiu esta versão à do disco, que achou produzida demais.", en: "A demo produced by Ian Taylor right after the WBCN Rock 'n' Roll Rumble win. It was released independently in 1983 and helped draw Epic's attention. At AllMusic, Joe Viglione preferred it to the album version, which he found over-produced." },
              src: ["tt_wliv"]
            },
            {
              id: "liv-album-1985",
              type: "studio",
              date: "1985-04-20",
              title: { pt: "Álbum Voices Carry (1985)", en: "Voices Carry album (1985)" },
              length: "3:34",
              availability: "official",
              summary: { pt: "Versão do álbum, produzida por Mike Thorne; o single tem uma edição de 3:20.", en: "The album version, produced by Mike Thorne; the single has a 3:20 edit." },
              src: ["tt_wliv", "tt_wvca"]
            }
          ],
          src: ["tt_wliv"]
        },
        {
          id: "maybe-monday",
          title: "Maybe Monday",
          status: "released",
          year: 1985,
          first: { pt: "Álbum Voices Carry (1985)", en: "Voices Carry album (1985)" },
          versions: [
            {
              id: "mm-album-1985",
              type: "studio",
              date: "1985-04-20",
              title: { pt: "Álbum Voices Carry (1985)", en: "Voices Carry album (1985)" },
              length: "3:40",
              availability: "official",
              src: ["tt_wvca"]
            }
          ]
        },
        {
          id: "winning-the-war",
          title: "Winning the War",
          status: "released",
          year: 1985,
          first: { pt: "Álbum Voices Carry (1985)", en: "Voices Carry album (1985)" },
          versions: [
            {
              id: "wtw-album-1985",
              type: "studio",
              date: "1985-04-20",
              title: { pt: "Álbum Voices Carry (1985)", en: "Voices Carry album (1985)" },
              length: "4:03",
              availability: "official",
              src: ["tt_wvca"]
            }
          ]
        },
        {
          id: "dont-watch-me-bleed",
          title: "Don't Watch Me Bleed",
          status: "released",
          year: 1985,
          first: { pt: "Álbum Voices Carry (1985)", en: "Voices Carry album (1985)" },
          note: { pt: "Também saiu no lado B do single “Looking Over My Shoulder” (1985).", en: "Also released as the B-side of the “Looking Over My Shoulder” single (1985)." },
          versions: [
            {
              id: "dwmb-album-1985",
              type: "studio",
              date: "1985-04-20",
              title: { pt: "Álbum Voices Carry (1985)", en: "Voices Carry album (1985)" },
              length: "3:26",
              availability: "official",
              src: ["tt_wvca", "tt_wlos"]
            }
          ],
          src: ["tt_wlos"]
        },
        {
          id: "you-know-the-rest",
          title: "You Know the Rest",
          status: "released",
          year: 1985,
          first: { pt: "Álbum Voices Carry (1985)", en: "Voices Carry album (1985)" },
          versions: [
            {
              id: "ykr-album-1985",
              type: "studio",
              date: "1985-04-20",
              title: { pt: "Álbum Voices Carry (1985)", en: "Voices Carry album (1985)" },
              length: "4:26",
              availability: "official",
              src: ["tt_wvca"]
            }
          ]
        },
        {
          id: "are-you-serious",
          title: "Are You Serious?",
          status: "released",
          year: 1985,
          first: { pt: "Álbum Voices Carry (1985)", en: "Voices Carry album (1985)" },
          note: { pt: "Também é o lado B do single “Voices Carry”.", en: "It is also the B-side of the “Voices Carry” single." },
          versions: [
            {
              id: "ays-album-1985",
              type: "studio",
              date: "1985-04-20",
              title: { pt: "Álbum Voices Carry (1985)", en: "Voices Carry album (1985)" },
              length: "3:15",
              availability: "official",
              src: ["tt_wvca", "tt_wvc"]
            }
          ],
          src: ["tt_wvc"]
        },
        {
          id: "no-more-crying",
          title: "No More Crying",
          status: "released",
          year: 1985,
          first: { pt: "Álbum Voices Carry (1985)", en: "Voices Carry album (1985)" },
          note: { pt: "Também saiu no lado B do single “Love in a Vacuum”.", en: "Also released as the B-side of the “Love in a Vacuum” single." },
          versions: [
            {
              id: "nmc-album-1985",
              type: "studio",
              date: "1985-04-20",
              title: { pt: "Álbum Voices Carry (1985)", en: "Voices Carry album (1985)" },
              length: "4:18",
              availability: "official",
              src: ["tt_wvca", "tt_wliv"]
            }
          ],
          src: ["tt_wliv"]
        },
        {
          id: "i-could-get-used-to-this",
          title: "I Could Get Used to This",
          status: "released",
          year: 1985,
          first: { pt: "Álbum Voices Carry (1985)", en: "Voices Carry album (1985)" },
          versions: [
            {
              id: "icgu-album-1985",
              type: "studio",
              date: "1985-04-20",
              title: { pt: "Álbum Voices Carry (1985)", en: "Voices Carry album (1985)" },
              length: "3:02",
              availability: "official",
              src: ["tt_wvca"]
            }
          ]
        },
        {
          id: "just-three-words",
          title: "Just Three Words",
          status: "unreleased",
          note: { pt: "Não aparece nos três álbuns de estúdio nem na coletânea de 1996. Até onde pesquisamos, só existe em gravações ao vivo.", en: "It is not on the three studio albums or the 1996 compilation. As far as we could find, it only exists in live recordings." },
          versions: [],
          src: ["tt_wvca", "tt_wcuc", "tt_ia84"]
        },
        {
          id: "tension",
          title: "Tension",
          status: "unreleased",
          note: { pt: "Não aparece nos três álbuns de estúdio nem na coletânea de 1996. Até onde pesquisamos, só existe em gravações ao vivo.", en: "It is not on the three studio albums or the 1996 compilation. As far as we could find, it only exists in live recordings." },
          versions: [],
          src: ["tt_wvca", "tt_wcuc", "tt_ia84"]
        },
        {
          id: "you-just-cant-give-it-up",
          title: "You Just Can't Give It Up",
          status: "unreleased",
          note: { pt: "Não aparece nos três álbuns de estúdio nem na coletânea de 1996. Até onde pesquisamos, só existe em gravações ao vivo.", en: "It is not on the three studio albums or the 1996 compilation. As far as we could find, it only exists in live recordings." },
          versions: [],
          src: ["tt_wvca", "tt_wcuc", "tt_ia84"]
        },
        {
          id: "im-gonna-do-my-best",
          title: "I'm Gonna Do My Best",
          status: "unreleased",
          note: { pt: "Apresentada no show de 1º de março de 1984 como música nova, escrita na véspera. Não aparece nos três álbuns de estúdio nem na coletânea de 1996. Até onde pesquisamos, só existe em gravações ao vivo.", en: "Introduced at the March 1, 1984 show as a brand-new song, written the day before. It is not on the three studio albums or the 1996 compilation. As far as we could find, it only exists in live recordings." },
          versions: [],
          src: ["tt_ia84", "tt_wvca", "tt_wcuc"]
        },
        {
          id: "love-or-money",
          title: "Love or Money",
          status: "unreleased",
          note: { pt: "Não aparece nos três álbuns de estúdio nem na coletânea de 1996. Até onde pesquisamos, só existe em gravações ao vivo.", en: "It is not on the three studio albums or the 1996 compilation. As far as we could find, it only exists in live recordings." },
          versions: [],
          src: ["tt_wvca", "tt_wcuc", "tt_ia84"]
        },
        {
          id: "do-it-again",
          title: "Do It Again",
          status: "released",
          year: 1996,
          first: { pt: "Coletânea Coming Up Close: A Retrospective (1996)", en: "Coming Up Close: A Retrospective compilation (1996)" },
          note: { pt: "Ficou de fora dos discos da banda e só saiu em 1996, como a faixa inédita da coletânea.", en: "It was left off the band's albums and only came out in 1996, as the compilation's previously unreleased track." },
          versions: [
            {
              id: "dia-1996",
              type: "studio",
              date: "1996-09-24",
              title: { pt: "Faixa inédita da coletânea (Epic)", en: "The compilation's previously unreleased track (Epic)" },
              availability: "official",
              summary: { pt: "Lançada em 24/09/1996, junto com músicas dos três álbuns.", en: "Released on September 24, 1996, alongside songs from the three albums." },
              src: ["tt_wcuc"]
            }
          ],
          src: ["tt_wcuc"]
        }
      ]
    }
  ],
  sources: {
    tt_ia84: { t: "Internet Archive — ’Til Tuesday, 1984-03-01, Spit, Boston, MA (FM Master)", u: "https://archive.org/details/03_20210111_20210111_2229" },
    tt_wiki: { t: "Wikipedia — 'Til Tuesday", u: "https://en.wikipedia.org/wiki/%27Til_Tuesday" },
    tt_wvc: { t: "Wikipedia — Voices Carry (single)", u: "https://en.wikipedia.org/wiki/Voices_Carry" },
    tt_wvca: { t: "Wikipedia — Voices Carry (álbum, faixas e durações)", u: "https://en.wikipedia.org/wiki/Voices_Carry_(album)" },
    tt_wliv: { t: "Wikipedia — Love in a Vacuum (inclui a demo de 1983)", u: "https://en.wikipedia.org/wiki/Love_in_a_Vacuum" },
    tt_wlos: { t: "Wikipedia — Looking Over My Shoulder", u: "https://en.wikipedia.org/wiki/Looking_Over_My_Shoulder" },
    tt_wcuc: { t: "Wikipedia — Coming Up Close: A Retrospective", u: "https://en.wikipedia.org/wiki/Coming_Up_Close:_A_Retrospective" },
    tt_sfm25: { t: "setlist.fm — ’Til Tuesday volta a tocar junto (maio de 2025)", u: "https://www.setlist.fm/news/05-25/til-tuesday-reunites-for-first-time-in-35-years-13d6a1d9" },
    tt_ca: { t: "Concert Archives — histórico de shows do ’Til Tuesday", u: "https://www.concertarchives.org/bands/til-tuesday--1084059" }
  }
};
