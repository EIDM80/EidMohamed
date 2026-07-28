
import React, { useState } from 'react';
import { ShieldCheck, Mail, Lock, Building2, User, ArrowRight, Github, Chrome } from 'lucide-react';
import { Language } from '../translations';
import Logo from './Logo';

interface AuthProps {
  onAuthenticate: () => void;
  mode: 'login' | 'signup';
  setMode: (mode: 'login' | 'signup') => void;
  lang: Language;
}

const Auth: React.FC<AuthProps> = ({ onAuthenticate, mode, setMode, lang }) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      onAuthenticate();
    }, 1200);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 animate-in fade-in duration-700">
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-100 mb-6 p-2">
            <Logo size={64} color="white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">ISO-Cert Portal</h1>
          <p className="text-slate-500 mt-2">Global Certification & Compliance Hub</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 p-8">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-900">
              {mode === 'login' ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {mode === 'login' 
                ? 'Enter your credentials to access your dashboard' 
                : 'Join our platform to manage your company certifications'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === 'signup' && (
              <>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                    <User size={14} /> Full Name
                  </label>
                  <input 
                    required
                    type="text" 
                    placeholder="John Doe"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                    <Building2 size={14} /> Company Name
                  </label>
                  <input 
                    required
                    type="text" 
                    placeholder="Acme Corp"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                  />
                </div>
              </>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <Mail size={14} /> Email Address
              </label>
              <input 
                required
                type="email" 
                placeholder="john@example.com"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                  <Lock size={14} /> Password
                </label>
                {mode === 'login' && (
                  <button type="button" className="text-xs font-bold text-indigo-600 hover:text-indigo-700">
                    Forgot?
                  </button>
                )}
              </div>
              <input 
                required
                type="password" 
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
              />
            </div>

            <button 
              disabled={loading}
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {mode === 'login' ? 'Sign In' : 'Create Account'}
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase font-bold">
                <span className="bg-white px-3 text-slate-400">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <button className="flex items-center justify-center gap-2 py-3 px-4 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
                <Chrome size={18} /> Google
              </button>
              <button className="flex items-center justify-center gap-2 py-3 px-4 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
                <Github size={18} /> GitHub
              </button>
            </div>
          </div>
        </div>

        {/* Footer Link */}
        <p className="text-center mt-8 text-sm text-slate-600">
          {mode === 'login' ? "Don't have an account?" : "Already have an account?"}{' '}
          <button 
            onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
            className="font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            {mode === 'login' ? 'Sign up for free' : 'Sign in to account'}
          </button>
        </p>

        {/* Security Badge */}
        <div className="mt-12 flex items-center justify-center gap-2 text-slate-400 grayscale opacity-50">
          <Logo size={16} color="#94a3b8" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Enterprise Grade Security</span>
        </div>
      </div>
    </div>
  );
};

export default Auth;
