import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { appendToSheet, formatRegistroForSheet } from '@/lib/googleSheets';

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

    const registros = await prisma.registro.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(registros);
  } catch (error) {
    console.error('Erro ao buscar registros:', error);
    return NextResponse.json({ error: 'Erro ao buscar registros' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const totalApontamentos = 
      (body.cod100 || 0) + 
      (body.cod200 || 0) + 
      (body.cod300 || 0) + 
      (body.clandestino || 0);

    const registro = await prisma.registro.create({
      data: {
        ...body,
        totalApontamentos,
        data: body.data ? new Date(body.data) : new Date(),
      },
    });

    // Enviar para Google Sheets
    const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;
    if (spreadsheetId) {
      try {
        const rowData = formatRegistroForSheet(registro);
        await appendToSheet(spreadsheetId, 'Registros!A:Q', [rowData]);
        console.log('Registro enviado para Google Sheets');
      } catch (sheetError) {
        console.error('Erro ao enviar para Google Sheets:', sheetError);
        // Não falha a requisição se o Sheets falhar
      }
    }

    return NextResponse.json(registro, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar registro:', error);
    return NextResponse.json({ error: 'Erro ao criar registro' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID não fornecido' }, { status: 400 });
    }

    await prisma.registro.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao excluir registro:', error);
    return NextResponse.json({ error: 'Erro ao excluir registro' }, { status: 500 });
  }
}
