import React, { useEffect, useState } from 'react';
import { BookOpen, User, Trophy, LogIn } from 'lucide-react';
import Hero from './components/Hero';
import CompetitionDashboard from './components/CompetitionDashboard';
import AuthOnboarding from './components/AuthOnboarding';
import EducationResources from './components/EducationResources';

const navItems = [
  { id: 'home', label: 'Home', icon: Trophy },
  { id: 'dashboard', label: 'Competition', icon: Trophy },
  { id: 'learn', label: 'Learn', icon: BookOpen },
  { id: 'account', label: 'Account', icon: User },
];

export default function App() {
  const [active, setActive] = useState('home');
  const [isMobileNavOpen, setMobileNavOpen] = useState(false);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    const a = localStorage.getItem('aiinvest_authed');
    if (a === '1') setAuthed(true);
  }, []);

  useEffect(() => {
    const onHash = () => {
      const id = window.location.hash.replace('#', '') || 'home';
      setActive(id);
    };
    window.addEventListener('hashchange', onHash);
    onHash();
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const go = (id) => {
    setActive(id);
    window.location.hash = id;
    setMobileNavOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#f5f7fa] text-slate-900">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-slate-200" role="navigation" aria-label="Primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-[#1a365d]" aria-hidden />
            <span className="font-semibold tracking-tight text-[#1a365d]">AIVest Arena</span>
          </div>
          <nav className="hidden md:flex items-center gap-1" role="menubar">
            {navItems.map((n) => {
              const Icon = n.icon;
              const activeNow = active === n.id;
              return (
                <button
                  key={n.id}
                  onClick={() => go(n.id)}
                  role="menuitem"
                  className={`inline-flex items-center gap-2 px-3 py-2 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#2e7d32] ${
                    activeNow ? 'bg-[#1a365d] text-white' : 'text-slate-700 hover:bg-slate-100'
                  }`}
                  aria-current={activeNow ? 'page' : undefined}
                >
                  <Icon size={18} aria-hidden />
                  <span>{n.label}</span>
                </button>
              );
            })}
            <button
              onClick={() => go('account')}
              className="ml-2 inline-flex items-center gap-2 px-3 py-2 rounded-md bg-[#2e7d32] text-white hover:bg-[#27632a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#2e7d32]"
              aria-label="Log in or Register"
            >
              <LogIn size={18} />
              <span>{authed ? 'My Dashboard' : 'Sign In'}</span>
            </button>
          </nav>
          <button
            className="md:hidden inline-flex items-center px-3 py-2 rounded-md border border-slate-300 text-slate-700"
            onClick={() => setMobileNavOpen((v) => !v)}
            aria-expanded={isMobileNavOpen}
            aria-controls="mobile-nav"
          >
            Menu
          </button>
        </div>
        {isMobileNavOpen && (
          <div id="mobile-nav" className="md:hidden border-t border-slate-200">
            <div className="px-4 py-2 flex flex-col">
              {navItems.map((n) => (
                <button
                  key={n.id}
                  onClick={() => go(n.id)}
                  className={`text-left px-3 py-2 rounded-md ${active === n.id ? 'bg-[#1a365d] text-white' : 'hover:bg-slate-100'}`}
                >
                  {n.label}
                </button>
              ))}
              <button onClick={() => go('account')} className="mt-2 px-3 py-2 rounded-md bg-[#2e7d32] text-white">
                {authed ? 'My Dashboard' : 'Sign In'}
              </button>
            </div>
          </div>
        )}
      </header>

      <main>
        {active === 'home' && <Hero onGetStarted={() => go('account')} onViewLeaderboard={() => go('dashboard')} />}
        {active === 'dashboard' && <CompetitionDashboard onSelectModel={() => go('dashboard')} />}
        {active === 'learn' && <EducationResources />}
        {active === 'account' && (
          <AuthOnboarding onAuthenticated={() => { setAuthed(true); go('dashboard'); }} />
        )}
      </main>

      <footer className="mt-16 border-t border-slate-200 py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-600">
          <p>© {new Date().getFullYear()} AIVest Arena. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#learn" onClick={(e)=>{e.preventDefault(); go('learn');}} className="hover:text-[#1a365d] underline-offset-4 hover:underline">Education</a>
            <a href="#dashboard" onClick={(e)=>{e.preventDefault(); go('dashboard');}} className="hover:text-[#1a365d] underline-offset-4 hover:underline">Leaderboard</a>
            <a href="#account" onClick={(e)=>{e.preventDefault(); go('account');}} className="hover:text-[#1a365d] underline-offset-4 hover:underline">Account</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
