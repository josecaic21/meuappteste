
import React from 'react';
import { UserProfile, GlucoseEntry } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

interface DashboardProps {
  profile: UserProfile;
  glucoseHistory: GlucoseEntry[];
  onAddGlucose: (entry: GlucoseEntry) => void;
  goToTab: (tab: any) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ profile, glucoseHistory, goToTab }) => {
  const lastGlucose = glucoseHistory[0];
  const chartData = [...glucoseHistory].reverse().map(g => ({
    time: new Date(g.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    valor: g.value,
  }));

  const getStatusColor = (val: number) => {
    if (val < profile.targetRangeMin) return 'text-amber-500';
    if (val > profile.targetRangeMax) return 'text-rose-500';
    return 'text-blue-600 dark:text-blue-400';
  };

  const hasGlucoseToday = () => {
    if (glucoseHistory.length === 0) return false;
    const today = new Date().toDateString();
    return glucoseHistory.some(entry => new Date(entry.timestamp).toDateString() === today);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-1000">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-5xl font-black dark:text-white tracking-tighter leading-tight">Olá, {profile.name.split(' ')[0]}!</h2>
          <p className="text-slate-500 dark:text-slate-400 text-xl font-medium mt-1">Sua saúde está no caminho certo hoje.</p>
        </div>
        {!hasGlucoseToday() && (
          <div className="bg-rose-500/10 dark:bg-rose-500/20 border border-rose-500/20 px-6 py-3 rounded-[1.5rem] flex items-center gap-3 animate-pulse">
            <span className="text-rose-500 text-xl">⚠️</span>
            <span className="text-rose-600 dark:text-rose-400 font-bold text-sm tracking-tight">Medição pendente</span>
          </div>
        )}
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Status Card */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-12 rounded-[3.5rem] shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-110 transition-transform duration-700">
            <span className="text-[12rem]">💧</span>
          </div>
          
          <div className="relative z-10 flex flex-col h-full">
            <span className="text-slate-400 dark:text-slate-500 font-black uppercase tracking-[0.3em] text-[10px] mb-8">Estado Atual</span>
            
            {lastGlucose ? (
              <div className="flex-1 flex flex-col justify-center">
                <div className={`text-9xl font-black ${getStatusColor(lastGlucose.value)} tabular-nums tracking-tighter`}>
                  {lastGlucose.value}
                </div>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-2xl font-bold text-slate-400">mg/dL</span>
                  <div className="px-4 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-500">
                    Registrado há {Math.round((Date.now() - new Date(lastGlucose.timestamp).getTime()) / 60000)} min
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-20 text-center">
                 <p className="text-slate-300 dark:text-slate-700 font-black text-3xl">Nenhum dado</p>
                 <button onClick={() => goToTab('glucose')} className="text-blue-600 font-bold mt-4 hover:underline">Começar agora →</button>
              </div>
            )}

            <div className="mt-12 flex gap-4">
               <button onClick={() => goToTab('glucose')} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-black transition-all shadow-xl shadow-blue-500/20 active:scale-95">
                 Nova Medição
               </button>
               <button onClick={() => goToTab('meals')} className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white px-8 py-4 rounded-2xl font-black transition-all hover:bg-slate-200 dark:hover:bg-slate-700">
                 Ver Plano
               </button>
            </div>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="lg:col-span-5 grid grid-cols-2 gap-6">
          <div className="col-span-2 bg-gradient-to-br from-blue-600 to-indigo-700 p-10 rounded-[3rem] text-white flex flex-col justify-between shadow-2xl shadow-blue-600/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 text-7xl opacity-20 rotate-12 group-hover:rotate-0 transition-transform">💉</div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">Controle Inteligente</span>
              <h3 className="text-3xl font-black mt-2 leading-tight">Log de<br/>Glicemia</h3>
            </div>
            <button onClick={() => goToTab('glucose')} className="mt-8 bg-white/20 hover:bg-white/30 backdrop-blur-md px-6 py-3 rounded-2xl font-bold transition-all w-max">
              Abrir Painel
            </button>
          </div>

          <button 
            onClick={() => goToTab('food')}
            className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] flex flex-col items-center justify-center gap-3 border border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1"
          >
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-500/10 rounded-2xl flex items-center justify-center text-3xl">🍎</div>
            <span className="font-black text-sm tracking-tighter dark:text-white uppercase">Nutrição</span>
          </button>

          <button 
            onClick={() => goToTab('chat')}
            className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] flex flex-col items-center justify-center gap-3 border border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1"
          >
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-500/10 rounded-2xl flex items-center justify-center text-3xl">💬</div>
            <span className="font-black text-sm tracking-tighter dark:text-white uppercase">IA Chat</span>
          </button>
        </div>
      </div>

      {/* Analytics Card */}
      <div className="bg-white dark:bg-slate-900 p-12 rounded-[4rem] shadow-sm border border-slate-100 dark:border-slate-800">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h3 className="text-2xl font-black dark:text-white tracking-tight">Tendências de Hoje</h3>
            <p className="text-slate-500 text-sm font-medium">Visualização das últimas 24 horas</p>
          </div>
          <div className="flex gap-4">
             <div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span> Glicemia
             </div>
             <div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400">
                <span className="w-2.5 h-1 bg-slate-200 dark:bg-slate-800"></span> Zona Alvo
             </div>
          </div>
        </div>
        
        <div className="h-[400px] w-full">
          {chartData.length > 1 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="10 10" vertical={false} stroke={profile.theme === 'dark' ? '#1e293b' : '#f1f5f9'} />
                <XAxis 
                  dataKey="time" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 700}} 
                  dy={20}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 700}} 
                  domain={[40, 300]} 
                  dx={-10}
                />
                <Tooltip 
                  cursor={{ stroke: '#2563eb', strokeWidth: 1 }}
                  contentStyle={{
                    borderRadius: '24px', 
                    border: 'none', 
                    boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.1)', 
                    padding: '20px', 
                    backgroundColor: profile.theme === 'dark' ? '#0f172a' : '#fff'
                  }}
                  labelStyle={{fontWeight: 900, marginBottom: '6px', color: profile.theme === 'dark' ? '#fff' : '#1e293b'}}
                  itemStyle={{fontWeight: 700, fontSize: '14px'}}
                />
                <ReferenceLine y={profile.targetRangeMax} stroke="#ef4444" strokeWidth={1} strokeDasharray="5 5" />
                <ReferenceLine y={profile.targetRangeMin} stroke="#f59e0b" strokeWidth={1} strokeDasharray="5 5" />
                <Line 
                  type="monotone" 
                  dataKey="valor" 
                  stroke="#2563eb" 
                  strokeWidth={6} 
                  dot={{ r: 8, fill: '#2563eb', strokeWidth: 4, stroke: profile.theme === 'dark' ? '#0f172a' : '#fff' }}
                  activeDot={{ r: 10, fill: '#fff', stroke: '#2563eb', strokeWidth: 4 }}
                  animationDuration={1500}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-300 dark:text-slate-700 border-4 border-dashed border-slate-50 dark:border-slate-800 rounded-[3.5rem]">
              <span className="text-6xl mb-4 grayscale opacity-30">📈</span>
              <p className="font-black text-xl">Continue medindo para ver o gráfico.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
