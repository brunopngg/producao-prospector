'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Header from '@/components/Header';
import InputForm from '@/components/InputForm';
import RecentRecords from '@/components/RecentRecords';
import StatsCards from '@/components/StatsCards';
import Charts from '@/components/Charts';
import ProspectorTable from '@/components/ProspectorTable';
import Toast from '@/components/Toast';
import Loading from '@/components/Loading';
import EditModal from '@/components/EditModal';
import Ranking from '@/components/Ranking';
import EvolutionChart from '@/components/EvolutionChart';
import TodayStats from '@/components/TodayStats';
import ReportExport from '@/components/ReportExport';
import { Registro, RegistroInput, ProspectorStats, ToastMessage } from '@/types';
import { generateId, POLOS } from '@/config/constants';

interface DailyData {
  data: string;
  visitas: number;
  apontamentos: number;
  prospectores: number;
}

interface TodayData {
  visitas: number;
  apontamentos: number;
  prospectoresAtivos: number;
  trafos: number;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<'registro' | 'dashboard'>('registro');
  const [registros, setRegistros] = useState<Registro[]>([]);
  const [stats, setStats] = useState<{
    porProspector: ProspectorStats[];
    totais: {
      totalVisitas: number;
      totalApontamentos: number;
      totalProspectores: number;
    };
    prospectores: string[];
  }>({
    porProspector: [],
    totais: { totalVisitas: 0, totalApontamentos: 0, totalProspectores: 0 },
    prospectores: [],
  });
  const [evolucao, setEvolucao] = useState<DailyData[]>([]);
  const [todayStats, setTodayStats] = useState<TodayData>({ visitas: 0, apontamentos: 0, prospectoresAtivos: 0, trafos: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  
  // Modal de edição
  const [editingRegistro, setEditingRegistro] = useState<Registro | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  // Filtros
  const [filtroDataInicio, setFiltroDataInicio] = useState('');
  const [filtroDataFim, setFiltroDataFim] = useState('');
  const [filtroProspector, setFiltroProspector] = useState('');
  const [filtroPolo, setFiltroPolo] = useState('');
  const [filtroTipoApontamento, setFiltroTipoApontamento] = useState('todos');

  const addToast = useCallback((type: ToastMessage['type'], message: string) => {
    const id = generateId();
    setToasts((prev) => [...prev, { id, type, message }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Buscar registros
  const fetchRegistros = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (filtroDataInicio) params.append('dataInicio', filtroDataInicio);
      if (filtroDataFim) params.append('dataFim', filtroDataFim);
      if (filtroProspector) params.append('prospector', filtroProspector);

      const response = await fetch(`/api/registros?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        // Aplicar filtro de polo localmente
        const filtered = filtroPolo 
          ? data.filter((r: Registro) => r.polo === filtroPolo)
          : data;
        setRegistros(filtered);
      }
    } catch (error) {
      console.error('Erro ao buscar registros:', error);
    }
  }, [filtroDataInicio, filtroDataFim, filtroProspector, filtroPolo]);

  // Buscar estatísticas
  const fetchStats = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (filtroDataInicio) params.append('dataInicio', filtroDataInicio);
      if (filtroDataFim) params.append('dataFim', filtroDataFim);
      if (filtroProspector) params.append('prospector', filtroProspector);

      const response = await fetch(`/api/estatisticas?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        // Aplicar filtro de polo localmente
        if (filtroPolo) {
          const poloInfo = Object.values(POLOS).find(p => p.nome === filtroPolo);
          if (poloInfo) {
            data.porProspector = data.porProspector.filter((p: ProspectorStats) => 
              poloInfo.prefixos.some(prefix => p.prospector.startsWith(prefix.slice(0, 3)))
            );
          }
        }
        setStats(data);
      }
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
    }
  }, [filtroDataInicio, filtroDataFim, filtroProspector, filtroPolo]);

  // Buscar evolução
  const fetchEvolucao = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (filtroDataInicio) params.append('dataInicio', filtroDataInicio);
      if (filtroDataFim) params.append('dataFim', filtroDataFim);
      if (filtroPolo) params.append('polo', filtroPolo);

      const response = await fetch(`/api/evolucao?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setEvolucao(data);
      }
    } catch (error) {
      console.error('Erro ao buscar evolução:', error);
    }
  }, [filtroDataInicio, filtroDataFim, filtroPolo]);

  // Buscar stats de hoje
  const fetchTodayStats = useCallback(async () => {
    try {
      const response = await fetch('/api/hoje');
      if (response.ok) {
        const data = await response.json();
        setTodayStats(data);
      }
    } catch (error) {
      console.error('Erro ao buscar stats de hoje:', error);
    }
  }, []);

  // Carregar dados iniciais
  useEffect(() => {
    const hoje = new Date();
    const seteDiasAtras = new Date(hoje);
    seteDiasAtras.setDate(hoje.getDate() - 7);
    setFiltroDataInicio(seteDiasAtras.toISOString().split('T')[0]);
    setFiltroDataFim(hoje.toISOString().split('T')[0]);
  }, []);

  useEffect(() => {
    fetchRegistros();
    fetchStats();
    fetchEvolucao();
    fetchTodayStats();
  }, [fetchRegistros, fetchStats, fetchEvolucao, fetchTodayStats]);

  // Salvar registro
  const handleSubmit = async (data: RegistroInput) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/registros', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        addToast('success', 'Registro salvo com sucesso!');
        fetchRegistros();
        fetchStats();
        fetchEvolucao();
        fetchTodayStats();
      } else {
        addToast('error', 'Erro ao salvar registro');
      }
    } catch (error) {
      console.error('Erro ao salvar:', error);
      addToast('error', 'Erro ao salvar registro');
    } finally {
      setIsLoading(false);
    }
  };

  // Excluir registro
  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/registros?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        addToast('info', 'Registro excluído');
        fetchRegistros();
        fetchStats();
        fetchEvolucao();
        fetchTodayStats();
      } else {
        addToast('error', 'Erro ao excluir registro');
      }
    } catch (error) {
      console.error('Erro ao excluir:', error);
      addToast('error', 'Erro ao excluir registro');
    }
  };

  // Abrir modal de edição
  const handleEdit = (registro: Registro) => {
    setEditingRegistro(registro);
    setIsEditModalOpen(true);
  };

  // Salvar edição
  const handleSaveEdit = async (id: string, data: RegistroInput) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/registros?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        addToast('success', 'Registro atualizado!');
        setIsEditModalOpen(false);
        setEditingRegistro(null);
        fetchRegistros();
        fetchStats();
        fetchEvolucao();
        fetchTodayStats();
      } else {
        addToast('error', 'Erro ao atualizar registro');
      }
    } catch (error) {
      console.error('Erro ao atualizar:', error);
      addToast('error', 'Erro ao atualizar registro');
    } finally {
      setIsLoading(false);
    }
  };

  // Aplicar filtros
  const handleApplyFilters = () => {
    fetchRegistros();
    fetchStats();
    fetchEvolucao();
  };

  // Média de visitas
  const mediaVisitas = stats.totais.totalProspectores > 0
    ? Math.round(stats.totais.totalVisitas / stats.totais.totalProspectores)
    : 0;

  return (
    <div className="min-h-screen flex flex-col">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />

      {isLoading && <Loading />}

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          {activeTab === 'registro' ? (
            <div className="space-y-6">
              {/* Card de hoje */}
              <TodayStats
                visitas={todayStats.visitas}
                apontamentos={todayStats.apontamentos}
                prospectoresAtivos={todayStats.prospectoresAtivos}
                trafos={todayStats.trafos}
              />
              
              <InputForm onSubmit={handleSubmit} isLoading={isLoading} />
              <RecentRecords 
                registros={registros} 
                onDelete={handleDelete} 
                onEdit={handleEdit}
                isLoading={isLoading} 
              />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Filtros */}
              <div className="card p-4 animate-fade-in">
                <div className="flex flex-wrap items-end gap-4">
                  <div>
                    <label className="block text-xs font-medium text-neutral-600 mb-1">Data Início</label>
                    <input
                      type="date"
                      value={filtroDataInicio}
                      onChange={(e) => setFiltroDataInicio(e.target.value)}
                      className="input-field text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-600 mb-1">Data Fim</label>
                    <input
                      type="date"
                      value={filtroDataFim}
                      onChange={(e) => setFiltroDataFim(e.target.value)}
                      className="input-field text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-600 mb-1">Polo</label>
                    <select
                      value={filtroPolo}
                      onChange={(e) => setFiltroPolo(e.target.value)}
                      className="input-field text-sm min-w-[150px]"
                    >
                      <option value="">Todos os Polos</option>
                      {Object.values(POLOS).map((polo) => (
                        <option key={polo.nome} value={polo.nome}>{polo.nome}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-600 mb-1">Prospector</label>
                    <select
                      value={filtroProspector}
                      onChange={(e) => setFiltroProspector(e.target.value)}
                      className="input-field text-sm min-w-[180px]"
                    >
                      <option value="">Todos</option>
                      {stats.prospectores.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-600 mb-1">Tipo Apontamento</label>
                    <select
                      value={filtroTipoApontamento}
                      onChange={(e) => setFiltroTipoApontamento(e.target.value)}
                      className="input-field text-sm min-w-[150px]"
                    >
                      <option value="todos">Todos</option>
                      <option value="cod100">Cód. 100</option>
                      <option value="cod200">Cód. 200</option>
                      <option value="cod300">Cód. 300</option>
                      <option value="clandestino">Clandestino</option>
                    </select>
                  </div>
                  <button onClick={handleApplyFilters} className="btn-primary text-sm">
                    🔍 Aplicar Filtros
                  </button>
                  <ReportExport
                    data={stats.porProspector}
                    dataInicio={filtroDataInicio}
                    dataFim={filtroDataFim}
                    totais={stats.totais}
                  />
                </div>
              </div>

              {/* Cards de resumo */}
              <StatsCards
                totalProspectores={stats.totais.totalProspectores}
                totalVisitas={stats.totais.totalVisitas}
                totalApontamentos={stats.totais.totalApontamentos}
                mediaVisitas={mediaVisitas}
              />

              {/* Gráfico de Evolução */}
              <EvolutionChart data={evolucao} />

              {/* Gráficos */}
              <Charts data={stats.porProspector} tipoApontamento={filtroTipoApontamento} />

              {/* Ranking e Tabela */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Ranking data={stats.porProspector} />
                <ProspectorTable data={stats.porProspector} />
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="py-4 border-t border-neutral-200 bg-white print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <p className="text-xs text-neutral-400 text-center">
            Produtividade Prospector · {new Date().getFullYear()}
          </p>
          <p className="text-xs text-neutral-500 text-center mt-1">
            Desenvolvido por <span className="font-medium text-neutral-600">Bruno Lima</span> - ADM - GSTC
          </p>
        </div>
      </footer>

      {/* Modal de Edição */}
      <EditModal
        registro={editingRegistro}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingRegistro(null);
        }}
        onSave={handleSaveEdit}
        isLoading={isLoading}
      />

      <Toast toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
