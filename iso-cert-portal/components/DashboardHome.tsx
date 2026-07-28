
import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  FileText,
  ArrowUpRight,
  TrendingUp,
  ArrowDownLeft
} from 'lucide-react';
import { RequestStatus, ISORequest } from '../types';
import { Language } from '../translations';

interface DashboardHomeProps {
  lang: Language;
  t: (key: any) => string;
  requests: ISORequest[];
  companyName?: string;
}

const data = [
  { name: 'Jan', requests: 4, certifications: 2 },
  { name: 'Feb', requests: 7, certifications: 3 },
  { name: 'Mar', requests: 5, certifications: 4 },
  { name: 'Apr', requests: 9, certifications: 6 },
  { name: 'May', requests: 12, certifications: 8 },
  { name: 'Jun', requests: 8, certifications: 7 },
];

const StatCard = ({ title, value, icon: Icon, color, trend, lang }: any) => (
  <div className="bg-white p-6 rounded-2xl border shadow-sm flex items-center justify-between">
    <div className={lang === 'ar' ? 'text-right' : 'text-left'}>
      <p className="text-sm text-slate-500 font-medium mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
      {trend && (
        <div className="flex items-center gap-1 mt-2 text-xs font-semibold text-emerald-600">
          {lang === 'ar' ? <ArrowDownLeft size={14} /> : <ArrowUpRight size={14} />}
          <span>{trend}% {lang === 'ar' ? 'زيادة' : 'increase'}</span>
        </div>
      )}
    </div>
    <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center shrink-0`}>
      <Icon size={24} />
    </div>
  </div>
);

const DashboardHome: React.FC<DashboardHomeProps> = ({ lang, t, requests, companyName }) => {
  const activeRequests = requests.filter(r => r.status !== RequestStatus.CERTIFIED && r.status !== RequestStatus.REJECTED);
  const certifiedCount = requests.filter(r => r.status === RequestStatus.CERTIFIED).length;
  const pendingDocs = requests.filter(r => r.status === RequestStatus.MISSING_DOCS).length;
  const totalAmount = requests.reduce((sum, r) => sum + (r.amount || 0), 0);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">{t('welcome')}{companyName ? `, ${companyName}` : ''}</h2>
        <p className="text-slate-500">{lang === 'ar' ? 'إليك نظرة على حالة شهاداتك اليوم.' : "Here's what's happening with your certifications today."}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title={t('activeRequests')} 
          value={activeRequests.length} 
          icon={Clock} 
          color="bg-amber-50 text-amber-600" 
          trend="12"
          lang={lang}
        />
        <StatCard 
          title={t('certifiedLabels')} 
          value={certifiedCount} 
          icon={CheckCircle2} 
          color="bg-emerald-50 text-emerald-600" 
          lang={lang}
        />
        <StatCard 
          title={t('actionRequired')} 
          value={pendingDocs} 
          icon={AlertCircle} 
          color="bg-rose-50 text-rose-600" 
          lang={lang}
        />
        <StatCard
          title={t('totalInvoices')}
          value={`$${totalAmount.toLocaleString()}`}
          icon={FileText}
          color="bg-indigo-50 text-indigo-600"
          lang={lang}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-slate-900">{t('velocity')}</h3>
              <p className="text-sm text-slate-500">{lang === 'ar' ? 'متابعة تقديم طلبات ISO شهرياً' : 'Tracking monthly ISO request submissions'}</p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-lg text-xs font-semibold text-slate-600">
              <TrendingUp size={14} />
              {lang === 'ar' ? 'آخر 6 أشهر' : 'Last 6 Months'}
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#64748b', fontSize: 12}} 
                  reversed={lang === 'ar'}
                />
                <YAxis 
                  orientation={lang === 'ar' ? 'right' : 'left'} 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#64748b', fontSize: 12}} 
                />
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', textAlign: lang === 'ar' ? 'right' : 'left'}}
                />
                <Area type="monotone" dataKey="requests" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorRequests)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6">{t('recentActivity')}</h3>
          <div className="space-y-6">
            {requests.length === 0 && (
              <p className="text-sm text-slate-400">{lang === 'ar' ? 'لا يوجد نشاط بعد.' : 'No activity yet.'}</p>
            )}
            {requests.slice(0, 3).map((req, idx) => (
              <div key={req.id ?? idx} className="flex gap-4">
                <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${
                  req.status === RequestStatus.CERTIFIED ? 'bg-emerald-500' : 'bg-amber-500'
                }`} />
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {req.status === RequestStatus.CERTIFIED
                      ? (lang === 'ar' ? 'تم إصدار الشهادة' : 'Certificate Issued')
                      : (lang === 'ar' ? 'تم تحديث الحالة' : 'Status Updated')}
                  </p>
                  <p className="text-xs text-slate-500 mb-2">
                    {lang === 'ar' ? 'الطلب' : 'Request'} {req.id} {lang === 'ar' ? 'للمعيار' : 'for'} {req.standards[0]?.code}
                  </p>
                  <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                    {req.createdAt}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-8 py-2 text-sm font-semibold text-indigo-600 border border-indigo-100 rounded-xl hover:bg-indigo-50 transition-colors">
            {lang === 'ar' ? 'عرض كافة الأنشطة' : 'View All Activity'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
