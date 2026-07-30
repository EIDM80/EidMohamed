import { supabase } from './supabaseClient';
import { Company, ISORequest, ISOStandard, AccreditationBody, RequestStatus } from '../types';

export interface Profile {
  id: string;
  full_name: string | null;
  role: 'client' | 'admin';
  company_id: string | null;
}

interface RequestRow {
  id: string;
  company_id: string;
  type: 'single' | 'multi';
  accreditation_body: string;
  status: string;
  amount: number;
  currency: 'usd' | 'aed' | null;
  renewal_term: '1y' | '3y' | null;
  subscription_status: 'active' | 'past_due' | 'canceled' | 'unpaid' | null;
  next_renewal_at: string | null;
  standards: ISOStandard[];
  created_at: string;
  companies: {
    name: string;
    legal_name: string | null;
    license_no: string | null;
    address: string | null;
    website: string | null;
  } | null;
}

const rowToRequest = (row: RequestRow): ISORequest => ({
  id: row.id,
  type: row.type,
  standards: row.standards ?? [],
  accreditationBody: row.accreditation_body as AccreditationBody,
  status: row.status as RequestStatus,
  amount: row.amount,
  currency: row.currency ?? 'usd',
  renewalTerm: row.renewal_term ?? '1y',
  subscriptionStatus: row.subscription_status ?? 'active',
  nextRenewalAt: row.next_renewal_at,
  documents: [],
  createdAt: row.created_at,
  company: {
    name: row.companies?.name ?? '',
    legalName: row.companies?.legal_name ?? '',
    licenseNo: row.companies?.license_no ?? '',
    address: row.companies?.address ?? '',
    website: row.companies?.website ?? '',
  },
});

export const fetchProfile = async (userId: string): Promise<Profile | null> => {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
  if (error) {
    console.error('fetchProfile failed:', error.message);
    return null;
  }
  return data as Profile;
};

export const fetchCompany = async (companyId: string): Promise<Company | null> => {
  const { data, error } = await supabase.from('companies').select('*').eq('id', companyId).single();
  if (error) {
    console.error('fetchCompany failed:', error.message);
    return null;
  }
  return {
    name: data.name,
    legalName: data.legal_name ?? '',
    licenseNo: data.license_no ?? '',
    address: data.address ?? '',
    website: data.website ?? '',
  };
};

export const saveCompany = async (companyId: string, company: Company): Promise<boolean> => {
  const { error } = await supabase
    .from('companies')
    .update({
      name: company.name,
      legal_name: company.legalName,
      license_no: company.licenseNo,
      address: company.address,
      website: company.website,
      updated_at: new Date().toISOString(),
    })
    .eq('id', companyId);
  if (error) {
    console.error('saveCompany failed:', error.message);
    return false;
  }
  return true;
};

export const fetchRequests = async (): Promise<ISORequest[]> => {
  const { data, error } = await supabase
    .from('iso_requests')
    .select('*, companies(name, legal_name, license_no, address, website)')
    .order('created_at', { ascending: false });
  if (error) {
    console.error('fetchRequests failed:', error.message);
    return [];
  }
  return (data as RequestRow[]).map(rowToRequest);
};

// Requests are no longer inserted directly from the client — a request only
// exists once Stripe confirms payment (see api/stripe/webhook.ts), so the
// client instead asks the server to start a Checkout session and redirects.
export const startCheckout = async (input: {
  companyId: string;
  type: 'single' | 'multi';
  accreditationBody: AccreditationBody;
  standardIds: string[];
  currency: 'usd' | 'aed';
  term: '1y' | '3y';
  email: string;
}): Promise<{ url: string } | { error: string }> => {
  try {
    const referralCode = localStorage.getItem('gamc_referral_code') || undefined;
    const response = await fetch('/api/stripe/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...input, referralCode, origin: window.location.origin }),
    });
    const data = await response.json();
    if (!response.ok || !data.url) {
      return { error: data.error || 'Could not start checkout' };
    }
    return { url: data.url };
  } catch (error) {
    console.error('startCheckout failed:', error);
    return { error: 'Could not reach the payment server' };
  }
};

export interface SiteSettings {
  metaPixelId: string;
  gaMeasurementId: string;
  gtmContainerId: string;
  googleSiteVerification: string;
  customHeadCode: string;
  customBodyCode: string;
}

const EMPTY_SITE_SETTINGS: SiteSettings = {
  metaPixelId: '',
  gaMeasurementId: '',
  gtmContainerId: '',
  googleSiteVerification: '',
  customHeadCode: '',
  customBodyCode: '',
};

// Public (anon-readable): every visitor's browser needs these to load
// tracking pixels/tags, not just the admin's.
export const fetchSiteSettings = async (): Promise<SiteSettings> => {
  const { data, error } = await supabase
    .from('site_settings')
    .select('meta_pixel_id, ga_measurement_id, gtm_container_id, google_site_verification, custom_head_code, custom_body_code')
    .eq('id', true)
    .maybeSingle();
  if (error || !data) {
    if (error) console.error('fetchSiteSettings failed:', error.message);
    return EMPTY_SITE_SETTINGS;
  }
  return {
    metaPixelId: data.meta_pixel_id ?? '',
    gaMeasurementId: data.ga_measurement_id ?? '',
    gtmContainerId: data.gtm_container_id ?? '',
    googleSiteVerification: data.google_site_verification ?? '',
    customHeadCode: data.custom_head_code ?? '',
    customBodyCode: data.custom_body_code ?? '',
  };
};

// Admin-only (enforced by RLS): overwrites the single settings row.
export const updateSiteSettings = async (settings: SiteSettings): Promise<boolean> => {
  const { error } = await supabase
    .from('site_settings')
    .update({
      meta_pixel_id: settings.metaPixelId || null,
      ga_measurement_id: settings.gaMeasurementId || null,
      gtm_container_id: settings.gtmContainerId || null,
      google_site_verification: settings.googleSiteVerification || null,
      custom_head_code: settings.customHeadCode || null,
      custom_body_code: settings.customBodyCode || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', true);
  if (error) {
    console.error('updateSiteSettings failed:', error.message);
    return false;
  }
  return true;
};

export interface TrainingLeadInput {
  fullName: string;
  email: string;
  phone: string;
  company: string;
  standardCode: string;
  message: string;
}

export const submitTrainingLead = async (input: TrainingLeadInput): Promise<{ success: true } | { error: string }> => {
  try {
    const response = await fetch('/api/leads/submit-training-inquiry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    const data = await response.json();
    if (!response.ok || !data.success) {
      return { error: data.error || 'Could not submit your request' };
    }
    return { success: true };
  } catch (error) {
    console.error('submitTrainingLead failed:', error);
    return { error: 'Could not reach the server' };
  }
};

export interface TrainingLead {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  company: string | null;
  standardCode: string | null;
  message: string | null;
  emailSent: boolean;
  createdAt: string;
}

// Admin-only (enforced by RLS).
export const fetchTrainingLeads = async (): Promise<TrainingLead[]> => {
  const { data, error } = await supabase
    .from('training_leads')
    .select('id, full_name, email, phone, company, standard_code, message, email_sent, created_at')
    .order('created_at', { ascending: false });
  if (error) {
    console.error('fetchTrainingLeads failed:', error.message);
    return [];
  }
  return (data || []).map((row) => ({
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    phone: row.phone,
    company: row.company,
    standardCode: row.standard_code,
    message: row.message,
    emailSent: row.email_sent,
    createdAt: row.created_at,
  }));
};

export interface ReferralCode {
  id: string;
  code: string;
  referrerName: string;
  referrerContact: string | null;
  createdAt: string;
}

const slugifyForCode = (name: string): string =>
  name
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, '')
    .slice(0, 10) || 'REF';

// Admin-only (enforced by RLS).
export const createReferralCode = async (referrerName: string, referrerContact: string): Promise<ReferralCode | { error: string }> => {
  const code = `${slugifyForCode(referrerName)}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
  const { data, error } = await supabase
    .from('referral_codes')
    .insert({ code, referrer_name: referrerName, referrer_contact: referrerContact || null })
    .select('id, code, referrer_name, referrer_contact, created_at')
    .single();
  if (error) {
    console.error('createReferralCode failed:', error.message);
    return { error: error.message };
  }
  return {
    id: data.id,
    code: data.code,
    referrerName: data.referrer_name,
    referrerContact: data.referrer_contact,
    createdAt: data.created_at,
  };
};

// Admin-only (enforced by RLS).
export const fetchReferralCodes = async (): Promise<ReferralCode[]> => {
  const { data, error } = await supabase
    .from('referral_codes')
    .select('id, code, referrer_name, referrer_contact, created_at')
    .order('created_at', { ascending: false });
  if (error) {
    console.error('fetchReferralCodes failed:', error.message);
    return [];
  }
  return (data || []).map((row) => ({
    id: row.id,
    code: row.code,
    referrerName: row.referrer_name,
    referrerContact: row.referrer_contact,
    createdAt: row.created_at,
  }));
};

export interface ReferredOrder {
  id: string;
  referralCode: string;
  companyName: string;
  amount: number;
  currency: 'usd' | 'aed';
  createdAt: string;
}

// Admin-only (enforced by RLS on iso_requests). Every row here represents a
// paid order (iso_requests is only ever written by the Stripe webhook after
// payment), so each one owes AED 500 in commission to its referral_code.
export const fetchReferredOrders = async (): Promise<ReferredOrder[]> => {
  const { data, error } = await supabase
    .from('iso_requests')
    .select('id, referral_code, amount, currency, created_at, companies(name)')
    .not('referral_code', 'is', null)
    .order('created_at', { ascending: false });
  if (error) {
    console.error('fetchReferredOrders failed:', error.message);
    return [];
  }
  return (data || []).map((row: any) => ({
    id: row.id,
    referralCode: row.referral_code,
    companyName: row.companies?.name ?? 'Unknown',
    amount: row.amount,
    currency: row.currency ?? 'usd',
    createdAt: row.created_at,
  }));
};

export const updateRequestStatusInDb = async (id: string, status: RequestStatus): Promise<boolean> => {
  const { error } = await supabase
    .from('iso_requests')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) {
    console.error('updateRequestStatusInDb failed:', error.message);
    return false;
  }
  return true;
};
