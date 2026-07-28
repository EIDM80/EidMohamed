
import React, { useState, useEffect } from 'react';
import {
  Check,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  FileCheck,
  CreditCard,
  CloudUpload,
  Info,
  Sparkles,
  Search as SearchIcon,
  Loader2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { ISO_STANDARDS } from '../constants';
import { AccreditationBody, ISOStandard } from '../types';
import { summarizeRequirements } from '../geminiService';
import { Language } from '../translations';
import { startCheckout } from '../lib/db';
import { AED_PER_USD, Currency } from '../lib/pricing';

interface NewRequestProps {
  lang: Language;
  t: (key: any) => string;
  preselectedISO?: string | null;
  onClearPreselectedISO?: () => void;
  companyId?: string | null;
}

const NewRequest: React.FC<NewRequestProps> = ({ lang, t, preselectedISO, onClearPreselectedISO, companyId }) => {
  const [step, setStep] = useState(1);
  const [type, setType] = useState<'single' | 'multi'>('single');
  const [selectedBody, setSelectedBody] = useState<AccreditationBody>(AccreditationBody.UKAS);
  const [bodySearch, setBodySearch] = useState('');
  const [standardSearch, setStandardSearch] = useState('');
  const [selectedStandards, setSelectedStandards] = useState<ISOStandard[]>([]);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [currency, setCurrency] = useState<Currency>(lang === 'ar' ? 'aed' : 'usd');

  useEffect(() => {
    if (preselectedISO) {
      const found = ISO_STANDARDS.find(s => s.code.toLowerCase() === preselectedISO.toLowerCase());
      if (found) {
        setSelectedStandards([found]);
        setType('single');
        setStep(3); // Go straight to step 3 so the preselected ISO is clearly shown and highlighted
      }
      if (onClearPreselectedISO) {
        onClearPreselectedISO();
      }
    }
  }, [preselectedISO, onClearPreselectedISO]);

  useEffect(() => {
    if (step === 4 && selectedStandards.length > 0) {
      setLoadingAi(true);
      summarizeRequirements(selectedStandards.map(s => s.code), selectedBody)
        .then(res => {
          setAiSummary(res);
          setLoadingAi(false);
        })
        .catch(() => {
          setAiSummary("Error generating AI summary.");
          setLoadingAi(false);
        });
    }
  }, [step, selectedStandards, selectedBody]);

  const toggleStandard = (std: ISOStandard) => {
    if (type === 'single') {
      setSelectedStandards([std]);
    } else {
      if (selectedStandards.find(s => s.id === std.id)) {
        setSelectedStandards(selectedStandards.filter(s => s.id !== std.id));
      } else {
        setSelectedStandards([...selectedStandards, std]);
      }
    }
  };

  const calculateSubtotal = () => {
    return selectedStandards.reduce((acc, curr) => acc + curr.basePrice, 0);
  };

  const calculateDiscount = () => {
    if (type === 'multi' && selectedStandards.length > 1) {
      return calculateSubtotal() * 0.15; // 15% discount
    }
    return 0;
  };

  const calculateTotal = () => {
    return calculateSubtotal() - calculateDiscount();
  };

  const formatAmount = (usdAmount: number) => {
    if (currency === 'aed') {
      return `AED ${(usdAmount * AED_PER_USD).toFixed(2)}`;
    }
    return `$${usdAmount.toFixed(2)}`;
  };

  const handleSubmitRequest = async () => {
    if (!companyId) {
      setSubmitError(lang === 'ar' ? 'لم يتم العثور على ملف الشركة. يرجى إعادة تسجيل الدخول.' : 'No company profile found. Please sign in again.');
      return;
    }
    setSubmitting(true);
    setSubmitError(null);
    const result = await startCheckout({
      companyId,
      type,
      accreditationBody: selectedBody,
      standardIds: selectedStandards.map(s => s.id),
      currency,
    });
    if ('error' in result) {
      setSubmitting(false);
      setSubmitError(
        lang === 'ar'
          ? 'تعذر بدء عملية الدفع. حاول مرة أخرى.'
          : 'Could not start the payment process. Please try again.'
      );
      return;
    }
    // Leaving the page for Stripe Checkout — no need to clear `submitting`.
    window.location.href = result.url;
  };

  const steps = [
    { id: 1, label: t('stepLabelType'), icon: ShieldCheck },
    { id: 2, label: t('stepAccreditation'), icon: Check },
    { id: 3, label: t('stepStandards'), icon: FileCheck },
    { id: 4, label: t('stepDocuments'), icon: CloudUpload },
    { id: 5, label: t('stepReview'), icon: CreditCard },
  ];

  const filteredBodies = Object.values(AccreditationBody).filter(body => 
    body.toLowerCase().includes(bodySearch.toLowerCase())
  );

  const filteredStandards = ISO_STANDARDS.filter(std => 
    std.code.toLowerCase().includes(standardSearch.toLowerCase()) ||
    std.title.toLowerCase().includes(standardSearch.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-slate-900 text-center mb-8">{t('newRequest')}</h2>
        <div className="flex items-center justify-between relative px-4">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -z-10" />
          {steps.map((s) => (
            <div key={s.id} className="flex flex-col items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                step >= s.id ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-200 text-slate-400'
              }`}>
                {step > s.id ? <CheckCircle2 size={20} /> : <s.icon size={20} />}
              </div>
              <span className={`text-[10px] md:text-xs font-semibold ${step >= s.id ? 'text-indigo-600' : 'text-slate-400'}`}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-3xl border shadow-xl p-6 md:p-8 min-h-[500px] flex flex-col">
        {step === 1 && (
          <div className="space-y-6 flex-1">
            <h3 className="text-xl font-bold text-slate-900">{t('selectType')}</h3>
            <p className="text-slate-500">{lang === 'ar' ? 'هل تود التقديم لمعيار واحد أم حزمة معايير متعددة؟' : 'Would you like to apply for a single standard or bundle multiple labels?'}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <button 
                onClick={() => setType('single')}
                className={`p-6 rounded-2xl border-2 text-right transition-all flex flex-col items-start ${
                  type === 'single' ? 'border-indigo-600 bg-indigo-50' : 'border-slate-100 hover:border-indigo-200'
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center mb-4 text-indigo-600">
                  <ShieldCheck size={24} />
                </div>
                <h4 className="font-bold text-slate-900 text-lg">{t('singleLabel')}</h4>
                <p className="text-sm text-slate-500 mt-2 text-start">{lang === 'ar' ? 'مثالي للشركات التي تركز على معيار إدارة محدد.' : 'Perfect for companies focusing on one specific management standard.'}</p>
              </button>
              <button 
                onClick={() => setType('multi')}
                className={`p-6 rounded-2xl border-2 text-right transition-all flex flex-col items-start ${
                  type === 'multi' ? 'border-indigo-600 bg-indigo-50' : 'border-slate-100 hover:border-indigo-200'
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center mb-4 text-indigo-600">
                  <Sparkles size={24} />
                </div>
                <h4 className="font-bold text-slate-900 text-lg">{t('multiLabel')}</h4>
                <p className="text-sm text-slate-500 mt-2 text-start">{lang === 'ar' ? 'اجمع بين عدة معايير ISO بسعر مخفض وتدقيق موحد.' : 'Combine multiple ISO standards for a discounted price and unified audit.'}</p>
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 flex-1">
            <h3 className="text-xl font-bold text-slate-900">{lang === 'ar' ? 'اختر هيئة الاعتماد' : 'Choose Accreditation Body'}</h3>
            <div className="relative mb-4">
              <SearchIcon className={`absolute ${lang === 'ar' ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-slate-400`} size={18} />
              <input 
                type="text"
                placeholder={lang === 'ar' ? 'ابحث عن هيئة الاعتماد...' : 'Search accreditation body...'}
                className={`w-full ${lang === 'ar' ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all`}
                value={bodySearch}
                onChange={(e) => setBodySearch(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 gap-2 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
              {filteredBodies.map((body) => (
                <button
                  key={body}
                  onClick={() => setSelectedBody(body as AccreditationBody)}
                  className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                    selectedBody === body ? 'border-indigo-600 bg-indigo-50' : 'border-slate-100 hover:border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${selectedBody === body ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                      <ShieldCheck size={16} />
                    </div>
                    <span className="text-sm font-semibold text-slate-900 text-start">{body}</span>
                  </div>
                  {selectedBody === body && <Check className="text-indigo-600" size={18} />}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900">{lang === 'ar' ? 'اختر معايير ISO' : 'Select ISO Standards'}</h3>
              <div className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold uppercase">
                {type === 'single' ? t('singleLabel') : t('multiLabel')}
              </div>
            </div>
            
            <div className="relative mb-4">
              <SearchIcon className={`absolute ${lang === 'ar' ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-slate-400`} size={18} />
              <input 
                type="text"
                placeholder={lang === 'ar' ? 'ابحث بالاسم أو الكود (مثل 9001)...' : 'Search by name or code (e.g., 9001)...'}
                className={`w-full ${lang === 'ar' ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all`}
                value={standardSearch}
                onChange={(e) => setStandardSearch(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar p-1">
              {filteredStandards.map((std) => {
                const isSelected = selectedStandards.some(s => s.id === std.id);
                return (
                  <button
                    key={std.id}
                    onClick={() => toggleStandard(std)}
                    className={`p-4 rounded-xl border-2 transition-all text-start flex flex-col justify-between ${
                      isSelected ? 'border-indigo-600 bg-indigo-50 shadow-md' : 'border-slate-100 hover:border-indigo-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-indigo-600">{std.code}</span>
                        {isSelected && <CheckCircle2 className="text-indigo-600" size={16} />}
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm mb-1">{std.title}</h4>
                      <p className="text-[10px] text-slate-500 line-clamp-2">{std.description}</p>
                    </div>
                    <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-100">
                      <span className="text-xs font-bold text-slate-900">${std.basePrice}</span>
                      <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">{lang === 'ar' ? 'رسوم أساسية' : 'Base Fee'}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6 flex-1">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="text-indigo-600" size={24} />
              {lang === 'ar' ? 'تحليل المتطلبات بالذكاء الاصطناعي' : 'AI Requirement Analysis'}
            </h3>
            
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
              {loadingAi ? (
                <div className="flex flex-col items-center justify-center py-12 gap-4">
                  <Loader2 className="animate-spin text-indigo-600" size={32} />
                  <p className="text-sm font-medium text-slate-500 italic animate-pulse">
                    {lang === 'ar' ? 'يقوم محرك Gemini بتحليل المعايير لهيئة الاعتماد...' : 'Gemini is analyzing standards for the selected accreditation body...'}
                  </p>
                </div>
              ) : (
                <div className="prose prose-sm max-w-none text-slate-700 whitespace-pre-wrap leading-relaxed">
                  {aiSummary}
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-slate-900 text-sm">{lang === 'ar' ? 'المستندات المطلوبة (المرفقات)' : 'Required Documents (Attachments)'}</h4>
              <div className="grid grid-cols-1 gap-3">
                {['Quality Manual', 'Risk Assessment', 'Organization Chart'].map((doc, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-white border-2 border-dashed border-slate-200 rounded-xl hover:border-indigo-400 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <CloudUpload className="text-slate-400 group-hover:text-indigo-600" size={20} />
                      <span className="text-sm font-medium text-slate-600">{doc}</span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest group-hover:text-indigo-600">
                      {lang === 'ar' ? 'انقر للرفع' : 'Click to upload'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-8 flex-1">
            <h3 className="text-xl font-bold text-slate-900">{lang === 'ar' ? 'مراجعة الطلب' : 'Application Review'}</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">{lang === 'ar' ? 'الهيئة والنوع' : 'Body & Type'}</h4>
                  <div className="bg-slate-50 p-4 rounded-xl border">
                    <p className="text-sm font-bold text-slate-900">{selectedBody}</p>
                    <p className="text-xs text-indigo-600 font-bold mt-1 uppercase">{type === 'single' ? t('singleLabel') : t('multiLabel')}</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">{lang === 'ar' ? 'المعايير المختارة' : 'Selected Standards'}</h4>
                  <div className="space-y-2">
                    {selectedStandards.map(s => (
                      <div key={s.id} className="flex justify-between items-center p-3 bg-white border rounded-lg">
                        <span className="text-sm font-bold text-slate-700">{s.code}</span>
                        <span className="text-sm text-slate-500">${s.basePrice}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-indigo-50/50 p-8 rounded-3xl border border-indigo-100 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="text-lg font-bold text-slate-900">{lang === 'ar' ? 'ملخص التكاليف' : 'Fee Breakdown'}</h4>
                    <div className="flex bg-white rounded-lg border border-indigo-200 p-0.5 text-xs font-bold">
                      <button
                        type="button"
                        onClick={() => setCurrency('usd')}
                        className={`px-3 py-1.5 rounded-md transition-all ${currency === 'usd' ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}
                      >
                        USD
                      </button>
                      <button
                        type="button"
                        onClick={() => setCurrency('aed')}
                        className={`px-3 py-1.5 rounded-md transition-all ${currency === 'aed' ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}
                      >
                        AED
                      </button>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">{lang === 'ar' ? 'المجموع الفرعي' : 'Subtotal'}</span>
                      <span className="font-bold text-slate-900">{formatAmount(calculateSubtotal())}</span>
                    </div>
                    {calculateDiscount() > 0 && (
                      <div className="flex justify-between text-sm text-emerald-600 font-bold">
                        <span>{lang === 'ar' ? 'خصم الحزمة (15%)' : 'Bundle Discount (15%)'}</span>
                        <span>-{formatAmount(calculateDiscount())}</span>
                      </div>
                    )}
                    <div className="h-px bg-indigo-100 my-4" />
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-slate-900">{lang === 'ar' ? 'الإجمالي' : 'Total Amount'}</span>
                      <span className="text-2xl font-black text-indigo-600">{formatAmount(calculateTotal())}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex items-start gap-3 p-4 bg-white/60 rounded-xl border border-indigo-100 text-[10px] text-indigo-800 leading-relaxed">
                  <Info size={16} className="shrink-0" />
                  <p>{lang === 'ar' ? 'هذا السعر يشمل المراجعة الأولية وشهادة رقمية آمنة. قد يتم تطبيق رسوم تدقيق الموقع الإضافية بناءً على حجم الشركة.' : 'This price includes initial review and secure digital certification. Additional onsite audit fees may apply based on company size.'}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {submitError && (
          <div className="mt-6 flex items-start gap-2 p-3 bg-rose-50 border border-rose-200 rounded-xl text-sm text-rose-700">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <span>{submitError}</span>
          </div>
        )}

        <div className="mt-12 flex justify-between gap-4">
          <button
            disabled={step === 1 || submitting}
            onClick={() => setStep(step - 1)}
            className={`flex items-center gap-2 px-6 py-3 text-slate-600 font-semibold hover:bg-slate-50 rounded-xl disabled:opacity-30 transition-all ${lang === 'ar' ? 'flex-row-reverse' : ''}`}
          >
            {lang === 'ar' ? <ArrowRight size={20} /> : <ArrowLeft size={20} />}
            {t('back')}
          </button>

          <button
            onClick={() => {
              if (step < 5) setStep(step + 1);
              else handleSubmitRequest();
            }}
            disabled={(selectedStandards.length === 0 && step === 3) || submitting}
            className={`flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all disabled:opacity-50 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}
          >
            {submitting ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <>
                {step === 5 ? t('payAndSubmit') : t('continue')}
                {step < 5 && (lang === 'ar' ? <ArrowLeft size={20} /> : <ArrowRight size={20} />)}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewRequest;
