
import React, { useState } from 'react';
import { ShieldCheck, Search, Building2, CheckCircle2, AlertCircle, ExternalLink } from 'lucide-react';
import { Language } from '../translations';
import { verifyCertificate, VerifiedCertificate } from '../lib/db';

interface VerificationProps {
  lang: Language;
  t: (key: any) => string;
}

const formatDate = (iso: string, lang: Language) =>
  new Date(iso).toLocaleDateString(lang === 'ar' ? 'ar' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' });

const Verification: React.FC<VerificationProps> = ({ lang, t }) => {
  const [certNo, setCertNo] = useState('');
  const [result, setResult] = useState<VerifiedCertificate | 'not_found' | null>(null);
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    setLoading(true);
    const found = await verifyCertificate(certNo.trim());
    setResult(found || 'not_found');
    setLoading(false);
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
              placeholder={lang === 'ar' ? 'أدخل رقم الشهادة كما هو مطبوع على شهادتك' : "Enter the Certificate No. printed on your certificate"}
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
            <div className={`flex items-center gap-4 p-6 rounded-2xl border ${result.active ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-amber-50 border-amber-100 text-amber-700'}`}>
              <CheckCircle2 size={32} className="shrink-0" />
              <div className={lang === 'ar' ? 'text-right' : 'text-left'}>
                <p className="text-lg font-bold">
                  {result.active
                    ? (lang === 'ar' ? 'شهادة مصدقة وسارية' : 'Authenticated & Active Certificate')
                    : (lang === 'ar' ? 'شهادة مصدقة لكنها غير سارية حالياً' : 'Authenticated Certificate — Currently Inactive')}
                </p>
                <p className="text-sm opacity-90">
                  {result.active
                    ? (lang === 'ar' ? 'هذه الشهادة حقيقية وصالحة حالياً في سجلنا.' : 'This certificate is genuine and currently valid in our registry.')
                    : (lang === 'ar' ? 'هذه الشهادة حقيقية لكن اشتراك التجديد الخاص بها متوقف حالياً.' : 'This certificate is genuine, but its renewal subscription is not currently active.')}
                </p>
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
                <p className="font-semibold text-slate-900 mt-2">{formatDate(result.issued, lang)}</p>
              </div>
              <div className={`p-6 bg-slate-50 rounded-2xl border border-slate-100 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{lang === 'ar' ? 'تاريخ الانتهاء' : 'Expiry Date'}</p>
                <p className="font-semibold text-slate-900 mt-2">{formatDate(result.expires, lang)}</p>
              </div>
            </div>

            <div className={`flex items-center gap-2 p-4 bg-indigo-50/50 rounded-2xl text-indigo-700 border border-indigo-100 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
              <ShieldCheck size={18} className="shrink-0" />
              <span className="text-sm font-semibold">{result.body}</span>
            </div>
          </div>
        )}
      </div>

      {/* Outbound link to the official IAF CertSearch global registry — the
          authoritative source, independent of our own internal records. */}
      <div className="mt-6 bg-[#0b1021] p-6 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className={lang === 'ar' ? 'text-right' : 'text-left'}>
          <p className="text-white font-bold">{lang === 'ar' ? 'التحقق عبر السجل الرسمي العالمي' : 'Cross-check with the official global registry'}</p>
          <p className="text-slate-400 text-sm mt-1">
            {lang === 'ar'
              ? 'كل شهادة نصدرها عبر هيئة اعتماد معتمدة مدرجة أيضاً في IAF CertSearch.'
              : 'Every certificate we issue through an accredited body is also listed on IAF CertSearch.'}
          </p>
        </div>
        <a
          href="https://www.iafcertsearch.org"
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 inline-flex items-center gap-2 px-6 py-3 bg-white text-[#0b1021] font-bold rounded-2xl hover:bg-slate-100 transition-all whitespace-nowrap"
        >
          <span>{lang === 'ar' ? 'زيارة IAF CertSearch' : 'Visit IAF CertSearch'}</span>
          <ExternalLink size={16} />
        </a>
      </div>
    </div>
  );
};

export default Verification;
