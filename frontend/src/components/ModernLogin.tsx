import React, { useState } from 'react';
import { Lock, User, ShieldCheck, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { loginRequest, verify2FA } from "../api/auth";

interface ModernLoginProps {
  onLogin: (user: any) => void;
}

export const ModernLogin: React.FC<ModernLoginProps> = ({ onLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ badge: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);

  // 2FA UI state
  const [twoFaStep, setTwoFaStep] = useState<"none" | "setup" | "verify">("none");
  const [qrCode, setQrCode] = useState<string | null>(null); // base64 png
  const [otp, setOtp] = useState("");
  const [loginUsername, setLoginUsername] = useState<string>(""); // CIP usado en login

  // checkbox "mantener sesión" (si está marcado, backend exige 2FA)
  const [rememberSession, setRememberSession] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const username = formData.badge.trim();
      setLoginUsername(username);

      const data = await loginRequest(username, formData.password, rememberSession);

      // ✅ Caso 1: necesita configuración (QR) - keys según tu backend
      // backend retorna: { requires_2fa_setup: true, username, qr_base64 }
      if (data.requires_2fa_setup) {
        setQrCode(data.qr_base64); // base64 del PNG
        setTwoFaStep("setup");
        return;
      }

      // ✅ Caso 2: ya tiene secret, pide OTP - keys según tu backend
      // backend retorna: { requires_2fa: true, username }
      if (data.requires_2fa) {
        setTwoFaStep("verify");
        return;
      }

      // ✅ Caso 3: login normal (sin 2FA) => token directo
      if (data.access_token) {
        localStorage.setItem("token", data.access_token);

        onLogin({
          name: `USUARIO ${username}`,
          rank: "", // el backend no devuelve role explícito
          badge: username,
          token: data.access_token,
        });
        return;
      }

      throw new Error("Respuesta inesperada del servidor");
    } catch (err: any) {
      alert(err?.message || "Error al iniciar sesión");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // ✅ tu backend /auth/verify-2fa solo espera { username, otp }
      const data = await verify2FA(loginUsername, otp);

      if (!data?.access_token) {
        throw new Error("No se recibió token luego del 2FA");
      }

      localStorage.setItem("token", data.access_token);

      onLogin({
        name: `USUARIO ${loginUsername}`,
        rank: "",
        badge: loginUsername,
        token: data.access_token,
      });
    } catch (err: any) {
      alert(err?.message || "Error al verificar 2FA");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center bg-slate-100 relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none select-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500 via-transparent to-transparent scale-150" />
      </div>

      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl border border-slate-200 z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-200 mb-6">
            <ShieldCheck size={40} />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">SIDPOL 2.0</h2>
          <p className="text-sm text-slate-500 mt-2 font-medium">Plataforma Segura de Gestión Institucional</p>
        </div>

        {/* 2FA Box */}
        {twoFaStep !== "none" && (
          <div className="mb-6 p-4 rounded-xl border border-slate-200 bg-slate-50">
            <h3 className="font-bold text-slate-800 text-sm mb-2">
              Verificación en 2 pasos (2FA)
            </h3>

            {twoFaStep === "setup" && qrCode && (
              <>
                <p className="text-xs text-slate-600 mb-3">
                  Escanea este QR en Google Authenticator y luego ingresa el código de 6 dígitos.
                </p>
                <div className="flex justify-center mb-3">
                  <img
                    className="w-40 h-40 bg-white p-2 rounded-lg border"
                    src={`data:image/png;base64,${qrCode}`}
                    alt="QR 2FA"
                  />
                </div>
              </>
            )}

            {(twoFaStep === "setup" || twoFaStep === "verify") && (
              <form onSubmit={handleVerifyOtp} className="space-y-3">
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                  placeholder="Código 2FA (6 dígitos)"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded-lg font-bold disabled:opacity-70"
                >
                  {isLoading ? "Verificando..." : "Verificar 2FA"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setTwoFaStep("none");
                    setOtp("");
                    setQrCode(null);
                  }}
                  className="w-full text-xs font-bold text-slate-500 hover:text-slate-700"
                >
                  Volver al login
                </button>
              </form>
            )}
          </div>
        )}

        {/* Login Form */}
        {twoFaStep === "none" && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">
                Número de Carnet (CIP)
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  required
                  value={formData.badge}
                  onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50 text-slate-900 transition-all outline-none"
                  placeholder="Ingrese su CIP"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Contraseña
                </label>
                <button
                  type="button"
                  className="text-[10px] font-bold text-blue-600 hover:underline uppercase"
                >
                  ¿Olvidó su clave?
                </button>
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                  <Lock size={18} />
                </div>

                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="block w-full pl-10 pr-12 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50 text-slate-900 transition-all outline-none"
                  placeholder="••••••••"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 px-1">
              <input
                type="checkbox"
                id="remember"
                checked={rememberSession}
                onChange={(e) => setRememberSession(e.target.checked)}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="remember" className="text-xs text-slate-600 font-medium">
                Mantener sesión iniciada (2FA requerido)
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-blue-100 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-wait"
            >
              {isLoading ? (
                <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  INICIAR SESIÓN
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        )}

        <div className="mt-8 pt-6 border-t border-slate-100">
          <div className="flex items-center justify-center gap-4 opacity-50 grayscale transition-all hover:grayscale-0 hover:opacity-100">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">
              Protocolo de Seguridad Nacional v4.2<br />
              Certificado por MININTER
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};