import React from 'react';
import { useGame } from '../../context/GameContext';
import { FileText, Check, CheckCircle2, AlertTriangle, FileSpreadsheet, Sparkles, Clock } from 'lucide-react';

export const LibraryView: React.FC = () => {
  const {
    documents,
    currentSelectedDate,
    setSelectedDate,
    completeDocument,
    dateOptionsList,
    currentMultiplier,
    isEarlyBirdActive
  } = useGame();

  // Filter documents matching the currently selected day
  const filteredDocs = documents.filter(doc => doc.date === currentSelectedDate);

  // Compute validation stats of a date for the button indicators
  const getDayIndicatorType = (dateKey: string) => {
    const docs = documents.filter(d => d.date === dateKey);
    if (docs.length === 0) return 'none';
    const hasPending = docs.some(d => d.status === 'pending');
    return hasPending ? 'pending' : 'completed';
  };

  const formatAmount = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
  };

  // Dedicated HTML cards list compiler that handles status conditional blocks safely
  const renderDocsList = () => {
    if (filteredDocs.length === 0) {
      return (
        <div className="bg-white rounded-2xl p-8 text-center border-2 border-dashed border-gray-200 shadow-sm animate-fade-in">
          <div className="w-12 h-12 bg-slate-50 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-3">
            <FileText className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-gray-700">No hay documentos registrados</p>
          <p className="text-xs text-gray-400 mt-1 max-w-[240px] mx-auto leading-relaxed">
            Utiliza la pestaña central de **Subida (Upload)** para simular e inyectar un nuevo lote.
          </p>
        </div>
      );
    }

    return filteredDocs.map((doc) => {
      const isCompleted = doc.status === 'completed';
      const isExcelType = doc.name.endsWith('.xlsx') || doc.hasExcelLink;

      // Compute reward values beforehand to display in the card
      const basePoints = 10;
      const bonusValidated = doc.fieldsValidated ? 5 : 0;
      const bonusExcel = doc.hasExcelLink ? 5 : 0;
      const bonusSameDay = doc.uploadedSameDay ? 3 : 0;
      const totalBonuses = bonusValidated + bonusExcel + bonusSameDay;
      const potentialXP = Math.round((basePoints + totalBonuses) * currentMultiplier);

      return (
        <div
          key={doc.id}
          className={`bg-white rounded-3xl p-5 border shadow-ambient transition-all duration-300 relative ${
            isCompleted 
              ? 'border-emerald-100 hover:shadow-md' 
              : 'border-slate-100 ring-offset-2 ring-indigo-50 hover:ring-2 hover:shadow-lift'
          }`}
        >
          {/* Card Heading with Name & Type */}
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3 pr-2 min-w-0">
              <div className={`p-3 rounded-2xl shrink-0 ${
                isExcelType ? 'bg-emerald-50 text-emerald-600' : 'bg-indigo-50 text-indigo-600'
              }`}>
                {isExcelType ? (
                  <FileSpreadsheet className="w-6 h-6" />
                ) : (
                  <FileText className="w-6 h-6" />
                )}
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-gray-900 truncate text-sm">
                  {doc.name}
                </h4>
                <p className="text-xs text-gray-400 font-semibold mt-0.5 truncate">
                  Categoría: {doc.type} • <span className="text-indigo-brand font-bold">{formatAmount(doc.amount)}</span>
                </p>
              </div>
            </div>
            
            <div className="shrink-0">
              {isCompleted ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-700 rounded-lg text-[10px] font-bold border border-green-100">
                  <Check className="w-3 h-3" />
                  <span>Completado</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-700 rounded-lg text-[10px] font-bold border border-amber-200">
                  <Clock className="w-3 h-3 text-amber-500 animate-spin-slow" />
                  <span>Pendiente</span>
                </span>
              )}
            </div>
          </div>

          {/* Tactical Validation Indicators Drawer */}
          <div className="mt-4 bg-[#f8f9fa] rounded-2xl p-3 border border-gray-100 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-gray-500 font-medium">Formulario campos validados:</span>
              <span className={`font-bold flex items-center gap-1 ${doc.fieldsValidated ? 'text-green-600' : 'text-amber-600'}`}>
                {doc.fieldsValidated ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>Sí (+5 XP)</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span>Parcial (0 XP)</span>
                  </>
                )}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-500 font-medium">Enlace a Excel:</span>
              <span className={`font-bold flex items-center gap-1 ${doc.hasExcelLink ? 'text-green-600' : 'text-gray-400'}`}>
                {doc.hasExcelLink ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>Sí (+5 XP)</span>
                  </>
                ) : (
                  <span>No (0 XP)</span>
                )}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-500 font-medium">Mismo día de carga:</span>
              <span className={`font-bold flex items-center gap-1 ${doc.uploadedSameDay ? 'text-green-600' : 'text-gray-400'}`}>
                {doc.uploadedSameDay ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>Sí (+3 XP)</span>
                  </>
                ) : (
                  <span>No (0 XP)</span>
                )}
              </span>
            </div>
          </div>

          {/* Claim Points / Complete action */}
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-gray-400 tracking-wider block uppercase">Recompensa Estimada</span>
              <span className="text-xs font-bold text-emerald-brand flex items-center gap-0.5 mt-0.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-500 inline fill-emerald-100 animate-pulse" />
                <span>+{potentialXP} XP</span>
                {isEarlyBirdActive && <span className="text-[9px] text-amber-600 font-extrabold ml-1 bg-amber-50 px-1 rounded">(1.5x)</span>}
              </span>
            </div>

            {isCompleted ? (
              <button
                disabled
                className="px-3 py-1.5 bg-slate-100 text-slate-400 font-bold text-xs rounded-xl flex items-center gap-1 cursor-not-allowed border border-slate-200"
              >
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>Reclamado</span>
              </button>
            ) : (
              <button
                id={`complete-btn-${doc.id}`}
                onClick={(e) => completeDocument(doc.id, e)}
                className="px-4 py-2 bg-indigo-brand hover:bg-indigo-brand-hover text-white font-extrabold text-xs rounded-xl shadow-md hover:shadow-lift transition-all duration-300 transform hover:-translate-y-0.5 flex items-center gap-1 cursor-pointer"
              >
                <span>Validar y Ganar XP</span>
              </button>
            )}
          </div>
        </div>
      );
    });
  };

  return (
    <div className="space-y-6 pb-24 animate-fade-in select-none max-w-md mx-auto">
      {/* Dynamic Selector de Fecha: 7 buttons formatted into an horizontal sliding dock */}
      <div className="bg-white rounded-2xl p-4 shadow-ambient border border-gray-100">
        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-3 text-center">
          Timeline de Validación
        </label>
        
        <div className="grid grid-cols-4 xs:grid-cols-7 gap-2 overflow-x-auto pb-1">
          {dateOptionsList.map((opt) => {
            const isSelected = currentSelectedDate === opt.key;
            const indicatorType = getDayIndicatorType(opt.key);

            return (
              <button
                key={opt.key}
                onClick={() => setSelectedDate(opt.key)}
                className={`relative flex flex-col items-center justify-between py-2.5 px-0.5 min-h-[56px] rounded-xl transition-colors duration-300 focus:outline-none cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-brand text-white shadow-md'
                    : 'bg-slate-50 hover:bg-slate-100 text-gray-500 hover:text-gray-800'
                }`}
              >
                {/* Micro badge indicator on date buttons */}
                {indicatorType === 'pending' && (
                  <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5 z-20">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 border border-white" title="Contiene documentos pendientes"></span>
                  </span>
                )}
                {indicatorType === 'completed' && (
                  <span className="absolute -top-1 -right-1 bg-green-500 border border-white text-white rounded-full p-0.5 text-[8px] flex items-center justify-center w-4 h-4 z-20 font-bold shadow-sm" title="¡Día completado!">
                    <Check className="w-2.5 h-2.5 stroke-[4.5]" />
                  </span>
                )}

                <span className="text-[9px] font-bold tracking-tight opacity-75 uppercase">
                  {opt.relative.replace(" antes", "a").replace(" después", "d").replace("día", "d")}
                </span>
                <span className="text-sm font-extrabold mt-1">{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Header of Filtered Items */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h3 className="text-base font-bold text-gray-800">
            Documentos para: <span className="text-indigo-brand">{currentSelectedDate}</span>
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">Mostrando {filteredDocs.length} elemento(s)</p>
        </div>
        
        {isEarlyBirdActive && (
          <div className="bg-amber-50 text-amber-750 text-[10px] font-bold rounded-lg py-1 px-2.5 border border-amber-200.5 flex items-center gap-1 shrink-0">
            <Sparkles className="w-3 h-3 text-amber-500 animate-pulse" />
            <span>1.5x Early Bird activo</span>
          </div>
        )}
      </div>

      {/* Compiles and renders the filtered list array */}
      <div className="space-y-4">
        {renderDocsList()}
      </div>
    </div>
  );
};
