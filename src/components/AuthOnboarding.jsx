import React, { useEffect, useState } from 'react';
import { ShieldCheck, User, ChevronRight } from 'lucide-react';

export default function AuthOnboarding({ onAuthenticated }) {
  const [step, setStep] = useState(1);
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [favorite, setFavorite] = useState('AlphaQuant V3');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setError('');
  }, [step, mode]);

  const next = () => setStep((s) => Math.min(3, s + 1));
  const prev = () => setStep((s) => Math.max(1, s - 1));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    await new Promise((r) => setTimeout(r, 600));
    if (!email.includes('@') || password.length < 6) {
      setBusy(false);
      setError('Enter a valid email and a password with at least 6 characters.');
      return;
    }
    localStorage.setItem('aiinvest_authed', '1');
    localStorage.setItem('aiinvest_fav', favorite);
    setBusy(false);
    onAuthenticated?.();
  };

  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-[#2e7d32]" />
            <h2 className="font-semibold text-slate-800">Secure Account</h2>
          </div>
          <div className="flex items-center gap-2 text-sm" aria-label="Onboarding progress">
            <StepDot active={step >= 1} label="Account" />
            <ChevronRight size={16} aria-hidden />
            <StepDot active={step >= 2} label="Profile" />
            <ChevronRight size={16} aria-hidden />
            <StepDot active={step >= 3} label="Complete" />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex gap-2" role="tablist" aria-label="Auth mode">
                <button type="button" role="tab" aria-selected={mode==='login'} onClick={() => setMode('login')} className={`px-3 py-2 rounded-md border text-sm ${mode==='login'?'bg-[#1a365d] text-white border-[#1a365d]':'bg-white border-slate-300'}`}>Login</button>
                <button type="button" role="tab" aria-selected={mode==='register'} onClick={() => setMode('register')} className={`px-3 py-2 rounded-md border text-sm ${mode==='register'?'bg-[#1a365d] text-white border-[#1a365d]':'bg-white border-slate-300'}`}>Register</button>
              </div>
              <div>
                <label htmlFor="email" className="block text-sm text-slate-700">Email</label>
                <input id="email" type="email" autoComplete="email" required value={email} onChange={(e)=>setEmail(e.target.value)} className="mt-1 w-full rounded-md border-slate-300 focus:border-[#1a365d] focus:ring-[#1a365d]" />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm text-slate-700">Password</label>
                <input id="password" type="password" autoComplete={mode==='login'?'current-password':'new-password'} required value={password} onChange={(e)=>setPassword(e.target.value)} className="mt-1 w-full rounded-md border-slate-300 focus:border-[#1a365d] focus:ring-[#1a365d]" />
              </div>
              {error && <p role="alert" className="text-sm text-rose-600">{error}</p>}
              <div className="flex items-center justify-between">
                <button type="button" onClick={next} className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[#2e7d32] text-white hover:bg-[#27632a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#2e7d32]">Continue</button>
                <p className="text-xs text-slate-500">Protected by industry-standard hashing.</p>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <User className="text-[#1a365d]" />
                <h3 className="font-medium text-slate-800">Personalize your dashboard</h3>
              </div>
              <div>
                <label htmlFor="fav" className="block text-sm text-slate-700">Favorite AI Model</label>
                <select id="fav" value={favorite} onChange={(e)=>setFavorite(e.target.value)} className="mt-1 w-full rounded-md border-slate-300 focus:border-[#1a365d] focus:ring-[#1a365d]">
                  <option>AlphaQuant V3</option>
                  <option>NeuralEdge 7</option>
                  <option>OmegaX RL</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <button type="button" onClick={prev} className="px-4 py-2 rounded-md border border-slate-300 bg-white hover:bg-slate-50">Back</button>
                <button type="button" onClick={next} className="px-4 py-2 rounded-md bg-[#2e7d32] text-white hover:bg-[#27632a]">Next</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h3 className="font-medium text-slate-800">Review</h3>
              <ul className="text-sm text-slate-700">
                <li>Email: <span className="ui-serif">{email || '—'}</span></li>
                <li>Favorite: <span className="ui-serif">{favorite}</span></li>
                <li>Mode: <span className="ui-serif">{mode}</span></li>
              </ul>
              <div className="flex items-center justify-between">
                <button type="button" onClick={prev} className="px-4 py-2 rounded-md border border-slate-300 bg-white hover:bg-slate-50">Back</button>
                <button type="submit" disabled={busy} className="px-4 py-2 rounded-md bg-[#1a365d] text-white hover:bg-[#173055] disabled:opacity-60">{busy ? 'Submitting…' : 'Finish'}</button>
              </div>
            </div>
          )}
        </form>
      </div>
    </section>
  );
}

function StepDot({ active, label }) {
  return (
    <div className="flex items-center gap-2">
      <span aria-hidden className={`w-2.5 h-2.5 rounded-full ${active ? 'bg-[#2e7d32]' : 'bg-slate-300'}`} />
      <span className="text-slate-600 text-xs">{label}</span>
    </div>
  );
}
