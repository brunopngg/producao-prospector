export const POLOS = {
  PARAUAPEBAS: {
    nome: 'Parauapebas',
    prefixos: ['PAP801', 'PAP802', 'PAP803'],
  },
  MARABA: {
    nome: 'Marabá',
    prefixos: ['MAB803', 'MAB804', 'MAB805', 'MAB806', 'MAB807'],
  },
  REDENCAO: {
    nome: 'Redenção',
    prefixos: ['RED801'],
  },
  TUCURUI: {
    nome: 'Tucuruí',
    prefixos: ['TUC801', 'TUC802'],
  },
} as const;

export type PoloId = keyof typeof POLOS;

export const META_VISITAS = 80;

export const STATUS_OPTIONS = [
  { value: 'em_andamento', label: 'Em Andamento' },
  { value: 'executado', label: 'Executado' },
] as const;

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('pt-BR');
}

export function formatDateTime(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleString('pt-BR');
}
