// Tipos do MegaLinksPro

export type Category = 
  | "Adulto (+18)"
  | "Notícias"
  | "Investimentos"
  | "Esportes"
  | "Promoções & Cupons"
  | "Cursos & Estudos"
  | "Tecnologia"
  | "Criptomoedas"
  | "Conversas & Amizades"
  | "Games"
  | "Vendas"
  | "Saúde & Fitness"
  | "Humor"
  | "Bots & Ferramentas"
  | "Outros";

export type GroupStatus = "ativo" | "expirado";

export type PlanType = "basico" | "destaque" | "premium";

export interface Group {
  id: string;
  nome: string;
  categoria: Category;
  descricao: string;
  linkTelegram: string;
  emailDono: string;
  dataCriacao: string;
  dataExpiracao: string;
  status: GroupStatus;
  plano?: PlanType;
  visualizacoes?: number;
}

export interface Plan {
  id: PlanType;
  nome: string;
  preco: number;
  dias: number;
  beneficios: string[];
  destaque?: boolean;
}

export const CATEGORIES: Category[] = [
  "Adulto (+18)",
  "Notícias",
  "Investimentos",
  "Esportes",
  "Promoções & Cupons",
  "Cursos & Estudos",
  "Tecnologia",
  "Criptomoedas",
  "Conversas & Amizades",
  "Games",
  "Vendas",
  "Saúde & Fitness",
  "Humor",
  "Bots & Ferramentas",
  "Outros"
];

export const PLANS: Plan[] = [
  {
    id: "basico",
    nome: "Plano Básico",
    preco: 9.90,
    dias: 30,
    beneficios: [
      "Anúncio ativo por 30 dias",
      "Aparece na lista geral",
      "Suporte por email"
    ]
  },
  {
    id: "destaque",
    nome: "Plano Destaque",
    preco: 29.90,
    dias: 30,
    beneficios: [
      "Anúncio ativo por 30 dias",
      "Topo da categoria",
      "Badge de destaque",
      "Suporte prioritário"
    ],
    destaque: true
  },
  {
    id: "premium",
    nome: "Plano Premium",
    preco: 49.90,
    dias: 30,
    beneficios: [
      "Anúncio ativo por 30 dias",
      "Primeira posição do site",
      "Badge premium",
      "Destaque visual",
      "Suporte VIP"
    ]
  }
];
