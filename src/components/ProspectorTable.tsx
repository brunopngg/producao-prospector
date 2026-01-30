'use client';

import React from 'react';
import { META_VISITAS } from '@/config/constants';
import { ProspectorStats } from '@/types';

interface ProspectorTableProps {
  data: ProspectorStats[];
}

export default function ProspectorTable({ data }: ProspectorTableProps) {
  if (data.length === 0) {
    return (
      <div className="card p-6 animate-fade-in">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Detalhamento por Prospector</h2>
        <div className="text-center py-12 text-neutral-500">
          <span className="text-4xl mb-3 block">📊</span>
          <p>Nenhum dado para exibir</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-6 animate-fade-in">
      <h2 className="text-lg font-semibold text-neutral-900 mb-4">Detalhamento por Prospector</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="table-header">
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Prospector</th>
              <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider">Total Visitas</th>
              <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider">Meta</th>
              <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider">% Meta</th>
              <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider">Cód. 100</th>
              <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider">Cód. 200</th>
              <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider">Cód. 300</th>
              <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider">Clandestino</th>
              <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider">Total Apontamentos</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {data.map((prospector) => {
              const metaTotal = META_VISITAS * prospector.registros;
              const percentMeta = metaTotal > 0 ? Math.round((prospector.totalVisitas / metaTotal) * 100) : 0;
              const aboveMeta = percentMeta >= 100;

              return (
                <tr key={prospector.prospector} className="hover:bg-neutral-50 transition-colors">
                  <td className="px-4 py-3 text-sm font-semibold text-neutral-900">{prospector.prospector}</td>
                  <td className="px-4 py-3 text-sm text-center font-medium text-neutral-900">{prospector.totalVisitas}</td>
                  <td className="px-4 py-3 text-sm text-center text-neutral-600">{metaTotal}</td>
                  <td className="px-4 py-3 text-sm text-center">
                    <span className={`font-semibold ${aboveMeta ? 'text-green-600' : 'text-red-600'}`}>
                      {percentMeta}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-center text-neutral-600">{prospector.cod100}</td>
                  <td className="px-4 py-3 text-sm text-center text-neutral-600">{prospector.cod200}</td>
                  <td className="px-4 py-3 text-sm text-center text-neutral-600">{prospector.cod300}</td>
                  <td className="px-4 py-3 text-sm text-center text-neutral-600">{prospector.clandestino}</td>
                  <td className="px-4 py-3 text-sm text-center font-semibold text-neutral-900">{prospector.totalApontamentos}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
