'use client';

import React from 'react';
import { META_VISITAS } from '@/config/constants';

interface StatsCardsProps {
  totalProspectores: number;
  totalVisitas: number;
  totalApontamentos: number;
  mediaVisitas: number;
}

export default function StatsCards({ 
  totalProspectores, 
  totalVisitas, 
  totalApontamentos, 
  mediaVisitas 
}: StatsCardsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 animate-fade-in">
      <div className="stat-card">
        <div className="flex items-center gap-3">
          <span className="text-2xl">👥</span>
          <div>
            <p className="text-2xl font-bold text-neutral-900">{totalProspectores}</p>
            <p className="text-sm text-neutral-500">Prospectores</p>
          </div>
        </div>
      </div>
      
      <div className="stat-card">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🏠</span>
          <div>
            <p className="text-2xl font-bold text-neutral-900">{totalVisitas}</p>
            <p className="text-sm text-neutral-500">Total Visitas</p>
          </div>
        </div>
      </div>
      
      <div className="stat-card">
        <div className="flex items-center gap-3">
          <span className="text-2xl">📋</span>
          <div>
            <p className="text-2xl font-bold text-neutral-900">{totalApontamentos}</p>
            <p className="text-sm text-neutral-500">Total Apontamentos</p>
          </div>
        </div>
      </div>
      
      <div className="stat-card">
        <div className="flex items-center gap-3">
          <span className="text-2xl">📈</span>
          <div>
            <p className={`text-2xl font-bold ${mediaVisitas >= META_VISITAS ? 'text-green-600' : 'text-neutral-900'}`}>
              {mediaVisitas}
            </p>
            <p className="text-sm text-neutral-500">Média Visitas/Dia</p>
          </div>
        </div>
      </div>
    </div>
  );
}
