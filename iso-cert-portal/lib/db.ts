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
    const response = await fetch('/api/stripe/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...input, origin: window.location.origin }),
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
