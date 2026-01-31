'use client';

import React from 'react';
import { META_VISITAS } from '@/config/constants';
import { ProspectorStats } from '@/types';

interface RankingProps {
  data: ProspectorStats[];
}

export default function Ranking({ data }: RankingProps) {
  // Ordenar por total de visitas (decrescente)
  const ranking = [...data].sort((a, b) => b.totalVisitas - a.totalVisitas);

  if (ranking.length === 0) {
    return (
      <div className="card p-6 animate-fade-in">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">🏆 Ranking de Prospectores</h2>
        <div className="text-center py-8 text-neutral-500">
          <span className="text-4xl mb-3 block">🏅</span>
          <p>Nenhum dado para exibir</p>
        </div>
      </div>
    );
  }

  const getMedalEmoji = (position: number) => {
    switch (position) {
      case 0: return '🥇';
      case 1: return '🥈';
      case 2: return '🥉';
      default: return `${position + 1}º`;
    }
  };

  const getRowStyle = (position: number) => {
    switch (position) {
      case 0: return 'bg-yellow-50 border-l-4 border-yellow-400';
      case 1: return 'bg-gray-50 border-l-4 border-gray-400';
      case 2: return 'bg-orange-50 border-l-4 border-orange-400';
      default: return 'hover:bg-neutral-50';
    }
  };

  return (
    <div className="card p-6 animate-fade-in">
      <h2 className="text-lg font-semibold text-neutral-900 mb-4">🏆 Ranking de Prospectores</h2>
      <div className="space-y-2">
        {ranking.map((prospector, index) => {
          const percentMeta = Math.round((prospector.totalVisitas / META_VISITAS) * 100);
          const efficiency = prospector.totalVisitas > 0 
            ? ((prospector.totalApontamentos / prospector.totalVisitas) * 100).toFixed(1)
            : '0';

          return (
            <div
              key={prospector.prospector}
              className={`flex items-center justify-between p-3 rounded-lg transition-colors ${getRowStyle(index)}`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl w-10 text-center">{getMedalEmoji(index)}</span>
                <div>
                  <p className="font-bold text-neutral-900">{prospector.prospector}</p>
                  <p className="text-xs text-neutral-500">
                    {prospector.registros} trafo{prospector.registros !== 1 ? 's' : ''} · {efficiency}% eficiência
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-xl font-bold ${percentMeta >= 100 ? 'text-green-600' : 'text-neutral-900'}`}>
                  {prospector.totalVisitas}
                </p>
                <p className="text-xs text-neutral-500">{percentMeta}% da meta</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
