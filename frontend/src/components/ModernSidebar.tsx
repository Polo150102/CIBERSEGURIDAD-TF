import React from 'react';
import { 
  LayoutDashboard, 
  Inbox, 
  FilePlus, 
  Search, 
  Database, 
  Settings, 
  HelpCircle,
  Archive,
  Fingerprint
} from 'lucide-react';

interface ModernSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  badgeCount?: number;
}

export const ModernSidebar: React.FC<ModernSidebarProps> = ({ activeTab, onTabChange, badgeCount = 12 }) => {
  const primaryMenu = [
    { id: 'dashboard', label: 'Panel de Control', icon: LayoutDashboard },
    { id: 'inbox', label: 'Bandeja de Entrada', icon: Inbox, count: badgeCount },
    { id: 'registration', label: 'Nueva Denuncia', icon: FilePlus },
    { id: 'management', label: 'Mis Expedientes', icon: Archive },
  ];

  const secondaryMenu = [
    { id: 'esinpol', label: 'Consultas ESINPOL', icon: Database },
    { id: 'requisitorias', label: 'Requisitorias (RQ)', icon: Fingerprint },
  ];

  return (
    <div className="w-64 bg-white border-r border-slate-200 flex flex-col h-full shrink-0">
      <div className="flex-1 py-6 px-3 space-y-8">
        {/* Primary Section */}
        <div className="space-y-1">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-3 mb-2">Operativo</p>
          {primaryMenu.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
                activeTab === item.id 
                  ? 'bg-blue-50 text-blue-700 font-semibold shadow-sm border border-blue-100' 
                  : 'text-slate-600 hover:bg-slate-50 font-medium'
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon size={18} className={activeTab === item.id ? 'text-blue-600' : 'text-slate-400'} />
                <span className="text-sm">{item.label}</span>
              </div>
              {item.count !== undefined && item.count > 0 && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                  activeTab === item.id ? 'bg-blue-600 text-white' : 'bg-red-500 text-white'
                }`}>
                  {item.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Intelligence Section */}
        <div className="space-y-1">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-3 mb-2">Inteligencia</p>
          {secondaryMenu.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center px-3 py-2.5 rounded-xl transition-all ${
                activeTab === item.id 
                  ? 'bg-blue-50 text-blue-700 font-semibold shadow-sm border border-blue-100' 
                  : 'text-slate-600 hover:bg-slate-50 font-medium'
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon size={18} className={activeTab === item.id ? 'text-blue-600' : 'text-slate-400'} />
                <span className="text-sm">{item.label}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Footer Nav */}
      <div className="p-4 border-t border-slate-100 space-y-1">
        <button className="w-full flex items-center gap-3 px-3 py-2 text-slate-500 hover:text-slate-900 text-sm font-medium transition-colors">
          <Settings size={18} />
          Configuración
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2 text-slate-500 hover:text-slate-900 text-sm font-medium transition-colors">
          <HelpCircle size={18} />
          Soporte Técnico
        </button>
      </div>
    </div>
  );
};
