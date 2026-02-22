import React, { useState } from 'react';
import svgPaths from '../imports/svg-hrta31pusn';

export const LoginSection: React.FC = () => {
  const [badge, setBadge] = useState('10223344');
  const [password, setPassword] = useState('ADMIN123');

  return (
    <div className="flex-1 bg-[#d4d4d4] flex items-center justify-center p-8 font-serif relative overflow-hidden">
      {/* Background Pattern (Subtle grid) */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 0)', backgroundSize: '20px 20px' }}
      />

      <div className="w-[420px] bg-white border-[1.33px] border-black shadow-[8px_8px_0px_rgba(0,0,0,0.15)] flex flex-col p-8 z-10 relative">
        {/* Header with Shield Logo */}
        <div className="flex flex-col items-center mb-8 pb-6 border-b border-[#e5e7eb]">
          <div className="border-[2px] border-[#004f3b] p-3 mb-4 bg-white">
            <svg className="size-16" viewBox="0 0 14 14" fill="none">
              <path d={svgPaths.pd04fc00} stroke="#004F3B" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M7 4.6V7" stroke="#004F3B" strokeWidth="1" />
              <path d="M7 9.3H7.005" stroke="#004F3B" strokeWidth="1" />
            </svg>
          </div>
          <h1 className="text-[#002c22] text-[22px] font-bold uppercase tracking-tight text-center">
            SIDPOL v1.0.4
          </h1>
          <p className="text-[#6a7282] text-[10px] font-bold uppercase tracking-[0.2em] mt-1">
            Sistema de Identificación Policial
          </p>
        </div>

        {/* Access Warning */}
        <div className="bg-[#fefce8] border border-[#fff085] p-3 mb-8 flex gap-3 items-start">
          <svg className="size-4 shrink-0 mt-0.5" viewBox="0 0 14 14" fill="none">
            <path d={svgPaths.p3ba1200} stroke="#894B00" strokeWidth="1.16" />
          </svg>
          <div className="space-y-1">
            <p className="text-[#894b00] text-[11px] font-bold uppercase">Acceso Restringido</p>
            <p className="text-[#894b00] text-[10px] leading-tight">
              El uso no autorizado de este sistema constituye un delito federal bajo la Ley Nº 30096. Todas las IPs son registradas.
            </p>
          </div>
        </div>

        {/* Input Fields */}
        <div className="space-y-6 mb-8">
          <div>
            <label className="block text-[10px] font-bold uppercase text-[#364153] mb-1">
              Número de Carnet / CIP:
            </label>
            <div className="flex gap-1 h-[36px]">
              <input 
                type="text" 
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                className="flex-1 bg-[#fefce8] border-[1.33px] border-[#1e2939] px-2 text-[16px] outline-none shadow-[inset_1px_1px_0px_rgba(0,0,0,0.05)]"
              />
              <button className="bg-[#e5e7eb] px-2 border border-black text-[9px] font-bold uppercase shadow-[inset_1px_1px_0px_white]">
                Verificar
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-[#364153] mb-1">
              Clave de Acceso:
            </label>
            <div className="relative">
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-[36px] border-[1.33px] border-[#1e2939] px-2 text-[16px] outline-none shadow-[inset_1px_1px_0px_rgba(0,0,0,0.05)]"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-40">
                <svg className="size-3" viewBox="0 0 16 16" fill="none">
                  <path d={svgPaths.p4adfe2c} stroke="black" strokeWidth="1.33" />
                  <path d={svgPaths.p27a74a00} stroke="black" strokeWidth="1.33" />
                </svg>
              </div>
            </div>
            <p className="text-[#e7000b] text-[9px] font-bold italic mt-1">
              * Caps Lock está desactivado.
            </p>
          </div>
        </div>

        {/* Action Button */}
        <button className="w-full h-[42px] bg-[#009966] text-white font-bold text-[14px] uppercase border border-black shadow-[inset_1px_1px_0px_rgba(255,255,255,0.4)] hover:bg-[#007a52] active:translate-y-[1px] active:shadow-none transition-all">
          Iniciar Conexión Segura
        </button>

        {/* Footer info inside card */}
        <div className="mt-8 pt-4 border-t border-[#f0f0f0] text-center">
          <p className="text-[#99a1af] text-[9px] uppercase font-sans font-bold">
            DIRTIC PNP © 2008 | Terminal ID: 192.168.1.10
          </p>
        </div>
      </div>

      {/* Retro decorative text outside card */}
      <div className="absolute bottom-4 right-4 text-white/20 font-sans text-[8px] uppercase tracking-widest text-right">
        Secure Shell Protocol v2.0<br/>
        Encryption: AES-128-CBC
      </div>
    </div>
  );
};
