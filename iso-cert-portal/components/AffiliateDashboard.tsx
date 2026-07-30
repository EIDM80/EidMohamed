import React, { useState, useEffect } from 'react';
import { LogOut, Copy, Check, Users, Wallet, Globe, Languages } from 'lucide-react';
import Logo from './Logo';
import { Language, LANGUAGE_NAMES } from '../translations';
import { fetchMyReferralCode, fetchMyReferredOrders, ReferralCode, MyReferredOrder } from '../lib/db';

const COMMISSION_AED = 500;

interface AffiliateDashboardProps {
  lang: Language;
  onSetLang: (lang: Language) => void;
  onLogout: () => void;
  onViewPublicSite: () => void;
}

const AffiliateDashboard: React.FC<AffiliateDashboardProps> = ({ lang, onSetLang, onLogout, onViewPublicSite }) => {
  const isAr = lang === 'ar';
  const [referral, setReferral] = useState<ReferralCode | null>(null);
  const [orders, setOrders] = useState<MyReferredOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    Promise.all([fetchMyReferralCode(), fetchMyReferredOrders()]).then(([code, referredOrders]) => {
      setReferral(code);
      setOrders(referredOrders);
      setLoading(false);
    });
  }, []);

  const link = referral ? `${window.location.origin}/?ref=${referral.code}` : '';
  const commission = orders.length * COMMISSION_AED;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="h-16 bg-white border-b flex items-center justify-between px-4 md:px-8 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center shrink-0 overflow-hidden p-1">
            <Logo size={28} color="white" />
          </div>
          <div>
            <h1 className="font-bold text-slate-900 leading-none text-sm">{isAr ? 'لوحة الشريك' : 'Affiliate Dashboard'}</h1>
            <span className="text-[10px] text-slate-500 uppercase font-semibold tracking-wider">GAMC Global Solutions</span>
          </div>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          <button
            onClick={onViewPublicSite}
            className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold transition-all shadow-sm border border-indigo-100"
          >
            <Globe size={14} />
            <span className="hidden md:inline">{isAr ? 'الموقع العام' : 'Public Website'}</span>
          </button>
          <div className="relative flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 rounded-lg text-xs font-bold transition-all">
            <Languages size={16} className="pointer-events-none" />
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
          <button onClick={onLogout} className="flex items-center gap-2 px-3 py-1.5 text-slate-500 hover:text-rose-600 rounded-lg text-xs font-bold transition-all">
            <LogOut size={16} />
            <span className="hidden md:inline">{isAr ? 'تسجيل الخروج' : 'Logout'}</span>
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-4 md:p-8 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            {isAr ? `مرحباً، ${referral?.referrerName ?? ''}` : `Welcome, ${referral?.referrerName ?? ''}`}
          </h2>
          <p className="text-slate-500 mt-1">
            {isAr
              ? 'شارك رابطك واحصل على AED 500 عن كل عميل يكمل الدفع من خلاله.'
              : "Share your link and earn AED 500 for every client who completes payment through it."}
          </p>
        </div>

        {loading ? (
          <div className="text-center py-16 text-slate-400 text-sm">{isAr ? 'جارٍ التحميل...' : 'Loading...'}</div>
        ) : !referral ? (
          <div className="bg-white border rounded-3xl p-8 text-center text-slate-500">
            {isAr ? 'تعذر العثور على بيانات الإحالة الخاصة بك.' : 'Could not find your referral data.'}
          </div>
        ) : (
          <>
            <div className="bg-white border rounded-3xl p-6 shadow-sm">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                {isAr ? 'رابط الإحالة الخاص بك' : 'Your Referral Link'}
              </p>
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-3">
                <span className="flex-1 text-sm font-mono text-slate-700 truncate">{link}</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(link);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all"
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copied ? (isAr ? 'تم النسخ' : 'Copied') : (isAr ? 'نسخ' : 'Copy')}</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white border rounded-3xl p-6 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <Users size={24} />
                </div>
                <div>
                  <p className="text-2xl font-black text-slate-900">{orders.length}</p>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {isAr ? 'عملاء تمت إحالتهم' : 'Referred Clients'}
                  </p>
                </div>
              </div>
              <div className="bg-white border rounded-3xl p-6 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Wallet size={24} />
                </div>
                <div>
                  <p className="text-2xl font-black text-slate-900">AED {commission.toLocaleString()}</p>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {isAr ? 'إجمالي العمولة' : 'Total Commission'}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border rounded-3xl overflow-hidden shadow-sm">
              <div className="p-6 border-b">
                <h3 className="font-bold text-slate-900 text-base">{isAr ? 'العملاء المُحالون' : 'Referred Clients'}</h3>
              </div>
              {orders.length === 0 ? (
                <div className="p-12 text-center text-slate-400 text-sm">
                  {isAr ? 'لا توجد إحالات بعد — شارك رابطك لتبدأ!' : 'No referrals yet — share your link to get started!'}
                </div>
              ) : (
                <table className={`w-full ${isAr ? 'text-right' : 'text-left'} border-collapse`}>
                  <thead>
                    <tr className="bg-slate-50 border-b text-slate-500">
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">{isAr ? 'الشركة' : 'Company'}</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">{isAr ? 'التاريخ' : 'Date'}</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">{isAr ? 'العمولة' : 'Commission'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y text-slate-700">
                    {orders.map((o) => (
                      <tr key={o.id}>
                        <td className="px-6 py-4 text-sm font-semibold">{o.companyName}</td>
                        <td className="px-6 py-4 text-sm text-slate-500">
                          {new Date(o.createdAt).toLocaleDateString(isAr ? 'ar' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="px-6 py-4 text-sm font-black text-emerald-600">AED {COMMISSION_AED}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default AffiliateDashboard;
