import React, { useState, useEffect, useRef } from 'react';
import { X, FileText, Download, Upload, Trash2, Loader2 } from 'lucide-react';
import { ISORequest } from '../types';
import { Language } from '../translations';
import CertificateCountdown from './CertificateCountdown';
import {
  listCertificateFiles,
  uploadCertificateFile,
  getCertificateDownloadUrl,
  deleteCertificateFile,
  CertificateFile,
} from '../lib/certificates';

interface Props {
  request: ISORequest;
  lang: Language;
  isAdmin: boolean;
  onClose: () => void;
}

const RequestDetailModal: React.FC<Props> = ({ request, lang, isAdmin, onClose }) => {
  const isAr = lang === 'ar';
  const [files, setFiles] = useState<CertificateFile[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [downloadingPath, setDownloadingPath] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const refreshFiles = async () => {
    setLoadingFiles(true);
    setFiles(await listCertificateFiles(request.id));
    setLoadingFiles(false);
  };

  useEffect(() => {
    refreshFiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [request.id]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError(null);
    const result = await uploadCertificateFile(request.id, file);
    setUploading(false);
    if ('error' in result) {
      setUploadError(result.error);
      return;
    }
    await refreshFiles();
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDownload = async (file: CertificateFile) => {
    setDownloadingPath(file.path);
    const url = await getCertificateDownloadUrl(file.path);
    setDownloadingPath(null);
    if (url) window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleDelete = async (file: CertificateFile) => {
    if (!confirm(isAr ? 'هل تريد حذف هذا الملف؟' : 'Delete this file?')) return;
    const ok = await deleteCertificateFile(file.path);
    if (ok) await refreshFiles();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">{request.company.name}</p>
            <h3 className="font-extrabold text-slate-900 text-lg">{request.id}</h3>
            <div className="flex gap-1 flex-wrap mt-2">
              {request.standards.map((s) => (
                <span
                  key={s.id}
                  className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] font-bold rounded border border-indigo-100"
                >
                  {s.code}
                </span>
              ))}
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-colors shrink-0">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <CertificateCountdown
            createdAt={request.createdAt}
            standardCodes={request.standards.map((s) => s.code)}
            lang={lang}
          />

          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold text-slate-900 text-sm">{isAr ? 'الملفات والشهادات' : 'Files & Certificates'}</h4>
              {isAdmin && (
                <label className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg cursor-pointer transition-all">
                  {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                  <span>{uploading ? (isAr ? 'جارٍ الرفع...' : 'Uploading...') : (isAr ? 'رفع ملف' : 'Upload File')}</span>
                  <input ref={fileInputRef} type="file" className="hidden" onChange={handleUpload} disabled={uploading} />
                </label>
              )}
            </div>

            {uploadError && (
              <div className="mb-3 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl">
                {uploadError}
              </div>
            )}

            {loadingFiles ? (
              <div className="text-center py-8 text-slate-400 text-sm">{isAr ? 'جارٍ التحميل...' : 'Loading...'}</div>
            ) : files.length === 0 ? (
              <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <FileText size={28} className="mx-auto text-slate-300 mb-2" />
                <p className="text-sm text-slate-400 font-medium">
                  {isAr ? 'لم يتم رفع أي ملفات بعد.' : 'No files uploaded yet.'}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {files.map((f) => (
                  <div
                    key={f.path}
                    className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <FileText size={18} className="text-indigo-500 shrink-0" />
                      <span className="text-sm font-semibold text-slate-700 truncate">{f.name}</span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleDownload(f)}
                        disabled={downloadingPath === f.path}
                        className="p-2 text-indigo-500 hover:bg-indigo-50 rounded-lg transition-all"
                        title={isAr ? 'تحميل' : 'Download'}
                      >
                        {downloadingPath === f.path ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                      </button>
                      {isAdmin && (
                        <button
                          onClick={() => handleDelete(f)}
                          className="p-2 text-rose-400 hover:bg-rose-50 rounded-lg transition-all"
                          title={isAr ? 'حذف' : 'Delete'}
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestDetailModal;
