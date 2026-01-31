'use client';

import React from 'react';
import { Registro } from '@/types';
import { formatDateTime } from '@/config/constants';

interface RecentRecordsProps {
  registros: Registro[];
  onDelete: (id: string) => void;
  isLoading: boolean;
}

export default function RecentRecords({ registros, onDelete, isLoading }: RecentRecordsProps) {
  if (registros.length === 0) {
    return (
      <div className="card p-6 animate-fade-in">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Registros Recentes</h2>
        <div className="text-center py-12 text-neutral-500">
          <span className="text-4xl mb-3 block">📋</span>
          <p>Nenhum registro encontrado</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-6 animate-fade-in">
      <h2 className="text-lg font-semibold text-neutral-900 mb-4">Registros Recentes</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="table-header">
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Data</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Prospector</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Polo</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Prefixo</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Trafo</th>
              <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider">Visitas</th>
              <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider">Apontamentos</th>
              <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {registros.map((registro) => (
              <tr key={registro.id} className="hover:bg-neutral-50 transition-colors">
                <td className="px-4 py-3 text-sm text-neutral-600">{formatDateTime(registro.createdAt)}</td>
                <td className="px-4 py-3 text-sm font-medium text-neutral-900">{registro.prospector}</td>
                <td className="px-4 py-3 text-sm text-neutral-600">{registro.polo}</td>
                <td className="px-4 py-3 text-sm text-neutral-600">{registro.prefixo}</td>
                <td className="px-4 py-3 text-sm text-neutral-600">{registro.trafo}</td>
                <td className="px-4 py-3 text-sm text-center font-medium text-neutral-900">{registro.visitas}</td>
                <td className="px-4 py-3 text-sm text-center font-medium text-neutral-900">{registro.totalApontamentos}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`badge ${registro.status === 'executado' ? 'badge-success' : 'badge-warning'}`}>
                    {registro.status === 'executado' ? 'Executado' : 'Em Andamento'}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => {
                      if (confirm(`Tem certeza que deseja excluir o registro do trafo ${registro.trafo}?`)) {
                        onDelete(registro.id);
                      }
                    }}
                    className="bg-red-100 text-red-700 hover:bg-red-200 px-3 py-1.5 rounded font-semibold text-xs transition-colors disabled:opacity-50"
                    disabled={isLoading}
                  >
                    🗑️ Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
