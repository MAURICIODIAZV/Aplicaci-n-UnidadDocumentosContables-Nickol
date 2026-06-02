import React from 'react';
import { useGame } from '../context/GameContext';
import { ViewType } from '../types';
import { Trophy, FileText, Upload, Table, User, FolderOpen } from 'lucide-react';

export const TabBar: React.FC = () => {
  const { currentSelectedView, setView } = useGame();

  const handleTabClick = (view: ViewType) => {
    setView(view);
  };

  const tabs = [
    { view: 'Progress' as ViewType, label: 'Progress', icon: Trophy },
    { view: 'Library' as ViewType, label: 'Library', icon: FileText },
    { view: 'Upload' as ViewType, label: 'Upload', icon: Upload, isCenter: true },
    { view: 'Excel' as ViewType, label: 'Excel', icon: Table },
    { view: 'History' as ViewType, label: 'Docs', icon: FolderOpen },
    { view: 'Profile' as ViewType, label: 'Profile', icon: User }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200.5 px-4 pb-safe shadow-[0_-4px_16px_rgba(0,0,0,0.04)] z-40 select-none">
      <div className="max-w-md mx-auto flex items-center justify-between h-20 relative">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          const isSelected = currentSelectedView === tab.view;

          if (tab.isCenter) {
            return (
              <div key={tab.view} className="relative -top-5 flex flex-col items-center">
                <button
                  id={`tab-btn-${tab.view}`}
                  onClick={() => handleTabClick(tab.view)}
                  className={`w-14 h-14 rounded-full flex items-center justify-center text-white transition-all duration-300 shadow-[0_4px_16px_rgba(77,68,227,0.4)] ${
                    isSelected 
                      ? 'bg-emerald-brand hover:scale-110' 
                      : 'bg-indigo-brand hover:bg-indigo-brand-hover hover:scale-105'
                  }`}
                  aria-label="Cargar nuevo documento"
                  title="Cargar nuevo documento"
                >
                  <IconComponent className="w-6 h-6 animate-bounce" />
                </button>
                <span className="text-[10px] font-bold text-gray-400 mt-2 lowercase">{tab.label}</span>
              </div>
            );
          }

          return (
            <button
              id={`tab-btn-${tab.view}`}
              key={tab.view}
              onClick={() => handleTabClick(tab.view)}
              className={`flex flex-col items-center justify-center flex-1 py-1.5 px-0.5 min-h-[44px] rounded-xl transition-all duration-300 relative ${
                isSelected 
                  ? 'bg-emerald-brand-light text-emerald-brand font-black scale-102 shadow-inner' 
                  : 'text-gray-400 hover:text-gray-650 hover:bg-slate-50'
              }`}
            >
              <IconComponent className={`w-4.5 h-4.5 mb-0.5 transition-transform ${isSelected ? 'scale-105 text-emerald-brand' : 'text-gray-450'}`} />
              <span className={`text-[9px] uppercase font-black tracking-tighter ${isSelected ? 'text-emerald-brand' : 'text-gray-400'}`}>
                {tab.label}
              </span>
              
              {isSelected && (
                <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-emerald-brand"></span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
