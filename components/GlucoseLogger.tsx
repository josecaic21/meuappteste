
import React, { useState } from 'react';
import { UserProfile, GlucoseEntry, MealContext } from '../types';

interface GlucoseLoggerProps {
  history: GlucoseEntry[];
  onAdd: (entry: GlucoseEntry) => void;
  profile: UserProfile;
}

const GlucoseLogger: React.FC<GlucoseLoggerProps> = ({ history, onAdd, profile }) => {
  const [value, setValue] = useState('');
  const [context, setContext] = useState<MealContext>('Antes do café da manhã');
  const [notes, setNotes] = useState('');

  const contexts: MealContext[] = [
    'Antes do café da manhã',
    'Depois do café da manhã',
    'Antes do almoço',
    'Depois do almoço',
    'Antes do jantar',
    'Depois do jantar',
    'Antes de dormir',
    'Outro'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numValue = parseInt(value);
    if (!numValue || isNaN(numValue)) return;

    onAdd({
      id: Math.random().toString(36).substr(2, 9),
      value: numValue,
      timestamp: new Date().toISOString(),
      mealContext: context,
      notes,
    });
    
    setValue('');
    setNotes('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
      <div className="lg:col-span-1">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] shadow-sm border border-slate-100 dark:border-slate-800 sticky top-4">
          <h2 className="text-3xl font-black mb-8 dark:text-white tracking-tight">Novo Registro</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-black text-slate-400 dark:text-slate-500 mb-2 uppercase tracking-widest">Valor da Glicemia</label>
              <div className="relative">
                <input
                  type="number"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  required
                  className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-3xl px-6 py-5 focus:ring-4 focus:ring-blue-500/20 focus:outline-none text-4xl font-black dark:text-white tabular-nums"
                  placeholder="000"
                />
                <span className="absolute right-6 top-1/2 -translate-y-1/2 font-bold text-slate-300 dark:text-slate-600">mg/dL</span>
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-black text-slate-400 dark:text-slate-500 mb-2 uppercase tracking-widest">Momento do Dia</label>
              <div className="relative">
                <select
                  value={context}
                  onChange={(e) => setContext(e.target.value as MealContext)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-6 py-4 focus:ring-4 focus:ring-blue-500/20 focus:outline-none dark:text-white font-bold appearance-none cursor-pointer"
                >
                  {contexts.map((ctx) => (
                    <option key={ctx} value={ctx}>{ctx}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 dark:text-slate-500 mb-2 uppercase tracking-widest">Nota Opcional</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-6 py-4 focus:ring-4 focus:ring-blue-500/20 focus:outline-none dark:text-white"
                placeholder="Ex: Refeição livre, exercício, estresse..."
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-black py-5 rounded-[1.5rem] hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 dark:shadow-none hover:scale-[1.02] active:scale-[0.98] text-lg"
            >
              Salvar Registro
            </button>
          </form>
        </div>
      </div>

      <div className="lg:col-span-2 space-y-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-black dark:text-white">Últimas Medições</h3>
          <div className="flex gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-500"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
            <span className="w-3 h-3 rounded-full bg-red-500"></span>
          </div>
        </div>
        {history.length > 0 ? (
          history.map((entry) => (
            <div key={entry.id} className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-between group hover:border-blue-400/50 transition-all animate-in slide-in-from-right-4">
              <div className="flex items-center gap-6">
                <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center font-black text-2xl shadow-inner ${
                  entry.value < profile.targetRangeMin ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30' :
                  entry.value > profile.targetRangeMax ? 'bg-red-100 text-red-600 dark:bg-red-900/30' :
                  'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30'
                }`}>
                  {entry.value}
                </div>
                <div>
                  <div className="font-black text-slate-800 dark:text-white text-lg">{entry.mealContext}</div>
                  <div className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
                    {new Date(entry.timestamp).toLocaleDateString()} às {new Date(entry.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </div>
                </div>
              </div>
              <div className="hidden md:block flex-1 px-8 text-sm text-slate-400 dark:text-slate-500 italic truncate max-w-[200px]">
                {entry.notes}
              </div>
              <div className="text-right">
                <div className={`text-[10px] font-black uppercase px-4 py-1.5 rounded-full ${
                  entry.value < profile.targetRangeMin ? 'bg-amber-500 text-white' :
                  entry.value > profile.targetRangeMax ? 'bg-red-500 text-white' :
                  'bg-emerald-500 text-white'
                }`}>
                  {entry.value < profile.targetRangeMin ? 'Baixa' :
                   entry.value > profile.targetRangeMax ? 'Alta' : 'No Alvo'}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-32 bg-white dark:bg-slate-900 rounded-[3rem] border-2 border-dashed border-slate-100 dark:border-slate-800">
            <span className="text-6xl mb-4 block opacity-20">📊</span>
            <p className="text-slate-400 dark:text-slate-500 font-bold text-xl">Nenhum dado registrado.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GlucoseLogger;
