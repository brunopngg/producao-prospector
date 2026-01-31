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
import { META_VISITAS, POLOS } from '@/config/constants';
import { ProspectorStats } from '@/types';

interface ChartsProps {
  data: ProspectorStats[];
  tipoApontamento: string;
}

// Lista de todos os prospectores
const ALL_PROSPECTORS = Object.values(POLOS).flatMap(polo => polo.prefixos);

// Componente customizado para label nas barras - mais visível
const renderCustomLabel = (props: LabelProps) => {
  const x = Number(props.x) || 0;
  const y = Number(props.y) || 0;
  const width = Number(props.width) || 0;
  const value = props.value as number;
  if (value === undefined || value === null) return null;
  return (
    <text 
      x={x + width / 2} 
      y={y - 8} 
      fill="#171717" 
      textAnchor="middle" 
      fontSize={13} 
      fontWeight={700}
      style={{ textShadow: '1px 1px 2px white' }}
    >
      {value}
    </text>
  );
};

// Label para dentro da barra
const renderInsideLabel = (props: LabelProps) => {
  const x = Number(props.x) || 0;
  const y = Number(props.y) || 0;
  const width = Number(props.width) || 0;
  const height = Number(props.height) || 0;
  const value = props.value as number;
  if (!value || value === 0 || height < 20) return null;
  return (
    <text 
      x={x + width / 2} 
      y={y + height / 2 + 4} 
      fill="#fff" 
      textAnchor="middle" 
      fontSize={12} 
      fontWeight={700}
    >
      {value}
    </text>
  );
};

export default function Charts({ data, tipoApontamento }: ChartsProps) {
  // Criar dados para todos os prospectores, mesmo os que não tem dados
  const visitasData = ALL_PROSPECTORS.map((prefixo) => {
    const prospectorData = data.find(d => d.prospector === prefixo);
    const visitas = prospectorData?.totalVisitas || 0;
    const trafos = prospectorData?.registros || 0;
    const faltou = !prospectorData || visitas === 0;
    
    return {
      name: prefixo,
      visitas: faltou ? 0 : visitas,
      trafos,
      faltou,
      status: faltou ? 'FALTOU' : (visitas >= META_VISITAS ? 'OK' : 'ABAIXO'),
    };
  });

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

  // Dados para gráfico de inclusão e exclusão
  const inclusaoExclusaoData = data.map((d) => ({
    name: d.prospector,
    'Inclusão': d.inclusao || 0,
    'Exclusão': d.exclusao || 0,
  }));

  // Se não houver nenhum dado
  const hasAnyData = data.length > 0;

  return (
    <div className="space-y-6 mb-6">
      {/* Gráfico de Visitas - Todos os Prospectores */}
      <div className="card p-6 animate-fade-in">
        <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
          <h3 className="text-base font-bold text-neutral-900">📊 Visitas por Prospector</h3>
          <div className="flex gap-2 flex-wrap">
            <span className="text-xs font-bold text-red-600 bg-red-100 px-3 py-1.5 rounded">Meta: {META_VISITAS} visitas</span>
            <span className="text-xs font-bold text-green-600 bg-green-100 px-3 py-1.5 rounded">✓ Atingiu</span>
            <span className="text-xs font-bold text-gray-600 bg-gray-100 px-3 py-1.5 rounded">✗ Faltou</span>
          </div>
        </div>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={visitasData} margin={{ top: 30, right: 20, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 11, fontWeight: 600 }} 
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis tick={{ fontSize: 12 }} domain={[0, 'auto']} />
              <Tooltip
                contentStyle={{
                  background: '#fff',
                  border: '2px solid #171717',
                  borderRadius: 8,
                  padding: '10px',
                }}
                content={({ active, payload }) => {
                  if (!active || !payload || !payload[0]) return null;
                  const data = payload[0].payload as { name: string; visitas: number; trafos: number; faltou: boolean };
                  if (data.faltou) {
                    return (
                      <div className="bg-white border-2 border-neutral-900 rounded-lg p-3">
                        <p className="font-bold text-neutral-900">{data.name}</p>
                        <p className="text-red-600 font-bold">FALTOU</p>
                      </div>
                    );
                  }
                  return (
                    <div className="bg-white border-2 border-neutral-900 rounded-lg p-3">
                      <p className="font-bold text-neutral-900">{data.name}</p>
                      <p><strong>{data.visitas}</strong> visitas</p>
                      <p className="text-sm text-gray-600">{data.trafos} trafo{data.trafos !== 1 ? 's' : ''} prospectado{data.trafos !== 1 ? 's' : ''}</p>
                    </div>
                  );
                }}
              />
              <ReferenceLine 
                y={META_VISITAS} 
                stroke="#ef4444" 
                strokeWidth={2}
                strokeDasharray="5 5" 
                label={{ 
                  value: `Meta: ${META_VISITAS}`, 
                  fill: '#ef4444', 
                  fontSize: 12,
                  fontWeight: 700,
                  position: 'right'
                }} 
              />
              <Bar dataKey="visitas" radius={[4, 4, 0, 0]}>
                {visitasData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.faltou ? '#d1d5db' : (entry.visitas >= META_VISITAS ? '#22c55e' : '#171717')} 
                  />
                ))}
                <LabelList 
                  dataKey="visitas" 
                  content={(props: LabelProps) => {
                    const x = Number(props.x) || 0;
                    const y = Number(props.y) || 0;
                    const width = Number(props.width) || 0;
                    const index = props.index as number;
                    const entry = visitasData[index];
                    
                    if (entry.faltou) {
                      return (
                        <text 
                          x={x + width / 2} 
                          y={y - 8} 
                          fill="#ef4444" 
                          textAnchor="middle" 
                          fontSize={11} 
                          fontWeight={700}
                        >
                          FALTOU
                        </text>
                      );
                    }
                    
                    return (
                      <g>
                        <text 
                          x={x + width / 2} 
                          y={y - 20} 
                          fill="#171717" 
                          textAnchor="middle" 
                          fontSize={14} 
                          fontWeight={700}
                        >
                          {entry.visitas}
                        </text>
                        {entry.trafos > 1 && (
                          <text 
                            x={x + width / 2} 
                            y={y - 6} 
                            fill="#6b7280" 
                            textAnchor="middle" 
                            fontSize={10} 
                            fontWeight={600}
                          >
                            ({entry.trafos} trafos)
                          </text>
                        )}
                      </g>
                    );
                  }} 
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Apontamentos */}
        <div className="card p-6 animate-fade-in">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-bold text-neutral-900">🎯 Apontamentos por Tipo</h3>
          </div>
          <div className="h-[300px]">
            {!hasAnyData ? (
              <div className="h-full flex items-center justify-center text-neutral-500">
                Nenhum dado disponível
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={apontamentosData} margin={{ top: 20, right: 20, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fontWeight: 600 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      background: '#fff',
                      border: '2px solid #171717',
                      borderRadius: 8,
                    }}
                  />
                  <Legend wrapperStyle={{ fontWeight: 600 }} />
                  {tipoApontamento === 'todos' ? (
                    <>
                      <Bar dataKey="Cód. 100" stackId="a" fill="#3b82f6" radius={0}>
                        <LabelList dataKey="Cód. 100" content={renderInsideLabel} />
                      </Bar>
                      <Bar dataKey="Cód. 200" stackId="a" fill="#8b5cf6" radius={0}>
                        <LabelList dataKey="Cód. 200" content={renderInsideLabel} />
                      </Bar>
                      <Bar dataKey="Cód. 300" stackId="a" fill="#171717" radius={0}>
                        <LabelList dataKey="Cód. 300" content={renderInsideLabel} />
                      </Bar>
                      <Bar dataKey="Clandestino" stackId="a" fill="#f59e0b" radius={[4, 4, 0, 0]}>
                        <LabelList dataKey="Clandestino" content={renderInsideLabel} />
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
                      radius={[4, 4, 0, 0]}
                    >
                      <LabelList content={renderCustomLabel} />
                    </Bar>
                  )}
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Gráfico de Inclusão e Exclusão */}
        <div className="card p-6 animate-fade-in">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-bold text-neutral-900">📝 Inclusão e Exclusão</h3>
          </div>
          <div className="h-[300px]">
            {!hasAnyData ? (
              <div className="h-full flex items-center justify-center text-neutral-500">
                Nenhum dado disponível
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={inclusaoExclusaoData} margin={{ top: 20, right: 20, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fontWeight: 600 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      background: '#fff',
                      border: '2px solid #171717',
                      borderRadius: 8,
                    }}
                  />
                  <Legend wrapperStyle={{ fontWeight: 600 }} />
                  <Bar dataKey="Inclusão" fill="#22c55e" radius={[4, 4, 0, 0]}>
                    <LabelList content={renderCustomLabel} />
                  </Bar>
                  <Bar dataKey="Exclusão" fill="#ef4444" radius={[4, 4, 0, 0]}>
                    <LabelList content={renderCustomLabel} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
