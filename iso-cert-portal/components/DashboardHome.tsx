
import React, { useMemo } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  TrendingUp,
  Plus,
  ArrowRight,
  ArrowLeft,
  Inbox,
  ShieldCheck
} from 'lucide-react';
import { RequestStatus, ISORequest } from '../types';
import { Language } from '../translations';
import { toUsd, formatMoney } from '../lib/pricing';

interface DashboardHomeProps {
  lang: Language;
  t: (key: any) => string;
  requests: ISORequest[];
  companyName?: string;
  onNavigate?: (tab: string) => void;
}

const STATUS_META: Record<RequestStatus, { color: string; dot: string }> = {
  [RequestStatus.DRAFT]: { color: 'text-slate-500 bg-slate-100', dot: 'bg-slate-400' },
  [RequestStatus.SUBMITTED]: { color: 'text-indigo-600 bg-indigo-50', dot: 'bg-indigo-500' },
  [RequestStatus.UNDER_REVIEW]: { color: 'text-blue-600 bg-blue-50', dot: 'bg-blue-500' },
  [RequestStatus.MISSING_DOCS]: { color: 'text-rose-600 bg-rose-50', dot: 'bg-rose-500' },
  [RequestStatus.IN_PROGRESS]: { color: 'text-amber-600 bg-amber-50', dot: 'bg-amber-500' },
  [RequestStatus.APPROVED]: { color: 'text-emerald-600 bg-emerald-50', dot: 'bg-emerald-500' },
  [RequestStatus.REJECTED]: { color: 'text-red-600 bg-red-50', dot: 'bg-red-500' },
  [RequestStatus.CERTIFIED]: { color: 'text-emerald-700 bg-emerald-100', dot: 'bg-emerald-600' },
};

const StatCard = ({ title, value, subtext, icon: Icon, color, lang }: any) => (
  <div className="group bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
    <div className={`flex items-start justify-between ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
      <div className={lang === 'ar' ? 'text-right' : 'text-left'}>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{title}</p>
        <h3 className="text-3xl font-black text-slate-900 tracking-tight">{value}</h3>
      </div>
      <div className={`w-11 h-11 rounded-xl ${color} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}>
        <Icon size={20} />
      </div>
    </div>
    {subtext && (
      <p className={`text-xs text-slate-400 font-medium mt-3 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{subtext}</p>
    )}
  </div>
);

const DashboardHome: React.FC<DashboardHomeProps> = ({ lang, t, requests, companyName, onNavigate }) => {
  const isAr = lang === 'ar';

  const activeRequests = requests.filter(r => r.status !== RequestStatus.CERTIFIED && r.status !== RequestStatus.REJECTED);
  const certifiedCount = requests.filter(r => r.status === RequestStatus.CERTIFIED).length;
  const pendingDocs = requests.filter(r => r.status === RequestStatus.MISSING_DOCS).length;
  const totalUsd = requests.reduce((sum, r) => sum + toUsd(r.amount || 0, r.currency ?? 'usd'), 0);

  // Real submission history for the last 6 months, grouped from actual
  // requests — no placeholder numbers.
  const monthlyData = useMemo(() => {
    const now = new Date();
    const buckets = Array.from({ length: 6 }).map((_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      return {
        key: `${d.getFullYear()}-${d.getMonth()}`,
        name: d.toLocaleDateString(isAr ? 'ar' : 'en-US', { month: 'short' }),
        submitted: 0,
        certified: 0,
      };
    });
    requests.forEach(r => {
      const d = new Date(r.createdAt);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      const bucket = buckets.find(b => b.key === key);
      if (bucket) {
        bucket.submitted += 1;
        if (r.status === RequestStatus.CERTIFIED) bucket.certified += 1;
      }
    });
    return buckets;
  }, [requests, isAr]);

  const hasActivity = requests.length > 0;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Hero / Welcome band */}
      <div className={`relative overflow-hidden bg-[#0a1128] rounded-3xl p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 ${isAr ? 'md:flex-row-reverse text-right' : ''}`}>
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl" />
        <div className="relative z-10 max-w-xl">
          <p className="text-indigo-300 text-xs font-bold uppercase tracking-widest mb-2">
            {isAr ? 'نظرة عامة' : 'Overview'}
          </p>
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            {t('welcome')}{companyName ? `, ${companyName}` : ''}
          </h2>
          <p className="text-slate-400 mt-2 text-sm md:text-base">
            {isAr ? 'إليك نظرة على حالة شهاداتك اليوم.' : "Here's what's happening with your certifications today."}
          </p>
        </div>
        <button
          onClick={() => onNavigate?.('new-request')}
          className={`relative z-10 shrink-0 flex items-center gap-2 px-6 py-3.5 bg-white hover:bg-slate-100 text-[#0a1128] font-bold rounded-xl shadow-lg transition-all active:scale-[0.98] ${isAr ? 'flex-row-reverse' : ''}`}
        >
          <Plus size={18} />
          <span>{isAr ? 'طلب شهادة جديدة' : 'Start New Request'}</span>
        </button>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title={t('activeRequests')}
          value={activeRequests.length}
          subtext={pendingDocs > 0 ? (isAr ? `${pendingDocs} بحاجة لمستندات` : `${pendingDocs} need documents`) : (isAr ? 'كل شيء على المسار الصحيح' : 'All on track')}
          icon={Clock}
          color="bg-amber-50 text-amber-600"
          lang={lang}
        />
        <StatCard
          title={t('certifiedLabels')}
          value={certifiedCount}
          subtext={isAr ? 'شهادات صادرة بنجاح' : 'Successfully issued'}
          icon={CheckCircle2}
          color="bg-emerald-50 text-emerald-600"
          lang={lang}
        />
        <StatCard
          title={t('actionRequired')}
          value={pendingDocs}
          subtext={pendingDocs > 0 ? (isAr ? 'يتطلب اهتمامك' : 'Needs your attention') : (isAr ? 'لا يوجد إجراء مطلوب' : 'Nothing pending')}
          icon={AlertCircle}
          color="bg-rose-50 text-rose-600"
          lang={lang}
        />
        <StatCard
          title={t('totalInvoices')}
          value={`$${totalUsd.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
          subtext={isAr ? `عبر ${requests.length} طلب` : `Across ${requests.length} request${requests.length === 1 ? '' : 's'}`}
          icon={FileText}
          color="bg-indigo-50 text-indigo-600"
          lang={lang}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Velocity chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className={`flex items-center justify-between mb-8 ${isAr ? 'flex-row-reverse' : ''}`}>
            <div className={isAr ? 'text-right' : 'text-left'}>
              <h3 className="text-lg font-bold text-slate-900">{t('velocity')}</h3>
              <p className="text-sm text-slate-500">{isAr ? 'متابعة تقديم طلبات ISO شهرياً' : 'Tracking monthly ISO request submissions'}</p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-lg text-xs font-semibold text-slate-600 shrink-0">
              <TrendingUp size={14} />
              {isAr ? 'آخر 6 أشهر' : 'Last 6 Months'}
            </div>
          </div>

          {hasActivity ? (
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData}>
                  <defs>
                    <linearGradient id="colorSubmitted" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorCertified" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    reversed={isAr}
                  />
                  <YAxis
                    orientation={isAr ? 'right' : 'left'}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                    tick={{ fill: '#64748b', fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', textAlign: isAr ? 'right' : 'left' }}
                  />
                  <Legend
                    content={() => (
                      <div className={`flex items-center justify-center gap-6 text-xs font-semibold mt-2 ${isAr ? 'flex-row-reverse' : ''}`}>
                        <span className="flex items-center gap-1.5 text-indigo-600">
                          <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 shrink-0" />
                          {isAr ? 'الطلبات' : 'Submitted'}
                        </span>
                        <span className="flex items-center gap-1.5 text-emerald-600">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                          {isAr ? 'المعتمدة' : 'Certified'}
                        </span>
                      </div>
                    )}
                  />
                  <Area type="monotone" dataKey="submitted" name="submitted" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorSubmitted)" />
                  <Area type="monotone" dataKey="certified" name="certified" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorCertified)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[300px] flex flex-col items-center justify-center text-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300">
                <TrendingUp size={28} />
              </div>
              <p className="text-sm text-slate-400 font-medium max-w-xs">
                {isAr ? 'ستظهر هنا سرعة تقديم الطلبات بمجرد إرسال طلبك الأول.' : 'Your submission activity will appear here once you submit your first request.'}
              </p>
            </div>
          )}
        </div>

        {/* Recent activity */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col">
          <h3 className={`text-lg font-bold text-slate-900 mb-6 ${isAr ? 'text-right' : 'text-left'}`}>{t('recentActivity')}</h3>

          {!hasActivity ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center gap-3 py-8">
              <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300">
                <Inbox size={26} />
              </div>
              <p className="text-sm text-slate-400 font-medium max-w-[220px]">
                {isAr ? 'لا يوجد نشاط بعد. ابدأ أول طلب شهادة ISO الآن.' : 'No activity yet. Start your first ISO request now.'}
              </p>
              <button
                onClick={() => onNavigate?.('new-request')}
                className="mt-2 text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
              >
                {isAr ? 'ابدأ الآن' : 'Get started'}
                {isAr ? <ArrowLeft size={14} /> : <ArrowRight size={14} />}
              </button>
            </div>
          ) : (
            <div className="space-y-5 flex-1">
              {requests.slice(0, 5).map((req, idx) => {
                const meta = STATUS_META[req.status] ?? STATUS_META[RequestStatus.SUBMITTED];
                return (
                  <div key={req.id ?? idx} className={`flex gap-3 ${isAr ? 'flex-row-reverse text-right' : ''}`}>
                    <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${meta.dot}`} />
                    <div className="min-w-0 flex-1">
                      <div className={`flex items-center justify-between gap-2 ${isAr ? 'flex-row-reverse' : ''}`}>
                        <p className="text-sm font-semibold text-slate-900 truncate">
                          {req.standards[0]?.code}{req.standards.length > 1 ? ` +${req.standards.length - 1}` : ''}
                        </p>
                        <span className={`shrink-0 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${meta.color}`}>
                          {req.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {formatMoney(req.amount, req.currency ?? 'usd')} · {req.accreditationBody.match(/\(([^)]+)\)/)?.[1] ?? req.accreditationBody}
                      </p>
                      <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                        {new Date(req.createdAt).toLocaleDateString(isAr ? 'ar' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <button
            onClick={() => onNavigate?.('requests')}
            className="w-full mt-6 py-2.5 text-sm font-semibold text-indigo-600 border border-indigo-100 rounded-xl hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2"
          >
            <ShieldCheck size={14} />
            {isAr ? 'عرض كافة الطلبات' : 'View All Requests'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
