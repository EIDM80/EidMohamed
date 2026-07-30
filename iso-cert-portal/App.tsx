import React, { useState, useEffect } from 'react';
import type { Session } from '@supabase/supabase-js';
import Sidebar from './components/Sidebar';
import DashboardHome from './components/DashboardHome';
import NewRequest from './components/NewRequest';
import MyRequests from './components/MyRequests';
import Verification from './components/Verification';
import Support from './components/Support';
import AdminPanel from './components/AdminPanel';
import CompanyProfile from './components/CompanyProfile';
import Guide from './components/Guide';
import AboutUs from './components/AboutUs';
import Auth from './components/Auth';
import PublicLanding from './components/PublicLanding';
import { fetchLandingConfig, updateLandingConfig, DEFAULT_LANDING_CONFIG, LandingConfig } from './landingConfig';
import {
  Bell,
  Search,
  User,
  Layout,
  Languages,
  Info,
  Globe,
  Mail,
  Phone,
  ShieldCheck,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  X
} from 'lucide-react';
import { RequestStatus, Company, ISORequest } from './types';
import { translations, Language } from './translations';
import { supabase } from './lib/supabaseClient';
import { fetchProfile, fetchCompany, saveCompany, fetchRequests, updateRequestStatusInDb, fetchSiteSettings, Profile } from './lib/db';
import { applyTrackingSettings } from './lib/injectTracking';

const EMPTY_COMPANY: Company = { name: '', legalName: '', licenseNo: '', address: '', website: '' };

const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<'public' | 'portal'>('public');
  const [session, setSession] = useState<Session | null>(null);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [lang, setLang] = useState<Language>('en');
  const [requests, setRequests] = useState<ISORequest[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);

  // Preselected ISO from front-end landing page trigger
  const [preselectedISO, setPreselectedISO] = useState<string | null>(null);

  // Dynamic Landing Page Config
  const [landingConfig, setLandingConfig] = useState<LandingConfig>(DEFAULT_LANDING_CONFIG);

  const [company, setCompany] = useState<Company>(EMPTY_COMPANY);
  const [paymentNotice, setPaymentNotice] = useState<'success' | 'cancelled' | null>(null);

  const isAuthenticated = !!session;
  const t = (key: keyof typeof translations.en) => translations[lang][key] || key;

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  // Loads admin-configured tracking/verification codes (Meta Pixel, Google
  // Tag, etc.) for every visitor, public or signed in.
  useEffect(() => {
    fetchSiteSettings().then(applyTrackingSettings);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      if (!newSession) {
        setViewMode('public');
        setActiveTab('dashboard');
      }
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  // Capture a referral link (?ref=CODE) so it survives navigation into
  // signup/checkout, without cluttering the visible URL.
  useEffect(() => {
    const ref = new URLSearchParams(window.location.search).get('ref');
    if (ref) {
      localStorage.setItem('gamc_referral_code', ref);
    }
  }, []);

  // Detect the redirect back from Stripe Checkout (?payment=success|cancelled)
  // and land the user in their portal instead of the marketing page.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const payment = params.get('payment');
    if (payment === 'success' || payment === 'cancelled') {
      setPaymentNotice(payment);
      setViewMode('portal');
      setActiveTab('requests');
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  // The Stripe webhook creates the request asynchronously, so poll briefly
  // after a successful payment until it shows up.
  useEffect(() => {
    if (paymentNotice !== 'success' || !session) return;
    let attempts = 0;
    const interval = setInterval(() => {
      attempts += 1;
      refreshRequests();
      if (attempts >= 4) clearInterval(interval);
    }, 1500);
    return () => clearInterval(interval);
  }, [paymentNotice, session]);

  // Load this user's profile, company, and visible requests once authenticated.
  useEffect(() => {
    if (!session) {
      setProfile(null);
      setCompany(EMPTY_COMPANY);
      setRequests([]);
      return;
    }
    (async () => {
      const p = await fetchProfile(session.user.id);
      setProfile(p);
      if (p?.company_id) {
        const c = await fetchCompany(p.company_id);
        if (c) setCompany(c);
      }
      setRequests(await fetchRequests());
    })();
  }, [session]);

  // Loaded from Supabase so a visitor sees the admin's edits — not just the
  // admin's own browser (localStorage never reached anyone else).
  useEffect(() => {
    fetchLandingConfig().then(setLandingConfig);
  }, []);

  const handleUpdateLandingConfig = (newConfig: LandingConfig) => {
    setLandingConfig(newConfig);
    updateLandingConfig(newConfig);
  };

  const updateRequestStatus = async (id: string, newStatus: RequestStatus) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
    const ok = await updateRequestStatusInDb(id, newStatus);
    if (!ok) setRequests(await fetchRequests());
  };

  const refreshRequests = async () => setRequests(await fetchRequests());

  const handleSaveCompany = async (updated: Company) => {
    setCompany(updated);
    if (profile?.company_id) await saveCompany(profile.company_id, updated);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setActiveTab('dashboard');
    setViewMode('public');
  };

  const handleNavigateToPortal = (options?: { mode?: 'login' | 'signup'; preselectedISO?: string }) => {
    if (options?.mode) {
      setAuthMode(options.mode);
    }
    if (options?.preselectedISO) {
      setPreselectedISO(options.preselectedISO);
    } else {
      setPreselectedISO(null);
    }
    setViewMode('portal');
  };

  const renderContent = () => {
    const commonProps = { lang, t };
    switch (activeTab) {
      case 'dashboard': return <DashboardHome requests={requests} companyName={company.name} onNavigate={setActiveTab} {...commonProps} />;
      case 'new-request': return (
        <NewRequest
          preselectedISO={preselectedISO}
          onClearPreselectedISO={() => setPreselectedISO(null)}
          companyId={profile?.company_id ?? null}
          userEmail={session?.user.email}
          {...commonProps}
        />
      );
      case 'requests': return <MyRequests requests={requests} {...commonProps} />;
      case 'verify': return <Verification {...commonProps} />;
      case 'support': return <Support {...commonProps} />;
      case 'guide': return <Guide {...commonProps} />;
      case 'about': return <AboutUs {...commonProps} />;
      case 'profile': return <CompanyProfile company={company} onSave={handleSaveCompany} {...commonProps} />;
      case 'admin': return (
        <AdminPanel 
          requests={requests} 
          onUpdateStatus={updateRequestStatus} 
          landingConfig={landingConfig}
          onUpdateLandingConfig={handleUpdateLandingConfig}
          {...commonProps} 
        />
      );
      default: return <DashboardHome requests={requests} companyName={company.name} onNavigate={setActiveTab} {...commonProps} />;
    }
  };

  // 1. RENDER PUBLIC LANDING PAGE (DEFAULT VIEW MODE)
  if (viewMode === 'public') {
    return (
      <PublicLanding 
        config={landingConfig}
        lang={lang}
        onSetLang={setLang}
        onNavigateToPortal={handleNavigateToPortal}
        isAuthenticated={isAuthenticated}
      />
    );
  }

  // 2. RENDER CLIENT PORTAL / AUTHENTICATION INTERFACE
  if (!isAuthenticated) {
    return (
      <div className="relative min-h-screen bg-slate-50">
        {/* Back button to public site */}
        <button 
          onClick={() => setViewMode('public')}
          className={`absolute top-6 ${lang === 'ar' ? 'right-6' : 'left-6'} flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border rounded-xl text-xs font-bold transition-all shadow-sm z-50`}
        >
          <ArrowLeft size={14} className={lang === 'ar' ? 'rotate-180' : ''} />
          <span>{lang === 'ar' ? '← الرجوع للموقع الرئيسي' : '← Back to Public Website'}</span>
        </button>
        
        <Auth
          onAuthenticate={() => {}}
          mode={authMode}
          setMode={setAuthMode}
          lang={lang}
        />
      </div>
    );
  }

  // 3. RENDER FULL AUTHENTICATED PORTAL WORKFLOW
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={handleLogout}
        lang={lang}
        t={t}
      />
      
      <main className={`${lang === 'ar' ? 'pr-0 md:pr-64' : 'pl-0 md:pl-64'} flex-1 flex flex-col transition-all duration-300`}>
        {/* Header */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-4 md:px-8 sticky top-0 z-10">
          <div className="flex items-center gap-3 md:gap-4">
            
            {/* View public site toggle */}
            <button 
              onClick={() => setViewMode('public')}
              className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold transition-all shadow-sm border border-indigo-100"
              title={lang === 'ar' ? 'عرض الموقع الإلكتروني' : 'View Public Website'}
            >
              <Globe size={14} />
              <span className="hidden md:inline">{lang === 'ar' ? 'الموقع العام' : 'Public Website'}</span>
            </button>

            <button 
              onClick={() => setActiveTab('admin')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'admin' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Layout size={14} />
              <span className="hidden md:inline">{t('switchToOps')}</span>
            </button>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <button 
              onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 rounded-lg text-xs font-bold transition-all"
            >
              <Languages size={16} />
              <span>{lang === 'en' ? 'العربية' : 'English'}</span>
            </button>

            <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all relative">
              <Bell size={20} />
              <span className={`absolute top-1.5 ${lang === 'ar' ? 'left-1.5' : 'right-1.5'} w-2 h-2 bg-rose-500 rounded-full border-2 border-white`}></span>
            </button>
            
            <div className="h-8 w-px bg-slate-200 mx-1 md:mx-2"></div>
            <button 
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-3 ${lang === 'ar' ? 'pr-2' : 'pl-2'} group ${activeTab === 'profile' ? 'text-indigo-600' : 'text-slate-600'}`}
            >
              <div className={`${lang === 'ar' ? 'text-left' : 'text-right'} hidden lg:block`}>
                <p className="text-sm font-bold text-slate-900 leading-none group-hover:text-indigo-600 transition-colors">{profile?.full_name || session?.user.email}</p>
                <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">{company.name}</p>
              </div>
              <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center group-hover:bg-indigo-50 transition-all">
                <User size={20} />
              </div>
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-4 md:p-8 flex-1">
          {paymentNotice && (
            <div className={`mb-6 flex items-center justify-between gap-3 p-4 rounded-2xl border ${
              paymentNotice === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-amber-50 border-amber-200 text-amber-800'
            }`}>
              <div className="flex items-center gap-3">
                {paymentNotice === 'success' ? <CheckCircle2 size={20} className="shrink-0" /> : <XCircle size={20} className="shrink-0" />}
                <span className="text-sm font-semibold">
                  {paymentNotice === 'success'
                    ? (lang === 'ar' ? 'تم الدفع بنجاح! تم إرسال طلبك للمراجعة.' : 'Payment successful! Your request has been sent for review.')
                    : (lang === 'ar' ? 'تم إلغاء عملية الدفع. لم يتم إنشاء أي طلب.' : 'Payment was cancelled. No request was created.')}
                </span>
              </div>
              <button onClick={() => setPaymentNotice(null)} className="p-1 hover:bg-black/5 rounded-lg transition-colors shrink-0">
                <X size={16} />
              </button>
            </div>
          )}
          {renderContent()}
        </div>

        {/* Global Footer */}
        <footer className="bg-white border-t py-6 px-4 md:px-8">
          <div className={`max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-wider ${lang === 'ar' ? 'md:flex-row-reverse' : ''}`}>
            <div className="flex items-center gap-2 text-slate-900">
              <ShieldCheck size={16} className="text-indigo-600" />
              <span>GAMC Global Solutions</span>
              <span className="text-slate-300">|</span>
              <span className="text-slate-400 font-medium">Provider for ISO Certificates</span>
            </div>
            
            <div className={`flex flex-wrap items-center justify-center gap-4 md:gap-8 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
              <a href="https://www.gloria-c.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors">
                <Globe size={14} />
                www.gloria-c.com
              </a>
              <a href="mailto:iso@gloria-c.com" className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors">
                <Mail size={14} />
                iso@gloria-c.com
              </a>
              <div className="flex items-center gap-1.5">
                <Phone size={14} />
                <span>Call / WhatsApp: +971 56 270 3015</span>
              </div>
            </div>

            <div className="text-slate-400 opacity-60">
              © 2026 GAMC
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default App;
