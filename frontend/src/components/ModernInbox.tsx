import React, { useState } from 'react';
import { 
  Mail, 
  Clock, 
  MoreVertical, 
  Star, 
  Trash2, 
  Reply, 
  ExternalLink, 
  Paperclip,
  CheckCircle2,
  AlertTriangle,
  Info
} from 'lucide-react';

export const ModernInbox: React.FC = () => {
  const [selectedId, setSelectedId] = useState(1);
  
  const messages = [
    { 
      id: 1, 
      type: 'ALERTA', 
      priority: 'high',
      sender: 'Sistema Automatizado', 
      title: 'Nueva Denuncia Registrada: ROBO AGRAVADO', 
      preview: 'Se ha registrado una nueva denuncia mediante el portal web por el ciudadano JUAN PEREZ...',
      time: '08:45 AM',
      read: false
    },
    { 
      id: 2, 
      type: 'MEMO', 
      priority: 'medium',
      sender: 'Fiscalía de la Nación', 
      title: 'Solicitud de Elevación: Exp. 2026-00042', 
      preview: 'Se requiere la elevación de los peritajes de balística para el caso en mención antes de...',
      time: '09:12 AM',
      read: true
    },
    { 
      id: 3, 
      type: 'SISTEMA', 
      priority: 'critical',
      sender: 'Infraestructura DIRTIC', 
      title: 'Mantenimiento Preventivo de Servidores Centrales', 
      preview: 'El día de hoy se realizará un reinicio preventivo de la base de datos ESINPOL entre las...',
      time: '10:05 AM',
      read: false
    },
    { 
      id: 4, 
      type: 'RENIEC', 
      priority: 'high',
      sender: 'Módulo de Identificación', 
      title: 'Validación Biométrica Exitosa: JUAN PEREZ', 
      preview: 'La consulta realizada para el ciudadano ha retornado datos biográficos confirmados satisfactoriamente.',
      time: '11:20 AM',
      read: true
    },
  ];

  const selectedMsg = messages.find(m => m.id === selectedId) || messages[0];

  return (
    <div className="flex-1 flex overflow-hidden bg-white">
      {/* Message List */}
      <div className="w-[400px] border-r border-slate-200 flex flex-col bg-slate-50/50">
        <div className="p-4 border-b border-slate-200 bg-white">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Bandeja de Entrada</h3>
          <div className="flex gap-2">
            <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-xs font-bold shadow-sm">TODOS</button>
            <button className="flex-1 bg-white border border-slate-200 text-slate-600 py-2 rounded-lg text-xs font-bold hover:bg-slate-50">ALERTAS</button>
            <button className="flex-1 bg-white border border-slate-200 text-slate-600 py-2 rounded-lg text-xs font-bold hover:bg-slate-50">MEMOS</button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {messages.map((msg) => (
            <button
              key={msg.id}
              onClick={() => setSelectedId(msg.id)}
              className={`w-full text-left p-4 border-b border-slate-200 transition-all relative ${
                selectedId === msg.id ? 'bg-white shadow-md z-10' : 'hover:bg-slate-100/50'
              }`}
            >
              {!msg.read && (
                <div className="absolute top-4 right-4 w-2 h-2 bg-blue-600 rounded-full" />
              )}
              <div className="flex justify-between items-start mb-1">
                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                  msg.priority === 'critical' ? 'bg-red-100 text-red-700' :
                  msg.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {msg.type}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">{msg.time}</span>
              </div>
              <h4 className={`text-sm mb-1 line-clamp-1 ${!msg.read ? 'font-bold text-slate-900' : 'text-slate-700'}`}>
                {msg.title}
              </h4>
              <p className="text-xs text-slate-500 line-clamp-1">{msg.sender}</p>
              <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-relaxed">{msg.preview}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        {/* Toolbar */}
        <div className="h-16 border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"><Reply size={20} /></button>
            <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"><Star size={20} /></button>
            <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"><Trash2 size={20} /></button>
            <div className="w-px h-6 bg-slate-200 mx-2" />
            <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"><MoreVertical size={20} /></button>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 font-medium">Prioridad del Mensaje:</span>
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
              selectedMsg.priority === 'critical' ? 'bg-red-600 text-white' :
              selectedMsg.priority === 'high' ? 'bg-orange-500 text-white' :
              'bg-blue-600 text-white'
            }`}>
              {selectedMsg.priority === 'critical' && <AlertTriangle size={12} />}
              {selectedMsg.priority}
            </div>
          </div>
        </div>

        {/* Message Content */}
        <div className="flex-1 overflow-y-auto p-10">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-start justify-between mb-8">
              <div className="flex gap-4">
                <div className="size-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600 border border-slate-200">
                  <Mail size={24} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{selectedMsg.title}</h1>
                  <div className="flex items-center gap-2 mt-1 text-sm text-slate-500">
                    <span className="font-bold text-slate-900">{selectedMsg.sender}</span>
                    <span>&lt;noreply@pnp.gob.pe&gt;</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-slate-900">10 de Febrero, 2026</div>
                <div className="text-xs text-slate-500 flex items-center justify-end gap-1.5 mt-1">
                  <Clock size={12} />
                  {selectedMsg.time}
                </div>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 text-slate-700 leading-relaxed text-sm space-y-4">
              <p>Estimado efectivo policial,</p>
              <p>{selectedMsg.preview} {selectedMsg.preview} {selectedMsg.preview}</p>
              <p>Se recomienda proceder con los protocolos estandarizados de investigación según el R.M. Nº 123-2024. Este mensaje ha sido verificado mediante firma digital institucional.</p>
              <div className="pt-8 border-t border-slate-200 mt-8">
                <p className="font-bold text-slate-900 italic">SISTEMA AUTOMATIZADO SIDPOL 2.0</p>
                <p className="text-xs text-slate-500 mt-1">Esta es una notificación generada automáticamente, por favor no responda a este correo.</p>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="border border-slate-200 rounded-xl p-4 flex items-center justify-between hover:border-blue-300 transition-colors group cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                    <Paperclip size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">ACTA_DIGITAL_1102.pdf</p>
                    <p className="text-[10px] text-slate-500">2.4 MB • PDF Document</p>
                  </div>
                </div>
                <button className="p-1.5 text-slate-400 group-hover:text-blue-600"><ExternalLink size={16} /></button>
              </div>
              <div className="border border-slate-200 rounded-xl p-4 flex items-center gap-4 bg-green-50/50 border-green-100">
                <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                  <CheckCircle2 size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-green-800 uppercase">Integridad Verificada</p>
                  <p className="text-[10px] text-green-600/70">SHA-256: 4e8a...3f1d</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
