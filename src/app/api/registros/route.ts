import { NextResponse } from 'next/server';
import { query, initDB } from '@/lib/db';
import { appendToSheet, formatRegistroForSheet } from '@/lib/googleSheets';

// Gera ID único
function generateId() {
  return `${Date.now().toString(36)}${Math.random().toString(36).substr(2, 9)}`;
}

export async function GET(request: Request) {
  try {
    await initDB();
    
    const { searchParams } = new URL(request.url);
    const dataInicio = searchParams.get('dataInicio');
    const dataFim = searchParams.get('dataFim');
    const prospector = searchParams.get('prospector');

    let sql = 'SELECT * FROM registros WHERE 1=1';
    const params: unknown[] = [];
    let paramIndex = 1;

    if (dataInicio) {
      sql += ` AND data >= $${paramIndex}`;
      params.push(new Date(dataInicio));
      paramIndex++;
    }

    if (dataFim) {
      const endDate = new Date(dataFim);
      endDate.setHours(23, 59, 59, 999);
      sql += ` AND data <= $${paramIndex}`;
      params.push(endDate);
      paramIndex++;
    }

    if (prospector) {
      sql += ` AND prospector = $${paramIndex}`;
      params.push(prospector);
      paramIndex++;
    }

    sql += ' ORDER BY created_at DESC';

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const registros = await query<any>(sql, params);

    // Converter snake_case para camelCase
    const result = registros.map(r => ({
      id: r.id,
      data: r.data,
      prospector: r.prospector,
      polo: r.polo,
      prefixo: r.prefixo,
      trafo: r.trafo,
      visitas: r.visitas,
      cod100: r.cod100,
      cod200: r.cod200,
      cod300: r.cod300,
      clandestino: r.clandestino,
      inclusao: r.inclusao,
      exclusao: r.exclusao,
      ip: r.ip,
      observacoes: r.observacoes,
      status: r.status,
      totalApontamentos: r.total_apontamentos,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error('Erro ao buscar registros:', error);
    return NextResponse.json({ error: 'Erro ao buscar registros' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await initDB();
    
    const body = await request.json();
    const id = generateId();

    const totalApontamentos = 
      (body.cod100 || 0) + 
      (body.cod200 || 0) + 
      (body.cod300 || 0) + 
      (body.clandestino || 0);

    const dataValue = body.data ? new Date(body.data) : new Date();

    const sql = `
      INSERT INTO registros (
        id, data, prospector, polo, prefixo, trafo, visitas,
        cod100, cod200, cod300, clandestino, inclusao, exclusao, ip,
        observacoes, status, total_apontamentos, created_at, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, NOW(), NOW()
      ) RETURNING *
    `;

    const params = [
      id,
      dataValue,
      body.prospector,
      body.polo,
      body.prefixo,
      body.trafo,
      body.visitas,
      body.cod100 || 0,
      body.cod200 || 0,
      body.cod300 || 0,
      body.clandestino || 0,
      body.inclusao || 0,
      body.exclusao || 0,
      body.ip || 0,
      body.observacoes || null,
      body.status || 'em_andamento',
      totalApontamentos,
    ];

    const rows = await query<Record<string, unknown>>(sql, params);
    const registro = rows[0];

    // Converter para camelCase
    const result = {
      id: registro.id,
      data: registro.data,
      prospector: registro.prospector,
      polo: registro.polo,
      prefixo: registro.prefixo,
      trafo: registro.trafo,
      visitas: registro.visitas,
      cod100: registro.cod100,
      cod200: registro.cod200,
      cod300: registro.cod300,
      clandestino: registro.clandestino,
      inclusao: registro.inclusao,
      exclusao: registro.exclusao,
      ip: registro.ip,
      observacoes: registro.observacoes,
      status: registro.status,
      totalApontamentos: registro.total_apontamentos,
      createdAt: registro.created_at,
      updatedAt: registro.updated_at,
    };

    // Enviar para Google Sheets
    const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;
    if (spreadsheetId) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const rowData = formatRegistroForSheet(result as any);
        await appendToSheet(spreadsheetId, 'Registros!A:Q', [rowData]);
        console.log('Registro enviado para Google Sheets');
      } catch (sheetError) {
        console.error('Erro ao enviar para Google Sheets:', sheetError);
      }
    }

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar registro:', error);
    return NextResponse.json({ error: 'Erro ao criar registro' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await initDB();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID não fornecido' }, { status: 400 });
    }

    await query('DELETE FROM registros WHERE id = $1', [id]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao excluir registro:', error);
    return NextResponse.json({ error: 'Erro ao excluir registro' }, { status: 500 });
  }
}
