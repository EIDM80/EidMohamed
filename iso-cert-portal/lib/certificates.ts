import { supabase } from './supabaseClient';

const BUCKET = 'certificates';

export interface CertificateFile {
  name: string;
  path: string;
  createdAt: string;
}

// Objects live at "{requestId}/{timestamp}_{filename}" so RLS can tie access
// back to the owning company (see supabase/schema.sql) without a metadata table.
export const listCertificateFiles = async (requestId: string): Promise<CertificateFile[]> => {
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .list(requestId, { sortBy: { column: 'created_at', order: 'desc' } });
  if (error) {
    console.error('listCertificateFiles failed:', error.message);
    return [];
  }
  return (data || [])
    .filter((f) => f.id)
    .map((f) => ({
      name: f.name.replace(/^\d+_/, ''),
      path: `${requestId}/${f.name}`,
      createdAt: f.created_at ?? '',
    }));
};

// Admin-only (enforced by RLS).
export const uploadCertificateFile = async (requestId: string, file: File): Promise<{ success: true } | { error: string }> => {
  const path = `${requestId}/${Date.now()}_${file.name}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file);
  if (error) {
    console.error('uploadCertificateFile failed:', error.message);
    return { error: error.message };
  }
  return { success: true };
};

export const getCertificateDownloadUrl = async (path: string): Promise<string | null> => {
  const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(path, 600);
  if (error || !data) {
    console.error('getCertificateDownloadUrl failed:', error?.message);
    return null;
  }
  return data.signedUrl;
};

// Admin-only (enforced by RLS).
export const deleteCertificateFile = async (path: string): Promise<boolean> => {
  const { error } = await supabase.storage.from(BUCKET).remove([path]);
  if (error) {
    console.error('deleteCertificateFile failed:', error.message);
    return false;
  }
  return true;
};
