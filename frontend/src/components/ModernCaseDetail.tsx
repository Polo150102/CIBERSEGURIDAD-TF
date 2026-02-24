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
  AlertCircle,
} from "lucide-react";

import { getCaseDetail, createActuation, downloadCargo, downloadEvidence } from "../api/cases";

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
  estado: string;
  detalle?: string; 
};

type EvidenceUI = {
  id: number;
  filename: string;
  size_bytes: number;
  sha256: string;
  created_at: string;
};

type TabId = "actuaciones" | "evidencias" | "actualizar";

export const ModernCaseDetail: React.FC<CaseDetailProps> = ({ caseId, onBack }) => {
  const [activeTab, setActiveTab] = useState<TabId>("actuaciones");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // error exclusivo del tab "Actualizar Denuncia"
  const [updateError, setUpdateError] = useState<string | null>(null);

  const [detail, setDetail] = useState<any>(null);

  // ====== Modal detalle de actuación ======
  const [selectedAct, setSelectedAct] = useState<ActuationUI | null>(null);

  // ====== Estado del TAB "Actualizar Denuncia" ======
  const [updTitulo, setUpdTitulo] = useState("");
  const [updTipo, setUpdTipo] = useState<"ACTA" | "OFICIO" | "CONSULTA" | "EVIDENCIA">("ACTA");
  const [updEstado, setUpdEstado] = useState<"PENDIENTE" | "COMPLETADO" | "DIGITALIZADO">(
    "PENDIENTE"
  );
  const [updDetalle, setUpdDetalle] = useState("");
  const [savingUpdate, setSavingUpdate] = useState(false);

  async function loadDetail() {
    try {
      setError(null);
      setLoading(true);
      const d = await getCaseDetail(caseId);
      setDetail(d);
    } catch (e: any) {
      setError(e?.message || "Error cargando detalle del expediente");
      setDetail(null);
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

  const estadoLabel = (estado: string) => {
    const s = (estado || "").toUpperCase();
    if (s === "PENDIENTE") return "Pendiente";
    if (s === "COMPLETADO") return "Completado";
    if (s === "DIGITALIZADO") return "Digitalizado";
    return estado || "-";
  };

  const estadoIsPending = (estado: string) => (estado || "").toUpperCase() === "PENDIENTE";

  const badgeInvestigacion = () => {
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

  const kb = (bytes: number) => Math.round((Number(bytes || 0) / 1024) * 1) / 1;

  const resetActualizarForm = () => {
    setUpdTitulo("");
    setUpdTipo("ACTA");
    setUpdEstado("PENDIENTE");
    setUpdDetalle("");
    setUpdateError(null);
  };

  const handleIrActualizar = () => {
    setActiveTab("actualizar");
    setUpdateError(null);
    try {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      // ignore
    }
  };

  async function handleGuardarActualizacion() {
    if (updTitulo.trim().length < 4) {
      setUpdateError("El título debe tener al menos 4 caracteres.");
      return;
    }

    try {
      setSavingUpdate(true);
      setUpdateError(null);

      // ✅ Guardar en backend
      await createActuation(caseId, {
        title: updTitulo.trim(),
        type: updTipo,
        status: updEstado,
        detail: updDetalle.trim(), 
      });

      // ✅ Refrescar y volver al historial
      await loadDetail();
      setActiveTab("actuaciones");
      resetActualizarForm();

      try {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch {
        // ignore
      }
    } catch (e: any) {
      // error SOLO del tab actualizar
      setUpdateError(e?.message || "Error guardando la actualización");
    } finally {
      setSavingUpdate(false);
    }
  }

  return (
    <div className="flex-1 bg-white flex flex-col overflow-hidden animate-in fade-in duration-300">
      {/* Header */}
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

              <p className="text-slate-400 text-xs font-medium mt-1">{headerLine()}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={async () => {
                try {
                  setError(null);
                  await downloadCargo(Number(caseId));
                } catch (e: any) {
                  setError(e?.message || "No se pudo descargar el atestado/cargo");
                }
              }}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl text-xs font-bold transition-all border border-white/10"
            >
              <Download size={16} />
              Atestado Completo
            </button>

            <button className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-lg shadow-red-900/20">
              Cerrar Expediente
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-slate-200 px-6 shrink-0">
        <div className="max-w-6xl mx-auto flex gap-8">
          {[
            { id: "actuaciones" as const, label: "Actuaciones y Diligencias", icon: History },
            { id: "evidencias" as const, label: "Evidencias Digitales", icon: FileSearch },
            { id: "actualizar" as const, label: "Actualizar Denuncia", icon: FileText },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                if (tab.id !== "actualizar") setUpdateError(null);
              }}
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

      {/* Content */}
      <div className="flex-1 overflow-y-auto bg-slate-50/50 p-6">
        <div className="max-w-6xl mx-auto space-y-6">
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

          {/* ACTUACIONES */}
          {!loading && !error && activeTab === "actuaciones" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-black text-slate-900 uppercase">Línea de Tiempo del Proceso</h3>

                <button
                  onClick={handleIrActualizar}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md hover:bg-blue-700 transition-all"
                >
                  <Plus size={16} />
                  Actualizar Denuncia
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
                        <td className="px-6 py-4 text-xs font-medium text-slate-600">{act.responsable}</td>
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
                            <button
                              onClick={() => setSelectedAct(act)}
                              className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                              title="Ver detalle"
                            >
                              <ExternalLink size={16} />
                            </button>
                            <button
                              disabled
                              className="p-2 rounded-lg text-slate-300 cursor-not-allowed"
                              title="Descarga no disponible aún"
                            >
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

          {/* EVIDENCIAS */}
          {!loading && !error && activeTab === "evidencias" && (
            <div className="grid grid-cols-3 gap-6">
              {evidencias.map((e) => (
                <div
                  key={e.id}
                  className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-4 hover:border-blue-300 transition-all group"
                >
                  <div className="aspect-video bg-slate-100 rounded-2xl flex items-center justify-center text-slate-300 overflow-hidden relative">
                    <FileText size={48} className="group-hover:scale-110 transition-transform" />
                    <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/10 transition-colors" />
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-xs font-black uppercase text-slate-900 truncate">{e.filename}</h4>
                    <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                      {kb(e.size_bytes)} KB
                    </p>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                    <span className="text-[9px] font-bold text-green-600 flex items-center gap-1">
                      <ShieldCheck size={12} />
                      HASH VERIFICADO
                    </span>
                    <span className="text-[9px] font-mono text-slate-400 truncate max-w-[160px]">{e.sha256}</span>
                  </div>

                  {/* ✅ AQUÍ VA EL BOTÓN DE DESCARGA */}
                  <button
                    onClick={async () => {
                      try {
                        setError(null);
                        await downloadEvidence(caseId, e.id, e.filename);
                      } catch (err: any) {
                        setError(err?.message || "No se pudo descargar la evidencia");
                      }
                    }}
                    className="w-full flex items-center justify-center gap-2 bg-white border border-slate-200 rounded-xl py-2 text-xs font-black uppercase text-slate-700 hover:bg-slate-50"
                    title="Descargar evidencia"
                  >
                    <Download size={16} />
                    Descargar
                  </button>
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

          {/* ACTUALIZAR DENUNCIA */}
          {!loading && !error && activeTab === "actualizar" && (
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="p-6 border-b border-slate-100">
                <h3 className="text-sm font-black text-slate-900 uppercase">Actualizar Denuncia</h3>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  Registra una nueva actuación/diligencia asociada al expediente.
                </p>
              </div>

              <div className="p-6 grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Título de la actuación
                  </label>
                  <input
                    value={updTitulo}
                    onChange={(e) => {
                      setUpdTitulo(e.target.value);
                      if (updateError) setUpdateError(null);
                    }}
                    className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium outline-none focus:border-blue-400"
                    placeholder="Ej: Recepción de declaración / Inspección ocular / Oficio..."
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tipo</label>
                  <select
                    value={updTipo}
                    onChange={(e) => setUpdTipo(e.target.value as any)}
                    className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-bold outline-none focus:border-blue-400"
                  >
                    <option value="ACTA">ACTA</option>
                    <option value="OFICIO">OFICIO</option>
                    <option value="CONSULTA">CONSULTA</option>
                    <option value="EVIDENCIA">EVIDENCIA</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Estado</label>
                  <select
                    value={updEstado}
                    onChange={(e) => setUpdEstado(e.target.value as any)}
                    className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-bold outline-none focus:border-blue-400"
                  >
                    <option value="PENDIENTE">PENDIENTE</option>
                    <option value="COMPLETADO">COMPLETADO</option>
                    <option value="DIGITALIZADO">DIGITALIZADO</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Descripción / Observaciones
                  </label>
                  <textarea
                    value={updDetalle}
                    onChange={(e) => setUpdDetalle(e.target.value)}
                    rows={6}
                    className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium outline-none focus:border-blue-400"
                    placeholder="Escribe el detalle de la diligencia..."
                  />
                </div>

                {updateError && (
                  <div className="col-span-2 bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4 text-sm font-bold flex items-center gap-2">
                    <AlertCircle size={18} />
                    {updateError}
                  </div>
                )}

                <div className="col-span-2 flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => {
                      setActiveTab("actuaciones");
                      resetActualizarForm();
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-bold uppercase border border-slate-200 text-slate-600 hover:bg-slate-50"
                  >
                    Cancelar
                  </button>

                  <button
                    disabled={savingUpdate}
                    onClick={handleGuardarActualizacion}
                    className="px-5 py-2 rounded-xl text-xs font-black uppercase bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-60"
                  >
                    {savingUpdate ? "Guardando..." : "Guardar actualización"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MODAL: Detalle de actuación */}
      {selectedAct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm"
          onClick={() => setSelectedAct(null)} // cerrar al click fuera
        >
          <div
            className="w-full max-w-2xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()} // evita cerrar al click dentro
          >
            {/* Header modal */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  Detalle de actuación
                </p>
                <h3 className="text-lg font-black text-slate-900 leading-tight">
                  {selectedAct.titulo || "-"}
                </h3>

                <div className="flex items-center gap-2 flex-wrap pt-1">
                  <span className="text-[10px] font-black uppercase px-2 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
                    #{selectedAct.id}
                  </span>
                  <span className="text-[10px] font-black uppercase px-2 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
                    {selectedAct.tipo || "-"}
                  </span>
                  <span
                    className={`text-[10px] font-black uppercase px-2 py-1 rounded-lg border ${
                      (selectedAct.estado || "").toUpperCase() === "PENDIENTE"
                        ? "bg-orange-50 text-orange-700 border-orange-200"
                        : (selectedAct.estado || "").toUpperCase() === "COMPLETADO"
                        ? "bg-green-50 text-green-700 border-green-200"
                        : "bg-blue-50 text-blue-700 border-blue-200"
                    }`}
                  >
                    {estadoLabel(selectedAct.estado)}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedAct(null)}
                className="px-4 py-2 rounded-2xl text-xs font-black uppercase bg-slate-900 text-white hover:bg-slate-800 transition"
              >
                Cerrar
              </button>
            </div>

            {/* Body modal */}
            <div className="px-6 py-6 grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Fecha</p>
                <p className="mt-1 text-sm font-black text-slate-900">{selectedAct.fecha || "-"}</p>
              </div>

              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Responsable</p>
                <p className="mt-1 text-sm font-black text-slate-900">{selectedAct.responsable || "-"}</p>
              </div>

              <div className="col-span-2 p-4 rounded-2xl border border-slate-200">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Observaciones
                </p>
                <p className="mt-2 text-sm text-slate-700 font-medium leading-relaxed">
                  {selectedAct.detalle || "—"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};