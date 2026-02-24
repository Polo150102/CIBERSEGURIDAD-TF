import React, { useMemo, useState } from "react";
import { Database, Fingerprint, Search, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { runExternalQuery } from "../api/cases";

type System = "ESINPOL" | "RQ";

interface Props {
  system: System;
}

export const ModernIntelligenceQuery: React.FC<Props> = ({ system }) => {
  const [caseId, setCaseId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  const title = useMemo(() => {
    return system === "ESINPOL" ? "Consultas ESINPOL" : "Requisitorias (RQ)";
  }, [system]);

  const Icon = system === "ESINPOL" ? Database : Fingerprint;

  const onRun = async () => {
    const id = caseId.trim();
    if (!id) {
      setError("Ingresa el ID del expediente (caseId). Por ejemplo: 1, 2, 15...");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setResult(null);
      const data = await runExternalQuery(id, system);
      setResult(data);
    } catch (e: any) {
      setError(e?.message || "No se pudo ejecutar la consulta externa");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 bg-slate-50 overflow-y-auto">
      <div className="p-8 space-y-6 max-w-5xl mx-auto">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-2xl bg-blue-50 text-blue-700 border border-blue-100 flex items-center justify-center">
                <Icon size={20} />
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">
                {title}
              </h1>
            </div>
            <p className="text-slate-500 font-medium mt-2">
              Ejecuta una consulta externa asociada a un expediente.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Search className="text-slate-400" size={18} />
              <h3 className="font-bold text-slate-900 uppercase tracking-tight">
                Ejecutar consulta por ID
              </h3>
            </div>
          </div>

          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3 items-center">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                  ID Expediente (caseId)
                </label>
                <input
                  value={caseId}
                  onChange={(e) => setCaseId(e.target.value)}
                  placeholder="Ej: 1"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>

              <button
                onClick={onRun}
                disabled={loading}
                className="h-12 px-6 rounded-2xl text-sm font-black uppercase tracking-tight shadow-lg shadow-blue-100 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    Consultando...
                  </>
                ) : (
                  <>Ejecutar</>
                )}
              </button>
            </div>

            {error && (
              <div className="flex items-start gap-2 p-4 rounded-2xl bg-red-50 border border-red-100 text-red-700">
                <AlertCircle size={18} className="mt-0.5" />
                <div>
                  <p className="font-black text-xs uppercase">Error</p>
                  <p className="text-sm font-medium mt-1 whitespace-pre-wrap">{error}</p>
                </div>
              </div>
            )}

            {result && (
              <div className="p-4 rounded-2xl bg-green-50 border border-green-100">
                <div className="flex items-center gap-2 text-green-700">
                  <CheckCircle2 size={18} />
                  <p className="font-black text-xs uppercase">Respuesta</p>
                </div>
                <pre className="mt-3 text-xs text-slate-700 bg-white/70 border border-slate-200 rounded-2xl p-4 overflow-auto">
{JSON.stringify(result, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};