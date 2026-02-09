
import React, { useState, useEffect } from 'react';
import { UserProfile, MealPlan, GlucoseEntry, MealAnalysisResult } from '../types';
import { generateMealPlan, analyzeMealDescription } from '../services/geminiService';

interface MealPlannerProps {
  profile: UserProfile;
  glucoseHistory: GlucoseEntry[];
  onGoToGlucose: () => void;
}

const MealPlanner: React.FC<MealPlannerProps> = ({ profile, glucoseHistory, onGoToGlucose }) => {
  const [activePlan, setActivePlan] = useState<MealPlan | null>(null);
  const [savedPlans, setSavedPlans] = useState<MealPlan[]>([]);
  const [loading, setLoading] = useState(false);
  
  // States for Meal Analysis (The new feature)
  const [mealInput, setMealInput] = useState('');
  const [analysisResult, setAnalysisResult] = useState<MealAnalysisResult | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'plan' | 'tracker'>('plan');

  useEffect(() => {
    const saved = localStorage.getItem('glicocare_meal_plans');
    if (saved) setSavedPlans(JSON.parse(saved));
  }, []);

  const getLatestGlucose = () => {
    if (glucoseHistory.length === 0) return null;
    const today = new Date().toDateString();
    const todayEntries = glucoseHistory.filter(entry => new Date(entry.timestamp).toDateString() === today);
    return todayEntries.length > 0 ? todayEntries[0] : glucoseHistory[0];
  };

  const handleGenerate = async () => {
    const latest = getLatestGlucose();
    if (!latest) return;

    setLoading(true);
    try {
      const newPlan = await generateMealPlan(profile, latest.value);
      setActivePlan(newPlan);
      const updated = [newPlan, ...savedPlans].slice(0, 10);
      setSavedPlans(updated);
      localStorage.setItem('glicocare_meal_plans', JSON.stringify(updated));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeMeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mealInput.trim()) return;

    setAnalyzing(true);
    try {
      const result = await analyzeMealDescription(mealInput, profile);
      setAnalysisResult(result);
    } catch (error) {
      console.error(error);
    } finally {
      setAnalyzing(false);
    }
  };

  const latestGlucose = getLatestGlucose();

  if (!latestGlucose && activeSubTab === 'plan') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 animate-in zoom-in-95 duration-500">
        <div className="w-24 h-24 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center text-4xl mb-4 shadow-inner">⚠️</div>
        <h2 className="text-3xl font-black dark:text-white">Glicemia Necessária!</h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto text-lg leading-relaxed">
          Para criar um plano seguro e eficaz, preciso saber como está sua glicemia <strong>agora</strong>.
        </p>
        <button
          onClick={onGoToGlucose}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-3xl font-black text-lg shadow-xl shadow-blue-200 dark:shadow-none transition-all hover:scale-105 active:scale-95"
        >
          Registrar Glicemia
        </button>
      </div>
    );
  }

  const MealCard = ({ title, content, icon }: { title: string, content: string, icon: string }) => (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800 h-full flex flex-col group hover:shadow-xl transition-all hover:-translate-y-1">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-xl">
          {icon}
        </div>
        <h4 className="font-black text-slate-400 dark:text-slate-500 uppercase text-[10px] tracking-[0.2em]">{title}</h4>
      </div>
      <p className="text-slate-700 dark:text-slate-200 leading-relaxed flex-1 font-medium">{content}</p>
    </div>
  );

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-700">
      {/* Sub Navigation */}
      <div className="flex bg-white dark:bg-slate-900 p-1.5 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-800 max-w-md mx-auto">
        <button 
          onClick={() => setActiveSubTab('plan')}
          className={`flex-1 py-3 rounded-[1.8rem] font-bold text-sm transition-all ${activeSubTab === 'plan' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400'}`}
        >
          Plano Sugerido (IA)
        </button>
        <button 
          onClick={() => setActiveSubTab('tracker')}
          className={`flex-1 py-3 rounded-[1.8rem] font-bold text-sm transition-all ${activeSubTab === 'tracker' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400'}`}
        >
          Contar Carboidratos
        </button>
      </div>

      {activeSubTab === 'plan' ? (
        <div className="space-y-8">
          <header className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-6">
              <div className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center text-white font-black ${
                latestGlucose!.value > profile.targetRangeMax ? 'bg-red-500' :
                latestGlucose!.value < profile.targetRangeMin ? 'bg-amber-500' : 'bg-emerald-500'
              }`}>
                <span className="text-xl">{latestGlucose!.value}</span>
                <span className="text-[8px] opacity-70">mg/dL</span>
              </div>
              <div>
                <h2 className="text-xl font-black dark:text-white">Plano para Glicemia {latestGlucose!.value > profile.targetRangeMax ? 'Alta' : latestGlucose!.value < profile.targetRangeMin ? 'Baixa' : 'Normal'}</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Baseado na sua última medição</p>
              </div>
            </div>
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-[1.8rem] font-black shadow-lg disabled:opacity-50 transition-all flex items-center gap-2"
            >
              {loading ? 'Criando...' : 'Gerar Novo Plano'} 🪄
            </button>
          </header>

          {activePlan ? (
            <div className="space-y-8 animate-in slide-in-from-bottom-5">
              <div className="bg-blue-600 p-8 rounded-[3rem] text-white shadow-xl relative overflow-hidden">
                <div className="relative z-10">
                  <h4 className="font-black text-xs uppercase tracking-widest mb-2 opacity-80">Como este plano ajuda:</h4>
                  <p className="text-lg font-medium italic">"{activePlan.explanation}"</p>
                </div>
                <div className="absolute -right-10 -bottom-10 text-9xl opacity-10">🧠</div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <MealCard title="Café da Manhã" icon="☕" content={activePlan.breakfast} />
                <MealCard title="Lanche" icon="🍎" content={activePlan.snack1} />
                <MealCard title="Almoço" icon="🍛" content={activePlan.lunch} />
                <MealCard title="Lanche" icon="🥜" content={activePlan.snack2} />
                <MealCard title="Jantar" icon="🥘" content={activePlan.dinner} />
                <MealCard title="Ceia" icon="🥛" content={activePlan.eveningSnack} />
              </div>
            </div>
          ) : (
             <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
               <p className="text-slate-400 font-bold">Clique no botão para gerar um cardápio ideal para o seu momento.</p>
             </div>
          )}
        </div>
      ) : (
        /* MEAL TRACKER / CARBS COUNTER SECTION */
        <div className="space-y-8 max-w-4xl mx-auto animate-in fade-in duration-500">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] shadow-sm border border-slate-100 dark:border-slate-800">
            <h3 className="text-2xl font-black mb-4 dark:text-white">O que você está comendo? 🍽️</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6">Fale naturalmente o que vai consumir e a IA calculará os carboidratos para você.</p>
            
            <form onSubmit={handleAnalyzeMeal} className="space-y-4">
              <textarea
                value={mealInput}
                onChange={(e) => setMealInput(e.target.value)}
                placeholder="Ex: 1 pão francês, 2 ovos mexidos e um copo de suco de laranja..."
                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-[2rem] p-6 text-xl font-bold dark:text-white focus:ring-4 focus:ring-blue-500/20 transition-all resize-none"
                rows={3}
              />
              <button
                type="submit"
                disabled={analyzing || !mealInput.trim()}
                className="w-full bg-blue-600 text-white font-black py-5 rounded-[1.5rem] hover:bg-blue-700 shadow-xl shadow-blue-200 dark:shadow-none transition-all disabled:opacity-50"
              >
                {analyzing ? 'Analisando...' : 'Calcular Carboidratos 🚀'}
              </button>
            </form>
          </div>

          {analysisResult && (
            <div className="animate-in slide-in-from-bottom-8 duration-700 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-600 p-8 rounded-[2.5rem] text-white text-center shadow-lg">
                  <span className="text-[10px] font-black uppercase opacity-70">Carboidratos Totais</span>
                  <div className="text-6xl font-black">{analysisResult.totalCarbs}g</div>
                </div>
                <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] text-center shadow-sm border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-black uppercase text-slate-400">Calorias Estimadas</span>
                  <div className="text-4xl font-black dark:text-white">{analysisResult.totalCalories}</div>
                  <span className="text-xs text-slate-400">kcal</span>
                </div>
                <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] text-center shadow-sm border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-black uppercase text-slate-400">Proteínas</span>
                  <div className="text-4xl font-black dark:text-white">{analysisResult.totalProtein}g</div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800">
                <h4 className="font-black text-lg mb-6 dark:text-white">Itens Identificados:</h4>
                <div className="space-y-3">
                  {analysisResult.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                      <div className="flex flex-col">
                        <span className="font-bold dark:text-white capitalize">{item.name}</span>
                        <span className="text-[10px] text-slate-400 uppercase font-black">{item.amount}</span>
                      </div>
                      <div className="flex gap-6">
                        <div className="text-right">
                          <span className="block text-[8px] font-black text-slate-400 uppercase">Carbos</span>
                          <span className="font-bold text-blue-600 dark:text-blue-400">{item.carbs}g</span>
                        </div>
                        <div className="text-right">
                          <span className="block text-[8px] font-black text-slate-400 uppercase">Kcal</span>
                          <span className="font-bold dark:text-slate-300">{item.calories}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-emerald-500 p-8 rounded-[2.5rem] text-white shadow-lg">
                <h4 className="font-black mb-2 flex items-center gap-2">
                  <span>💡</span> Dica do Nutricionista IA
                </h4>
                <p className="font-medium italic leading-relaxed opacity-90">"{analysisResult.advice}"</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MealPlanner;
