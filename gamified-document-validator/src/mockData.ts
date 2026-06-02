import { UserProfile, Stats, Document, DateOption } from './types';

export const initialUserProfile: UserProfile = {
  name: "Auditor Principal",
  role: "Director de Finanzas Senior",
  email: "auditor.principal@empresa.com",
  avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&h=150",
  gender: "Mujer",
  isRegistered: true
};

// Initial stats completely from zero for the final version and multiple users
export const initialStats: Stats = {
  totalXP: 0,
  streakDays: 0,
  totalDocsProcessed: 0
};

export const dateOptions: DateOption[] = [
  { key: "May 29", label: "May 29", relative: "3 días antes" },
  { key: "May 30", label: "May 30", relative: "2 días antes" },
  { key: "May 31", label: "May 31", relative: "1 día antes" },
  { key: "Hoy", label: "Hoy", relative: "Hoy (01 Jun)" },
  { key: "Jun 02", label: "Jun 02", relative: "1 día después" },
  { key: "Jun 03", label: "Jun 03", relative: "2 días después" },
  { key: "Jun 04", label: "Jun 04", relative: "3 días después" }
];

export const getDailyCategoriesForDate = (dateObj: Date): string[] => {
  const categories = [
    "Factura",
    "Nota de crédito",
    "Nota de débito",
    "Recibo de pago",
    "Orden de compra",
    "Remito / Albarán",
    "Estado de cuenta bancario",
    "Comprobante de transferencia"
  ];
  const day = dateObj.getDate();
  const month = dateObj.getMonth();
  const year = dateObj.getFullYear();
  // Generate a distinct number seed for each day
  const seed = day + (month * 31) + (year - 2026);
  
  // Deterministic Lehmer / LCG generator
  const lcg = (s: number) => {
    return (s * 1664525 + 1013904223) % 4294967296;
  };
  
  let currentSeed = seed;
  const shuffled = [...categories];
  for (let i = shuffled.length - 1; i > 0; i--) {
    currentSeed = lcg(currentSeed);
    const j = currentSeed % (i + 1);
    const temp = shuffled[i];
    shuffled[i] = shuffled[j];
    shuffled[j] = temp;
  }
  
  // Take top 3 of the shuffled array - dynamically changing names/categories every day
  return shuffled.slice(0, 3);
};

export const getFileNameForCategory = (category: string): string => {
  switch (category) {
    case "Factura":
      return "Factura_Suministros.pdf";
    case "Nota de crédito":
      return "Nota_Credito_Descuento.pdf";
    case "Nota de débito":
      return "Nota_Debito_Ajuste.pdf";
    case "Recibo de pago":
      return "Recibo_Alquiler_Oficina.pdf";
    case "Orden de compra":
      return "Orden_Compra_Equipos.pdf";
    case "Remito / Albarán":
      return "Remito_Entrega_Mercaderia.pdf";
    case "Estado de cuenta bancario":
      return "Extracto_Mensual_Bancario.xlsx";
    case "Comprobante de transferencia":
      return "Comprobante_Transferencia_Sueldos.pdf";
    default:
      return "Documento_Varios.pdf";
  }
};

export const getAmountForCategory = (category: string): number => {
  switch (category) {
    case "Factura":
      return 350.00;
    case "Nota de crédito":
      return 75.50;
    case "Nota de débito":
      return 12.00;
    case "Recibo de pago":
      return 450.00;
    case "Orden de compra":
      return 1200.00;
    case "Remito / Albarán":
      return 85.00;
    case "Estado de cuenta bancario":
      return 6200.00;
    case "Comprobante de transferencia":
      return 1450.00;
    default:
      return 100.00;
  }
};

export const generateInitialDocuments = (): Document[] => {
  const dailyCats = getDailyCategoriesForDate(new Date());
  
  // The first 3 documents are Hoy's dynamic daily missions
  const todayMissions: Document[] = dailyCats.map((cat, idx) => {
    const isExcel = cat.endsWith('bancario') || cat.includes('cuenta') || cat.endsWith('transferencia');
    return {
      id: `mission-${idx + 1}`,
      type: cat,
      name: getFileNameForCategory(cat),
      date: "Hoy",
      amount: getAmountForCategory(cat),
      status: "pending",
      hasExcelLink: isExcel,
      fieldsValidated: true,
      uploadedSameDay: true
    };
  });

  // Past & future background documents
  const restOfDocs: Document[] = [
    {
      id: "doc-past-1",
      type: "Factura",
      name: "Factura_001.pdf",
      date: "May 31",
      amount: 299.34,
      status: "pending",
      hasExcelLink: false,
      fieldsValidated: true,
      uploadedSameDay: true
    },
    {
      id: "doc-past-2",
      type: "Estado de cuenta bancario",
      name: "Extracto_Bancario_Q1.xlsx",
      date: "May 30",
      amount: 4500.00,
      status: "pending",
      hasExcelLink: true,
      fieldsValidated: true,
      uploadedSameDay: false
    },
    {
      id: "doc-past-3",
      type: "Nota de crédito",
      name: "Nota_de_Credito_Proveedor.pdf",
      date: "May 29",
      amount: 120.00,
      status: "pending",
      hasExcelLink: false,
      fieldsValidated: true,
      uploadedSameDay: true
    },
    {
      id: "doc-future-1",
      type: "Comprobante de transferencia",
      name: "Transferencia_Servidores.pdf",
      date: "Jun 02",
      amount: 890.00,
      status: "pending",
      hasExcelLink: false,
      fieldsValidated: true,
      uploadedSameDay: true
    },
    {
      id: "doc-future-2",
      type: "Orden de compra",
      name: "Orden_Compra_Insumos.pdf",
      date: "Jun 03",
      amount: 150.00,
      status: "pending",
      hasExcelLink: false,
      fieldsValidated: true,
      uploadedSameDay: true
    },
    {
      id: "doc-future-3",
      type: "Remito / Albarán",
      name: "Remito_Entregas.pdf",
      date: "Jun 04",
      amount: 0.00,
      status: "pending",
      hasExcelLink: false,
      fieldsValidated: false,
      uploadedSameDay: false
    }
  ];

  return [...todayMissions, ...restOfDocs];
};
