import { ChartDataPoint, Transaction } from "./types";

export const CATEGORIES = [
  "Moradia",
  "Alimentação",
  "Transporte",
  "Saúde",
  "Lazer",
  "Educação",
  "Serviços",
  "Salário",
  "Freelance",
  "Investimentos",
  "Outros",
];

export const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1'];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: "1",
    description: "Salário Mensal",
    amount: 5000,
    type: "income",
    category: "Salário",
    date: new Date().toISOString(),
    isFixed: true
  },
  {
    id: "2",
    description: "Aluguel",
    amount: 1800,
    type: "expense",
    category: "Moradia",
    date: new Date().toISOString(),
    isFixed: true
  },
  {
    id: "3",
    description: "Supermercado Semanal",
    amount: 450,
    type: "expense",
    category: "Alimentação",
    date: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
    isFixed: false
  },
  {
    id: "4",
    description: "Uber/Transporte",
    amount: 45.90,
    type: "expense",
    category: "Transporte",
    date: new Date(Date.now() - 86400000 * 5).toISOString(),
    isFixed: false
  },
  {
    id: "5",
    description: "Internet Fibra",
    amount: 120,
    type: "expense",
    category: "Serviços",
    date: new Date(Date.now() - 86400000 * 10).toISOString(),
    isFixed: true
  },
  {
    id: "6",
    description: "Jantar Fora",
    amount: 180,
    type: "expense",
    category: "Lazer",
    date: new Date(Date.now() - 86400000 * 1).toISOString(),
    isFixed: false
  }
];