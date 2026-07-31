
import React from 'react';
import {
  Building,
  Users,
  Target,
  ShieldCheck,
  Award,
  Globe2,
  Mail
} from 'lucide-react';
import { Language } from '../translations';
import Logo from './Logo';

interface AboutUsProps {
  lang: Language;
  t: (key: any) => string;
}

const AboutUs: React.FC<AboutUsProps> = ({ lang, t }) => {
  const isAr = lang === 'ar';

  return (
    <div className="max-w-5xl mx-auto py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-16">
        <div className="mb-6 flex justify-center">
          <Logo size={100} color="#4f46e5" />
        </div>
        <h2 className="text-4xl font-black text-slate-900 mb-4">{t('aboutUs')}</h2>
        <div className="w-24 h-1.5 bg-indigo-600 mx-auto rounded-full mb-6"></div>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium">
          {isAr 
            ? 'نحن نوفر حلولاً عالمية المستوى لاعتماد وشهادات ISO، لتمكين المؤسسات من الوصول إلى التميز والامتثال.' 
            : 'We provide world-class ISO accreditation and certification solutions, empowering organizations to achieve excellence and compliance.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20 items-center">
        <div className={`space-y-6 ${isAr ? 'text-right' : 'text-left'}`}>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold uppercase tracking-widest">
            <Target size={14} />
            {isAr ? 'مهمتنا' : 'Our Mission'}
          </div>
          <h3 className="text-3xl font-bold text-slate-900 leading-tight">
            {isAr ? 'تبسيط طريقك إلى التميز العالمي' : 'Simplifying Your Path to Global Excellence'}
          </h3>
          <p className="text-slate-600 leading-relaxed">
            {isAr
              ? 'تلتزم ISO Order Portal بجعل عملية الحصول على شهادة ISO تتسم بالكفاءة والشفافية والمصداقية. نحن ندرك أن الامتثال ليس مجرد مربع يتم التأشير عليه، بل هو أساس للنمو المستدام والثقة الدولية.'
              : 'ISO Order Portal is committed to making the ISO certification process efficient, transparent, and credible. We understand that compliance is not just a checkbox, but a foundation for sustainable growth and international trust.'}
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
              <h4 className="text-2xl font-black text-indigo-600">500+</h4>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{isAr ? 'عميل نشط' : 'Active Clients'}</p>
            </div>
            <div className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
              <h4 className="text-2xl font-black text-indigo-600">30+</h4>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{isAr ? 'معايير ISO' : 'ISO Standards'}</p>
            </div>
          </div>
        </div>
        <div className="relative">
          <div className="aspect-square bg-indigo-600 rounded-3xl rotate-3 absolute inset-0 opacity-10"></div>
          <div className="relative bg-white border-2 border-slate-100 p-8 rounded-3xl shadow-xl overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Logo size={120} color="#4f46e5" />
            </div>
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                  <Award size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">{isAr ? 'مُعتمد دولياً' : 'Internationally Accredited'}</h4>
                  <p className="text-xs text-slate-500">{isAr ? 'الاعتراف من الهيئات العالمية الرائدة' : 'Recognition from leading global bodies'}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                  <Globe2 size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">{isAr ? 'نطاق عالمي' : 'Global Reach'}</h4>
                  <p className="text-xs text-slate-500">{isAr ? 'خدمة الشركات عبر القارات' : 'Serving companies across continents'}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                  <Users size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">{isAr ? 'دعم الخبراء' : 'Expert Support'}</h4>
                  <p className="text-xs text-slate-500">{isAr ? 'فريق متخصص لمساعدتك في كل خطوة' : 'Dedicated team assisting you at every step'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#0a1128] rounded-[2.5rem] p-10 md:p-16 text-white shadow-2xl shadow-indigo-200/20">
        <div className={`flex flex-col md:flex-row items-center justify-between gap-12 ${isAr ? 'md:flex-row-reverse text-right' : ''}`}>
          <div className="flex-1 space-y-6">
            <h3 className="text-3xl font-black tracking-tight">{isAr ? 'مزود الخدمة المعتمد' : 'Authorized Provider Information'}</h3>
            <p className="text-indigo-100/70 text-lg leading-relaxed">
              {isAr
                ? 'تعمل بوابة ISO-Cert Portal تحت إدارة ISO Order Portal، وهي شريكك الموثوق في رحلة الامتثال الرقمي.'
                : 'The ISO-Cert Portal is managed by ISO Order Portal, your trusted partner in the digital compliance journey.'}
            </p>
            <div className="space-y-4">
              <div className={`flex items-center gap-4 ${isAr ? 'flex-row-reverse' : ''}`}>
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  <Building size={20} className="text-[#f7b500]" />
                </div>
                <div>
                  <p className="text-xs font-bold text-indigo-200/50 uppercase tracking-widest">{isAr ? 'الكيان القانوني' : 'Legal Entity'}</p>
                  <p className="font-bold">ISO Order Portal</p>
                </div>
              </div>
              <div className={`flex items-center gap-4 ${isAr ? 'flex-row-reverse' : ''}`}>
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  <Mail size={20} className="text-[#f7b500]" />
                </div>
                <div>
                  <p className="text-xs font-bold text-indigo-200/50 uppercase tracking-widest">{isAr ? 'البريد الإلكتروني' : 'Email Address'}</p>
                  <a href="mailto:iso@gloria-c.com" className="font-bold hover:text-[#f7b500] transition-colors">iso@gloria-c.com</a>
                </div>
              </div>
            </div>
          </div>
          <div className="w-64 h-64 bg-white rounded-3xl p-8 flex flex-col items-center justify-center text-[#0a1128] shadow-xl relative overflow-hidden group">
            <div className="absolute top-[-20%] right-[-20%] w-32 h-32 bg-indigo-50 rounded-full opacity-50"></div>
            <div className="relative z-10 flex flex-col items-center text-center">
              <Logo size={64} color="#0a1128" className="mb-4" />
              <h4 className="font-black text-xl mb-1">ISO Order Portal</h4>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">{isAr ? 'المزود المعتمد' : 'Authorized Provider'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-20 text-center text-slate-400 text-xs font-medium border-t border-slate-100 pt-8">
        <p>© 2025 ISO Order Portal. {isAr ? 'جميع الحقوق محفوظة.' : 'All Rights Reserved.'}</p>
        <p className="mt-2">{isAr ? 'المزود المعتمد لشهادات ISO عالمياً.' : 'Authorized Provider for ISO Certificates Globally.'}</p>
      </div>
    </div>
  );
};

export default AboutUs;
