'use client';

import React, { useState } from 'react';
import { ProspectorStats } from '@/types';
import { META_VISITAS, POLOS } from '@/config/constants';

interface ReportExportProps {
  data: ProspectorStats[];
  dataInicio: string;
  dataFim: string;
  totais: {
    totalVisitas: number;
    totalApontamentos: number;
    totalProspectores: number;
  };
}

const ALL_PROSPECTORS = Object.values(POLOS).flatMap(polo => polo.prefixos);

export default function ReportExport({ data, dataInicio, dataFim, totais }: ReportExportProps) {
  const [isExporting, setIsExporting] = useState(false);

  const generateCSV = () => {
    const headers = ['Prospector', 'Visitas', 'Meta', '% Meta', 'Cód 100', 'Cód 200', 'Cód 300', 'Clandestino', 'Inclusão', 'Exclusão', 'Total Apontamentos', 'Trafos'];
    
    const rows = data.map(p => [
      p.prospector,
      p.totalVisitas,
      META_VISITAS,
      Math.round((p.totalVisitas / META_VISITAS) * 100) + '%',
      p.cod100,
      p.cod200,
      p.cod300,
      p.clandestino,
      p.inclusao || 0,
      p.exclusao || 0,
      p.totalApontamentos,
      p.registros,
    ]);

    // Adicionar linha de totais
    rows.push([
      'TOTAL',
      totais.totalVisitas,
      META_VISITAS * ALL_PROSPECTORS.length,
      '',
      data.reduce((sum, p) => sum + p.cod100, 0),
      data.reduce((sum, p) => sum + p.cod200, 0),
      data.reduce((sum, p) => sum + p.cod300, 0),
      data.reduce((sum, p) => sum + p.clandestino, 0),
      data.reduce((sum, p) => sum + (p.inclusao || 0), 0),
      data.reduce((sum, p) => sum + (p.exclusao || 0), 0),
      totais.totalApontamentos,
      data.reduce((sum, p) => sum + p.registros, 0),
    ]);

    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    return csvContent;
  };

  const handleExportCSV = () => {
    setIsExporting(true);
    try {
      const csv = generateCSV();
      const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `relatorio-prospectores-${dataInicio}-${dataFim}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={handleExportCSV}
        disabled={isExporting || data.length === 0}
        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
      >
        📊 Exportar CSV
      </button>
      <button
        onClick={handlePrint}
        disabled={data.length === 0}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
      >
        🖨️ Imprimir
      </button>
    </div>
  );
}
