'use client';

import React from 'react';
import { META_VISITAS, POLOS } from '@/config/constants';

interface TodayStatsProps {
  visitas: number;
  apontamentos: number;
  prospectoresAtivos: number;
  trafos: number;
}

const ALL_PROSPECTORS = Object.values(POLOS).flatMap(polo => polo.prefixos);

// Função para formatar data que funciona tanto no servidor quanto cliente
const formatarDataHoje = () => {
  try {
    return new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
  } catch {
    return '';
  }
};

export default function TodayStats({ visitas, apontamentos, prospectoresAtivos, trafos }: TodayStatsProps) {
  const totalProspectores = ALL_PROSPECTORS.length;
  const faltantes = totalProspectores - prospectoresAtivos;
  const mediaVisitas = prospectoresAtivos > 0 ? Math.round(visitas / prospectoresAtivos) : 0;
  const percentMeta = Math.round((mediaVisitas / META_VISITAS) * 100);

  return (
    <div className="card p-6 animate-fade-in bg-gradient-to-r from-neutral-900 to-neutral-800 text-white">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">📅 Resumo de Hoje</h2>
        <span className="text-sm bg-white/20 px-3 py-1 rounded-full" suppressHydrationWarning>
          {formatarDataHoje()}
        </span>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white/10 rounded-lg p-4">
          <p className="text-3xl font-bold">{visitas}</p>
          <p className="text-sm text-white/70">Visitas Totais</p>
        </div>
        
        <div className="bg-white/10 rounded-lg p-4">
          <p className="text-3xl font-bold">{apontamentos}</p>
          <p className="text-sm text-white/70">Apontamentos</p>
        </div>
        
        <div className="bg-white/10 rounded-lg p-4">
          <p className="text-3xl font-bold">{trafos}</p>
          <p className="text-sm text-white/70">Trafos Prospectados</p>
        </div>
        
        <div className="bg-white/10 rounded-lg p-4">
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-green-400">{prospectoresAtivos}</p>
            <p className="text-lg text-red-400">/ {faltantes} faltaram</p>
          </div>
          <p className="text-sm text-white/70">Prospectores</p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-white/20">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-white/70">Média por Prospector</p>
            <p className={`text-2xl font-bold ${percentMeta >= 100 ? 'text-green-400' : 'text-yellow-400'}`}>
              {mediaVisitas} visitas
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-white/70">Meta Diária</p>
            <p className={`text-2xl font-bold ${percentMeta >= 100 ? 'text-green-400' : 'text-yellow-400'}`}>
              {percentMeta}%
            </p>
          </div>
        </div>
        <div className="mt-2 h-3 bg-white/20 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all ${percentMeta >= 100 ? 'bg-green-400' : 'bg-yellow-400'}`}
            style={{ width: `${Math.min(percentMeta, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
