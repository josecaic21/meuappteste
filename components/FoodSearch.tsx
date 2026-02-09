
import React, { useState } from 'react';
import { UserProfile, FoodInfo, MealAnalysisResult } from '../types';
import { getFoodNutrition, analyzeMealDescription } from '../services/geminiService';

interface FoodSearchProps {
  profile: UserProfile;
}

const FoodSearch: React.FC<FoodSearchProps> = ({ profile }) => {
  const [mode, setMode] = useState<'single' | 'meal'>('single');
  const [query, setQuery] = useState('');
  const [singleResult, setSingleResult] = useState<FoodInfo | null>(null);
  const [mealResult, setMealResult] = useState<MealAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;

    setLoading(true);
    setError('');
    setSingleResult(null);
    setMealResult(null);

    try {
      if (mode === 'single') {
        const nutrition = await getFoodNutrition(query, profile);
        setSingleResult(nutrition);
      } else {
        const analysis = await analyzeMealDescription(query, profile);
        setMealResult(analysis);
      }
    } catch (err) {
      setError('Não foi possível realizar a análise agora. Tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-10">
      <header className="text-center max-w-2xl mx-auto">
        <h2 className="text-4xl font-black dark:text-white tracking-tight mb-3">Assistente <span className="text-blue-600">Nutricional</span></h2>
        <p className="text-slate-500 dark:text-slate-400 text-lg">Analise um item ou descreva sua refeição completa.</p>
      </header>

      {/* Mode Switcher */}
      <div className="max-w-md mx-auto bg-white dark:bg-slate-900 p-1.5 rounded-[2rem] flex shadow-sm border border-slate-100 dark:border-slate-800">
        <button 
          onClick={() => setMode('single')}
          className={`flex-1 py-3 rounded-[1.8rem] font-bold text-sm transition-all ${mode === 'single' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
        >
          Alimento Único
        </button>
        <button 
          onClick={() => setMode('meal')}
          className={`flex-1 py-3 rounded-[1.8rem] font-bold text-sm transition-all ${mode === 'meal' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
        >
          Refeição Completa
        </button>
      </div>

      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSearch} className="relative group">
          {mode === 'single' ? (
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ex: Pão integral, banana, tapioca..."
              className="w-full bg-white dark:bg-slate-900 px-8 py-7 rounded-[2.5rem] border-none shadow-xl dark:shadow-none focus:outline-none focus:ring-4 focus:ring-blue-500/20 pr-44 text-xl font-bold dark:text-white transition-all"
            />
          ) : (
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Descreva sua refeição: 'Pão francês + 2 ovos mexidos e um copo de leite desnatado'"
              rows={3}
              className="w-full bg-white dark:bg-slate-900 px-8 py-7 rounded-[2.5rem] border-none shadow-xl dark:shadow-none focus:outline-none focus:ring-4 focus:ring-blue-500/20 text-xl font-bold dark:text-white transition-all resize-none"
            />
          )}
          <button
            type="submit"
            disabled={loading}
            className={`absolute right-3 ${mode === 'single' ? 'top-3 bottom-3' : 'bottom-3'} bg-blue-600 text-white px-10 rounded-[1.8rem] font-black hover:bg-blue-700 disabled:opacity-50 transition-all shadow-lg active:scale-95`}
          >
            {loading ? 'Analisando...' : 'Calcular'}
          </button>
        </form>
      </div>

      {error && <div className="p-6 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-3xl border border-red-100 dark:border-red-900/30 text-center font-bold">{error}</div>}

      {/* Single Result Rendering */}
      {singleResult && mode === 'single' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-10 max-w-6xl mx-auto">
          <div className="md:col-span-2 space-y-8">
            <div className={`p-10 rounded-[3.5rem] border-4 relative overflow-hidden ${singleResult.isGood ? 'bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-900/30' : 'bg-amber-50/50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-900/30'}`}>
              <h3 className="text-4xl font-black capitalize dark:text-white mb-4">{singleResult.name}</h3>
              <p className="text-slate-700 dark:text-slate-300 text-xl font-medium italic">"{singleResult.diabeticSuitability}"</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 text-xs font-black uppercase tracking-widest block mb-1">Calorias</span>
                <span className="text-2xl font-black dark:text-white">{singleResult.calories}</span>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-3xl border border-blue-100 dark:border-blue-800/50">
                <span className="text-blue-600 dark:text-blue-400 text-xs font-black uppercase tracking-widest block mb-1">Carbos</span>
                <span className="text-2xl font-black text-blue-700 dark:text-blue-400">{singleResult.carbs}g</span>
              </div>
              {/* ... other stats as needed ... */}
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 p-10 rounded-[3.5rem] shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center text-center">
            <div className={`w-24 h-24 rounded-3xl flex items-center justify-center mb-4 text-white text-3xl font-black ${singleResult.glycemicIndex > 70 ? 'bg-red-500' : 'bg-emerald-500'}`}>
              {singleResult.glycemicIndex}
            </div>
            <h4 className="font-black text-xl mb-2 dark:text-white">Índice Glicêmico</h4>
          </div>
        </div>
      )}

      {/* Meal Result Rendering */}
      {mealResult && mode === 'meal' && (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-1 bg-blue-600 p-8 rounded-[3rem] text-white flex flex-col justify-center text-center shadow-xl shadow-blue-200 dark:shadow-none">
              <span className="text-xs font-black uppercase tracking-[0.2em] opacity-70 mb-2">Total Carbos</span>
              <span className="text-6xl font-black">{mealResult.totalCarbs}g</span>
              <div className="mt-4 pt-4 border-t border-white/20">
                 <span className="block text-sm font-bold opacity-80">{mealResult.totalCalories} kcal totais</span>
              </div>
            </div>

            <div className="md:col-span-3 bg-white dark:bg-slate-900 p-8 rounded-[3rem] shadow-sm border border-slate-100 dark:border-slate-800">
              <h3 className="text-xl font-black mb-6 dark:text-white flex items-center gap-2">
                <span className="text-2xl">📋</span> Decomposição da Refeição
              </h3>
              <div className="space-y-4">
                {mealResult.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                    <div>
                      <span className="font-bold dark:text-white capitalize">{item.name}</span>
                      <span className="text-xs text-slate-400 ml-2">({item.amount})</span>
                    </div>
                    <div className="flex gap-6">
                      <div className="text-right">
                        <span className="block text-[10px] font-black text-slate-400 uppercase">Calorias</span>
                        <span className="font-bold text-slate-600 dark:text-slate-300">{item.calories}</span>
                      </div>
                      <div className="text-right">
                        <span className="block text-[10px] font-black text-blue-400 uppercase">Carbos</span>
                        <span className="font-bold text-blue-600 dark:text-blue-400">{item.carbs}g</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-10 rounded-[3rem] text-white shadow-lg">
            <h4 className="font-black text-2xl mb-4 flex items-center gap-3">
               <span className="bg-white/20 p-2 rounded-xl text-2xl">💡</span> Veredito para sua Glicemia
            </h4>
            <p className="text-xl font-medium leading-relaxed opacity-95 italic">
              "{mealResult.advice}"
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodSearch;
