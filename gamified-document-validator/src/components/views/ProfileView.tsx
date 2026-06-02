import React, { useState } from 'react';
import { useGame, LEVEL_REWARDS } from '../../context/GameContext';
import { User, Mail, Shield, CheckCircle, Zap, Settings as SettingsIcon, Award, Flame, Plus, Sparkles, Lock, CheckCircle2, RefreshCw, Gift } from 'lucide-react';

const femaleAvatars = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150",
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&h=150",
  "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&h=150",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150"
];

const maleAvatars = [
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150",
  "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&h=150",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150"
];

export const ProfileView: React.FC = () => {
  const {
    userProfile,
    stats,
    settings,
    setSettings,
    setProfile,
    currentMultiplier,
    isEarlyBirdActive,
    level,
    levelProgress,
    unlockedRewards,
    resetGame
  } = useGame();

  // Edit states
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(userProfile.name);
  const [editRole, setEditRole] = useState(userProfile.role);
  const [editEmail, setEditEmail] = useState(userProfile.email);
  const [editGender, setEditGender] = useState(userProfile.gender || 'Mujer');

  const handleToggleMultiplier = () => {
    setSettings(prev => {
      const newVal = !prev.forceEarlyBirdMultiplier;
      return { ...prev, forceEarlyBirdMultiplier: newVal };
    });
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    
    let newAvatar = userProfile.avatar;
    // If gender changed or initial avatar was empty, assign corresponding gender profile picture
    if (editGender !== userProfile.gender || !newAvatar) {
      const avatarList = editGender === 'Mujer' ? femaleAvatars : maleAvatars;
      const randomIndex = Math.floor(Math.random() * avatarList.length);
      newAvatar = avatarList[randomIndex];
    }

    setProfile(prev => ({
      ...prev,
      name: editName,
      role: editRole,
      email: editEmail,
      gender: editGender,
      avatar: newAvatar
    }));
    setIsEditing(false);
  };

  return (
    <div className="space-y-6 pb-24 animate-fade-in select-none max-w-md mx-auto">
      {/* Profile Card Header */}
      <div className="bg-white rounded-3xl p-6 shadow-ambient border border-gray-100 text-center relative overflow-hidden">
        {/* Background decorative aura */}
        <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-r from-indigo-brand to-indigo-900 z-0"></div>

        <div className="relative z-10 mt-6">
          <img
            src={userProfile.avatar}
            alt={userProfile.name}
            className="w-24 h-24 rounded-full border-4 border-white object-cover mx-auto shadow-md"
            referrerPolicy="no-referrer"
          />
          
          <h2 className="text-xl font-extrabold text-gray-900 mt-3">{userProfile.name}</h2>
          <p className="text-xs font-semibold text-indigo-brand uppercase tracking-wider">{userProfile.role}</p>
          <p className="text-xs text-gray-400 mt-1 flex items-center justify-center gap-1">
            <Mail className="w-3.5 h-3.5" />
            <span>{userProfile.email}</span>
          </p>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="mt-4 px-4 py-1.5 border border-indigo-brand/20 hover:border-indigo-brand text-indigo-brand hover:bg-indigo-brand/5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer"
          >
            {isEditing ? 'Cancelar edición' : 'Editar Perfil'}
          </button>
        </div>

        {/* Inline editable form toggle */}
        {isEditing && (
          <form onSubmit={handleSaveProfile} className="mt-5 pt-5 border-t border-gray-100 text-left space-y-3 z-10 relative">
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Nombre</label>
              <input
                type="text"
                required
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full text-xs font-semibold border border-gray-200 rounded-lg px-3 py-2 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-100 outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Cargo</label>
              <input
                type="text"
                required
                value={editRole}
                onChange={(e) => setEditRole(e.target.value)}
                className="w-full text-xs font-semibold border border-gray-200 rounded-lg px-3 py-2 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-100 outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Correo Electrónico</label>
              <input
                type="email"
                required
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                className="w-full text-xs font-semibold border border-gray-200 rounded-lg px-3 py-2 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-100 outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Género (Foto a asignar)</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setEditGender('Mujer')}
                  className={`py-2 px-3 rounded-lg border font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    editGender === 'Mujer'
                      ? 'bg-purple-50 border-purple-200 text-purple-700 font-extrabold'
                      : 'bg-slate-50 border-gray-250 text-gray-650 hover:bg-slate-100'
                  }`}
                >
                  👩 Mujer
                </button>
                <button
                  type="button"
                  onClick={() => setEditGender('Hombre')}
                  className={`py-2 px-3 rounded-lg border font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    editGender === 'Hombre'
                      ? 'bg-blue-50 border-blue-200 text-blue-700 font-extrabold'
                      : 'bg-slate-50 border-gray-250 text-gray-650 hover:bg-slate-100'
                  }`}
                >
                  👨 Hombre
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-indigo-brand text-white font-extrabold text-xs rounded-xl shadow cursor-pointer hover:bg-indigo-brand-hover transition-colors"
            >
              Guardar Cambios
            </button>
          </form>
        )}
      </div>

      {/* Stats Resumen Dashboard Panel */}
      <div className="bg-white rounded-3xl p-6 shadow-ambient border border-gray-100 space-y-4">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest block pb-2 border-b border-gray-100">
          Resumen de Estadísticas
        </h3>

        <div className="grid grid-cols-2 gap-3 text-center">
          {/* Level metric container */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-gray-100">
            <span className="text-[10px] font-bold text-gray-400 block uppercase">Nivel Actual</span>
            <span className="text-3xl font-black text-indigo-brand block mt-1">{level}</span>
            <span className="text-[9px] text-indigo-600 font-semibold mt-1 block">
              {levelProgress}% del Nivel {level + 1}
            </span>
          </div>

          {/* XP block metric */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-gray-100">
            <span className="text-[10px] font-bold text-gray-400 block uppercase">XP Total</span>
            <span className="text-3xl font-black text-emerald-brand block mt-1">{stats.totalXP}</span>
            <span className="text-[9px] text-emerald-700 font-semibold mt-1 block">Racha de Auditoría</span>
          </div>

          {/* Days active */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-gray-100">
            <span className="text-[10px] font-bold text-gray-400 block uppercase">Racha Actual</span>
            <span className="text-2xl font-black text-amber-700 block mt-1 flex items-center justify-center gap-1">
              <Flame className="w-5 h-5 text-amber-500 fill-amber-500 animate-pulse" />
              <span>{stats.streakDays} Días</span>
            </span>
            <span className="text-[9px] text-slate-400 mt-1 block">Multiplicador activo</span>
          </div>

          {/* Docs checked */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-gray-100">
            <span className="text-[10px] font-bold text-gray-400 block uppercase">Documentos</span>
            <span className="text-2xl font-black text-slate-800 block mt-1">
              {stats.totalDocsProcessed}
            </span>
            <span className="text-[9px] text-slate-400 mt-1 block">Lote contable mock</span>
          </div>
        </div>
      </div>

      {/* Adjustments and simulator playground panel */}
      <div className="bg-white rounded-3xl p-6 shadow-ambient border border-gray-100 space-y-4">
        <div className="flex items-center space-x-2 pb-2 border-b border-gray-100">
          <SettingsIcon className="w-4 h-4 text-indigo-brand" />
          <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">
            Ajustes / Panel de Simulación
          </h3>
        </div>

        <p className="text-xs text-gray-400 leading-relaxed font-normal">
          Utiliza estos controles de depuración para probar las mecánicas de gamificación del reloj y progresión de nivel de manera instantánea.
        </p>

        {/* Toggle Early Bird Multiplier */}
        <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-gray-100">
          <div>
            <span className="text-xs font-bold text-gray-800 block">Forzar Early Bird Multiplier</span>
            <span className="text-[10px] text-slate-400 mt-0.5 block font-medium">
              Activa bono 1.5x inclusive después de mediodía
            </span>
          </div>

          <button
            onClick={handleToggleMultiplier}
            className={`w-12 h-6.5 rounded-full p-0.5 transition-colors duration-300 focus:outline-none cursor-pointer ${
              settings.forceEarlyBirdMultiplier ? 'bg-emerald-brand' : 'bg-gray-300'
            }`}
            aria-label="Toggle Force Early Bird Multiplier"
          >
            <div
              className={`bg-white w-5.5 h-5.5 rounded-full shadow-md transform transition-transform duration-300 ${
                settings.forceEarlyBirdMultiplier ? 'translate-x-[22px]' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Current server-hour parameters detail */}
        <div className="p-3.5 bg-indigo-50/50 rounded-2xl border border-indigo-100/50 text-xs text-indigo-800 space-y-1">
          <p className="font-bold flex items-center gap-1">
            <Shield className="w-3.5 h-3.5" />
            <span>Parámetros de Auditoría Servidor:</span>
          </p>
          <ul className="list-disc list-inside mt-1 font-medium text-[11px] text-indigo-700/90 space-y-1">
            <li>Hora actual: <span className="font-bold">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span></li>
            <li>Horario Early Bird (&lt;12:00 PM): <span className="font-bold">{new Date().getHours() < 12 ? 'VÁLIDO' : 'EXPIRADO'}</span></li>
            <li>Bono por simulación: <span className="font-bold text-emerald-brand">{settings.forceEarlyBirdMultiplier ? 'FORZADO (1.5x)' : 'APAGADO'}</span></li>
            <li>Multiplicador activo: <span className="font-extrabold text-indigo-brand">{currentMultiplier.toFixed(1)}x</span></li>
          </ul>
        </div>
      </div>

      {/* Level Micro-Rewards Unlocked & Roadmap panel */}
      <div className="bg-white rounded-3xl p-6 shadow-ambient border border-gray-100 space-y-4">
        <div className="flex items-center space-x-2 pb-2 border-b border-gray-100">
          <Gift className="w-4 h-4 text-amber-500 animate-bounce" />
          <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">
            Colección de Micro-Recompensas
          </h3>
        </div>

        <p className="text-xs text-gray-400 leading-relaxed font-normal">
          Sube de nivel procesando y validando documentos para desbloquear recompensas y habilidades especiales pasivas de auditoría.
        </p>

        <div className="space-y-3.5">
          {LEVEL_REWARDS.map((rew) => {
            const isUnlocked = level >= rew.level;

            return (
              <div
                key={rew.level}
                className={`flex items-start gap-3 p-3.5 rounded-2xl border transition-all duration-300 ${
                  isUnlocked
                    ? 'bg-[#f0fdf4]/80 border-emerald-100 text-emerald-950'
                    : 'bg-slate-50/60 border-slate-100/80 text-slate-400 select-none grayscale'
                }`}
              >
                <div className={`w-11 h-11 rounded-xl shrink-0 flex items-center justify-center text-2xl font-bold border ${
                  isUnlocked ? 'bg-white border-emerald-200' : 'bg-slate-100 border-slate-200 text-slate-400'
                }`}>
                  {isUnlocked ? rew.badge : <Lock className="w-4 h-4 text-slate-400" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className={`text-xs font-black truncate ${isUnlocked ? 'text-slate-800 font-extrabold' : 'text-slate-400'}`}>
                      {rew.name}
                    </h4>
                    {isUnlocked ? (
                      <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-md border border-emerald-200 shrink-0 uppercase tracking-wider">
                        Desbloqueado
                      </span>
                    ) : (
                      <span className="text-[9px] font-bold text-slate-450 bg-slate-200/60 px-1.5 py-0.5 rounded-md border border-slate-200 shrink-0">
                        Nivel {rew.level}
                      </span>
                    )}
                  </div>
                  <p className={`text-[10px] mt-1 font-semibold leading-relaxed ${isUnlocked ? 'text-slate-650' : 'text-slate-400'}`}>
                    {rew.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Multi-user playground reset for starting completely from zero */}
      <div className="bg-red-50/20 border-2 border-dashed border-red-100 rounded-3xl p-5 text-center">
        <h4 className="text-xs font-black text-red-800 uppercase tracking-widest block mb-1">
          Demo: Probar como Usuario Nuevo
        </h4>
        <p className="text-[11px] font-semibold text-slate-500 leading-relaxed mb-4 max-w-[280px] mx-auto">
          ¿Quieres probar la experiencia completa desde cero? Restablece todos los progresos de XP, nivel y documentos en un clic.
        </p>
        <button
          onClick={resetGame}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow hover:shadow-lift transition-all flex items-center gap-1.5 mx-auto cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Restablecer Todo a Cero (0 XP)</span>
        </button>
      </div>
    </div>
  );
};
