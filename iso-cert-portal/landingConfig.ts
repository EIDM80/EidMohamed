import { ISOStandard } from './types';

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
    phone: string;
    whatsapp: string;
    hoursEn: string;
    hoursAr: string;
  };
  menuItems: LandingMenuItem[];
  services: LandingService[];
  customSections: LandingSection[];
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
    phone: "+971562703015",
    whatsapp: "+971562703015",
    hoursEn: "Monday - Friday: 9:00 AM - 6:00 PM",
    hoursAr: "الأحد - الخميس: 9:00 صباحاً - 6:00 مساءً"
  },
  menuItems: [
    { id: '1', labelEn: "Home", labelAr: "الرئيسية", targetSection: "hero" },
    { id: '2', labelEn: "Featured Standards", labelAr: "معايير ISO المتميزة", targetSection: "services" },
    { id: '3', labelEn: "Why Choose Us", labelAr: "لماذا تختارنا", targetSection: "why-choose-us" },
    { id: '4', labelEn: "How It Works", labelAr: "طريقة التقديم", targetSection: "how-it-works" },
    { id: '5', labelEn: "FAQ", labelAr: "الأسئلة الشائعة", targetSection: "faq" }
  ],
  services: [
    {
      id: 's1',
      code: 'ISO 9001',
      titleEn: 'Quality Management Systems',
      titleAr: 'نظام إدارة الجودة',
      descEn: 'The international benchmark for product quality and customer satisfaction management.',
      descAr: 'المعيار الدولي الأساسي لضمان جودة المنتجات والخدمات وإدارة رضا العملاء.',
      price: 1200,
      icon: 'Shield'
    },
    {
      id: 's2',
      code: 'ISO 14001',
      titleEn: 'Environmental Management',
      titleAr: 'نظام إدارة البيئة',
      descEn: 'Minimize environmental footprint and optimize resource consumption sustainably.',
      descAr: 'الحد من الأثر البيئي وتحسين استهلاك الموارد الطبيعية بكفاءة واستدامة.',
      price: 1500,
      icon: 'CheckCircle2'
    },
    {
      id: 's3',
      code: 'ISO 27001',
      titleEn: 'Information Security Management',
      titleAr: 'نظام إدارة أمن المعلومات',
      descEn: 'Protect critical data, intellectual property, and minimize cyber security risks.',
      descAr: 'حماية البيانات الحساسة والملكية الفكرية والحد من مخاطر الأمن السيبراني.',
      price: 2200,
      icon: 'FileCheck'
    },
    {
      id: 's4',
      code: 'ISO 45001',
      titleEn: 'Occupational Health & Safety',
      titleAr: 'نظام السلامة والصحة المهنية',
      descEn: 'Ensure employee safety and cultivate high-standard workplace risk reduction.',
      descAr: 'ضمان سلامة الموظفين وتعزيز معايير الحد من المخاطر في بيئة العمل.',
      price: 1800,
      icon: 'Zap'
    }
  ],
  customSections: [
    {
      id: 'why-choose-us',
      type: 'feature',
      titleEn: 'Why Choose GAMC Global Solutions',
      titleAr: 'لماذا تختار GAMC للحلول العالمية؟',
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
  ]
};

export const loadLandingConfig = (): LandingConfig => {
  try {
    const data = localStorage.getItem('iso_landing_config');
    if (data) {
      const parsed = JSON.parse(data);
      // Ensure key sections exist
      if (parsed.hero && parsed.services && parsed.customSections && parsed.menuItems) {
        return parsed;
      }
    }
  } catch (e) {
    console.error("Failed to load landing configuration from localStorage", e);
  }
  return DEFAULT_LANDING_CONFIG;
};

export const saveLandingConfig = (config: LandingConfig): void => {
  try {
    localStorage.setItem('iso_landing_config', JSON.stringify(config));
  } catch (e) {
    console.error("Failed to save landing configuration to localStorage", e);
  }
};
