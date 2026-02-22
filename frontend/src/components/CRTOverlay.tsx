import React from 'react';
import { motion } from 'motion/react';

export const CRTOverlay: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {/* Scanlines */}
      <div 
        className="absolute inset-0 w-full h-full opacity-[0.03]"
        style={{
          background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
          backgroundSize: '100% 4px, 3px 100%'
        }}
      />
      
      {/* Flickering effect */}
      <motion.div 
        animate={{ opacity: [0.01, 0.02, 0.01] }}
        transition={{ duration: 0.1, repeat: Infinity }}
        className="absolute inset-0 bg-white pointer-events-none"
      />

      {/* Vignette */}
      <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.5)] pointer-events-none" />
    </div>
  );
};
