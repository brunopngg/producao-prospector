import { NextResponse } from 'next/server';
import { query, initDB } from '@/lib/db';

interface DailyRow {
  data: string;
  total_visitas: string;
  total_apontamentos: string;
  prospectores: string;
}

export async function GET(request: Request) {
  try {
    await initDB();
    
    const { searchParams } = new URL(request.url);
    const dataInicio = searchParams.get('dataInicio');
    const dataFim = searchParams.get('dataFim');
    const polo = searchParams.get('polo');

    let whereClause = 'WHERE 1=1';
    const params: unknown[] = [];
    let paramIndex = 1;

    if (dataInicio) {
      whereClause += ` AND data >= $${paramIndex}`;
      params.push(new Date(dataInicio));
      paramIndex++;
    }

    if (dataFim) {
      const endDate = new Date(dataFim);
      endDate.setHours(23, 59, 59, 999);
      whereClause += ` AND data <= $${paramIndex}`;
      params.push(endDate);
      paramIndex++;
    }

    if (polo) {
      whereClause += ` AND polo = $${paramIndex}`;
      params.push(polo);
      paramIndex++;
    }

    const sql = `
      SELECT 
        DATE(data) as data,
        COALESCE(SUM(visitas), 0) as total_visitas,
        COALESCE(SUM(total_apontamentos), 0) as total_apontamentos,
        COUNT(DISTINCT prospector) as prospectores
      FROM registros
      ${whereClause}
      GROUP BY DATE(data)
      ORDER BY DATE(data) ASC
    `;

    const rows = await query<DailyRow>(sql, params);

    const evolucao = rows.map(row => ({
      data: row.data,
      visitas: parseInt(row.total_visitas) || 0,
      apontamentos: parseInt(row.total_apontamentos) || 0,
      prospectores: parseInt(row.prospectores) || 0,
    }));

    return NextResponse.json(evolucao);
  } catch (error) {
    console.error('Erro ao buscar evolução:', error);
    return NextResponse.json({ error: 'Erro ao buscar evolução' }, { status: 500 });
  }
}
