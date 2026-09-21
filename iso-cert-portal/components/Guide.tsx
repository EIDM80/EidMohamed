
import React from 'react';
import { 
  BookOpen, 
  UserPlus, 
  FileSearch, 
  CloudUpload, 
  CreditCard, 
  ShieldCheck, 
  RefreshCcw,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { Language } from '../translations';

interface GuideProps {
  lang: Language;
  t: (key: any) => string;
}

const GuideStep = ({ number, title, description, icon: Icon, subtasks, lang }: any) => (
  <div className={`flex gap-6 relative pb-12 last:pb-0 ${lang === 'ar' ? 'flex-row-reverse text-right' : ''}`}>
    {/* Connector Line */}
    <div className={`absolute ${lang === 'ar' ? 'right-[23px]' : 'left-[23px]'} top-[48px] bottom-0 w-0.5 bg-slate-100 -z-0 last:hidden`} />
    
    <div className="shrink-0 w-12 h-12 bg-white border-2 border-indigo-600 rounded-full flex items-center justify-center text-indigo-600 font-bold z-10 shadow-sm">
      {number}
    </div>
    
    <div className="flex-1 pt-1">
      <div className={`flex items-center gap-3 mb-2 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
          <Icon size={20} />
        </div>
        <h3 className="text-xl font-bold text-slate-900">{title}</h3>
      </div>
      <p className="text-slate-500 mb-4 max-w-2xl">{description}</p>
      
      {subtasks && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {subtasks.map((task: string, idx: number) => (
            <div key={idx} className={`flex items-center gap-2 text-sm text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
              <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
              {task}
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);

const Guide: React.FC<GuideProps> = ({ lang, t }) => {
  return (
    <div className="max-w-4xl mx-auto py-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
          <BookOpen size={14} />
          {lang === 'ar' ? 'قاعدة المعرفة' : 'Knowledge Base'}
        </div>
        <h2 className="text-4xl font-bold text-slate-900 mb-4">{lang === 'ar' ? 'دليل رحلة الحصول على الشهادة' : 'Certification Journey Guide'}</h2>
        <p className="text-slate-500 text-lg max-w-2xl mx-auto">
          {lang === 'ar' ? 'اتبع هذا المسار المنظم للتنقل في عملية الحصول على شهادة ISO، من الإعداد الأولي وحتى التحقق العام.' : 'Follow this structured roadmap to navigate the ISO certification process, from initial setup to public verification.'}
        </p>
      </div>

      <div className="bg-white rounded-3xl border shadow-sm p-10">
        <GuideStep 
          lang={lang}
          number="01"
          title={lang === 'ar' ? 'مصادقة الشركة والملف الشخصي' : "Corporate Authentication & Profile"}
          icon={UserPlus}
          description={lang === 'ar' ? 'قم بتسجيل حساب شركتك وأكمل ملف تعريف منظمتك. التفاصيل القانونية الدقيقة أمر بالغ الأهمية حيث يتم تضمينها تلقائيًا في شهاداتك النهائية.' : "Register your corporate account and complete your organization profile. Accurate legal details are critical as they are automatically embedded into your final certificates."}
          subtasks={lang === 'ar' ? [
            "سجل ببريدك المهني",
            "أكمل تفاصيل الرخصة التجارية",
            "تحقق من العنوان المسجل",
            "قم بتعيين المفوضين بالتوقيع"
          ] : [
            "Register with professional email",
            "Complete Trade License details",
            "Verify Registered Address",
            "Setup Authorized Signatories"
          ]}
        />

        <GuideStep 
          lang={lang}
          number="02"
          title={lang === 'ar' ? 'اختيار المعيار والاعتماد' : "Standard Selection & Accreditation"}
          icon={FileSearch}
          description={lang === 'ar' ? 'اختر بين شهادة واحدة أو حزمة شهادات متعددة. اختر هيئة الاعتماد العالمية المفضلة لديك (مثل UKAS، IAS، ANAB).' : "Choose between a Single Label (one standard) or Multi-Label Bundle (multiple standards). Select your preferred global accreditation body (e.g., UKAS, IAS, ANAB)."}
          subtasks={lang === 'ar' ? [
            "اختر أكواد ISO محددة",
            "قارن بين هيئات الاعتماد",
            "راجع خصومات الحزم المتعددة",
            "تحقق من الأهلية الإقليمية"
          ] : [
            "Select specific ISO codes",
            "Compare accreditation bodies",
            "Review multi-label discounts",
            "Check regional eligibility"
          ]}
        />

        <GuideStep 
          lang={lang}
          number="03"
          title={lang === 'ar' ? 'إعداد الوثائق بواسطة الذكاء الاصطناعي' : "AI-Powered Document Preparation"}
          icon={CloudUpload}
          description={lang === 'ar' ? 'يقوم محرك Gemini الخاص بنا بتحليل المعايير التي اخترتها وينشئ قائمة مخصصة بالوثائق المطلوبة خصيصاً لمجال عملك وهيئة الاعتماد.' : "Our Gemini-powered engine analyzes your selected standards and generates a custom documentation checklist tailored to your specific industry and accreditation body."}
          subtasks={lang === 'ar' ? [
            "عرض ملخص متطلبات الذكاء الاصطناعي",
            "تحميل أدلة الجودة",
            "تقديم أدلة التدقيق",
            "تتبع حالة الموافقة على الوثائق"
          ] : [
            "View AI Requirement Summary",
            "Upload Quality Manuals",
            "Submit Audit Evidence",
            "Track document approval status"
          ]}
        />

        <GuideStep 
          lang={lang}
          number="04"
          title={lang === 'ar' ? 'المراجعة وتسوية الرسوم' : "Review & Fee Settlement"}
          icon={CreditCard}
          description={lang === 'ar' ? 'قدم طلبك للمراجعة وسدد رسوم الشهادة بأمان. هذا سيبدأ التقييم الرسمي من قبل فريق العمليات لدينا.' : "Submit your application for review and settle the certification fees securely. This initiates the formal assessment by our operations team."}
          subtasks={lang === 'ar' ? [
            "مراجعة ملخص الطلب",
            "دفع آمن عبر Stripe",
            "إصدار الفواتير الضريبية",
            "قفل الطلب للبدء"
          ] : [
            "Review application summary",
            "Secure Stripe checkout",
            "Generate tax invoices",
            "Application lock-in"
          ]}
        />

        <GuideStep 
          lang={lang}
          number="05"
          title={lang === 'ar' ? 'التقييم التشغيلي' : "Operational Assessment"}
          icon={ShieldCheck}
          description={lang === 'ar' ? 'يقوم فريق الامتثال لدينا بمراجعة طلبك. في حال وجود نقص، سيتم تحديث حالتك إلى "وثائق مفقودة"، مما يسمح لك بالرد على الاستفسارات في الوقت الفعلي.' : "Our compliance team reviews your submissions. If details are missing, your status will update to 'Missing Docs', allowing you to respond to specific queries in real-time."}
          subtasks={lang === 'ar' ? [
            "الحالة: قيد المراجعة",
            "الرد على طلبات الوثائق المفقودة",
            "مراسلة داخلية مع المدققين",
            "إخطار الموافقة النهائي"
          ] : [
            "Status: Under Review",
            "Respond to Missing Doc requests",
            "Internal messaging with auditors",
            "Final approval notification"
          ]}
        />

        <GuideStep 
          lang={lang}
          number="06"
          title={lang === 'ar' ? 'الإصدار والتحقق' : "Issuance & Verification"}
          icon={CheckCircle2}
          description={lang === 'ar' ? 'بمجرد الموافقة، يتم إنشاء شهادتك الرقمية. تتضمن معرفاً فريداً ورمز QR للتحقق العالمي الفوري من قبل عملائك.' : "Once approved, your digital certificate is generated. It includes a unique verification hash and QR code for instant global validation by your clients."}
          subtasks={lang === 'ar' ? [
            "تحميل ملف PDF آمن",
            "تفعيل التحقق العام",
            "مشاركة بيانات رمز QR",
            "تتبع انتهاء صلاحية الشهادة"
          ] : [
            "Download Secure PDF",
            "Enable Public Verification",
            "Share QR credentials",
            "Track certificate expiry"
          ]}
        />
      </div>

      <div className={`mt-12 bg-indigo-600 rounded-3xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-indigo-100 ${lang === 'ar' ? 'md:flex-row-reverse text-right' : ''}`}>
        <div>
          <h3 className="text-2xl font-bold mb-2">{lang === 'ar' ? 'هل أنت مستعد للبدء؟' : 'Ready to start?'}</h3>
          <p className="text-indigo-100 opacity-90">{lang === 'ar' ? 'ابدأ رحلتك نحو الامتثال العالمي اليوم.' : 'Begin your journey to global compliance today.'}</p>
        </div>
        <button className={`flex items-center gap-2 bg-white text-indigo-600 px-8 py-4 rounded-2xl font-bold hover:bg-indigo-50 transition-all shadow-lg ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
          {t('getStarted')}
          <ChevronRight size={20} className={lang === 'ar' ? 'rotate-180' : ''} />
        </button>
      </div>
    </div>
  );
};

export default Guide;
