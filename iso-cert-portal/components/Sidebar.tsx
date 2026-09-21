
import React from 'react';
import { 
  LayoutDashboard, 
  FilePlus, 
  Files, 
  ShieldCheck, 
  LifeBuoy, 
  LogOut,
  Building2,
  UserCircle,
  BookOpen,
  Info
} from 'lucide-react';
import { Language } from '../translations';
import Logo from './Logo';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  lang: Language;
  t: (key: any) => string;
  companyName: string;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onLogout, lang, t, companyName }) => {
  const menuItems = [
    { id: 'dashboard', label: t('dashboard'), icon: LayoutDashboard },
    { id: 'new-request', label: t('newRequest'), icon: FilePlus },
    { id: 'requests', label: t('myRequests'), icon: Files },
    { id: 'verify', label: t('verification'), icon: ShieldCheck },
    { id: 'support', label: t('support'), icon: LifeBuoy },
    { id: 'guide', label: t('userGuide'), icon: BookOpen },
    { id: 'about', label: t('aboutUs'), icon: Info },
    { id: 'profile', label: t('companyProfile'), icon: UserCircle },
  ];

  return (
    <div className={`w-64 bg-white border-${lang === 'ar' ? 'l' : 'r'} h-screen fixed ${lang === 'ar' ? 'right-0' : 'left-0'} top-0 hidden md:flex flex-col z-20 transition-all duration-300`}>
      <div className="p-6 border-b flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center shrink-0 overflow-hidden p-1">
          <Logo size={32} color="white" />
        </div>
        <div className="overflow-hidden">
          <h1 className="font-bold text-slate-900 leading-none truncate">ISO Portal</h1>
          <span className="text-[10px] text-slate-500 uppercase font-semibold tracking-wider block mt-1">
            {lang === 'ar' ? 'مركز الأعمال' : 'Business Center'}
          </span>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === item.id 
              ? 'bg-indigo-50 text-indigo-700 font-medium' 
              : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <item.icon size={20} className="shrink-0" />
            <span className="truncate">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t space-y-4">
        <div 
          onClick={() => setActiveTab('profile')}
          className="bg-slate-50 p-4 rounded-xl flex items-center gap-3 cursor-pointer hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
        >
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
            <Building2 className="text-indigo-600" size={20} />
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-semibold text-slate-900 truncate">{companyName || (lang === 'ar' ? 'شركتك' : 'Your Company')}</p>
            <p className="text-xs text-slate-500 truncate">{lang === 'ar' ? 'ملف المنشأة' : 'Organization Profile'}</p>
          </div>
        </div>
        <button 
          onClick={onLogout}
          className={`w-full flex items-center gap-3 px-4 py-2 text-slate-500 hover:text-red-600 transition-colors group`}
        >
          <LogOut size={20} className={`shrink-0 transition-transform ${lang === 'ar' ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`} />
          <span className="font-medium">{t('logout')}</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
