
import React, { useState } from 'react';
import { Building2, Save, Globe, MapPin, Hash, FileText } from 'lucide-react';
import { Company } from '../types';
import { Language } from '../translations';

interface ProfileProps {
  company: Company;
  onSave: (updated: Company) => void;
  lang: Language;
  t: (key: any) => string;
}

const CompanyProfile: React.FC<ProfileProps> = ({ company, onSave, lang, t }) => {
  const [form, setForm] = useState<Company>(company);
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className={`flex items-center justify-between ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
        <div className={lang === 'ar' ? 'text-right' : 'text-left'}>
          <h2 className="text-2xl font-bold text-slate-900">{t('companyProfile')}</h2>
          <p className="text-slate-500">{lang === 'ar' ? 'إدارة المعلومات القانونية وتفاصيل الاتصال الخاصة بمنظمتك.' : "Manage your organization's legal and contact information."}</p>
        </div>
        {saved && (
          <div className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-lg text-sm font-bold animate-in fade-in">
            {lang === 'ar' ? 'تم حفظ التغييرات بنجاح!' : 'Changes saved successfully!'}
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border shadow-sm overflow-hidden">
        <div className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className={`text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                <Building2 size={14} /> {lang === 'ar' ? 'الاسم التجاري' : 'Trade Name'}
              </label>
              <input 
                type="text" 
                className={`w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 ${lang === 'ar' ? 'text-right' : ''}`}
                value={form.name}
                onChange={e => setForm({...form, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className={`text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                <FileText size={14} /> {lang === 'ar' ? 'الاسم القانوني' : 'Legal Name'}
              </label>
              <input 
                type="text" 
                className={`w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 ${lang === 'ar' ? 'text-right' : ''}`}
                value={form.legalName}
                onChange={e => setForm({...form, legalName: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className={`text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                <Hash size={14} /> {lang === 'ar' ? 'رقم الرخصة التجارية' : 'Trade License No.'}
              </label>
              <input 
                type="text" 
                className={`w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 ${lang === 'ar' ? 'text-right' : ''}`}
                value={form.licenseNo}
                onChange={e => setForm({...form, licenseNo: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className={`text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                <Globe size={14} /> {lang === 'ar' ? 'الموقع الإلكتروني' : 'Website'}
              </label>
              <input 
                type="url" 
                className={`w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 ${lang === 'ar' ? 'text-right' : ''}`}
                value={form.website}
                onChange={e => setForm({...form, website: e.target.value})}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className={`text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
              <MapPin size={14} /> {lang === 'ar' ? 'العنوان المسجل' : 'Registered Address'}
            </label>
            <textarea 
              rows={3}
              className={`w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 ${lang === 'ar' ? 'text-right' : ''}`}
              value={form.address}
              onChange={e => setForm({...form, address: e.target.value})}
            />
          </div>
        </div>
        
        <div className={`px-8 py-4 bg-slate-50 border-t flex ${lang === 'ar' ? 'justify-start' : 'justify-end'}`}>
          <button 
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
          >
            <Save size={18} />
            {lang === 'ar' ? 'حفظ الملف الشخصي' : 'Save Profile'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CompanyProfile;
