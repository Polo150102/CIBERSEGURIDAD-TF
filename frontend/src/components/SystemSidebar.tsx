import React from 'react';

export const SystemSidebar: React.FC = () => {
  return (
    <div className="w-[192px] bg-[#d4d4d4] border-r border-[#99a1af] p-4 flex flex-col gap-4">
      <div className="bg-[#006045] border border-black p-2">
        <span className="text-white text-[12px] font-bold font-sans">1. IDENTIDAD</span>
      </div>
      
      {['2. INCIDENTE', '3. ACTA / FIRMA', '4. CONSTANCIA'].map((tab) => (
        <div key={tab} className="bg-[#e5e7eb] p-2 opacity-50">
          <span className="text-[#6a7282] text-[12px] font-bold font-sans">{tab}</span>
        </div>
      ))}

      <div className="mt-auto bg-[#fef9c2] border border-[#d08700] rounded p-2">
         <p className="text-[9px] text-[#733e0a] font-bold font-sans leading-tight">
            Use el botón "RENIEC" para autocompletar datos del ciudadano.
         </p>
      </div>
    </div>
  );
};
