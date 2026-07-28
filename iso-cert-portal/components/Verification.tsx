
import React, { useState } from 'react';
import { ShieldCheck, Search, Building2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Language } from '../translations';

interface VerificationProps {
  lang: Language;
  t: (key: any) => string;
}

const Verification: React.FC<VerificationProps> = ({ lang, t }) => {
  const [certNo, setCertNo] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleVerify = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      if (certNo === 'ISO-9001-ACME') {
        setResult({
          company: 'Acme International Ltd',
          standard: 'ISO 9001:2015',
          issued: 'Nov 15, 2023',
          expires: 'Nov 14, 2026',
          status: 'Active',
          body: 'UKAS Accreditation'
        });
      } else {
        setResult('not_found');
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="max-w-3xl mx-auto py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-12">
        <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-white shadow-xl shadow-indigo-100">
          <ShieldCheck size={32} />
        </div>
        <h2 className="text-3xl font-bold text-slate-900">{t('verification')}</h2>
        <p className="text-slate-500 mt-2">{lang === 'ar' ? 'تحقق من صحة شهادة ISO الصادرة.' : 'Validate the authenticity of an issued ISO certificate.'}</p>
      </div>

      <div className="bg-white p-8 rounded-3xl border shadow-xl">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className={`absolute ${lang === 'ar' ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-slate-400`} size={20} />
            <input 
              type="text" 
              placeholder={lang === 'ar' ? 'أدخل رقم الشهادة (مثلاً ISO-9001-ACME)' : "Enter Certificate Number (e.g. ISO-9001-ACME)"}
              className={`w-full ${lang === 'ar' ? 'pr-12 pl-4 text-right' : 'pl-12 pr-4 text-left'} py-4 bg-slate-50 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium`}
              value={certNo}
              onChange={(e) => setCertNo(e.target.value)}
            />
          </div>
          <button 
            onClick={handleVerify}
            disabled={!certNo || loading}
            className="px-8 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all disabled:opacity-50 shadow-lg shadow-indigo-100"
          >
            {loading ? (lang === 'ar' ? 'جاري التحقق...' : 'Verifying...') : (lang === 'ar' ? 'تحقق' : 'Verify')}
          </button>
        </div>

        {result === 'not_found' && (
          <div className="bg-rose-50 border border-rose-100 p-6 rounded-2xl flex gap-4 text-rose-700 animate-in zoom-in-95">
            <AlertCircle className="shrink-0" />
            <div className={lang === 'ar' ? 'text-right' : 'text-left'}>
              <p className="font-bold">{lang === 'ar' ? 'رقم شهادة غير صالح' : 'Invalid Certificate Number'}</p>
              <p className="text-sm mt-1">{lang === 'ar' ? 'لم نتمكن من العثور على شهادة صالحة بهذا الرقم. يرجى التأكد والمحاولة مرة أخرى.' : "We couldn't find a valid certificate matching that number. Please check for typos and try again."}</p>
            </div>
          </div>
        )}

        {result && result !== 'not_found' && (
          <div className="space-y-6 animate-in zoom-in-95">
            <div className="flex items-center gap-4 bg-emerald-50 p-6 rounded-2xl border border-emerald-100 text-emerald-700">
              <CheckCircle2 size={32} className="shrink-0" />
              <div className={lang === 'ar' ? 'text-right' : 'text-left'}>
                <p className="text-lg font-bold">{lang === 'ar' ? 'شهادة مصدقة' : 'Authenticated Certificate'}</p>
                <p className="text-sm opacity-90">{lang === 'ar' ? 'هذه الشهادة حقيقية وصالحة حالياً في سجلنا.' : 'This certificate is genuine and currently valid in our registry.'}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={`p-6 bg-slate-50 rounded-2xl border border-slate-100 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{lang === 'ar' ? 'الشركة المعتمدة' : 'Certified Company'}</p>
                <div className={`flex items-center gap-2 mt-2 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                  <Building2 size={20} className="text-slate-600" />
                  <span className="font-bold text-slate-900">{result.company}</span>
                </div>
              </div>
              <div className={`p-6 bg-slate-50 rounded-2xl border border-slate-100 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{lang === 'ar' ? 'معيار ISO' : 'ISO Standard'}</p>
                <p className="font-bold text-indigo-600 text-lg mt-2">{result.standard}</p>
              </div>
              <div className={`p-6 bg-slate-50 rounded-2xl border border-slate-100 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{lang === 'ar' ? 'تاريخ الإصدار' : 'Issue Date'}</p>
                <p className="font-semibold text-slate-900 mt-2">{result.issued}</p>
              </div>
              <div className={`p-6 bg-slate-50 rounded-2xl border border-slate-100 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{lang === 'ar' ? 'تاريخ الانتهاء' : 'Expiry Date'}</p>
                <p className="font-semibold text-slate-900 mt-2">{result.expires}</p>
              </div>
            </div>

            <div className={`flex items-center justify-between p-4 bg-indigo-50/50 rounded-2xl text-indigo-700 border border-indigo-100 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} />
                <span className="text-sm font-semibold">{result.body}</span>
              </div>
              <button className="text-xs font-bold hover:underline">{lang === 'ar' ? 'تحميل إثبات السجل' : 'Download Registry Proof'}</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Verification;
