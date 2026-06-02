import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { UserProfile, Stats, Settings, Document, ViewType, FloatingXP, DateOption, LevelReward } from '../types';
import { initialUserProfile, initialStats, generateInitialDocuments, dateOptions } from '../mockData';
import confetti from 'canvas-confetti';

export const LEVEL_REWARDS: LevelReward[] = [
  {
    level: 1,
    name: "Kit de Auditor Principiante",
    description: "Desbloqueas el rango oficial de 'Asistente de Entrada de Datos' y la posibilidad de acumular Rachas de Carga de documentos.",
    badge: "🛡️",
    type: "Rango de Nivel"
  },
  {
    level: 2,
    name: "Multiplicador Base Mejorado (+1.1x)",
    description: "¡Sube tu multiplicador permanente! Ahora ganas 10% más XP (+0.1x de bono pasivo) de forma pasiva en todas tus validaciones.",
    badge: "⚡",
    type: "Bono Pasivo"
  },
  {
    level: 3,
    name: "Cofre de XP Sorpresa (+15 XP)",
    description: "¡Bono de nivel instantáneo! Se han sumado automáticamente +15 XP extras a tu cuenta como regalo de incentivo.",
    badge: "🎁",
    type: "Bono de XP"
  },
  {
    level: 4,
    name: "Analista de Conciliaciones",
    description: "Adquieres el rango honorario 'Auditor de Integraciones' y un incremento del multiplicador base a +1.3x de forma estable.",
    badge: "💎",
    type: "Rango de Nivel"
  },
  {
    level: 5,
    name: "Director de Finanzas Honorario (CFO)",
    description: "¡El rango contable supremo! Tu multiplicador básico escala a 1.5x y tu multiplicador Early Bird se potencia a un gigante 1.8x.",
    badge: "👑",
    type: "Bono de Élite"
  }
];

interface GameContextProps {
  userProfile: UserProfile;
  stats: Stats;
  settings: Settings;
  documents: Document[];
  currentSelectedDate: string;
  currentSelectedView: ViewType;
  floatingXPs: FloatingXP[];
  isEarlyBirdActive: boolean;
  currentMultiplier: number;
  level: number;
  levelProgress: number;
  dateOptionsList: DateOption[];
  viewHistory: ViewType[];
  toast: { message: string; type: 'success' | 'info' | 'error' } | null;
  activeLevelUpReward: LevelReward | null;
  unlockedRewards: number[];
  pendingDocToUpload: Document | null;
  setPendingDocToUpload: (doc: Document | null) => void;
  setView: (view: ViewType) => void;
  setSelectedDate: (date: string) => void;
  setSettings: React.Dispatch<React.SetStateAction<Settings>>;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  completeDocument: (docId: string, e?: React.MouseEvent) => void;
  deleteDocument: (docId: string) => void;
  addDocument: (doc: Omit<Document, 'id' | 'status'>) => Promise<void>;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  clearToast: () => void;
  setActiveLevelUpReward: (reward: LevelReward | null) => void;
  resetGame: () => void;
}

const GameContext = createContext<GameContextProps | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userProfile, setProfile] = useState<UserProfile>(initialUserProfile);
  const [stats, setStats] = useState<Stats>(initialStats);
  const [settings, setSettings] = useState<Settings>({ forceEarlyBirdMultiplier: false });
  const [documents, setDocuments] = useState<Document[]>(() => generateInitialDocuments());
  const [currentSelectedDate, setSelectedDate] = useState<string>("Hoy");
  const [currentSelectedView, setView] = useState<ViewType>('Progress');
  const [floatingXPs, setFloatingXPs] = useState<FloatingXP[]>([]);
  const [viewHistory, setViewHistory] = useState<ViewType[]>(['Progress']);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Micro Reward states
  const [unlockedRewards, setUnlockedRewards] = useState<number[]>([]);
  const [activeLevelUpReward, setActiveLevelUpReward] = useState<LevelReward | null>(null);
  const [pendingDocToUpload, setPendingDocToUpload] = useState<Document | null>(null);

  // Gamification properties
  const prevLevelRef = useRef<number>(Math.floor(initialStats.totalXP / 100));

  // Determine multiplier based on user hours (<12:00) or force early bird toggle
  const [isEarlyBirdActive, setIsEarlyBirdActive] = useState<boolean>(false);
  
  useEffect(() => {
    const checkTimeAndForceToggle = () => {
      const hours = new Date().getHours();
      const earlyHour = hours < 12;
      setIsEarlyBirdActive(earlyHour || settings.forceEarlyBirdMultiplier);
    };

    checkTimeAndForceToggle();
    const interval = setInterval(checkTimeAndForceToggle, 5000);
    return () => clearInterval(interval);
  }, [settings.forceEarlyBirdMultiplier]);

  const level = Math.floor(stats.totalXP / 100);
  const levelProgress = stats.totalXP % 100; // 0 to 99

  // Calculate dynamic Multiplier increases depending on the user's level
  // Lvl 0, 1 = 1.0x
  // Lvl 2 = 1.1x
  // Lvl 3 = 1.2x
  // Lvl 4 = 1.3x
  // Lvl 5+ = 1.5x
  const levelMultiplier = Math.min(1.5, 1.0 + (level >= 2 ? (level - 1) * 0.1 : 0));
  const baseMultiplier = parseFloat(levelMultiplier.toFixed(1));
  const currentMultiplier = isEarlyBirdActive ? (level >= 5 ? 1.8 : 1.5) : baseMultiplier;

  // Watch level transitions to trigger confetti and level reward unlock modal
  useEffect(() => {
    if (level > prevLevelRef.current) {
      // Celebrate
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 }
      });
      
      setTimeout(() => {
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { x: 0.3, y: 0.5 }
        });
      }, 200);

      setTimeout(() => {
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { x: 0.7, y: 0.5 }
        });
      }, 400);

      // Find reward metadata
      const reward = LEVEL_REWARDS.find(r => r.level === level);
      if (reward) {
        setActiveLevelUpReward(reward);
        setUnlockedRewards(prev => {
          if (!prev.includes(level)) {
            return [...prev, level];
          }
          return prev;
        });

        // Immediate rewards execution logic
        if (level === 3) {
          // Bonus instant XP
          setStats(prev => ({
            ...prev,
            totalXP: prev.totalXP + 15
          }));
        }
        showToast(`¡Subiste de Nivel! Recompensa de Nivel ${level} desbloqueada 🎁`, 'success');
      } else {
        showToast(`¡Felicidades! Subiste al Nivel ${level} 🎉`, 'success');
      }
    }
    prevLevelRef.current = level;
  }, [level]);

  // Track view navigation history
  const handleSetView = (newView: ViewType) => {
    setView(newView);
    setViewHistory(prev => [...prev, newView]);
  };

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
  };

  const clearToast = () => {
    setToast(null);
  };

  const resetGame = () => {
    setStats({
      totalXP: 0,
      streakDays: 0,
      totalDocsProcessed: 0
    });
    // Reset profile back to the registered initial template
    setProfile(initialUserProfile);
    // Set all initial documents back to pending status
    const resetDocs = generateInitialDocuments().map(doc => ({
      ...doc,
      status: 'pending' as const
    }));
    setDocuments(resetDocs);
    setUnlockedRewards([]);
    setActiveLevelUpReward(null);
    setPendingDocToUpload(null);
    prevLevelRef.current = 0;
    showToast("¡Aplicación y progreso restablecidos con éxito!", "info");
  };

  // Complete a document, calculate custom rewards and trigger absolute element animations
  const completeDocument = (docId: string, e?: React.MouseEvent) => {
    const docIndex = documents.findIndex(d => d.id === docId);
    if (docIndex === -1) return;

    const doc = documents[docIndex];
    if (doc.status === 'completed') return;

    // Reward Calculation
    const basePoints = 10;
    const bonusValidated = doc.fieldsValidated ? 5 : 0;
    const bonusExcel = doc.hasExcelLink ? 5 : 0;
    const bonusSameDay = doc.uploadedSameDay ? 3 : 0;
    
    const bonos = bonusValidated + bonusExcel + bonusSameDay;
    const xpReward = Math.round((basePoints + bonos) * currentMultiplier);

    // Update document status
    const updatedDocs = [...documents];
    updatedDocs[docIndex] = { ...doc, status: 'completed' };
    setDocuments(updatedDocs);

    // Update global statistics
    setStats(prev => {
      const isFirstDocToday = prev.totalDocsProcessed === 0;
      return {
        ...prev,
        totalXP: prev.totalXP + xpReward,
        totalDocsProcessed: prev.totalDocsProcessed + 1,
        // Start streak at 1 if they process a doc today
        streakDays: isFirstDocToday ? 1 : prev.streakDays
      };
    });

    // Generate floating text close to interaction
    let clickX = window.innerWidth / 2;
    let clickY = window.innerHeight / 2;

    if (e && e.clientX && e.clientY) {
      clickX = e.clientX;
      clickY = e.clientY;
    } else {
      const btn = document.getElementById(`complete-btn-${docId}`);
      if (btn) {
        const rect = btn.getBoundingClientRect();
        clickX = rect.left + rect.width / 2;
        clickY = rect.top;
      }
    }

    const floatId = Math.random().toString(36).substring(2, 9);
    const newFloatingXP: FloatingXP = {
      id: floatId,
      xp: xpReward,
      x: clickX,
      y: clickY
    };

    setFloatingXPs(prev => [...prev, newFloatingXP]);

    // Clear floating label after animation completes (1s)
    setTimeout(() => {
      setFloatingXPs(prev => prev.filter(f => f.id !== floatId));
    }, 1000);

    // Provide dynamic reward formula overview in a quick toast
    let rewardBreakdown = `Base: ${basePoints}XP`;
    if (bonusValidated) rewardBreakdown += ` + Val: ${bonusValidated}XP`;
    if (bonusExcel) rewardBreakdown += ` + Excel: ${bonusExcel}XP`;
    if (bonusSameDay) rewardBreakdown += ` + Mismo Día: ${bonusSameDay}XP`;
    if (currentMultiplier !== 1) rewardBreakdown += ` x ${currentMultiplier}x`;

    showToast(`La tarea sumó +${xpReward} XP (${rewardBreakdown})`, 'success');
  };

  // Simulates file upload mock with 800ms delay and redirects to Library
  const addDocument = async (newDoc: Omit<Document, 'id' | 'status'>) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const docId = pendingDocToUpload ? pendingDocToUpload.id : `upload-${Math.random().toString(36).substring(2, 9)}`;
        const documentToAdd: Document = {
          ...newDoc,
          id: docId,
          status: newDoc.fieldsValidated ? 'completed' : 'pending'
        };

        // If the document is immediately complete, let's reward XP just like completeDocument would!
        if (documentToAdd.status === 'completed') {
          const basePoints = 10;
          const bonusValidated = documentToAdd.fieldsValidated ? 5 : 0;
          const bonusExcel = documentToAdd.hasExcelLink ? 5 : 0;
          const bonusSameDay = documentToAdd.uploadedSameDay ? 3 : 0;
          
          const bonos = bonusValidated + bonusExcel + bonusSameDay;
          const xpReward = Math.round((basePoints + bonos) * currentMultiplier);

          setStats(prev => {
            const isFirstDocToday = prev.totalDocsProcessed === 0;
            return {
              ...prev,
              totalXP: prev.totalXP + xpReward,
              totalDocsProcessed: prev.totalDocsProcessed + 1,
              streakDays: isFirstDocToday ? 1 : prev.streakDays
            };
          });

          showToast(`¡Cargado y validado! +${xpReward} XP ganados 🎉`, 'success');
        } else {
          showToast(`Documento "${newDoc.name}" cargado correctamente`, 'success');
        }

        setDocuments(prev => {
          // If we had a pending quest with this ID, filter it out so we replace it with the newly uploaded/completed version
          const filtered = pendingDocToUpload 
            ? prev.filter(d => d.id !== pendingDocToUpload.id) 
            : prev;
          return [documentToAdd, ...filtered];
        });

        setPendingDocToUpload(null); // Clear the active pending quest trigger
        setSelectedDate("Hoy"); // Focus newly created document's date
        setView('Library'); // Redirect to library
        resolve();
      }, 800);
    });
  };

  const deleteDocument = (docId: string) => {
    setDocuments(prev => prev.filter(d => d.id !== docId));
    showToast("Documento de auditoría eliminado exitosamente.", "info");
  };

  return (
    <GameContext.Provider value={{
      userProfile,
      stats,
      settings,
      documents,
      currentSelectedDate,
      currentSelectedView,
      floatingXPs,
      isEarlyBirdActive,
      currentMultiplier,
      level,
      levelProgress,
      dateOptionsList: dateOptions,
      viewHistory,
      toast,
      activeLevelUpReward,
      unlockedRewards,
      pendingDocToUpload,
      setPendingDocToUpload,
      setView: handleSetView,
      setSelectedDate,
      setSettings,
      setProfile,
      completeDocument,
      deleteDocument,
      addDocument,
      showToast,
      clearToast,
      setActiveLevelUpReward,
      resetGame
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
