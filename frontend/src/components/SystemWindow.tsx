import React from 'react';
import svgPaths from '../imports/svg-7wbnks6xyw';

export const SystemWindow: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="w-[932px] h-[820px] bg-[#d4d4d4] border-[1.33px] border-black shadow-[4px_4px_0px_rgba(0,0,0,0.2)] flex flex-col overflow-hidden font-sans">
      {/* Browser Nav Bar (Top) */}
      <div className="h-[46px] bg-[#e5e7eb] border-b-[1.33px] border-[#99a1af] flex items-center px-2 gap-4 shrink-0">
        <div className="flex gap-2">
          <NavButton icon={svgPaths.p203476e0} />
          <NavButton icon={svgPaths.p1d405500} disabled />
          <NavButton icon={svgPaths.p3c9c9080} />
        </div>
        <div className="flex-1 h-[30px] bg-white border-[1.33px] border-[#99a1af] flex items-center px-3 gap-2 shadow-[inset_0px_2px_4px_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-2 border-r border-[#ffc9c9] pr-3 shrink-0 bg-[#fef2f2] h-full">
            <svg className="size-3" viewBox="0 0 12 12" fill="none">
              <path d={svgPaths.p2bec7a00} stroke="#E7000B" strokeWidth="1" />
              <path d="M6 4V6" stroke="#E7000B" strokeWidth="1" />
              <path d="M6 8H6.005" stroke="#E7000B" strokeWidth="1" />
            </svg>
            <span className="text-[#E7000B] text-[12px] font-serif font-bold whitespace-nowrap">Not Secure</span>
          </div>
          <span className="text-[#1e2939] text-[12px] font-serif truncate">http://192.168.1.10/login.php?session=debug_mode</span>
          <div className="ml-auto opacity-40">
            <svg className="size-[14px]" viewBox="0 0 14 14" fill="none">
              <path d={svgPaths.pc012c00} stroke="#99A1AF" strokeWidth="1.16" />
              <path d={svgPaths.p21d23a70} stroke="#99A1AF" strokeWidth="1.16" />
              <path d="M1.16 7H12.83" stroke="#99A1AF" strokeWidth="1.16" />
            </svg>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-[#d4d4d4] flex items-center justify-center relative overflow-auto py-8">
        {children}
      </div>

      {/* Status Bar (Bottom) */}
      <div className="h-[23px] bg-[#002c22] flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-2">
          <div className="bg-white rounded-[2px] p-[1px]">
             <svg className="size-3" viewBox="0 0 16 16" fill="none">
                <path d={svgPaths.p30533c80} stroke="#004F3B" strokeWidth="2" />
             </svg>
          </div>
          <span className="text-white/50 text-[10px] font-sans">SIDPOL_SRV_04 (Local Network Only)</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[#ff6467] text-[10px] font-bold font-sans">HTTPS: DISABLED</span>
          <span className="text-white/50 text-[10px] font-sans">FECHA: 10/02/2026</span>
        </div>
      </div>
    </div>
  );
};

const NavButton = ({ icon, disabled }: { icon: string; disabled?: boolean }) => (
  <button disabled={disabled} className={`size-[24px] flex items-center justify-center ${disabled ? 'opacity-30' : 'hover:bg-black/5 active:bg-black/10'}`}>
    <svg className="size-4" viewBox="0 0 16 16" fill="none">
       <path d={icon} stroke="#99A1AF" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </button>
);
