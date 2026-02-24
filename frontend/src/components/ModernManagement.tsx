import React, { useEffect, useState } from "react";
import {
  FileText,
  Search,
  Filter,
  ExternalLink,
  Download,
  CheckCircle2,
  ShieldAlert,
  MoreHorizontal,
  TrendingUp,
} from "lucide-react";

interface ModernManagementProps {
  onSelectCase: (id: string) => void;
}

type DashboardResponse = {
  stats?: {
    abiertos?: number;
    investigacion?: number;
    elevados?: number;
    pendientes_firma?: number;
  };
  recent_cases?: Array<{
    id: number;
    code: string;
    date: string;
    type: string;
    victim: string;
    status: string;
    priority: string;
  }>;
  page?: number;
  page_size?: number;
  total?: number;
  total_pages?: number;
};

export const ModernManagement: React.FC<ModernManagementProps> = ({ onSelectCase }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [stats, setStats] = useState([
    { label: "Expedientes Abiertos", value: "0", icon: FileText, color: "text-blue-600", bg: "bg-blue-100" },
    { label: "En Investigación", value: "0", icon: Search, color: "text-orange-600", bg: "bg-orange-100" },
    { label: "Elevados a Fiscalía", value: "0", icon: CheckCircle2, color: "text-green-600", bg: "bg-green-100" },
    { label: "Pendientes de Firma", value: "0", icon: ShieldAlert, color: "text-red-600", bg: "bg-red-100" },
  ]);

  const [recentCases, setRecentCases] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // ✅ SOLO EN ESTA SECCIÓN:
  // Probamos varias URLs porque muchas veces el .env apunta mal (localhost vs backend en docker)
  function getApiBaseCandidates() {
    const envUrl = (import.meta as any)?.env?.VITE_API_URL as string | undefined;

    // Normaliza por si viene con / final
    const clean = (u: string) => u.replace(/\/+$/, "");

    const candidates = [
      envUrl ? clean(envUrl) : "",
      "http://backend:8000",     // docker-compose típico
      "http://localhost:8000",   // dev local típico
      "http://127.0.0.1:8000",
    ].filter(Boolean) as string[];

    // Evita duplicados
    return Array.from(new Set(candidates));
  }

  async function fetchDashboardWithFallback(p: number, ps: number): Promise<DashboardResponse> {
    const token = localStorage.getItem("token") || "";
    const headers: Record<string, string> = {};
    if (token) headers.Authorization = `Bearer ${token}`;

    const candidates = getApiBaseCandidates();
    const path = `/cases/management/dashboard?page=${p}&page_size=${ps}`;

    let lastErr = "";

    for (const base of candidates) {
      try {
        const res = await fetch(`${base}${path}`, { method: "GET", headers });
        const rawText = await res.text().catch(() => "");

        // Intentamos parsear JSON siempre
        let data: any = {};
        try {
          data = rawText ? JSON.parse(rawText) : {};
        } catch {
          data = { _raw: rawText };
        }

        if (!res.ok) {
          const msg =
            typeof data?.detail === "string"
              ? data.detail
              : (data?._raw ? String(data._raw).slice(0, 120) : `HTTP ${res.status}`);

          lastErr = `(${base}) ${msg}`;
          continue; // probamos el siguiente
        }

        // ✅ ok
        return data as DashboardResponse;
      } catch (e: any) {
        lastErr = `(${base}) ${e?.message || "Error de red"}`;
        continue;
      }
    }

    // Si llegamos aquí, fallaron todas las URLs
    throw new Error(
      lastErr ||
        "No se pudo conectar al backend desde 'Ver expedientes'. Revisa API URL / Docker / CORS."
    );
  }

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        if (!mounted) return;
        setLoading(true);
        setError(null);

        const dash = await fetchDashboardWithFallback(page, pageSize);
        if (!mounted) return;

        const recent = dash.recent_cases || [];
        setRecentCases(recent);

        setTotal(dash.total || 0);
        setTotalPages(dash.total_pages || 1);

        setStats([
          { label: "Expedientes Abiertos", value: String(dash.stats?.abiertos ?? 0), icon: FileText, color: "text-blue-600", bg: "bg-blue-100" },
          { label: "En Investigación", value: String(dash.stats?.investigacion ?? 0), icon: Search, color: "text-orange-600", bg: "bg-orange-100" },
          { label: "Elevados a Fiscalía", value: String(dash.stats?.elevados ?? 0), icon: CheckCircle2, color: "text-green-600", bg: "bg-green-100" },
          { label: "Pendientes de Firma", value: String(dash.stats?.pendientes_firma ?? 0), icon: ShieldAlert, color: "text-red-600", bg: "bg-red-100" },
        ]);
      } catch (e: any) {
        if (!mounted) return;
        setError(e?.message || "Error cargando gestión");
        setRecentCases([]);
        setTotal(0);
        setTotalPages(1);
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [page]);

  return (
    <div className="flex-1 bg-slate-50 overflow-y-auto">
      <div className="p-8 space-y-8 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Gestión de Expedientes</h1>
            <p className="text-slate-500 font-medium">Control administrativo de diligencias y actuaciones policiales.</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-xl text-sm font-bold text-slate-600 shadow-sm hover:bg-slate-50">
              <Download size={18} />
              Exportar Reporte
            </button>
            <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-xl text-sm font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all">
              + Nuevo Expediente
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg ${s.bg} ${s.color}`}>
                  <s.icon size={20} />
                </div>
                <span className="flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                  <TrendingUp size={12} />
                  +2.4%
                </span>
              </div>
              <h3 className="text-3xl font-black text-slate-900">{s.value}</h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Main Table Section */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold text-slate-900 uppercase tracking-tight">Expedientes Recientes</h3>
            <div className="flex gap-2">
              <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
                <Filter size={18} />
              </button>
              <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
                <Search size={18} />
              </button>
            </div>
          </div>

          {loading && <div className="p-6 text-sm text-slate-500 font-medium">Cargando expedientes...</div>}

          {/* ✅ Ahora SIEMPRE verás el error en pantalla (ya no “blanco”) */}
          {error && (
            <div className="p-6 text-sm text-red-600 font-bold">
              {error}
              <div className="mt-2 text-xs text-slate-500 font-medium">
                Tip: esta sección prueba VITE_API_URL, backend:8000 y localhost:8000 automáticamente.
              </div>
            </div>
          )}

          {/* Tabla */}
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <th className="px-6 py-4">ID Expediente</th>
                <th className="px-6 py-4">Tipo de Delito</th>
                <th className="px-6 py-4">Agraviado / Víctima</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4">Prioridad</th>
                <th className="px-6 py-4 text-center">Acciones</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {recentCases.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-900">{c.code}</span>
                      <span className="text-[10px] text-slate-400 font-medium">{c.date}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-slate-600">{c.type}</td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-700">{c.victim}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-[10px] font-black uppercase px-2 py-1 rounded-lg ${
                        c.status === "Investigación"
                          ? "bg-blue-50 text-blue-600"
                          : c.status === "Elevado"
                          ? "bg-green-50 text-green-600"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      <div
                        className={`size-2 rounded-full ${
                          c.priority === "ALTA"
                            ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"
                            : c.priority === "NORMAL"
                            ? "bg-orange-500"
                            : "bg-slate-400"
                        }`}
                      />
                      <span className="text-[10px] font-bold text-slate-500 uppercase">{c.priority}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onSelectCase(String(c.id))}
                        className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                        title="Ver Detalle"
                      >
                        <ExternalLink size={16} />
                      </button>
                      <button className="p-2 hover:bg-slate-100 text-slate-600 rounded-lg transition-colors">
                        <MoreHorizontal size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {/* ✅ Estado vacío claro (en vez de “blanco”) */}
              {!loading && !error && recentCases.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-sm text-slate-500 font-medium">
                    No hay expedientes para mostrar.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="p-4 border-t border-slate-100 bg-slate-50/30 flex justify-between items-center px-6">
            <span className="text-xs text-slate-500 font-medium">
              Mostrando {recentCases.length} de {total} resultados
            </span>

            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`px-3 py-1 border rounded-lg text-xs font-bold shadow-sm transition-all ${
                    p === page ? "bg-white border-slate-200" : "bg-white border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};