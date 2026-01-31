import { NextResponse } from 'next/server';
import { query, initDB } from '@/lib/db';

interface StatsRow {
  prospector: string;
  total_visitas: string;
  total_apontamentos: string;
  cod100: string;
  cod200: string;
  cod300: string;
  clandestino: string;
  inclusao: string;
  exclusao: string;
  registros: string;
}

interface TotaisRow {
  total_visitas: string;
  total_apontamentos: string;
  cod100: string;
  cod200: string;
  cod300: string;
  clandestino: string;
  inclusao: string;
  exclusao: string;
  total_registros: string;
}

export async function GET(request: Request) {
  try {
    await initDB();
    
    const { searchParams } = new URL(request.url);
    const dataInicio = searchParams.get('dataInicio');
    const dataFim = searchParams.get('dataFim');
    const prospector = searchParams.get('prospector');

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

    if (prospector) {
      whereClause += ` AND prospector = $${paramIndex}`;
      params.push(prospector);
      paramIndex++;
    }

    // Agregações por prospector
    const statsSql = `
      SELECT 
        prospector,
        COALESCE(SUM(visitas), 0) as total_visitas,
        COALESCE(SUM(total_apontamentos), 0) as total_apontamentos,
        COALESCE(SUM(cod100), 0) as cod100,
        COALESCE(SUM(cod200), 0) as cod200,
        COALESCE(SUM(cod300), 0) as cod300,
        COALESCE(SUM(clandestino), 0) as clandestino,
        COALESCE(SUM(inclusao), 0) as inclusao,
        COALESCE(SUM(exclusao), 0) as exclusao,
        COUNT(*) as registros
      FROM registros
      ${whereClause}
      GROUP BY prospector
    `;
    const stats = await query<StatsRow>(statsSql, params);

    // Lista única de prospectores
    const prospectoresSql = `SELECT DISTINCT prospector FROM registros ${whereClause}`;
    const prospectoresRows = await query<{ prospector: string }>(prospectoresSql, params);
    const prospectores = prospectoresRows.map(p => p.prospector);

    // Totais gerais
    const totaisSql = `
      SELECT 
        COALESCE(SUM(visitas), 0) as total_visitas,
        COALESCE(SUM(total_apontamentos), 0) as total_apontamentos,
        COALESCE(SUM(cod100), 0) as cod100,
        COALESCE(SUM(cod200), 0) as cod200,
        COALESCE(SUM(cod300), 0) as cod300,
        COALESCE(SUM(clandestino), 0) as clandestino,
        COALESCE(SUM(inclusao), 0) as inclusao,
        COALESCE(SUM(exclusao), 0) as exclusao,
        COUNT(*) as total_registros
      FROM registros
      ${whereClause}
    `;
    const totaisRows = await query<TotaisRow>(totaisSql, params);
    const totais = totaisRows[0];

    return NextResponse.json({
      porProspector: stats.map((s) => ({
        prospector: s.prospector,
        totalVisitas: parseInt(s.total_visitas) || 0,
        totalApontamentos: parseInt(s.total_apontamentos) || 0,
        cod100: parseInt(s.cod100) || 0,
        cod200: parseInt(s.cod200) || 0,
        cod300: parseInt(s.cod300) || 0,
        clandestino: parseInt(s.clandestino) || 0,
        inclusao: parseInt(s.inclusao) || 0,
        exclusao: parseInt(s.exclusao) || 0,
        registros: parseInt(s.registros) || 0,
      })),
      prospectores,
      totais: {
        totalVisitas: parseInt(totais?.total_visitas) || 0,
        totalApontamentos: parseInt(totais?.total_apontamentos) || 0,
        cod100: parseInt(totais?.cod100) || 0,
        cod200: parseInt(totais?.cod200) || 0,
        cod300: parseInt(totais?.cod300) || 0,
        clandestino: parseInt(totais?.clandestino) || 0,
        inclusao: parseInt(totais?.inclusao) || 0,
        exclusao: parseInt(totais?.exclusao) || 0,
        totalRegistros: parseInt(totais?.total_registros) || 0,
        totalProspectores: prospectores.length,
      },
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    return NextResponse.json({ error: 'Erro ao buscar estatísticas' }, { status: 500 });
  }
}
