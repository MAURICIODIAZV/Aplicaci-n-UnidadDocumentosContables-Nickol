import React, { useState, useRef, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { Upload, FileUp, Database, HelpCircle, Check, Loader2, DollarSign, FileSpreadsheet, Percent } from 'lucide-react';

export const UploadView: React.FC = () => {
  const { addDocument, pendingDocToUpload, setPendingDocToUpload, showToast } = useGame();
  
  // Local form attributes
  const [docName, setDocName] = useState('');
  const [docType, setDocType] = useState('Factura');
  const [customCategory, setCustomCategory] = useState('');
  const [docAmount, setDocAmount] = useState('180.00');
  const [hasExcel, setHasExcel] = useState(false);
  const [isValidated, setIsValidated] = useState(true);
  const [isSameDay, setIsSameDay] = useState(true);

  const [selectedFileObj, setSelectedFileObj] = useState<{ dataUrl: string; mime: string } | null>(null);

  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto pre-populate form if we came from a pending quest
  useEffect(() => {
    if (pendingDocToUpload) {
      setDocName(pendingDocToUpload.name);
      
      const type = pendingDocToUpload.type;
      if ([
        'Factura', 'Nota de crédito', 'Nota de débito', 'Recibo de pago',
        'Orden de compra', 'Remito / Albarán', 'Estado de cuenta bancario',
        'Comprobante de transferencia'
      ].includes(type)) {
        setDocType(type);
        setCustomCategory('');
      } else {
        setDocType('Otro');
        setCustomCategory(type);
      }
      
      setDocAmount(pendingDocToUpload.amount.toFixed(2));
      setHasExcel(pendingDocToUpload.hasExcelLink);
      setIsValidated(pendingDocToUpload.fieldsValidated);
      setIsSameDay(pendingDocToUpload.uploadedSameDay);
    }
  }, [pendingDocToUpload]);

  // Drag handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelected(e.target.files[0]);
    }
  };

  // Helper populate form based on dropped mock file
  const handleFileSelected = (file: File) => {
    setDocName(file.name);
    
    // Read actual file content as Data URL
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result && typeof e.target.result === 'string') {
        setSelectedFileObj({
          dataUrl: e.target.result,
          mime: file.type || 'application/octet-stream'
        });
      }
    };
    reader.readAsDataURL(file);

    // Auto detect spreadsheet
    const isSpreadsheet = file.name.endsWith('.xlsx') || file.name.endsWith('.xls') || file.name.endsWith('.csv');
    if (isSpreadsheet) {
      setDocType('Estado de cuenta bancario');
      setHasExcel(true);
    } else {
      setDocType('Factura');
    }
    
    // Pick responsive fake amount based on string length
    const mockAmt = (file.size ? (file.size % 1200) + 15.50 : Math.round(Math.random() * 850) + 20).toFixed(2);
    setDocAmount(mockAmt);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Auto pre-fill with realistic examples to simplify testing
  const selectExampleDoc = (name: string, type: string, amount: string, excel: boolean) => {
    setDocName(name);
    if ([
      'Factura', 'Nota de crédito', 'Nota de débito', 'Recibo de pago',
      'Orden de compra', 'Remito / Albarán', 'Estado de cuenta bancario',
      'Comprobante de transferencia'
    ].includes(type)) {
      setDocType(type);
      setCustomCategory('');
    } else {
      setDocType('Otro');
      setCustomCategory(type);
    }
    setDocAmount(amount);
    setHasExcel(excel);
    setIsValidated(true);
    setIsSameDay(true);

    // Create a mock Data URL for the example template so they get a real file download too!
    const textualContent = `==================================================
DOCUMENTO DE EJEMPLO DE AUDITORÍA
==================================================
Nombre del Archivo: ${name}
Categoría / Tipo: ${type}
Importe de Operación: $${amount} USD
Planilla Excel Vinculada: ${excel ? 'SÍ' : 'NO'}
Auditado el: ${new Date().toLocaleDateString('es-AR')}
==================================================
Este documento simula la información física o digital
del comprobante seleccionado para verificar los cálculos.
==================================================`;
    try {
      const base64Data = btoa(unescape(encodeURIComponent(textualContent)));
      setSelectedFileObj({
        dataUrl: `data:text/plain;base64,${base64Data}`,
        mime: 'text/plain'
      });
    } catch (e) {
      setSelectedFileObj(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName.trim()) {
      showToast('Por favor ingresa un nombre para el documento.', 'error');
      return;
    }
    if (!selectedFileObj) {
      showToast('⚠️ Debes subir un documento antes de guardar.', 'error');
      return;
    }

    setLoading(true);
    
    // Map properties for insertion
    await addDocument({
      name: docName,
      type: docType === 'Otro' ? (customCategory.trim() || 'Otro') : docType,
      amount: parseFloat(docAmount) || 100,
      hasExcelLink: hasExcel,
      fieldsValidated: isValidated,
      uploadedSameDay: isSameDay,
      date: "Hoy", // Injects into current date "Hoy"
      fileDataUrl: selectedFileObj?.dataUrl || undefined,
      fileMime: selectedFileObj?.mime || undefined
    });

    // Reset local selection states
    setSelectedFileObj(null);
    setLoading(false);
  };

  return (
    <div className="space-y-6 pb-24 animate-fade-in select-none max-w-md mx-auto">
      <div className="px-1 text-center">
        <h2 className="text-xl font-bold text-gray-900 tracking-tight">Simulador de Subida</h2>
        <p className="text-xs text-gray-400 mt-1">Sube archivos PDF o planillas Excel para cargarlos en el timeline</p>
      </div>

      {pendingDocToUpload && (
        <div className="bg-amber-50/80 backdrop-blur-sm border-2 border-dashed border-amber-200 rounded-3xl p-4 flex items-center justify-between text-xs text-amber-950 animate-bounce-slow">
          <div className="flex items-center space-x-3 min-w-0">
            <span className="text-2xl shrink-0">📤</span>
            <div className="min-w-0">
              <p className="font-extrabold text-amber-900">Misión pendiente seleccionada</p>
              <p className="text-[11px] text-amber-700 truncate">Sustituyendo: <b className="font-black text-amber-950">{pendingDocToUpload.name}</b></p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setPendingDocToUpload(null);
              // Clean up form to default values
              setDocName('');
              setDocType('Factura');
              setCustomCategory('');
              setDocAmount('180.00');
              setHasExcel(false);
              setIsValidated(true);
              setIsSameDay(true);
            }}
            className="px-3 py-1.5 bg-white text-[10px] font-extrabold text-amber-800 rounded-xl hover:text-red-600 hover:bg-red-50 border border-amber-200 shadow-sm active:scale-95 transition-all shrink-0 cursor-pointer"
          >
            Cancelar
          </button>
        </div>
      )}

      {/* Dotted drag and drop visual frame */}
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={triggerFileInput}
        className={`border-2 border-dashed rounded-3xl p-6 text-center cursor-pointer transition-all duration-300 relative group ${
          dragActive
            ? 'border-indigo-brand bg-indigo-50/50 scale-102 shadow-inner'
            : 'border-gray-200.5 bg-white hover:border-indigo-brand hover:bg-slate-50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileChange}
          accept=".pdf,.xlsx,.csv,.xls,.doc,.docx"
        />
        
        <div className="w-12 h-12 bg-indigo-50 text-indigo-brand rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
          <FileUp className="w-6 h-6" />
        </div>

        <p className="text-xs font-bold text-gray-700">Arrastra tu documento aquí o haz click para explorar</p>
        <p className="text-[10px] text-gray-400 mt-1">Acepta formatos .PDF, .XLSX, y planillas de facturación</p>
      </div>

      {/* Quick Test templates */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm space-y-2">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Plantillas Rápidas para Test</span>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <button
            type="button"
            onClick={() => selectExampleDoc('Recibo_Luz_Junio.pdf', 'Recibo de pago', '82.40', false)}
            className="p-2 text-left bg-slate-50 hover:bg-indigo-50 hover:text-indigo-900 rounded-xl transition-colors border border-gray-100 font-semibold truncate"
          >
            💡 Recibo_Luz.pdf ($82)
          </button>
          <button
            type="button"
            onClick={() => selectExampleDoc('Honorarios_Auditores.xlsx', 'Estado de cuenta bancario', '650.00', true)}
            className="p-2 text-left bg-slate-50 hover:bg-emerald-50 hover:text-emerald-900 rounded-xl transition-colors border border-gray-100 font-semibold truncate"
          >
            📊 Auditores.xlsx ($650)
          </button>
        </div>
      </div>

      {/* Upload Details Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 shadow-ambient border border-gray-100 space-y-4">
        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider pb-2 border-b border-gray-100">
          Metadatos del Documento
        </h3>

        {/* Input File Name */}
        <div>
          <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Nombre del Archivo</label>
          <input
            type="text"
            required
            value={docName}
            onChange={(e) => setDocName(e.target.value)}
            placeholder="Ej: Factura_Proveedor_002.pdf"
            className="w-full text-xs font-medium border border-gray-200 focus:border-indigo-brand rounded-xl px-3 py-2.5 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition-all outline-none"
          />
        </div>

        {/* Amount & Type Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Categoría</label>
            <select
              value={docType}
              onChange={(e) => setDocType(e.target.value)}
              className="w-full text-xs font-semibold border border-gray-200 rounded-xl px-3 py-2.5 bg-slate-50 outline-none focus:border-indigo-style focus:ring-2 focus:ring-indigo-50"
            >
              <option value="Factura">📄 Factura</option>
              <option value="Nota de crédito">📝 Nota de crédito</option>
              <option value="Nota de débito">📉 Nota de débito</option>
              <option value="Recibo de pago">💵 Recibo de pago</option>
              <option value="Orden de compra">🛍️ Orden de compra</option>
              <option value="Remito / Albarán">📦 Remito / Albarán</option>
              <option value="Estado de cuenta bancario">🏦 Estado de cuenta bancario</option>
              <option value="Comprobante de transferencia">💸 Comprobante de transferencia</option>
              <option value="Otro">⚙️ Otro</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Importe (USD)</label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-400 font-bold text-xs">$</span>
              <input
                type="number"
                step="0.01"
                required
                value={docAmount}
                onChange={(e) => setDocAmount(e.target.value)}
                placeholder="150.00"
                className="w-full text-xs font-bold border border-gray-200 focus:border-indigo-brand rounded-xl pl-6 pr-3 py-2.5 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition-all outline-none"
              />
            </div>
          </div>
        </div>

        {/* Input Custom Category (only if "Otro" is selected) */}
        {docType === 'Otro' && (
          <div className="animate-fade-in-down duration-300">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Especificar categoría</label>
            <input
              type="text"
              required
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              placeholder="Ej: Impuestos, Combustible, etc."
              className="w-full text-xs font-semibold border border-gray-200 focus:border-indigo-brand rounded-xl px-3 py-2.5 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition-all outline-none"
            />
          </div>
        )}

        {/* Bonus Gamification Configuration Switches */}
        <div className="space-y-3 pt-3">
          <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest block">Ajustes de Gamificación</span>
          
          <label className="flex items-center justify-between p-2 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors border border-gray-100 cursor-pointer">
            <div className="flex-1">
              <span className="text-xs font-bold text-gray-800 block">Campos validados (+5 XP)</span>
              <span className="text-[9px] text-gray-400">Verifica montos, fechas e identificador fiscal.</span>
            </div>
            <input
              type="checkbox"
              checked={isValidated}
              onChange={(e) => setIsValidated(e.target.checked)}
              className="w-4.5 h-4.5 rounded text-indigo-brand focus:ring-indigo-200 border-gray-300 transition-colors"
            />
          </label>

          <label className="flex items-center justify-between p-2 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors border border-gray-100 cursor-pointer">
            <div className="flex-1">
              <span className="text-xs font-bold text-gray-800 block">Vincular planilla Excel (+5 XP)</span>
              <span className="text-[9px] text-gray-400">Genera enlace para auditar directamente en Excel.</span>
            </div>
            <input
              type="checkbox"
              checked={hasExcel}
              onChange={(e) => setHasExcel(e.target.checked)}
              className="w-4.5 h-4.5 rounded text-indigo-brand focus:ring-indigo-200 border-gray-300 transition-colors"
            />
          </label>

          <label className="flex items-center justify-between p-2 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors border border-gray-100 cursor-pointer">
            <div className="flex-1">
              <span className="text-xs font-bold text-gray-800 block">Subido el mismo día (+3 XP)</span>
              <span className="text-[9px] text-gray-400">Rinde bonificación si el comprobante es de hoy.</span>
            </div>
            <input
              type="checkbox"
              checked={isSameDay}
              onChange={(e) => setIsSameDay(e.target.checked)}
              className="w-4.5 h-4.5 rounded text-indigo-brand focus:ring-indigo-200 border-gray-300 transition-colors"
            />
          </label>
        </div>

        {/* Save button with loading simulator */}
        <button
          type="submit"
          disabled={loading || !docName.trim() || !selectedFileObj}
          className="w-full py-3.5 bg-indigo-brand hover:bg-indigo-brand-hover disabled:bg-slate-200 disabled:text-slate-400 text-white font-extrabold text-sm rounded-xl shadow-md transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Guardando en el servidor...</span>
            </>
          ) : (
            <>
              <Database className="w-4 h-4" />
              <span>Guardar en Base de Datos</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
