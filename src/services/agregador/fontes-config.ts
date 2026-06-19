export interface FonteRSS {
  id: string; // Ex: 'motorsport_brasil'
  nome: string; // Ex: 'Motorsport Brasil'
  url: string; // Ex: 'https://motorsport.uol.com.br/rss/all'
  categoriaDefault: string; // Ex: 'f1'
}

export const fontesConfig: FonteRSS[] = [
  {
    id: "motorsport_brasil",
    nome: "Motorsport Brasil",
    url: "https://motorsport.uol.com.br/rss/all",
    categoriaDefault: "corrida",
  },
  {
    id: "f1mania",
    nome: "F1Mania",
    url: "https://f1mania.com.br/feed",
    categoriaDefault: "f1",
  },
];
