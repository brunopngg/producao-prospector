import { NextResponse } from 'next/server';
import { query, initDB } from '@/lib/db';

interface TodayRow {
  total_visitas: string;
  total_apontamentos: string;
  prospectores: string;
  trafos: string;
}

export async function GET() {
  try {
    await initDB();
    
    // Buscar estatísticas apenas do dia atual
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const amanha = new Date(hoje);
    amanha.setDate(amanha.getDate() + 1);

    const sql = `
      SELECT 
        COALESCE(SUM(visitas), 0) as total_visitas,
        COALESCE(SUM(total_apontamentos), 0) as total_apontamentos,
        COUNT(DISTINCT prospector) as prospectores,
        COUNT(*) as trafos
      FROM registros
      WHERE data >= $1 AND data < $2
    `;

    const rows = await query<TodayRow>(sql, [hoje, amanha]);
    const row = rows[0];

    return NextResponse.json({
      visitas: parseInt(row?.total_visitas) || 0,
      apontamentos: parseInt(row?.total_apontamentos) || 0,
      prospectoresAtivos: parseInt(row?.prospectores) || 0,
      trafos: parseInt(row?.trafos) || 0,
    });
  } catch (error) {
    console.error('Erro ao buscar stats de hoje:', error);
    return NextResponse.json({ error: 'Erro ao buscar stats de hoje' }, { status: 500 });
  }
}
