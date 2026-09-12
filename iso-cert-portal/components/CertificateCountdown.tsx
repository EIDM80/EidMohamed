import React, { useState, useEffect } from 'react';
import { Clock, PartyPopper } from 'lucide-react';
import { Language } from '../translations';

const COUNTDOWN_MS = 7 * 24 * 60 * 60 * 1000;

interface Props {
  createdAt: string;
  standardCodes: string[];
  lang: Language;
}

const pad = (n: number): string => String(n).padStart(2, '0');

const CertificateCountdown: React.FC<Props> = ({ createdAt, standardCodes, lang }) => {
  const target = new Date(createdAt).getTime() + COUNTDOWN_MS;
  const [remaining, setRemaining] = useState(target - Date.now());

  useEffect(() => {
    const interval = setInterval(() => setRemaining(target - Date.now()), 1000);
    return () => clearInterval(interval);
  }, [target]);

  if (remaining <= 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 p-8 bg-emerald-50 border border-emerald-200 rounded-3xl text-center">
        <PartyPopper size={40} className="text-emerald-600" />
        <p className="text-lg font-extrabold text-emerald-800">
          {lang === 'ar'
            ? `مبروك حصولكم على شهادة الأيزو رقم ${standardCodes.join(' / ')}`
            : `Congratulations on obtaining your ISO certificate ${standardCodes.join(' / ')}`}
        </p>
      </div>
    );
  }

  const totalSeconds = Math.floor(remaining / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const units: [number, string][] = [
    [days, lang === 'ar' ? 'يوم' : 'Days'],
    [hours, lang === 'ar' ? 'ساعة' : 'Hours'],
    [minutes, lang === 'ar' ? 'دقيقة' : 'Min'],
    [seconds, lang === 'ar' ? 'ثانية' : 'Sec'],
  ];

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-8 bg-indigo-50 border border-indigo-100 rounded-3xl text-center">
      <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider">
        <Clock size={16} />
        <span>{lang === 'ar' ? 'الوقت المتبقي لتجهيز الشهادة' : 'Time remaining to prepare your certificate'}</span>
      </div>
      <div className="flex items-center gap-3 md:gap-5">
        {units.map(([value, label]) => (
          <div key={label} className="flex flex-col items-center">
            <span className="text-3xl md:text-5xl font-black text-indigo-700 tabular-nums">{pad(value)}</span>
            <span className="text-[10px] md:text-xs font-bold text-indigo-400 uppercase tracking-wider mt-1">{label}</span>
          </div>
        ))}
      </div>
      <p className="text-sm font-semibold text-slate-500 mt-1">
        {lang === 'ar' ? 'جارٍ إعداد الشهادة الخاصة بك' : 'Preparing your certificate'}
      </p>
    </div>
  );
};

export default CertificateCountdown;
