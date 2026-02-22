import React from 'react';

export const Sidebar: React.FC = () => {
  const tabs = [
    { label: '1. IDENTIDAD', active: true },
    { label: '2. INCIDENTE', active: false },
    { label: '3. ACTA / FIRMA', active: false },
    { label: '4. CONSTANCIA', active: false },
  ];

  return (
    <div className="w-[192px] bg-[#d4d4d4] border-r border-[#99a1af] p-4 flex flex-col gap-4 shrink-0">
      {tabs.map((tab) => (
        <div
          key={tab.label}
          className={`${
            tab.active 
              ? 'bg-[#006045] border-black text-white' 
              : 'bg-[#e5e7eb] border-transparent text-[#6a7282]'
          } border-[1.33px] border-solid p-2 h-[34px] flex items-center relative overflow-hidden`}
        >
          {tab.active && <div aria-hidden="true" className="absolute border-[1.33px] border-black inset-0 pointer-events-none" />}
          <span className="font-sans font-bold text-[12px]">{tab.label}</span>
        </div>
      ))}

      <div className="bg-[#fef9c2] border-[1.33px] border-[#d08700] p-2 mt-auto rounded-[4px] shadow-[1px_1px_0px_rgba(0,0,0,0.1)]">
        <p className="font-sans font-bold text-[9px] text-[#733e0a] leading-tight">
          TIP: Use el botón "RENIEC" para autocompletar. (No requiere Token)
        </p>
      </div>
    </div>
  );
};
