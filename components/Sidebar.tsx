
import React from 'react';
import { ThemeMode } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  theme: ThemeMode;
  toggleTheme: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, theme, toggleTheme }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Painel', icon: '📊' },
    { id: 'glucose', label: 'Glicemia', icon: '💉' },
    { id: 'food', label: 'Alimentos', icon: '🍎' },
    { id: 'meals', label: 'Refeições', icon: '🍱' },
    { id: 'chat', label: 'Assistente', icon: '💬' },
    { id: 'profile', label: 'Perfil', icon: '👤' },
  ];

  return (
    <aside className="hidden md:flex flex-col w-72 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border-r border-slate-200/50 dark:border-slate-800/50 transition-all duration-500">
      <div className="p-10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <span className="text-2xl">💧</span>
          </div>
          <h1 className="text-2xl font-black tracking-tighter dark:text-white">
            Glico<span className="text-blue-600">Care</span>
          </h1>
        </div>
      </div>
      
      <nav className="flex-1 px-6 space-y-3 py-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-[1.8rem] transition-all duration-300 group relative ${
              activeTab === item.id
                ? 'bg-blue-600 text-white shadow-2xl shadow-blue-600/30'
                : 'text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 shadow-none'
            }`}
          >
            <span className={`text-xl transition-transform duration-300 ${activeTab === item.id ? 'scale-110' : 'group-hover:scale-125'}`}>
              {item.icon}
            </span>
            <span className="font-bold text-sm tracking-tight">{item.label}</span>
            {activeTab === item.id && (
              <div className="absolute right-4 w-1.5 h-1.5 bg-white rounded-full shadow-glow"></div>
            )}
          </button>
        ))}
      </nav>

      <div className="p-8 space-y-6">
        <div className="bg-slate-100 dark:bg-slate-800/50 p-1.5 rounded-[2rem] flex items-center relative cursor-pointer" onClick={toggleTheme}>
          <div className={`absolute w-[calc(50%-4px)] h-[calc(100%-8px)] bg-white dark:bg-slate-700 rounded-[1.5rem] shadow-sm transition-all duration-500 ${theme === 'light' ? 'left-1' : 'left-[calc(50%+3px)]'}`}></div>
          <button className={`flex-1 flex items-center justify-center gap-2 py-2.5 z-10 transition-colors ${theme === 'light' ? 'text-slate-900' : 'text-slate-400'}`}>
            <span className="text-sm">☀️</span>
          </button>
          <button className={`flex-1 flex items-center justify-center gap-2 py-2.5 z-10 transition-colors ${theme === 'dark' ? 'text-white' : 'text-slate-400'}`}>
            <span className="text-sm">🌙</span>
          </button>
        </div>

        <div className="text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-600 mb-1">Elite AI Platform</p>
          <p className="text-[9px] text-slate-400 dark:text-slate-500 opacity-60">© 2025 GlicoCare Pro. Todos os direitos reservados.</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
