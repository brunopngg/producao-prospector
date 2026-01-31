'use client';

import React, { useState } from 'react';
import { Registro, RegistroInput } from '@/types';
import { POLOS, STATUS_OPTIONS } from '@/config/constants';

interface EditModalProps {
  registro: Registro | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, data: RegistroInput) => Promise<void>;
  isLoading: boolean;
}

function getInitialFormData(registro: Registro | null): RegistroInput {
  if (!registro) {
    return {
      prospector: '',
      polo: '',
      prefixo: '',
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
      status: 'executado',
    };
  }
  return {
    prospector: registro.prospector,
    polo: registro.polo,
    prefixo: registro.prefixo,
    trafo: registro.trafo,
    visitas: registro.visitas,
    cod100: registro.cod100,
    cod200: registro.cod200,
    cod300: registro.cod300,
    clandestino: registro.clandestino,
    inclusao: registro.inclusao,
    exclusao: registro.exclusao,
    ip: registro.ip,
    observacoes: registro.observacoes || '',
    status: registro.status,
  };
}

export default function EditModal({ registro, isOpen, onClose, onSave, isLoading }: EditModalProps) {
  const [formData, setFormData] = useState<RegistroInput>(() => getInitialFormData(registro));
  
  // Atualizar formData quando registro mudar (sem useEffect)
  const currentRegistroId = registro?.id;
  const [lastRegistroId, setLastRegistroId] = useState<string | undefined>(undefined);
  
  if (currentRegistroId !== lastRegistroId && registro) {
    setLastRegistroId(currentRegistroId);
    setFormData(getInitialFormData(registro));
  }

  if (!isOpen || !registro) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(registro.id, formData);
  };

  const handleChange = (field: keyof RegistroInput, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-neutral-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-neutral-900">✏️ Editar Registro</h2>
            <button onClick={onClose} className="text-neutral-500 hover:text-neutral-700 text-2xl">
              ×
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Polo</label>
              <select
                value={formData.polo}
                onChange={(e) => handleChange('polo', e.target.value)}
                className="input-field"
              >
                {Object.entries(POLOS).map(([key, polo]) => (
                  <option key={key} value={polo.nome}>{polo.nome}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Prefixo</label>
              <input
                type="text"
                value={formData.prefixo}
                onChange={(e) => handleChange('prefixo', e.target.value)}
                className="input-field"
                readOnly
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Trafo</label>
              <input
                type="text"
                value={formData.trafo}
                onChange={(e) => handleChange('trafo', e.target.value)}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Visitas</label>
              <input
                type="number"
                value={formData.visitas}
                onChange={(e) => handleChange('visitas', parseInt(e.target.value) || 0)}
                className="input-field"
                min="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Cód. 100</label>
              <input
                type="number"
                value={formData.cod100}
                onChange={(e) => handleChange('cod100', parseInt(e.target.value) || 0)}
                className="input-field"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Cód. 200</label>
              <input
                type="number"
                value={formData.cod200}
                onChange={(e) => handleChange('cod200', parseInt(e.target.value) || 0)}
                className="input-field"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Cód. 300</label>
              <input
                type="number"
                value={formData.cod300}
                onChange={(e) => handleChange('cod300', parseInt(e.target.value) || 0)}
                className="input-field"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Clandestino</label>
              <input
                type="number"
                value={formData.clandestino}
                onChange={(e) => handleChange('clandestino', parseInt(e.target.value) || 0)}
                className="input-field"
                min="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Inclusão</label>
              <input
                type="number"
                value={formData.inclusao}
                onChange={(e) => handleChange('inclusao', parseInt(e.target.value) || 0)}
                className="input-field"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Exclusão</label>
              <input
                type="number"
                value={formData.exclusao}
                onChange={(e) => handleChange('exclusao', parseInt(e.target.value) || 0)}
                className="input-field"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">IP</label>
              <input
                type="number"
                value={formData.ip}
                onChange={(e) => handleChange('ip', parseInt(e.target.value) || 0)}
                className="input-field"
                min="0"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value)}
              className="input-field"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Observações</label>
            <textarea
              value={formData.observacoes}
              onChange={(e) => handleChange('observacoes', e.target.value)}
              className="input-field"
              rows={2}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 border border-neutral-300 rounded font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 btn-primary"
            >
              {isLoading ? 'Salvando...' : '💾 Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
