'use client';

import React, { useState } from 'react';
import { STATUS_OPTIONS } from '@/config/constants';
import { RegistroInput } from '@/types';

interface TrafoData {
  id: string;
  trafo: string;
  visitas: number;
  cod100: number;
  cod200: number;
  cod300: number;
  clandestino: number;
  inclusao: number;
  exclusao: number;
  ip: number;
  observacoes: string;
  status: string;
}

interface InputFormProps {
  onSubmit: (data: RegistroInput) => Promise<void>;
  isLoading: boolean;
}

// Lista de todos os prefixos disponíveis como prospectores
const PROSPECTORES = [
  { prefixo: 'PAP801', polo: 'PARAUAPEBAS', poloNome: 'Parauapebas' },
  { prefixo: 'PAP802', polo: 'PARAUAPEBAS', poloNome: 'Parauapebas' },
  { prefixo: 'PAP803', polo: 'PARAUAPEBAS', poloNome: 'Parauapebas' },
  { prefixo: 'MAB803', polo: 'MARABA', poloNome: 'Marabá' },
  { prefixo: 'MAB804', polo: 'MARABA', poloNome: 'Marabá' },
  { prefixo: 'MAB805', polo: 'MARABA', poloNome: 'Marabá' },
  { prefixo: 'MAB806', polo: 'MARABA', poloNome: 'Marabá' },
  { prefixo: 'MAB807', polo: 'MARABA', poloNome: 'Marabá' },
  { prefixo: 'RED801', polo: 'REDENCAO', poloNome: 'Redenção' },
  { prefixo: 'TUC801', polo: 'TUCURUI', poloNome: 'Tucuruí' },
  { prefixo: 'TUC802', polo: 'TUCURUI', poloNome: 'Tucuruí' },
];

function generateTrafoId(): string {
  return Math.random().toString(36).substring(2, 9);
}

const emptyTrafo = (): TrafoData => ({
  id: generateTrafoId(),
  trafo: '',
  visitas: 0,
  cod100: 0,
  cod200: 0,
  cod300: 0,
  clandestino: 0,
  inclusao: 0,
  exclusao: 0,
  ip: 0,
  observacoes: '',
  status: 'em_andamento',
});

export default function InputForm({ onSubmit, isLoading }: InputFormProps) {
  const [prospectorSelecionado, setProspectorSelecionado] = useState('');
  const [data, setData] = useState(new Date().toISOString().split('T')[0]);
  const [trafos, setTrafos] = useState<TrafoData[]>([emptyTrafo()]);
  const [submitting, setSubmitting] = useState(false);

  const prospectorInfo = PROSPECTORES.find(p => p.prefixo === prospectorSelecionado);

  const handleProspectorChange = (prefixo: string) => {
    setProspectorSelecionado(prefixo);
  };

  const handleTrafoChange = (trafoId: string, field: keyof TrafoData, value: string | number) => {
    setTrafos(prev => prev.map(t => 
      t.id === trafoId ? { ...t, [field]: value } : t
    ));
  };

  const addTrafo = () => {
    setTrafos(prev => [...prev, emptyTrafo()]);
  };

  const removeTrafo = (trafoId: string) => {
    if (trafos.length > 1) {
      setTrafos(prev => prev.filter(t => t.id !== trafoId));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prospectorInfo || trafos.length === 0) return;

    setSubmitting(true);
    
    try {
      // Enviar cada trafo como um registro separado
      for (const trafo of trafos) {
        const registroData: RegistroInput = {
          data: new Date(data),
          prospector: prospectorSelecionado,
          polo: prospectorInfo.poloNome,
          prefixo: prospectorSelecionado,
          trafo: trafo.trafo,
          visitas: trafo.visitas,
          cod100: trafo.cod100,
          cod200: trafo.cod200,
          cod300: trafo.cod300,
          clandestino: trafo.clandestino,
          inclusao: trafo.inclusao,
          exclusao: trafo.exclusao,
          ip: trafo.ip,
          observacoes: trafo.observacoes,
          status: trafo.status,
        };
        await onSubmit(registroData);
      }
      
      // Reset trafos após sucesso
      setTrafos([emptyTrafo()]);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClear = () => {
    setProspectorSelecionado('');
    setData(new Date().toISOString().split('T')[0]);
    setTrafos([emptyTrafo()]);
  };

  const loading = isLoading || submitting;

  return (
    <form onSubmit={handleSubmit} className="card p-4 sm:p-6 animate-fade-in">
      <h2 className="text-base sm:text-lg font-semibold text-neutral-900 mb-4 sm:mb-6">
        📝 Registro de Produtividade
      </h2>
      
      {/* Prospector e Data */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div>
          <label className="block text-xs sm:text-sm font-medium text-neutral-600 mb-1 sm:mb-1.5">
            Prospector
          </label>
          <select
            value={prospectorSelecionado}
            onChange={(e) => handleProspectorChange(e.target.value)}
            className="input-field text-sm sm:text-base"
            required
          >
            <option value="">Selecione o prospector</option>
            {PROSPECTORES.map((p) => (
              <option key={p.prefixo} value={p.prefixo}>
                {p.prefixo} - {p.poloNome}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-xs sm:text-sm font-medium text-neutral-600 mb-1 sm:mb-1.5">
            Data
          </label>
          <input
            type="date"
            value={data}
            onChange={(e) => setData(e.target.value)}
            className="input-field text-sm sm:text-base"
            required
          />
        </div>
      </div>

      {prospectorInfo && (
        <div className="bg-green-50 border border-green-200 p-2 sm:p-3 mb-4 sm:mb-6">
          <p className="text-xs sm:text-sm text-green-800">
            <span className="font-semibold">Polo:</span> {prospectorInfo.poloNome} | 
            <span className="font-semibold ml-2">Prefixo:</span> {prospectorInfo.prefixo}
          </p>
        </div>
      )}

      {/* Lista de Trafos */}
      <div className="space-y-4 sm:space-y-6">
        {trafos.map((trafo, index) => (
          <div key={trafo.id} className="border border-neutral-300 p-3 sm:p-4 bg-neutral-50">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h3 className="text-sm sm:text-base font-semibold text-neutral-900">
                🔌 Trafo {index + 1}
              </h3>
              {trafos.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeTrafo(trafo.id)}
                  className="text-red-600 hover:text-red-800 text-xs sm:text-sm font-medium"
                >
                  ✕ Remover
                </button>
              )}
            </div>

            {/* Número do Trafo */}
            <div className="mb-3 sm:mb-4">
              <label className="block text-xs sm:text-sm font-medium text-neutral-600 mb-1">
                Número do Trafo (IN)
              </label>
              <input
                type="text"
                value={trafo.trafo}
                onChange={(e) => handleTrafoChange(trafo.id, 'trafo', e.target.value)}
                className="input-field text-sm sm:text-base"
                placeholder="Ex: 2000562339"
                required
              />
            </div>

            {/* Visitas */}
            <div className="mb-3 sm:mb-4">
              <label className="block text-xs sm:text-sm font-medium text-neutral-600 mb-1">
                Quantidade de Visitas
              </label>
              <input
                type="number"
                value={trafo.visitas || ''}
                onChange={(e) => handleTrafoChange(trafo.id, 'visitas', parseInt(e.target.value) || 0)}
                className="input-field text-sm sm:text-base text-center text-lg font-bold"
                min="0"
                placeholder="0"
                required
              />
            </div>

            {/* Códigos de Apontamento - Grid 2x2 no mobile */}
            <div className="mb-3 sm:mb-4">
              <label className="block text-xs sm:text-sm font-semibold text-neutral-700 mb-2">
                Códigos de Apontamento
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                <div>
                  <label className="block text-xs text-neutral-500 mb-1">Cód. 100</label>
                  <input
                    type="number"
                    value={trafo.cod100 || ''}
                    onChange={(e) => handleTrafoChange(trafo.id, 'cod100', parseInt(e.target.value) || 0)}
                    className="input-field text-sm text-center"
                    min="0"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-xs text-neutral-500 mb-1">Cód. 200</label>
                  <input
                    type="number"
                    value={trafo.cod200 || ''}
                    onChange={(e) => handleTrafoChange(trafo.id, 'cod200', parseInt(e.target.value) || 0)}
                    className="input-field text-sm text-center"
                    min="0"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-xs text-neutral-500 mb-1">Cód. 300</label>
                  <input
                    type="number"
                    value={trafo.cod300 || ''}
                    onChange={(e) => handleTrafoChange(trafo.id, 'cod300', parseInt(e.target.value) || 0)}
                    className="input-field text-sm text-center"
                    min="0"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-xs text-neutral-500 mb-1">Clandestino</label>
                  <input
                    type="number"
                    value={trafo.clandestino || ''}
                    onChange={(e) => handleTrafoChange(trafo.id, 'clandestino', parseInt(e.target.value) || 0)}
                    className="input-field text-sm text-center"
                    min="0"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            {/* Outras Quantidades - Grid 3 colunas */}
            <div className="mb-3 sm:mb-4">
              <label className="block text-xs sm:text-sm font-semibold text-neutral-700 mb-2">
                Outras Quantidades
              </label>
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <div>
                  <label className="block text-xs text-neutral-500 mb-1">Inclusão</label>
                  <input
                    type="number"
                    value={trafo.inclusao || ''}
                    onChange={(e) => handleTrafoChange(trafo.id, 'inclusao', parseInt(e.target.value) || 0)}
                    className="input-field text-sm text-center"
                    min="0"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-xs text-neutral-500 mb-1">Exclusão</label>
                  <input
                    type="number"
                    value={trafo.exclusao || ''}
                    onChange={(e) => handleTrafoChange(trafo.id, 'exclusao', parseInt(e.target.value) || 0)}
                    className="input-field text-sm text-center"
                    min="0"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-xs text-neutral-500 mb-1">IP</label>
                  <input
                    type="number"
                    value={trafo.ip || ''}
                    onChange={(e) => handleTrafoChange(trafo.id, 'ip', parseInt(e.target.value) || 0)}
                    className="input-field text-sm text-center"
                    min="0"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            {/* Status e Observações */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-neutral-600 mb-1">
                  Status
                </label>
                <select
                  value={trafo.status}
                  onChange={(e) => handleTrafoChange(trafo.id, 'status', e.target.value)}
                  className="input-field text-sm"
                  required
                >
                  {STATUS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-neutral-600 mb-1">
                  Observações
                </label>
                <input
                  type="text"
                  value={trafo.observacoes}
                  onChange={(e) => handleTrafoChange(trafo.id, 'observacoes', e.target.value)}
                  className="input-field text-sm"
                  placeholder="Ex: Trafo finalizado"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Botão Adicionar Trafo */}
      <button
        type="button"
        onClick={addTrafo}
        className="w-full mt-4 py-3 border-2 border-dashed border-neutral-400 text-neutral-600 hover:border-green-500 hover:text-green-600 transition-colors text-sm sm:text-base font-medium"
      >
        + Adicionar outro Trafo
      </button>

      {/* Botões de Ação */}
      <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-4 mt-4 border-t border-neutral-200">
        <button
          type="button"
          onClick={handleClear}
          className="btn-secondary w-full sm:w-auto order-2 sm:order-1"
          disabled={loading}
        >
          Limpar Tudo
        </button>
        <button
          type="submit"
          className="btn-primary w-full sm:w-auto order-1 sm:order-2"
          disabled={loading || !prospectorSelecionado}
        >
          {loading ? 'Salvando...' : `Salvar ${trafos.length} Trafo${trafos.length > 1 ? 's' : ''}`}
        </button>
      </div>
    </form>
  );
}
