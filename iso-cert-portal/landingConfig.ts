import { ISOStandard } from './types';
import { supabase } from './lib/supabaseClient';

export interface PartnerLogo {
  id: string;
  name: string;
  logoUrl: string;
}

export interface LandingMenuItem {
  id: string;
  labelEn: string;
  labelAr: string;
  targetSection: string; // 'hero' | 'services' | 'how-it-works' | 'contact' or a custom page ID
}

export interface LandingSection {
  id: string;
  type: 'custom' | 'feature' | 'stat';
  titleEn: string;
  titleAr: string;
  contentEn: string;
  contentAr: string;
  visible: boolean;
}

export interface LandingService {
  id: string;
  code: string;
  titleEn: string;
  titleAr: string;
  descEn: string;
  descAr: string;
  price: number;
  icon: 'Shield' | 'Zap' | 'Award' | 'Users' | 'Building' | 'FileCheck' | 'CheckCircle2';
}

export interface LandingConfig {
  hero: {
    titleEn: string;
    titleAr: string;
    subtitleEn: string;
    subtitleAr: string;
    ctaTextEn: string;
    ctaTextAr: string;
    showImage: boolean;
  };
  contact: {
    addressEn: string;
    addressAr: string;
    email: string;
    hoursEn: string;
    hoursAr: string;
  };
  menuItems: LandingMenuItem[];
  services: LandingService[];
  customSections: LandingSection[];
  partnerLogos: PartnerLogo[];
}

export const DEFAULT_LANDING_CONFIG: LandingConfig = {
  hero: {
    titleEn: "Accelerate Your Business with Global ISO Accreditation",
    titleAr: "سرّع أعمالك مع اعتمادات معايير ISO العالمية الموثوقة",
    subtitleEn: "Get certified swiftly with our secure digital portal. Partner with world-class accreditation bodies to enhance customer trust and meet regulatory standards globally.",
    subtitleAr: "احصل على الشهادات المعتمدة بسرعة وسهولة عبر بوابتنا الرقمية الآمنة. تعاون مع جهات اعتماد رائدة عالمياً لتعزيز ثقة عملائك وتحقيق التميز في دبي والعالم.",
    ctaTextEn: "Order ISO Certificate Online",
    ctaTextAr: "اطلب شهادة ISO عبر الإنترنت",
    showImage: true
  },
  contact: {
    addressEn: "Al Garhoud, Dubai, UAE",
    addressAr: "القرهود، دبي، الإمارات العربية المتحدة",
    email: "iso@gloria-c.com",
    hoursEn: "Monday - Friday: 9:00 AM - 6:00 PM",
    hoursAr: "الأحد - الخميس: 9:00 صباحاً - 6:00 مساءً"
  },
  menuItems: [
    { id: '1', labelEn: "Home", labelAr: "الرئيسية", targetSection: "hero" },
    { id: '2', labelEn: "About", labelAr: "عن المنصة", targetSection: "about-cloud" },
    { id: '3', labelEn: "Why Us?", labelAr: "المزايا", targetSection: "benefits" },
    { id: '4', labelEn: "How It Works", labelAr: "طريقة العمل", targetSection: "how-it-works" },
    { id: '5', labelEn: "Certificates", labelAr: "الشهادات والأسعار", targetSection: "services" },
    { id: '6', labelEn: "FAQs", labelAr: "الأسئلة الشائعة", targetSection: "faq" },
    { id: '7', labelEn: "Contact", labelAr: "اتصل بنا", targetSection: "contact-section" }
  ],
  services: [
    {
      id: 's1',
      code: 'ISO 9001',
      titleEn: 'Quality Management System',
      titleAr: 'نظام إدارة الجودة (QMS)',
      descEn: 'The international benchmark for product quality and customer satisfaction management.',
      descAr: 'المعيار الدولي الأساسي لضمان جودة المنتجات والخدمات وإدارة رضا العملاء.',
      price: 4495,
      icon: 'Shield'
    },
    {
      id: 's2',
      code: 'ISO 14001',
      titleEn: 'Environmental Management',
      titleAr: 'نظام إدارة البيئة (EMS)',
      descEn: 'Minimize environmental footprint and optimize resource consumption sustainably.',
      descAr: 'الحد من الأثر البيئي وتحسين استهلاك الموارد الطبيعية بكفاءة واستدامة.',
      price: 4495,
      icon: 'CheckCircle2'
    },
    {
      id: 's3',
      code: 'ISO 45001',
      titleEn: 'Occupational Health & Safety',
      titleAr: 'السلامة والصحة المهنية (OHSMS)',
      descEn: 'Ensure employee safety and cultivate high-standard workplace risk reduction.',
      descAr: 'ضمان سلامة الموظفين وتعزيز معايير الحد من المخاطر في بيئة العمل.',
      price: 4495,
      icon: 'Zap'
    }
  ],
  customSections: [
    {
      id: 'why-choose-us',
      type: 'feature',
      titleEn: 'Why Choose ISO Order Portal',
      titleAr: 'لماذا تختار ISO Order Portal؟',
      contentEn: 'We deliver transparent pricing, accelerated processing speeds, and accredited certificates that carry global prestige. Our state-of-the-art secure digital portal manages your compliance workflow with direct integration to international accreditation registries.',
      contentAr: 'نحن نقدم تسعيراً شفافاً، وسرعة في معالجة المعاملات، وشهادات معتمدة تحظى باعتراف دولي فائق. بوابتنا الرقمية الآمنة تدير عمليات الامتثال الخاصة بك بكفاءة عالية وباتصال مباشر مع سجلات الاعتماد الدولية.',
      visible: true
    },
    {
      id: 'how-it-works',
      type: 'custom',
      titleEn: 'Simple 3-Step Online Process',
      titleAr: '3 خطوات بسيطة للحصول على الشهادة',
      contentEn: '1. Choose your standard and fill company details. \n2. Upload compliance documentation for review. \n3. Recieve audited international ISO certificates directly online.',
      contentAr: '1. اختر المعيار المطلوب وأدخل تفاصيل شركتك. \n2. قم برفع مستندات الامتثال للمراجعة من قبل المدققين. \n3. احصل على شهادات ISO الدولية المعتمدة مباشرة عبر الإنترنت.',
      visible: true
    },
    {
      id: 'faq',
      type: 'custom',
      titleEn: 'Frequently Asked Questions',
      titleAr: 'الأسئلة الشائعة',
      contentEn: 'Q: How long does the ISO certification process take?\nA: With our digital portal, standard review takes between 3 to 7 working days, which is twice as fast as manual channels.\n\nQ: Are the certificates internationally accredited?\nA: Yes, all certificates are issued in partnership with leading global accreditation bodies including UKAS, EIAC, and IAS.',
      contentAr: 'س: كم تستغرق عملية الحصول على شهادة ISO؟\nج: من خلال بوابتنا الرقمية، تستغرق المراجعة القياسية من 3 إلى 7 أيام عمل، وهو أسرع بمرتين من القنوات الورقية العادية.\n\nس: هل الشهادات معتمدة دولياً؟\nج: نعم، يتم إصدار كافة الشهادات بالتعاون مع هيئات اعتماد دولية رائدة مثل UKAS و EIAC و IAS.',
      visible: true
    }
  ],
  // Empty by default — the landing page falls back to placeholder tiles
  // until an admin adds real partner/client logos.
  partnerLogos: []
};

// Backend-wide config: stored in Supabase (not localStorage) so an admin's
// edit is visible to every visitor, not just their own browser.
export const fetchLandingConfig = async (): Promise<LandingConfig> => {
  try {
    const { data, error } = await supabase.from('landing_config').select('config').eq('id', true).maybeSingle();
    if (error || !data?.config || Object.keys(data.config).length === 0) {
      return DEFAULT_LANDING_CONFIG;
    }
    // Merge over defaults so fields added after a config was first saved
    // (e.g. partnerLogos) don't come back undefined for existing sites.
    return { ...DEFAULT_LANDING_CONFIG, ...data.config };
  } catch (e) {
    console.error('fetchLandingConfig failed', e);
    return DEFAULT_LANDING_CONFIG;
  }
};

// Admin-only (enforced by RLS).
export const updateLandingConfig = async (config: LandingConfig): Promise<boolean> => {
  const { error } = await supabase
    .from('landing_config')
    .update({ config, updated_at: new Date().toISOString() })
    .eq('id', true);
  if (error) {
    console.error('updateLandingConfig failed', error.message);
    return false;
  }
  return true;
};
