import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { Document } from '../../types';
import {
  FileText,
  FileSpreadsheet,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  Download,
  X,
  FileCheck,
  Truck,
  TrendingDown,
  TrendingUp,
  CreditCard,
  ArrowUpRight,
  FolderOpen,
  Trash2
} from 'lucide-react';

export const HistoryView: React.FC = () => {
  const { documents, setSelectedDate, setView, deleteDocument, showToast } = useGame();
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [docToDelete, setDocToDelete] = useState<Document | null>(null);

  // Sorting order of the dates
  const dateSortingOrder = ["May 29", "May 30", "May 31", "Hoy", "Jun 02", "Jun 03", "Jun 04"];

  // Filter and sort completed and pending documents
  const completedDocs = [...documents]
    .filter(doc => doc.status === 'completed')
    .sort((a, b) => {
      const dateDiff = dateSortingOrder.indexOf(b.date) - dateSortingOrder.indexOf(a.date);
      if (dateDiff !== 0) return dateDiff;
      return a.name.localeCompare(b.name);
    });

  const pendingDocs = [...documents]
    .filter(doc => doc.status === 'pending')
    .sort((a, b) => {
      const dateDiff = dateSortingOrder.indexOf(b.date) - dateSortingOrder.indexOf(a.date);
      if (dateDiff !== 0) return dateDiff;
      return a.name.localeCompare(b.name);
    });

  const getCategoryIcon = (category: string) => {
    const catLower = category.toLowerCase();
    if (catLower.includes('factura')) return <FileText className="w-5 h-5 text-indigo-600" />;
    if (catLower.includes('crédito') || catLower.includes('credito')) return <TrendingDown className="w-5 h-5 text-red-500" />;
    if (catLower.includes('débito') || catLower.includes('debito')) return <TrendingUp className="w-5 h-5 text-orange-500" />;
    if (catLower.includes('recibo')) return <CreditCard className="w-5 h-5 text-emerald-600" />;
    if (catLower.includes('orden')) return <FileCheck className="w-5 h-5 text-blue-600" />;
    if (catLower.includes('remito') || catLower.includes('albarán') || catLower.includes('albaran')) return <Truck className="w-5 h-5 text-amber-600" />;
    if (catLower.includes('cuenta') || catLower.includes('bancario')) return <FileSpreadsheet className="w-5 h-5 text-emerald-600" />;
    if (catLower.includes('transferencia')) return <ArrowUpRight className="w-5 h-5 text-teal-600" />;
    return <FileText className="w-5 h-5 text-slate-500" />;
  };

  const getCategoryBadgeClass = (category: string) => {
    const catLower = category.toLowerCase();
    if (catLower.includes('factura')) return 'bg-indigo-50 text-indigo-700 border-indigo-100';
    if (catLower.includes('crédito') || catLower.includes('credito')) return 'bg-red-50 text-red-700 border-red-100';
    if (catLower.includes('débito') || catLower.includes('debito')) return 'bg-orange-50 text-orange-700 border-orange-100';
    if (catLower.includes('recibo')) return 'bg-emerald-50 text-emerald-700 border-emerald-100';
    if (catLower.includes('orden')) return 'bg-blue-50 text-blue-700 border-blue-100';
    if (catLower.includes('remito') || catLower.includes('albarán') || catLower.includes('albaran')) return 'bg-amber-50 text-amber-700 border-amber-100';
    if (catLower.includes('cuenta') || catLower.includes('bancario')) return 'bg-teal-50 text-teal-700 border-teal-100';
    if (catLower.includes('transferencia')) return 'bg-cyan-50 text-cyan-700 border-cyan-100';
    return 'bg-slate-100 text-slate-700 border-slate-200';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  // Helper to generate custom invoice details for the previewer
  const renderDocumentBody = (doc: Document) => {
    const type = doc.type || 'Otro';
    const isCompleted = doc.status === 'completed';

    if (isCompleted) {
      return (
        <div className="flex flex-col items-center justify-center py-10 px-4 text-center space-y-3">
          <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center border border-emerald-100">
            <CheckCircle2 className="w-6 h-6 text-emerald-500" />
          </div>
          <p className="text-xs font-black text-slate-800">Documento Procesado</p>
          <p className="text-[11px] text-gray-400 leading-relaxed max-w-[240px]">
            La información ha sido debidamente validada y archivada. No se requiere revisión adicional.
          </p>
        </div>
      );
    }

    switch (type) {
      case 'Factura':
        return (
          <div className="space-y-4">
            <div className="border-b border-gray-100 pb-3">
              <div className="flex justify-between text-xs text-gray-500 font-semibold uppercase tracking-wider">
                <span>Proveedor</span>
                <span>Factura Nº</span>
              </div>
              <div className="flex justify-between text-sm font-black text-slate-900 mt-1">
                <span>GL-CORP SUPPLIES S.A.</span>
                <span>FC-2026-94012</span>
              </div>
              <p className="text-[11px] text-gray-400 mt-0.5">CUIT: 30-74932084-2 • Buenos Aires, Arg</p>
            </div>

            {!isCompleted && (
              <div className="space-y-2">
                <span className="text-[11px] font-black uppercase text-gray-400 tracking-widest block">Ítem Descripción</span>
                <div className="bg-slate-50 rounded-2xl p-3 text-xs space-y-2">
                  <div className="flex justify-between py-1 border-b border-slate-150">
                    <span className="font-semibold text-slate-700">Licencias de Software Cloud Plan Pro x3</span>
                    <span className="font-extrabold text-slate-900">{formatCurrency(doc.amount * 0.6)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-150">
                    <span className="font-semibold text-slate-700">Soporte Técnico Preventivo Mensual</span>
                    <span className="font-extrabold text-slate-900">{formatCurrency(doc.amount * 0.226)}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="font-semibold text-slate-700">Consultoría e Implementación Inicial</span>
                    <span className="font-extrabold text-slate-900">{formatCurrency(doc.amount * 0.174)}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col items-end space-y-1.5 text-xs pt-2">
              <div className="flex justify-between w-40 font-semibold text-gray-500">
                <span>Subtotal:</span>
                <span>{formatCurrency(doc.amount * 0.826)}</span>
              </div>
              <div className="flex justify-between w-40 font-semibold text-gray-500">
                <span>IVA (21%):</span>
                <span>{formatCurrency(doc.amount * 0.174)}</span>
              </div>
              <div className="flex justify-between w-40 font-black text-slate-900 border-t border-slate-200 pt-1.5 text-sm">
                <span>Total Gasto:</span>
                <span className="text-indigo-600">{formatCurrency(doc.amount)}</span>
              </div>
            </div>
          </div>
        );

      case 'Nota de crédito':
        return (
          <div className="space-y-4">
            <div className="border-b border-red-100 bg-red-50/50 rounded-2xl p-3 pb-3">
              <div className="flex justify-between text-[11px] text-red-800 font-bold uppercase tracking-wider">
                <span>Emisor</span>
                <span>Nota de Crédito Nº</span>
              </div>
              <div className="flex justify-between text-sm font-black text-red-950 mt-1">
                <span>DISTRIBUIDORA SUR S.A.</span>
                <span>NC-0010-48202</span>
              </div>
              <p className="text-[10px] text-red-700/80 mt-1.5 font-bold">
                ⚠️ Documento de compensación / Anulación / Descuento comercial
              </p>
            </div>

            <div className="space-y-1.5 bg-slate-50 rounded-2xl p-3 text-xs">
              <div className="flex justify-between text-[10px] text-gray-400 font-bold uppercase">
                <span>Motivo de emisión</span>
                <span>Doc Ref</span>
              </div>
              <div className="flex justify-between font-extrabold text-slate-800 mt-1">
                <span>Devolución de mercadería defectuosa</span>
                <span className="font-semibold">FC-0004-9218</span>
              </div>
              <div className="mt-3 pt-2.5 border-t border-slate-200 flex justify-between items-center text-sm">
                <span className="font-bold text-slate-500">Monto Bonif. Total:</span>
                <span className="font-black text-red-600">-{formatCurrency(doc.amount)}</span>
              </div>
            </div>
          </div>
        );

      case 'Nota de débito':
        return (
          <div className="space-y-4">
            <div className="border-b border-orange-100 bg-orange-50/50 rounded-2xl p-3 pb-3">
              <div className="flex justify-between text-[11px] text-orange-850 font-bold uppercase tracking-wider">
                <span>Emisor</span>
                <span>Nota de Débito Nº</span>
              </div>
              <div className="flex justify-between text-sm font-black text-orange-950 mt-1">
                <span>LOGÍSTICA FEDERAL S.A.</span>
                <span>ND-2026-00412</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="bg-slate-50 rounded-2xl p-3 text-xs space-y-2">
                <div className="flex justify-between text-[10px] text-gray-400 font-bold uppercase">
                  <span>Concepto Cargo Extra</span>
                  <span>Monto</span>
                </div>
                <div className="flex justify-between font-semibold text-slate-705 mt-1">
                  <span>Intereses por pago diferido (mora de 15 días)</span>
                  <span className="font-bold text-slate-900">{formatCurrency(doc.amount * 0.7)}</span>
                </div>
                <div className="flex justify-between font-semibold text-slate-705">
                  <span>Gastos administrativos de reintegración bancaria</span>
                  <span className="font-bold text-slate-900">{formatCurrency(doc.amount * 0.3)}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center bg-orange-50/30 p-3 rounded-2xl border border-orange-100 text-sm">
              <span className="font-bold text-slate-500">Monto Neto Debitado:</span>
              <span className="font-black text-orange-600">+{formatCurrency(doc.amount)}</span>
            </div>
          </div>
        );

      case 'Recibo de pago':
        return (
          <div className="space-y-4">
            <div className="border-b border-emerald-100 pb-3 bg-emerald-50/35 p-3 rounded-2xl">
              <div className="flex justify-between text-[10px] text-emerald-800 font-black uppercase tracking-widest">
                <span>Receptor del Pago</span>
                <span>Comprobante Nº</span>
              </div>
              <div className="flex justify-between text-sm font-black text-slate-900 mt-1">
                <span>INMOBILIARIA DEL ESTRECHO</span>
                <span>RC-9921-042</span>
              </div>
              <p className="text-[11px] text-gray-400 mt-1">Recibimos la suma por alquiler mensual de oficinas administrativas.</p>
            </div>

            <div className="bg-amber-50/40 p-3.5 rounded-2xl border border-amber-100 space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500 font-semibold">Forma de pago:</span>
                <span className="font-black text-slate-800">Transferencia Bancaria</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-semibold">Destinatario:</span>
                <span className="font-black text-slate-800">ESTUDIO JURÍDICO INTEGRAR</span>
              </div>
              <div className="flex justify-between border-t border-amber-200.5/60 pt-2 text-sm font-extrabold">
                <span className="text-emerald-800">Total Recibido:</span>
                <span className="text-emerald-700">{formatCurrency(doc.amount)}</span>
              </div>
            </div>
          </div>
        );

      case 'Orden de compra':
        return (
          <div className="space-y-4">
            <div className="border-b border-indigo-100 pb-3 bg-indigo-50/30 p-3 rounded-2xl">
              <div className="flex justify-between text-xs text-indigo-500 font-bold uppercase tracking-wider">
                <span>Adquiriente (Nosotros)</span>
                <span>Orden Nº</span>
              </div>
              <div className="flex justify-between text-sm font-black text-slate-900 mt-1">
                <span>ESTUDIO ASOCIADO DIGITAL</span>
                <span>OC-2026-0418</span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-black uppercase text-gray-400 tracking-wider block">Requisito de Adquisición</span>
              <div className="bg-slate-50 rounded-2xl p-3 text-xs space-y-2 text-slate-700">
                <div className="flex justify-between font-medium">
                  <span>💻 Laptop Pro 16" Ultra Core 7 (Intel 32GB) x1</span>
                  <span className="font-bold text-slate-900">{formatCurrency(doc.amount * 0.85)}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>⌨️ Soportes metálicos ergonómicos de oficina x2</span>
                  <span className="font-bold text-slate-900">{formatCurrency(doc.amount * 0.15)}</span>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-2 flex justify-between items-center text-sm font-black">
              <span className="text-slate-500">Estimación de Requisito:</span>
              <span className="text-indigo-600">{formatCurrency(doc.amount)}</span>
            </div>
          </div>
        );

      case 'Remito / Albarán':
        return (
          <div className="space-y-4">
            <div className="border-b border-amber-100 pb-3 bg-amber-50/40 p-3 rounded-2xl">
              <div className="flex justify-between text-xs text-amber-800 font-bold uppercase tracking-wider">
                <span>Transportista</span>
                <span>Remito Nº</span>
              </div>
              <div className="flex justify-between text-sm font-black text-slate-900 mt-1">
                <span>EXPRESO SEGURO DE ALTA VELOCIDAD</span>
                <span>RM-0002-18491</span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase text-gray-400 tracking-wider block">Bultos Despachados</span>
              <div className="bg-slate-50 rounded-2xl p-3 text-xs space-y-2">
                <div className="flex justify-between py-1 border-b border-slate-150">
                  <span className="font-medium">📦 5 Cajas de Papel Impresión Carta (80gr)</span>
                  <span className="font-bold text-slate-800">Entregado</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="font-medium">📁 10 Archivadores Metálicos Color Gris</span>
                  <span className="font-bold text-slate-800">Entregado</span>
                </div>
              </div>
              <p className="text-[10px] text-gray-400 italic text-center mt-1">
                Firma de conformidad de recepción requerida del Responsable Financiero.
              </p>
            </div>
          </div>
        );

      case 'Estado de cuenta bancario':
        return (
          <div className="space-y-4">
            <div className="border-b border-teal-100 pb-3 bg-teal-50/30 p-3 rounded-2xl">
              <div className="flex justify-between text-xs text-teal-600 font-bold uppercase tracking-wider">
                <span>Entidad Bancaria</span>
                <span>Nº de Cuenta Pesos</span>
              </div>
              <div className="flex justify-between text-sm font-black text-slate-900 mt-1">
                <span>BANCO INTERNACIONAL COMERCIAL S.A.</span>
                <span>CC-302-39281-9</span>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-2.5 text-xs">
              <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest block mb-2 px-1">Últimos Movimientos</span>
              <table className="w-full text-left text-[11px] border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-400 font-bold">
                    <th className="pb-1.5 font-bold">Detalle Operación</th>
                    <th className="pb-1.5 text-right font-bold">Monto</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-150 text-slate-600">
                  <tr>
                    <td className="py-1 px-0.5 font-medium">Intereses Plazo Fijo Ganados</td>
                    <td className="py-1 px-0.5 text-right font-black text-teal-600">+1,450.00</td>
                  </tr>
                  <tr>
                    <td className="py-1 px-0.5 font-medium">Débito Automático Tarjeta Visa</td>
                    <td className="py-1 px-0.5 text-right font-semibold text-red-500">-890.00</td>
                  </tr>
                  <tr>
                    <td className="py-1 px-0.5 font-medium">Transferencia Recibida de Terceros</td>
                    <td className="py-1 px-0.5 text-right font-black text-teal-600">+{formatCurrency(doc.amount)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'Comprobante de transferencia':
        return (
          <div className="space-y-4">
            <div className="bg-teal-50/50 border border-teal-150 p-4 rounded-3xl text-center space-y-1 my-2">
              <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center mx-auto text-teal-600 mb-2">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-teal-800">Transferencia Exitosa</span>
              <h4 className="text-xl font-black text-slate-900">{formatCurrency(doc.amount)}</h4>
              <p className="text-[10px] text-gray-400">ID de Transacción: tx_90382901-b</p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-3 text-xs space-y-2 text-slate-700">
              <div className="flex justify-between">
                <span className="font-semibold text-gray-400">Desde:</span>
                <span className="font-extrabold">Caja Ahorro Digital (CBU ...901)</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-gray-400">Hacia:</span>
                <span className="font-extrabold text-indigo-700">GL-CORP SUPPLIES S.A.</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-gray-400">Entidad Destino:</span>
                <span className="font-extrabold">BANCO GALICIA</span>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-4">
            <div className="border-b border-gray-100 pb-3">
              <div className="flex justify-between text-xs text-gray-400 font-bold uppercase">
                <span>Categoría Personalizada</span>
                <span>Estado</span>
              </div>
              <div className="flex justify-between text-sm font-black text-slate-900 mt-1">
                <span>⚙️ {type}</span>
                <span className="text-indigo-600 font-bold">{isCompleted ? 'Validado' : 'Pendiente'}</span>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4.5 text-center text-xs text-slate-600 space-y-2">
              <p className="font-semibold text-slate-805">
                Has subido un documento clasificado en la categoría específica: <b className="font-black text-indigo-700">"{type}"</b>.
              </p>
              <div className="bg-white border rounded-xl py-2 px-3 font-mono font-black text-center text-sm shadow-sm inline-block">
                Monto: {formatCurrency(doc.amount)}
              </div>
              <p className="text-[10px] text-gray-400 leading-relaxed pt-1 animate-pulse">
                Este comprobante ha quedado archivado bajo la clasificación personalizada para auditoría.
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6 pb-24 animate-fade-in select-none max-w-md mx-auto">
      {/* Title block */}
      <div className="flex items-center space-x-3 px-1">
        <div className="w-10 h-10 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm">
          <FolderOpen className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Mis Documentos</h2>
          <p className="text-xs text-gray-400">Historial de archivos organizados por fecha de subida</p>
        </div>
      </div>

      {/* List groups split by Status */}
      <div className="space-y-6">
        {/* COMPLETED DOCUMENTS GROUP */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] uppercase tracking-wider font-extrabold text-slate-500 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Subidos y Completados ({completedDocs.length})</span>
            </span>
          </div>

          <div className="bg-white rounded-3xl p-4 shadow-ambient border border-slate-100">
            {completedDocs.length === 0 ? (
              <div className="text-center py-6 text-xs text-gray-400">
                Aún no tienes documentos completados. ¡Sube un archivo en Upload para empezar!
              </div>
            ) : (
              <div className="space-y-2">
                {completedDocs.map((doc) => (
                  <div
                    key={doc.id}
                    onClick={() => setSelectedDoc(doc)}
                    className="flex items-center justify-between p-3.5 bg-slate-50/50 hover:bg-indigo-50/40 border border-transparent hover:border-indigo-100 rounded-2xl transition-all duration-300 cursor-pointer group shadow-sm"
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className="p-2 shrink-0 rounded-xl bg-white border border-slate-100 group-hover:bg-indigo-50 transition-colors shadow-sm">
                        {getCategoryIcon(doc.type)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-black text-slate-800 truncate" title={doc.name}>
                          {doc.name}
                        </p>
                        <div className="flex items-center space-x-1.5 mt-0.5 flex-wrap gap-y-1">
                          <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-md border shrink-0 ${getCategoryBadgeClass(doc.type)}`}>
                            {doc.type}
                          </span>
                          <span className="text-[9px] bg-slate-100/80 text-gray-400 px-1.5 py-0.5 rounded font-bold shrink-0">
                            {doc.date}
                          </span>
                          <span className="text-[10px] font-black text-indigo-600">
                            {formatCurrency(doc.amount)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 pl-1">
                      <span className="flex items-center text-emerald-700 bg-emerald-50/80 py-0.5 px-2.5 rounded-full border border-emerald-100 text-[10px] font-extrabold whitespace-nowrap">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mr-1 shrink-0" />
                        <span>Ok</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* PENDING DOCUMENTS GROUP */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] uppercase tracking-wider font-extrabold text-slate-500 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-500 animate-pulse" />
              <span>Pendientes de Validación ({pendingDocs.length})</span>
            </span>
          </div>

          <div className="bg-white rounded-3xl p-4 shadow-ambient border border-slate-100">
            {pendingDocs.length === 0 ? (
              <div className="text-center py-6 text-xs text-gray-400">
                No tienes documentos pendientes de procesar 🎉
              </div>
            ) : (
              <div className="space-y-2">
                {pendingDocs.map((doc) => (
                  <div
                    key={doc.id}
                    onClick={() => setSelectedDoc(doc)}
                    className="flex items-center justify-between p-3.5 bg-slate-50/50 hover:bg-amber-50/40 border border-transparent hover:border-amber-100 rounded-2xl transition-all duration-300 cursor-pointer group shadow-sm"
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className="p-2 shrink-0 rounded-xl bg-white border border-slate-100 group-hover:bg-amber-50 transition-colors shadow-sm">
                        {getCategoryIcon(doc.type)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-black text-slate-800 truncate" title={doc.name}>
                          {doc.name}
                        </p>
                        <div className="flex items-center space-x-1.5 mt-0.5 flex-wrap gap-y-1">
                          <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-md border shrink-0 ${getCategoryBadgeClass(doc.type)}`}>
                            {doc.type}
                          </span>
                          <span className="text-[9px] bg-slate-100/80 text-gray-400 px-1.5 py-0.5 rounded font-bold shrink-0">
                            {doc.date}
                          </span>
                          <span className="text-[10px] font-black text-amber-600">
                            {formatCurrency(doc.amount)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 pl-1">
                      <span className="flex items-center text-amber-700 bg-amber-50/80 py-0.5 px-2.5 rounded-full border border-amber-150 text-[10px] font-extrabold whitespace-nowrap">
                        <Clock className="w-3.5 h-3.5 text-amber-500 mr-1 shrink-0 animate-pulse" />
                        <span>Pend.</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Exquisite Document Preview Modal */}
      {selectedDoc && (
        <div
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 select-none animate-fade-in"
          onClick={() => setSelectedDoc(null)}
        >
          <div
            className="bg-white rounded-[32px] border border-slate-150 shadow-2xl max-w-sm w-full overflow-hidden animate-zoom-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Heading Header */}
            <div className="bg-slate-900 text-white p-5 relative">
              <button
                onClick={() => setSelectedDoc(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors cursor-pointer"
                aria-label="Cerrar Vista"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center space-x-3 pr-8">
                <div className="p-2.5 bg-slate-800 rounded-xl">
                  {getCategoryIcon(selectedDoc.type)}
                </div>
                <div>
                  <h4 className="text-xs text-indigo-400 font-extrabold tracking-widest uppercase">Vista del Comprobante</h4>
                  <p className="text-sm font-black truncate text-white mt-0.5" title={selectedDoc.name}>
                    {selectedDoc.name}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 mt-4 pt-3.5 border-t border-slate-800">
                <span>Fecha: <b className="text-slate-200">{selectedDoc.date}</b></span>
                <span className={`px-2 py-0.5 rounded-lg border text-[9px] font-extrabold uppercase ${
                  selectedDoc.status === 'completed'
                    ? 'bg-emerald-900/50 text-emerald-400 border-emerald-800'
                    : 'bg-amber-900/50 text-amber-400 border-amber-800'
                }`}>
                  {selectedDoc.status === 'completed' ? 'Completado' : 'Pendiente'}
                </span>
              </div>
            </div>

            {/* Generated Simulated Document Preview Paper */}
            <div className="p-6 space-y-4 max-h-[360px] overflow-y-auto">
              {renderDocumentBody(selectedDoc)}
            </div>

            {/* Actions Footer */}
            <div className="bg-slate-50 border-t border-slate-100 p-4 flex justify-between items-center text-xs">
              <button
                onClick={() => setDocToDelete(selectedDoc)}
                className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 hover:border-red-300 font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5 text-red-500" />
                <span>Eliminar Documento</span>
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedDoc(null)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl transition-all cursor-pointer"
                >
                  Cerrar
                </button>
                <button
                  onClick={() => {
                    if (selectedDoc.fileDataUrl) {
                      const link = document.createElement('a');
                      link.href = selectedDoc.fileDataUrl;
                      link.download = selectedDoc.name;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      showToast(`¡Documento "${selectedDoc.name}" descargado con éxito! 📄`, "success");
                    } else {
                      const fileContent = `==================================================
COMPROBANTE OFICIAL DE AUDITORÍA CONTABLE
==================================================
Identificador del Documento: ${selectedDoc.id}
Nombre del Archivo: ${selectedDoc.name}
Tipo de Documento: ${selectedDoc.type}
Monto Registrado: $${selectedDoc.amount.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
Fecha de Registro: ${selectedDoc.date}
Estado del Proceso: ${selectedDoc.status.toUpperCase()}
Validación: VERIFICADO POR SISTEMA DE AUDITORÍA INTELIGENTE
==================================================
Este documento certifica que la transacción cumple con los
lineamientos y regulaciones de la plataforma.
==================================================`;

                      const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
                      const url = URL.createObjectURL(blob);
                      const link = document.createElement('a');
                      link.href = url;
                      link.download = `${selectedDoc.name.toLowerCase().replace(/\s+/g, '_')}_comprobante.txt`;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      URL.revokeObjectURL(url);
                      showToast("¡Comprobante oficial descargado con éxito! 📄", "success");
                    }
                  }}
                  className="px-4 py-2 bg-indigo-brand hover:bg-indigo-brand-hover text-white font-black rounded-xl shadow-sm hover:shadow transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Descargar</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Exquisite Custom In-App Deletion Confirmation Modal */}
      {docToDelete && (
        <div
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-60 flex items-center justify-center p-4 select-none animate-fade-in"
          onClick={() => setDocToDelete(null)}
        >
          <div
            className="bg-white rounded-[28px] border border-red-100 shadow-2xl max-w-sm w-full p-6 text-center space-y-4 animate-zoom-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-14 h-14 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto border border-red-100 scale-105">
              <Trash2 className="w-7 h-7 text-red-500 animate-pulse" />
            </div>
            
            <div className="space-y-1.5">
              <h3 className="text-sm font-black text-slate-800">¿Eliminar este documento?</h3>
              <p className="text-[11px] text-gray-400 leading-relaxed max-w-[260px] mx-auto">
                Estás a punto de eliminar permanentemente el archivo <strong className="text-slate-700 font-extrabold">"{docToDelete.name}"</strong>. Esta acción no se puede deshacer.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 text-xs font-bold">
              <button
                type="button"
                onClick={() => setDocToDelete(null)}
                className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteDocument(docToDelete.id);
                  setDocToDelete(null);
                  setSelectedDoc(null);
                }}
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-sm hover:shadow transition-all cursor-pointer"
              >
                Sí, Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
