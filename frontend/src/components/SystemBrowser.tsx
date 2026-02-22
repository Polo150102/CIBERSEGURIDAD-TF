import React from 'react';
import svgPaths from '../imports/svg-hrta31pusn';

interface SystemBrowserProps {
  children: React.ReactNode;
}

export const SystemBrowser: React.FC<SystemBrowserProps> = ({ children }) => {
  return (
    <div className="w-[1000px] h-[750px] bg-white border-[1.33px] border-black shadow-[4px_4px_0px_rgba(0,0,0,0.2)] flex flex-col overflow-hidden font-sans">
      {/* Title Bar */}
      <div className="h-[28px] bg-gradient-to-b from-[#000080] to-[#1084d0] flex items-center justify-between px-3 shrink-0">
        <div className="flex items-center gap-2">
          <svg className="size-[14px]" viewBox="0 0 14 14" fill="none">
            <path d={svgPaths.pd04fc00} stroke="white" strokeWidth="1.16" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-white text-[12px] font-bold">SIDPOL v1.0 - Captura de Datos (CONEXIÓN INSEGURA)</span>
        </div>
        <div className="flex gap-1">
          <button className="bg-[#c0c0c0] size-5 border border-white border-b-black border-r-black flex items-center justify-center text-xs font-bold">_</button>
          <button className="bg-[#c0c0c0] size-5 border border-white border-b-black border-r-black flex items-center justify-center text-xs font-bold">□</button>
          <button className="bg-[#e7000b] size-5 border border-white border-b-black border-r-black flex items-center justify-center text-xs font-bold text-white">X</button>
        </div>
      </div>

      {/* Navigation / Address Bar */}
      <div className="h-[46px] bg-[#f0f0f0] border-b-[1.33px] border-[#99a1af] flex items-center px-2 gap-2 shrink-0">
        <div className="flex gap-1">
          <button className="size-6 bg-[#f3f4f6] border border-[#d1d5dc] flex items-center justify-center">
            <svg className="size-4" viewBox="0 0 16 16" fill="none">
              <path d={svgPaths.p3f446380} stroke="#1E2939" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button className="size-6 bg-[#f3f4f6] border border-[#d1d5dc] flex items-center justify-center opacity-50">
            <svg className="size-4" viewBox="0 0 16 16" fill="none">
              <path d={svgPaths.p3f0cc030} stroke="#99A1AF" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
        <div className="flex-1 h-[26px] bg-white border-[1.33px] border-[#6a7282] flex items-center px-2 gap-2 overflow-hidden">
          <div className="flex items-center gap-1 border-r border-[#d1d5dc] pr-2 shrink-0">
            <svg className="size-[14px]" viewBox="0 0 14 14" fill="none">
              <path d={svgPaths.pd04fc00} stroke="#E7000B" strokeWidth="1.16" />
              <path d="M7 4.6V7" stroke="#E7000B" strokeWidth="1.16" />
              <path d="M7 9.3H7.005" stroke="#E7000B" strokeWidth="1.16" />
            </svg>
            <span className="text-[#E7000B] text-[10px] font-serif font-bold uppercase whitespace-nowrap">Not Secure</span>
          </div>
          <span className="text-[#1e2939] text-[12px] font-serif truncate">http://192.168.1.10/registro/nueva_denuncia.php?user_id=1&debug=true</span>
        </div>
        <button className="size-7 bg-[#e5e7eb] border border-[#99a1af] flex items-center justify-center">
          <svg className="size-4" viewBox="0 0 14 14" fill="none">
            <path d={svgPaths.p3abc4500} stroke="#0A0A0A" strokeWidth="1.16" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* Warning Banner */}
      <div className="h-[31px] bg-[#e7000b]/70 flex items-center px-20 gap-2 shrink-0">
        <svg className="size-[14px]" viewBox="0 0 14 14" fill="none">
          <path d={svgPaths.p3ba1200} stroke="white" strokeWidth="1.16" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M7 5.25V7.5" stroke="white" strokeWidth="1.16" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M7 9.9H7.005" stroke="white" strokeWidth="1.16" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="text-white text-[10px] font-serif font-bold uppercase">
          ADVERTENCIA: LAS CONTRASEÑAS Y DATOS PERSONALES ESTÁN VIAJANDO EN TEXTO PLANO POR LA RED LOCAL. SNIFFING DETECTADO.
        </span>
      </div>

      {/* Body Area */}
      <div className="flex-1 flex overflow-hidden">
        {children}
      </div>

      {/* Status Bar */}
      <div className="h-[24px] bg-[#f0f0f0] border-t-[1.33px] border-[#99a1af] flex items-center justify-between px-3 shrink-0">
        <div className="flex items-center gap-2">
          <svg className="size-3" viewBox="0 0 12 12" fill="none">
            <path d={svgPaths.p3e7757b0} stroke="#4A5565" strokeLinecap="round" strokeLinejoin="round" />
            <path d={svgPaths.p31d5da00} stroke="#4A5565" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M1 6H11" stroke="#4A5565" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-[#4a5565] text-[10px]">Listo | Protocolo: HTTP/1.1</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[#e7000b] text-[10px] font-bold uppercase">MODO DEBUG: ACTIVADO</span>
          <span className="text-[#4a5565] text-[10px] border-l border-[#d1d5dc] pl-4">Intranet Comisaría San Genaro</span>
        </div>
      </div>
    </div>
  );
};
