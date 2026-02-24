const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

function getToken() {
  return localStorage.getItem("token") || "";
}

function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function createCase(body: {
  dni: string;
  incident_type: string;
  location: string;
  description: string;
}) {
  const res = await fetch(`${API_URL}/cases`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(body),
  });

  // 🔥 en vez de res.json().catch(() => ({})), leemos texto para debug
  console.log("POST /cases status:", res.status);
  console.log("POST /cases content-type:", res.headers.get("content-type"));

  const raw = await res.text();
  console.log("POST /cases raw response:", raw);
  let data: any = {};
  try {
    data = raw ? JSON.parse(raw) : {};
  } catch {
    data = { _raw: raw }; // por si viene HTML/empty
  }

  if (!res.ok) {
    // esto te mostrará el error real del backend
    throw new Error(data?.detail || data?._raw || "Error creando caso");
  }

  return data;
}

export async function uploadEvidence(caseId: number, file: File) {
  const form = new FormData();
  form.append("file", file);

  const res = await fetch(`${API_URL}/cases/${caseId}/evidences`, {
    method: "POST",
    headers: { ...authHeaders() }, // NO Content-Type
    body: form,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.detail || "Error subiendo evidencia");
  return data;
}

// ✅ usa tu endpoint actual del backend (GET /cases/validate-dni/{dni})
export async function validateDni(dni: string) {
  const res = await fetch(`${API_URL}/cases/validate-dni/${dni}`, {
    method: "GET",
    headers: { ...authHeaders() },
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.detail || "DNI inválido");
  return { data }; // para que en tu UI sigas usando verifiedData = resp.data
}

export async function submitCase(caseId: number) {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/cases/${caseId}/submit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({
      declaration_accepted: true,
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Error al confirmar el registro");
  }

  return res.json();
}

export async function downloadCargo(caseId: number) {
  const res = await fetch(`${API_URL}/cases/${caseId}/cargo`, {
    method: "GET",
    headers: { ...authHeaders() },
  });

  // Si backend devuelve error (401/403/500), intentamos leerlo como texto para mostrarlo
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    // si es JSON con {"detail": "..."} lo extraemos
    try {
      const data = JSON.parse(text);
      throw new Error(data?.detail || "No se pudo generar el cargo");
    } catch {
      throw new Error("No se pudo generar el cargo");
    }
  }

  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `CARGO_2026-${String(caseId).padStart(5, "0")}.pdf`;
  a.style.display = "none";

  document.body.appendChild(a);
  a.click();

  // IMPORTANTÍSIMO: revocar después de un pequeño delay
  setTimeout(() => {
    window.URL.revokeObjectURL(url);
    a.remove();
  }, 1500);
}

export async function downloadEvidence(caseId: string, evidenceId: number, filename: string) {
  const res = await fetch(`${API_URL}/cases/${caseId}/evidences/${evidenceId}/download`, {
    method: "GET",
    headers: { ...authHeaders() },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    try {
      const data = JSON.parse(text);
      throw new Error(data?.detail || "No se pudo descargar la evidencia");
    } catch {
      throw new Error("No se pudo descargar la evidencia");
    }
  }

  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename || `evidencia_${evidenceId}`;
  document.body.appendChild(a);
  a.click();

  setTimeout(() => {
    window.URL.revokeObjectURL(url);
    a.remove();
  }, 1500);
}

export async function getManagementDashboard(page = 1, pageSize = 10) {
  const res = await fetch(
    `${API_URL}/cases/management/dashboard?page=${page}&page_size=${pageSize}`,
    { method: "GET", headers: { ...authHeaders() } }
  );

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.detail || "Error cargando gestión");
  return data;
}

export async function getCaseDetail(caseId: string) {
  const res = await fetch(`${API_URL}/cases/${caseId}/detail`, {
    method: "GET",
    headers: { ...authHeaders() },
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg =
      typeof data?.detail === "string"
        ? data.detail
        : JSON.stringify(data?.detail || data || "Error cargando detalle");
    throw new Error(msg);
  }
  return data;
}

export async function runExternalQuery(caseId: string, system: "ESINPOL" | "RQ") {
  const res = await fetch(`${API_URL}/cases/${caseId}/external/${system}`, {
    method: "POST",
    headers: { ...authHeaders() },
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg =
      typeof data?.detail === "string"
        ? data.detail
        : JSON.stringify(data?.detail || data || "Error ejecutando consulta");
    throw new Error(msg);
  }
  return data;
}

export async function createActuation(
  caseId: string,
  payload: {
    title: string;
    type: "ACTA" | "OFICIO" | "CONSULTA" | "EVIDENCIA";
    status: "PENDIENTE" | "COMPLETADO" | "DIGITALIZADO";
    occurred_at?: string;
    detail?: string;
  }
) {
  const res = await fetch(`${API_URL}/cases/${caseId}/actuations`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg =
      typeof data?.detail === "string"
        ? data.detail
        : JSON.stringify(data?.detail || data || "Error creando actuación");
    throw new Error(msg);
  }
  return data;
}

export async function getInbox() {
  const res = await fetch(`${API_URL}/inbox`, {
    method: "GET",
    headers: { ...authHeaders() },
  });
  const data = await res.json().catch(() => []);
  if (!res.ok) throw new Error(data?.detail || "Error cargando bandeja");
  return data;
}

export async function markInboxRead(id: number) {
  const res = await fetch(`${API_URL}/inbox/${id}/read`, {
    method: "PATCH",
    headers: { ...authHeaders() },
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.detail || "No se pudo marcar como leído");
  return data;
}