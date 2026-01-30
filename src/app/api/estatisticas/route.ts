import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const dataInicio = searchParams.get('dataInicio');
    const dataFim = searchParams.get('dataFim');
    const prospector = searchParams.get('prospector');

    const where: Record<string, unknown> = {};

    if (dataInicio || dataFim) {
      where.data = {};
      if (dataInicio) {
        (where.data as Record<string, Date>).gte = new Date(dataInicio);
      }
      if (dataFim) {
        const endDate = new Date(dataFim);
        endDate.setHours(23, 59, 59, 999);
        (where.data as Record<string, Date>).lte = endDate;
      }
    }

    if (prospector) {
      where.prospector = prospector;
    }

    // Agregações por prospector
    const stats = await prisma.registro.groupBy({
      by: ['prospector'],
      where,
      _sum: {
        visitas: true,
        cod100: true,
        cod200: true,
        cod300: true,
        clandestino: true,
        totalApontamentos: true,
      },
      _count: {
        id: true,
      },
    });

    // Lista única de prospectores
    const prospectores = await prisma.registro.findMany({
      where,
      select: { prospector: true },
      distinct: ['prospector'],
    });

    // Totais gerais
    const totais = await prisma.registro.aggregate({
      where,
      _sum: {
        visitas: true,
        cod100: true,
        cod200: true,
        cod300: true,
        clandestino: true,
        totalApontamentos: true,
      },
      _count: {
        id: true,
      },
    });

    return NextResponse.json({
      porProspector: stats.map((s: typeof stats[number]) => ({
        prospector: s.prospector,
        totalVisitas: s._sum.visitas || 0,
        totalApontamentos: s._sum.totalApontamentos || 0,
        cod100: s._sum.cod100 || 0,
        cod200: s._sum.cod200 || 0,
        cod300: s._sum.cod300 || 0,
        clandestino: s._sum.clandestino || 0,
        registros: s._count.id,
      })),
      prospectores: prospectores.map((p: { prospector: string }) => p.prospector),
      totais: {
        totalVisitas: totais._sum.visitas || 0,
        totalApontamentos: totais._sum.totalApontamentos || 0,
        cod100: totais._sum.cod100 || 0,
        cod200: totais._sum.cod200 || 0,
        cod300: totais._sum.cod300 || 0,
        clandestino: totais._sum.clandestino || 0,
        totalRegistros: totais._count.id,
        totalProspectores: prospectores.length,
      },
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    return NextResponse.json({ error: 'Erro ao buscar estatísticas' }, { status: 500 });
  }
}
