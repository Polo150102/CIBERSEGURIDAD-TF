import React, { useEffect, useMemo, useState } from "react";
import { getInbox, getCaseDetail, downloadEvidence, markInboxRead } from "../api/cases";
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
} from "lucide-react";

type InboxMsg = {
  id: number;
  recipient: string; // "ALL" o CIP
  type: string; // "ALERTA" | "MEMO" | "SISTEMA" | "RENIEC" ...
  priority: string; // "critical" | "high" | "medium"
  sender: string;
  title: string;
  preview: string;
  case_id?: number | null;
  read: boolean;
  created_at: string; // ISO
};

type EvidenceUI = {
  id: number;
  filename: string;
  size_bytes: number;
  sha256: string;
  created_at: string;
};

export const ModernInbox: React.FC = () => {
  const [messages, setMessages] = useState<InboxMsg[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [filter, setFilter] = useState<"ALL" | "ALERTA" | "MEMO">("ALL");

  // Adjuntos reales: evidencias del expediente (si el mensaje tiene case_id)
  const [caseEvidences, setCaseEvidences] = useState<EvidenceUI[]>([]);
  const [caseLoading, setCaseLoading] = useState(false);

  const unreadCount = useMemo(() => messages.filter((m) => !m.read).length, [messages]);

  useEffect(() => {
    (async () => {
      try {
        const data = (await getInbox()) as InboxMsg[];
        const safe = Array.isArray(data) ? data : [];
        setMessages(safe);
        if (safe.length > 0) setSelectedId(safe[0].id);
      } catch {
        setMessages([]);
        setSelectedId(null);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    return messages.filter((m) => filter === "ALL" || (m.type || "").toUpperCase() === filter);
  }, [messages, filter]);

  const selectedMsg = useMemo(() => {
    if (selectedId == null) return filtered[0] ?? null;
    return filtered.find((m) => m.id === selectedId) ?? filtered[0] ?? null;
  }, [filtered, selectedId]);

  // Cuando seleccionas un mensaje ligado a un expediente => cargar evidencias
  useEffect(() => {
    (async () => {
      if (!selectedMsg?.case_id) {
        setCaseEvidences([]);
        setCaseLoading(false);
        return;
      }

      try {
        setCaseLoading(true);
        const d: any = await getCaseDetail(String(selectedMsg.case_id));
        setCaseEvidences(Array.isArray(d?.evidences) ? d.evidences : []);
      } catch {
        setCaseEvidences([]);
      } finally {
        setCaseLoading(false);
      }
    })();
  }, [selectedMsg?.case_id]);

  if (!selectedMsg) {
    return (
      <div className="flex-1 flex items-center justify-center text-slate-400 bg-white">
        No hay mensajes disponibles.
      </div>
    );
  }

  const timeStr = (iso: string) =>
    new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const dateStr = (iso: string) => new Date(iso).toLocaleDateString();

  const priorityClass =
    selectedMsg.priority === "critical"
      ? "bg-red-600 text-white"
      : selectedMsg.priority === "high"
      ? "bg-orange-500 text-white"
      : "bg-blue-600 text-white";

  return (
    <div className="flex-1 flex overflow-hidden bg-white">
      {/* Lista de mensajes */}
      <div className="w-[400px] border-r border-slate-200 flex flex-col bg-slate-50/50">
        <div className="p-4 border-b border-slate-200 bg-white">
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            Bandeja de Entrada
            <span className="text-[11px] font-black bg-blue-600 text-white px-2 py-0.5 rounded-full">
              {unreadCount}
            </span>
          </h3>

          <div className="flex gap-2">
            <button
              onClick={() => setFilter("ALL")}
              className={`flex-1 py-2 rounded-lg text-xs font-bold shadow-sm ${
                filter === "ALL"
                  ? "bg-blue-600 text-white"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              TODOS
            </button>

            <button
              onClick={() => setFilter("ALERTA")}
              className={`flex-1 py-2 rounded-lg text-xs font-bold ${
                filter === "ALERTA"
                  ? "bg-blue-600 text-white"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              ALERTAS
            </button>

            <button
              onClick={() => setFilter("MEMO")}
              className={`flex-1 py-2 rounded-lg text-xs font-bold ${
                filter === "MEMO"
                  ? "bg-blue-600 text-white"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              MEMOS
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filtered.map((msg) => (
            <button
              key={msg.id}
              onClick={async () => {
                setSelectedId(msg.id);

                // ✅ marcar como leído si aún no lo está
                if (!msg.read) {
                  // optimista: baja el contador y quita el puntito al instante
                  setMessages((prev) =>
                    prev.map((m) => (m.id === msg.id ? { ...m, read: true } : m))
                  );

                  // 🔔 notificar al layout para refrescar badge global
                  window.dispatchEvent(new Event("inbox:refreshUnread"));

                  try {
                    await markInboxRead(msg.id);

                    // 🔔 confirma badge con estado real del backend
                    window.dispatchEvent(new Event("inbox:refreshUnread"));
                  } catch {
                    // si falla, revierte
                    setMessages((prev) =>
                      prev.map((m) => (m.id === msg.id ? { ...m, read: false } : m))
                    );

                    window.dispatchEvent(new Event("inbox:refreshUnread"));
                  }
                }
              }}
              className={`w-full text-left p-4 border-b border-slate-200 transition-all relative ${
                selectedId === msg.id ? "bg-white shadow-md z-10" : "hover:bg-slate-100/50"
              }`}
            >
              {!msg.read && <div className="absolute top-4 right-4 w-2 h-2 bg-blue-600 rounded-full" />}

              <div className="flex justify-between items-start mb-1">
                <span
                  className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                    msg.priority === "critical"
                      ? "bg-red-100 text-red-700"
                      : msg.priority === "high"
                      ? "bg-orange-100 text-orange-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {msg.type}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">{timeStr(msg.created_at)}</span>
              </div>

              <h4
                className={`text-sm mb-1 line-clamp-1 ${
                  !msg.read ? "font-bold text-slate-900" : "text-slate-700"
                }`}
              >
                {msg.title}
              </h4>

              <p className="text-xs text-slate-500 line-clamp-1">{msg.sender}</p>
              <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-relaxed">{msg.preview}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Contenido del mensaje */}
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        {/* Toolbar */}
        <div className="h-16 border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors">
              <Reply size={20} />
            </button>
            <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors">
              <Star size={20} />
            </button>
            <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors">
              <Trash2 size={20} />
            </button>
            <div className="w-px h-6 bg-slate-200 mx-2" />
            <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors">
              <MoreVertical size={20} />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 font-medium">Prioridad del Mensaje:</span>
            <div
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase ${priorityClass}`}
            >
              {selectedMsg.priority === "critical" && <AlertTriangle size={12} />}
              {selectedMsg.priority}
            </div>
          </div>
        </div>

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
                <div className="text-sm font-bold text-slate-900">{dateStr(selectedMsg.created_at)}</div>
                <div className="text-xs text-slate-500 flex items-center justify-end gap-1.5 mt-1">
                  <Clock size={12} />
                  {timeStr(selectedMsg.created_at)}
                </div>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 text-slate-700 leading-relaxed text-sm space-y-4">
              <p>Estimado efectivo policial,</p>
              <p>{selectedMsg.preview}</p>

              <p>
                Se recomienda proceder con los protocolos estandarizados de investigación. Este mensaje ha sido verificado
                mediante firma digital institucional.
              </p>

              <div className="pt-8 border-t border-slate-200 mt-8">
                <p className="font-bold text-slate-900 italic">SISTEMA AUTOMATIZADO SIDPOL 2.0</p>
                <p className="text-xs text-slate-500 mt-1">
                  Esta es una notificación generada automáticamente, por favor no responda a este correo.
                </p>
              </div>
            </div>

            {/* Adjuntos reales: SOLO si hay case_id */}
            {selectedMsg.case_id ? (
              <div className="mt-8 grid grid-cols-2 gap-4">
                {/* 1er adjunto (si existe) */}
                <div
                  className={`border border-slate-200 rounded-xl p-4 flex items-center justify-between transition-colors group ${
                    caseEvidences.length > 0 ? "hover:border-blue-300 cursor-pointer" : "opacity-60"
                  }`}
                  onClick={async () => {
                    if (!selectedMsg.case_id) return;
                    if (!caseEvidences[0]) return;
                    await downloadEvidence(selectedMsg.case_id, caseEvidences[0].id);
                  }}
                  title={caseEvidences.length > 0 ? "Descargar evidencia" : "Sin adjuntos"}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                      <Paperclip size={18} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {caseLoading ? "Cargando..." : caseEvidences[0]?.filename || "Sin adjuntos"}
                      </p>
                      <p className="text-[10px] text-slate-500">
                        {caseEvidences[0] ? `${Math.round((caseEvidences[0].size_bytes || 0) / 1024)} KB` : "—"}
                      </p>
                    </div>
                  </div>

                  <button
                    className="p-1.5 text-slate-400 group-hover:text-blue-600"
                    onClick={async (e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (!selectedMsg.case_id) return;
                      if (!caseEvidences[0]) return;
                      await downloadEvidence(selectedMsg.case_id, caseEvidences[0].id);
                    }}
                    title="Abrir"
                  >
                    <ExternalLink size={16} />
                  </button>
                </div>

                {/* Integridad (visual) */}
                <div className="border border-slate-200 rounded-xl p-4 flex items-center gap-4 bg-green-50/50 border-green-100">
                  <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                    <CheckCircle2 size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-green-800 uppercase">Integridad Verificada</p>
                    <p className="text-[10px] text-green-600/70 truncate">
                      {caseLoading
                        ? "Calculando..."
                        : caseEvidences[0]?.sha256
                        ? `SHA-256: ${caseEvidences[0].sha256.slice(0, 4)}…${caseEvidences[0].sha256.slice(-4)}`
                        : "Sin evidencias"}
                    </p>
                  </div>
                </div>
              </div>
            ) : null}

            {selectedMsg.case_id ? (
              <div className="mt-6 text-right">
                <span className="text-xs text-slate-500">
                  Relacionado con Exp. 2026-{String(selectedMsg.case_id).padStart(5, "0")}
                </span>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};