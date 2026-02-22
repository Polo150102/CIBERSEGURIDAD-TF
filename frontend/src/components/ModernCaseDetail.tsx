import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  FileText,
  Plus,
  History,
  ShieldCheck,
  Clock,
  Download,
  CheckCircle2,
  FileSearch,
  ExternalLink,
  MessageSquare,
  AlertCircle,
} from "lucide-react";

import { getCaseDetail, runExternalQuery } from "../api/cases";

interface CaseDetailProps {
  caseId: string;
  onBack: () => void;
}

type ActuationUI = {
  id: number;
  fecha: string;
  titulo: string;
  responsable: string;
  tipo: string;
  estado: string; // DIGITALIZADO / COMPLETADO / PENDIENTE (desde backend)
};

type EvidenceUI = {
  id: number;
  filename: string;
  size_bytes: number;
  sha256: string;
  created_at: string;
};

export const ModernCaseDetail: React.FC<CaseDetailProps> = ({ caseId, onBack }) => {
  const [activeTab, setActiveTab] = useState("actuaciones");

  const [loading, setLoading] = useState(true);
  const [loadingQuery, setLoadingQuery] = useState<null | "ESINPOL" | "RQ">(null);
  const [error, setError] = useState<string | null>(null);

  const [detail, setDetail] = useState<any>(null);

  async function loadDetail() {
    try {
      setError(null);
      setLoading(true);
      const d = await getCaseDetail(caseId);
      setDetail(d);
    } catch (e: any) {
      setError(e?.message || "Error cargando detalle del expediente");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [caseId]);

  const actuaciones: ActuationUI[] = useMemo(() => detail?.actuations || [], [detail]);
  const evidencias: EvidenceUI[] = useMemo(() => detail?.evidences || [], [detail]);

  // Helpers UI para estado de actuación
  const estadoLabel = (estado: string) => {
    const s = (estado || "").toUpperCase();
    if (s === "PENDIENTE") return "Pendiente";
    if (s === "COMPLETADO") return "Completado";
    if (s === "DIGITALIZADO") return "Digitalizado";
    return estado || "-";
  };

  const estadoIsPending = (estado: string) => (estado || "").toUpperCase() === "PENDIENTE";

  const badgeInvestigacion = () => {
    // puedes mapear según tu backend: SUBMITTED/...
    const s = (detail?.status || "").toUpperCase();
    if (s === "SUBMITTED") return "INVESTIGACIÓN ACTIVA";
    if (s === "DRAFT") return "PENDIENTE DE FIRMA";
    if (s === "CLOSED") return "ELEVADO";
    return "ABIERTO";
  };

  const headerLine = () => {
    const delito = detail?.incident_type || "-";
    const agraviado = detail?.victim || "-";
    const instructor = detail?.instructor || "-";
    return `Delito: ${delito} | Agraviado: ${agraviado} | Instructor: ${instructor}`;
  };

  async function handleExternal(system: "ESINPOL" | "RQ") {
    try {
      setLoadingQuery(system);
      setError(null);
      await runExternalQuery(caseId, system);
      // refresca detalle para que aparezca la actuación nueva
      await loadDetail();
    } catch (e: any) {
      setError(e?.message || `Error ejecutando ${system}`);
    } finally {
      setLoadingQuery(null);
    }
  }

  return (
    <div className="flex-1 bg-white flex flex-col overflow-hidden animate-in fade-in duration-300">
      {/* Detail Header */}
      <div className="bg-slate-900 text-white p-6 shrink-0">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
              <ArrowLeft size={20} />
            </button>

            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-black tracking-tight uppercase">
                  Expediente {detail?.code || caseId}
                </h1>
                <span className="bg-blue-600 text-[10px] font-black px-2 py-0.5 rounded uppercase">
                  {badgeInvestigacion()}
                </span>
              </div>

              <p className="text-slate-400 text-xs font-medium mt-1">
                {headerLine()}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl text-xs font-bold transition-all border border-white/10">
              <Download size={16} />
              Atestado Completo
            </button>
            <button className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-lg shadow-red-900/20">
              Cerrar Expediente
            </button>
          </div>
        </div>
      </div>

      {/* Detail Navigation */}
      <div className="bg-white border-b border-slate-200 px-6 shrink-0">
        <div className="max-w-6xl mx-auto flex gap-8">
          {[
            { id: "actuaciones", label: "Actuaciones y Diligencias", icon: History },
            { id: "evidencias", label: "Evidencias Digitales", icon: FileSearch },
            { id: "interoperabilidad", label: "Consultas Externas", icon: ShieldCheck },
            { id: "notas", label: "Notas del Instructor", icon: MessageSquare },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 py-4 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${
                activeTab === tab.id
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-400 hover:text-slate-600"
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Detail Content */}
      <div className="flex-1 overflow-y-auto bg-slate-50/50 p-6">
        <div className="max-w-6xl mx-auto space-y-6">

          {/* Loading / error */}
          {loading && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 text-sm text-slate-500 font-medium">
              Cargando detalle del expediente...
            </div>
          )}

          {!loading && error && (
            <div className="bg-white rounded-3xl border border-red-200 p-6 text-sm text-red-600 font-bold flex items-center gap-2">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          {!loading && !error && activeTab === "actuaciones" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-black text-slate-900 uppercase">Línea de Tiempo del Proceso</h3>
                <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md hover:bg-blue-700 transition-all">
                  <Plus size={16} />
                  Añadir Actuación
                </button>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                      <th className="px-6 py-4">Fecha y Hora</th>
                      <th className="px-6 py-4">Título de la Actuación</th>
                      <th className="px-6 py-4">Responsable</th>
                      <th className="px-6 py-4">Tipo</th>
                      <th className="px-6 py-4">Estado</th>
                      <th className="px-6 py-4 text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {actuaciones.map((act) => (
                      <tr key={act.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-6 py-4 text-xs font-bold text-slate-500 whitespace-nowrap">
                          {act.fecha}
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-bold text-slate-900">{act.titulo}</p>
                        </td>
                        <td className="px-6 py-4 text-xs font-medium text-slate-600">
                          {act.responsable}
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                            {act.tipo}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5">
                            {estadoIsPending(act.estado) ? (
                              <Clock size={14} className="text-orange-500" />
                            ) : (
                              <CheckCircle2 size={14} className="text-green-500" />
                            )}
                            <span
                              className={`text-[10px] font-bold uppercase ${
                                estadoIsPending(act.estado) ? "text-orange-600" : "text-green-600"
                              }`}
                            >
                              {estadoLabel(act.estado)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-center gap-2">
                            <button className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors">
                              <ExternalLink size={16} />
                            </button>
                            <button className="p-2 hover:bg-slate-100 text-slate-400 rounded-lg transition-colors">
                              <Download size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {actuaciones.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-sm text-slate-500 font-medium">
                          No hay actuaciones registradas aún.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {!loading && !error && activeTab === "evidencias" && (
            <div className="grid grid-cols-3 gap-6">
              {evidencias.map((e) => (
                <div key={e.id} className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-4 hover:border-blue-300 transition-all group">
                  <div className="aspect-video bg-slate-100 rounded-2xl flex items-center justify-center text-slate-300 overflow-hidden relative">
                    <FileText size={48} className="group-hover:scale-110 transition-transform" />
                    <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/10 transition-colors" />
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-xs font-black uppercase text-slate-900 truncate">{e.filename}</h4>
                    <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                      {(Math.round((e.size_bytes || 0) / 1024))} KB
                    </p>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                    <span className="text-[9px] font-bold text-green-600 flex items-center gap-1">
                      <ShieldCheck size={12} />
                      HASH VERIFICADO
                    </span>
                    <span className="text-[9px] font-mono text-slate-400 truncate max-w-[160px]">
                      {e.sha256}
                    </span>
                  </div>
                </div>
              ))}

              {evidencias.length === 0 && (
                <div className="col-span-3 bg-white rounded-3xl border border-slate-200 p-6 text-sm text-slate-500 font-medium">
                  No hay evidencias registradas para este expediente.
                </div>
              )}

              <button className="border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center p-8 gap-3 text-slate-400 hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50/30 transition-all">
                <Plus size={32} />
                <span className="text-xs font-bold uppercase tracking-widest">Cargar Nueva Evidencia</span>
              </button>
            </div>
          )}

          {!loading && !error && activeTab === "interoperabilidad" && (
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden">
              <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <ShieldCheck size={24} className="text-blue-400" />
                  <div>
                    <h3 className="font-black text-sm uppercase tracking-tight">Pasarela de Interoperabilidad PNP</h3>
                    <p className="text-[10px] text-slate-400 font-medium">Conexión encriptada con bases de datos externas</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold bg-green-500/20 text-green-400 px-3 py-1 rounded-full uppercase">
                  Sistemas Online
                </span>
              </div>

              <div className="p-8 grid grid-cols-2 gap-8">
                <div className="p-6 border border-slate-100 rounded-2xl bg-slate-50 space-y-4">
                  <h4 className="text-xs font-black text-slate-900 uppercase">Consulta de Antecedentes (ESINPOL)</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Verificación masiva en bases de datos de antecedentes penales, judiciales y policiales a nivel nacional.
                  </p>

                  <button
                    disabled={loadingQuery === "ESINPOL"}
                    onClick={() => handleExternal("ESINPOL")}
                    className="w-full bg-slate-900 text-white py-3 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-all disabled:opacity-60"
                  >
                    {loadingQuery === "ESINPOL" ? "Ejecutando..." : "Ejecutar Verificación"}
                  </button>
                </div>

                <div className="p-6 border border-slate-100 rounded-2xl bg-slate-50 space-y-4">
                  <h4 className="text-xs font-black text-slate-900 uppercase">Búsqueda de Requisitorias (RQ)</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Cruce de información con el departamento de requisitorias para identificar órdenes de captura vigentes.
                  </p>

                  <button
                    disabled={loadingQuery === "RQ"}
                    onClick={() => handleExternal("RQ")}
                    className="w-full bg-slate-900 text-white py-3 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-all disabled:opacity-60"
                  >
                    {loadingQuery === "RQ" ? "Consultando..." : "Consultar RQ"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "notas" && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 text-sm text-slate-500 font-medium">
              (Pendiente) Notas del instructor — aquí puedes luego conectar a backend si tu informe lo pide.
            </div>
          )}

        </div>
      </div>
    </div>
  );
};