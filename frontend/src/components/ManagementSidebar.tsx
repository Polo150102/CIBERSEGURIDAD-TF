import React, { useState } from 'react';
import svgPaths from '../imports/svg-hrta31pusn';

export const ManagementSidebar: React.FC<{ onViewChange: (view: string) => void, activeTab: string }> = ({ onViewChange, activeTab }) => {
  const menuItems = [
    { id: 'inbox', label: 'Bandeja de Entrada', icon: 'M4 4h16v16H4z', count: '12' },
    { id: 'cases', label: 'Mis Expedientes', icon: 'M12 11c2.2 0 4-1.8 4-4s-1.8-4-4-4-4 1.8-4 4 1.8 4 4 4z' },
    { id: 'esinpol', label: 'Consultas ESINPOL', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' },
    { id: 'rq', label: 'Requisitorias (RQ)', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
    { id: 'peritajes', label: 'Oficios y Peritajes', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { id: 'archive', label: 'Archivo Pasivo', icon: 'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8' },
  ];

  return (
    <div className="w-[200px] bg-[#d4d4d4] border-r border-[#99a1af] flex flex-col shrink-0 font-sans h-full">
      {/* Search Bar */}
      <div className="p-2 border-b border-[#99a1af]">
        <div className="bg-white border border-[#99a1af] flex items-center px-1">
          <input 
            type="text" 
            placeholder="Buscar Exp..." 
            className="w-full text-[10px] p-1 outline-none font-serif italic"
          />
          <svg className="size-3 text-[#6a7282]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>
      
      <div className="flex-1 py-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`w-full text-left px-3 py-2 flex items-center justify-between group transition-colors ${
              activeTab === item.id 
                ? 'bg-[#000080] text-white shadow-[inset_1px_1px_0px_rgba(255,255,255,0.2)]' 
                : 'text-black hover:bg-black/10'
            }`}
          >
            <div className="flex items-center gap-2">
              <div className={`size-3.5 ${activeTab === item.id ? 'text-white' : 'text-[#4b5563]'}`}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d={item.icon} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="text-[10px] font-bold uppercase truncate">{item.label}</span>
            </div>
            {item.count && (
              <span className={`text-[9px] px-1 font-bold rounded-sm ${activeTab === item.id ? 'bg-white text-[#000080]' : 'bg-[#e7000b] text-white'}`}>
                {item.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* User Status */}
      <div className="p-3 bg-[#c0c0c0] border-t border-white">
        <div className="bg-[#fef9c2] border border-[#d08700] p-2 rounded-[2px] shadow-[1px_1px_0px_white]">
          <div className="flex items-center gap-2 mb-1">
             <div className="size-1.5 bg-green-600 rounded-full animate-pulse" />
             <span className="text-[8px] font-black text-[#733e0a] uppercase">Conectado</span>
          </div>
          <p className="text-[9px] text-[#733e0a] font-serif leading-tight">
            <strong>S2 RAMIREZ</strong><br/>
            TOKEN: 884-219<br/>
            IP: 10.42.12.84
          </p>
        </div>
      </div>
    </div>
  );
};
