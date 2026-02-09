
import React, { useState, useRef, useEffect } from 'react';
import { UserProfile, ChatMessage } from '../types';
import { chatWithAssistant } from '../services/geminiService';

interface ChatbotProps {
  profile: UserProfile;
}

const Chatbot: React.FC<ChatbotProps> = ({ profile }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await chatWithAssistant(messages, input, profile);
      setMessages(prev => [...prev, { role: 'model', text: response }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', text: 'Desculpe, tive um problema de conexão. Tente novamente em breve.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-160px)] space-y-4">
      <header>
        <h2 className="text-3xl font-bold">Assistente GlicoCare</h2>
        <p className="text-slate-500">Tire suas dúvidas sobre diabetes, sintomas e alimentação em tempo real.</p>
      </header>

      <div className="flex-1 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
        <div 
          ref={scrollRef}
          className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/30"
        >
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
              <div className="w-20 h-20 bg-blue-100 rounded-3xl flex items-center justify-center text-4xl mb-4">🤖</div>
              <h3 className="font-bold text-slate-800 text-xl mb-2">Como posso te ajudar hoje?</h3>
              <p className="text-slate-400 max-w-sm">Pergunte sobre receitas, o que fazer em hipoglicemia, ou dúvidas sobre medicações.</p>
            </div>
          )}
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-4 rounded-2xl ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-none' 
                  : 'bg-white border border-slate-100 shadow-sm rounded-tl-none text-slate-700'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-tl-none flex gap-1">
                <div className="w-2 h-2 bg-slate-200 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-slate-200 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-slate-200 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-100 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Digite sua dúvida aqui..."
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>
      </div>
      <p className="text-[10px] text-center text-slate-400 italic">
        Atenção: Esta IA não substitui conselhos médicos profissionais. Em caso de emergência, procure atendimento imediato.
      </p>
    </div>
  );
};

export default Chatbot;
