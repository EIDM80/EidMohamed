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
import { Language } from '../translations';
import { submitTrainingLead, TrainingLeadInput } from '../lib/db';
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
              {isAr ? 'مزود معتمد لـ ISO' : 'Authorized ISO Provider'}
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
                {isAr ? 'المنصة العالمية لشهادات الأيزو' : 'Global ISO certification platform'}
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-indigo-600 rounded-lg hover:bg-slate-50 transition-all uppercase tracking-tight"
            >
              {isAr ? 'الرئيسية' : 'Home'}
            </button>
            <button
              onClick={() => scrollToSection('about-cloud')}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-indigo-600 rounded-lg hover:bg-slate-50 transition-all uppercase tracking-tight"
            >
              {isAr ? 'عن المنصة' : 'About'}
            </button>
            <button
              onClick={() => scrollToSection('benefits')}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-indigo-600 rounded-lg hover:bg-slate-50 transition-all uppercase tracking-tight"
            >
              {isAr ? 'المزايا' : 'Why Us?'}
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-indigo-600 rounded-lg hover:bg-slate-50 transition-all uppercase tracking-tight"
            >
              {isAr ? 'طريقة العمل' : 'How It Works'}
            </button>
            <button
              onClick={() => scrollToSection('services')}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-indigo-600 rounded-lg hover:bg-slate-50 transition-all uppercase tracking-tight"
            >
              {isAr ? 'الشهادات والأسعار' : 'Certificates'}
            </button>
            <button
              onClick={() => scrollToSection('faq')}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-indigo-600 rounded-lg hover:bg-slate-50 transition-all uppercase tracking-tight"
            >
              {isAr ? 'الأسئلة الشائعة' : 'FAQs'}
            </button>
            <button
              onClick={() => scrollToSection('contact-section')}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-indigo-600 rounded-lg hover:bg-slate-50 transition-all uppercase tracking-tight"
            >
              {isAr ? 'اتصل بنا' : 'Contact'}
            </button>
          </nav>

          {/* Action Items */}
          <div className="hidden lg:flex items-center gap-4">
            <button 
              onClick={() => onSetLang(lang === 'en' ? 'ar' : 'en')}
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 rounded-xl text-xs font-bold transition-all border border-slate-200/50"
            >
              <Languages size={15} />
              <span>{lang === 'en' ? 'العربية' : 'English'}</span>
            </button>

            <button
              onClick={() => onNavigateToPortal()}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full text-xs font-bold transition-all shadow-md shadow-indigo-100 hover:shadow-indigo-200 active:scale-95"
            >
              {isAuthenticated ? (
                <>
                  <span>{isAr ? 'بوابة العميل' : 'Go to Client Area'}</span>
                  <ArrowRight size={15} className={isAr ? 'rotate-180' : ''} />
                </>
              ) : (
                <>
                  <LogIn size={15} />
                  <span>{isAr ? 'تسجيل الدخول' : 'Client Portal'}</span>
                </>
              )}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-3 lg:hidden">
            <button 
              onClick={() => onSetLang(lang === 'en' ? 'ar' : 'en')}
              className="p-2 bg-slate-100 text-slate-600 rounded-xl"
            >
              <Languages size={16} />
            </button>
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
              {isAr ? 'الرئيسية' : 'Home'}
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); scrollToSection('about-cloud'); }}
              className="w-full text-start font-bold text-slate-800 text-sm py-3 px-4 rounded-xl hover:bg-slate-50 block"
            >
              {isAr ? 'عن المنصة' : 'About'}
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); scrollToSection('benefits'); }}
              className="w-full text-start font-bold text-slate-800 text-sm py-3 px-4 rounded-xl hover:bg-slate-50 block"
            >
              {isAr ? 'المزايا' : 'Why Us?'}
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); scrollToSection('how-it-works'); }}
              className="w-full text-start font-bold text-slate-800 text-sm py-3 px-4 rounded-xl hover:bg-slate-50 block"
            >
              {isAr ? 'طريقة العمل' : 'How It Works'}
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); scrollToSection('services'); }}
              className="w-full text-start font-bold text-slate-800 text-sm py-3 px-4 rounded-xl hover:bg-slate-50 block"
            >
              {isAr ? 'الشهادات والأسعار' : 'Certificates & Pricing'}
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); scrollToSection('faq'); }}
              className="w-full text-start font-bold text-slate-800 text-sm py-3 px-4 rounded-xl hover:bg-slate-50 block"
            >
              {isAr ? 'الأسئلة الشائعة' : 'FAQs'}
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); scrollToSection('contact-section'); }}
              className="w-full text-start font-bold text-slate-800 text-sm py-3 px-4 rounded-xl hover:bg-slate-50 block"
            >
              {isAr ? 'اتصل بنا' : 'Contact'}
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
              <span>{isAr ? 'دخول بوابة العميل' : 'Sign in to Portal'}</span>
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
                <span>{isAr ? 'حلول ISO رقمية سريعة بنسبة ١٠٠٪' : '100% digital & fast-track approved solutions'}</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
                {isAr ? 'شهادات الـ ISO أصبحت في غاية السهولة' : 'ISO Certification Made Simple'}
              </h1>
              
              <p className="text-lg md:text-xl text-slate-300 leading-relaxed font-medium">
                {isAr 
                  ? 'الطريقة الأسرع والأكثر ملاءمة للحصول على شهادة ISO معتمدة دولياً لشركتك.' 
                  : 'The fastest and most affordable way to become internationally ISO Certified.'}
              </p>
              
              <p className="text-sm md:text-base text-slate-400 leading-relaxed">
                {isAr 
                  ? 'GAMC هي المنصة الرقمية الوحيدة المخصصة لتقديم خدمات الـ ISO مع دعم مخصص ومحلي متميز، لمساعدتك في إعداد الوثائق والحصول على اعتمادات دولية مرموقة ومعترف بها عالمياً.' 
                  : 'GAMC is the premier digital ISO platform dedicated to supporting your certification, offering localized workflow, automated document preparation, and swift access to globally recognized accreditation.'}
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-4">
                <button
                  onClick={() => scrollToSection('contact-section')}
                  className="px-8 py-4 bg-white hover:bg-slate-100 text-[#121c42] font-black rounded-full shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-sm uppercase tracking-wider"
                >
                  <span>{isAr ? 'اتصل بنا' : 'Contact Us'}</span>
                </button>
                <button
                  onClick={() => scrollToSection('services')}
                  className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-full transition-all flex items-center justify-center gap-2 text-sm border border-indigo-500"
                >
                  <span>{isAr ? 'استكشف الباقات والأسعار' : 'Explore Packages'}</span>
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
                  <span>{isAr ? 'تحدث مع مستشار ISO الآن' : 'Chat With An ISO Advisor'}</span>
                </div>
              </div>

              <div className="relative bg-[#1a234a]/90 backdrop-blur-md border border-slate-700/60 p-8 rounded-[2rem] shadow-2xl text-slate-100 space-y-6">
                <div className="flex justify-between items-start">
                  <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center p-1.5">
                    <Logo size={28} color="white" />
                  </div>
                  <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest rounded border border-emerald-500/30">
                    {isAr ? 'معتمد دولياً' : 'ACCREDITED'}
                  </span>
                </div>

                <div>
                  <p className="text-[10px] text-indigo-300 uppercase font-black tracking-wider">{isAr ? 'تفاصيل السجل الرقمي' : 'Digital Registry details'}</p>
                  <p className="text-xl font-black tracking-tight mt-1">ISO 9001:2015</p>
                  <p className="text-xs text-slate-300 mt-1">{isAr ? 'بوابة الاعتماد الرقمية الذكية للمنشآت' : 'Smart Digital Certification for Enterprises'}</p>
                </div>

                <div className="border-t border-slate-700/60 pt-4 flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>GLORIA-SECURE</span>
                  <span>STATUS: ACTIVE</span>
                </div>

                <div className="p-4 bg-[#12193b] rounded-2xl space-y-2 text-xs border border-slate-800">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">{isAr ? 'سرعة المعالجة' : 'Processing speed'}</span>
                    <span className="font-bold text-emerald-400">{isAr ? 'فوري (٣-٧ أيام)' : 'Express (3-7 Days)'}</span>
                  </div>
                  <div className="flex justify-between items-center border-t border-slate-800 pt-2 mt-2">
                    <span className="font-bold text-slate-300">{isAr ? 'متوسط الرسوم الموفرة' : 'Avg. cost reduction'}</span>
                    <span className="font-bold text-white text-sm">Up to 60%</span>
                  </div>
                </div>

                <button 
                  onClick={() => onNavigateToPortal({ mode: 'signup' })}
                  className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full text-xs font-bold transition-all flex items-center justify-center gap-2"
                >
                  <span>{isAr ? 'ابدأ التقديم السريع الآن' : 'Start Fast-Track Process'}</span>
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
              {isAr ? 'جميع شهاداتنا أصلية ومعتمدة من IAF' : 'Every Certificate Is Genuine & IAF Accredited'}
            </h3>
            <p className="text-sm text-slate-400 font-medium mt-1 max-w-2xl">
              {isAr
                ? 'تصدر GAMC شهاداتها حصرياً عبر هيئات اعتماد أعضاء في المنتدى الدولي للاعتماد (IAF)، ويمكن التحقق من صحة كل شهادة فوراً عبر السجل العالمي الرسمي IAF CertSearch.'
                : 'GAMC issues certificates exclusively through accreditation bodies that are members of the International Accreditation Forum (IAF), and every certificate is instantly verifiable through the official IAF CertSearch global registry.'}
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
                  <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{isAr ? 'المدققين' : 'Auditor Network'}</p>
                  <p className="text-xs font-bold text-slate-800">{isAr ? 'مستشارون معتمدون' : 'IRCA Approved'}</p>
                </div>
              </div>

              <div className="absolute -top-6 -left-6 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3 max-w-[240px] hidden sm:flex">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <FileCheck size={22} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{isAr ? 'المختبرات والامتثال' : 'Lab Compliance'}</p>
                  <p className="text-xs font-bold text-slate-800">{isAr ? 'جودة مطلقة ممتدة' : 'Highest Standards'}</p>
                </div>
              </div>
            </div>

            {/* Right Text Split */}
            <div className="lg:col-span-6 space-y-6">
              <h2 className="text-2xl md:text-3xl font-black text-[#121c42] leading-tight">
                {isAr 
                  ? 'نظام توثيق ISO سحابي متطور، يمكن استخدامه وإدارته عن بعد لتوفير التكاليف الباهظة.' 
                  : 'A cloud-based ISO Documentation system that can be used remotely, to eliminate high cost of ISO Certification.'}
              </h2>
              
              <div className="w-16 h-1 bg-indigo-600 rounded-full"></div>

              <p className="text-slate-600 leading-relaxed font-medium">
                {isAr
                  ? 'تتسارع بوابتنا الرقمية الفريدة من وتيرة الحصول على شهادات ISO بشكل مذهل، مما يجعلنا الخيار الأكثر كفاءة وموثوقية في تقديم الاعتمادات المعترف بها دولياً في الشرق الأوسط ومختلف دول العالم. نضمن الوضوح التام والشفافية مع الامتثال المكتمل لمتطلبات التدقيق.'
                  : 'Our unique cloud solution accelerates the certification process, making us the quickest and most affordable provider of accredited ISO certificates. GAMC ensures absolute clarity, regulatory relevance, and seamless digital execution.'}
              </p>

              <div className="pt-4 flex">
                <button
                  onClick={() => scrollToSection('services')}
                  className="px-6 py-3 bg-[#121c42] hover:bg-slate-800 text-white font-bold rounded-full transition-all text-xs uppercase tracking-wider"
                >
                  {isAr ? 'عرض باقات الأسعار' : 'See Pricing'}
                </button>
              </div>
            </div>

          </div>

          {/* Stats strip below */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 text-center border-t border-slate-100 pt-12">
            <div className="space-y-1 bg-[#f8fafc] p-6 rounded-2xl border border-slate-100 hover:shadow-md transition-shadow">
              <h4 className="text-3xl md:text-4xl font-black text-indigo-600">1,800+</h4>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {isAr ? 'عضو راضٍ ومستفيد' : 'Satisfied Members'}
              </p>
            </div>
            <div className="space-y-1 bg-[#f8fafc] p-6 rounded-2xl border border-slate-100 hover:shadow-md transition-shadow">
              <h4 className="text-3xl md:text-4xl font-black text-indigo-600">1,400+</h4>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {isAr ? 'شهادة تدريب صادرة' : 'Training Certificates Issued'}
              </p>
            </div>
            <div className="space-y-1 bg-[#f8fafc] p-6 rounded-2xl border border-slate-100 hover:shadow-md transition-shadow">
              <h4 className="text-3xl md:text-4xl font-black text-indigo-600">22+</h4>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {isAr ? 'دولة مدعومة ومغذاة' : 'Countries Supported'}
              </p>
            </div>
            <div className="space-y-1 bg-[#f8fafc] p-6 rounded-2xl border border-slate-100 hover:shadow-md transition-shadow">
              <h4 className="text-3xl md:text-4xl font-black text-indigo-600">10+</h4>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {isAr ? 'عاماً من الخبرة والتميز' : 'Years of Experience'}
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
              {isAr ? 'مزايا حصرية فائقة للأعضاء والمنشآت' : 'Exclusive Member Benefits'}
            </h2>
            <div className="w-16 h-1 bg-indigo-600 mx-auto rounded-full"></div>
            <p className="text-slate-500 font-medium">
              {isAr 
                ? 'توفر لك بوابتنا المتكاملة كل ما تحتاجه من موارد للالتزام بالمعايير العالمية والحفاظ على استمرارية ترخيصك.' 
                : 'Empowering your organization with the absolute best compliance assets and continuous assistance.'}
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
                    <span className="text-[10px] uppercase tracking-widest font-black text-indigo-400 bg-white/10 px-3 py-1 rounded-full">{isAr ? 'اعتماداتنا' : 'Credibility'}</span>
                    <h4 className="text-lg font-bold">{isAr ? 'معايير امتثال معترف بها عالمياً' : 'Global compliance verified'}</h4>
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
                  {isAr ? 'أدوات ونماذج قابلة للتنزيل' : 'Downloadable Tools'}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed font-medium">
                  {isAr 
                    ? 'توفر غلوريا ملصقات مخاطر قابلة للطباعة ونماذج جاهزة للتطبيق لتعزيز معايير السلامة المهنية وتوعية الموظفين.' 
                    : 'We provide printable hazard posters and ready-to-use compliance templates with optimal placement guides.'}
                </p>
              </div>

              {/* Benefit 2 */}
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100/60 hover:shadow-md hover:border-indigo-100 transition-all space-y-4">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                  <Award size={24} />
                </div>
                <h3 className="text-lg font-black text-slate-900">
                  {isAr ? 'صلاحية الشهادة ٣٦ شهراً كاملة' : '36 Months Validity'}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed font-medium">
                  {isAr 
                    ? 'تتميز شهادات غلوريا وعضوية البوابة بصلاحية تمتد لـ ٣٦ شهراً، مما يضمن وصلاً مستمراً للموارد والدعم الفني والتدقيق السنوي.' 
                    : 'Our issued ISO certificates and active portal memberships remain valid for a full 36 months of secure compliance.'}
                </p>
              </div>

              {/* Benefit 3 */}
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100/60 hover:shadow-md hover:border-indigo-100 transition-all space-y-4">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                  <GraduationCap size={24} />
                </div>
                <h3 className="text-lg font-black text-slate-900">
                  {isAr ? 'دورات تدريبية مدمجة' : 'Training Courses'}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed font-medium">
                  {isAr 
                    ? 'يستمتع أعضاؤنا بفرص دخول مجاني لدورات تدريب المدقق الداخلي، لتمكين كوادر منشأتك من متابعة الامتثال بشكل دوري.' 
                    : 'Members receive complimentary access to qualified internal auditor training courses to empower in-house teams.'}
                </p>
              </div>

              {/* Benefit 4 */}
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100/60 hover:shadow-md hover:border-indigo-100 transition-all space-y-4">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                  <Headphones size={24} />
                </div>
                <h3 className="text-lg font-black text-slate-900">
                  {isAr ? 'مكتب دعم متكامل على مدار الساعة' : 'Online Support Desk'}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed font-medium">
                  {isAr 
                    ? 'منصتكم الموثوقة للحصول على إرشادات الخبراء وحلول المعاملات السريعة عبر فريق تدقيق مستجيب وممتاز.' 
                    : 'Your dedicated hub for auditor-led guidance, fast answers, and continuous assistance throughout the year.'}
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
            {isAr ? 'شركات ومنشآت تثق بخدماتنا واعتماداتنا الرقمية' : 'Satisfied Members & Verified Partners'}
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
                    {isAr ? 'شعار العميل' : 'Client Logo'}
                  </div>
                ))}
          </div>
          <div className="mt-8">
            <button 
              onClick={() => scrollToSection('contact-section')}
              className="px-6 py-2.5 bg-[#121c42] hover:bg-indigo-600 text-white rounded-full text-xs font-bold transition-all"
            >
              {isAr ? 'اتصل بنا للحصول على الدعم' : 'Contact Us'}
            </button>
          </div>
        </div>
      </section>

      {/* Section 5: Reasons to Choose Us */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-black text-[#121c42] tracking-tight">
              {isAr ? 'لماذا تختار GAMC للحصول على شهادات الـ ISO؟' : 'Reasons To Choose GAMC For Your ISO Certificates'}
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
                <h3 className="text-lg font-black text-slate-900">{isAr ? 'واجهة مستخدم بسيطة للغاية' : 'Simple User Interface'}</h3>
                <p className="text-sm text-slate-500 leading-relaxed font-medium flex-1">
                  {isAr 
                    ? 'منصة سحابية متقدمة تضمن حصول منشأتك على الاعتماد في أقل وقت ممكن مع الحفاظ على صرامة متطلبات المراجعة.' 
                    : 'A cloud-based layout ensures that companies of all sizes can easily finish and request certificates online.'}
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
                <h3 className="text-lg font-black text-slate-900">{isAr ? 'الوصول المدار عن بعد' : 'Remote Access'}</h3>
                <p className="text-sm text-slate-500 leading-relaxed font-medium flex-1">
                  {isAr 
                    ? 'يمكن الوصول لخدمات غلوريا™ من أي مكان في العالم ومتابعة حالة ملفكم مباشرة دون الحاجة لعناء الزيارات الميدانية المعقدة.' 
                    : 'Our pipeline is accessible securely from any device, anytime. No complex manual files, no hard geographical borders.'}
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
                <h3 className="text-lg font-black text-slate-900">{isAr ? 'فعالية تامة في التكلفة' : 'Cost Effective'}</h3>
                <p className="text-sm text-slate-500 leading-relaxed font-medium flex-1">
                  {isAr 
                    ? 'برسوم ثابتة تدفع لمرة واحدة وبدون تكاليف استشارية خفية، نتيح حتى للشركات الناشئة والصغيرة فرصة الحصول على الترخيص.' 
                    : 'With a one-time fixed fee and zero hidden advisor cost, we make quality compliance budget-friendly for small and large teams.'}
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
              {isAr ? 'طريقة العمل والتنفيذ في ٣ خطوات' : 'How It Works'}
            </h2>
            <div className="w-16 h-1 bg-indigo-600 mx-auto rounded-full"></div>
            <p className="text-slate-500 font-medium">
              {isAr 
                ? 'تبسط GAMC الحصول على الشهادة بدعم كامل للغة العربية، لتوجيه الشركات عبر خطوات بسيطة وفعالة عبر الإنترنت.' 
                : 'GAMC streamlines international certification with localized Arabic support, guiding you through modern steps.'}
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
                  <span className="text-xs font-bold text-indigo-300 uppercase tracking-widest mb-1">{isAr ? 'من قلب دبي' : 'BASED IN DUBAI'}</span>
                  <h4 className="text-xl font-black">{isAr ? 'سرعة ومصداقية عالمية' : 'Rapid Global Processing'}</h4>
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
                  <h4 className="font-black text-slate-900 text-base">{isAr ? 'اختر المعيار المناسب' : 'Choose Your Standard'}</h4>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {isAr 
                      ? 'حدد معيار الـ ISO الذي ترغب بالحصول عليه لشركتك واملأ بيانات المنشأة الأساسية عبر نظامنا.' 
                      : 'Select your desired framework (ISO 9001, 14001, etc.) and complete your initial business profile details.'}
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:border-indigo-100 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-lg shrink-0">
                  2
                </div>
                <div className="space-y-1">
                  <h4 className="font-black text-slate-900 text-base">{isAr ? 'رفع مستندات الامتثال' : 'Upload Documentation'}</h4>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {isAr 
                      ? 'قم برفع ملفات ومخططات شركتك باتباع موجهاتنا الذكية ليتسنى لفريق التدقيق مراجعتها فورا.' 
                      : 'Upload required documents via our secure dashboard guided by intuitive auditor checklists for rapid review.'}
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:border-indigo-100 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-lg shrink-0">
                  3
                </div>
                <div className="space-y-1">
                  <h4 className="font-black text-slate-900 text-base">{isAr ? 'تحميل واستلام الشهادة' : 'Receive Certificate'}</h4>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {isAr 
                      ? 'بمجرد نجاح التدقيق الفوري، قم بتحميل نسختك المعتمدة مباشرة مع تفعيل رقم التسجيل الدولي الخاص بك.' 
                      : 'Upon successful virtual audit, download your certified PDF immediately and receive secure printed copies.'}
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
                <span>{isAr ? 'شفافية كاملة' : 'Full Transparency'}</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-white leading-tight">
                {isAr ? 'تحقق فوراً من صحة أي شهادة ISO' : 'Verify Any ISO Certificate Instantly'}
              </h2>
              <p className="text-slate-400 leading-relaxed">
                {isAr
                  ? 'كل شهادة نصدرها قابلة للتحقق فوراً عبر قاعدة بيانات IAF CertSearch العالمية — السجل الرسمي الموحّد لجميع شهادات الاعتماد المعترف بها دولياً. شاهد كيف يمكن لعملائك وشركائك التأكد من صحة شهادتك في ثوانٍ.'
                  : 'Every certificate we issue is instantly verifiable through IAF CertSearch, the official global registry for internationally accredited certifications. Watch how your clients and partners can confirm your certificate is genuine in seconds.'}
              </p>
              <div className="flex items-center gap-3 pt-2">
                <a
                  href="https://www.iafcertsearch.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-slate-100 text-[#0b1021] font-bold rounded-full transition-all text-sm"
                >
                  <span>{isAr ? 'زيارة IAF CertSearch' : 'Visit IAF CertSearch'}</span>
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
                  {isAr ? 'متصفحك لا يدعم عرض الفيديو.' : 'Your browser does not support the video tag.'}
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
              {isAr ? 'الشهادات المتاحة والأسعار الشفافة' : 'Pricing & Accredited Standards'}
            </h2>
            <div className="w-16 h-1 bg-indigo-600 mx-auto rounded-full"></div>
            <p className="text-slate-500 font-medium">
              {isAr 
                ? 'باقات مرنة وتنافسية تناسب مختلف المنشآت والشركات لتحقيق الامتثال التام دون أي استشارات مكلفة.' 
                : 'Clear pricing structure for maximum organization value, speed, and absolute transparency.'}
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
                  {isAr ? 'نظام إدارة الجودة (QMS)' : 'Quality Management System'}
                </h3>
                <div className="pt-2">
                  <span className="text-xs font-bold text-slate-400 block uppercase tracking-widest">{isAr ? 'رسوم ثابتة' : 'Fixed fee'}</span>
                  <span className="text-2xl font-black text-[#121c42]">AED 4,495</span>
                </div>
                
                <div className="border-t border-slate-200/50 pt-4 mt-4">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">{isAr ? 'مزايا الباقة:' : 'Features Included:'}</p>
                  <ul className="space-y-2 text-xs text-slate-600 font-medium">
                    <li className="flex items-start gap-1.5">
                      <Check size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                      <span>{isAr ? 'اعتماد دولي مرموق ومعترف به' : 'Globally Recognized & Verifiable'}</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Check size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                      <span>{isAr ? 'إعداد الوثائق ومراجعتها بالكامل' : 'Full Document Prep & Guided Audit'}</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Check size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                      <span>{isAr ? 'صلاحية الشهادة ٣ سنوات معتمدة' : '3-Year Certified Validity'}</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Check size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                      <span>{isAr ? 'وصول مجاني لمنصة التدريب' : 'Complimentary Auditor Training'}</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="pt-6">
                <button 
                  onClick={() => handleOrderClick('ISO 9001')}
                  className="w-full py-3 bg-[#121c42] hover:bg-indigo-600 text-white rounded-xl text-xs font-bold transition-all uppercase tracking-wider"
                >
                  {isAr ? 'شراء الآن' : 'Buy Now'}
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
                  {isAr ? 'نظام إدارة البيئة (EMS)' : 'Environmental Management'}
                </h3>
                <div className="pt-2">
                  <span className="text-xs font-bold text-slate-400 block uppercase tracking-widest">{isAr ? 'رسوم ثابتة' : 'Fixed fee'}</span>
                  <span className="text-2xl font-black text-[#121c42]">AED 4,495</span>
                </div>
                
                <div className="border-t border-slate-200/50 pt-4 mt-4">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">{isAr ? 'مزايا الباقة:' : 'Features Included:'}</p>
                  <ul className="space-y-2 text-xs text-slate-600 font-medium">
                    <li className="flex items-start gap-1.5">
                      <Check size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                      <span>{isAr ? 'اعتماد بيئي متوافق كليا' : 'Globally Recognized & Verifiable'}</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Check size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                      <span>{isAr ? 'توفير التكاليف ومراجعة الموارد' : 'Full Document Prep & Guided Audit'}</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Check size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                      <span>{isAr ? 'صلاحية الشهادة ٣ سنوات معتمدة' : '3-Year Certified Validity'}</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Check size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                      <span>{isAr ? 'مكتب دعم فني ذكي للمراجعة' : 'Complimentary Auditor Training'}</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="pt-6">
                <button 
                  onClick={() => handleOrderClick('ISO 14001')}
                  className="w-full py-3 bg-[#121c42] hover:bg-indigo-600 text-white rounded-xl text-xs font-bold transition-all uppercase tracking-wider"
                >
                  {isAr ? 'شراء الآن' : 'Buy Now'}
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
                  {isAr ? 'السلامة والصحة المهنية (OHSMS)' : 'Occupational Health & Safety'}
                </h3>
                <div className="pt-2">
                  <span className="text-xs font-bold text-slate-400 block uppercase tracking-widest">{isAr ? 'رسوم ثابتة' : 'Fixed fee'}</span>
                  <span className="text-2xl font-black text-[#121c42]">AED 4,495</span>
                </div>
                
                <div className="border-t border-slate-200/50 pt-4 mt-4">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">{isAr ? 'مزايا الباقة:' : 'Features Included:'}</p>
                  <ul className="space-y-2 text-xs text-slate-600 font-medium">
                    <li className="flex items-start gap-1.5">
                      <Check size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                      <span>{isAr ? 'اعتماد للحد من مخاطر العمل' : 'Globally Recognized & Verifiable'}</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Check size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                      <span>{isAr ? 'تقليل الفاقد وتأمين المنشأة' : 'Full Document Prep & Guided Audit'}</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Check size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                      <span>{isAr ? 'صلاحية الشهادة ٣ سنوات معتمدة' : '3-Year Certified Validity'}</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Check size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                      <span>{isAr ? 'الوصول لدورات مدقق داخلي ممتازة' : 'Complimentary Auditor Training'}</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="pt-6">
                <button 
                  onClick={() => handleOrderClick('ISO 45001')}
                  className="w-full py-3 bg-[#121c42] hover:bg-indigo-600 text-white rounded-xl text-xs font-bold transition-all uppercase tracking-wider"
                >
                  {isAr ? 'شراء الآن' : 'Buy Now'}
                </button>
              </div>
            </div>

            {/* Card 4: Integrated Management System (IMS) */}
            <div className="bg-[#121c42] text-white border-2 border-indigo-500 rounded-3xl p-6 flex flex-col justify-between hover:shadow-2xl transition-all relative overflow-hidden group">
              <div className="absolute top-0 right-0 bg-[#f7b500] text-[#121c42] text-[8px] font-black px-3 py-1 uppercase rounded-bl-xl tracking-widest">
                {isAr ? 'باقة التميز المتكاملة' : 'BEST VALUE PACKAGE'}
              </div>
              <div className="space-y-4">
                <span className="px-2.5 py-1 bg-indigo-500/30 text-indigo-300 text-[10px] font-black rounded uppercase tracking-wider block w-fit mb-2 border border-indigo-500/20">
                  IMS SPECIAL BUNDLE
                </span>
                <h3 className="text-base font-black text-white">
                  {isAr ? 'نظام الإدارة المتكامل (IMS)' : 'Integrated Management System'}
                </h3>
                <p className="text-[10px] text-slate-400 font-medium">{isAr ? 'حزمة تجمع معايير ISO 9001 + 14001 + 45001' : 'ISO 9001, 14001, and 45001 combined.'}</p>
                
                <div className="pt-2">
                  <span className="text-xs font-bold text-slate-400 block uppercase tracking-widest">{isAr ? 'رسوم ثابتة شاملة' : 'All-inclusive fee'}</span>
                  <span className="text-2xl font-black text-[#f7b500]">AED 10,995</span>
                </div>
                
                <div className="border-t border-slate-700/60 pt-4 mt-4">
                  <p className="text-xs font-bold text-indigo-300 uppercase tracking-widest mb-3">{isAr ? 'مزايا الباقة الشاملة:' : 'IMS Premium Features:'}</p>
                  <ul className="space-y-2 text-xs text-slate-300 font-medium">
                    <li className="flex items-start gap-1.5">
                      <Check size={14} className="text-[#f7b500] shrink-0 mt-0.5" />
                      <span>{isAr ? '٣ شهادات ISO كاملة معتمدة ومتكاملة' : '3 Fully Verified ISO Certificates'}</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Check size={14} className="text-[#f7b500] shrink-0 mt-0.5" />
                      <span>{isAr ? 'توفير مذهل لأكثر من AED 2,000' : 'Save Over AED 2,000 Instantly'}</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Check size={14} className="text-[#f7b500] shrink-0 mt-0.5" />
                      <span>{isAr ? 'إجراء تدقيق متكامل وموحد لتوفير التعب' : 'Unified Auditor Compliance Stream'}</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Check size={14} className="text-[#f7b500] shrink-0 mt-0.5" />
                      <span>{isAr ? 'مستشار حصر لمتابعة الملف سنوياً' : 'Priority Support & Dedicated Auditor'}</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="pt-6">
                <button 
                  onClick={() => handleOrderClick('IMS Bundle')}
                  className="w-full py-3.5 bg-[#f7b500] hover:bg-[#e6a800] text-slate-900 rounded-xl text-xs font-black transition-all uppercase tracking-widest"
                >
                  {isAr ? 'شراء الآن الباقة المتكاملة' : 'Buy IMS Bundle'}
                </button>
              </div>
            </div>

          </div>

          {/* Alert box below pricing */}
          <div className="mt-14 bg-[#f8fafc] border border-slate-200/50 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-sm text-slate-600 font-medium max-w-3xl leading-relaxed text-center md:text-start">
              {isAr 
                ? 'حقق الامتثال اللوائح والتشريعات، وحسّن الكفاءة التشغيلية، وابنِ جسور الثقة مع الشركاء المحليين والدوليين في الأسواق التنافسية اليوم.' 
                : 'Meet regulatory compliance, improve operational efficiency, and build trust with local and international partners in competitive markets today.'}
            </p>
            <button 
              onClick={() => scrollToSection('contact-section')}
              className="px-6 py-3 bg-[#121c42] hover:bg-slate-800 text-white rounded-full text-xs font-bold transition-all shrink-0 uppercase tracking-wider"
            >
              {isAr ? 'اتصل بنا الآن' : 'Contact Us'}
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
              <span>{isAr ? '100% أونلاين' : '100% Online'}</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-[#121c42] tracking-tight">
              {isAr ? 'دورات تدريب المدقق الرئيسي (Lead Auditor)' : 'Lead Auditor Training Standards'}
            </h2>
            <div className="w-16 h-1 bg-indigo-600 mx-auto rounded-full"></div>
            <p className="text-slate-500 font-medium">
              {isAr
                ? 'جميع دورات تدريب المدقق الرئيسي تُقدَّم بالكامل أونلاين، مما يتيح لفريقك التأهل دون الحاجة للسفر أو التواجد الحضوري.'
                : 'All Lead Auditor training courses are delivered fully online, so your team can qualify without travel or in-person attendance.'}
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
                  <span className="text-xs text-slate-500 font-medium block mt-0.5">{isAr ? std.titleAr : std.titleEn}</span>
                </div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{isAr ? 'مدقق رئيسي' : 'Lead Auditor'}</span>
                <button
                  onClick={() => openLeadModal(std.code)}
                  className="mt-2 w-full py-2.5 bg-slate-50 hover:bg-indigo-600 text-slate-700 hover:text-white border border-slate-200 hover:border-indigo-600 rounded-xl text-xs font-bold transition-all"
                >
                  {isAr ? 'اطلب معلومات' : 'Request Info'}
                </button>
              </div>
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <button
              onClick={() => openLeadModal('')}
              className="px-6 py-3 bg-[#121c42] hover:bg-indigo-600 text-white rounded-full text-xs font-bold transition-all uppercase tracking-wider"
            >
              {isAr ? 'استفسر عن مواعيد الدورات' : 'Ask About Course Schedules'}
            </button>
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
            {isAr ? 'نمو الأعمال التجارية مع شهادات ISO المعتمدة والتدريب' : 'Business Growth with Accessible ISO Certification and Training'}
          </h2>
          <p className="text-indigo-100 max-w-2xl mx-auto font-medium leading-relaxed text-sm md:text-base">
            {isAr 
              ? 'حقق الامتثال اللوائح والتشريعات وحسن الكفاءة التشغيلية لشركتك لبناء ثقة راسخة مع الشركاء المحليين والدوليين في الأسواق التنافسية.'
              : 'Meet regulatory compliance, improve operational efficiency, and build trust with local and international partners in competitive markets globally.'}
          </p>
          <div className="pt-4 flex justify-center">
            <button
              onClick={() => onNavigateToPortal({ mode: 'signup' })}
              className="px-8 py-4 bg-[#f7b500] hover:bg-[#e6a800] text-[#121c42] font-black rounded-full shadow-lg transition-all active:scale-[0.98] uppercase text-xs tracking-widest"
            >
              {isAr ? 'اطلب الآن شهادتك' : 'Order Now'}
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
                <h2 className="text-3xl md:text-4xl font-black text-slate-800 mb-8 text-center">{isAr ? 'اتصل بنا' : 'Contact us'}</h2>
                
                {formSubmitted ? (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-4 my-8">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                      <CheckCircle2 size={24} />
                    </div>
                    <h3 className="font-bold text-slate-900">{isAr ? 'تم الإرسال بنجاح!' : 'Message Sent Successfully!'}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {isAr 
                        ? 'شكراً لك! تم إرسال رسالتك بنجاح. سيتواصل معك أحد مستشارينا المعتمدين خلال الساعات القليلة القادمة.' 
                        : 'Thank you! Your message has been sent successfully. One of our qualified ISO auditors will contact you shortly.'}
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs md:text-sm font-bold text-slate-800 mb-2">{isAr ? 'اسم جهة الاتصال:' : 'Contact Name:'}</label>
                        <input 
                          type="text" 
                          required
                          value={contactForm.name}
                          onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                          className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-xs md:text-sm font-medium text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-inner"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs md:text-sm font-bold text-slate-800 mb-2">{isAr ? 'اسم الشركة / المنشأة:' : 'Business Name:'}</label>
                        <input 
                          type="text" 
                          required
                          value={contactForm.businessName}
                          onChange={(e) => setContactForm({ ...contactForm, businessName: e.target.value })}
                          className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-xs md:text-sm font-medium text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-inner"
                        />
                      </div>

                      <div>
                        <label className="block text-xs md:text-sm font-bold text-slate-800 mb-2">{isAr ? 'رقم الهاتف:' : 'Telephone Number:'}</label>
                        <input 
                          type="tel" 
                          required
                          value={contactForm.phone}
                          onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                          placeholder={isAr ? '(تشمل رمز المنطقة)' : '(Include area code)'}
                          className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-xs md:text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-inner"
                        />
                      </div>

                      <div>
                        <label className="block text-xs md:text-sm font-bold text-slate-800 mb-2">{isAr ? 'البريد الإلكتروني:' : 'Email'}</label>
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
                        {isAr 
                          ? 'هذا الاستفسار مخصص لشهادات ISO للشركات والمؤسسات فقط (وليس لدورات تدريب الأفراد).' 
                          : 'This enquiry is for company ISO certification only (Not Individual ISO Training Courses)'}
                      </label>
                    </div>

                    <div className="pt-4 flex justify-center">
                      <button 
                        type="submit"
                        className="px-12 py-3 bg-[#1e40af] hover:bg-blue-800 text-white rounded-xl text-sm font-bold transition-all shadow-md hover:scale-[1.02] active:scale-[0.98] min-w-[140px]"
                      >
                        {isAr ? 'إرسال' : 'Send'}
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
                    {isAr ? 'المنصة العالمية لشهادات الأيزو' : 'Global ISO certification platform'}
                  </p>
                </div>
                
                <p className="text-sm md:text-base text-slate-800 leading-relaxed font-medium">
                  {isAr 
                    ? 'بصفتنا منصة رقمية بالكامل لمنح شهادات ISO مع إمكانات تدريب متكاملة ودعم مخصص للمساعدة، تتعاون GAMC مع شبكة مختارة من مستشاري ISO حول العالم الذين يستفيدون من منصتنا الإلكترونية لتقديم خدمات إصدار الشهادات لعملائهم بكفاءة وعلى نطاق واسع.'
                    : 'As a fully digital ISO certification platform with integrated training capabilities and dedicated help desk support, GAMC collaborates with a select network of ISO consultants around the world who leverage our online platform to deliver certification services to their clients efficiently and at scale.'}
                </p>

                <p className="text-sm md:text-base text-slate-800 leading-relaxed font-medium">
                  {isAr 
                    ? 'يستفيد شركاؤنا الاستشاريون من بنية تحتية رقمية جاهزة، ومسارات اعتماد معتمدة، ودعم متعدد اللغات، بما في ذلك منصة التدريب الوحيدة الكاملة باللغة العربية لشهادات ISO من نوعها في العالم.'
                    : 'Our consultant partners benefit from a ready-made digital infrastructure, accredited certification pathways, and multilingual support, including the only full Arabic-language ISO training platform of its kind globally.'}
                </p>

                <p className="text-sm md:text-base text-slate-800 leading-relaxed font-medium">
                  {isAr 
                    ? 'إذا كنت مستشار ISO معتمداً وتتطلع إلى توسيع نطاق خدماتك، أو التوسع في أسواق جديدة، أو تبسيط تسليم خدماتك من خلال شريك رقمي موثوق، يسعدنا استكشاف كيف يمكن أن يعمل هذا التعاون.'
                    : 'If you are an established ISO consultant looking to broaden your service offering, expand into new markets, or streamline your delivery through a trusted digital partner, we would be pleased to explore how a collaboration could work.'}
                </p>

                <p className="text-sm md:text-base text-slate-800 leading-relaxed font-medium">
                  {isAr 
                    ? 'أرسل لنا بريداً إلكترونياً على iso@gloria-c.com يحتوي على معلومات حول استشاراتك، والمعايير التي تعمل بها، والأسواق التي تغطيها، وسيتصل بك أحد أعضاء فريقنا لترتيب مكالمة.'
                    : 'Drop us an email at iso@gloria-c.com with information about your consultancy, the standards you work with, and the markets you cover, and one of our team will get back to you to arrange a call.'}
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
              {isAr ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'}
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
                    <span className="font-bold text-slate-900 text-sm">{isAr ? item.qAr : item.qEn}</span>
                    <ChevronRight
                      size={18}
                      className={`shrink-0 text-indigo-600 transition-transform ${isOpen ? 'rotate-90' : isAr ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-sm text-slate-500 leading-relaxed font-medium">
                      {isAr ? item.aAr : item.aEn}
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
              {isAr ? 'مكاتب GAMC العالمية للتنسيق والاعتماد' : 'GAMC Worldwide Offices'}
            </h2>
            <div className="w-16 h-1 bg-indigo-600 mx-auto rounded-full"></div>
          </div>

          <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Office 1: UAE */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🇦🇪</span>
                <h3 className="font-black text-slate-900">{isAr ? 'الإمارات العربية المتحدة' : 'United Arab Emirates'}</h3>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                {isAr ? 'القرهود، دبي، الإمارات العربية المتحدة.' : 'Al Garhoud, Dubai, United Arab Emirates.'}
              </p>
              <div className="pt-2 text-[11px] text-slate-400 font-semibold space-y-1">
                <p>Phone / WhatsApp: +971 56 270 3015</p>
              </div>
            </div>

            {/* Office 2: UK */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🇬🇧</span>
                <h3 className="font-black text-slate-900">{isAr ? 'المملكة المتحدة' : 'United Kingdom'}</h3>
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
              {isAr
                ? 'منذ عام ٢٠١٥، تعمل GAMC على إعادة تعريف مفهوم شهادات الـ ISO. تساعد منصتنا الرقمية بالكامل بنسبة ١٠٠٪ الشركات الصغيرة والمتوسطة في الحصول على الاعتماد بسرعة وثقة.'
                : 'Since 2015, GAMC has been redefining ISO certification. Our 100% online platform helps small and medium-sized businesses get certified quickly and confidently.'}
            </p>
            <p className="text-slate-500 font-medium leading-relaxed max-w-sm">
              {isAr 
                ? 'نحن نبسط كل خطوة ونوفر توجيهاً مستمراً عبر الإنترنت، وتسعيراً شفافاً، ودعماً موثوقاً لجعل الحصول على الشهادة سهلاً وبأسعار معقولة.'
                : 'We simplify every step providing continuous online guidance, clear pricing, and trusted support to make certification effortless and affordable.'}
            </p>
            <div className="pt-2 text-slate-500 font-medium flex items-center gap-1.5 uppercase text-[10px] tracking-wider">
              <Globe size={14} className="text-indigo-500" />
              <span>Official License Holder</span>
            </div>
          </div>

          {/* Quick Menu */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="font-bold text-white uppercase tracking-wider">{isAr ? 'روابط سريعة' : 'Quick Links'}</h4>
            <ul className="space-y-2 font-medium">
              <li>
                <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-white transition-colors">
                  {isAr ? 'الرئيسية' : 'Home'}
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('about-cloud')} className="hover:text-white transition-colors">
                  {isAr ? 'عن المنصة' : 'About Us'}
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('services')} className="hover:text-white transition-colors">
                  {isAr ? 'الأسعار والباقات' : 'Pricing'}
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('how-it-works')} className="hover:text-white transition-colors">
                  {isAr ? 'طريقة العمل' : 'How It Works'}
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('benefits')} className="hover:text-white transition-colors">
                  {isAr ? 'مزايا حصرية' : 'Why Us'}
                </button>
              </li>
            </ul>
          </div>

          {/* Get Certified in 7 Days */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="font-bold text-white uppercase tracking-wider">{isAr ? 'احصل على شهادة في ٧ أيام' : 'Get Certified In 7 Days'}</h4>
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
                <span>{isAr ? 'تواصل عبر الواتساب' : 'WhatsApp Chat Support'}</span>
              </a>
            </div>
          </div>

        </div>

        {/* Newsletter & Sub footer */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 pt-8 border-t border-slate-800 flex flex-col lg:flex-row items-center justify-between gap-8 text-slate-500">
          <div className="space-y-2 text-center lg:text-start">
            <h4 className="font-bold text-white uppercase tracking-wider">{isAr ? 'النشرة البريدية' : 'News Letter'}</h4>
            {newsletterSubscribed ? (
              <p className="text-xs text-emerald-400 font-bold">{isAr ? 'تم الاشتراك بنجاح! شكراً لك.' : 'Subscribed successfully! Thank you.'}</p>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2 max-w-sm">
                <input 
                  type="email" 
                  required
                  placeholder={isAr ? 'أدخل بريدك الإلكتروني' : 'Enter your email address'}
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500 text-white placeholder-slate-600"
                />
                <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shrink-0">
                  {isAr ? 'اشترك' : 'Send'}
                </button>
              </form>
            )}
            <div className="pt-3">
              <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">{isAr ? 'بوابة دفع آمنة ومدعومة بـ' : 'Powered by Stripe security payments'}</p>
              <div className="flex items-center justify-center lg:justify-start gap-2.5 opacity-40 mt-1">
                <span className="font-mono text-[9px] border border-slate-700 px-1 py-0.5 rounded text-white tracking-widest">STRIPE</span>
                <span className="font-mono text-[9px] border border-slate-700 px-1 py-0.5 rounded text-white tracking-widest">VISA</span>
                <span className="font-mono text-[9px] border border-slate-700 px-1 py-0.5 rounded text-white tracking-widest">MASTERCARD</span>
                <span className="font-mono text-[9px] border border-slate-700 px-1 py-0.5 rounded text-white tracking-widest">AMEX</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-start">
            <div className="flex gap-4">
              <button onClick={() => onSetLang('en')} className={`hover:text-white ${lang === 'en' ? 'text-indigo-400 font-black' : ''}`}>English</button>
              <span>|</span>
              <button onClick={() => onSetLang('ar')} className={`hover:text-white ${lang === 'ar' ? 'text-indigo-400 font-black' : ''}`}>العربية</button>
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
                <h3 className="text-lg font-black text-slate-900">{isAr ? 'تم إرسال طلبك بنجاح!' : 'Request sent successfully!'}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {isAr
                    ? 'شكراً لاهتمامك. سيتواصل معك فريقنا قريباً بتفاصيل الدورة ومواعيدها.'
                    : 'Thanks for your interest — our team will reach out shortly with course details and schedules.'}
                </p>
                <button
                  onClick={() => setLeadModalOpen(false)}
                  className="px-6 py-2.5 bg-[#121c42] hover:bg-indigo-600 text-white rounded-full text-xs font-bold transition-all"
                >
                  {isAr ? 'إغلاق' : 'Close'}
                </button>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <h3 className="text-xl font-black text-slate-900">{isAr ? 'اطلب معلومات عن الدورة' : 'Request Course Information'}</h3>
                  <p className="text-sm text-slate-500 mt-1">
                    {isAr ? 'عبّئ بياناتك وسنرسل لك التفاصيل الكاملة.' : "Fill in your details and we'll send you the full details."}
                  </p>
                </div>

                <form onSubmit={handleLeadSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600">{isAr ? 'الاسم الكامل' : 'Full Name'}</label>
                    <input
                      required
                      type="text"
                      value={leadForm.fullName}
                      onChange={(e) => setLeadForm({ ...leadForm, fullName: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600">{isAr ? 'البريد الإلكتروني' : 'Email'}</label>
                    <input
                      required
                      type="email"
                      value={leadForm.email}
                      onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600">{isAr ? 'رقم الهاتف' : 'Phone'}</label>
                    <input
                      required
                      type="tel"
                      value={leadForm.phone}
                      onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600">{isAr ? 'اسم الشركة (اختياري)' : 'Company (optional)'}</label>
                    <input
                      type="text"
                      value={leadForm.company}
                      onChange={(e) => setLeadForm({ ...leadForm, company: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600">{isAr ? 'الدورة المطلوبة' : 'Course'}</label>
                    <select
                      value={leadForm.standardCode}
                      onChange={(e) => setLeadForm({ ...leadForm, standardCode: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    >
                      <option value="">{isAr ? 'غير محدد / كل الدورات' : 'Not sure / all courses'}</option>
                      {LEAD_AUDITOR_STANDARDS.map((std) => (
                        <option key={std.code} value={std.code}>{std.code} — {isAr ? std.titleAr : std.titleEn}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600">{isAr ? 'رسالة (اختياري)' : 'Message (optional)'}</label>
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
                    <span>{leadSubmitting ? (isAr ? 'جارٍ الإرسال...' : 'Sending...') : (isAr ? 'إرسال الطلب' : 'Send Request')}</span>
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
        aria-label={isAr ? 'تواصل معنا عبر واتساب' : 'Chat with us on WhatsApp'}
      >
        <MessageSquare size={26} className="text-white fill-white" />
      </a>

    </div>
  );
};

export default PublicLanding;
