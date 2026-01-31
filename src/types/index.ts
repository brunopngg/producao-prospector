export interface Registro {
  id: string;
  data: Date;
  prospector: string;
  polo: string;
  prefixo: string;
  trafo: string;
  visitas: number;
  cod100: number;
  cod200: number;
  cod300: number;
  clandestino: number;
  inclusao: number;
  exclusao: number;
  ip: number;
  observacoes?: string | null;
  status: string;
  totalApontamentos: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface RegistroInput {
  data?: Date;
  prospector: string;
  polo: string;
  prefixo: string;
  trafo: string;
  visitas: number;
  cod100: number;
  cod200: number;
  cod300: number;
  clandestino: number;
  inclusao: number;
  exclusao: number;
  ip: number;
  observacoes?: string;
  status: string;
}

export interface ProspectorStats {
  prospector: string;
  totalVisitas: number;
  totalApontamentos: number;
  cod100: number;
  cod200: number;
  cod300: number;
  clandestino: number;
  inclusao: number;
  exclusao: number;
  registros: number;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

export interface FilterState {
  dataInicio: string;
  dataFim: string;
  prospector: string;
  tipoApontamento: string;
}
