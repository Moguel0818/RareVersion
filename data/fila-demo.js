/*
 * Itens de exemplo para a fila de moderação (só aparecem no modo demonstração,
 * quando o site não está ligado ao Apps Script). Os dados são reais e têm fonte,
 * mas a "chegada" deles na fila é simulada para você testar aprovar/rejeitar.
 */
window.AMR_DEMO_QUEUE = [
  {
    id: "demo-4k80",
    tipo: "version_new_film",
    status: "pending",
    demo: true,
    criado_em: "2026-10-30T14:12:00Z",
    origem: "radar",
    titulo: "The Empire Strikes Back (1980) — Project 4K80",
    fonte_url: "https://en.wikipedia.org/wiki/Harmy%27s_Despecialized_Edition",
    dados: {
      film: {
        id: "empire-strikes-back-1980",
        tmdb: 1891,
        year: 1980,
        original_title: "The Empire Strikes Back",
        title: { pt: "Star Wars: Episódio V – O Império Contra-Ataca", en: "The Empire Strikes Back" },
        director: "Irvin Kershner",
        accent: "#a9bcd0",
        accent2: "#c9a24a",
        overview: {
          pt: "Depois da destruição da Estrela da Morte, os rebeldes fogem do Império, Luke vai treinar com o mestre Yoda e Han e Leia caem numa armadilha de Darth Vader.",
          en: "After the Death Star's destruction, the rebels flee the Empire, Luke trains with Master Yoda, and Han and Leia fall into Darth Vader's trap."
        }
      },
      version: {
        id: "esb-4k80",
        type: "fan_scan",
        name: { pt: "Project 4K80", en: "Project 4K80" },
        by: "Team Negative1",
        released: "2024-02",
        cut: "theatrical",
        source: { pt: "Cópias 35mm escaneadas em 4K; estavam desbotadas e exigiram mais limpeza", en: "35mm prints scanned in 4K; they were faded and needed extra cleanup" },
        res: "4K",
        formats: ["file"],
        summary: {
          pt: "Começou em 2020 e saiu em fevereiro de 2024, fechando a trilogia de scans 4K da Team Negative1 (depois de 4K77 e 4K83).",
          en: "Started in 2020 and released in February 2024, completing Team Negative1's 4K scan trilogy (after 4K77 and 4K83)."
        },
        reception: { level: "sem_dados" },
        availability: "unofficial",
        src_urls: ["https://en.wikipedia.org/wiki/Harmy%27s_Despecialized_Edition"]
      }
    }
  },
  {
    id: "demo-4k83",
    tipo: "version_new_film",
    status: "pending",
    demo: true,
    criado_em: "2026-10-28T09:40:00Z",
    origem: "radar",
    titulo: "Return of the Jedi (1983) — Project 4K83 v2.0",
    fonte_url: "https://en.wikipedia.org/wiki/Harmy%27s_Despecialized_Edition",
    dados: {
      film: {
        id: "return-of-the-jedi-1983",
        tmdb: 1892,
        year: 1983,
        original_title: "Return of the Jedi",
        title: { pt: "Star Wars: Episódio VI – O Retorno de Jedi", en: "Return of the Jedi" },
        director: "Richard Marquand",
        accent: "#7fa36b",
        accent2: "#c94d3a",
        overview: {
          pt: "Luke, Leia e Han se juntam aos rebeldes para resgatar amigos e enfrentar a nova Estrela da Morte, enquanto Luke encara Darth Vader e o Imperador.",
          en: "Luke, Leia and Han join the rebels to rescue friends and face the new Death Star, while Luke confronts Darth Vader and the Emperor."
        }
      },
      version: {
        id: "rotj-4k83",
        type: "fan_scan",
        name: { pt: "Project 4K83 (v2.0)", en: "Project 4K83 (v2.0)" },
        by: "Team Negative1",
        released: "2023",
        cut: "theatrical",
        source: { pt: "Cópias 35mm escaneadas em 4K", en: "35mm prints scanned in 4K" },
        res: "4K",
        formats: ["file"],
        summary: {
          pt: "A primeira versão saiu em outubro de 2018; a 2.0, de 2023, trouxe cores corrigidas.",
          en: "The first version came out in October 2018; v2.0, from 2023, brought corrected colors."
        },
        reception: { level: "sem_dados" },
        availability: "unofficial",
        src_urls: ["https://en.wikipedia.org/wiki/Harmy%27s_Despecialized_Edition"]
      }
    }
  },
  {
    id: "demo-kk-dub",
    tipo: "correction",
    status: "pending",
    demo: true,
    criado_em: "2026-10-26T21:05:00Z",
    origem: "site",
    film_id: "killer-klowns-1988",
    titulo: "Palhaços Assassinos do Espaço Sideral — dublagem brasileira",
    fonte_url: "",
    contato: "exemplo",
    dados: {
      film_id: "killer-klowns-1988",
      texto: {
        pt: "Exemplo de sugestão sem fonte: pede para cadastrar a dublagem brasileira do VHS. Verifique antes de aprovar.",
        en: "Example suggestion without a source: asks to add the Brazilian VHS dub. Verify before approving."
      }
    }
  }
];
