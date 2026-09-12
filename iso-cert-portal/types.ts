
export enum RequestStatus {
  DRAFT = 'Draft',
  SUBMITTED = 'Submitted',
  UNDER_REVIEW = 'Under Review',
  MISSING_DOCS = 'Missing Docs',
  IN_PROGRESS = 'In Progress',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
  CERTIFIED = 'Certified'
}

export enum AccreditationBody {
  UAF = '(UAF) UNITED ACCREDITATION FOUNDATION INC',
  IAS = '(IAS) International Accreditation Service',
  ATS = '(ATS) Accreditation Body of Serbia',
  AA = '(AA) Akkreditierung Austria',
  ANAB = '(ANAB) ANSI National Accreditation Board',
  BELAC = '(BELAC) BELAC',
  CNAS = '(CNAS) China National Accreditation Service for Conformity Assessment',
  COFRAC = '(COFRAC) COmité FRançais d\'ACcréditation',
  CAI = '(CAI) Czech Accreditation Institute',
  DANAK = '(DANAK) DANAK The Danish Accreditation Fund',
  DAKKS = '(DAkkS) Deutsche Akkreditierungsstelle GmbH',
  SAE = '(SAE) Ecuadorian Accreditation Service (Servicio de Acreditación Ecuatoriano)',
  EGAC = '(EGAC) Egyptian Accreditation Council',
  EIAC = '(EIAC) Emirates International Accreditation Centre',
  ECA = '(ECA) Ente Costarricense de Acreditación',
  EMA = '(EMA) Entidad mexicana de acreditación, a.c.',
  ENAC = '(ENAC) Entidad Nacional de Acreditación, ENAC (Spain)',
  EAS = '(EAS) Ethiopian Accreditation Service',
  EA_BAS = '(EA-BAS) Executive Agency - Bulgarian Accreditation Service',
  FINAS = '(FINAS) FINAS (Finnish Accreditation Service)',
  GCC = '(GCC) GCC Accreditation Center',
  CGCRE = '(CGCRE) General Coordination for Accreditation',
  DPA = '(DPA) General Directorate of Accreditation',
  GAB = '(GAB) Global Accreditation Bureau',
  ESYD = '(ESYD) Hellenic Accreditation System',
  HKAS = '(HKAS) Hong Kong Accreditation Service',
  IARNM = '(IARNM) Institute for Accreditation of the Republic of North Macedonia',
  INN = '(INN) Instituto Nacional de Normalizacion',
  IPAC = '(IPAC) IPAC - Instituto Português de Acreditação, I.P.',
  INAB = '(INAB) Irish National Accreditation Board',
  ISMS_AC = '(ISMS-AC) ISMS Accreditation Center',
  ACCREDIA = '(ACCREDIA) Italian Accreditation Body',
  JAB = '(JAB) Japan Accreditation Board',
  JASANZ = '(JASANZ) Joint Accreditation System of Australia and New Zealand',
  KENAS = '(KENAS) Kenya Accreditation Service',
  KAB = '(KAB) Korea Accreditation Board',
  LATAK = '(LATAK) Latvian National Accreditation Bureau',
  LA = '(LA) Lithuanian National Accreditation Bureau',
  MAURITAS = '(MAURITAS) Mauritius Accreditation Service',
  MNAS = '(MNAS) Mongolian National Authority for Accreditation',
  NAAU = '(NAAU) NATIONAL ACCREDITATION AGENCY OF UKRAINE',
  NAH = '(NAH) National Accreditation Authority (Hungary)',
  NABCB = '(NABCB) National Accreditation Board for Certification Bodies',
  ONAC = '(ONAC) National Accreditation Body of Colombia',
  KAN = '(KAN) National Accreditation Body of Indonesia',
  BOA = '(BoA) National Accreditation Bureau',
  MOLDAC = '(MOLDAC) National Accreditation Centre of the Republic of Moldova',
  ACFS = '(ACFS) National Bureau of Agricultural Commodity and Food Standards',
  NCA = '(NCA) National Center of Accreditation of the Republic of Kazakhstan',
  INACAL_DA = '(INACAL-DA) National Institute of Quality – Directorate of Accreditation',
  NSC = '(NSC) National Standardization Council of Thailand',
  NAF = '(NAF) Nepal Accreditation Foundation',
  NINAS = '(NiNAS) Nigeria National Accreditation System',
  NA = '(NA) Norwegian Accreditation',
  OLAS = '(OLAS) Office Luxembourgeois d\'Accréditation et de Surveillance',
  OAA = '(OAA) Organismo Argentino de Acreditacion',
  OUA = '(OUA) Organismo Uruguayo de Acreditacion',
  PNAC = '(PNAC) Pakistan National Accreditation Council',
  PAB = '(PAB) Philippine Accreditation Bureau',
  PCA = '(PCA) Polish Centre for Accreditation',
  RVA = '(RvA) Raad voor Accreditatie (Dutch Accreditation Council)',
  RENAR = '(RENAR) Romanian Accreditation Association',
  SAAC = '(SAAC) Saudi Accreditation Center',
  SAC = '(SAC) Singapore Accreditation Council',
  SNAS = '(SNAS) Slovak National Accreditation Service',
  SA = '(SA) Slovenian Accreditation',
  SANAS = '(SANAS) South African National Accreditation System',
  SADCAS = '(SADCAS) Southern African Development Community Accreditation Services',
  SLAB = '(SLAB) Sri Lanka Accreditation Board for Conformity Assessment',
  SCC = '(SCC) Standards Council of Canada',
  DSM = '(DSM) Standards Malaysia',
  SWEDAC = '(SWEDAC) Swedish Board for Accreditation and Conformity Assessment',
  SAS = '(SAS) Swiss Accreditation Service',
  TAF = '(TAF) Taiwan Accreditation Foundation',
  OZAKK = '(O\'ZAKK) The Center for Accreditation',
  TUNAC = '(TUNAC) Tunisian Accreditation Council',
  TURKAK = '(TURKAK) TURKISH ACCREDITATION AGENCY',
  UKAS = '(UKAS) United Kingdom Accreditation Service',
  VACI = '(VACI) Vietnam Institute of Accreditation',
  SOAC = '(SOAC) West African Accreditation System'
}

export interface ISOStandard {
  id: string;
  code: string;
  title: string;
  description: string;
  basePrice: number;
}

export interface Company {
  name: string;
  legalName: string;
  licenseNo: string;
  address: string;
  website: string;
}

export interface RequestDocument {
  id: string;
  name: string;
  status: 'pending' | 'accepted' | 'rejected';
  file?: File;
  type: string;
}

export interface ISORequest {
  id: string;
  type: 'single' | 'multi';
  standards: ISOStandard[];
  accreditationBody: AccreditationBody;
  status: RequestStatus;
  amount: number;
  currency: 'usd' | 'aed';
  renewalTerm: '1y' | '3y';
  subscriptionStatus: 'active' | 'past_due' | 'canceled' | 'unpaid';
  nextRenewalAt: string | null;
  documents: RequestDocument[];
  createdAt: string;
  company: Company;
}

export interface Ticket {
  id: string;
  subject: string;
  status: 'open' | 'closed';
  lastMessage: string;
  updatedAt: string;
}
