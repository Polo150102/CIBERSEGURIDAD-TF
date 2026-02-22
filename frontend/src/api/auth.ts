const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export async function loginRequest(username: string, password: string, rememberSession: boolean = false) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username,
      password,
      remember_session: rememberSession,
    }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.detail || "Login falló");
  return data;
}

export async function verify2FA(username: string, otp: string, remember_session: boolean) {
  const res = await fetch(`${API_URL}/auth/verify-2fa`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, otp, remember_session }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.detail || "Código 2FA inválido");
  return data; // {access_token, role}
}
