import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Settings,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Eye,
  FileBadge,
  Layout,
  Globe,
  Edit2,
  Trash2,
  Plus,
  Save,
  Check,
  FileText,
  Phone,
  Layers,
  ListCollapse,
  Sparkles,
  Info,
  Code2,
  Users,
  Copy,
  DollarSign
} from 'lucide-react';
import { ISORequest, RequestStatus } from '../types';
import { Language } from '../translations';
import { LandingConfig, LandingService, LandingSection, LandingMenuItem, PartnerLogo } from '../landingConfig';
import RequestDetailModal from './RequestDetailModal';
import { formatMoney } from '../lib/pricing';
import {
  fetchSiteSettings,
  updateSiteSettings,
  SiteSettings,
  fetchTrainingLeads,
  TrainingLead,
  createReferralCode,
  fetchReferralCodes,
  fetchReferredOrders,
  ReferralCode,
  ReferredOrder
} from '../lib/db';

interface AdminPanelProps {
  requests: any[];
  onUpdateStatus: (id: string, status: RequestStatus) => void;
  lang: Language;
  t: (key: any) => string;
  landingConfig: LandingConfig;
  onUpdateLandingConfig: (config: LandingConfig) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ 
  requests, 
  onUpdateStatus, 
  lang, 
  t,
  landingConfig,
  onUpdateLandingConfig
}) => {
  const [adminTab, setAdminTab] = useState<'requests' | 'landing_hero' | 'landing_services' | 'landing_sections' | 'landing_menus' | 'landing_partners' | 'tracking' | 'leads' | 'referrals'>('requests');
  const [selectedRequest, setSelectedRequest] = useState<ISORequest | null>(null);

  const REFERRAL_COMMISSION_AED = 500;
  const [referralCodes, setReferralCodes] = useState<ReferralCode[]>([]);
  const [referredOrders, setReferredOrders] = useState<ReferredOrder[]>([]);
  const [loadingReferrals, setLoadingReferrals] = useState(true);
  const [newReferrer, setNewReferrer] = useState({ name: '', contact: '' });
  const [creatingReferral, setCreatingReferral] = useState(false);
  const [referralError, setReferralError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([fetchReferralCodes(), fetchReferredOrders()]).then(([codes, orders]) => {
      setReferralCodes(codes);
      setReferredOrders(orders);
      setLoadingReferrals(false);
    });
  }, []);

  const handleCreateReferralCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReferrer.name) return;
    setCreatingReferral(true);
    setReferralError(null);
    const result = await createReferralCode(newReferrer.name, newReferrer.contact);
    setCreatingReferral(false);
    if ('error' in result) {
      setReferralError(result.error);
      return;
    }
    setReferralCodes([result, ...referralCodes]);
    setNewReferrer({ name: '', contact: '' });
  };

  const [trainingLeads, setTrainingLeads] = useState<TrainingLead[]>([]);
  const [loadingLeads, setLoadingLeads] = useState(true);

  useEffect(() => {
    fetchTrainingLeads().then((data) => {
      setTrainingLeads(data);
      setLoadingLeads(false);
    });
  }, []);
  const isAr = lang === 'ar';

  // Tracking/SEO codes (Meta Pixel, Google Tag, etc.) — stored in Supabase
  // (not localStorage like landingConfig) since every visitor's browser
  // needs to read them, not just this admin's.
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    metaPixelId: '',
    gaMeasurementId: '',
    gtmContainerId: '',
    googleSiteVerification: '',
    customHeadCode: '',
    customBodyCode: ''
  });
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSaved, setSettingsSaved] = useState(false);

  useEffect(() => {
    fetchSiteSettings().then((data) => {
      setSiteSettings(data);
      setLoadingSettings(false);
    });
  }, []);

  const handleSaveSiteSettings = async () => {
    setSavingSettings(true);
    setSettingsSaved(false);
    const ok = await updateSiteSettings(siteSettings);
    setSavingSettings(false);
    if (ok) {
      setSettingsSaved(true);
      setTimeout(() => setSettingsSaved(false), 3000);
    }
  };

  // Substate for adding/editing services
  const [newService, setNewService] = useState<Partial<LandingService>>({
    code: '',
    titleEn: '',
    titleAr: '',
    descEn: '',
    descAr: '',
    price: 1000,
    icon: 'Shield'
  });

  // Substate for adding/editing sections
  const [newSection, setNewSection] = useState<Partial<LandingSection>>({
    id: '',
    type: 'custom',
    titleEn: '',
    titleAr: '',
    contentEn: '',
    contentAr: '',
    visible: true
  });

  // Substate for adding menu items
  const [newMenuItem, setNewMenuItem] = useState<Partial<LandingMenuItem>>({
    labelEn: '',
    labelAr: '',
    targetSection: 'hero'
  });

  // Save full config helper
  const triggerConfigUpdate = (newConfig: LandingConfig) => {
    onUpdateLandingConfig(newConfig);
  };

  // 1. Hero Updates
  const handleHeroChange = (field: string, value: any) => {
    const updated = {
      ...landingConfig,
      hero: {
        ...landingConfig.hero,
        [field]: value
      }
    };
    triggerConfigUpdate(updated);
  };

  // 2. Contact Updates
  const handleContactChange = (field: string, value: any) => {
    const updated = {
      ...landingConfig,
      contact: {
        ...landingConfig.contact,
        [field]: value
      }
    };
    triggerConfigUpdate(updated);
  };

  // 3. Service Actions
  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newService.code || !newService.titleEn || !newService.titleAr) return;

    const id = 's_' + Date.now();
    const serviceToAdd: LandingService = {
      id,
      code: newService.code,
      titleEn: newService.titleEn,
      titleAr: newService.titleAr,
      descEn: newService.descEn || '',
      descAr: newService.descAr || '',
      price: Number(newService.price) || 1000,
      icon: (newService.icon as any) || 'Shield'
    };

    const updated = {
      ...landingConfig,
      services: [...landingConfig.services, serviceToAdd]
    };
    triggerConfigUpdate(updated);
    
    // Reset form
    setNewService({
      code: '',
      titleEn: '',
      titleAr: '',
      descEn: '',
      descAr: '',
      price: 1000,
      icon: 'Shield'
    });
  };

  const handleDeleteService = (id: string) => {
    const updated = {
      ...landingConfig,
      services: landingConfig.services.filter(s => s.id !== id)
    };
    triggerConfigUpdate(updated);
  };

  // 4. Custom Section Actions
  const handleAddSection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSection.id || !newSection.titleEn || !newSection.titleAr) return;

    const sectionToAdd: LandingSection = {
      id: newSection.id.toLowerCase().replace(/\s+/g, '-'),
      type: newSection.type as any || 'custom',
      titleEn: newSection.titleEn,
      titleAr: newSection.titleAr,
      contentEn: newSection.contentEn || '',
      contentAr: newSection.contentAr || '',
      visible: newSection.visible !== undefined ? newSection.visible : true
    };

    const updated = {
      ...landingConfig,
      customSections: [...landingConfig.customSections, sectionToAdd]
    };
    triggerConfigUpdate(updated);

    // Reset
    setNewSection({
      id: '',
      type: 'custom',
      titleEn: '',
      titleAr: '',
      contentEn: '',
      contentAr: '',
      visible: true
    });
  };

  const handleDeleteSection = (id: string) => {
    const updated = {
      ...landingConfig,
      customSections: landingConfig.customSections.filter(sec => sec.id !== id)
    };
    triggerConfigUpdate(updated);
  };

  const handleToggleSectionVisibility = (id: string) => {
    const updated = {
      ...landingConfig,
      customSections: landingConfig.customSections.map(sec => 
        sec.id === id ? { ...sec, visible: !sec.visible } : sec
      )
    };
    triggerConfigUpdate(updated);
  };

  // 5. Menu Actions
  const handleAddMenuItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMenuItem.labelEn || !newMenuItem.labelAr) return;

    const id = 'm_' + Date.now();
    const itemToAdd: LandingMenuItem = {
      id,
      labelEn: newMenuItem.labelEn,
      labelAr: newMenuItem.labelAr,
      targetSection: newMenuItem.targetSection || 'hero'
    };

    const updated = {
      ...landingConfig,
      menuItems: [...landingConfig.menuItems, itemToAdd]
    };
    triggerConfigUpdate(updated);

    setNewMenuItem({
      labelEn: '',
      labelAr: '',
      targetSection: 'hero'
    });
  };

  // Partner / satisfied-member logos
  const [newPartnerLogo, setNewPartnerLogo] = useState<Partial<PartnerLogo>>({ name: '', logoUrl: '' });

  const handleAddPartnerLogo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPartnerLogo.name || !newPartnerLogo.logoUrl) return;
    const logoToAdd: PartnerLogo = {
      id: 'logo_' + Date.now(),
      name: newPartnerLogo.name,
      logoUrl: newPartnerLogo.logoUrl
    };
    const updated = {
      ...landingConfig,
      partnerLogos: [...landingConfig.partnerLogos, logoToAdd]
    };
    triggerConfigUpdate(updated);
    setNewPartnerLogo({ name: '', logoUrl: '' });
  };

  const handleDeletePartnerLogo = (id: string) => {
    const updated = {
      ...landingConfig,
      partnerLogos: landingConfig.partnerLogos.filter((l) => l.id !== id)
    };
    triggerConfigUpdate(updated);
  };

  const handleDeleteMenuItem = (id: string) => {
    const updated = {
      ...landingConfig,
      menuItems: landingConfig.menuItems.filter(item => item.id !== id)
    };
    triggerConfigUpdate(updated);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Header with Switcher */}
      <div className={`flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 ${isAr ? 'lg:flex-row-reverse' : ''}`}>
        <div className={isAr ? 'text-right' : 'text-left'}>
          <h2 className="text-2xl font-black text-slate-900">
            {isAr ? 'وحدة التحكم الإدارية بالعمليات والموقع' : 'Global Operations & Site CMS Console'}
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            {isAr 
              ? 'إدارة طلبات ISO المعتمدة، وتعديل وتحديث محتوى الموقع الإلكتروني الخارجي مباشرة.' 
              : 'Manage international ISO applications and customize the front-end showcase landing sections dynamically.'}
          </p>
        </div>
        
        {/* Main Admin Mode Switch */}
        <div className="flex flex-wrap gap-2 bg-slate-100 p-1 rounded-2xl border border-slate-200">
          <button
            onClick={() => setAdminTab('requests')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              adminTab === 'requests' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-indigo-600'
            }`}
          >
            <ShieldCheck size={14} />
            <span>{isAr ? 'طلبات ISO والسجل' : 'Requests & Registry'}</span>
          </button>

          <button
            onClick={() => setAdminTab('landing_hero')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              adminTab === 'landing_hero' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-indigo-600'
            }`}
          >
            <Sparkles size={14} />
            <span>{isAr ? 'البانر الرئيسي والاتصال' : 'Hero & Contacts'}</span>
          </button>

          <button
            onClick={() => setAdminTab('landing_services')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              adminTab === 'landing_services' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-indigo-600'
            }`}
          >
            <Layers size={14} />
            <span>{isAr ? 'خدمات ومعايير ISO' : 'ISO Services'}</span>
          </button>

          <button
            onClick={() => setAdminTab('landing_sections')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              adminTab === 'landing_sections' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-indigo-600'
            }`}
          >
            <FileText size={14} />
            <span>{isAr ? 'الأقسام المخصصة' : 'Custom Sections'}</span>
          </button>

          <button
            onClick={() => setAdminTab('landing_menus')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              adminTab === 'landing_menus' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-indigo-600'
            }`}
          >
            <ListCollapse size={14} />
            <span>{isAr ? 'القائمة العلوية' : 'Navigation Menu'}</span>
          </button>

          <button
            onClick={() => setAdminTab('landing_partners')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              adminTab === 'landing_partners' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-indigo-600'
            }`}
          >
            <Users size={14} />
            <span>{isAr ? 'شعارات العملاء والشركاء' : 'Partner Logos'}</span>
          </button>

          <button
            onClick={() => setAdminTab('tracking')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              adminTab === 'tracking' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-indigo-600'
            }`}
          >
            <Code2 size={14} />
            <span>{isAr ? 'أكواد التتبع وSEO' : 'Tracking & SEO Codes'}</span>
          </button>

          <button
            onClick={() => setAdminTab('leads')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              adminTab === 'leads' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-indigo-600'
            }`}
          >
            <Phone size={14} />
            <span>{isAr ? 'طلبات الدورات التدريبية' : 'Training Leads'}</span>
          </button>

          <button
            onClick={() => setAdminTab('referrals')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              adminTab === 'referrals' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-indigo-600'
            }`}
          >
            <DollarSign size={14} />
            <span>{isAr ? 'برنامج الإحالة' : 'Referral Program'}</span>
          </button>
        </div>
      </div>

      <div className="h-px bg-slate-200"></div>

      {/* RENDER REQUESTS WORKFLOW (Original functionality intact and enhanced) */}
      {adminTab === 'requests' && (
        <div className="space-y-6">
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${isAr ? 'direction-rtl' : ''}`}>
            <div className="bg-indigo-600 p-6 rounded-3xl text-white shadow-xl shadow-indigo-100">
              <p className="text-indigo-100 text-xs font-bold uppercase tracking-wider">{isAr ? 'طلبات قيد المراجعة' : 'Pending Review'}</p>
              <h3 className="text-3xl font-black mt-2">
                {requests.filter(r => r.status === RequestStatus.SUBMITTED || r.status === RequestStatus.UNDER_REVIEW).length}
              </h3>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">{isAr ? 'نواقص وثائق ومستندات' : 'Missing Documents'}</p>
              <h3 className="text-3xl font-black text-slate-900 mt-2">
                {requests.filter(r => r.status === RequestStatus.MISSING_DOCS).length}
              </h3>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">{isAr ? 'تم التصديق والإصدار' : 'Certified Issued'}</p>
              <h3 className="text-3xl font-black text-emerald-600 mt-2">
                {requests.filter(r => r.status === RequestStatus.CERTIFIED).length}
              </h3>
            </div>
            <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-3xl">
              <p className="text-indigo-600 text-xs font-bold uppercase tracking-wider">{isAr ? 'إجمالي الطلبات الفعالة' : 'Total Pipeline Cases'}</p>
              <h3 className="text-3xl font-black text-indigo-900 mt-2">{requests.length}</h3>
            </div>
          </div>

          <div className="bg-white border rounded-[2rem] overflow-hidden shadow-sm">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="font-bold text-slate-900 text-base">{isAr ? 'قائمة سجلات طلبات ISO' : 'ISO Applications Audit Logs'}</h3>
              <span className="text-[10px] bg-slate-100 px-2.5 py-1 rounded-full text-slate-500 font-extrabold uppercase tracking-wider">
                {isAr ? 'نشط' : 'SYSTEM LIVE'}
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className={`w-full ${isAr ? 'text-right' : 'text-left'} border-collapse`}>
                <thead>
                  <tr className="bg-slate-50 border-b text-slate-500">
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">{isAr ? 'الشركة / المعرف' : 'Company / ID'}</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">{isAr ? 'المواصفات المطلوبة' : 'ISO Standards'}</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">{isAr ? 'جهة الاعتماد المعتمدة' : 'Accreditation Body'}</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">{isAr ? 'القيمة' : 'Amount'}</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">{isAr ? 'الاشتراك' : 'Subscription'}</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">{isAr ? 'الحالة' : 'Status'}</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">{isAr ? 'العملية التشغيلية' : 'Audit Process Action'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-slate-700">
                  {requests.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-5">
                        <p className="text-sm font-extrabold text-slate-900">{req.company.name}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{req.id}</p>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-wrap gap-1">
                          {req.standards.map((s: any) => (
                            <span key={s.id} className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] font-bold rounded">
                              {s.code}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-5 text-xs font-semibold text-slate-600">
                        {req.accreditationBody}
                      </td>
                      <td className="px-6 py-5 text-sm font-bold text-slate-900">
                        {formatMoney(req.amount, req.currency ?? 'usd')}
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col gap-1">
                          <span className="text-xs font-bold text-slate-700">
                            {req.renewalTerm === '3y' ? (isAr ? 'كل 3 سنوات' : 'Every 3 years') : (isAr ? 'سنوياً' : 'Yearly')}
                          </span>
                          <span className={`w-fit px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                            req.subscriptionStatus === 'active' ? 'bg-emerald-100 text-emerald-800' :
                            req.subscriptionStatus === 'past_due' ? 'bg-amber-100 text-amber-800' :
                            'bg-rose-100 text-rose-800'
                          }`}>
                            {req.subscriptionStatus === 'active' ? (isAr ? 'نشط' : 'Active') :
                             req.subscriptionStatus === 'past_due' ? (isAr ? 'دفعة متأخرة' : 'Past Due') :
                             req.subscriptionStatus === 'unpaid' ? (isAr ? 'غير مدفوع' : 'Unpaid') :
                             (isAr ? 'ملغى' : 'Canceled')}
                          </span>
                          {req.nextRenewalAt && (
                            <span className="text-[9px] text-slate-400 font-semibold">
                              {isAr ? 'التجديد: ' : 'Renews: '}
                              {new Date(req.nextRenewalAt).toLocaleDateString(isAr ? 'ar' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                         <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                           req.status === RequestStatus.CERTIFIED ? 'bg-emerald-100 text-emerald-800' :
                           req.status === RequestStatus.APPROVED ? 'bg-indigo-100 text-indigo-800' :
                           req.status === RequestStatus.MISSING_DOCS ? 'bg-rose-100 text-rose-800' :
                           'bg-amber-100 text-amber-800'
                         }`}>
                           {req.status}
                         </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className={`flex gap-2 ${isAr ? 'justify-end' : ''}`}>
                          {req.status === RequestStatus.SUBMITTED && (
                            <button 
                              onClick={() => onUpdateStatus(req.id, RequestStatus.UNDER_REVIEW)}
                              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all"
                            >
                              {isAr ? 'بدء المراجعة' : 'Start Review'}
                            </button>
                          )}
                          {req.status === RequestStatus.UNDER_REVIEW && (
                            <>
                              <button 
                                onClick={() => onUpdateStatus(req.id, RequestStatus.MISSING_DOCS)}
                                className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl transition-all"
                              >
                                {isAr ? 'طلب نواقص' : 'Reject Docs'}
                              </button>
                              <button 
                                onClick={() => onUpdateStatus(req.id, RequestStatus.APPROVED)}
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all"
                              >
                                {isAr ? 'موافقة وتصديق' : 'Approve'}
                              </button>
                            </>
                          )}
                          {req.status === RequestStatus.APPROVED && (
                            <button 
                              onClick={() => onUpdateStatus(req.id, RequestStatus.CERTIFIED)}
                              className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold rounded-xl shadow-md transition-all"
                            >
                              <FileBadge size={13} />
                              <span>{isAr ? 'إصدار وتوقيع الشهادة' : 'Issue Certificate'}</span>
                            </button>
                          )}
                          <button
                            onClick={() => setSelectedRequest(req)}
                            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                            title={isAr ? 'الملفات والعداد' : 'Files & Countdown'}
                          >
                            <FileText size={16} />
                          </button>
                          <span className="text-xs text-slate-400 font-medium py-1.5">
                            {req.status === RequestStatus.CERTIFIED && (isAr ? 'مكتمل' : 'Certified Case')}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* RENDER CMS: HERO & CONTACTS BUILDER */}
      {adminTab === 'landing_hero' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Hero Content Settings Form */}
          <div className="bg-white border p-6 rounded-[2rem] space-y-6 shadow-sm">
            <div className="border-b pb-4">
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <Sparkles className="text-indigo-600" size={18} />
                <span>{isAr ? 'تعديل البانر الرئيسي (Hero Section)' : 'Customize Hero Landing Section'}</span>
              </h3>
              <p className="text-[11px] text-amber-600 font-bold mt-2">
                {isAr ? '⚠ هذا القسم غير مربوط بعد بالصفحة الرئيسية الفعلية.' : '⚠ Not yet connected to the live homepage.'}
              </p>
            </div>

            <div className="space-y-4">
              {/* English Fields */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Hero Title (English)</label>
                <input 
                  type="text"
                  value={landingConfig.hero.titleEn}
                  onChange={(e) => handleHeroChange('titleEn', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none font-medium"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Hero Subtitle (English)</label>
                <textarea 
                  rows={3}
                  value={landingConfig.hero.subtitleEn}
                  onChange={(e) => handleHeroChange('subtitleEn', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none font-medium text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">CTA Button (English)</label>
                <input 
                  type="text"
                  value={landingConfig.hero.ctaTextEn}
                  onChange={(e) => handleHeroChange('ctaTextEn', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none font-medium"
                />
              </div>

              <div className="h-px bg-slate-100 my-4"></div>

              {/* Arabic Fields */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">العنوان الرئيسي للموقع (العربية)</label>
                <input 
                  type="text"
                  value={landingConfig.hero.titleAr}
                  onChange={(e) => handleHeroChange('titleAr', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none font-medium text-right font-sans"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">العنوان الفرعي (العربية)</label>
                <textarea 
                  rows={3}
                  value={landingConfig.hero.subtitleAr}
                  onChange={(e) => handleHeroChange('subtitleAr', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none font-medium text-sm text-right font-sans"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">نص زر الإجراء والطلب (العربية)</label>
                <input 
                  type="text"
                  value={landingConfig.hero.ctaTextAr}
                  onChange={(e) => handleHeroChange('ctaTextAr', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none font-medium text-right font-sans"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input 
                  type="checkbox"
                  id="showImage"
                  checked={landingConfig.hero.showImage}
                  onChange={(e) => handleHeroChange('showImage', e.target.checked)}
                  className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                />
                <label htmlFor="showImage" className="text-xs font-bold text-slate-600 uppercase tracking-wider block cursor-pointer">
                  Show Digital Certificate Graphic Preview
                </label>
              </div>

            </div>
          </div>

          {/* Contact Details Settings Form */}
          <div className="bg-white border p-6 rounded-[2rem] space-y-6 shadow-sm">
            <div className="border-b pb-4">
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <Phone className="text-indigo-600" size={18} />
                <span>{isAr ? 'تفاصيل الاتصال والموقع والمقر' : 'Customize UAE Contact & Office Settings'}</span>
              </h3>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Email Address</label>
                  <input 
                    type="email"
                    value={landingConfig.contact.email}
                    onChange={(e) => handleContactChange('email', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none font-medium text-xs"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Telephone Phone</label>
                  <input 
                    type="text"
                    value={landingConfig.contact.phone}
                    onChange={(e) => handleContactChange('phone', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none font-medium text-xs"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">WhatsApp Number (e.g. +97156...)</label>
                <input 
                  type="text"
                  value={landingConfig.contact.whatsapp}
                  onChange={(e) => handleContactChange('whatsapp', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none font-medium text-xs"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Office Address (English)</label>
                <input 
                  type="text"
                  value={landingConfig.contact.addressEn}
                  onChange={(e) => handleContactChange('addressEn', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none font-medium text-xs"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">المقر والعنوان (العربية)</label>
                <input 
                  type="text"
                  value={landingConfig.contact.addressAr}
                  onChange={(e) => handleContactChange('addressAr', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none font-medium text-xs text-right font-sans"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Working Hours (English)</label>
                <input 
                  type="text"
                  value={landingConfig.contact.hoursEn}
                  onChange={(e) => handleContactChange('hoursEn', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none font-medium text-xs"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">ساعات العمل (العربية)</label>
                <input 
                  type="text"
                  value={landingConfig.contact.hoursAr}
                  onChange={(e) => handleContactChange('hoursAr', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none font-medium text-xs text-right font-sans"
                />
              </div>

              <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-start gap-3">
                <Info size={16} className="text-indigo-600 mt-0.5" />
                <p className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider leading-relaxed">
                  NOTE: All changes on this tab apply to the landing page and footer instantly. Live sync is active.
                </p>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* RENDER CMS: ISO SERVICES LIST MANAGER */}
      {adminTab === 'landing_services' && (
        <div className="space-y-8">
          
          {/* Add Service Card Form */}
          <div className="bg-white border p-6 rounded-[2rem] shadow-sm">
            <h3 className="font-extrabold text-slate-900 text-base mb-6 flex items-center gap-2">
              <Plus className="text-indigo-600" size={18} />
              <span>{isAr ? 'إضافة معيار ISO جديد للموقع' : 'Feature a New ISO Standard Card'}</span>
            </h3>
            <p className="text-[11px] text-amber-600 font-bold -mt-4 mb-6">
              {isAr ? '⚠ هذا القسم غير مربوط بعد بالصفحة الرئيسية الفعلية (قسم الأسعار الحالي ثابت).' : "⚠ Not yet connected to the live homepage (the current Pricing section is fixed content)."}
            </p>

            <form onSubmit={handleAddService} className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">ISO Code / Label</label>
                <input 
                  required
                  type="text"
                  placeholder="e.g. ISO 27018"
                  value={newService.code}
                  onChange={(e) => setNewService({...newService, code: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none font-medium text-xs"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Base Fee / Price (USD)</label>
                <input 
                  required
                  type="number"
                  placeholder="e.g. 2400"
                  value={newService.price}
                  onChange={(e) => setNewService({...newService, price: Number(e.target.value)})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none font-medium text-xs"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Select Display Icon</label>
                <select
                  value={newService.icon}
                  onChange={(e) => setNewService({...newService, icon: e.target.value as any})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none font-medium text-xs"
                >
                  <option value="Shield">Shield (Security/Quality)</option>
                  <option value="Zap">Zap (Express/Speed)</option>
                  <option value="Award">Award (Standard/Prestige)</option>
                  <option value="Users">Users (Social/OHS)</option>
                  <option value="Building">Building (Asset/Facility)</option>
                  <option value="FileCheck">FileCheck (Compliance/Review)</option>
                  <option value="CheckCircle2">CheckCircle2 (Environment/General)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Service Title (English)</label>
                <input 
                  required
                  type="text"
                  placeholder="e.g. Public Cloud Privacy Protection"
                  value={newService.titleEn}
                  onChange={(e) => setNewService({...newService, titleEn: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none font-medium text-xs"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">اسم المعيار والخدمة (العربية)</label>
                <input 
                  required
                  type="text"
                  placeholder="مثال: حماية خصوصية البيانات السحابية"
                  value={newService.titleAr}
                  onChange={(e) => setNewService({...newService, titleAr: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none font-medium text-xs text-right font-sans"
                />
              </div>

              <div className="space-y-2 md:col-span-3">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Brief Description (English)</label>
                <textarea 
                  rows={2}
                  value={newService.descEn}
                  onChange={(e) => setNewService({...newService, descEn: e.target.value})}
                  placeholder="Describe the scope of certification details..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none font-medium text-xs"
                />
              </div>

              <div className="space-y-2 md:col-span-3">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">الوصف الموجز والاعتمادات (العربية)</label>
                <textarea 
                  rows={2}
                  value={newService.descAr}
                  onChange={(e) => setNewService({...newService, descAr: e.target.value})}
                  placeholder="اكتب متطلبات ونطاق هذا المعيار باختصار لعملائك..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none font-medium text-xs text-right font-sans"
                />
              </div>

              <div className="md:col-span-3">
                <button
                  type="submit"
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-100 flex items-center gap-2 transition-all"
                >
                  <Plus size={16} />
                  <span>{isAr ? 'أضف المعيار للموقع الآن' : 'Add to Featured List'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Current Services List */}
          <div className="bg-white border rounded-[2rem] overflow-hidden shadow-sm">
            <div className="p-6 border-b">
              <h3 className="font-bold text-slate-900 text-base">{isAr ? 'قائمة معايير ISO المعروضة حالياً' : 'Currently Displayed ISO Standards'}</h3>
            </div>
            <div className="divide-y">
              {landingConfig.services.map((service) => (
                <div key={service.id} className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:bg-slate-50/50 transition-colors">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2.5">
                      <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-[10px] font-black rounded uppercase tracking-wider">
                        {service.code}
                      </span>
                      <span className="text-xs font-extrabold text-indigo-600">${service.price}</span>
                    </div>
                    <h4 className="text-sm font-extrabold text-slate-900 mt-1">
                      {service.titleEn} <span className="text-slate-400">|</span> <span className="font-medium font-sans text-xs">{service.titleAr}</span>
                    </h4>
                    <p className="text-xs text-slate-400 font-medium max-w-2xl mt-1 leading-relaxed">
                      {service.descEn}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteService(service.id)}
                    className="p-2.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-xl transition-colors shrink-0"
                    title={isAr ? 'حذف الخدمة' : 'Remove Service'}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* RENDER CMS: CUSTOM SECTIONS MANAGER */}
      {adminTab === 'landing_sections' && (
        <div className="space-y-8">
          
          {/* Add Section Form */}
          <div className="bg-white border p-6 rounded-[2rem] shadow-sm">
            <h3 className="font-extrabold text-slate-900 text-base mb-6 flex items-center gap-2">
              <Plus className="text-indigo-600" size={18} />
              <span>{isAr ? 'إنشاء وإضافة قسم أو صفحة مخصصة للموقع' : 'Add a New Page or Custom Section Segment'}</span>
            </h3>
            <p className="text-[11px] text-amber-600 font-bold -mt-4 mb-6">
              {isAr ? '⚠ هذا القسم غير مربوط بعد بالصفحة الرئيسية الفعلية.' : '⚠ Not yet connected to the live homepage.'}
            </p>

            <form onSubmit={handleAddSection} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Unique ID (lowercase, no spaces)</label>
                <input 
                  required
                  type="text"
                  placeholder="e.g. privacy-policy or dubai-branches"
                  value={newSection.id}
                  onChange={(e) => setNewSection({...newSection, id: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none font-medium text-xs"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Section Visual Theme Type</label>
                <select
                  value={newSection.type}
                  onChange={(e) => setNewSection({...newSection, type: e.target.value as any})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none font-medium text-xs"
                >
                  <option value="custom">Standard Layout (Clean light background)</option>
                  <option value="feature">Premium Layout (Dark Midnight-Indigo background with accents)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Section Title (English)</label>
                <input 
                  required
                  type="text"
                  placeholder="e.g. Dynamic Dubai Registry Hub"
                  value={newSection.titleEn}
                  onChange={(e) => setNewSection({...newSection, titleEn: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none font-medium text-xs"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">عنوان القسم / الصفحة (العربية)</label>
                <input 
                  required
                  type="text"
                  placeholder="مثال: سجل دبي للمطابقة والاعتماد"
                  value={newSection.titleAr}
                  onChange={(e) => setNewSection({...newSection, titleAr: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none font-medium text-xs text-right font-sans"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Content Block Text (English) - Supports Linebreaks</label>
                <textarea 
                  required
                  rows={4}
                  value={newSection.contentEn}
                  onChange={(e) => setNewSection({...newSection, contentEn: e.target.value})}
                  placeholder="Enter the full HTML or textual contents for this section..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none font-medium text-xs leading-relaxed"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">محتوى النص الكامل للقسم (العربية)</label>
                <textarea 
                  required
                  rows={4}
                  value={newSection.contentAr}
                  onChange={(e) => setNewSection({...newSection, contentAr: e.target.value})}
                  placeholder="اكتب المحتوى الكامل للقسم هنا بالتفصيل للزوار..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none font-medium text-xs text-right font-sans leading-relaxed"
                />
              </div>

              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-100 flex items-center gap-2 transition-all"
                >
                  <Plus size={16} />
                  <span>{isAr ? 'أنشئ القسم المخصص للموقع' : 'Build Custom Section'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* List of Custom Sections */}
          <div className="bg-white border rounded-[2rem] overflow-hidden shadow-sm">
            <div className="p-6 border-b">
              <h3 className="font-bold text-slate-900 text-base">{isAr ? 'الأقسام المخصصة المعروضة حالياً' : 'Currently Active Custom Sections'}</h3>
            </div>
            <div className="divide-y">
              {landingConfig.customSections.map((sec) => (
                <div key={sec.id} className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:bg-slate-50/50 transition-colors">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2.5">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-black rounded uppercase tracking-wider">
                        ID: {sec.id}
                      </span>
                      <span className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded font-bold uppercase">
                        Theme: {sec.type}
                      </span>
                      <button
                        onClick={() => handleToggleSectionVisibility(sec.id)}
                        className={`text-[10px] px-2 py-0.5 rounded font-extrabold uppercase transition-all ${
                          sec.visible ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {sec.visible ? (isAr ? 'مرئي بالموقع' : 'VISIBLE') : (isAr ? 'مخفي مؤقتاً' : 'HIDDEN')}
                      </button>
                    </div>
                    <h4 className="text-sm font-extrabold text-slate-900 mt-1">
                      {sec.titleEn} <span className="text-slate-400">|</span> <span className="font-medium font-sans text-xs">{sec.titleAr}</span>
                    </h4>
                    <p className="text-xs text-slate-400 font-medium max-w-3xl mt-1 leading-relaxed line-clamp-3">
                      {sec.contentEn}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteSection(sec.id)}
                    className="p-2.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-xl transition-colors shrink-0"
                    title={isAr ? 'حذف القسم' : 'Delete Custom Section'}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* RENDER CMS: NAVIGATION MENU LINK MANAGER */}
      {adminTab === 'landing_menus' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Add Menu Link */}
          <div className="bg-white border p-6 rounded-[2rem] space-y-6 shadow-sm">
            <div className="border-b pb-4">
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <Plus className="text-indigo-600" size={18} />
                <span>{isAr ? 'إضافة رابط تنقل جديد في الهيدر' : 'Add Top Navigation Link'}</span>
              </h3>
              <p className="text-[11px] text-amber-600 font-bold mt-2">
                {isAr ? '⚠ هذا القسم غير مربوط بعد بقائمة التنقل الفعلية في الصفحة الرئيسية.' : '⚠ Not yet connected to the live homepage navigation menu.'}
              </p>
            </div>

            <form onSubmit={handleAddMenuItem} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Menu Label (English)</label>
                <input 
                  required
                  type="text"
                  placeholder="e.g. FAQ Page"
                  value={newMenuItem.labelEn}
                  onChange={(e) => setNewMenuItem({...newMenuItem, labelEn: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none font-medium text-xs"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">اسم الرابط بالقائمة (العربية)</label>
                <input 
                  required
                  type="text"
                  placeholder="مثال: الأسئلة المتداولة"
                  value={newMenuItem.labelAr}
                  onChange={(e) => setNewMenuItem({...newMenuItem, labelAr: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none font-medium text-xs text-right font-sans"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Scroll Target Section ID</label>
                <select
                  value={newMenuItem.targetSection}
                  onChange={(e) => setNewMenuItem({...newMenuItem, targetSection: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none font-medium text-xs"
                >
                  <option value="hero">Hero Top Section</option>
                  <option value="services">Featured ISO Standards Grid</option>
                  {landingConfig.customSections.map(sec => (
                    <option key={sec.id} value={sec.id}>Custom Section: {sec.titleEn} ({sec.id})</option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 transition-all"
              >
                <Plus size={16} />
                <span>{isAr ? 'أضف رابط القائمة الآن' : 'Add Header Navigation Item'}</span>
              </button>
            </form>
          </div>

          {/* Current Navigation Menu Links */}
          <div className="bg-white border p-6 rounded-[2rem] space-y-4 shadow-sm">
            <div>
              <h3 className="font-bold text-slate-900 text-base">{isAr ? 'ترتيب روابط القائمة الفعالة' : 'Header Navigation Menu Items'}</h3>
              <p className="text-xs text-slate-400 font-medium mt-1">
                {isAr ? 'تتحكم هذه الروابط في خيارات الانتقال السريع للعملاء في أعلى الموقع.' : 'These links dictate what prospective clients see in the public header navigation.'}
              </p>
            </div>

            <div className="divide-y">
              {landingConfig.menuItems.map((item) => (
                <div key={item.id} className="py-3 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-extrabold text-slate-800">
                      {item.labelEn} <span className="text-slate-300">/</span> <span className="font-medium font-sans text-xs">{item.labelAr}</span>
                    </p>
                    <p className="text-[10px] text-indigo-500 font-bold uppercase mt-0.5">Scroll Target: #{item.targetSection}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteMenuItem(item.id)}
                    className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {adminTab === 'landing_partners' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Add Partner Logo */}
          <div className="bg-white border p-6 rounded-[2rem] space-y-6 shadow-sm">
            <div className="border-b pb-4">
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <Plus className="text-indigo-600" size={18} />
                <span>{isAr ? 'إضافة شعار عميل أو شريك' : 'Add a Client / Partner Logo'}</span>
              </h3>
              <p className="text-xs text-slate-400 font-medium mt-2">
                {isAr
                  ? 'يظهر هذا في قسم "عملاء راضون وشركاء موثوقون" على الصفحة الرئيسية. طالما القائمة فارغة، تظهر مربعات رمادية بدلاً منها.'
                  : 'Shown in the "Satisfied Members & Verified Partners" section on the homepage. While this list is empty, gray placeholder tiles show instead.'}
              </p>
            </div>

            <form onSubmit={handleAddPartnerLogo} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">{isAr ? 'اسم العميل / الشريك' : 'Client / Partner Name'}</label>
                <input
                  required
                  type="text"
                  placeholder={isAr ? 'مثال: شركة الحارث العربي' : 'e.g. Al-Harith Arabi Co.'}
                  value={newPartnerLogo.name}
                  onChange={(e) => setNewPartnerLogo({ ...newPartnerLogo, name: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none font-medium text-xs"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">{isAr ? 'رابط الشعار (URL)' : 'Logo Image URL'}</label>
                <input
                  required
                  type="url"
                  placeholder="https://..."
                  value={newPartnerLogo.logoUrl}
                  onChange={(e) => setNewPartnerLogo({ ...newPartnerLogo, logoUrl: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none font-medium text-xs"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 transition-all"
              >
                <Plus size={16} />
                <span>{isAr ? 'أضف الشعار' : 'Add Logo'}</span>
              </button>
            </form>
          </div>

          {/* Current Partner Logos */}
          <div className="bg-white border p-6 rounded-[2rem] space-y-4 shadow-sm">
            <div>
              <h3 className="font-bold text-slate-900 text-base">{isAr ? 'الشعارات الحالية' : 'Current Logos'}</h3>
              <p className="text-xs text-slate-400 font-medium mt-1">
                {isAr ? `${landingConfig.partnerLogos.length} شعار مضاف` : `${landingConfig.partnerLogos.length} logo(s) added`}
              </p>
            </div>

            {landingConfig.partnerLogos.length === 0 ? (
              <p className="text-xs text-slate-400 font-medium py-4">{isAr ? 'لا توجد شعارات بعد.' : 'No logos yet.'}</p>
            ) : (
              <div className="divide-y">
                {landingConfig.partnerLogos.map((logo) => (
                  <div key={logo.id} className="py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img src={logo.logoUrl} alt={logo.name} className="w-14 h-9 object-contain bg-slate-50 border border-slate-100 rounded-lg p-1" />
                      <p className="text-sm font-extrabold text-slate-800">{logo.name}</p>
                    </div>
                    <button
                      onClick={() => handleDeletePartnerLogo(logo.id)}
                      className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

      {adminTab === 'tracking' && (
        <div className="max-w-3xl space-y-8">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 text-xs text-amber-800 leading-relaxed">
            <Info size={16} className="shrink-0 mt-0.5" />
            <p>
              {isAr
                ? 'تُطبَّق هذه الأكواد على الموقع بالكامل لكل زائر (وليس فقط في متصفحك). أدخل فقط أكوادًا تثق بها — حقل \"أكواد إضافية\" ينفذ أي HTML/JavaScript تضعه هنا.'
                : 'These codes apply site-wide, for every visitor (not just your browser). Only paste code you trust — the "Additional Code" fields execute any HTML/JavaScript you put there.'}
            </p>
          </div>

          {loadingSettings ? (
            <p className="text-sm text-slate-400 font-medium">{isAr ? 'جارٍ التحميل...' : 'Loading...'}</p>
          ) : (
            <div className="bg-white border p-6 rounded-[2rem] space-y-6 shadow-sm">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Meta (Facebook) Pixel ID</label>
                <input
                  type="text"
                  placeholder="e.g. 123456789012345"
                  value={siteSettings.metaPixelId}
                  onChange={(e) => setSiteSettings({ ...siteSettings, metaPixelId: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none font-mono text-xs"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Google Analytics (GA4) Measurement ID</label>
                <input
                  type="text"
                  placeholder="e.g. G-XXXXXXXXXX"
                  value={siteSettings.gaMeasurementId}
                  onChange={(e) => setSiteSettings({ ...siteSettings, gaMeasurementId: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none font-mono text-xs"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Google Tag Manager Container ID</label>
                <input
                  type="text"
                  placeholder="e.g. GTM-XXXXXXX"
                  value={siteSettings.gtmContainerId}
                  onChange={(e) => setSiteSettings({ ...siteSettings, gtmContainerId: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none font-mono text-xs"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Google Search Console Verification Code</label>
                <input
                  type="text"
                  placeholder={isAr ? 'قيمة content من وسم meta name="google-site-verification"' : 'The content value from the google-site-verification meta tag'}
                  value={siteSettings.googleSiteVerification}
                  onChange={(e) => setSiteSettings({ ...siteSettings, googleSiteVerification: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none font-mono text-xs"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  {isAr ? 'أكواد إضافية — قبل إغلاق </head>' : 'Additional Code — before </head>'}
                </label>
                <textarea
                  rows={4}
                  placeholder={isAr ? 'مثال: كود تحقق TikTok Pixel أو Bing، أو أي وسم <script>...' : 'e.g. TikTok Pixel, Bing verification, or any <script> tag'}
                  value={siteSettings.customHeadCode}
                  onChange={(e) => setSiteSettings({ ...siteSettings, customHeadCode: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none font-mono text-xs"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  {isAr ? 'أكواد إضافية — قبل إغلاق </body>' : 'Additional Code — before </body>'}
                </label>
                <textarea
                  rows={4}
                  placeholder={isAr ? 'مثال: ودجة دردشة أو نافذة منبثقة' : 'e.g. a chat widget or popup script'}
                  value={siteSettings.customBodyCode}
                  onChange={(e) => setSiteSettings({ ...siteSettings, customBodyCode: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none font-mono text-xs"
                />
              </div>

              <button
                onClick={handleSaveSiteSettings}
                disabled={savingSettings}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 transition-all"
              >
                {settingsSaved ? <Check size={16} /> : <Save size={16} />}
                <span>
                  {settingsSaved
                    ? (isAr ? 'تم الحفظ' : 'Saved')
                    : savingSettings
                    ? (isAr ? 'جارٍ الحفظ...' : 'Saving...')
                    : (isAr ? 'حفظ أكواد التتبع' : 'Save Tracking Codes')}
                </span>
              </button>
            </div>
          )}
        </div>
      )}

      {adminTab === 'leads' && (
        <div className="bg-white border rounded-[2rem] shadow-sm overflow-hidden">
          <div className="p-6 border-b">
            <h3 className="font-extrabold text-slate-900 text-base">{isAr ? 'طلبات معلومات الدورات التدريبية' : 'Training Course Inquiries'}</h3>
            <p className="text-xs text-slate-400 font-medium mt-1">
              {isAr
                ? 'كل طلب يُحفظ هنا فوراً حتى لو تعذّر إرسال البريد الإلكتروني — عمود "البريد" يوضح حالة الإرسال.'
                : 'Every submission is saved here immediately, even if the email failed to send — the "Email" column shows delivery status.'}
            </p>
          </div>
          {loadingLeads ? (
            <p className="p-6 text-sm text-slate-400 font-medium">{isAr ? 'جارٍ التحميل...' : 'Loading...'}</p>
          ) : trainingLeads.length === 0 ? (
            <p className="p-6 text-sm text-slate-400 font-medium">{isAr ? 'لا توجد طلبات بعد.' : 'No inquiries yet.'}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                  <tr>
                    <th className="text-start px-6 py-3">{isAr ? 'الاسم' : 'Name'}</th>
                    <th className="text-start px-6 py-3">{isAr ? 'التواصل' : 'Contact'}</th>
                    <th className="text-start px-6 py-3">{isAr ? 'الدورة' : 'Course'}</th>
                    <th className="text-start px-6 py-3">{isAr ? 'الرسالة' : 'Message'}</th>
                    <th className="text-start px-6 py-3">{isAr ? 'البريد' : 'Email'}</th>
                    <th className="text-start px-6 py-3">{isAr ? 'التاريخ' : 'Date'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {trainingLeads.map((lead) => (
                    <tr key={lead.id}>
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-900">{lead.fullName}</p>
                        {lead.company && <p className="text-xs text-slate-400">{lead.company}</p>}
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500">
                        <p>{lead.email}</p>
                        {lead.phone && <p>{lead.phone}</p>}
                      </td>
                      <td className="px-6 py-4 text-xs font-bold text-indigo-600">{lead.standardCode || '—'}</td>
                      <td className="px-6 py-4 text-xs text-slate-500 max-w-xs truncate">{lead.message || '—'}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${lead.emailSent ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                          {lead.emailSent ? (isAr ? 'أُرسل' : 'Sent') : (isAr ? 'لم يُرسل' : 'Not sent')}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-400">{new Date(lead.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {adminTab === 'referrals' && (() => {
        const commissionByCode = referralCodes.map((rc) => {
          const orders = referredOrders.filter((o) => o.referralCode === rc.code);
          return { ...rc, orderCount: orders.length, commissionAed: orders.length * REFERRAL_COMMISSION_AED };
        });
        const knownCodes = new Set(referralCodes.map((rc) => rc.code));
        const unknownCodes = Array.from(new Set(referredOrders.filter((o) => !knownCodes.has(o.referralCode)).map((o) => o.referralCode)));
        const totalCommissionAed = commissionByCode.reduce((sum, rc) => sum + rc.commissionAed, 0) + unknownCodes.reduce((sum, code) => sum + referredOrders.filter((o) => o.referralCode === code).length * REFERRAL_COMMISSION_AED, 0);

        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Create a referral code */}
              <div className="bg-white border p-6 rounded-[2rem] space-y-6 shadow-sm">
                <div className="border-b pb-4">
                  <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                    <Plus className="text-indigo-600" size={18} />
                    <span>{isAr ? 'إنشاء رابط إحالة جديد' : 'Create a Referral Link'}</span>
                  </h3>
                  <p className="text-xs text-slate-400 font-medium mt-2">
                    {isAr
                      ? `يمكن لأي شخص (شريك أو عميل حالي) استخدام رابطه لإحالة عملاء جدد. تحصل على AED ${REFERRAL_COMMISSION_AED} عمولة عند دفع كل عميل مُحال.`
                      : `Anyone (a partner or existing client) can use their link to refer new clients. AED ${REFERRAL_COMMISSION_AED} commission is owed per referred order once it's paid.`}
                  </p>
                </div>
                <form onSubmit={handleCreateReferralCode} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">{isAr ? 'اسم المحيل' : "Referrer's Name"}</label>
                    <input
                      required
                      type="text"
                      value={newReferrer.name}
                      onChange={(e) => setNewReferrer({ ...newReferrer, name: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none font-medium text-xs"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">{isAr ? 'وسيلة التواصل (اختياري)' : 'Contact info (optional)'}</label>
                    <input
                      type="text"
                      placeholder={isAr ? 'إيميل أو رقم هاتف' : 'Email or phone'}
                      value={newReferrer.contact}
                      onChange={(e) => setNewReferrer({ ...newReferrer, contact: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none font-medium text-xs"
                    />
                  </div>
                  {referralError && (
                    <p className="text-xs text-rose-600 font-bold">{referralError}</p>
                  )}
                  <button
                    type="submit"
                    disabled={creatingReferral}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 transition-all"
                  >
                    <Plus size={16} />
                    <span>{creatingReferral ? (isAr ? 'جارٍ الإنشاء...' : 'Creating...') : (isAr ? 'إنشاء الرابط' : 'Create Link')}</span>
                  </button>
                </form>
              </div>

              {/* Total owed */}
              <div className="bg-[#121c42] text-white p-6 rounded-[2rem] shadow-sm flex flex-col justify-center items-center text-center space-y-2">
                <p className="text-xs font-bold text-indigo-300 uppercase tracking-wider">{isAr ? 'إجمالي العمولات المستحقة' : 'Total Commission Owed'}</p>
                <p className="text-4xl font-black">AED {totalCommissionAed.toLocaleString()}</p>
                <p className="text-xs text-slate-400 font-medium">
                  {isAr ? `عبر ${referredOrders.length} طلب مُحال مدفوع` : `across ${referredOrders.length} paid referred order(s)`}
                </p>
              </div>
            </div>

            {/* Referral codes + commission report */}
            <div className="bg-white border rounded-[2rem] shadow-sm overflow-hidden">
              <div className="p-6 border-b">
                <h3 className="font-extrabold text-slate-900 text-base">{isAr ? 'روابط الإحالة والعمولات' : 'Referral Links & Commissions'}</h3>
              </div>
              {loadingReferrals ? (
                <p className="p-6 text-sm text-slate-400 font-medium">{isAr ? 'جارٍ التحميل...' : 'Loading...'}</p>
              ) : referralCodes.length === 0 ? (
                <p className="p-6 text-sm text-slate-400 font-medium">{isAr ? 'لم يتم إنشاء أي رابط إحالة بعد.' : 'No referral links created yet.'}</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                      <tr>
                        <th className="text-start px-6 py-3">{isAr ? 'المحيل' : 'Referrer'}</th>
                        <th className="text-start px-6 py-3">{isAr ? 'الرابط' : 'Link'}</th>
                        <th className="text-start px-6 py-3">{isAr ? 'الطلبات المدفوعة' : 'Paid Orders'}</th>
                        <th className="text-start px-6 py-3">{isAr ? 'العمولة المستحقة' : 'Commission Owed'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {commissionByCode.map((rc) => {
                        const link = `${window.location.origin}/?ref=${rc.code}`;
                        return (
                          <tr key={rc.id}>
                            <td className="px-6 py-4">
                              <p className="font-bold text-slate-900">{rc.referrerName}</p>
                              {rc.referrerContact && <p className="text-xs text-slate-400">{rc.referrerContact}</p>}
                            </td>
                            <td className="px-6 py-4">
                              <button
                                onClick={() => navigator.clipboard.writeText(link)}
                                className="flex items-center gap-1.5 text-xs font-mono text-indigo-600 hover:text-indigo-700"
                                title={link}
                              >
                                <Copy size={12} />
                                <span>{rc.code}</span>
                              </button>
                            </td>
                            <td className="px-6 py-4 text-sm font-bold text-slate-700">{rc.orderCount}</td>
                            <td className="px-6 py-4 text-sm font-black text-emerald-600">AED {rc.commissionAed.toLocaleString()}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
              {unknownCodes.length > 0 && (
                <div className="p-6 border-t bg-amber-50 text-xs text-amber-700 font-medium">
                  {isAr ? 'أكواد ظهرت في طلبات مدفوعة لكنها ليست مسجلة في القائمة أعلاه: ' : 'Codes seen on paid orders but not in the list above: '}
                  {unknownCodes.join(', ')}
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {selectedRequest && (
        <RequestDetailModal
          request={selectedRequest}
          lang={lang}
          isAdmin={true}
          onClose={() => setSelectedRequest(null)}
        />
      )}
    </div>
  );
};

export default AdminPanel;
