import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Award, Zap, HelpCircle, ChevronRight, ChevronDown, CheckCircle2, FileSpreadsheet, Calendar, Sparkles } from 'lucide-react';

export const CircularProgressBar: React.FC = () => {
  const { stats, level, levelProgress, isEarlyBirdActive, currentMultiplier } = useGame();
  const [showXPExplanation, setShowXPExplanation] = useState(true);

  const radius = 80;
  const strokeWidth = 12;
  const circumference = 2 * Math.PI * radius;
  // Calculate stroke dash offset representing current level progress (0 to 99)
  const offset = circumference - (levelProgress / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-4 text-center select-none animate-fade-in">
      <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">Estado de Misiones</h2>
      
      {/* Dynamic Multiplier Badge */}
      <div className="mt-2 mb-5">
        <span className={`inline-flex items-center space-x-1 px-4 py-1.5 rounded-full text-xs font-semibold shadow-sm border transition-all duration-300 ${
          isEarlyBirdActive 
            ? 'bg-amber-100 text-amber-800 border-amber-300 scale-105' 
            : 'bg-indigo-50 text-indigo-800 border-indigo-200'
        }`}>
          <Zap className={`w-3.5 h-3.5 ${isEarlyBirdActive ? 'text-amber-500 fill-amber-500 animate-pulse' : 'text-indigo-400'}`} />
          <span>{isEarlyBirdActive ? `⚡ Early Bird ${currentMultiplier.toFixed(1)}x Activo` : `⚡ Estándar ${currentMultiplier.toFixed(1)}x`}</span>
        </span>
      </div>

      <div className="relative w-52 h-52 flex items-center justify-center">
        {/* Ambient background shadow inside the wheel container */}
        <div className="absolute inset-4 bg-white rounded-full shadow-[inset_0_2px_8px_rgba(0,0,0,0.06),_0_10px_20px_rgba(77,68,227,0.05)] z-0"></div>
        
        <svg className="w-full h-full transform -rotate-90 z-10" viewBox="0 0 200 200">
          <defs>
            {/* Smooth linear gradient for the progress bar to give a "liquid" tactile feel */}
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#6ffbbe" />
            </linearGradient>
            <filter id="shadow">
              <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#10b981" floodOpacity="0.3" />
            </filter>
          </defs>
          
          {/* Base Track Circle with Inner Recessed Shadow Appearance */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            className="stroke-gray-100 fill-none"
            strokeWidth={strokeWidth}
          />
          
          {/* Active Progress Fill with Smooth Transitions */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke="url(#progressGradient)"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
            style={{ filter: 'url(#shadow)' }}
          />
        </svg>

        {/* Absolute Centered Level Typography Content */}
        <div className="absolute flex flex-col items-center justify-center z-20">
          <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-1">NIVEL</span>
          <span className="text-5xl font-extrabold text-indigo-brand leading-none tracking-tight">
            {level}
          </span>
          <span className="text-xs font-semibold text-gray-500 mt-2 bg-slate-50 px-2.5 py-1 rounded-full border border-gray-100">
            <span className="font-bold text-gray-800">{levelProgress}</span> / 100 XP
          </span>
        </div>
      </div>

      {/* Helper text illustrating progress */}
      <p className="text-xs text-gray-400 mt-4 max-w-[260px] leading-relaxed">
        ¡Excelente progreso! Te faltan <span className="font-bold text-indigo-brand">{100 - levelProgress} XP</span> para subir al <span className="font-bold text-indigo-brand">Nivel {level + 1}</span> y ganar mayores bonificaciones.
      </p>

      {/* Structured Beautiful Explanation of the XP System */}
      <div className="w-full mt-6 text-left border-t border-gray-100 pt-4">
        <button
          onClick={() => setShowXPExplanation(!showXPExplanation)}
          className="flex items-center justify-between w-full text-xs font-bold text-indigo-brand hover:text-indigo-900 transition-colors focus:outline-none mb-3"
        >
          <span className="flex items-center gap-1.5 uppercase tracking-wider">
            <HelpCircle className="w-4 h-4 shrink-0 text-indigo-brand" />
            ¿Cómo se calculan los XP?
          </span>
          {showXPExplanation ? <ChevronDown className="w-4 h-4 shrink-0" /> : <ChevronRight className="w-4 h-4 shrink-0" />}
        </button>

        {showXPExplanation && (
          <div className="bg-slate-50 border border-gray-100 rounded-2xl p-3.5 space-y-3 text-[11px] font-medium text-slate-600 animate-fade-in">
            <p className="leading-relaxed">
              Cada documento contable validado te otorga XP base y bonos adicionales según los criterios cumplidos. Todo el total acumulado de cada documento se multiplica según tu multiplicador activo.
            </p>

            <div className="grid grid-cols-1 gap-2 border-t border-slate-200/50 pt-2.5">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-slate-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-gray-500" />
                  <span>Validación de documento (Base)</span>
                </span>
                <span className="font-black text-indigo-brand shrink-0">+10 XP</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-slate-700">
                  <Award className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Campos de formulario correctos</span>
                </span>
                <span className="font-black text-emerald-brand shrink-0">+5 XP</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-slate-700">
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Planilla Excel asociada</span>
                </span>
                <span className="font-black text-emerald-brand shrink-0">+5 XP</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-slate-700">
                  <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Carga realizada el mismo día</span>
                </span>
                <span className="font-black text-emerald-brand shrink-0">+3 XP</span>
              </div>
            </div>

            <div className="border-t border-slate-200/50 pt-2 flex items-start gap-1.5 bg-amber-50/50 p-2 rounded-xl text-amber-900 leading-relaxed font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0 fill-amber-100 animate-pulse mt-0.5" />
              <span>
                Multiplicador 1.5x Early Bird: Se aplica a la suma de todos los puntos anteriores si procesas tus documentos antes de las 12:00 PM o activas el multiplicador desde tu Perfil.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
