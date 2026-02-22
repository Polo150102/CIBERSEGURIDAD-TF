import React, { useEffect, useState } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  ExternalLink, 
  Download, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  MoreHorizontal,
  ChevronRight,
  TrendingUp,
  Users,
  ShieldAlert
} from 'lucide-react';

import { getManagementDashboard } from "../api/cases";

interface ModernManagementProps {
  onSelectCase: (id: string) => void;
}

export const ModernManagement: React.FC<ModernManagementProps> = ({ onSelectCase }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [stats, setStats] = useState([
    { label: 'Expedientes Abiertos', value: '0', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'En Investigación', value: '0', icon: Search, color: 'text-orange-600', bg: 'bg-orange-100' },
    { label: 'Elevados a Fiscalía', value: '0', icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Pendientes de Firma', value: '0', icon: ShieldAlert, color: 'text-red-600', bg: 'bg-red-100' },
  ]);

  const [recentCases, setRecentCases] = useState<any[]>([]);

  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    (async () => {
      const dash = await getManagementDashboard(page, pageSize);
      setRecentCases(dash.recent_cases || []);
      setTotal(dash.total || 0);
      setTotalPages(dash.total_pages || 1);

      setStats([
        { label: 'Expedientes Abiertos', value: String(dash.stats?.abiertos ?? 0), icon: FileText, color: 'text-blue-600', bg: 'bg-blue-100' },
        { label: 'En Investigación', value: String(dash.stats?.investigacion ?? 0), icon: Search, color: 'text-orange-600', bg: 'bg-orange-100' },
        { label: 'Elevados a Fiscalía', value: String(dash.stats?.elevados ?? 0), icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-100' },
        { label: 'Pendientes de Firma', value: String(dash.stats?.pendientes_firma ?? 0), icon: ShieldAlert, color: 'text-red-600', bg: 'bg-red-100' },
      ]);
    })();
  }, [page]);

  return (
    <div className="flex-1 bg-slate-50 overflow-y-auto">
      <div className="p-8 space-y-8 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Gestión de Expedientes</h1>
            <p className="text-slate-500 font-medium">Control administrativo de diligencias y actuaciones policiales.</p>
          </div>
          <div className="flex gap-3">
             <button className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-xl text-sm font-bold text-slate-600 shadow-sm hover:bg-slate-50">
               <Download size={18} />
               Exportar Reporte
             </button>
             <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-xl text-sm font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all">
               + Nuevo Expediente
             </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
               <div className="flex items-center justify-between mb-4">
                 <div className={`p-2 rounded-lg ${s.bg} ${s.color}`}>
                   <s.icon size={20} />
                 </div>
                 <span className="flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                    <TrendingUp size={12} />
                    +2.4%
                 </span>
               </div>
               <h3 className="text-3xl font-black text-slate-900">{s.value}</h3>
               <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Main Table Section */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
             <h3 className="font-bold text-slate-900 uppercase tracking-tight">Expedientes Recientes</h3>
             <div className="flex gap-2">
                <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors"><Filter size={18} /></button>
                <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors"><Search size={18} /></button>
             </div>
          </div>

          {loading && <div className="p-6 text-sm text-slate-500 font-medium">Cargando expedientes...</div>}
          {error && <div className="p-6 text-sm text-red-600 font-bold">{error}</div>}
          
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <th className="px-6 py-4">ID Expediente</th>
                <th className="px-6 py-4">Tipo de Delito</th>
                <th className="px-6 py-4">Agraviado / Víctima</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4">Prioridad</th>
                <th className="px-6 py-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentCases.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-900">{c.code}</span>
                      <span className="text-[10px] text-slate-400 font-medium">{c.date}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-slate-600">{c.type}</td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-700">{c.victim}</td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-lg ${
                     c.status === 'Investigación' ? 'bg-blue-50 text-blue-600' :
                      c.status === 'Elevado' ? 'bg-green-50 text-green-600' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                       <div className={`size-2 rounded-full ${
                         c.priority === 'ALTA' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' :
                         c.priority === 'NORMAL' ? 'bg-orange-500' : 'bg-slate-400'
                       }`} />
                       <span className="text-[10px] font-bold text-slate-500 uppercase">{c.priority}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => onSelectCase(String(c.id))}
                        className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors" 
                        title="Ver Detalle"
                      >
                        <ExternalLink size={16} />
                      </button>
                      <button className="p-2 hover:bg-slate-100 text-slate-600 rounded-lg transition-colors"><MoreHorizontal size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="p-4 border-t border-slate-100 bg-slate-50/30 flex justify-between items-center px-6">
             <span className="text-xs text-slate-500 font-medium">Mostrando 4 de 142 resultados</span>
             <div className="flex gap-1">
                <button className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold shadow-sm disabled:opacity-50">1</button>
                <button className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold shadow-sm hover:bg-slate-50">2</button>
                <button className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold shadow-sm hover:bg-slate-50">3</button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
