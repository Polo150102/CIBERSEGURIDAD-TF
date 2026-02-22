import React from 'react';
import { motion } from 'motion/react';
import { Shield, Terminal, User, Lock, Wifi, Battery, Radio } from 'lucide-react';

interface TerminalFrameProps {
  children: React.ReactNode;
  title?: string;
}

export const TerminalFrame: React.FC<TerminalFrameProps> = ({ children, title = "PD-OS v2.84" }) => {
  return (
    <div className="relative w-full max-w-2xl mx-auto border-4 border-[#00d4ff] bg-[#020d1a] shadow-[0_0_30px_rgba(0,212,255,0.3)] overflow-hidden rounded-lg">
      {/* Header Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#00d4ff] text-[#020d1a] font-mono text-sm font-bold uppercase tracking-widest">
        <div className="flex items-center gap-2">
          <Terminal size={16} />
          <span>{title}</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <Radio size={14} className="animate-pulse" />
            <Wifi size={14} />
            <Battery size={14} />
          </div>
          <span>{new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Inner Content */}
      <div className="p-8 relative">
        {/* Grid Background */}
        <div 
          className="absolute inset-0 opacity-[0.05] pointer-events-none" 
          style={{ 
            backgroundImage: 'linear-gradient(#00d4ff 1px, transparent 1px), linear-gradient(90deg, #00d4ff 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}
        />
        
        <div className="relative z-10 font-mono text-[#00d4ff]">
          {children}
        </div>
      </div>

      {/* Footer Decoration */}
      <div className="flex justify-between px-4 py-1 text-[10px] text-[#00d4ff]/50 border-t border-[#00d4ff]/20 uppercase">
        <span>Restricted Area - Unauthorized access prohibited</span>
        <span>Secure Link Established</span>
      </div>
    </div>
  );
};
