
import React, { useState, useRef } from 'react';
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  Eye, 
  Download, 
  MessageSquare,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Loader2,
  X,
  Calendar,
  ChevronDown
} from 'lucide-react';
import { INITIAL_REQUESTS } from '../constants';
import { RequestStatus, ISORequest, AccreditationBody } from '../types';
import { generateMockCertificateContent } from '../geminiService';
import { Language } from '../translations';
import CertificateTemplate from './CertificateTemplate';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

interface MyRequestsProps {
  lang: Language;
  t: (key: any) => string;
}

const StatusBadge = ({ status }: { status: RequestStatus }) => {
  const styles: Record<RequestStatus, string> = {
    [RequestStatus.DRAFT]: 'bg-slate-100 text-slate-600',
    [RequestStatus.SUBMITTED]: 'bg-indigo-50 text-indigo-600',
    [RequestStatus.UNDER_REVIEW]: 'bg-blue-50 text-blue-600',
    [RequestStatus.MISSING_DOCS]: 'bg-rose-50 text-rose-600',
    [RequestStatus.IN_PROGRESS]: 'bg-amber-50 text-amber-600',
    [RequestStatus.APPROVED]: 'bg-emerald-50 text-emerald-600',
    [RequestStatus.REJECTED]: 'bg-red-50 text-red-600',
    [RequestStatus.CERTIFIED]: 'bg-emerald-100 text-emerald-700',
  };

  const Icons: Record<string, any> = {
    [RequestStatus.CERTIFIED]: CheckCircle2,
    [RequestStatus.SUBMITTED]: Clock,
    [RequestStatus.MISSING_DOCS]: AlertTriangle,
    [RequestStatus.REJECTED]: XCircle,
  };

  const Icon = Icons[status] || Clock;

  return (
    <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${styles[status]}`}>
      <Icon size={12} />
      {status}
    </span>
  );
};

const MyRequests: React.FC<MyRequestsProps> = ({ lang, t }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDownloading, setIsDownloading] = useState<string | null>(null);
  const [certData, setCertData] = useState<any>(null);
  const hiddenCertRef = useRef<HTMLDivElement>(null);
  
  // Filter States
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<RequestStatus | 'All'>('All');
  const [bodyFilter, setBodyFilter] = useState<AccreditationBody | 'All'>('All');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const handleDownload = async (req: any) => {
    setIsDownloading(req.id);
    
    try {
      // 1. Get AI Scope/Content
      const scopeContent = await generateMockCertificateContent(req.company.name, req.standards[0].code);
      
      // 2. Prepare Template Data - Dates based on "Paid/Created" date
      const templateData = {
        id: req.id,
        companyName: req.company.name,
        companyAddress: req.company.address,
        isoCode: req.standards[0].code,
        isoTitle: req.standards[0].title,
        issueDate: req.createdAt, // The day they "paid" (created)
        validityYears: 3, // Defaulting to standard 3-year cycle
        accreditationBody: req.accreditationBody,
        scope: scopeContent
      };
      
      setCertData(templateData);

      // 3. Wait for React to render the template off-screen
      setTimeout(async () => {
        if (!hiddenCertRef.current) return;

        const canvas = await html2canvas(hiddenCertRef.current, {
          scale: 2, // Higher scale for 300DPI quality
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff'
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`${req.company.name.replace(/\s/g, '_')}_${req.standards[0].code.replace(/\s/g, '_')}_Certificate.pdf`);
        
        setIsDownloading(null);
        setCertData(null);
      }, 500);

    } catch (err) {
      console.error("PDF Export failed:", err);
      setIsDownloading(null);
      setCertData(null);
    }
  };

  const resetFilters = () => {
    setStatusFilter('All');
    setBodyFilter('All');
    setDateFrom('');
    setDateTo('');
    setSearchTerm('');
  };

  const filteredRequests = INITIAL_REQUESTS.filter(req => {
    const matchesSearch = req.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.standards.some(s => s.code.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'All' || req.status === statusFilter;
    const matchesBody = bodyFilter === 'All' || req.accreditationBody === bodyFilter;
    
    const reqDate = new Date(req.createdAt);
    const matchesFrom = !dateFrom || reqDate >= new Date(dateFrom);
    const matchesTo = !dateTo || reqDate <= new Date(dateTo);

    return matchesSearch && matchesStatus && matchesBody && matchesFrom && matchesTo;
  });

  const activeFiltersCount = [
    statusFilter !== 'All',
    bodyFilter !== 'All',
    dateFrom !== '',
    dateTo !== ''
  ].filter(Boolean).length;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Hidden Certificate for Rendering */}
      <div className="fixed top-[-9999px] left-[-9999px]" ref={hiddenCertRef}>
        {certData && <CertificateTemplate data={certData} lang={lang} />}
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">{t('myRequests')}</h2>
          <p className="text-slate-500">{lang === 'ar' ? 'إدارة وتتبع طلبات الاعتماد النشطة الخاصة بك.' : 'Manage and track your active certification applications.'}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className={`absolute ${lang === 'ar' ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600`} size={18} />
            <input 
              type="text" 
              placeholder={lang === 'ar' ? 'البحث عن المعرف أو المعيار...' : "Search ID or standard..."}
              className={`${lang === 'ar' ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2 border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all w-[250px]`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`flex items-center gap-2 px-4 py-2 border rounded-xl font-semibold transition-all relative ${
              isFilterOpen || activeFiltersCount > 0 
                ? 'bg-indigo-50 border-indigo-200 text-indigo-700' 
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Filter size={18} />
            {lang === 'ar' ? 'تصفية' : 'Filter'}
            {activeFiltersCount > 0 && (
              <span className="flex items-center justify-center w-5 h-5 bg-indigo-600 text-white text-[10px] rounded-full absolute -top-2 -right-2">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Expanded Filter Panel */}
      {isFilterOpen && (
        <div className="bg-white border border-indigo-100 rounded-3xl p-6 shadow-sm animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <Filter size={18} className="text-indigo-600" />
              {lang === 'ar' ? 'تصفية متقدمة' : 'Advanced Filters'}
            </h3>
            <button 
              onClick={resetFilters}
              className="text-xs font-bold text-slate-400 hover:text-rose-600 flex items-center gap-1 transition-colors"
            >
              <X size={14} />
              {lang === 'ar' ? 'مسح الكل' : 'Clear All'}
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{lang === 'ar' ? 'الحالة' : 'Status'}</label>
              <div className="relative">
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className={`w-full appearance-none ${lang === 'ar' ? 'pr-4 pl-10' : 'pl-4 pr-10'} py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm font-medium text-slate-700`}
                >
                  <option value="All">{lang === 'ar' ? 'جميع الحالات' : 'All Statuses'}</option>
                  {Object.values(RequestStatus).map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
                <ChevronDown className={`absolute ${lang === 'ar' ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none`} size={16} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{lang === 'ar' ? 'هيئة الاعتماد' : 'Accreditation Body'}</label>
              <div className="relative">
                <select 
                  value={bodyFilter}
                  onChange={(e) => setBodyFilter(e.target.value as any)}
                  className={`w-full appearance-none ${lang === 'ar' ? 'pr-4 pl-10' : 'pl-4 pr-10'} py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm font-medium text-slate-700`}
                >
                  <option value="All">{lang === 'ar' ? 'جميع الهيئات' : 'All Bodies'}</option>
                  {Object.values(AccreditationBody).map(body => (
                    <option key={body} value={body} className="max-w-[400px] truncate">{body}</option>
                  ))}
                </select>
                <ChevronDown className={`absolute ${lang === 'ar' ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none`} size={16} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{lang === 'ar' ? 'من تاريخ' : 'From Date'}</label>
              <div className="relative">
                <Calendar className={`absolute ${lang === 'ar' ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none`} size={16} />
                <input 
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className={`w-full ${lang === 'ar' ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm font-medium text-slate-700`}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{lang === 'ar' ? 'إلى تاريخ' : 'To Date'}</label>
              <div className="relative">
                <Calendar className={`absolute ${lang === 'ar' ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none`} size={16} />
                <input 
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className={`w-full ${lang === 'ar' ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm font-medium text-slate-700`}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white border rounded-3xl overflow-hidden shadow-sm">
        <table className={`w-full ${lang === 'ar' ? 'text-right' : 'text-left'} border-collapse`}>
          <thead>
            <tr className="bg-slate-50 border-b">
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">{lang === 'ar' ? 'معرف الطلب' : 'Request ID'}</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">{lang === 'ar' ? 'معايير ISO' : 'ISO Standards'}</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">{lang === 'ar' ? 'الهيئة' : 'Body'}</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">{lang === 'ar' ? 'الحالة' : 'Status'}</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">{lang === 'ar' ? 'التاريخ' : 'Date'}</th>
              <th className={`px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider ${lang === 'ar' ? 'text-left' : 'text-right'}`}>{lang === 'ar' ? 'الإجراءات' : 'Actions'}</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredRequests.map((req) => (
              <tr key={req.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-6 py-5">
                  <span className="text-sm font-bold text-slate-900">{req.id}</span>
                </td>
                <td className="px-6 py-5">
                  <div className="flex gap-1 flex-wrap">
                    {req.standards.map(s => (
                      <span key={s.id} className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] font-bold rounded border border-indigo-100">
                        {s.code}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="max-w-[120px] truncate" title={req.accreditationBody}>
                    <span className="text-xs font-medium text-slate-600">{(req.accreditationBody as string).split(')')[0] + ')'}</span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <StatusBadge status={req.status as RequestStatus} />
                </td>
                <td className="px-6 py-5">
                  <span className="text-sm text-slate-500">{req.createdAt}</span>
                </td>
                <td className="px-6 py-5">
                  <div className={`flex items-center ${lang === 'ar' ? 'justify-start' : 'justify-end'} gap-2`}>
                    {req.status === RequestStatus.CERTIFIED ? (
                      <button 
                        onClick={() => handleDownload(req)}
                        disabled={isDownloading === req.id}
                        className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700 transition-all shadow-sm shadow-indigo-100 disabled:opacity-70"
                      >
                        {isDownloading === req.id ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <Download size={14} />
                        )}
                        <span>{isDownloading === req.id ? (lang === 'ar' ? 'جاري التحضير...' : 'Preparing...') : (lang === 'ar' ? 'تحميل PDF' : 'Download PDF')}</span>
                      </button>
                    ) : (
                      <>
                        <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all" title={lang === 'ar' ? 'عرض التفاصيل' : "View Details"}>
                          <Eye size={18} />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all" title={lang === 'ar' ? 'الرسائل' : "Messages"}>
                          <MessageSquare size={18} />
                        </button>
                      </>
                    )}
                    <button className="p-2 text-slate-400 hover:text-slate-600 rounded-lg transition-all">
                      <MoreHorizontal size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredRequests.length === 0 && (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
              <Search size={32} />
            </div>
            <p className="text-slate-500 font-medium">{lang === 'ar' ? 'لم يتم العثور على طلبات تطابق الفلتر.' : 'No requests found matching your filters.'}</p>
            <button 
              onClick={resetFilters}
              className="mt-4 text-sm font-bold text-indigo-600 hover:underline"
            >
              {lang === 'ar' ? 'إعادة تعيين كافة الفلاتر' : 'Reset all filters'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRequests;
