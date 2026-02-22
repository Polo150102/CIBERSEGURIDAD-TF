import React from 'react';

export const InboxSection: React.FC = () => {
  const messages = [
    { id: 1, type: 'ALERT', title: 'NUEVA DENUNCIA REGISTRADA', from: 'SISTEMA AUTOMATICO', time: '08:45', priority: 'ALTA', content: 'Se ha registrado una nueva denuncia por Robo Agravado en la jurisdicción de Breña.' },
    { id: 2, type: 'MEMO', title: 'DISPOSICION FISCAL Nº 042-2026', from: 'FISCALIA DE LA NACION', time: '09:12', priority: 'NORMAL', content: 'Se solicita la elevación inmediata del expediente 2026-00042 para revisión.' },
    { id: 3, type: 'SYSTEM', title: 'FALLO EN RESPALDO DE DATOS', from: 'SERVER-04', time: '10:05', priority: 'CRITICA', content: 'El disco duro de respaldo (backup_db) ha fallado. Los datos no están siendo protegidos.' },
    { id: 4, type: 'ALERT', title: 'SOSPECHOSO IDENTIFICADO', from: 'RENIEC INTERFACE', time: '11:20', priority: 'ALTA', content: 'Coincidencia encontrada para el DNI 10223344 en base de datos de requisitorias.' },
    { id: 5, type: 'MEMO', title: 'CAMBIO DE CONTRASEÑA OBLIGATORIO', from: 'ADMINISTRACION', time: '12:00', priority: 'BAJA', content: 'Por favor, cambie su contraseña. La actual "pnp_2008_root" ha caducado hace 450 días.' },
  ];

  return (
    <div className="flex-1 bg-[#d4d4d4] flex flex-col font-serif h-full overflow-hidden">
      {/* Inbox Header */}
      <div className="bg-[#f3f4f6] border-b border-black p-4 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-3">
          <div className="bg-[#000080] p-1.5 border border-white shadow-[1px_1px_0px_black]">
            <svg className="size-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4h16v16H4zM4 4l8 8 8-8" />
            </svg>
          </div>
          <h2 className="text-[16px] font-black text-[#000080] uppercase tracking-tighter">Bandeja de Entrada - SIDPOL v1.0</h2>
        </div>
        <div className="flex gap-2">
          <span className="bg-[#fefce8] border border-black px-2 py-0.5 text-[9px] font-bold text-red-600 animate-pulse">
            12 MENSAJES SIN LEER
          </span>
          <button className="bg-[#c0c0c0] border border-white border-b-black border-r-black px-3 py-1 text-[9px] font-bold uppercase shadow-[1px_1px_0px_black]">
            Actualizar
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-[#e5e7eb] border-b border-black p-1 flex gap-2 shrink-0">
        <button className="px-3 py-0.5 border border-white border-b-[#808080] border-r-[#808080] text-[10px] font-bold hover:bg-white/50">Nuevo</button>
        <button className="px-3 py-0.5 border border-white border-b-[#808080] border-r-[#808080] text-[10px] font-bold hover:bg-white/50">Responder</button>
        <button className="px-3 py-0.5 border border-white border-b-[#808080] border-r-[#808080] text-[10px] font-bold hover:bg-white/50">Eliminar</button>
        <div className="flex-1" />
        <div className="flex items-center gap-2 px-2 border-l border-black/20">
           <span className="text-[9px] font-bold text-black/50">Ver:</span>
           <select className="bg-white border border-black text-[9px] px-1 outline-none">
             <option>Todos los mensajes</option>
             <option>Solo Alertas</option>
             <option>Memos</option>
           </select>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* List of Messages */}
        <div className="w-[350px] border-r border-black bg-white overflow-y-auto">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`p-3 border-b border-black/10 cursor-pointer transition-colors hover:bg-[#fefce8] ${msg.id === 1 ? 'bg-[#f0f9ff] border-l-4 border-l-[#000080]' : ''}`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className={`text-[8px] font-bold px-1 uppercase ${
                  msg.priority === 'CRITICA' ? 'bg-red-600 text-white' : 
                  msg.priority === 'ALTA' ? 'bg-[#e7000b] text-white' : 
                  'bg-gray-200 text-gray-700'
                }`}>
                  {msg.type}
                </span>
                <span className="text-[9px] font-mono text-black/40">{msg.time}</span>
              </div>
              <h4 className={`text-[11px] font-bold leading-tight uppercase ${msg.id === 1 ? 'text-[#000080]' : 'text-black'}`}>
                {msg.title}
              </h4>
              <p className="text-[10px] text-black/60 truncate mt-1">{msg.from}</p>
            </div>
          ))}
        </div>

        {/* Message Detail View */}
        <div className="flex-1 bg-white overflow-y-auto p-8 relative">
           {/* Vulnerable Watermark */}
           <div className="absolute top-4 right-4 bg-[#fefce8] border border-[#d08700] p-2 text-[9px] font-mono text-[#733e0a] rotate-2 shadow-lg z-20">
              <p>RAW_MAIL_HEADER:</p>
              <p>Return-Path: &lt;root@sidpol-srv-04&gt;</p>
              <p>X-Security: NONE (UNENCRYPTED)</p>
           </div>

           <div className="max-w-[600px] mx-auto space-y-6">
              <div className="border-b-2 border-black pb-4">
                <div className="flex justify-between items-start">
                   <div>
                     <h1 className="text-[20px] font-black text-[#000080] uppercase italic tracking-tighter">
                       {messages[0].title}
                     </h1>
                     <div className="flex items-center gap-4 mt-2">
                       <p className="text-[11px] font-bold uppercase text-black/60">De: <span className="text-black">{messages[0].from}</span></p>
                       <p className="text-[11px] font-bold uppercase text-black/60">Para: <span className="text-black">S2 RAMIREZ</span></p>
                     </div>
                   </div>
                   <div className="text-right">
                     <p className="text-[12px] font-bold text-black">{messages[0].time} HRS</p>
                     <p className="text-[10px] font-bold text-[#e7000b] uppercase">Urgente</p>
                   </div>
                </div>
              </div>

              <div className="bg-[#f9fafb] border border-black p-6 space-y-4">
                 <p className="text-[13px] leading-relaxed text-black/80 whitespace-pre-wrap">
                   {messages[0].content}
                   {"\n\n"}
                   Se requiere que el personal de turno proceda con la apertura del expediente digital y la asignación de un instructor para las diligencias preliminares.
                   {"\n\n"}
                   Atentamente,
                   {"\n"}
                   SISTEMA DE MONITOREO SIDPOL
                 </p>
              </div>

              <div className="flex gap-4">
                <div className="flex-1 bg-[#fef2f2] border border-[#ef4444] p-3">
                   <h5 className="text-[10px] font-bold text-[#b91c1c] uppercase border-b border-[#ef4444]/20 pb-1 mb-2">Acciones Rápidas</h5>
                   <div className="grid grid-cols-2 gap-2">
                      <button className="bg-white border border-[#ef4444] text-[9px] font-bold uppercase py-1.5 text-red-600 hover:bg-red-50">Abrir Expediente</button>
                      <button className="bg-white border border-[#ef4444] text-[9px] font-bold uppercase py-1.5 text-red-600 hover:bg-red-50">Ver Ubicación</button>
                   </div>
                </div>
                <div className="w-[150px] flex items-center justify-center border-2 border-dashed border-[#808080] bg-[#f0f0f0]">
                   <div className="text-center p-2 opacity-30">
                     <svg className="size-6 mx-auto mb-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                       <path d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                     </svg>
                     <p className="text-[8px] font-bold uppercase">Sin Adjuntos</p>
                   </div>
                </div>
              </div>
           </div>
        </div>
      </div>

      {/* Vulnerability Footer Area */}
      <div className="bg-[#2d2d2d] h-[24px] flex items-center px-4 gap-4 overflow-hidden border-t border-black shrink-0">
        <span className="text-[#00ff00] text-[9px] font-mono whitespace-nowrap">
          SMTP_LOG: Connection established from local_relay_unprotected
        </span>
        <span className="text-[#ff0000] text-[9px] font-mono animate-pulse">
          !! ERROR: SSL HANDSHAKE FAILED (CERT_EXPIRED) - CONTINUING IN PLAIN TEXT !!
        </span>
      </div>
    </div>
  );
};
