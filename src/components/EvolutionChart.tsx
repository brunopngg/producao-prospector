'use client';

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { META_VISITAS } from '@/config/constants';

interface DailyData {
  data: string;
  visitas: number;
  apontamentos: number;
  prospectores: number;
}

interface EvolutionChartProps {
  data: DailyData[];
}

export default function EvolutionChart({ data }: EvolutionChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="card p-6 animate-fade-in">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">📈 Evolução Diária</h2>
        <div className="h-[300px] flex items-center justify-center text-neutral-500">
          Nenhum dado disponível
        </div>
      </div>
    );
  }

  // Formatar data para exibição
  const formattedData = data.map(d => ({
    ...d,
    dataFormatada: new Date(d.data + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
  }));

  return (
    <div className="card p-6 animate-fade-in">
      <h2 className="text-lg font-semibold text-neutral-900 mb-4">📈 Evolução Diária</h2>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={formattedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
            <XAxis 
              dataKey="dataFormatada" 
              tick={{ fontSize: 11, fontWeight: 600 }}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                background: '#fff',
                border: '2px solid #171717',
                borderRadius: 8,
              }}
              formatter={(value, name) => {
                const labels: Record<string, string> = {
                  visitas: 'Visitas',
                  apontamentos: 'Apontamentos',
                  prospectores: 'Prospectores Ativos',
                };
                return [value ?? 0, labels[String(name)] || String(name)];
              }}
            />
            <Legend wrapperStyle={{ fontWeight: 600 }} />
            <ReferenceLine 
              y={META_VISITAS} 
              stroke="#ef4444" 
              strokeWidth={2}
              strokeDasharray="5 5" 
              label={{ value: `Meta: ${META_VISITAS}`, fill: '#ef4444', fontSize: 11, position: 'right' }} 
            />
            <Line 
              type="monotone" 
              dataKey="visitas" 
              stroke="#171717" 
              strokeWidth={3}
              dot={{ fill: '#171717', strokeWidth: 2 }}
              name="visitas"
            />
            <Line 
              type="monotone" 
              dataKey="apontamentos" 
              stroke="#3b82f6" 
              strokeWidth={2}
              dot={{ fill: '#3b82f6', strokeWidth: 2 }}
              name="apontamentos"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
