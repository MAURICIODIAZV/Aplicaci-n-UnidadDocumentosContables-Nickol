import React from 'react';
import { useGame } from '../../context/GameContext';
import { FileSpreadsheet, ExternalLink, HelpCircle, Check, Info } from 'lucide-react';

export const ExcelView: React.FC = () => {
  const { documents, showToast } = useGame();

  // Filter documents showing only spreadsheets or excel integrated resources
  const excelDocuments = documents.filter(doc => doc.hasExcelLink === true);

  const handleOpenExcel = (docId: string, docName: string) => {
    // 1. Simulates console.log
    console.log(`Abriendo Excel para docId... ${docId}`);
    
    // 2. Shoots game contextual toast
    showToast(`Conectando con Microsoft Excel Online para "${docName}"...`, 'info');

    // 3. Simple native success alert as specified literally
    setTimeout(() => {
      window.alert(`¡Conexión Exitosa con Excel!\n\nSe ha sincronizado la planilla contable del documento: "${docName}" (${docId}).\nLos cambios realizados se consolidarán en tiempo real.`);
    }, 100);
  };

  const formatAmount = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
  };

  return (
    <div className="space-y-6 pb-24 animate-fade-in select-none max-w-md mx-auto">
      <div className="text-center px-1">
        <h2 className="text-xl font-bold text-gray-900 tracking-tight">Integraciones Excel</h2>
        <p className="text-xs text-gray-400 mt-1">
          Planillas y comprobantes consolidados con Microsoft Excel Online
        </p>
      </div>

      {/* Info Warning Container */}
      <div className="bg-emerald-50 text-emerald-800 border-2 border-dashed border-emerald-200 rounded-2xl p-4 flex items-start space-x-3">
        <Info className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div className="text-xs">
          <p className="font-bold">¿Cómo funcionan los enlaces contables?</p>
          <p className="text-emerald-700/90 mt-1 font-medium leading-relaxed">
            Cada vez que asocias una planilla o cargas un gasto `.xlsx`, habilitamos un motor en la nube. ¡Validar documentos con enlaces Excel te recompensa con <span className="font-bold">+5 XP de bono adicional!</span>
          </p>
        </div>
      </div>

      {/* Grid of Excel Integrated Documents */}
      <div className="space-y-4">
        {excelDocuments.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-gray-100 shadow-sm">
            <div className="w-12 h-12 bg-slate-50 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-3">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-gray-700">No hay planillas asociadas</p>
            <p className="text-xs text-gray-400 mt-1">
              Sube un documento y marca la casilla "Vincular planilla Excel" o usa el template rápido de auditores.
            </p>
          </div>
        ) : (
          excelDocuments.map((doc) => {
            const isCompleted = doc.status === 'completed';

            return (
              <div
                key={doc.id}
                className={`bg-white rounded-3xl p-5 border shadow-ambient hover:shadow-lift transition-all duration-300 relative overflow-hidden ${
                  isCompleted ? 'border-emerald-200' : 'border-slate-100'
                }`}
              >
                {/* Visual Accent highlight */}
                <span className="absolute left-0 top-0 bottom-0 w-1.5 bg-emerald-brand"></span>

                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3 pl-1">
                    <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-xl">
                      <FileSpreadsheet className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm truncate max-w-[180px]">
                        {doc.name}
                      </h4>
                      <p className="text-[11px] text-gray-400 mt-1 flex items-center gap-1 font-semibold">
                        <span>{doc.date}</span>
                        <span>•</span>
                        <span className="text-emerald-700">{formatAmount(doc.amount)}</span>
                      </p>
                    </div>
                  </div>

                  <span className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border flex items-center gap-1 ${
                    isCompleted
                      ? 'bg-emerald-50/50 border-emerald-100 text-emerald-700'
                      : 'bg-amber-50/50 border-amber-200 text-amber-600'
                  }`}>
                    {isCompleted ? (
                      <>
                        <Check className="w-3 h-3" />
                        <span>Completed</span>
                      </>
                    ) : (
                      <>
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                        <span>Pending</span>
                      </>
                    )}
                  </span>
                </div>

                {/* Simulated Details panel */}
                <div className="mt-3.5 bg-slate-50 border border-gray-100 rounded-2xl p-3 flex justify-between items-center text-xs">
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase font-bold">Base de Datos</span>
                    <span className="font-semibold text-gray-700">MOCK_DURABLE_S3_PATH</span>
                  </div>
                  <div className="text-right">
                    <span className="text-gray-400 block text-[10px] uppercase font-bold">Auditoría</span>
                    <span className="font-semibold text-green-700">Habilitada +5 XP</span>
                  </div>
                </div>

                {/* Interactive Action Trigger button */}
                <div className="mt-4 flex items-center justify-end">
                  <button
                    onClick={() => handleOpenExcel(doc.id, doc.name)}
                    className="inline-flex items-center gap-1.5 px-4.5 py-2.5 bg-emerald-brand hover:bg-emerald-700 text-white text-xs font-black rounded-xl shadow-md cursor-pointer transition-all duration-300 transform hover:-translate-y-0.5"
                    title="Abre la hoja de cálculo simulada"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Abrir en Excel</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
