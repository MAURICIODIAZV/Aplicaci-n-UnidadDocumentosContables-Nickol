import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Bell, Trophy, Zap } from 'lucide-react';

export const Header: React.FC = () => {
  const { userProfile, stats, isEarlyBirdActive, currentMultiplier } = useGame();
  const [bellActive, setBellActive] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);

  const handleBellClick = () => {
    setBellActive(!bellActive);
    if (unreadCount > 0) {
      setUnreadCount(0);
    }
  };

  return (
    <header className="flex items-center justify-between p-4 bg-white border-b border-gray-100 shadow-sm sticky top-0 z-40 select-none">
      <div className="flex items-center space-x-3">
        <div className="relative group cursor-pointer">
          <img
            src={userProfile.avatar}
            alt={userProfile.name}
            className="w-10 h-10 rounded-full border-2 border-indigo-brand object-cover transition-transform duration-300 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
        </div>
        <div>
          <h1 className="text-sm font-semibold text-gray-900 flex items-center gap-1.5 leading-none">
            Hola, <span className="text-indigo-brand font-bold">{userProfile.name}</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1 font-medium">{userProfile.role}</p>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        {/* Real-time multiplier badge */}
        <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold shadow-sm border transition-all duration-300 ${
          isEarlyBirdActive 
            ? 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse' 
            : 'bg-slate-50 text-slate-600 border-slate-200'
        }`}>
          <Zap className={`w-3.5 h-3.5 ${isEarlyBirdActive ? 'text-amber-500 fill-amber-500' : 'text-slate-400'}`} />
          <span>{currentMultiplier.toFixed(1)}x Activo</span>
        </div>

        {/* Dynamic bell */}
        <button
          onClick={handleBellClick}
          className="relative p-2 text-gray-500 hover:text-indigo-style transition-colors duration-200 hover:bg-slate-50 rounded-lg focus:outline-none"
          title="Notificaciones de quests"
          id="notification-bell"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
          )}
        </button>
      </div>
      
      {/* Dropdown notification alert list */}
      {bellActive && (
        <div className="absolute top-16 right-4 w-72 bg-white rounded-xl shadow-xl border border-gray-100 p-3 z-50 animate-fade-in">
          <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2">Notificaciones del juego</h4>
          <div className="space-y-2 text-xs">
            <div className="p-2 bg-yellow-50 text-yellow-800 rounded-lg">
              <p className="font-semibold">⚡ ¡Bono de Horario Early Bird disponible!</p>
              <p className="text-[10px] text-yellow-700 mt-0.5">Suma 1.5x de puntos antes de las 12:00 PM o forzando el multiplicador.</p>
            </div>
            <div className="p-2 bg-indigo-50 text-indigo-800 rounded-lg">
              <p className="font-semibold">🔥 Racha activa: {stats.streakDays} días</p>
              <p className="text-[10px] text-indigo-700 mt-0.5">Sube de nivel rápido completando quests hoy.</p>
            </div>
            <div className="p-2 bg-green-50 text-green-800 rounded-lg">
              <p className="font-semibold">📊 Excel Link disponible</p>
              <p className="text-[10px] text-green-700 mt-0.5">Los gastos vinculados rinden +5 XP extra.</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
