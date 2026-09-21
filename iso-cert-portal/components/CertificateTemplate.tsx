
import React from 'react';
import { Settings, ShieldCheck, Globe, CheckCircle2, Award, ExternalLink } from 'lucide-react';
import { Language } from '../translations';

interface CertificateTemplateProps {
  data: {
    id: string;
    companyName: string;
    companyAddress: string;
    isoCode: string;
    isoTitle: string;
    issueDate: string;
    validityYears: number;
    accreditationBody: string;
    scope: string;
  };
  lang: Language;
}

const CertificateTemplate: React.FC<CertificateTemplateProps> = ({ data, lang }) => {
  const isAr = lang === 'ar';

  // Date Calculation Logic
  const issueDate = new Date(data.issueDate);
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const getDayWithSuffix = (date: Date) => {
    const d = date.getDate();
    if (d > 3 && d < 21) return d + 'th';
    switch (d % 10) {
      case 1: return d + "st";
      case 2: return d + "nd";
      case 3: return d + "rd";
      default: return d + "th";
    }
  };

  const formatWithSuffix = (date: Date) => {
    const suffix = getDayWithSuffix(date);
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const year = date.getFullYear();
    return `${suffix} ${month}. ${year}`;
  };

  const surveillance1 = new Date(issueDate);
  surveillance1.setFullYear(issueDate.getFullYear() + 1);

  const surveillance2 = new Date(issueDate);
  surveillance2.setFullYear(issueDate.getFullYear() + 2);

  const expiryDate = new Date(issueDate);
  expiryDate.setFullYear(issueDate.getFullYear() + data.validityYears);

  // Dynamic Accreditation Logo Mapping
  const getAccreditationInitial = () => {
    const match = data.accreditationBody.match(/\(([^)]+)\)/);
    return match ? match[1] : 'ISO';
  };

  return (
    <div id="certificate-template" className={`cert-container ${isAr ? 'rtl' : 'ltr'}`} dir={isAr ? 'rtl' : 'ltr'}>
      
      {/* LEFT SIDEBAR */}
      <div className="w-[24%] bg-[#0a1128] h-full flex flex-col items-center py-10 relative">
        {/* ICAZ Logo area */}
        <div className="flex flex-col items-center mb-12 px-4 text-center">
           <div className="relative w-24 h-24 mb-2">
             <div className="absolute inset-0 text-[#f7b500] opacity-90">
               <Settings size={96} strokeWidth={1.5} />
             </div>
             <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10">
               <span className="text-[14px] font-black leading-none tracking-tighter italic">ICAZ</span>
               <span className="text-[6px] uppercase font-bold tracking-widest mt-0.5">Certification</span>
             </div>
           </div>
           <div className="text-[6px] text-[#f7b500] uppercase font-bold tracking-[0.2em] border-t border-[#f7b500] pt-1">
             www.isocertifications.org
           </div>
           <div className="flex gap-0.5 mt-2">
             {[...Array(7)].map((_, i) => (
               <div key={i} className="text-[#f7b500] text-[8px]">★</div>
             ))}
           </div>
           <div className="text-[8px] text-white/60 font-bold mt-1">2010 - 2025</div>
        </div>

        {/* Large Vertical ISO text */}
        <div className="flex-1 flex items-center justify-center">
          <h1 className="vertical-text text-white text-8xl font-black tracking-tighter opacity-90">
            {data.isoCode.split(' ')[0]} {data.isoCode.split(' ')[1]} - 2015
          </h1>
        </div>
        
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black/40 to-transparent"></div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 h-full bg-white relative flex flex-col items-center py-12 px-12">
        
        {/* Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] pointer-events-none select-none">
          <h2 className="text-[300px] font-black transform -rotate-12">ISO</h2>
        </div>

        {/* Header Title */}
        <div className="text-center mb-10">
          <h1 className="text-[100px] font-gothic text-[#0a1128] leading-none mb-0">Certificate</h1>
          <h3 className="text-[32px] font-bold text-[#0a1128] tracking-[0.2em] -mt-2">OF REGISTRATION</h3>
        </div>

        {/* Declaration Statement */}
        <div className="text-center space-y-4 mb-8 w-full">
          <p className="text-sm font-bold text-slate-800 leading-none">This is to Certify that the Management System of</p>
          <div className="space-y-1">
            <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tight">{data.companyName}</h2>
            <p className="text-xs font-bold text-slate-600 uppercase">Registered Entity</p>
          </div>
          
          <div className="text-[11px] text-slate-500 font-medium leading-tight">
            <p>{data.companyAddress}</p>
          </div>

          <p className="text-sm font-bold text-slate-800 pt-2">
            Has been assessed and registered by ICAZ Certification<br/>
            as conforming to requirements of
          </p>
        </div>

        {/* Standard Label */}
        <div className="mb-8 text-center">
          <h2 className="text-6xl font-black text-[#0a1128] tracking-tighter">
            {data.isoCode} : 2015
          </h2>
        </div>

        {/* Application Scope */}
        <div className="text-center mb-10">
          <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.1em] mb-3">THE MANAGEMENT SYSTEM IS APPLICABLE TO</p>
          <h4 className="text-2xl font-black text-slate-800 mb-1">"{data.companyName}"</h4>
          <div className="flex items-center justify-center gap-2 text-sm font-bold text-slate-700 max-w-lg mx-auto">
            <span className="text-slate-400 font-medium italic shrink-0">Scope :</span>
            <span className="line-clamp-2">{data.scope}</span>
          </div>
        </div>

        {/* Details Table */}
        <div className="w-[85%] border-t border-slate-100 pt-6 mb-10">
          <div className="grid grid-cols-2 gap-y-2.5">
             <div className="text-sm font-bold text-slate-800">Certificate No</div>
             <div className="text-sm font-black text-[#0a1128] text-right">{data.id}</div>
             
             <div className="text-[11px] font-bold text-slate-600">Initial Certification Date</div>
             <div className="text-[11px] font-bold text-slate-900 text-right">{formatWithSuffix(issueDate)}</div>

             <div className="text-[11px] font-bold text-slate-600">1st Surveillance Due Date</div>
             <div className="text-[11px] font-bold text-slate-900 text-right">{formatWithSuffix(surveillance1)}</div>

             <div className="text-[11px] font-bold text-slate-600">2nd Surveillance Due Date</div>
             <div className="text-[11px] font-bold text-slate-900 text-right">{formatWithSuffix(surveillance2)}</div>

             <div className="text-[11px] font-bold text-slate-600">Certificate Expiry Date</div>
             <div className="text-[11px] font-bold text-slate-900 text-right">{formatWithSuffix(expiryDate)}</div>
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-[10px] font-bold text-slate-500 mb-1 italic">To Check validity of the Certificate please</p>
            <div className="flex items-center justify-center gap-2">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">visit</span>
              <span className="text-[11px] font-black text-indigo-900">http://isocertifications.org/verify/{data.id}</span>
            </div>
          </div>
        </div>

        {/* Footer with Logos & Signature */}
        <div className="mt-auto w-full grid grid-cols-3 items-end">
          {/* Wax Seal & Dates */}
          <div className="flex flex-col items-start gap-3">
             <div className="space-y-0.5">
               <div className="text-[10px] font-bold text-slate-400 uppercase">Certificate Issue Date</div>
               <div className="text-lg font-black text-slate-900">{formatDate(issueDate)}</div>
             </div>
             
             <div className="w-16 h-16 rounded-full bg-[#9e1b32] border-4 border-[#7d1527] shadow-lg flex flex-col items-center justify-center text-white relative overflow-hidden">
               <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_40%,rgba(0,0,0,0.1)_100%)]"></div>
               <div className="text-[5px] font-black uppercase tracking-tighter opacity-80">Premium</div>
               <div className="text-[8px] font-black uppercase tracking-widest my-0.5">Quality</div>
               <div className="flex gap-0.5">
                  {[...Array(3)].map((_, i) => <div key={i} className="text-[5px]">★</div>)}
               </div>
             </div>
          </div>

          {/* Accreditation & IAF Logos */}
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="flex flex-col items-center gap-3">
               <div className="flex items-center gap-4">
                  {/* Dynamic Accreditation Body Badge */}
                  <div className="flex flex-col items-center p-1.5 border-2 border-slate-900 rounded bg-white w-14 h-14 justify-center">
                    <span className="text-[10px] font-black text-slate-900 leading-none">{getAccreditationInitial()}</span>
                    <div className="h-0.5 w-full bg-slate-900 my-0.5"></div>
                    <span className="text-[5px] font-bold text-slate-500 uppercase tracking-tighter text-center">Accreditation Council</span>
                  </div>

                  {/* IAF Logo (International Accreditation Forum) */}
                  <div className="flex flex-col items-center p-1.5 border-2 border-indigo-900 rounded bg-white w-14 h-14 justify-center">
                    <div className="flex items-center gap-0.5 mb-0.5">
                      <Globe size={14} className="text-indigo-900" />
                      <span className="text-[10px] font-black text-indigo-900">IAF</span>
                    </div>
                    <div className="h-0.5 w-full bg-indigo-900 mb-0.5"></div>
                    <span className="text-[4px] font-bold text-indigo-800 uppercase tracking-tighter leading-none text-center">International Accreditation Forum</span>
                  </div>
               </div>
               
               <div className="text-[7px] font-black text-slate-400 uppercase tracking-widest text-center leading-tight">
                  Recognized Globally via IAF Multilateral <br/> Recognition Arrangement (MLA)
               </div>
            </div>
          </div>

          {/* Signature Area */}
          <div className="flex flex-col items-end text-right gap-3">
            <div className="space-y-0.5 text-right">
              <div className="text-[10px] font-bold text-slate-400 uppercase">Certificate Expiry Date</div>
              <div className="text-lg font-black text-slate-900">{formatDate(expiryDate)}</div>
            </div>
            
            <div className="flex flex-col items-center">
              <span className="font-signature text-2xl text-indigo-950 mb-1 opacity-90">Sarah J. Thompson</span>
              <div className="h-px w-32 bg-slate-300 mb-1"></div>
              <span className="text-[8px] font-bold text-slate-500 uppercase tracking-tight">Director of Certification Systems</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CertificateTemplate;
