import React, { useMemo } from 'react';
import { useGame } from '../../context/GameContext';
import { CircularProgressBar } from '../CircularProgressBar';
import { FileCode, FileText, CheckCircle2, Clock, Play, Sparkles } from 'lucide-react';
import { getDailyCategoriesForDate, getFileNameForCategory, getAmountForCategory } from '../../mockData';
import { Document } from '../../types';

export const ProgressView: React.FC = () => {
  const { documents, stats, setView, setSelectedDate, setPendingDocToUpload } = useGame();

  // Generate today's missions and check if they are already completed in the DB
  const recentDocs = useMemo(() => {
    const dailyCats = getDailyCategoriesForDate(new Date());
    
    return dailyCats.map((cat, idx) => {
      // Check if user already uploaded this specific category for "Hoy"
      const existingDoc = documents.find(d => d.type === cat && d.date === "Hoy");
      
      if (existingDoc) {
        return existingDoc;
      }

      // Otherwise, return a pending mission template
      const isExcel = cat.endsWith('bancario') || cat.includes('cuenta') || cat.endsWith('transferencia');
      const pendingDoc: Document = {
        id: `mission-${idx + 1}-${Date.now()}`, // unique id so it can be replaced when uploaded
        type: cat,
        name: getFileNameForCategory(cat),
        date: "Hoy",
        amount: getAmountForCategory(cat),
        status: "pending",
        hasExcelLink: isExcel,
        fieldsValidated: true,
        uploadedSameDay: true
      };
      return pendingDoc;
    });
  }, [documents]);

  // Helper format currency
  const formatAmount = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
  };

  return (
    <div className="space-y-6 pb-24 animate-fade-in select-none max-w-md mx-auto">
      {/* Visual Level indicator header */}
      <div className="bg-gradient-to-r from-indigo-brand to-purple-600 rounded-2xl p-4 text-white shadow-ambient flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-white/10 rounded-xl">
            <Sparkles className="w-5 h-5 text-amber-300 animate-spin-slow" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-100">Progreso Total</h3>
            <p className="text-sm font-medium">Completados: <span className="font-bold text-emerald-brand-light">{stats.totalDocsProcessed}</span> doc.</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-indigo-200">Racha de estudio</p>
          <p className="text-base font-bold text-amber-300">🔥 {stats.streakDays} días activos</p>
        </div>
      </div>

      {/* Main Circular progress wheel */}
      <div className="bg-white rounded-2xl p-4 shadow-ambient">
        <CircularProgressBar />
      </div>

      {/* Recent Quests Panel */}
      <div id="recent-quests-container" className="bg-white rounded-3xl shadow-ambient p-6">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
          <h3 className="text-lg font-bold text-gray-900 tracking-tight">Misiones Recientes</h3>
          <span className="text-xs font-bold text-indigo-brand px-2.5 py-1 bg-indigo-50 rounded-full">
            Top Recientes
          </span>
        </div>

        <div className="space-y-4">
          {recentDocs.map((doc) => {
            const isCompleted = doc.status === 'completed';
            const isExcelType = doc.name.endsWith('.xlsx') || doc.hasExcelLink;

            return (
              <div
                key={doc.id}
                onClick={() => {
                  if (isCompleted) {
                    setSelectedDate(doc.date);
                    setView('Library');
                  } else {
                    setPendingDocToUpload(doc);
                    setView('Upload');
                  }
                }}
                className="flex items-center justify-between p-3.5 bg-[#f8f9fa] hover:bg-indigo-50/40 border border-gray-100 hover:border-indigo-100 rounded-2xl transition-all duration-300 group hover:translate-x-1 cursor-pointer"
                title={isCompleted ? "Ver documento en tu biblioteca" : "Subir este comprobante pendiente"}
              >
                {/* Visual Left Badge File Icon */}
                <div className="flex items-center space-x-3.5 min-w-0">
                  <div className={`p-3 rounded-xl flex items-center justify-center ${
                    isExcelType 
                      ? 'bg-emerald-50 text-emerald-600' 
                      : 'bg-indigo-50 text-indigo-600'
                   }`}>
                    {isExcelType ? (
                      <FileCode className="w-5 h-5" />
                    ) : (
                      <FileText className="w-5 h-5" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-gray-800 truncate group-hover:text-indigo-brand transition-colors">
                      {doc.name}
                    </p>
                    <p className="text-xs text-gray-400 mt-1 flex items-center gap-1 font-medium">
                      <span>{doc.date}</span>
                      <span>•</span>
                      <span className="font-semibold text-gray-500">
                        {formatAmount(doc.amount)}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Right Interactive Status Controller */}
                <div>
                  {isCompleted ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#6cf8bb]/20 text-emerald-brand rounded-full text-xs font-bold border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-brand" />
                      <span>Completado</span>
                    </span>
                  ) : (
                    <button
                      id={`complete-btn-${doc.id}`}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-amber-50 hover:bg-indigo-brand hover:text-white text-yellow-750 hover:border-indigo-300 border border-amber-200 rounded-full text-xs font-bold transition-all duration-300 cursor-pointer shadow-sm hover:shadow-ambient"
                      title="Sube este documento para completar la misión"
                    >
                      <Clock className="w-3.5 h-3.5 text-amber-600 group-hover:hidden" />
                      <Play className="w-3 h-3 text-white hidden group-hover:inline animate-pulse" />
                      <span>Pendiente</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
