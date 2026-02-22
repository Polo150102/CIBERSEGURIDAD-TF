import React, { useState } from 'react';
import svgPaths from '../imports/svg-hrta31pusn';

export const ManagementDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('info');
  const [showEsinpol, setShowEsinpol] = useState(false);
  const [actuaciones, setActuaciones] = useState([
    { id: 1, fecha: '10/02/2026 08:45', doc: 'ACTA-INICIAL-0042', tipo: 'Registro', instructor: 'S1 PNP GARCIA', estado: 'Digitalizado' },
    { id: 2, fecha: '10/02/2026 10:15', doc: 'ESINPOL-CONSULTA-1', tipo: 'Antecedentes', instructor: 'S2 PNP RAMIREZ', estado: 'Completado' },
    { id: 3, fecha: '10/02/2026 11:30', doc: 'CITACION-001-2026', tipo: 'Diligencia', instructor: 'S2 PNP RAMIREZ', estado: 'Enviado' },
  ]);

  const addDiligencia = () => {
    const newAct = {
      id: actuaciones.length + 1,
      fecha: new Date().toLocaleString(),
      doc: `DILIG-00${actuaciones.length + 1}-2026`,
      tipo: 'Ampliatoria',
      instructor: 'S2 PNP RAMIREZ',
      estado: 'Borrador'
    };
    setActuaciones([...actuaciones, newAct]);
  };

  return (
    <div className="flex-1 bg-white overflow-hidden flex flex-col font-serif relative">
      {/* Header Seccionado */}
      <div className="bg-[#f3f4f6] border-b border-black">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-[#000080] p-2 border border-white shadow-[1px_1px_0px_black]">
              <svg className="size-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-[18px] font-bold text-[#000080] uppercase tracking-tighter">Expediente: 2026-00042</h2>
                <span className="bg-[#e7000b] text-white text-[9px] px-2 py-0.5 font-bold animate-pulse">INVESTIGACIÓN ACTIVA</span>
              </div>
              <p className="text-[11px] font-bold text-[#4a5565] uppercase mt-0.5">
                Delito: Contra el Patrimonio - Robo Agravado | Intervenido: Juan Perez Gonzales
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end border-l border-[#d1d5dc] pl-6">
            <span className="text-[9px] font-bold text-[#99a1af] uppercase">Prioridad: ALTA</span>
            <span className="text-[12px] font-bold text-[#e7000b]">FECHA LÍMITE: 17/02/2026</span>
          </div>
        </div>
        
        {/* Sub-tabs de navegación interna */}
        <div className="flex px-4 gap-1">
          {['Información General', 'Diligencias y Actas', 'Evidencias Digitales', 'Consultas Externas'].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase())}
              className={`px-4 py-1 text-[10px] font-bold uppercase border-t border-x border-black/20 rounded-t-sm transition-colors ${
                activeTab === tab.toLowerCase() ? 'bg-white border-b-white border-black/40 -mb-[1px] z-10' : 'bg-[#e5e7eb] hover:bg-[#d1d5dc]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6 space-y-6">
        {/* Vista de Actuaciones (Diligencias) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[13px] font-bold underline uppercase">Historial de Actuaciones Fiscales y Policiales</h3>
            <div className="flex gap-2">
              <button 
                onClick={addDiligencia}
                className="bg-[#009966] text-white px-3 py-1.5 text-[10px] font-bold uppercase border border-black shadow-[inset_1px_1px_0px_rgba(255,255,255,0.3)] hover:bg-[#007a52]"
              >
                + Nueva Diligencia
              </button>
            </div>
          </div>

          <div className="border border-black shadow-[2px_2px_0px_rgba(0,0,0,0.1)]">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#000080] text-white text-[9px] font-bold uppercase">
                <tr>
                  <th className="p-2 border-r border-white/20">Fecha</th>
                  <th className="p-2 border-r border-white/20">Código Doc</th>
                  <th className="p-2 border-r border-white/20">Actuación</th>
                  <th className="p-2 border-r border-white/20">Instructor</th>
                  <th className="p-2">Estado</th>
                </tr>
              </thead>
              <tbody className="text-[11px] font-sans">
                {actuaciones.map((act) => (
                  <tr key={act.id} className="border-b border-[#d1d5dc] hover:bg-[#fefce8]">
                    <td className="p-2 border-r border-[#d1d5dc] whitespace-nowrap">{act.fecha}</td>
                    <td className="p-2 border-r border-[#d1d5dc] font-bold text-[#000080] underline cursor-pointer">{act.doc}</td>
                    <td className="p-2 border-r border-[#d1d5dc]">{act.tipo}</td>
                    <td className="p-2 border-r border-[#d1d5dc]">{act.instructor}</td>
                    <td className="p-2">
                      <span className={`px-2 py-0.5 text-[9px] font-bold uppercase border ${
                        act.estado === 'Digitalizado' ? 'bg-blue-50 text-blue-700 border-blue-400' :
                        act.estado === 'Completado' ? 'bg-green-50 text-green-700 border-green-400' :
                        'bg-gray-100 text-gray-700 border-gray-400'
                      }`}>
                        {act.estado}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Panel de Consultas Rápidas (SIDPOL LAN) */}
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-8 bg-[#f8fafc] border border-black/10 p-4 space-y-4">
            <h3 className="text-[12px] font-bold border-b border-black/10 pb-1 uppercase">Diligencias de Campo y Peritajes</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="border border-[#d1d5dc] p-3 bg-white space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold uppercase text-[#4a5565]">Criminalística</span>
                  <span className="text-[8px] bg-blue-100 text-blue-800 px-1 font-bold">SOLICITADO</span>
                </div>
                <p className="text-[11px] text-[#1e2939] leading-tight">Solicitud de peritaje de absorción atómica y balística (Oficio Nº 112-2026).</p>
                <button className="w-full text-[9px] font-bold uppercase border border-black/20 py-1 hover:bg-[#f3f4f6]">Ver Oficio PDF</button>
              </div>
              <div className="border border-[#d1d5dc] p-3 bg-white space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold uppercase text-[#4a5565]">Declaraciones</span>
                  <span className="text-[8px] bg-green-100 text-green-800 px-1 font-bold">COMPLETO</span>
                </div>
                <p className="text-[11px] text-[#1e2939] leading-tight">Ampliación de declaración del agraviado y toma de manifestación de testigos.</p>
                <button className="w-full text-[9px] font-bold uppercase border border-black/20 py-1 hover:bg-[#f3f4f6]">Ver Acta</button>
              </div>
            </div>
          </div>

          <div className="col-span-4 space-y-4">
            <div className="bg-[#002c22] p-4 text-white space-y-4">
              <h3 className="text-[11px] font-bold border-b border-white/20 pb-1 uppercase">Interoperabilidad (ESINPOL)</h3>
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase text-white/60">Consultar Antecedentes:</label>
                  <div className="flex gap-1">
                    <input type="text" defaultValue="10223344" className="flex-1 bg-black/20 border border-white/20 px-2 py-1 text-xs outline-none" />
                    <button 
                      onClick={() => setShowEsinpol(true)}
                      className="bg-white text-[#002c22] px-2 text-[10px] font-bold uppercase"
                    >
                      OK
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2 border border-white/10 p-2 bg-black/20">
                  <div className="size-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-[9px] font-bold">SIN REQUISITORIA VIGENTE (RQ)</span>
                </div>
              </div>
            </div>

            <div className="bg-[#fef2f2] border border-[#ef4444] p-4">
              <h3 className="text-[11px] font-bold text-[#b91c1c] uppercase border-b border-[#ef4444] pb-1 mb-3">Conclusión Legal</h3>
              <p className="text-[10px] text-[#7f1d1d] font-bold leading-tight mb-4 italic">
                Cierre de expediente por elevación al Ministerio Público. El sistema generará el archivo ZIP de evidencias.
              </p>
              <button className="w-full bg-[#e7000b] text-white py-2.5 text-[11px] font-bold uppercase border border-black shadow-[inset_1px_1px_0px_rgba(255,255,255,0.2)]">
                Emitir Atestado Policial
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Simulado ESINPOL */}
      {showEsinpol && (
        <div className="absolute inset-0 bg-black/40 z-50 flex items-center justify-center p-12">
          <div className="bg-white w-[500px] border-[2px] border-black shadow-[8px_8px_0px_rgba(0,0,0,0.2)] flex flex-col">
            <div className="bg-[#000080] text-white px-3 py-1 flex justify-between items-center">
              <span className="text-[11px] font-bold">SIDPOL - RESULTADO CONSULTA ESINPOL</span>
              <button onClick={() => setShowEsinpol(false)} className="bg-[#c0c0c0] size-4 text-black text-[10px] flex items-center justify-center">X</button>
            </div>
            <div className="p-6 space-y-4">
               <div className="flex gap-4">
                 <div className="size-24 bg-[#e5e7eb] border border-black flex items-center justify-center">
                   <svg className="size-16 text-black/20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M12 11c2.2 0 4-1.8 4-4s-1.8-4-4-4-4 1.8-4 4 1.8 4 4 4zM12 21v-2c0-2.2-1.8-4-4-4H6c-2.2 0-4 1.8-4 4v2" /></svg>
                 </div>
                 <div className="space-y-1">
                   <p className="text-[14px] font-bold underline">JUAN PEREZ GONZALES</p>
                   <p className="text-[10px] font-bold">DNI: 10223344 | EDAD: 34 AÑOS</p>
                   <p className="text-[10px] font-bold text-red-600">ANTECEDENTES: 02 REGISTROS</p>
                 </div>
               </div>
               <div className="border border-black bg-[#fefce8] p-2 text-[10px]">
                 <p><strong>01. 12/05/2021:</strong> HURTO AGRAVADO (COMISARÍA COTABAMBAS)</p>
                 <p><strong>02. 04/09/2023:</strong> LESIONES LEVES (DEPINCRI BREÑA)</p>
               </div>
               <button 
                 onClick={() => setShowEsinpol(false)}
                 className="w-full bg-[#f0f0f0] border border-black py-2 font-bold text-[11px] uppercase"
               >
                 Cerrar e Imprimir Registro
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
