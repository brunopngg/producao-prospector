'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  LabelList,
  Cell,
} from 'recharts';
import type { Props as LabelProps } from 'recharts/types/component/Label';
import { META_VISITAS } from '@/config/constants';
import { ProspectorStats } from '@/types';

interface ChartsProps {
  data: ProspectorStats[];
  tipoApontamento: string;
}

// Componente customizado para label nas barras
const renderCustomLabel = (props: LabelProps) => {
  const x = Number(props.x) || 0;
  const y = Number(props.y) || 0;
  const width = Number(props.width) || 0;
  const value = props.value as number;
  if (!value || value === 0) return null;
  return (
    <text x={x + width / 2} y={y - 5} fill="#171717" textAnchor="middle" fontSize={11} fontWeight={600}>
      {value}
    </text>
  );
};

export default function Charts({ data, tipoApontamento }: ChartsProps) {
  // Se não houver dados, exibir mensagem
  if (!data || data.length === 0) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="card p-6 animate-fade-in">
          <h3 className="text-sm font-semibold text-neutral-900 mb-4">Visitas por Prospector</h3>
          <div className="h-[300px] flex items-center justify-center text-neutral-500">
            Nenhum dado disponível para o período selecionado
          </div>
        </div>
        <div className="card p-6 animate-fade-in">
          <h3 className="text-sm font-semibold text-neutral-900 mb-4">Apontamentos por Tipo</h3>
          <div className="h-[300px] flex items-center justify-center text-neutral-500">
            Nenhum dado disponível para o período selecionado
          </div>
        </div>
      </div>
    );
  }

  // Dados para gráfico de visitas
  const visitasData = data.map((d) => ({
    name: d.prospector,
    visitas: d.totalVisitas,
    meta: META_VISITAS,
  }));

  // Dados para gráfico de apontamentos
  const apontamentosData = data.map((d) => {
    if (tipoApontamento === 'todos') {
      return {
        name: d.prospector,
        'Cód. 100': d.cod100,
        'Cód. 200': d.cod200,
        'Cód. 300': d.cod300,
        'Clandestino': d.clandestino,
      };
    }
    
    const labelMap: Record<string, string> = {
      cod100: 'Cód. 100',
      cod200: 'Cód. 200',
      cod300: 'Cód. 300',
      clandestino: 'Clandestino',
    };
    
    return {
      name: d.prospector,
      [labelMap[tipoApontamento]]: d[tipoApontamento as keyof ProspectorStats] as number,
    };
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* Gráfico de Visitas */}
      <div className="card p-6 animate-fade-in">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-semibold text-neutral-900">Visitas por Prospector</h3>
          <span className="text-xs font-semibold text-red-500 bg-red-50 px-2 py-1">Meta: {META_VISITAS} visitas</span>
        </div>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={visitasData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  background: '#fff',
                  border: '1px solid #e5e5e5',
                  borderRadius: 0,
                }}
              />
              <ReferenceLine y={META_VISITAS} stroke="#ef4444" strokeDasharray="5 5" label={{ value: `Meta: ${META_VISITAS}`, fill: '#ef4444', fontSize: 11 }} />
              <Bar dataKey="visitas" radius={0}>
                {visitasData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.visitas >= META_VISITAS ? '#22c55e' : '#171717'} />
                ))}
                <LabelList dataKey="visitas" content={renderCustomLabel} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Gráfico de Apontamentos */}
      <div className="card p-6 animate-fade-in">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-semibold text-neutral-900">Apontamentos por Tipo</h3>
        </div>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={apontamentosData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  background: '#fff',
                  border: '1px solid #e5e5e5',
                  borderRadius: 0,
                }}
              />
              <Legend />
              {tipoApontamento === 'todos' ? (
                <>
                  <Bar dataKey="Cód. 100" stackId="a" fill="#3b82f6" radius={0}>
                    <LabelList dataKey="Cód. 100" position="center" fill="#fff" fontSize={10} fontWeight={600} />
                  </Bar>
                  <Bar dataKey="Cód. 200" stackId="a" fill="#171717" radius={0}>
                    <LabelList dataKey="Cód. 200" position="center" fill="#fff" fontSize={10} fontWeight={600} />
                  </Bar>
                  <Bar dataKey="Cód. 300" stackId="a" fill="#6b7280" radius={0}>
                    <LabelList dataKey="Cód. 300" position="center" fill="#fff" fontSize={10} fontWeight={600} />
                  </Bar>
                  <Bar dataKey="Clandestino" stackId="a" fill="#a3a3a3" radius={0}>
                    <LabelList dataKey="Clandestino" position="center" fill="#fff" fontSize={10} fontWeight={600} />
                  </Bar>
                </>
              ) : (
                <Bar
                  dataKey={
                    tipoApontamento === 'cod100' ? 'Cód. 100' :
                    tipoApontamento === 'cod200' ? 'Cód. 200' :
                    tipoApontamento === 'cod300' ? 'Cód. 300' : 'Clandestino'
                  }
                  fill="#171717"
                  radius={0}
                >
                  <LabelList content={renderCustomLabel} />
                </Bar>
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
