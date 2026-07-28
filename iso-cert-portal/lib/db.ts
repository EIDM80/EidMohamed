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

export const createRequest = async (
  companyId: string,
  input: { type: 'single' | 'multi'; accreditationBody: AccreditationBody; standards: ISOStandard[]; amount: number }
): Promise<boolean> => {
  const { error } = await supabase.from('iso_requests').insert({
    company_id: companyId,
    type: input.type,
    accreditation_body: input.accreditationBody,
    standards: input.standards,
    amount: input.amount,
    status: RequestStatus.SUBMITTED,
  });
  if (error) {
    console.error('createRequest failed:', error.message);
    return false;
  }
  return true;
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
