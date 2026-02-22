import React from 'react';
import svgPaths from '../imports/svg-hrta31pusn';

export const FormSection: React.FC = () => {
  return (
    <div className="flex-1 bg-white p-8 overflow-auto font-serif">
      {/* Header Row */}
      <div className="flex items-center justify-between border-b border-black pb-2 mb-8">
        <h2 className="text-[20px] font-bold uppercase tracking-tighter">
          Fase 1: Recepción del Ciudadano
        </h2>
        <div className="flex items-center gap-2 text-[#6a7282]">
          <svg className="size-4" viewBox="0 0 16 16" fill="none">
            <path d={svgPaths.p399eca00} stroke="#99A1AF" strokeWidth="1.33" />
            <path d={svgPaths.pc93b400} stroke="#99A1AF" strokeWidth="1.33" />
          </svg>
          <span className="text-[12px] font-bold uppercase">Operador: S1 PNP Garcia</span>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-12">
        {/* Left Column: Form */}
        <div className="col-span-7 space-y-8">
          <div>
            <h3 className="text-[14px] font-bold underline mb-4">Datos del Denunciante</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase text-[#364153] mb-1">
                  DNI del Ciudadano:
                </label>
                <div className="flex gap-2 h-[38px]">
                  <input 
                    type="text" 
                    defaultValue="10223344"
                    className="flex-1 bg-[#fefce8] border-[1.33px] border-[#1e2939] px-2 text-[16px] outline-none"
                  />
                  <button className="bg-[#009966] text-white px-4 border border-black font-bold text-[10px] uppercase shadow-[inset_1px_1px_0px_rgba(255,255,255,0.3)] active:shadow-none">
                    RENIEC
                  </button>
                </div>
                <p className="text-[8px] font-bold italic text-[#009966] mt-1">
                  Acceso Público a RENIEC: Activo (Sin Captcha)
                </p>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-[#364153] mb-1">
                  Nombre Completo:
                </label>
                <input 
                  type="text" 
                  defaultValue="JUAN PEREZ GONZALES"
                  className="w-full h-[38px] border-[1.33px] border-[#1e2939] px-2 text-[16px] outline-none"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-[14px] font-bold underline mb-4">Redacción del Acta Inicial (Relato)</h3>
            <div className="relative">
              <textarea 
                className="w-full h-[120px] border-[1.33px] border-[#1e2939] p-2 text-[14px] outline-none resize-none"
                defaultValue=""
              />
              <div className="absolute bottom-2 right-2 border border-[#e7000b] px-2 py-1 bg-white">
                <span className="text-[#e7000b] text-[10px] font-bold uppercase">XSS DETECTADO</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Evidence */}
        <div className="col-span-5">
          <h3 className="text-[14px] font-bold underline mb-4">Carga de Evidencias (Files)</h3>
          <div className="border-[1.33px] border-[#99a1af] p-8 flex flex-col items-center justify-center gap-4 bg-[#f8fafc]">
            <svg className="size-8" viewBox="0 0 24 24" fill="none">
              <path d={svgPaths.p2d557600} stroke="#99A1AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M17 8L12 3L7 8" stroke="#99A1AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12 3V15" stroke="#99A1AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="text-[10px] text-[#6a7282] font-bold text-center">
              Suba fotos, audios o ejecutables de respaldo.
            </p>
            <button className="bg-[#f0f0f0] border border-black px-6 py-2 font-bold text-[12px] uppercase shadow-[inset_1px_1px_0px_white] active:shadow-none">
              BROWSE...
            </button>
            <p className="text-[8px] font-bold text-[#e7000b] uppercase text-center mt-2">
              Allowed types: .jpg, .pdf, .exe, .php, .sh (NO VALIDATION)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
