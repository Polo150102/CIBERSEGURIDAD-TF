import React, { useEffect, useState } from "react";
import { getInbox } from "../api/cases";
import { Shield, Lock, Bell, Search, LogOut } from "lucide-react";

interface ModernLayoutProps {
  children: React.ReactNode;
  user?: { name: string; rank: string; badge: string };
  onLogout?: () => void;
  title?: string;
}

export const ModernLayout: React.FC<ModernLayoutProps> = ({ children, user, onLogout, title }) => {
  const [inboxUnread, setInboxUnread] = useState(0);

  const refreshUnread = async () => {
    try {
      const data = await getInbox();
      const unread = (Array.isArray(data) ? data : []).filter((m: any) => !m.read).length;
      setInboxUnread(unread);
    } catch {
      setInboxUnread(0);
    }
  };

  useEffect(() => {
    refreshUnread(); // al cargar layout

    const onRefresh = () => refreshUnread();
    window.addEventListener("inbox:refreshUnread", onRefresh);

    return () => {
      window.removeEventListener("inbox:refreshUnread", onRefresh);
    };
  }, []);

  return (
    <div className="flex h-screen w-full bg-slate-50 font-sans text-slate-900">
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-10 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg text-white">
              <Shield size={24} />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-slate-900">
                SIDPOL <span className="text-blue-600 font-black">2.0</span>
              </h1>
              <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider -mt-1">
                Sistema Integrado de Gestión Policial
              </p>
            </div>

            {title && (
              <>
                <div className="h-6 w-px bg-slate-200 mx-2" />
                <h2 className="text-sm font-semibold text-slate-600">{title}</h2>
              </>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center bg-slate-100 rounded-full px-3 py-1.5 border border-slate-200">
              <Search size={16} className="text-slate-400" />
              <input
                type="text"
                placeholder="Buscar expediente, DNI..."
                className="bg-transparent border-none focus:outline-none text-xs ml-2 w-48 text-slate-600"
              />
            </div>

            {/* Campana (badge rojo) */}
            <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
              <Bell size={20} />
              {inboxUnread > 0 && (
                <span className="ml-auto bg-blue-600 text-white text-[11px] font-black px-2 py-0.5 rounded-full">
                  {inboxUnread}
                </span>
              )}
            </button>

            <div className="h-8 w-px bg-slate-200 mx-1" />

            {user ? (
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold text-slate-900 leading-none">{user.name}</p>
                  <p className="text-[10px] text-slate-500 font-medium">
                    {user.rank} • {user.badge}
                  </p>
                </div>
                <div className="size-9 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold border border-blue-200">
                  {user.name.charAt(0)}
                </div>
                <button
                  onClick={onLogout}
                  className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                  title="Cerrar Sesión"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Lock size={16} className="text-green-600" />
                <span className="text-[10px] font-bold text-green-600 uppercase tracking-widest">
                  Conexión Encriptada AES-256
                </span>
              </div>
            )}
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-hidden relative flex">{children}</main>

        {/* Footer */}
        <footer className="h-8 bg-slate-900 text-slate-400 text-[10px] px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              Servidor Activo: San Borja DC-01
            </span>
            <span>Uptime: 99.9%</span>
          </div>
          <div className="flex items-center gap-4 uppercase font-bold tracking-tighter">
            <span>DIRTIC PNP © 2026</span>
            <span className="text-slate-600">v2.0.4-PRODUCTION</span>
          </div>
        </footer>
      </div>
    </div>
  );
};