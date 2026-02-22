import React, { useEffect, useRef, useState } from "react";
import {
  User,
  MapPin,
  Clock,
  Upload,
  Check,
  ChevronRight,
  ArrowLeft,
  Search,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  X,
  FileIcon,
  HardDrive,
  CheckCircle,
  Paperclip,
} from "lucide-react";
import { createCase, uploadEvidence, validateDni, submitCase, downloadCargo } from "../api/cases";

import { toast } from "sonner";

type UIFile = {
  file: File;
  status: "PENDIENTE" | "SUBIENDO" | "SUBIDO" | "ERROR";
  sha256?: string;
  error?: string;
};

export const ModernRegistration: React.FC = () => {
  const [step, setStep] = useState(1);
  const SESSION_LIMIT = 600; // 10 minutos
  const [remaining, setRemaining] = useState(SESSION_LIMIT);

  // Identidad
  const [dni, setDni] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifiedData, setVerifiedData] = useState<any>(null);

  // Caso
  const [title] = useState("DENUNCIA");
  const [description, setDescription] = useState("");
  const [caseId, setCaseId] = useState<number | null>(null);

  // Evidencias (archivos reales)
  const [files, setFiles] = useState<UIFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // UI/estado
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [integrityHash, setIntegrityHash] = useState<string | null>(null);

  // Paso 2
  const [incidentType, setIncidentType] = useState("ROBO AGRAVADO");
  const [location, setLocation] = useState("");


  useEffect(() => {
    const t = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(t);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(t);
  }, []);

  useEffect(() => {

    if (isSuccess) return;

    if (remaining === 0) {
      setErrorMsg("Sesión expirada por seguridad. Inicie el registro nuevamente.");
      setStep(1);
      setVerifiedData(null);
      setCaseId(null);
      setDescription("");
      setFiles([]);
      setDni("");
      setLocation("");
      setIncidentType("ROBO AGRAVADO");
      setRemaining(SESSION_LIMIT);
    }
  }, [remaining, isSuccess]);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const steps = [
    { id: 1, label: "Identidad", icon: User },
    { id: 2, label: "Detalle Suceso", icon: MapPin },
    { id: 3, label: "Evidencias", icon: Upload },
    { id: 4, label: "Confirmación", icon: Check },
  ];

  const handleVerify = async () => {
    setErrorMsg(null);

    const clean = dni.trim();
    if (!/^\d{8}$/.test(clean)) {
      setVerifiedData(null);
      setErrorMsg("DNI inválido: debe tener 8 dígitos.");
      return;
    }

    setIsVerifying(true);
    try {
      const resp = await validateDni(clean);
      setVerifiedData(resp.data);
    } catch (e: any) {
      setVerifiedData(null);

      const msg = e?.message || "No se pudo validar la identidad.";

      if (msg.includes("429") || msg.toLowerCase().includes("demasiados intentos")) {
        setErrorMsg("Demasiados intentos. Bloqueo temporal activado por seguridad (HTTP 429).");
      } else {
        setErrorMsg(msg);
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    const mb = kb / 1024;
    return `${mb.toFixed(1)} MB`;
  };

  const openFilePicker = () => fileInputRef.current?.click();

  const onPickFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.target.files || []);
    if (picked.length === 0) return;

    setFiles((prev) => {
      const existing = new Set(prev.map((x) => `${x.file.name}-${x.file.size}`));
      const toAdd: UIFile[] = [];
      for (const f of picked) {
        const key = `${f.name}-${f.size}`;
        if (!existing.has(key)) {
          toAdd.push({ file: f, status: "PENDIENTE" });
        }
      }
      return [...prev, ...toAdd];
    });

    e.target.value = "";
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Step 2 -> crear caso
  const handleCreateCase = async () => {
    setErrorMsg(null);

    if (!verifiedData) {
      setErrorMsg("Primero verifica el DNI con RENIEC.");
      return;
    }

    if (!location.trim()) {
      setErrorMsg("Completa el lugar del suceso.");
      return;
    }

    if (!description.trim()) {
      setErrorMsg("Completa el relato detallado de los hechos.");
      return;
    }

    setIsSubmitting(true);

    try {
      const c = await createCase({
        dni: verifiedData?.dni || dni,
        incident_type: incidentType,
        location: location.trim(),
        description: description.trim(),
      });

      console.log("createCase response:", c);

      const newId = c?.id ?? c?.case_id ?? c?.data?.id ?? c?.data?.case_id;

      if (!newId) {
        console.error("Respuesta sin id:", c);
        throw new Error("El backend no devolvió ID del caso (respuesta vacía o formato inesperado).");
      }

      setCaseId(Number(newId));
      setStep(3);

    } catch (err: any) {
      setErrorMsg(err?.message || "Error creando el caso");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 3 -> subir evidencias
  const handleUploadAll = async () => {
    setErrorMsg(null);

    if (!caseId) {
      setErrorMsg("No existe un caso aún. Regresa al paso anterior.");
      return;
    }

    if (files.length === 0) {
      setStep(4);
      return;
    }

    setIsSubmitting(true);
    try {
      setFiles((prev) => prev.map((x) => ({ ...x, status: "SUBIENDO", error: undefined })));

      for (let i = 0; i < files.length; i++) {
        const f = files[i];
        try {
          const ev = await uploadEvidence(caseId, f.file);
          setFiles((prev) =>
            prev.map((x, idx) => (idx === i ? { ...x, status: "SUBIDO", sha256: ev.sha256 } : x))
          );
        } catch (e: any) {
          setFiles((prev) =>
            prev.map((x, idx) => (idx === i ? { ...x, status: "ERROR", error: e?.message || "Error" } : x))
          );
        }
      }

      setStep(4);
    } catch (err: any) {
      setErrorMsg(err?.message || "Error subiendo evidencias");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 4 -> confirmar
  const handleFinalSubmit = async () => {
    if (!caseId) {
      toast.error("No se encontró el expediente");
      return;
    }

    try {
      setIsSubmitting(true);

      const result = await submitCase(caseId);

      setIntegrityHash(result.case_integrity_hash);

      toast.success("Denuncia registrada correctamente");

      setIsSuccess(true);
    } catch (err: any) {
      toast.error(err.message || "Error al confirmar el registro");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 p-12 text-center animate-in zoom-in-95 duration-500">
        <div className="size-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-8 shadow-xl shadow-green-100 ring-8 ring-green-50">
          <CheckCircle2 size={48} />
        </div>

        <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-4">
          Registro Exitoso
        </h2>

        <div className="max-w-md bg-white border border-slate-200 rounded-3xl p-8 shadow-sm mb-8">
          <p className="text-slate-500 font-medium mb-6">
            La denuncia ha sido formalizada y se ha generado el número de expediente único para el seguimiento institucional.
          </p>

          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
              Expediente Nº
            </span>
            <span className="text-xl font-black text-blue-600 tracking-tighter">
              {caseId ? `2026-${String(caseId).padStart(5, "0")}` : "—"}
            </span>
          </div>

          {integrityHash && (
            <div className="mt-4 p-3 rounded-2xl bg-green-50 border border-green-200 text-left overflow-hidden">
              <p className="text-[10px] font-black uppercase text-green-700 tracking-widest">
                Integridad del expediente (SHA-256)
              </p>
              <p className="mt-1 text-[11px] font-mono break-all leading-4 text-green-900">
                {integrityHash}
              </p>
            </div>
          )}
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              resetRegistration();
            }}
            className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all"
          >
            NUEVO REGISTRO
          </button>

          <button
            type="button"
            onClick={async (e) => {
              e.preventDefault();
              e.stopPropagation();
              try {
                if (!caseId) {
                  toast.error("No se encontró el expediente");
                  return;
                }
                await downloadCargo(caseId);
                toast.success("Cargo generado y descargado");
              } catch (err: any) {
                toast.error(err?.message || "No se pudo imprimir el cargo");
              }
            }}
            className="px-8 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all"
          >
            IMPRIMIR CARGO
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-white overflow-y-auto">
      <div className="max-w-4xl mx-auto py-12 px-8">
        <div className="mb-12 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2 uppercase">
              Registro de Nueva Denuncia
            </h1>
            <p className="text-slate-500 font-medium italic">
              Siga los pasos para formalizar la denuncia institucional del ciudadano.
            </p>
          </div>
          <div className="bg-blue-50 px-4 py-2 rounded-xl border border-blue-100 flex items-center gap-2">
            <Clock size={16} className="text-blue-600" />
            <span
              className={`text-[10px] font-black uppercase tracking-widest ${
                remaining <= 120 ? "text-red-600 animate-pulse" : "text-blue-700"
              }`}
            >
              Tiempo restante: {formatTime(remaining)}
            </span>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3">
            <AlertCircle className="text-red-600 mt-0.5" size={18} />
            <div>
              <p className="text-xs font-black uppercase text-red-700">Error</p>
              <p className="text-sm text-red-600 font-medium">{errorMsg}</p>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-12 relative px-4">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 z-0" />
          {steps.map((s) => (
            <div key={s.id} className="relative z-10 flex flex-col items-center">
              <div
                className={`size-12 rounded-2xl flex items-center justify-center transition-all shadow-md ${
                  step >= s.id
                    ? "bg-blue-600 text-white shadow-blue-200"
                    : "bg-white text-slate-400 border border-slate-200"
                }`}
              >
                {step > s.id ? <Check size={20} /> : <s.icon size={20} />}
              </div>
              <span
                className={`text-[10px] font-black uppercase mt-3 tracking-wider ${
                  step >= s.id ? "text-blue-600" : "text-slate-400"
                }`}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>

        <div className="bg-slate-50/50 border border-slate-200 rounded-3xl p-8 shadow-sm">
          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-widest ml-1">
                    Documento de Identidad (DNI)
                  </label>

                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        type="text"
                        value={dni}
                        onChange={(e) => {
                          setDni(e.target.value);
                          setVerifiedData(null);
                          setErrorMsg(null);
                        }}
                        placeholder="Ingrese DNI"
                        className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all outline-none text-sm font-bold"
                      />
                    </div>

                    <button
                      onClick={handleVerify}
                      disabled={!dni || isVerifying}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold text-xs disabled:opacity-50 transition-all shadow-md active:scale-95"
                    >
                      {isVerifying ? "VERIFICANDO..." : "RENIEC"}
                    </button>
                  </div>

                  <div className="flex items-center gap-2 mt-1 px-1">
                    <CheckCircle2 size={12} className="text-green-500" />
                    <span className="text-[10px] font-bold text-green-600 uppercase">
                      Integración RENIEC Activa • AES-256
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-6 bg-slate-900 rounded-2xl text-white shadow-xl shadow-slate-200 relative overflow-hidden">
                    <div className="relative z-10">
                      <p className="text-[10px] font-black uppercase opacity-40 mb-1">
                        Operador Responsable
                      </p>
                      <p className="text-sm font-bold">GARCIA, S1 PNP</p>
                      <p className="text-[10px] font-medium opacity-60">
                        CIP: 31224567 • Comisaría Breña
                      </p>
                    </div>
                    <ShieldCheck size={80} className="absolute -bottom-4 -right-4 opacity-10" />
                  </div>
                </div>
              </div>

              {verifiedData && (
                <div className="grid grid-cols-2 gap-6 p-6 bg-white border border-slate-200 rounded-2xl shadow-sm animate-in zoom-in-95 duration-300">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase">Nombres</p>
                    <p className="text-sm font-bold text-slate-900">{verifiedData.nombres}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase">Apellidos</p>
                    <p className="text-sm font-bold text-slate-900">{verifiedData.apellidos}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase">
                      Fecha de Nacimiento
                    </p>
                    <p className="text-sm font-bold text-slate-900">{verifiedData.nacimiento}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase">
                      Identidad Verificada
                    </p>
                    <div className="flex items-center gap-1.5 text-green-600">
                      <CheckCircle size={14} />
                      <span className="text-[10px] font-black uppercase">Ciudadano Identificado</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-6 animate-in slide-in-from-right duration-300">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-widest">
                    Tipo de Incidente
                  </label>
                  <select
                    value={incidentType}
                    onChange={(e) => setIncidentType(e.target.value)}
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                  >
                    <option value="ROBO AGRAVADO">ROBO AGRAVADO</option>
                    <option value="HURTO SIMPLE">HURTO SIMPLE</option>
                    <option value="MICROCOMERCIALIZACIÓN">MICROCOMERCIALIZACIÓN</option>
                    <option value="VIOLENCIA FAMILIAR">VIOLENCIA FAMILIAR</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-widest">
                    Lugar del Suceso
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Calle, Jirón o Referencia..."
                      className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-widest">
                  Relato Detallado de los Hechos
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describa cronológicamente lo sucedido..."
                  rows={6}
                  className="w-full p-4 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="space-y-6 animate-in slide-in-from-right duration-300">
              <div className="border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center bg-white hover:border-blue-400 transition-all group">
                <div className="size-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Upload size={32} />
                </div>
                <h3 className="text-lg font-black text-slate-900 uppercase mb-2">
                  Cargar Documentos y Multimedia
                </h3>
                <p className="text-sm text-slate-400 font-medium mb-6">
                  Seleccione archivos desde su equipo.
                  <br />
                  Formatos permitidos: PDF, JPG, PNG, MP4.
                </p>

                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={onPickFiles}
                  accept=".pdf,.jpg,.jpeg,.png,.mp4"
                />

                <button
                  onClick={openFilePicker}
                  className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
                >
                  Seleccionar Archivos
                </button>
              </div>

              <div className="space-y-3">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Paperclip size={12} />
                  Archivos Cargados ({files.length})
                </h4>

                <div className="space-y-2">
                  {files.length === 0 ? (
                    <div className="p-4 bg-slate-100/50 rounded-2xl text-center border border-slate-200 border-dashed">
                      <p className="text-[10px] text-slate-400 font-bold uppercase">
                        No se han adjuntado evidencias adicionales
                      </p>
                    </div>
                  ) : (
                    files.map((x, idx) => (
                      <div
                        key={`${x.file.name}-${x.file.size}-${idx}`}
                        className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-2xl shadow-sm animate-in fade-in duration-300"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                            <FileIcon size={18} />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-900">{x.file.name}</p>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-[9px] text-slate-400 font-bold">
                                {formatBytes(x.file.size)}
                              </span>

                              {x.status === "PENDIENTE" && (
                                <span className="text-[9px] text-slate-500 font-bold uppercase">
                                  Pendiente
                                </span>
                              )}
                              {x.status === "SUBIENDO" && (
                                <span className="text-[9px] text-blue-600 font-bold uppercase flex items-center gap-1">
                                  <ShieldCheck size={10} />
                                  Subiendo...
                                </span>
                              )}
                              {x.status === "SUBIDO" && (
                                <span className="text-[9px] text-green-600 font-bold uppercase flex items-center gap-1">
                                  <ShieldCheck size={10} />
                                  Verificado (SHA-256)
                                </span>
                              )}
                              {x.status === "ERROR" && (
                                <span className="text-[9px] text-red-600 font-bold uppercase">
                                  Error
                                </span>
                              )}

                              {x.sha256 && (
                                <span className="text-[9px] text-slate-500 font-mono">
                                  {x.sha256.slice(0, 10)}…
                                </span>
                              )}
                            </div>

                            {x.error && (
                              <p className="text-[10px] text-red-600 mt-1">{x.error}</p>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={() => removeFile(idx)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <div className="space-y-8 animate-in slide-in-from-right duration-300">
              <div className="bg-blue-600 rounded-3xl p-8 text-white relative overflow-hidden">
                <div className="relative z-10 space-y-4">
                  <div className="flex items-center gap-3">
                    <ShieldCheck size={28} />
                    <h3 className="text-xl font-black uppercase tracking-tight">
                      Resumen de la Denuncia
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-8 border-t border-white/20 pt-6">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase opacity-60 tracking-widest">
                        Denunciante
                      </p>
                      <p className="text-lg font-black uppercase">
                        {verifiedData?.nombres} {verifiedData?.apellidos}
                      </p>
                      <p className="text-xs font-medium opacity-80 italic">
                        DNI: {verifiedData?.dni || dni}
                      </p>
                      {caseId && (
                        <p className="text-xs font-black opacity-90">
                          Expediente: 2026-{String(caseId).padStart(5, "0")}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase opacity-60 tracking-widest">
                        Operador
                      </p>
                      <p className="text-lg font-black uppercase text-blue-200">S1 PNP GARCIA</p>
                      <p className="text-xs font-medium opacity-80 italic">Comisaría Breña</p>
                    </div>
                  </div>
                </div>
                <HardDrive size={120} className="absolute -bottom-8 -right-8 opacity-10" />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">
                    Información del Suceso
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500">Delito</span>
                      <span className="font-black text-slate-900 uppercase">
                        {incidentType}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500">Lugar</span>
                      <span className="font-black text-slate-900 uppercase">
                        {location || "—"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500">Relato</span>
                      <span className="font-black text-slate-900 uppercase">
                        {description ? "COMPLETO" : "—"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">
                    Archivos Adjuntos
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500">Total Evidencias</span>
                      <span className="font-black text-slate-900 uppercase">
                        {files.length} ARCHIVOS
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500">Integridad</span>
                      <span className="font-black text-green-600 uppercase flex items-center gap-1">
                        <CheckCircle2 size={12} /> OK
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-red-50 border border-red-100 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-red-700">
                  <AlertCircle size={18} />
                  <h4 className="text-xs font-black uppercase">Declaración Jurada</h4>
                </div>
                <p className="text-[11px] text-red-600 leading-relaxed italic">
                  Certifico que la información consignada en el presente registro es veraz y ha sido validada según los
                  protocolos de atención al ciudadano.
                </p>
              </div>

              {integrityHash && (
                <div className="mt-4 p-3 rounded-md bg-green-50 border border-green-200 text-sm">
                  <p className="font-semibold text-green-700">
                    Integridad del expediente (SHA-256)
                  </p>
                  <p className="font-mono break-all text-green-900">
                    {integrityHash}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-10 flex justify-between">
          <button
            onClick={() => step > 1 && setStep(step - 1)}
            disabled={step === 1 || isSubmitting}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${
              step === 1 ? "opacity-0 pointer-events-none" : "text-slate-500 hover:bg-slate-100"
            }`}
          >
            <ArrowLeft size={18} />
            ANTERIOR
          </button>

          <button
            onClick={() => {
              if (isSubmitting) return;

              if (step === 1) {
                if (!verifiedData) {
                  setErrorMsg("Verifica el DNI con RENIEC antes de continuar.");
                  return;
                }
                setStep(2);
                return;
              }

              if (step === 2) {
                handleCreateCase();
                return;
              }

              if (step === 3) {
                handleUploadAll();
                return;
              }

              if (step === 4) {
                handleFinalSubmit();
                return;
              }
            }}
            disabled={isSubmitting || (step === 4 && isSuccess)}
            className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-sm transition-all shadow-lg active:scale-95 ${
              step === 4
                ? "bg-green-600 hover:bg-green-700 text-white shadow-green-100"
                : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-100"
            }`}
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                PROCESANDO...
              </div>
            ) : (
              <>
                {step === 4 ? "CONFIRMAR REGISTRO" : step === 3 ? "SUBIR Y CONTINUAR" : "CONTINUAR"}
                <ChevronRight size={18} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};