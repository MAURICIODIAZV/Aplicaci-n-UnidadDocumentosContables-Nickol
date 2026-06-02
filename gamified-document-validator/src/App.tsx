import React, { useEffect } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { Header } from './components/Header';
import { TabBar } from './components/TabBar';
import { ProgressView } from './components/views/ProgressView';
import { LibraryView } from './components/views/LibraryView';
import { UploadView } from './components/views/UploadView';
import { ExcelView } from './components/views/ExcelView';
import { ProfileView } from './components/views/ProfileView';
import { HistoryView } from './components/views/HistoryView';
import { Sparkles, AlertCircle, X, HelpCircle, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';

function AppContent() {
  const {
    currentSelectedView,
    floatingXPs,
    toast,
    clearToast,
    stats,
    level,
    activeLevelUpReward,
    setActiveLevelUpReward,
    userProfile
  } = useGame();

  // Watch toast changes to automatically sweep after 3.5 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        clearToast();
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [toast, clearToast]);

  // Client-side View router mapping
  const renderActiveView = () => {
    switch (currentSelectedView) {
      case 'Progress':
        return <ProgressView />;
      case 'Library':
        return <LibraryView />;
      case 'Upload':
        return <UploadView />;
      case 'Excel':
        return <ExcelView />;
      case 'History':
        return <HistoryView />;
      case 'Profile':
        return <ProfileView />;
      default:
        return <ProgressView />;
    }
  };

  const isRegistered = true;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-start py-0 md:py-8 font-sans antialiased">
      {/* Device frame container for high-fidelity presentation */}
      <div className="w-full max-w-md min-h-screen md:min-h-[840px] md:max-h-[900px] bg-[#f8f9fa] md:rounded-[40px] md:shadow-[0_24px_50px_rgba(0,0,0,0.15)] md:ring-12 md:ring-slate-900 overflow-y-auto relative flex flex-col">
        {/* Dynamic Notch Decorator for Mobile Look on Desktop */}
        <div className="hidden md:block absolute top-0 left-1/2 -translate-x-1/2 h-5 w-32 bg-slate-900 rounded-b-xl z-50"></div>
        
        {/* Header content section (only if registered) */}
        {isRegistered && <Header />}

        {/* View Layout Base scrollable area */}
        <main className={`flex-1 px-5 pb-28 overflow-y-auto select-none ${isRegistered ? 'pt-6' : 'pt-10'}`}>
          {renderActiveView()}
        </main>

        {/* Navigation block (only if registered) */}
        {isRegistered && <TabBar />}

        {/* Absolute High-Fidelity Floating XP Reward Elements */}
        {floatingXPs.map((f) => (
          <div
            key={f.id}
            style={{ top: `${f.y - 25}px`, left: `${f.x - 45}px` }}
            className="fixed pointer-events-none text-emerald-brand font-black text-sm z-50 animate-float flex items-center gap-1 bg-white/95 px-3 py-1.5 rounded-full border border-emerald-200 shadow-lift"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-500 fill-emerald-100" />
            <span>+{f.xp} XP</span>
          </div>
        ))}

        {/* Dynamic Toast Alert System */}
        {toast && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 w-80 max-w-full z-50 animate-bounce px-4 select-none pointer-events-none">
            <div className={`pointer-events-auto rounded-2xl p-3.5 flex items-start gap-2.5 shadow-lift border transition-all duration-300 ${
              toast.type === 'error'
                ? 'bg-red-50 border-red-200 text-red-800'
                : toast.type === 'info'
                ? 'bg-indigo-50 border-indigo-200 text-indigo-800'
                : 'bg-emerald-50 border-emerald-200 text-emerald-800'
            }`}>
              {toast.type === 'error' ? (
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              ) : toast.type === 'info' ? (
                <HelpCircle className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
              ) : (
                <Sparkles className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5 animate-pulse" />
              )}
              
              <div className="flex-1 text-xs">
                <p className="font-extrabold">Notificación del Sistema</p>
                <p className="mt-0.5 font-semibold text-slate-600/90 leading-relaxed">{toast.message}</p>
              </div>

              <button
                onClick={clearToast}
                className="text-gray-400 hover:text-gray-600 shrink-0"
                aria-label="Cerrar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Level Up Reward Celebrate Modal overlay inside the cabinet */}
        {activeLevelUpReward && (
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md z-50 flex flex-col items-center justify-center p-6 rounded-[30px] md:rounded-[40px] select-none animate-fade-in">
            <div className="bg-white rounded-[32px] p-6 border-2 border-amber-200 shadow-2xl relative max-w-[320px] w-full text-center overflow-hidden animate-zoom-in">
              {/* Particle and ribbon decorations */}
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-amber-400 via-yellow-300 to-indigo-600"></div>
              
              <div className="w-20 h-20 bg-gradient-to-tr from-amber-100 to-amber-50 rounded-full flex items-center justify-center mx-auto text-4xl shadow-md border-2 border-amber-200 mt-2 animate-bounce">
                {activeLevelUpReward.badge}
              </div>

              <div className="mt-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 bg-amber-50 py-1 px-3 rounded-full border border-amber-200 inline-block">
                  {activeLevelUpReward.type}
                </span>
                
                <h3 className="text-xl font-black text-slate-900 mt-3 leading-tight tracking-tight">
                  ¡Nivel {activeLevelUpReward.level} Alcanzado! 🎉
                </h3>
                
                <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-wide">
                  Recompensa Desbloqueada
                </p>

                <h4 className="text-sm font-extrabold text-indigo-brand mt-3 bg-indigo-50/50 py-1.5 px-3 rounded-2xl border border-indigo-100">
                  {activeLevelUpReward.name}
                </h4>

                <p className="text-[11px] font-medium text-slate-600 mt-2.5 leading-relaxed">
                  {activeLevelUpReward.description}
                </p>
              </div>

              <button
                onClick={() => {
                  confetti({ particleCount: 50, spread: 40 });
                  setActiveLevelUpReward(null);
                }}
                className="w-full mt-6 py-3 px-4 bg-indigo-brand hover:opacity-95 active:scale-95 text-white font-black text-xs rounded-2xl shadow-lift transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 fill-white text-indigo-300" />
                <span>Reclamar Recompensa 🎁</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
}
