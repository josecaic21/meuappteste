
import React, { useState } from 'react';
import { UserProfile, DiabetesType } from '../types';

interface ProfileSetupProps {
  onComplete: (profile: UserProfile) => void;
  initialData?: UserProfile;
}

const ProfileSetup: React.FC<ProfileSetupProps> = ({ onComplete, initialData }) => {
  const [formData, setFormData] = useState<UserProfile>(initialData || {
    name: '',
    age: 30,
    weight: 70,
    height: 170,
    diabetesType: 'Type1',
    medications: '',
    targetRangeMin: 70,
    targetRangeMax: 180,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(formData);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6 transition-colors duration-500">
      <div className="bg-white dark:bg-slate-900 max-w-2xl w-full p-12 md:p-20 rounded-[4.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
        
        <header className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-blue-600 rounded-[2.5rem] mb-8 shadow-2xl shadow-blue-500/30">
            <span className="text-4xl">💧</span>
          </div>
          <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter leading-tight">GlicoCare <span className="text-blue-600">AI</span></h1>
          <p className="text-slate-500 dark:text-slate-400 mt-4 text-xl font-medium">Vamos configurar seu assistente inteligente.</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="space-y-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Identificação</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-[1.8rem] px-8 py-6 focus:ring-4 focus:ring-blue-600/10 focus:outline-none transition-all text-xl font-bold dark:text-white"
                placeholder="Qual seu nome completo?"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Idade</label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({...formData, age: parseInt(e.target.value)})}
                  className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-[1.8rem] px-8 py-6 focus:ring-4 focus:ring-blue-600/10 dark:text-white font-bold text-xl"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Peso (kg)</label>
                <input
                  type="number"
                  value={formData.weight}
                  onChange={(e) => setFormData({...formData, weight: parseInt(e.target.value)})}
                  className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-[1.8rem] px-8 py-6 focus:ring-4 focus:ring-blue-600/10 dark:text-white font-bold text-xl"
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] block">Qual sua condição?</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({...formData, diabetesType: 'Type1'})}
                  className={`py-6 rounded-[1.8rem] font-black border-4 transition-all text-lg ${
                    formData.diabetesType === 'Type1' 
                    ? 'bg-blue-600 text-white border-blue-600 shadow-2xl shadow-blue-600/30 scale-[1.03]' 
                    : 'bg-white dark:bg-slate-800 text-slate-400 border-slate-100 dark:border-slate-700 hover:border-blue-100'
                  }`}
                >
                  Tipo 1
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({...formData, diabetesType: 'Type2'})}
                  className={`py-6 rounded-[1.8rem] font-black border-4 transition-all text-lg ${
                    formData.diabetesType === 'Type2' 
                    ? 'bg-blue-600 text-white border-blue-600 shadow-2xl shadow-blue-600/30 scale-[1.03]' 
                    : 'bg-white dark:bg-slate-800 text-slate-400 border-slate-100 dark:border-slate-700 hover:border-blue-100'
                  }`}
                >
                  Tipo 2
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Medicações Atuais</label>
              <textarea
                value={formData.medications}
                onChange={(e) => setFormData({...formData, medications: e.target.value})}
                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-[1.8rem] px-8 py-6 focus:ring-4 focus:ring-blue-600/10 dark:text-white font-medium text-lg leading-relaxed"
                rows={2}
                placeholder="Liste suas insulinas ou comprimidos..."
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-black py-7 rounded-[2.2rem] hover:bg-blue-700 transition-all text-2xl shadow-2xl shadow-blue-600/40 mt-12 hover:scale-[1.02] active:scale-[0.98]"
          >
            Começar Experiência ✨
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileSetup;
