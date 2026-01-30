import { NextResponse } from 'next/server';
import { updateSheet, SHEET_HEADERS } from '@/lib/googleSheets';

export async function POST() {
  try {
    const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;
    
    if (!spreadsheetId) {
      return NextResponse.json(
        { error: 'GOOGLE_SPREADSHEET_ID não configurado no .env' },
        { status: 400 }
      );
    }

    // Adiciona os headers na primeira linha
    await updateSheet(spreadsheetId, 'Registros!A1:Q1', [SHEET_HEADERS]);

    return NextResponse.json({ 
      success: true, 
      message: 'Planilha inicializada com sucesso!',
      headers: SHEET_HEADERS 
    });
  } catch (error) {
    console.error('Erro ao inicializar planilha:', error);
    return NextResponse.json(
      { error: 'Erro ao inicializar planilha. Verifique se o email da service account tem acesso à planilha.' },
      { status: 500 }
    );
  }
}
