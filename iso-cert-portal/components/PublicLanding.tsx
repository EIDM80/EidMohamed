import React, { useState } from 'react';
import { 
  Shield, 
  Zap, 
  Award, 
  Users, 
  Building, 
  CheckCircle2, 
  FileCheck, 
  ArrowRight, 
  Languages, 
  Phone, 
  Mail, 
  MapPin, 
  ExternalLink, 
  Clock, 
  Menu, 
  X, 
  LogIn, 
  ChevronRight,
  Sparkles,
  Globe,
  Cloud,
  GraduationCap,
  Headphones,
  Monitor,
  DollarSign,
  Check,
  Send,
  MessageSquare,
  ArrowUpRight,
  ShieldCheck,
  Leaf,
  HardHat,
  UtensilsCrossed,
  RefreshCw,
  Lock,
  Stethoscope,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { LandingConfig, LandingService, LandingSection } from '../landingConfig';
import { Language, LANGUAGE_NAMES } from '../translations';
import { submitTrainingLead, TrainingLeadInput, joinReferralProgram } from '../lib/db';
import { LANDING_TRANSLATIONS, NewLang } from '../landingTranslations';
import Logo from './Logo';

const FAQ_ITEMS: { qEn: string; qAr: string; aEn: string; aAr: string }[] = [
  {
    qEn: 'How long does ISO certification take through GAMC?',
    qAr: 'كم تستغرق مدة الحصول على شهادة ISO عبر GAMC؟',
    aEn: 'Once your documents are submitted and reviewed, initial certification can move as fast as 3-7 business days, depending on the standard and accreditation body selected.',
    aAr: 'بعد رفع ومراجعة مستنداتك، يمكن أن تتم عملية الاعتماد الأولية في غضون ٣ إلى ٧ أيام عمل، حسب المعيار وهيئة الاعتماد المختارة.'
  },
  {
    qEn: 'Is my ISO certificate internationally recognized?',
    qAr: 'هل شهادة الـ ISO الخاصة بي معترف بها دولياً؟',
    aEn: 'Yes. Certificates issued through an accredited body are internationally recognized and instantly verifiable through IAF CertSearch, the official global registry.',
    aAr: 'نعم. الشهادات الصادرة عبر هيئة اعتماد معتمدة معترف بها دولياً ويمكن التحقق منها فوراً عبر IAF CertSearch، السجل الرسمي العالمي.'
  },
  {
    qEn: 'How does billing and renewal work?',
    qAr: 'كيف تعمل عملية الدفع والتجديد؟',
    aEn: 'Certification is a subscription: you choose a 1-year or 3-year term, it renews automatically on your card, and you can cancel anytime from your dashboard.',
    aAr: 'الاعتماد هو اشتراك: تختار مدة سنة واحدة أو ٣ سنوات، ويتجدد تلقائياً عبر بطاقتك، ويمكنك الإلغاء في أي وقت من لوحة التحكم الخاصة بك.'
  },
  {
    qEn: 'Which accreditation bodies can I choose from?',
    qAr: 'ما هي هيئات الاعتماد التي يمكنني الاختيار من بينها؟',
    aEn: 'UAF and IAS are available online at fixed, transparent prices. Other globally recognized accreditation bodies are available on request — contact us for a custom quote.',
    aAr: 'هيئتا UAF وIAS متاحتان أونلاين بأسعار ثابتة وشفافة. تتوفر هيئات اعتماد عالمية أخرى بناءً على الطلب — تواصل معنا للحصول على عرض سعر مخصص.'
  },
  {
    qEn: 'Can my clients verify that my certificate is genuine?',
    qAr: 'هل يمكن لعملائي التحقق من أن شهادتي أصلية؟',
    aEn: 'Yes. Every certificate we issue is listed on IAF CertSearch, so anyone can confirm it is genuine in seconds — no need to contact us directly.',
    aAr: 'نعم. كل شهادة نصدرها مدرجة في IAF CertSearch، لذا يمكن لأي شخص التأكد من صحتها في ثوانٍ دون الحاجة للتواصل معنا مباشرة.'
  }
];

const LEAD_AUDITOR_STANDARDS: { code: string; titleEn: string; titleAr: string; icon: any; color: string }[] = [
  { code: 'ISO 9001:2015', titleEn: 'Quality Management', titleAr: 'إدارة الجودة', icon: Award, color: 'indigo' },
  { code: 'ISO 14001:2015', titleEn: 'Environmental Management', titleAr: 'الإدارة البيئية', icon: Leaf, color: 'emerald' },
  { code: 'ISO 45001:2018', titleEn: 'Health & Safety', titleAr: 'الصحة والسلامة', icon: HardHat, color: 'amber' },
  { code: 'ISO 22000:2018', titleEn: 'Food Safety', titleAr: 'سلامة الغذاء', icon: UtensilsCrossed, color: 'rose' },
  { code: 'ISO 22301:2019', titleEn: 'Business Continuity', titleAr: 'استمرارية الأعمال', icon: RefreshCw, color: 'blue' },
  { code: 'ISO/IEC 27001:2022', titleEn: 'Information Security', titleAr: 'أمن المعلومات', icon: Lock, color: 'slate' },
  { code: 'ISO 13485:2016', titleEn: 'Medical Devices', titleAr: 'الأجهزة الطبية', icon: Stethoscope, color: 'teal' }
];

const LEAD_ICON_BG: Record<string, string> = {
  indigo: 'bg-indigo-50 text-indigo-600',
  emerald: 'bg-emerald-50 text-emerald-600',
  amber: 'bg-amber-50 text-amber-600',
  rose: 'bg-rose-50 text-rose-600',
  blue: 'bg-blue-50 text-blue-600',
  slate: 'bg-slate-100 text-slate-600',
  teal: 'bg-teal-50 text-teal-600'
};

interface PublicLandingProps {
  config: LandingConfig;
  lang: Language;
  onSetLang: (lang: Language) => void;
  onNavigateToPortal: (options?: { mode?: 'login' | 'signup'; preselectedISO?: string }) => void;
  isAuthenticated: boolean;
}

const PublicLanding: React.FC<PublicLandingProps> = ({ 
  config, 
  lang, 
  onSetLang, 
  onNavigateToPortal,
  isAuthenticated
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Training course lead capture modal
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [leadForm, setLeadForm] = useState<TrainingLeadInput>({
    fullName: '', email: '', phone: '', company: '', standardCode: '', message: ''
  });
  const [leadSubmitting, setLeadSubmitting] = useState(false);
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [leadError, setLeadError] = useState<string | null>(null);

  const openLeadModal = (standardCode: string) => {
    setLeadForm({ fullName: '', email: '', phone: '', company: '', standardCode, message: '' });
    setLeadSubmitted(false);
    setLeadError(null);
    setLeadModalOpen(true);
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLeadSubmitting(true);
    setLeadError(null);
    const result = await submitTrainingLead(leadForm);
    setLeadSubmitting(false);
    if ('error' in result) {
      setLeadError(result.error);
      return;
    }
    setLeadSubmitted(true);
  };

  // Referral program signup modal
  const [referModalOpen, setReferModalOpen] = useState(false);
  const [referForm, setReferForm] = useState({ name: '', email: '', phone: '' });
  const [referSubmitting, setReferSubmitting] = useState(false);
  const [referResult, setReferResult] = useState<{ code: string; link: string } | null>(null);
  const [referError, setReferError] = useState<string | null>(null);
  const [referLinkCopied, setReferLinkCopied] = useState(false);

  const openReferModal = () => {
    setReferForm({ name: '', email: '', phone: '' });
    setReferResult(null);
    setReferError(null);
    setReferModalOpen(true);
  };

  const handleReferSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setReferSubmitting(true);
    setReferError(null);
    const result = await joinReferralProgram(referForm.name, referForm.email, referForm.phone);
    setReferSubmitting(false);
    if ('error' in result) {
      setReferError(result.error);
      return;
    }
    setReferResult(result);
  };
  const [activeTab, setActiveTab] = useState<string>('all');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  
  // Contact Form State
  const [contactForm, setContactForm] = useState({
    name: '',
    businessName: '',
    phone: '',
    email: '',
    isCompanyOnly: false
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const isAr = lang === 'ar';

  // Looks up fr/de/es/pt/it from the translation dictionary (keyed by the
  // English string); falls back to English for any string not yet in the
  // dictionary, so a missing translation never breaks the page.
  const L = (en: string, ar: string): string => {
    if (lang === 'ar') return ar;
    if (lang === 'en') return en;
    return LANDING_TRANSLATIONS[en]?.[lang as NewLang] ?? en;
  };

  const renderIcon = (iconName: string) => {
    const props = { size: 24, className: "text-indigo-600 group-hover:text-white transition-colors duration-300" };
    switch (iconName) {
      case 'Shield': return <Shield {...props} />;
      case 'Zap': return <Zap {...props} />;
      case 'Award': return <Award {...props} />;
      case 'Users': return <Users {...props} />;
      case 'Building': return <Building {...props} />;
      case 'FileCheck': return <FileCheck {...props} />;
      case 'CheckCircle2': return <CheckCircle2 {...props} />;
      default: return <Shield {...props} />;
    }
  };

  const handleOrderClick = (serviceCode: string) => {
    onNavigateToPortal({ mode: 'signup', preselectedISO: serviceCode });
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      // clear form
      setContactForm({
        name: '',
        businessName: '',
        phone: '',
        email: '',
        isCompanyOnly: false
      });
    }, 5000);
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setNewsletterSubscribed(true);
      setNewsletterEmail('');
      setTimeout(() => setNewsletterSubscribed(false), 5000);
    }
  };

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div 
      dir={isAr ? 'rtl' : 'ltr'} 
      className={`min-h-screen bg-[#fcfdfe] flex flex-col font-sans text-slate-800 ${isAr ? 'text-right' : 'text-left'}`}
    >
      
      {/* Top Banner Contact Bar */}
      <div className="bg-[#121c42] text-[#e2e8f0] py-2.5 px-4 md:px-8 border-b border-slate-800 text-xs font-semibold">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
            <a href={`tel:${config.contact.phone}`} className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Phone size={13} className="text-indigo-400" />
              <span>{config.contact.phone}</span>
            </a>
            <a href={`mailto:${config.contact.email}`} className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Mail size={13} className="text-indigo-400" />
              <span>{config.contact.email}</span>
            </a>
            <div className="flex items-center gap-1.5 text-slate-400">
              <Clock size={13} className="text-indigo-400" />
              <span>{isAr ? config.contact.hoursAr : config.contact.hoursEn}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] uppercase bg-indigo-950/60 border border-indigo-900/50 px-2.5 py-0.5 rounded text-indigo-300 tracking-wider font-bold">
              {L('Authorized ISO Provider', 'مزود معتمد لـ ISO')}
            </span>
          </div>
        </div>
      </div>

      {/* Main Header / Navigation */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
          
          {/* Logo & Brand Name */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-11 h-11 bg-indigo-600 rounded-xl flex items-center justify-center p-1.5 shadow-md shadow-indigo-100">
              <Logo size={32} color="white" />
            </div>
            <div>
              <span className="font-black text-slate-900 text-xl tracking-tight leading-none block">GAMC</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-0.5">
                {L('Global ISO certification platform', 'المنصة العالمية لشهادات الأيزو')}
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-indigo-600 rounded-lg hover:bg-slate-50 transition-all uppercase tracking-tight"
            >
              {L('Home', 'الرئيسية')}
            </button>
            <button
              onClick={() => scrollToSection('about-cloud')}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-indigo-600 rounded-lg hover:bg-slate-50 transition-all uppercase tracking-tight"
            >
              {L('About', 'عن المنصة')}
            </button>
            <button
              onClick={() => scrollToSection('benefits')}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-indigo-600 rounded-lg hover:bg-slate-50 transition-all uppercase tracking-tight"
            >
              {L('Why Us?', 'المزايا')}
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-indigo-600 rounded-lg hover:bg-slate-50 transition-all uppercase tracking-tight"
            >
              {L('How It Works', 'طريقة العمل')}
            </button>
            <button
              onClick={() => scrollToSection('services')}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-indigo-600 rounded-lg hover:bg-slate-50 transition-all uppercase tracking-tight"
            >
              {L('Certificates', 'الشهادات والأسعار')}
            </button>
            <button
              onClick={() => scrollToSection('faq')}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-indigo-600 rounded-lg hover:bg-slate-50 transition-all uppercase tracking-tight"
            >
              {L('FAQs', 'الأسئلة الشائعة')}
            </button>
            <button
              onClick={() => scrollToSection('contact-section')}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-indigo-600 rounded-lg hover:bg-slate-50 transition-all uppercase tracking-tight"
            >
              {L('Contact', 'اتصل بنا')}
            </button>
          </nav>

          {/* Action Items */}
          <div className="hidden lg:flex items-center gap-4">
            <div className="relative flex items-center gap-2 px-3 py-1.5 bg-slate-50 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 rounded-xl text-xs font-bold transition-all border border-slate-200/50">
              <Languages size={15} className="pointer-events-none" />
              <select
                value={lang}
                onChange={(e) => onSetLang(e.target.value as Language)}
                className="bg-transparent outline-none cursor-pointer appearance-none pr-1"
              >
                {(Object.keys(LANGUAGE_NAMES) as Language[]).map((code) => (
                  <option key={code} value={code}>{LANGUAGE_NAMES[code]}</option>
                ))}
              </select>
            </div>

            <button
              onClick={() => onNavigateToPortal()}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full text-xs font-bold transition-all shadow-md shadow-indigo-100 hover:shadow-indigo-200 active:scale-95"
            >
              {isAuthenticated ? (
                <>
                  <span>{L('Go to Client Area', 'بوابة العميل')}</span>
                  <ArrowRight size={15} className={isAr ? 'rotate-180' : ''} />
                </>
              ) : (
                <>
                  <LogIn size={15} />
                  <span>{L('Client Portal', 'تسجيل الدخول')}</span>
                </>
              )}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-3 lg:hidden">
            <div className="relative flex items-center p-2 bg-slate-100 text-slate-600 rounded-xl">
              <Languages size={16} className="pointer-events-none" />
              <select
                value={lang}
                onChange={(e) => onSetLang(e.target.value as Language)}
                className="absolute inset-0 opacity-0 cursor-pointer"
              >
                {(Object.keys(LANGUAGE_NAMES) as Language[]).map((code) => (
                  <option key={code} value={code}>{LANGUAGE_NAMES[code]}</option>
                ))}
              </select>
            </div>
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[112px] bg-white z-30 flex flex-col p-6 border-b border-slate-100 shadow-xl max-h-[80vh] overflow-y-auto">
          <nav className="flex-1 space-y-2">
            <button
              onClick={() => { setMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="w-full text-start font-bold text-slate-800 text-sm py-3 px-4 rounded-xl hover:bg-slate-50 block"
            >
              {L('Home', 'الرئيسية')}
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); scrollToSection('about-cloud'); }}
              className="w-full text-start font-bold text-slate-800 text-sm py-3 px-4 rounded-xl hover:bg-slate-50 block"
            >
              {L('About', 'عن المنصة')}
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); scrollToSection('benefits'); }}
              className="w-full text-start font-bold text-slate-800 text-sm py-3 px-4 rounded-xl hover:bg-slate-50 block"
            >
              {L('Why Us?', 'المزايا')}
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); scrollToSection('how-it-works'); }}
              className="w-full text-start font-bold text-slate-800 text-sm py-3 px-4 rounded-xl hover:bg-slate-50 block"
            >
              {L('How It Works', 'طريقة العمل')}
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); scrollToSection('services'); }}
              className="w-full text-start font-bold text-slate-800 text-sm py-3 px-4 rounded-xl hover:bg-slate-50 block"
            >
              {L('Certificates & Pricing', 'الشهادات والأسعار')}
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); scrollToSection('faq'); }}
              className="w-full text-start font-bold text-slate-800 text-sm py-3 px-4 rounded-xl hover:bg-slate-50 block"
            >
              {L('FAQs', 'الأسئلة الشائعة')}
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); scrollToSection('contact-section'); }}
              className="w-full text-start font-bold text-slate-800 text-sm py-3 px-4 rounded-xl hover:bg-slate-50 block"
            >
              {L('Contact', 'اتصل بنا')}
            </button>
          </nav>
          <div className="mt-6 pt-6 border-t border-slate-100 space-y-4">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigateToPortal();
              }}
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full text-sm font-bold shadow-md shadow-indigo-100 flex items-center justify-center gap-2"
            >
              <LogIn size={16} />
              <span>{L('Sign in to Portal', 'دخول بوابة العميل')}</span>
            </button>
          </div>
        </div>
      )}

      {/* Hero Banner Section */}
      <section 
        id="hero" 
        className="relative min-h-[580px] flex items-center py-16 md:py-28 bg-cover bg-center text-white"
        style={{
          backgroundImage: `radial-gradient(circle at 15% 20%, rgba(99, 102, 241, 0.35), transparent 40%), radial-gradient(circle at 85% 80%, rgba(79, 70, 229, 0.28), transparent 45%), linear-gradient(135deg, #0b1021 0%, #121c42 55%, #1e2a5e 100%)`
        }}
      >
        <div className="absolute inset-0 bg-indigo-950/20 mix-blend-overlay"></div>
        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Hero Left Content */}
            <div className="lg:col-span-7 space-y-6 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-indigo-500/20 backdrop-blur-md text-indigo-300 rounded-full text-xs font-bold tracking-wider uppercase border border-indigo-500/30">
                <Sparkles size={14} className="text-amber-400 animate-pulse" />
                <span>{L('100% digital & fast-track approved solutions', 'حلول ISO رقمية سريعة بنسبة ١٠٠٪')}</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
                {L('ISO Certification Made Simple', 'شهادات الـ ISO أصبحت في غاية السهولة')}
              </h1>

              <p className="text-lg md:text-xl text-slate-300 leading-relaxed font-medium">
                {L('The fastest and most affordable way to become internationally ISO Certified.', 'الطريقة الأسرع والأكثر ملاءمة للحصول على شهادة ISO معتمدة دولياً لشركتك.')}
              </p>

              <p className="text-sm md:text-base text-slate-400 leading-relaxed">
                {L('GAMC is the premier digital ISO platform dedicated to supporting your certification, offering localized workflow, automated document preparation, and swift access to globally recognized accreditation.', 'GAMC هي المنصة الرقمية الوحيدة المخصصة لتقديم خدمات الـ ISO مع دعم مخصص ومحلي متميز، لمساعدتك في إعداد الوثائق والحصول على اعتمادات دولية مرموقة ومعترف بها عالمياً.')}
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-4">
                <button
                  onClick={() => scrollToSection('contact-section')}
                  className="px-8 py-4 bg-white hover:bg-slate-100 text-[#121c42] font-black rounded-full shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-sm uppercase tracking-wider"
                >
                  <span>{L('Contact Us', 'اتصل بنا')}</span>
                </button>
                <button
                  onClick={() => scrollToSection('services')}
                  className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-full transition-all flex items-center justify-center gap-2 text-sm border border-indigo-500"
                >
                  <span>{L('Explore Packages', 'استكشف الباقات والأسعار')}</span>
                  <ArrowRight size={16} className={isAr ? 'rotate-180' : ''} />
                </button>
              </div>
            </div>

            {/* Floating Action Cards in Hero */}
            <div className="lg:col-span-5 relative hidden lg:block">
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-indigo-300 rounded-[2rem] rotate-3 opacity-10 blur-xl"></div>
              
              {/* Overlay elements like the WhatsApp icon & chat bubble in mock */}
              <div className="absolute -top-8 -right-8 z-20 flex flex-col items-end space-y-3">
                <a 
                  href={`https://wa.me/${config.contact.whatsapp.replace(/\+/g, '')}`}
                  target="_blank" 
                  rel="noreferrer"
                  className="w-14 h-14 bg-[#25d366] rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
                >
                  <MessageSquare size={28} className="text-white fill-white" />
                </a>
                <div className="bg-[#121c42] border border-slate-700/80 text-white px-4 py-2.5 rounded-2xl text-[11px] font-bold shadow-xl flex items-center gap-2 animate-bounce">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>{L('Chat With An ISO Advisor', 'تحدث مع مستشار ISO الآن')}</span>
                </div>
              </div>

              <div className="relative bg-[#1a234a]/90 backdrop-blur-md border border-slate-700/60 p-8 rounded-[2rem] shadow-2xl text-slate-100 space-y-6">
                <div className="flex justify-between items-start">
                  <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center p-1.5">
                    <Logo size={28} color="white" />
                  </div>
                  <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest rounded border border-emerald-500/30">
                    {L('ACCREDITED', 'معتمد دولياً')}
                  </span>
                </div>

                <div>
                  <p className="text-[10px] text-indigo-300 uppercase font-black tracking-wider">{L('Digital Registry details', 'تفاصيل السجل الرقمي')}</p>
                  <p className="text-xl font-black tracking-tight mt-1">ISO 9001:2015</p>
                  <p className="text-xs text-slate-300 mt-1">{L('Smart Digital Certification for Enterprises', 'بوابة الاعتماد الرقمية الذكية للمنشآت')}</p>
                </div>

                <div className="border-t border-slate-700/60 pt-4 flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>GLORIA-SECURE</span>
                  <span>STATUS: ACTIVE</span>
                </div>

                <div className="p-4 bg-[#12193b] rounded-2xl space-y-2 text-xs border border-slate-800">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">{L('Processing speed', 'سرعة المعالجة')}</span>
                    <span className="font-bold text-emerald-400">{L('Express (3-7 Days)', 'فوري (٣-٧ أيام)')}</span>
                  </div>
                  <div className="flex justify-between items-center border-t border-slate-800 pt-2 mt-2">
                    <span className="font-bold text-slate-300">{L('Avg. cost reduction', 'متوسط الرسوم الموفرة')}</span>
                    <span className="font-bold text-white text-sm">Up to 60%</span>
                  </div>
                </div>

                <button
                  onClick={() => onNavigateToPortal({ mode: 'signup' })}
                  className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full text-xs font-bold transition-all flex items-center justify-center gap-2"
                >
                  <span>{L('Start Fast-Track Process', 'ابدأ التقديم السريع الآن')}</span>
                  <ChevronRight size={14} className={isAr ? 'rotate-180' : ''} />
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Section 1.5: IAF Accreditation Trust Banner */}
      <section className="py-10 bg-[#0b1021] border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-center gap-6 text-center md:text-start">
          <div className="w-24 h-24 rounded-full bg-white border-4 border-[#1e3a8a] flex items-center justify-center shrink-0 shadow-lg p-2">
            <img src="/images/iaf-logo.png" alt="IAF - International Accreditation Forum" className="w-full h-full object-contain" />
          </div>
          <div>
            <h3 className="text-lg md:text-xl font-black text-white">
              {L('Every Certificate Is Genuine & IAF Accredited', 'جميع شهاداتنا أصلية ومعتمدة من IAF')}
            </h3>
            <p className="text-sm text-slate-400 font-medium mt-1 max-w-2xl">
              {L(
                'GAMC issues certificates exclusively through accreditation bodies that are members of the International Accreditation Forum (IAF), and every certificate is instantly verifiable through the official IAF CertSearch global registry.',
                'تصدر GAMC شهاداتها حصرياً عبر هيئات اعتماد أعضاء في المنتدى الدولي للاعتماد (IAF)، ويمكن التحقق من صحة كل شهادة فوراً عبر السجل العالمي الرسمي IAF CertSearch.'
              )}
            </p>
          </div>
        </div>
      </section>

      {/* Section 2: Cloud Based ISO System (About Cloud) */}
      <section id="about-cloud" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Image Split */}
            <div className="lg:col-span-6 relative">
              <div className="absolute inset-0 bg-indigo-100 rounded-3xl -rotate-2 scale-95 opacity-50"></div>
              <div
                className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-100 w-full h-[380px] flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #121c42 0%, #2c3a7a 100%)' }}
              >
                <ShieldCheck size={110} className="text-white/15" />
                <ShieldCheck size={56} className="text-white absolute" />
              </div>

              {/* Float overlays for micro interaction details */}
              <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3 max-w-[240px] hidden sm:flex">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <Users size={22} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{L('Auditor Network', 'المدققين')}</p>
                  <p className="text-xs font-bold text-slate-800">{L('IRCA Approved', 'مستشارون معتمدون')}</p>
                </div>
              </div>

              <div className="absolute -top-6 -left-6 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3 max-w-[240px] hidden sm:flex">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <FileCheck size={22} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{L('Lab Compliance', 'المختبرات والامتثال')}</p>
                  <p className="text-xs font-bold text-slate-800">{L('Highest Standards', 'جودة مطلقة ممتدة')}</p>
                </div>
              </div>
            </div>

            {/* Right Text Split */}
            <div className="lg:col-span-6 space-y-6">
              <h2 className="text-2xl md:text-3xl font-black text-[#121c42] leading-tight">
                {L(
                  'A cloud-based ISO Documentation system that can be used remotely, to eliminate high cost of ISO Certification.',
                  'نظام توثيق ISO سحابي متطور، يمكن استخدامه وإدارته عن بعد لتوفير التكاليف الباهظة.'
                )}
              </h2>

              <div className="w-16 h-1 bg-indigo-600 rounded-full"></div>

              <p className="text-slate-600 leading-relaxed font-medium">
                {L(
                  'Our unique cloud solution accelerates the certification process, making us the quickest and most affordable provider of accredited ISO certificates. GAMC ensures absolute clarity, regulatory relevance, and seamless digital execution.',
                  'تتسارع بوابتنا الرقمية الفريدة من وتيرة الحصول على شهادات ISO بشكل مذهل، مما يجعلنا الخيار الأكثر كفاءة وموثوقية في تقديم الاعتمادات المعترف بها دولياً في الشرق الأوسط ومختلف دول العالم. نضمن الوضوح التام والشفافية مع الامتثال المكتمل لمتطلبات التدقيق.'
                )}
              </p>

              <div className="pt-4 flex">
                <button
                  onClick={() => scrollToSection('services')}
                  className="px-6 py-3 bg-[#121c42] hover:bg-slate-800 text-white font-bold rounded-full transition-all text-xs uppercase tracking-wider"
                >
                  {L('See Pricing', 'عرض باقات الأسعار')}
                </button>
              </div>
            </div>

          </div>

          {/* Stats strip below */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 text-center border-t border-slate-100 pt-12">
            <div className="space-y-1 bg-[#f8fafc] p-6 rounded-2xl border border-slate-100 hover:shadow-md transition-shadow">
              <h4 className="text-3xl md:text-4xl font-black text-indigo-600">1,800+</h4>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {L('Satisfied Members', 'عضو راضٍ ومستفيد')}
              </p>
            </div>
            <div className="space-y-1 bg-[#f8fafc] p-6 rounded-2xl border border-slate-100 hover:shadow-md transition-shadow">
              <h4 className="text-3xl md:text-4xl font-black text-indigo-600">1,400+</h4>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {L('Training Certificates Issued', 'شهادة تدريب صادرة')}
              </p>
            </div>
            <div className="space-y-1 bg-[#f8fafc] p-6 rounded-2xl border border-slate-100 hover:shadow-md transition-shadow">
              <h4 className="text-3xl md:text-4xl font-black text-indigo-600">22+</h4>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {L('Countries Supported', 'دولة مدعومة ومغذاة')}
              </p>
            </div>
            <div className="space-y-1 bg-[#f8fafc] p-6 rounded-2xl border border-slate-100 hover:shadow-md transition-shadow">
              <h4 className="text-3xl md:text-4xl font-black text-indigo-600">10+</h4>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {L('Years of Experience', 'عاماً من الخبرة والتميز')}
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Section 3: Exclusive Member Benefits */}
      <section id="benefits" className="py-20 bg-[#f8fafc] border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-black text-[#121c42] tracking-tight">
              {L('Exclusive Member Benefits', 'مزايا حصرية فائقة للأعضاء والمنشآت')}
            </h2>
            <div className="w-16 h-1 bg-indigo-600 mx-auto rounded-full"></div>
            <p className="text-slate-500 font-medium">
              {L(
                'Empowering your organization with the absolute best compliance assets and continuous assistance.',
                'توفر لك بوابتنا المتكاملة كل ما تحتاجه من موارد للالتزام بالمعايير العالمية والحفاظ على استمرارية ترخيصك.'
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">

            {/* Left Tall Card Image */}
            <div className="lg:col-span-5 relative flex">
              <div
                className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-100 w-full flex min-h-[350px] items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #1e2a5e 0%, #4338ca 100%)' }}
              >
                <Award size={130} className="text-white/10" />
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-950/80 to-transparent flex items-end p-8 text-white">
                  <div className="space-y-2">
                    <span className="text-[10px] uppercase tracking-widest font-black text-indigo-400 bg-white/10 px-3 py-1 rounded-full">{L('Credibility', 'اعتماداتنا')}</span>
                    <h4 className="text-lg font-bold">{L('Global compliance verified', 'معايير امتثال معترف بها عالمياً')}</h4>
                  </div>
                </div>
              </div>
            </div>

            {/* Right 2x2 Grid of benefits */}
            <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Benefit 1 */}
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100/60 hover:shadow-md hover:border-indigo-100 transition-all space-y-4">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                  <Cloud size={24} />
                </div>
                <h3 className="text-lg font-black text-slate-900">
                  {L('Downloadable Tools', 'أدوات ونماذج قابلة للتنزيل')}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed font-medium">
                  {L(
                    'We provide printable hazard posters and ready-to-use compliance templates with optimal placement guides.',
                    'توفر غلوريا ملصقات مخاطر قابلة للطباعة ونماذج جاهزة للتطبيق لتعزيز معايير السلامة المهنية وتوعية الموظفين.'
                  )}
                </p>
              </div>

              {/* Benefit 2 */}
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100/60 hover:shadow-md hover:border-indigo-100 transition-all space-y-4">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                  <Award size={24} />
                </div>
                <h3 className="text-lg font-black text-slate-900">
                  {L('36 Months Validity', 'صلاحية الشهادة ٣٦ شهراً كاملة')}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed font-medium">
                  {L(
                    'Our issued ISO certificates and active portal memberships remain valid for a full 36 months of secure compliance.',
                    'تتميز شهادات غلوريا وعضوية البوابة بصلاحية تمتد لـ ٣٦ شهراً، مما يضمن وصلاً مستمراً للموارد والدعم الفني والتدقيق السنوي.'
                  )}
                </p>
              </div>

              {/* Benefit 3 */}
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100/60 hover:shadow-md hover:border-indigo-100 transition-all space-y-4">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                  <GraduationCap size={24} />
                </div>
                <h3 className="text-lg font-black text-slate-900">
                  {L('Training Courses', 'دورات تدريبية مدمجة')}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed font-medium">
                  {L(
                    'Members receive complimentary access to qualified internal auditor training courses to empower in-house teams.',
                    'يستمتع أعضاؤنا بفرص دخول مجاني لدورات تدريب المدقق الداخلي، لتمكين كوادر منشأتك من متابعة الامتثال بشكل دوري.'
                  )}
                </p>
              </div>

              {/* Benefit 4 */}
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100/60 hover:shadow-md hover:border-indigo-100 transition-all space-y-4">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                  <Headphones size={24} />
                </div>
                <h3 className="text-lg font-black text-slate-900">
                  {L('Online Support Desk', 'مكتب دعم متكامل على مدار الساعة')}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed font-medium">
                  {L(
                    'Your dedicated hub for auditor-led guidance, fast answers, and continuous assistance throughout the year.',
                    'منصتكم الموثوقة للحصول على إرشادات الخبراء وحلول المعاملات السريعة عبر فريق تدقيق مستجيب وممتاز.'
                  )}
                </p>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* Section 4: Satisfied Members logos */}
      <section className="py-14 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
          <p className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-[0.25em] mb-10">
            {L('Satisfied Members & Verified Partners', 'شركات ومنشآت تثق بخدماتنا واعتماداتنا الرقمية')}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
            {config.partnerLogos.length > 0
              ? config.partnerLogos.map((logo) => (
                  <div key={logo.id} className="w-32 h-16 md:w-36 md:h-20 flex items-center justify-center grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition-all">
                    <img src={logo.logoUrl} alt={logo.name} className="max-w-full max-h-full object-contain" />
                  </div>
                ))
              : [1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="w-32 h-16 md:w-36 md:h-20 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center text-[10px] font-bold text-slate-300 uppercase tracking-wider"
                  >
                    {L('Client Logo', 'شعار العميل')}
                  </div>
                ))}
          </div>
          <div className="mt-8">
            <button
              onClick={() => scrollToSection('contact-section')}
              className="px-6 py-2.5 bg-[#121c42] hover:bg-indigo-600 text-white rounded-full text-xs font-bold transition-all"
            >
              {L('Contact Us', 'اتصل بنا للحصول على الدعم')}
            </button>
          </div>
        </div>
      </section>

      {/* Section 5: Reasons to Choose Us */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">

          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-black text-[#121c42] tracking-tight">
              {L('Reasons To Choose GAMC For Your ISO Certificates', 'لماذا تختار GAMC للحصول على شهادات الـ ISO؟')}
            </h2>
            <div className="w-16 h-1 bg-indigo-600 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* Card 1 */}
            <div className="bg-[#f8fafc] rounded-3xl overflow-hidden border border-slate-100 hover:shadow-xl hover:border-indigo-100 transition-all flex flex-col group">
              <div
                className="h-48 overflow-hidden relative flex items-center justify-center group-hover:scale-105 transition-transform duration-500"
                style={{ background: 'linear-gradient(135deg, #312e81 0%, #6366f1 100%)' }}
              >
                <Monitor size={72} className="text-white/90" />
              </div>
              <div className="p-6 space-y-3 flex-1 flex flex-col">
                <h3 className="text-lg font-black text-slate-900">{L('Simple User Interface', 'واجهة مستخدم بسيطة للغاية')}</h3>
                <p className="text-sm text-slate-500 leading-relaxed font-medium flex-1">
                  {L(
                    'A cloud-based layout ensures that companies of all sizes can easily finish and request certificates online.',
                    'منصة سحابية متقدمة تضمن حصول منشأتك على الاعتماد في أقل وقت ممكن مع الحفاظ على صرامة متطلبات المراجعة.'
                  )}
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-[#f8fafc] rounded-3xl overflow-hidden border border-slate-100 hover:shadow-xl hover:border-indigo-100 transition-all flex flex-col group">
              <div
                className="h-48 overflow-hidden relative flex items-center justify-center group-hover:scale-105 transition-transform duration-500"
                style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)' }}
              >
                <Globe size={72} className="text-white/90" />
              </div>
              <div className="p-6 space-y-3 flex-1 flex flex-col">
                <h3 className="text-lg font-black text-slate-900">{L('Remote Access', 'الوصول المدار عن بعد')}</h3>
                <p className="text-sm text-slate-500 leading-relaxed font-medium flex-1">
                  {L(
                    'Our pipeline is accessible securely from any device, anytime. No complex manual files, no hard geographical borders.',
                    'يمكن الوصول لخدمات غلوريا™ من أي مكان في العالم ومتابعة حالة ملفكم مباشرة دون الحاجة لعناء الزيارات الميدانية المعقدة.'
                  )}
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-[#f8fafc] rounded-3xl overflow-hidden border border-slate-100 hover:shadow-xl hover:border-indigo-100 transition-all flex flex-col group">
              <div
                className="h-48 overflow-hidden relative flex items-center justify-center group-hover:scale-105 transition-transform duration-500"
                style={{ background: 'linear-gradient(135deg, #065f46 0%, #10b981 100%)' }}
              >
                <DollarSign size={72} className="text-white/90" />
              </div>
              <div className="p-6 space-y-3 flex-1 flex flex-col">
                <h3 className="text-lg font-black text-slate-900">{L('Cost Effective', 'فعالية تامة في التكلفة')}</h3>
                <p className="text-sm text-slate-500 leading-relaxed font-medium flex-1">
                  {L(
                    'With a one-time fixed fee and zero hidden advisor cost, we make quality compliance budget-friendly for small and large teams.',
                    'برسوم ثابتة تدفع لمرة واحدة وبدون تكاليف استشارية خفية، نتيح حتى للشركات الناشئة والصغيرة فرصة الحصول على الترخيص.'
                  )}
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Section 6: How It Works */}
      <section id="how-it-works" className="py-20 bg-[#f8fafc] border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-black text-[#121c42] tracking-tight">
              {L('How It Works', 'طريقة العمل والتنفيذ في ٣ خطوات')}
            </h2>
            <div className="w-16 h-1 bg-indigo-600 mx-auto rounded-full"></div>
            <p className="text-slate-500 font-medium">
              {L(
                'GAMC streamlines international certification with localized Arabic support, guiding you through modern steps.',
                'تبسط GAMC الحصول على الشهادة بدعم كامل للغة العربية، لتوجيه الشركات عبر خطوات بسيطة وفعالة عبر الإنترنت.'
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            {/* Left Dubai Skyline Card */}
            <div className="lg:col-span-5">
              <div
                className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-100 h-[380px] flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #0b1021 0%, #1e2a5e 60%, #3730a3 100%)' }}
              >
                <Building size={140} className="text-white/10" />
                <div className="absolute inset-0 flex flex-col justify-end p-8 text-white bg-gradient-to-t from-slate-950/80 to-transparent">
                  <span className="text-xs font-bold text-indigo-300 uppercase tracking-widest mb-1">{L('BASED IN DUBAI', 'من قلب دبي')}</span>
                  <h4 className="text-xl font-black">{L('Rapid Global Processing', 'سرعة ومصداقية عالمية')}</h4>
                </div>
              </div>
            </div>

            {/* Right Horizontal/Vertical Custom Steps */}
            <div className="lg:col-span-7 space-y-8">

              {/* Step 1 */}
              <div className="flex gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:border-indigo-100 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-lg shrink-0">
                  1
                </div>
                <div className="space-y-1">
                  <h4 className="font-black text-slate-900 text-base">{L('Choose Your Standard', 'اختر المعيار المناسب')}</h4>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {L(
                      'Select your desired framework (ISO 9001, 14001, etc.) and complete your initial business profile details.',
                      'حدد معيار الـ ISO الذي ترغب بالحصول عليه لشركتك واملأ بيانات المنشأة الأساسية عبر نظامنا.'
                    )}
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:border-indigo-100 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-lg shrink-0">
                  2
                </div>
                <div className="space-y-1">
                  <h4 className="font-black text-slate-900 text-base">{L('Upload Documentation', 'رفع مستندات الامتثال')}</h4>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {L(
                      'Upload required documents via our secure dashboard guided by intuitive auditor checklists for rapid review.',
                      'قم برفع ملفات ومخططات شركتك باتباع موجهاتنا الذكية ليتسنى لفريق التدقيق مراجعتها فورا.'
                    )}
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:border-indigo-100 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-lg shrink-0">
                  3
                </div>
                <div className="space-y-1">
                  <h4 className="font-black text-slate-900 text-base">{L('Receive Certificate', 'تحميل واستلام الشهادة')}</h4>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {L(
                      'Upon successful virtual audit, download your certified PDF immediately and receive secure printed copies.',
                      'بمجرد نجاح التدقيق الفوري، قم بتحميل نسختك المعتمدة مباشرة مع تفعيل رقم التسجيل الدولي الخاص بك.'
                    )}
                  </p>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* Section 6.5: Certificate Verification Demo */}
      <section id="verify-demo" className="py-20 bg-[#0b1021]">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            <div className={`lg:col-span-5 space-y-6 ${isAr ? 'lg:order-2 text-right' : ''}`}>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-indigo-500/20 backdrop-blur-md text-indigo-300 rounded-full text-xs font-bold tracking-wider uppercase border border-indigo-500/30">
                <ShieldCheck size={14} />
                <span>{L('Full Transparency', 'شفافية كاملة')}</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-white leading-tight">
                {L('Verify Any ISO Certificate Instantly', 'تحقق فوراً من صحة أي شهادة ISO')}
              </h2>
              <p className="text-slate-400 leading-relaxed">
                {L(
                  'Every certificate we issue is instantly verifiable through IAF CertSearch, the official global registry for internationally accredited certifications. Watch how your clients and partners can confirm your certificate is genuine in seconds.',
                  'كل شهادة نصدرها قابلة للتحقق فوراً عبر قاعدة بيانات IAF CertSearch العالمية — السجل الرسمي الموحّد لجميع شهادات الاعتماد المعترف بها دولياً. شاهد كيف يمكن لعملائك وشركائك التأكد من صحة شهادتك في ثوانٍ.'
                )}
              </p>
              <div className="flex items-center gap-3 pt-2">
                <a
                  href="https://www.iafcertsearch.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-slate-100 text-[#0b1021] font-bold rounded-full transition-all text-sm"
                >
                  <span>{L('Visit IAF CertSearch', 'زيارة IAF CertSearch')}</span>
                  <ExternalLink size={16} />
                </a>
              </div>
            </div>

            <div className={`lg:col-span-7 ${isAr ? 'lg:order-1' : ''}`}>
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-700/60 bg-black">
                <video
                  className="w-full h-auto block"
                  src="https://img.iafcertsearch.org/r/p/landing/animations/manual-search.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="auto"
                >
                  {L('Your browser does not support the video tag.', 'متصفحك لا يدعم عرض الفيديو.')}
                </video>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Section 7: Pricing */}
      <section id="services" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-black text-[#121c42] tracking-tight">
              {L('Pricing & Accredited Standards', 'الشهادات المتاحة والأسعار الشفافة')}
            </h2>
            <div className="w-16 h-1 bg-indigo-600 mx-auto rounded-full"></div>
            <p className="text-slate-500 font-medium">
              {L(
                'Clear pricing structure for maximum organization value, speed, and absolute transparency.',
                'باقات مرنة وتنافسية تناسب مختلف المنشآت والشركات لتحقيق الامتثال التام دون أي استشارات مكلفة.'
              )}
            </p>
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            
            {/* Card 1: ISO 9001 */}
            <div className="bg-[#f8fafc] border border-slate-200/60 rounded-3xl p-6 flex flex-col justify-between hover:shadow-xl hover:border-indigo-200 transition-all relative overflow-hidden group">
              <div className="space-y-4">
                <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-[10px] font-black rounded uppercase tracking-wider block w-fit mb-2">
                  ISO 9001:2015
                </span>
                <h3 className="text-base font-black text-slate-900">
                  {L('Quality Management System', 'نظام إدارة الجودة (QMS)')}
                </h3>
                <div className="pt-2">
                  <span className="text-xs font-bold text-slate-400 block uppercase tracking-widest">{L('Fixed fee', 'رسوم ثابتة')}</span>
                  <span className="text-2xl font-black text-[#121c42]">AED 4,495</span>
                </div>

                <div className="border-t border-slate-200/50 pt-4 mt-4">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">{L('Features Included:', 'مزايا الباقة:')}</p>
                  <ul className="space-y-2 text-xs text-slate-600 font-medium">
                    <li className="flex items-start gap-1.5">
                      <Check size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                      <span>{L('Globally Recognized & Verifiable', 'اعتماد دولي مرموق ومعترف به')}</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Check size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                      <span>{L('Full Document Prep & Guided Audit', 'إعداد الوثائق ومراجعتها بالكامل')}</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Check size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                      <span>{L('3-Year Certified Validity', 'صلاحية الشهادة ٣ سنوات معتمدة')}</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Check size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                      <span>{L('Complimentary Auditor Training', 'وصول مجاني لمنصة التدريب')}</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="pt-6">
                <button
                  onClick={() => handleOrderClick('ISO 9001')}
                  className="w-full py-3 bg-[#121c42] hover:bg-indigo-600 text-white rounded-xl text-xs font-bold transition-all uppercase tracking-wider"
                >
                  {L('Buy Now', 'شراء الآن')}
                </button>
              </div>
            </div>

            {/* Card 2: ISO 14001 */}
            <div className="bg-[#f8fafc] border border-slate-200/60 rounded-3xl p-6 flex flex-col justify-between hover:shadow-xl hover:border-indigo-200 transition-all relative overflow-hidden group">
              <div className="space-y-4">
                <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-[10px] font-black rounded uppercase tracking-wider block w-fit mb-2">
                  ISO 14001:2015
                </span>
                <h3 className="text-base font-black text-slate-900">
                  {L('Environmental Management', 'نظام إدارة البيئة (EMS)')}
                </h3>
                <div className="pt-2">
                  <span className="text-xs font-bold text-slate-400 block uppercase tracking-widest">{L('Fixed fee', 'رسوم ثابتة')}</span>
                  <span className="text-2xl font-black text-[#121c42]">AED 4,495</span>
                </div>

                <div className="border-t border-slate-200/50 pt-4 mt-4">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">{L('Features Included:', 'مزايا الباقة:')}</p>
                  <ul className="space-y-2 text-xs text-slate-600 font-medium">
                    <li className="flex items-start gap-1.5">
                      <Check size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                      <span>{L('Globally Recognized & Verifiable', 'اعتماد بيئي متوافق كليا')}</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Check size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                      <span>{L('Full Document Prep & Guided Audit', 'توفير التكاليف ومراجعة الموارد')}</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Check size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                      <span>{L('3-Year Certified Validity', 'صلاحية الشهادة ٣ سنوات معتمدة')}</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Check size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                      <span>{L('Complimentary Auditor Training', 'مكتب دعم فني ذكي للمراجعة')}</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="pt-6">
                <button
                  onClick={() => handleOrderClick('ISO 14001')}
                  className="w-full py-3 bg-[#121c42] hover:bg-indigo-600 text-white rounded-xl text-xs font-bold transition-all uppercase tracking-wider"
                >
                  {L('Buy Now', 'شراء الآن')}
                </button>
              </div>
            </div>

            {/* Card 3: ISO 45001 */}
            <div className="bg-[#f8fafc] border border-slate-200/60 rounded-3xl p-6 flex flex-col justify-between hover:shadow-xl hover:border-indigo-200 transition-all relative overflow-hidden group">
              <div className="space-y-4">
                <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-[10px] font-black rounded uppercase tracking-wider block w-fit mb-2">
                  ISO 45001:2018
                </span>
                <h3 className="text-base font-black text-slate-900">
                  {L('Occupational Health & Safety', 'السلامة والصحة المهنية (OHSMS)')}
                </h3>
                <div className="pt-2">
                  <span className="text-xs font-bold text-slate-400 block uppercase tracking-widest">{L('Fixed fee', 'رسوم ثابتة')}</span>
                  <span className="text-2xl font-black text-[#121c42]">AED 4,495</span>
                </div>

                <div className="border-t border-slate-200/50 pt-4 mt-4">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">{L('Features Included:', 'مزايا الباقة:')}</p>
                  <ul className="space-y-2 text-xs text-slate-600 font-medium">
                    <li className="flex items-start gap-1.5">
                      <Check size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                      <span>{L('Globally Recognized & Verifiable', 'اعتماد للحد من مخاطر العمل')}</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Check size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                      <span>{L('Full Document Prep & Guided Audit', 'تقليل الفاقد وتأمين المنشأة')}</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Check size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                      <span>{L('3-Year Certified Validity', 'صلاحية الشهادة ٣ سنوات معتمدة')}</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Check size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                      <span>{L('Complimentary Auditor Training', 'الوصول لدورات مدقق داخلي ممتازة')}</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="pt-6">
                <button
                  onClick={() => handleOrderClick('ISO 45001')}
                  className="w-full py-3 bg-[#121c42] hover:bg-indigo-600 text-white rounded-xl text-xs font-bold transition-all uppercase tracking-wider"
                >
                  {L('Buy Now', 'شراء الآن')}
                </button>
              </div>
            </div>

            {/* Card 4: Integrated Management System (IMS) */}
            <div className="bg-[#121c42] text-white border-2 border-indigo-500 rounded-3xl p-6 flex flex-col justify-between hover:shadow-2xl transition-all relative overflow-hidden group">
              <div className="absolute top-0 right-0 bg-[#f7b500] text-[#121c42] text-[8px] font-black px-3 py-1 uppercase rounded-bl-xl tracking-widest">
                {L('BEST VALUE PACKAGE', 'باقة التميز المتكاملة')}
              </div>
              <div className="space-y-4">
                <span className="px-2.5 py-1 bg-indigo-500/30 text-indigo-300 text-[10px] font-black rounded uppercase tracking-wider block w-fit mb-2 border border-indigo-500/20">
                  IMS SPECIAL BUNDLE
                </span>
                <h3 className="text-base font-black text-white">
                  {L('Integrated Management System', 'نظام الإدارة المتكامل (IMS)')}
                </h3>
                <p className="text-[10px] text-slate-400 font-medium">{L('ISO 9001, 14001, and 45001 combined.', 'حزمة تجمع معايير ISO 9001 + 14001 + 45001')}</p>

                <div className="pt-2">
                  <span className="text-xs font-bold text-slate-400 block uppercase tracking-widest">{L('All-inclusive fee', 'رسوم ثابتة شاملة')}</span>
                  <span className="text-2xl font-black text-[#f7b500]">AED 10,995</span>
                </div>

                <div className="border-t border-slate-700/60 pt-4 mt-4">
                  <p className="text-xs font-bold text-indigo-300 uppercase tracking-widest mb-3">{L('IMS Premium Features:', 'مزايا الباقة الشاملة:')}</p>
                  <ul className="space-y-2 text-xs text-slate-300 font-medium">
                    <li className="flex items-start gap-1.5">
                      <Check size={14} className="text-[#f7b500] shrink-0 mt-0.5" />
                      <span>{L('3 Fully Verified ISO Certificates', '٣ شهادات ISO كاملة معتمدة ومتكاملة')}</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Check size={14} className="text-[#f7b500] shrink-0 mt-0.5" />
                      <span>{L('Save Over AED 2,000 Instantly', 'توفير مذهل لأكثر من AED 2,000')}</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Check size={14} className="text-[#f7b500] shrink-0 mt-0.5" />
                      <span>{L('Unified Auditor Compliance Stream', 'إجراء تدقيق متكامل وموحد لتوفير التعب')}</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Check size={14} className="text-[#f7b500] shrink-0 mt-0.5" />
                      <span>{L('Priority Support & Dedicated Auditor', 'مستشار حصر لمتابعة الملف سنوياً')}</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="pt-6">
                <button
                  onClick={() => handleOrderClick('IMS Bundle')}
                  className="w-full py-3.5 bg-[#f7b500] hover:bg-[#e6a800] text-slate-900 rounded-xl text-xs font-black transition-all uppercase tracking-widest"
                >
                  {L('Buy IMS Bundle', 'شراء الآن الباقة المتكاملة')}
                </button>
              </div>
            </div>

          </div>

          {/* Alert box below pricing */}
          <div className="mt-14 bg-[#f8fafc] border border-slate-200/50 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-sm text-slate-600 font-medium max-w-3xl leading-relaxed text-center md:text-start">
              {L(
                'Meet regulatory compliance, improve operational efficiency, and build trust with local and international partners in competitive markets today.',
                'حقق الامتثال اللوائح والتشريعات، وحسّن الكفاءة التشغيلية، وابنِ جسور الثقة مع الشركاء المحليين والدوليين في الأسواق التنافسية اليوم.'
              )}
            </p>
            <button
              onClick={() => scrollToSection('contact-section')}
              className="px-6 py-3 bg-[#121c42] hover:bg-slate-800 text-white rounded-full text-xs font-bold transition-all shrink-0 uppercase tracking-wider"
            >
              {L('Contact Us', 'اتصل بنا الآن')}
            </button>
          </div>

        </div>
      </section>

      {/* Section 7.5: Lead Auditor Training Courses */}
      <section className="py-20 bg-[#f8fafc] border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 md:px-8">

          <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold tracking-wider uppercase border border-indigo-100">
              <GraduationCap size={14} />
              <span>{L('100% Online', '100% أونلاين')}</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-[#121c42] tracking-tight">
              {L('Lead Auditor Training Standards', 'دورات تدريب المدقق الرئيسي (Lead Auditor)')}
            </h2>
            <div className="w-16 h-1 bg-indigo-600 mx-auto rounded-full"></div>
            <p className="text-slate-500 font-medium">
              {L(
                'All Lead Auditor training courses are delivered fully online, so your team can qualify without travel or in-person attendance.',
                'جميع دورات تدريب المدقق الرئيسي تُقدَّم بالكامل أونلاين، مما يتيح لفريقك التأهل دون الحاجة للسفر أو التواجد الحضوري.'
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {LEAD_AUDITOR_STANDARDS.map((std) => (
              <div
                key={std.code}
                className="bg-white border border-slate-200/60 rounded-2xl p-6 flex flex-col items-center text-center gap-3 hover:shadow-lg hover:border-indigo-200 transition-all"
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${LEAD_ICON_BG[std.color]}`}>
                  <std.icon size={26} />
                </div>
                <div>
                  <span className="text-sm font-black text-slate-900 block">{std.code}</span>
                  <span className="text-xs text-slate-500 font-medium block mt-0.5">{L(std.titleEn, std.titleAr)}</span>
                </div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{L('Lead Auditor', 'مدقق رئيسي')}</span>
                <button
                  onClick={() => openLeadModal(std.code)}
                  className="mt-2 w-full py-2.5 bg-slate-50 hover:bg-indigo-600 text-slate-700 hover:text-white border border-slate-200 hover:border-indigo-600 rounded-xl text-xs font-bold transition-all"
                >
                  {L('Request Info', 'اطلب معلومات')}
                </button>
              </div>
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <button
              onClick={() => openLeadModal('')}
              className="px-6 py-3 bg-[#121c42] hover:bg-indigo-600 text-white rounded-full text-xs font-bold transition-all uppercase tracking-wider"
            >
              {L('Ask About Course Schedules', 'استفسر عن مواعيد الدورات')}
            </button>
          </div>

        </div>
      </section>

      {/* Section 7.6: Refer & Earn */}
      <section id="refer-earn" className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 md:px-8">
          <div
            className="rounded-[2.5rem] p-8 md:p-14 text-center text-white relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #121c42 0%, #312e81 60%, #4338ca 100%)' }}
          >
            <DollarSign size={220} className="absolute -top-10 -right-10 text-white/5 rotate-12" />
            <div className="relative z-10 space-y-5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/10 backdrop-blur-md text-amber-300 rounded-full text-xs font-bold tracking-wider uppercase border border-white/20">
                <Sparkles size={14} />
                <span>{L('Referral Program', 'برنامج الإحالة')}</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black tracking-tight">
                {L('Refer a Client, Earn AED 500', 'أحِل عميلاً، واربح AED 500')}
              </h2>
              <p className="text-indigo-100 max-w-xl mx-auto font-medium leading-relaxed">
                {L(
                  'Join free and get your own referral link instantly. For every client you refer who completes payment for an ISO certificate, you earn AED 500.',
                  'انضم مجاناً واحصل على رابط إحالة خاص بك فوراً. لكل عميل تُحيله ويكمل الدفع مقابل شهادة ISO، تربح AED 500.'
                )}
              </p>
              <div className="pt-2">
                <button
                  onClick={openReferModal}
                  className="px-8 py-4 bg-white hover:bg-slate-100 text-[#121c42] font-black rounded-full shadow-lg transition-all active:scale-[0.98] text-sm uppercase tracking-wider"
                >
                  {L('Join Now & Get Your Link', 'انضم الآن واحصل على رابطك')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 8: Call to Action Banner (Business Growth) */}
      <section 
        className="relative py-24 bg-cover bg-center text-white"
        style={{
          backgroundImage: `radial-gradient(circle at 80% 30%, rgba(247, 181, 0, 0.15), transparent 40%), radial-gradient(circle at 10% 90%, rgba(99, 102, 241, 0.3), transparent 45%), linear-gradient(135deg, #121c42 0%, #182658 100%)`
        }}
      >
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center space-y-6 relative z-10">
          <h2 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
            {L('Business Growth with Accessible ISO Certification and Training', 'نمو الأعمال التجارية مع شهادات ISO المعتمدة والتدريب')}
          </h2>
          <p className="text-indigo-100 max-w-2xl mx-auto font-medium leading-relaxed text-sm md:text-base">
            {L(
              'Meet regulatory compliance, improve operational efficiency, and build trust with local and international partners in competitive markets globally.',
              'حقق الامتثال اللوائح والتشريعات وحسن الكفاءة التشغيلية لشركتك لبناء ثقة راسخة مع الشركاء المحليين والدوليين في الأسواق التنافسية.'
            )}
          </p>
          <div className="pt-4 flex justify-center">
            <button
              onClick={() => onNavigateToPortal({ mode: 'signup' })}
              className="px-8 py-4 bg-[#f7b500] hover:bg-[#e6a800] text-[#121c42] font-black rounded-full shadow-lg transition-all active:scale-[0.98] uppercase text-xs tracking-widest"
            >
              {L('Order Now', 'اطلب الآن شهادتك')}
            </button>
          </div>
        </div>
      </section>

      {/* Section 9: Contact Us & Partner Split Section */}
      <section id="contact-section" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            
            {/* Contact Form Card on Left */}
            <div className="bg-[#b9d2f6] rounded-[2rem] p-6 md:p-8 flex flex-col justify-center shadow-sm">
              <div className="bg-white rounded-3xl p-6 md:p-10 shadow-md">
                <h2 className="text-3xl md:text-4xl font-black text-slate-800 mb-8 text-center">{L('Contact us', 'اتصل بنا')}</h2>

                {formSubmitted ? (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-4 my-8">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                      <CheckCircle2 size={24} />
                    </div>
                    <h3 className="font-bold text-slate-900">{L('Message Sent Successfully!', 'تم الإرسال بنجاح!')}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {L(
                        'Thank you! Your message has been sent successfully. One of our qualified ISO auditors will contact you shortly.',
                        'شكراً لك! تم إرسال رسالتك بنجاح. سيتواصل معك أحد مستشارينا المعتمدين خلال الساعات القليلة القادمة.'
                      )}
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs md:text-sm font-bold text-slate-800 mb-2">{L('Contact Name:', 'اسم جهة الاتصال:')}</label>
                        <input
                          type="text"
                          required
                          value={contactForm.name}
                          onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                          className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-xs md:text-sm font-medium text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-inner"
                        />
                      </div>

                      <div>
                        <label className="block text-xs md:text-sm font-bold text-slate-800 mb-2">{L('Business Name:', 'اسم الشركة / المنشأة:')}</label>
                        <input
                          type="text"
                          required
                          value={contactForm.businessName}
                          onChange={(e) => setContactForm({ ...contactForm, businessName: e.target.value })}
                          className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-xs md:text-sm font-medium text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-inner"
                        />
                      </div>

                      <div>
                        <label className="block text-xs md:text-sm font-bold text-slate-800 mb-2">{L('Telephone Number:', 'رقم الهاتف:')}</label>
                        <input
                          type="tel"
                          required
                          value={contactForm.phone}
                          onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                          placeholder={L('(Include area code)', '(تشمل رمز المنطقة)')}
                          className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-xs md:text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-inner"
                        />
                      </div>

                      <div>
                        <label className="block text-xs md:text-sm font-bold text-slate-800 mb-2">{L('Email', 'البريد الإلكتروني:')}</label>
                        <input
                          type="email"
                          required
                          value={contactForm.email}
                          onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                          className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-xs md:text-sm font-medium text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-inner"
                        />
                      </div>
                    </div>

                    <div className="flex items-start gap-3 pt-2">
                      <input
                        type="checkbox"
                        id="companyOnly"
                        checked={contactForm.isCompanyOnly}
                        onChange={(e) => setContactForm({ ...contactForm, isCompanyOnly: e.target.checked })}
                        className="mt-1.5 h-4 w-4 accent-indigo-600 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <label htmlFor="companyOnly" className="text-xs md:text-sm font-bold text-slate-800 leading-relaxed select-none cursor-pointer">
                        {L(
                          'This enquiry is for company ISO certification only (Not Individual ISO Training Courses)',
                          'هذا الاستفسار مخصص لشهادات ISO للشركات والمؤسسات فقط (وليس لدورات تدريب الأفراد).'
                        )}
                      </label>
                    </div>

                    <div className="pt-4 flex justify-center">
                      <button
                        type="submit"
                        className="px-12 py-3 bg-[#1e40af] hover:bg-blue-800 text-white rounded-xl text-sm font-bold transition-all shadow-md hover:scale-[1.02] active:scale-[0.98] min-w-[140px]"
                      >
                        {L('Send', 'إرسال')}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>

            {/* Partner with Us on Right */}
            <div className="bg-[#b9d2f6] rounded-[2rem] p-8 md:p-12 flex flex-col justify-center shadow-sm">
              <div className="space-y-6 text-center lg:text-start">
                <div className="text-center">
                  <h2 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight">
                    GAMC
                  </h2>
                  <p className="text-xs md:text-sm text-indigo-800 font-bold uppercase tracking-wider mt-1">
                    {L('Global ISO certification platform', 'المنصة العالمية لشهادات الأيزو')}
                  </p>
                </div>

                <p className="text-sm md:text-base text-slate-800 leading-relaxed font-medium">
                  {L(
                    'As a fully digital ISO certification platform with integrated training capabilities and dedicated help desk support, GAMC collaborates with a select network of ISO consultants around the world who leverage our online platform to deliver certification services to their clients efficiently and at scale.',
                    'بصفتنا منصة رقمية بالكامل لمنح شهادات ISO مع إمكانات تدريب متكاملة ودعم مخصص للمساعدة، تتعاون GAMC مع شبكة مختارة من مستشاري ISO حول العالم الذين يستفيدون من منصتنا الإلكترونية لتقديم خدمات إصدار الشهادات لعملائهم بكفاءة وعلى نطاق واسع.'
                  )}
                </p>

                <p className="text-sm md:text-base text-slate-800 leading-relaxed font-medium">
                  {L(
                    'Our consultant partners benefit from a ready-made digital infrastructure, accredited certification pathways, and multilingual support, including the only full Arabic-language ISO training platform of its kind globally.',
                    'يستفيد شركاؤنا الاستشاريون من بنية تحتية رقمية جاهزة، ومسارات اعتماد معتمدة، ودعم متعدد اللغات، بما في ذلك منصة التدريب الوحيدة الكاملة باللغة العربية لشهادات ISO من نوعها في العالم.'
                  )}
                </p>

                <p className="text-sm md:text-base text-slate-800 leading-relaxed font-medium">
                  {L(
                    'If you are an established ISO consultant looking to broaden your service offering, expand into new markets, or streamline your delivery through a trusted digital partner, we would be pleased to explore how a collaboration could work.',
                    'إذا كنت مستشار ISO معتمداً وتتطلع إلى توسيع نطاق خدماتك، أو التوسع في أسواق جديدة، أو تبسيط تسليم خدماتك من خلال شريك رقمي موثوق، يسعدنا استكشاف كيف يمكن أن يعمل هذا التعاون.'
                  )}
                </p>

                <p className="text-sm md:text-base text-slate-800 leading-relaxed font-medium">
                  {L(
                    'Drop us an email at iso@gloria-c.com with information about your consultancy, the standards you work with, and the markets you cover, and one of our team will get back to you to arrange a call.',
                    'أرسل لنا بريداً إلكترونياً على iso@gloria-c.com يحتوي على معلومات حول استشاراتك، والمعايير التي تعمل بها، والأسواق التي تغطيها، وسيتصل بك أحد أعضاء فريقنا لترتيب مكالمة.'
                  )}
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Section 9.5: FAQ */}
      <section id="faq" className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 md:px-8">
          <div className="text-center mb-14 space-y-4">
            <h2 className="text-3xl md:text-4xl font-black text-[#121c42] tracking-tight">
              {L('Frequently Asked Questions', 'الأسئلة الشائعة')}
            </h2>
            <div className="w-16 h-1 bg-indigo-600 mx-auto rounded-full"></div>
          </div>

          <div className="space-y-3">
            {FAQ_ITEMS.map((item, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div key={index} className="bg-[#f8fafc] border border-slate-100 rounded-2xl overflow-hidden">
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full flex items-center justify-between gap-4 p-5 text-start"
                  >
                    <span className="font-bold text-slate-900 text-sm">{L(item.qEn, item.qAr)}</span>
                    <ChevronRight
                      size={18}
                      className={`shrink-0 text-indigo-600 transition-transform ${isOpen ? 'rotate-90' : isAr ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-sm text-slate-500 leading-relaxed font-medium">
                      {L(item.aEn, item.aAr)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section 10: Worldwide Offices */}
      <section className="py-20 bg-[#f8fafc] border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-2xl md:text-3xl font-black text-[#121c42] tracking-tight">
              {L('GAMC Worldwide Offices', 'مكاتب GAMC العالمية للتنسيق والاعتماد')}
            </h2>
            <div className="w-16 h-1 bg-indigo-600 mx-auto rounded-full"></div>
          </div>

          <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6">

            {/* Office 1: UAE */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🇦🇪</span>
                <h3 className="font-black text-slate-900">{L('United Arab Emirates', 'الإمارات العربية المتحدة')}</h3>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                {L('Al Garhoud, Dubai, United Arab Emirates.', 'القرهود، دبي، الإمارات العربية المتحدة.')}
              </p>
              <div className="pt-2 text-[11px] text-slate-400 font-semibold space-y-1">
                <p>Phone / WhatsApp: +971 56 270 3015</p>
              </div>
            </div>

            {/* Office 2: UK */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🇬🇧</span>
                <h3 className="font-black text-slate-900">{L('United Kingdom', 'المملكة المتحدة')}</h3>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Uk Sns Unit 9 Skyport Drive, Harmondsworth, West Drayton, Harmondsworth, United Kingdom, United Kingdom, UB7 0LB
              </p>
              <div className="pt-2 text-[11px] text-slate-400 font-semibold space-y-1">
                <p>Email: iso@gloria-c.com</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Public Footer */}
      <footer className="bg-[#0b1021] text-slate-400 py-16 border-t border-slate-800 text-xs font-semibold">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
          
          {/* Brand Col */}
          <div className="md:col-span-5 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center p-1.5 shadow-md">
                <Logo size={28} color="white" />
              </div>
              <span className="font-black text-white text-lg tracking-tight">GAMC Global Solutions</span>
            </div>
            <p className="text-slate-500 font-medium leading-relaxed max-w-sm">
              {L(
                'Since 2015, GAMC has been redefining ISO certification. Our 100% online platform helps small and medium-sized businesses get certified quickly and confidently.',
                'منذ عام ٢٠١٥، تعمل GAMC على إعادة تعريف مفهوم شهادات الـ ISO. تساعد منصتنا الرقمية بالكامل بنسبة ١٠٠٪ الشركات الصغيرة والمتوسطة في الحصول على الاعتماد بسرعة وثقة.'
              )}
            </p>
            <p className="text-slate-500 font-medium leading-relaxed max-w-sm">
              {L(
                'We simplify every step providing continuous online guidance, clear pricing, and trusted support to make certification effortless and affordable.',
                'نحن نبسط كل خطوة ونوفر توجيهاً مستمراً عبر الإنترنت، وتسعيراً شفافاً، ودعماً موثوقاً لجعل الحصول على الشهادة سهلاً وبأسعار معقولة.'
              )}
            </p>
            <div className="pt-2 text-slate-500 font-medium flex items-center gap-1.5 uppercase text-[10px] tracking-wider">
              <Globe size={14} className="text-indigo-500" />
              <span>Official License Holder</span>
            </div>
          </div>

          {/* Quick Menu */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="font-bold text-white uppercase tracking-wider">{L('Quick Links', 'روابط سريعة')}</h4>
            <ul className="space-y-2 font-medium">
              <li>
                <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-white transition-colors">
                  {L('Home', 'الرئيسية')}
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('about-cloud')} className="hover:text-white transition-colors">
                  {L('About Us', 'عن المنصة')}
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('services')} className="hover:text-white transition-colors">
                  {L('Pricing', 'الأسعار والباقات')}
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('how-it-works')} className="hover:text-white transition-colors">
                  {L('How It Works', 'طريقة العمل')}
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('benefits')} className="hover:text-white transition-colors">
                  {L('Why Us', 'مزايا حصرية')}
                </button>
              </li>
            </ul>
          </div>

          {/* Get Certified in 7 Days */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="font-bold text-white uppercase tracking-wider">{L('Get Certified In 7 Days', 'احصل على شهادة في ٧ أيام')}</h4>
            <ul className="space-y-2 font-medium">
              <li>
                <button onClick={() => handleOrderClick('ISO 9001')} className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ArrowUpRight size={12} className="text-indigo-500" />
                  <span>ISO 9001 - Buy Now</span>
                </button>
              </li>
              <li>
                <button onClick={() => handleOrderClick('ISO 14001')} className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ArrowUpRight size={12} className="text-indigo-500" />
                  <span>ISO 14001 - Buy Now</span>
                </button>
              </li>
              <li>
                <button onClick={() => handleOrderClick('ISO 45001')} className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ArrowUpRight size={12} className="text-indigo-500" />
                  <span>ISO 45001 - Buy Now</span>
                </button>
              </li>
              <li>
                <button onClick={() => handleOrderClick('IMS Bundle')} className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ArrowUpRight size={12} className="text-indigo-500" />
                  <span>IMS - Buy Now</span>
                </button>
              </li>
            </ul>

            {/* Quick Whatsapp Link inside Footer */}
            <div className="pt-4">
              <a 
                href={`https://wa.me/${config.contact.whatsapp.replace(/\+/g, '')}`}
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#25d366]/10 hover:bg-[#25d366]/20 border border-[#25d366]/30 text-[#25d366] rounded-xl font-bold transition-all text-xs"
              >
                <MessageSquare size={14} className="fill-[#25d366]" />
                <span>{L('WhatsApp Chat Support', 'تواصل عبر الواتساب')}</span>
              </a>
            </div>
          </div>

        </div>

        {/* Newsletter & Sub footer */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 pt-8 border-t border-slate-800 flex flex-col lg:flex-row items-center justify-between gap-8 text-slate-500">
          <div className="space-y-2 text-center lg:text-start">
            <h4 className="font-bold text-white uppercase tracking-wider">{L('News Letter', 'النشرة البريدية')}</h4>
            {newsletterSubscribed ? (
              <p className="text-xs text-emerald-400 font-bold">{L('Subscribed successfully! Thank you.', 'تم الاشتراك بنجاح! شكراً لك.')}</p>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2 max-w-sm">
                <input
                  type="email"
                  required
                  placeholder={L('Enter your email address', 'أدخل بريدك الإلكتروني')}
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500 text-white placeholder-slate-600"
                />
                <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shrink-0">
                  {L('Send', 'اشترك')}
                </button>
              </form>
            )}
            <div className="pt-3">
              <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">{L('Powered by Stripe security payments', 'بوابة دفع آمنة ومدعومة بـ')}</p>
              <div className="flex items-center justify-center lg:justify-start gap-2.5 opacity-40 mt-1">
                <span className="font-mono text-[9px] border border-slate-700 px-1 py-0.5 rounded text-white tracking-widest">STRIPE</span>
                <span className="font-mono text-[9px] border border-slate-700 px-1 py-0.5 rounded text-white tracking-widest">VISA</span>
                <span className="font-mono text-[9px] border border-slate-700 px-1 py-0.5 rounded text-white tracking-widest">MASTERCARD</span>
                <span className="font-mono text-[9px] border border-slate-700 px-1 py-0.5 rounded text-white tracking-widest">AMEX</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-start">
            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
              {(Object.keys(LANGUAGE_NAMES) as Language[]).map((code, idx) => (
                <React.Fragment key={code}>
                  {idx > 0 && <span className="text-slate-700">|</span>}
                  <button onClick={() => onSetLang(code)} className={`hover:text-white ${lang === code ? 'text-indigo-400 font-black' : ''}`}>
                    {LANGUAGE_NAMES[code]}
                  </button>
                </React.Fragment>
              ))}
            </div>
            <div>
              © 2026 GAMC Global Solutions. All Rights Reserved.
            </div>
          </div>
        </div>

        {/* Corporate badges from the mock */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 pt-8 mt-8 border-t border-slate-800/60 flex flex-wrap items-center justify-center gap-8 opacity-25 grayscale hover:grayscale-0 hover:opacity-50 transition-all">
          <span className="font-black text-[10px] tracking-widest text-white uppercase">VISION 2030</span>
          <span className="font-black text-[10px] tracking-widest text-white uppercase">ARAB FEDERATION</span>
          <span className="font-black text-[10px] tracking-widest text-white uppercase">SCA REGISTERED</span>
          <span className="font-black text-[10px] tracking-widest text-white uppercase">BRITISH SAFETY COUNCIL</span>
          <span className="font-black text-[10px] tracking-widest text-white uppercase">UAE BUSINESS AWARDS</span>
          <span className="font-black text-[10px] tracking-widest text-white uppercase">ABU DHABI CHAMBER</span>
        </div>
      </footer>

      {/* Training Course Lead Capture Modal */}
      {leadModalOpen && (
        <div
          className="fixed inset-0 z-[60] bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setLeadModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 md:p-8 relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setLeadModalOpen(false)}
              className={`absolute top-4 ${isAr ? 'left-4' : 'right-4'} p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-xl transition-colors`}
            >
              <X size={18} />
            </button>

            {leadSubmitted ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 size={28} />
                </div>
                <h3 className="text-lg font-black text-slate-900">{L('Request sent successfully!', 'تم إرسال طلبك بنجاح!')}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {L(
                    'Thanks for your interest — our team will reach out shortly with course details and schedules.',
                    'شكراً لاهتمامك. سيتواصل معك فريقنا قريباً بتفاصيل الدورة ومواعيدها.'
                  )}
                </p>
                <button
                  onClick={() => setLeadModalOpen(false)}
                  className="px-6 py-2.5 bg-[#121c42] hover:bg-indigo-600 text-white rounded-full text-xs font-bold transition-all"
                >
                  {L('Close', 'إغلاق')}
                </button>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <h3 className="text-xl font-black text-slate-900">{L('Request Course Information', 'اطلب معلومات عن الدورة')}</h3>
                  <p className="text-sm text-slate-500 mt-1">
                    {L("Fill in your details and we'll send you the full details.", 'عبّئ بياناتك وسنرسل لك التفاصيل الكاملة.')}
                  </p>
                </div>

                <form onSubmit={handleLeadSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600">{L('Full Name', 'الاسم الكامل')}</label>
                    <input
                      required
                      type="text"
                      value={leadForm.fullName}
                      onChange={(e) => setLeadForm({ ...leadForm, fullName: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600">{L('Email', 'البريد الإلكتروني')}</label>
                    <input
                      required
                      type="email"
                      value={leadForm.email}
                      onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600">{L('Phone', 'رقم الهاتف')}</label>
                    <input
                      required
                      type="tel"
                      value={leadForm.phone}
                      onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600">{L('Company (optional)', 'اسم الشركة (اختياري)')}</label>
                    <input
                      type="text"
                      value={leadForm.company}
                      onChange={(e) => setLeadForm({ ...leadForm, company: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600">{L('Course', 'الدورة المطلوبة')}</label>
                    <select
                      value={leadForm.standardCode}
                      onChange={(e) => setLeadForm({ ...leadForm, standardCode: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    >
                      <option value="">{L('Not sure / all courses', 'غير محدد / كل الدورات')}</option>
                      {LEAD_AUDITOR_STANDARDS.map((std) => (
                        <option key={std.code} value={std.code}>{std.code} — {L(std.titleEn, std.titleAr)}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600">{L('Message (optional)', 'رسالة (اختياري)')}</label>
                    <textarea
                      rows={3}
                      value={leadForm.message}
                      onChange={(e) => setLeadForm({ ...leadForm, message: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>

                  {leadError && (
                    <div className="flex items-start gap-2 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
                      <AlertCircle size={14} className="shrink-0 mt-0.5" />
                      <span>{leadError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={leadSubmitting}
                    className="w-full py-3 bg-[#121c42] hover:bg-indigo-600 disabled:opacity-50 text-white rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2"
                  >
                    {leadSubmitting ? <Loader2 size={16} className="animate-spin" /> : null}
                    <span>{leadSubmitting ? L('Sending...', 'جارٍ الإرسال...') : L('Send Request', 'إرسال الطلب')}</span>
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      {/* Referral Program Signup Modal */}
      {referModalOpen && (
        <div
          className="fixed inset-0 z-[60] bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setReferModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 md:p-8 relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setReferModalOpen(false)}
              className={`absolute top-4 ${isAr ? 'left-4' : 'right-4'} p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-xl transition-colors`}
            >
              <X size={18} />
            </button>

            {referResult ? (
              <div className="text-center py-4 space-y-5">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 size={28} />
                </div>
                <h3 className="text-lg font-black text-slate-900">{L('Your link is ready!', 'رابطك جاهز!')}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {L(
                    "Share this link with your clients — you'll earn AED 500 for every one who completes payment through it. We've also emailed you a copy.",
                    'شارك هذا الرابط مع عملائك — وستربح AED 500 عن كل عميل يكمل الدفع عبره. أرسلنا نسخة أيضاً إلى بريدك الإلكتروني.'
                  )}
                </p>
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-3">
                  <span className="flex-1 text-xs font-mono text-slate-700 truncate text-start">{referResult.link}</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(referResult.link);
                      setReferLinkCopied(true);
                      setTimeout(() => setReferLinkCopied(false), 2000);
                    }}
                    className="shrink-0 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all"
                  >
                    {referLinkCopied ? L('Copied', 'تم النسخ') : L('Copy', 'نسخ')}
                  </button>
                </div>
                <button
                  onClick={() => setReferModalOpen(false)}
                  className="px-6 py-2.5 bg-[#121c42] hover:bg-indigo-600 text-white rounded-full text-xs font-bold transition-all"
                >
                  {L('Close', 'إغلاق')}
                </button>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <h3 className="text-xl font-black text-slate-900">{L('Join the Referral Program', 'انضم لبرنامج الإحالة')}</h3>
                  <p className="text-sm text-slate-500 mt-1">
                    {L('Fill in your details and get your own link instantly.', 'عبّئ بياناتك وستحصل على رابطك الخاص فوراً.')}
                  </p>
                </div>

                <form onSubmit={handleReferSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600">{L('Full Name', 'الاسم الكامل')}</label>
                    <input
                      required
                      type="text"
                      value={referForm.name}
                      onChange={(e) => setReferForm({ ...referForm, name: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600">{L('Email', 'البريد الإلكتروني')}</label>
                    <input
                      required
                      type="email"
                      value={referForm.email}
                      onChange={(e) => setReferForm({ ...referForm, email: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600">{L('Phone (optional)', 'رقم الهاتف (اختياري)')}</label>
                    <input
                      type="tel"
                      value={referForm.phone}
                      onChange={(e) => setReferForm({ ...referForm, phone: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>

                  {referError && (
                    <div className="flex items-start gap-2 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
                      <AlertCircle size={14} className="shrink-0 mt-0.5" />
                      <span>{referError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={referSubmitting}
                    className="w-full py-3 bg-[#121c42] hover:bg-indigo-600 disabled:opacity-50 text-white rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2"
                  >
                    {referSubmitting ? <Loader2 size={16} className="animate-spin" /> : null}
                    <span>{referSubmitting ? L('Creating...', 'جارٍ الإنشاء...') : L('Get My Link', 'احصل على رابطي')}</span>
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      {/* Persistent floating WhatsApp button */}
      <a
        href={`https://wa.me/${config.contact.whatsapp.replace(/\+/g, '')}`}
        target="_blank"
        rel="noreferrer"
        className={`fixed bottom-6 ${isAr ? 'left-6' : 'right-6'} z-50 w-14 h-14 bg-[#25d366] rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform`}
        aria-label={L('Chat with us on WhatsApp', 'تواصل معنا عبر واتساب')}
      >
        <MessageSquare size={26} className="text-white fill-white" />
      </a>

    </div>
  );
};

export default PublicLanding;
