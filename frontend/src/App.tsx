import React, { useState } from 'react';
import { ModernLayout } from './components/ModernLayout';
import { ModernLogin } from './components/ModernLogin';
import { ModernSidebar } from './components/ModernSidebar';
import { ModernInbox } from './components/ModernInbox';
import { ModernRegistration } from './components/ModernRegistration';
import { ModernManagement } from './components/ModernManagement';
import { ModernCaseDetail } from './components/ModernCaseDetail';
import { Toaster } from "sonner";

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedCase, setSelectedCase] = useState<string | null>(null);

  const handleLogin = (userData: any) => {
    setUser(userData);
    setActiveTab('inbox');
  };

  const handleLogout = () => {
    setUser(null);
    setActiveTab('dashboard');
    setSelectedCase(null);
  };

  const renderContent = () => {
    if (selectedCase) {
      return <ModernCaseDetail caseId={selectedCase} onBack={() => setSelectedCase(null)} />;
    }

    switch (activeTab) {
      case 'inbox':
        return <ModernInbox />;
      case 'registration':
        return <ModernRegistration />;
      case 'management':
        return <ModernManagement onSelectCase={(id) => setSelectedCase(id)} />;
      case 'dashboard':
      default:
        return (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-slate-50">
            <div className="size-24 bg-blue-100 text-blue-600 rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-blue-50">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="size-12">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-2">Bienvenido a SIDPOL 2.0</h2>
            <p className="text-slate-500 max-w-md mx-auto font-medium leading-relaxed">
              Seleccione una opción del menú lateral para comenzar sus gestiones operativas en el nuevo entorno seguro y modernizado.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-4 max-w-lg w-full">
              <button 
                onClick={() => setActiveTab('registration')}
                className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-200 transition-all text-left group"
              >
                <div className="size-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-6"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                </div>
                <h4 className="font-bold text-slate-900 uppercase text-xs">Nueva Denuncia</h4>
                <p className="text-[10px] text-slate-400 mt-1 font-medium">Registro rápido con integración RENIEC</p>
              </button>
              <button 
                onClick={() => setActiveTab('inbox')}
                className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-200 transition-all text-left group"
              >
                <div className="size-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-6"><path d="M4 4h16v16H4z" /><path d="M4 4l8 8 8-8" /></svg>
                </div>
                <h4 className="font-bold text-slate-900 uppercase text-xs">Mensajería</h4>
                <p className="text-[10px] text-slate-400 mt-1 font-medium">Revise sus notificaciones y alertas críticas</p>
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <>
      <Toaster position="top-right" richColors />
      <div className="min-h-screen w-full bg-slate-100 flex items-center justify-center overflow-hidden">
        {!user ? (
          <ModernLogin onLogin={handleLogin} />
        ) : (
          <ModernLayout user={user} onLogout={handleLogout} title={activeTab.toUpperCase()}>
            <ModernSidebar activeTab={activeTab} onTabChange={setActiveTab} />
            <div className="flex-1 flex flex-col overflow-hidden">
              {renderContent()}
            </div>
          </ModernLayout>
        )}

        <style dangerouslySetInnerHTML={{ __html: `
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
          
          :root {
            --font-sans: 'Inter', system-ui, -apple-system, sans-serif;
          }

          body {
            margin: 0;
            padding: 0;
            font-family: var(--font-sans);
            -webkit-font-smoothing: antialiased;
          }

          .font-sans {
            font-family: var(--font-sans);
          }

          /* Modern scrollbar */
          ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
          }
          ::-webkit-scrollbar-track {
            background: transparent;
          }
          ::-webkit-scrollbar-thumb {
            background: #e2e8f0;
            border-radius: 20px;
          }
          ::-webkit-scrollbar-thumb:hover {
            background: #cbd5e1;
          }

          @keyframes in {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-in {
            animation: in 0.4s ease-out forwards;
          }
        `}} />
      </div>
    </>
  );
}
