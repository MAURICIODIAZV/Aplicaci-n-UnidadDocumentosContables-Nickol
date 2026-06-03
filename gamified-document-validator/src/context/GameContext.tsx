import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { UserProfile, Stats, Settings, Document, ViewType, FloatingXP, DateOption, LevelReward } from '../types';
import { initialUserProfile, initialStats, dateOptions } from '../mockData';
import confetti from 'canvas-confetti';
import { supabase } from '../supabaseClient';
import { Session } from '@supabase/supabase-js';

export const LEVEL_REWARDS: LevelReward[] = [
  { level: 1, name: "Kit de Auditor Principiante", description: "Desbloqueas el rango oficial de 'Asistente de Entrada de Datos'.", badge: "🛡️", type: "Rango de Nivel" },
  { level: 2, name: "Multiplicador Base Mejorado (+1.1x)", description: "Ganas 10% más XP de forma pasiva.", badge: "⚡", type: "Bono Pasivo" },
  { level: 3, name: "Cofre de XP Sorpresa (+15 XP)", description: "Bono de nivel instantáneo.", badge: "🎁", type: "Bono de XP" },
  { level: 4, name: "Analista de Conciliaciones", description: "Multiplicador base a +1.3x de forma estable.", badge: "💎", type: "Rango de Nivel" },
  { level: 5, name: "Director de Finanzas Honorario (CFO)", description: "Multiplicador básico escala a 1.5x.", badge: "👑", type: "Bono de Élite" }
];

interface GameContextProps {
  session: Session | null;
  loadingAuth: boolean;
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
  completeDocument: (docId: string, e?: React.MouseEvent) => void;
  deleteDocument: (docId: string) => void;
  addDocument: (doc: Omit<Document, 'id' | 'status'>) => Promise<void>;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  clearToast: () => void;
  setActiveLevelUpReward: (reward: LevelReward | null) => void;
  signOut: () => Promise<void>;
}

const GameContext = createContext<GameContextProps | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  
  const [userProfile, setProfile] = useState<UserProfile>(initialUserProfile);
  const [stats, setStats] = useState<Stats>(initialStats);
  const [documents, setDocuments] = useState<Document[]>([]);
  
  const [settings, setSettings] = useState<Settings>({ forceEarlyBirdMultiplier: false });
  const [currentSelectedDate, setSelectedDate] = useState<string>("Hoy");
  const [currentSelectedView, setView] = useState<ViewType>('Progress');
  const [floatingXPs, setFloatingXPs] = useState<FloatingXP[]>([]);
  const [viewHistory, setViewHistory] = useState<ViewType[]>(['Progress']);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const [unlockedRewards, setUnlockedRewards] = useState<number[]>([]);
  const [activeLevelUpReward, setActiveLevelUpReward] = useState<LevelReward | null>(null);
  const [pendingDocToUpload, setPendingDocToUpload] = useState<Document | null>(null);

  const prevLevelRef = useRef<number>(0);
  const [isEarlyBirdActive, setIsEarlyBirdActive] = useState<boolean>(false);

  // Authentication & Data Fetching
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoadingAuth(false);
      if (session) fetchData(session.user.id);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchData(session.user.id);
      } else {
        setProfile(initialUserProfile);
        setStats(initialStats);
        setDocuments([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchData = async (userId: string) => {
    try {
      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (!profileError && profileData) {
        setProfile({
          name: profileData.name || '',
          role: profileData.role || '',
          avatar: profileData.avatar || '',
          gender: profileData.gender || '',
          email: session?.user.email || '',
          isRegistered: profileData.is_registered
        });
      }

      // Fetch stats
      const { data: statsData, error: statsError } = await supabase
        .from('stats')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (!statsError && statsData) {
        setStats({
          totalXP: statsData.total_xp,
          streakDays: statsData.streak_days,
          totalDocsProcessed: statsData.total_docs_processed
        });
        prevLevelRef.current = Math.floor(statsData.total_xp / 100);
      }

      // Fetch documents
      const { data: docsData, error: docsError } = await supabase
        .from('documents')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (!docsError && docsData) {
        setDocuments(docsData.map(d => ({
          id: d.id,
          type: d.type,
          name: d.name,
          date: d.date,
          amount: d.amount,
          status: d.status,
          hasExcelLink: d.has_excel_link,
          fieldsValidated: d.fields_validated,
          uploadedSameDay: d.uploaded_same_day
        })));
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };
  
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
  const levelProgress = stats.totalXP % 100;
  const levelMultiplier = Math.min(1.5, 1.0 + (level >= 2 ? (level - 1) * 0.1 : 0));
  const baseMultiplier = parseFloat(levelMultiplier.toFixed(1));
  const currentMultiplier = isEarlyBirdActive ? (level >= 5 ? 1.8 : 1.5) : baseMultiplier;

  useEffect(() => {
    if (level > prevLevelRef.current && prevLevelRef.current !== 0) { // Dont trigger on initial load if level > 0
      confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
      setTimeout(() => confetti({ particleCount: 80, spread: 80, origin: { x: 0.3, y: 0.5 } }), 200);
      setTimeout(() => confetti({ particleCount: 80, spread: 80, origin: { x: 0.7, y: 0.5 } }), 400);

      const reward = LEVEL_REWARDS.find(r => r.level === level);
      if (reward) {
        setActiveLevelUpReward(reward);
        setUnlockedRewards(prev => !prev.includes(level) ? [...prev, level] : prev);
        
        if (level === 3 && session) {
          const newXp = stats.totalXP + 15;
          setStats(prev => ({ ...prev, totalXP: newXp }));
          supabase.from('stats').update({ total_xp: newXp }).eq('user_id', session.user.id).then();
        }
        showToast(`¡Subiste de Nivel! Recompensa desbloqueada 🎁`, 'success');
      } else {
        showToast(`¡Felicidades! Subiste al Nivel ${level} 🎉`, 'success');
      }
    }
    prevLevelRef.current = level;
  }, [level, session, stats.totalXP]);

  const handleSetView = (newView: ViewType) => {
    setView(newView);
    setViewHistory(prev => [...prev, newView]);
  };

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => setToast({ message, type });
  const clearToast = () => setToast(null);

  const completeDocument = async (docId: string, e?: React.MouseEvent) => {
    if (!session) return;
    const docIndex = documents.findIndex(d => d.id === docId);
    if (docIndex === -1) return;
    const doc = documents[docIndex];
    if (doc.status === 'completed') return;

    const basePoints = 10;
    const bonusValidated = doc.fieldsValidated ? 5 : 0;
    const bonusExcel = doc.hasExcelLink ? 5 : 0;
    const bonusSameDay = doc.uploadedSameDay ? 3 : 0;
    const xpReward = Math.round((basePoints + bonusValidated + bonusExcel + bonusSameDay) * currentMultiplier);

    // Optimistic UI Update
    const updatedDocs = [...documents];
    updatedDocs[docIndex] = { ...doc, status: 'completed' };
    setDocuments(updatedDocs);
    
    const isFirstDoc = stats.totalDocsProcessed === 0;
    const newStats = {
      total_xp: stats.totalXP + xpReward,
      total_docs_processed: stats.totalDocsProcessed + 1,
      streak_days: isFirstDoc ? 1 : stats.streakDays
    };
    
    setStats({
      totalXP: newStats.total_xp,
      totalDocsProcessed: newStats.total_docs_processed,
      streakDays: newStats.streak_days
    });

    // DB Update
    try {
      await supabase.from('documents').update({ status: 'completed' }).eq('id', docId);
      await supabase.from('stats').update(newStats).eq('user_id', session.user.id);
    } catch (err) {
      console.error(err);
      showToast("Error al guardar en base de datos", "error");
    }

    // Animation
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
    setFloatingXPs(prev => [...prev, { id: floatId, xp: xpReward, x: clickX, y: clickY }]);
    setTimeout(() => setFloatingXPs(prev => prev.filter(f => f.id !== floatId)), 1000);

    showToast(`La tarea sumó +${xpReward} XP`, 'success');
  };

  const addDocument = async (newDoc: Omit<Document, 'id' | 'status'>) => {
    if (!session) return;
    
    const isCompleted = newDoc.fieldsValidated;
    let xpReward = 0;
    
    if (isCompleted) {
      const basePoints = 10;
      const bonos = (newDoc.fieldsValidated ? 5 : 0) + (newDoc.hasExcelLink ? 5 : 0) + (newDoc.uploadedSameDay ? 3 : 0);
      xpReward = Math.round((basePoints + bonos) * currentMultiplier);
    }

    try {
      // If we had a pending doc, we might want to delete it in DB first or update it.
      // For simplicity, we just insert a new one. The UI filters it out.
      
      const { data: insertedDoc, error } = await supabase.from('documents').insert({
        user_id: session.user.id,
        type: newDoc.type,
        name: newDoc.name,
        date: newDoc.date,
        amount: newDoc.amount,
        status: isCompleted ? 'completed' : 'pending',
        has_excel_link: newDoc.hasExcelLink,
        fields_validated: newDoc.fieldsValidated,
        uploaded_same_day: newDoc.uploadedSameDay
      }).select().single();

      if (error) throw error;

      if (isCompleted) {
        const newStats = {
          total_xp: stats.totalXP + xpReward,
          total_docs_processed: stats.totalDocsProcessed + 1,
          streak_days: stats.totalDocsProcessed === 0 ? 1 : stats.streakDays
        };
        await supabase.from('stats').update(newStats).eq('user_id', session.user.id);
        
        setStats({
          totalXP: newStats.total_xp,
          totalDocsProcessed: newStats.total_docs_processed,
          streakDays: newStats.streak_days
        });
        showToast(`¡Cargado y validado! +${xpReward} XP ganados 🎉`, 'success');
      } else {
        showToast(`Documento cargado correctamente`, 'success');
      }

      const formattedDoc: Document = {
        id: insertedDoc.id,
        type: insertedDoc.type,
        name: insertedDoc.name,
        date: insertedDoc.date,
        amount: insertedDoc.amount,
        status: insertedDoc.status as any,
        hasExcelLink: insertedDoc.has_excel_link,
        fieldsValidated: insertedDoc.fields_validated,
        uploadedSameDay: insertedDoc.uploaded_same_day
      };

      setDocuments(prev => {
        const filtered = pendingDocToUpload ? prev.filter(d => d.id !== pendingDocToUpload.id) : prev;
        return [formattedDoc, ...filtered];
      });

      setPendingDocToUpload(null);
      setSelectedDate("Hoy");
      setView('Library');

    } catch (err) {
      console.error(err);
      showToast("Error al subir documento", "error");
    }
  };

  const deleteDocument = async (docId: string) => {
    if (!session) return;
    try {
      await supabase.from('documents').delete().eq('id', docId);
      setDocuments(prev => prev.filter(d => d.id !== docId));
      showToast("Documento eliminado exitosamente.", "info");
    } catch (err) {
      showToast("Error al eliminar", "error");
    }
  };

  return (
    <GameContext.Provider value={{
      session, loadingAuth,
      userProfile, stats, settings, documents,
      currentSelectedDate, currentSelectedView, floatingXPs,
      isEarlyBirdActive, currentMultiplier, level, levelProgress,
      dateOptionsList: dateOptions, viewHistory, toast,
      activeLevelUpReward, unlockedRewards, pendingDocToUpload,
      setPendingDocToUpload, setView: handleSetView, setSelectedDate,
      setSettings, completeDocument, deleteDocument, addDocument,
      showToast, clearToast, setActiveLevelUpReward, signOut
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) throw new Error('useGame must be used within a GameProvider');
  return context;
};
