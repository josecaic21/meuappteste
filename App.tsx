
import React, { useState, useEffect } from 'react';
import { UserProfile, GlucoseEntry, ThemeMode } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import FoodSearch from './components/FoodSearch';
import Chatbot from './components/Chatbot';
import GlucoseLogger from './components/GlucoseLogger';
import MealPlanner from './components/MealPlanner';
import ProfileSetup from './components/ProfileSetup';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'food' | 'chat' | 'glucose' | 'meals' | 'profile'>('dashboard');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [glucoseHistory, setGlucoseHistory] = useState<GlucoseEntry[]>([]);
  const [theme, setTheme] = useState<ThemeMode>('light');

  useEffect(() => {
    const savedProfile = localStorage.getItem('glicocare_profile');
    const savedGlucose = localStorage.getItem('glicocare_glucose');
    const savedTheme = localStorage.getItem('glicocare_theme') as ThemeMode || 'light';
    
    if (savedProfile) setProfile(JSON.parse(savedProfile));
    if (savedGlucose) setGlucoseHistory(JSON.parse(savedGlucose));
    setTheme(savedTheme);
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('glicocare_theme', theme);
  }, [theme]);

  const handleUpdateProfile = (newProfile: UserProfile) => {
    setProfile(newProfile);
    localStorage.setItem('glicocare_profile', JSON.stringify(newProfile));
  };

  const handleAddGlucose = (entry: GlucoseEntry) => {
    const newHistory = [entry, ...glucoseHistory].slice(0, 50);
    setGlucoseHistory(newHistory);
    localStorage.setItem('glicocare_glucose', JSON.stringify(newHistory));
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  if (!profile && activeTab !== 'profile') {
    return <ProfileSetup onComplete={handleUpdateProfile} />;
  }

  return (
    <div className={`flex h-screen overflow-hidden transition-colors duration-500 bg-slate-50 dark:bg-slate-950`}>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} theme={theme} toggleTheme={toggleTheme} />
      
      <main className="flex-1 overflow-y-auto relative">
        {/* Decorative background elements for premium feel */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-[80px] pointer-events-none"></div>

        <div className="max-w-6xl mx-auto p-6 md:p-10 h-full">
          {activeTab === 'dashboard' && profile && (
            <Dashboard 
              profile={profile} 
              glucoseHistory={glucoseHistory} 
              onAddGlucose={handleAddGlucose}
              goToTab={setActiveTab}
            />
          )}
          {activeTab === 'food' && profile && <FoodSearch profile={profile} />}
          {activeTab === 'chat' && profile && <Chatbot profile={profile} />}
          {activeTab === 'glucose' && profile && (
            <GlucoseLogger 
              history={glucoseHistory} 
              onAdd={handleAddGlucose} 
              profile={profile}
            />
          )}
          {activeTab === 'meals' && profile && (
            <MealPlanner 
              profile={profile} 
              glucoseHistory={glucoseHistory} 
              onGoToGlucose={() => setActiveTab('glucose')}
            />
          )}
          {activeTab === 'profile' && (
            <ProfileSetup 
              initialData={profile || undefined} 
              onComplete={(p) => {
                handleUpdateProfile(p);
                setActiveTab('dashboard');
              }} 
            />
          )}
        </div>
      </main>
      
      {/* Improved Mobile Nav */}
      <div className="md:hidden fixed bottom-6 left-6 right-6 glass dark:bg-slate-900/80 border border-white/20 dark:border-slate-800 flex justify-around p-4 z-50 rounded-[2.5rem] shadow-2xl backdrop-blur-xl">
        {[
          { id: 'dashboard', icon: '📊' },
          { id: 'glucose', icon: '💉' },
          { id: 'meals', icon: '🍱' },
          { id: 'chat', icon: '💬' }
        ].map(btn => (
          <button 
            key={btn.id}
            onClick={() => setActiveTab(btn.id as any)} 
            className={`p-3 rounded-2xl transition-all ${activeTab === btn.id ? 'bg-blue-600 text-white scale-110 shadow-lg shadow-blue-500/20' : 'text-slate-400 opacity-60'}`}
          >
            <span className="text-xl">{btn.icon}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default App;
