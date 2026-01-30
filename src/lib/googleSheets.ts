import { google } from 'googleapis';
import path from 'path';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

async function getAuthClient() {
  const credentialsPath = path.join(process.cwd(), 'google-credentials.json');
  
  const auth = new google.auth.GoogleAuth({
    keyFile: credentialsPath,
    scopes: SCOPES,
  });
  
  return auth;
}

export async function appendToSheet(
  spreadsheetId: string,
  range: string,
  values: (string | number)[][]
) {
  const auth = await getAuthClient();
  const sheets = google.sheets({ version: 'v4', auth });

  const response = await sheets.spreadsheets.values.append({
    spreadsheetId,
    range,
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values,
    },
  });

  return response.data;
}

export async function getSheetData(spreadsheetId: string, range: string) {
  const auth = await getAuthClient();
  const sheets = google.sheets({ version: 'v4', auth });

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  });

  return response.data.values || [];
}

export async function updateSheet(
  spreadsheetId: string,
  range: string,
  values: (string | number)[][]
) {
  const auth = await getAuthClient();
  const sheets = google.sheets({ version: 'v4', auth });

  const response = await sheets.spreadsheets.values.update({
    spreadsheetId,
    range,
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values,
    },
  });

  return response.data;
}

export function formatRegistroForSheet(registro: {
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
  observacoes: string | null;
  status: string;
  totalApontamentos: number;
}): (string | number)[] {
  return [
    registro.id,
    new Date(registro.data).toLocaleDateString('pt-BR'),
    registro.prospector,
    registro.polo,
    registro.prefixo,
    registro.trafo,
    registro.visitas,
    registro.cod100,
    registro.cod200,
    registro.cod300,
    registro.clandestino,
    registro.inclusao,
    registro.exclusao,
    registro.ip,
    registro.totalApontamentos,
    registro.observacoes || '',
    registro.status,
  ];
}

export const SHEET_HEADERS = [
  'ID',
  'Data',
  'Prospector',
  'Polo',
  'Prefixo',
  'Trafo',
  'Visitas',
  'Cod 100',
  'Cod 200',
  'Cod 300',
  'Clandestino',
  'Inclusão',
  'Exclusão',
  'IP',
  'Total Apontamentos',
  'Observações',
  'Status',
];
