import React, { useState } from 'react';
import svgPaths from '../imports/svg-7wbnks6xyw';

export const LoginForm: React.FC = () => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('123456');

  return (
    <div className="bg-white w-[400px] border-[1.33px] border-[#6a7282] shadow-[8px_8px_0px_rgba(0,0,0,0.2)] flex flex-col items-center p-8 relative">
      
      {/* Header / Logo */}
      <div className="w-full flex flex-col items-center mb-6 pt-4 border-b border-[#e5e7eb] pb-6">
        <div className="border-[1.33px] border-[#004f3b] p-3 mb-4">
          <svg className="size-12" viewBox="0 0 48 48" fill="none">
            <path d={svgPaths.p30533c80} stroke="#004F3B" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h1 className="text-[#002c22] font-serif font-bold text-[18px] uppercase tracking-[-0.9px]">
          SIDPOL v1.0.4
        </h1>
        <p className="text-[#6a7282] font-serif font-bold text-[10px] uppercase mt-1">
          ACCESO RESTRINGIDO - COMISARÍA VIRTUAL
        </p>
      </div>

      {/* Warning Alert */}
      <div className="w-full bg-[#fefce8] border border-[#fff085] flex items-center gap-3 p-3 mb-8">
        <div className="shrink-0">
          <svg className="size-4" viewBox="0 0 14 14" fill="none">
            <path d={svgPaths.pc012c00} stroke="#894B00" strokeWidth="1.16" />
            <path d="M7 4.66V7" stroke="#894B00" strokeWidth="1.16" />
            <path d="M7 9.33H7.005" stroke="#894B00" strokeWidth="1.16" />
          </svg>
        </div>
        <p className="text-[#894b00] font-serif text-[12px]">
          Aviso: No use caracteres especiales en su contraseña.
        </p>
      </div>

      {/* Form Fields */}
      <div className="w-full space-y-6 mb-8">
        <div className="space-y-1">
          <label className="block text-[#4a5565] font-serif font-bold text-[12px]">
            Nombre de Usuario:
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full h-[35px] border-[1.33px] border-[#99a1af] px-2 font-sans text-[14px] outline-none focus:border-black"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-[#4a5565] font-serif font-bold text-[12px]">
            Contraseña del Sistema:
          </label>
          <div className="relative">
            <input
              type="text" // Debug mode: password is visible
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-[35px] border-[1.33px] border-[#99a1af] px-2 font-serif font-bold text-[14px] text-[#e7000b] outline-none focus:border-black"
            />
            <p className="text-[#fb2c36] font-serif font-bold text-[10px] uppercase mt-1">
              ADVERTENCIA: CONTRASEÑA VISIBLE POR MODO DEBUG
            </p>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="w-full space-y-2 mb-10">
        <button className="w-full h-[38px] bg-[#d1d5dc] border-[1.33px] border-[#6a7282] text-[#1e2939] font-serif font-bold text-[14px] uppercase active:shadow-inner active:translate-y-[1px]">
          ENTRAR
        </button>
        <button className="w-full h-[34px] bg-white border-[1.33px] border-[#d1d5dc] text-[#6a7282] font-serif font-bold text-[10px] uppercase active:translate-y-[1px]">
          ¿OLVIDÓ SU CLAVE? (CONTACTE A DIRTIC)
        </button>
      </div>

      {/* Footer Inside Card */}
      <div className="w-full pt-4 border-t border-[#e5e7eb] text-center space-y-1">
        <p className="text-[#99a1af] font-sans text-[9px] uppercase">
          Copyright 2008 - Policía Nacional del Perú
        </p>
        <p className="text-[#99a1af] font-sans text-[9px] uppercase">
          Optimizado para Internet Explorer 6.0
        </p>
      </div>
    </div>
  );
};
