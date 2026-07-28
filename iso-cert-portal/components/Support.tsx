
import React, { useState } from 'react';
import { MessageSquare, Send, Paperclip, Search, Plus, User, Bot } from 'lucide-react';
import { Language } from '../translations';

interface SupportProps {
  lang: Language;
  t: (key: any) => string;
}

const Support: React.FC<SupportProps> = ({ lang, t }) => {
  const [activeTicket, setActiveTicket] = useState(0);
  const [message, setMessage] = useState('');

  const tickets = [
    { id: 'T-1024', subject: 'Document upload issue', status: 'Open', lastUpdate: '2h ago' },
    { id: 'T-1021', subject: 'Invoicing question', status: 'Closed', lastUpdate: '1d ago' },
  ];

  const messages = [
    { role: 'user', text: "Hello, I'm having trouble uploading the audit report for ISO 27001.", time: '10:15 AM' },
    { role: 'admin', text: "Hi! Please ensure the file is under 20MB and in PDF format. Would you like me to check your company profile settings?", time: '10:20 AM' },
  ];

  return (
    <div className={`h-[calc(100vh-160px)] flex gap-6 animate-in fade-in duration-500 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
      <div className="w-80 bg-white border rounded-3xl flex flex-col overflow-hidden shadow-sm">
        <div className="p-4 border-b space-y-4">
          <div className={`flex items-center justify-between ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
            <h3 className="font-bold text-slate-900">{lang === 'ar' ? 'التذاكر' : 'Tickets'}</h3>
            <button className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100">
              <Plus size={18} />
            </button>
          </div>
          <div className="relative">
            <Search className={`absolute ${lang === 'ar' ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-slate-400`} size={16} />
            <input 
              type="text" 
              placeholder={lang === 'ar' ? 'بحث...' : "Search..."} 
              className={`w-full ${lang === 'ar' ? 'pr-9 pl-4 text-right' : 'pl-9 pr-4 text-left'} py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs focus:ring-1 focus:ring-indigo-500`} 
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto divide-y">
          {tickets.map((t, idx) => (
            <button 
              key={t.id}
              onClick={() => setActiveTicket(idx)}
              className={`w-full ${lang === 'ar' ? 'text-right' : 'text-left'} p-4 transition-colors ${activeTicket === idx ? 'bg-indigo-50/50' : 'hover:bg-slate-50'}`}
            >
              <div className={`flex justify-between items-start mb-1 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                <span className="text-xs font-bold text-indigo-600">{t.id}</span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${t.status === 'Open' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                  {t.status}
                </span>
              </div>
              <p className="text-sm font-semibold text-slate-900 truncate">{t.subject}</p>
              <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider">{t.lastUpdate}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 bg-white border rounded-3xl flex flex-col shadow-sm overflow-hidden">
        <div className={`p-6 border-b flex items-center justify-between bg-slate-50/30 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
          <div className={`flex items-center gap-3 ${lang === 'ar' ? 'flex-row-reverse text-right' : ''}`}>
            <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center font-bold">
              {tickets[activeTicket].id.split('-')[1].charAt(0)}
            </div>
            <div>
              <h4 className="font-bold text-slate-900">{tickets[activeTicket].subject}</h4>
              <p className="text-xs text-slate-500">{lang === 'ar' ? 'تذكرة' : 'Ticket'} #{tickets[activeTicket].id}</p>
            </div>
          </div>
        </div>

        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          {messages.map((m, idx) => (
            <div key={idx} className={`flex gap-4 ${m.role === 'admin' ? (lang === 'ar' ? 'flex-row-reverse' : '') : (lang === 'ar' ? '' : 'flex-row-reverse')}`}>
              <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center ${m.role === 'admin' ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                {m.role === 'admin' ? <Bot size={16} /> : <User size={16} />}
              </div>
              <div className={`max-w-[70%] space-y-1 ${m.role === 'admin' ? (lang === 'ar' ? 'text-right' : '') : (lang === 'ar' ? '' : 'text-right')}`}>
                <div className={`p-4 rounded-2xl text-sm ${m.role === 'admin' ? 'bg-slate-100 text-slate-900 rounded-tl-none' : 'bg-indigo-600 text-white rounded-tr-none'}`}>
                  {m.text}
                </div>
                <p className="text-[10px] font-bold text-slate-400">{m.time}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t bg-slate-50/30">
          <div className={`relative flex items-center gap-2 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
            <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
              <Paperclip size={20} />
            </button>
            <input 
              type="text" 
              placeholder={lang === 'ar' ? 'اكتب رسالتك...' : "Type your message..."}
              className={`flex-1 bg-white border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${lang === 'ar' ? 'text-right' : 'text-left'}`}
              value={message}
              onChange={e => setMessage(e.target.value)}
            />
            <button 
              className="bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
              onClick={() => setMessage('')}
            >
              <Send size={18} className={lang === 'ar' ? 'rotate-180' : ''} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
