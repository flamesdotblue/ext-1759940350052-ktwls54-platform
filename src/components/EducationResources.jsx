import React, { useEffect, useState } from 'react';
import { Book, PlayCircle, CheckCircle2 } from 'lucide-react';

const lessons = [
  { id: 'l1', title: 'What is Sharpe Ratio?', minutes: 6, level: 'Beginner' },
  { id: 'l2', title: 'Understanding Max Drawdown', minutes: 7, level: 'Beginner' },
  { id: 'l3', title: 'Building AI Factor Models', minutes: 12, level: 'Intermediate' },
  { id: 'l4', title: 'Risk Parity with Reinforcement Learning', minutes: 15, level: 'Advanced' },
  { id: 'l5', title: 'Backtesting Pitfalls and Biases', minutes: 9, level: 'Intermediate' },
];

export default function EducationResources() {
  const [progress, setProgress] = useState({});

  useEffect(() => {
    const p = localStorage.getItem('aiinvest_progress');
    if (p) setProgress(JSON.parse(p));
  }, []);

  useEffect(() => {
    localStorage.setItem('aiinvest_progress', JSON.stringify(progress));
  }, [progress]);

  const toggle = (id) => setProgress((pr) => ({ ...pr, [id]: !pr[id] }));

  const completed = Object.values(progress).filter(Boolean).length;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" aria-label="Education resources">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Book className="text-[#1a365d]" />
          <h2 className="text-2xl font-bold text-[#1a365d]">Learn AI Investing</h2>
        </div>
        <p className="text-sm text-slate-600">{completed}/{lessons.length} completed</p>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lessons.map((l, idx) => (
          <article key={l.id} className="rounded-xl bg-white border border-slate-200 shadow-sm overflow-hidden focus-within:ring-2 focus-within:ring-[#1a365d]" tabIndex={0}>
            <div className="h-24 bg-gradient-to-r from-[#1a365d] to-[#2e7d32]" aria-hidden />
            <div className="p-4">
              <h3 className="font-semibold text-slate-800">{l.title}</h3>
              <p className="text-sm text-slate-600">{l.level} • {l.minutes} min</p>
              <div className="mt-4 flex items-center justify-between">
                <button onClick={() => toggle(l.id)} className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm ${progress[l.id] ? 'bg-[#2e7d32] text-white' : 'bg-white border border-slate-300 hover:bg-slate-50'}`} aria-pressed={Boolean(progress[l.id])}>
                  {progress[l.id] ? <CheckCircle2 size={16} /> : <PlayCircle size={16} />}
                  {progress[l.id] ? 'Completed' : 'Start lesson'}
                </button>
                <ProgressBar value={progress[l.id] ? 100 : 0} />
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ProgressBar({ value }) {
  return (
    <div className="w-28 h-2 rounded-full bg-slate-100" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={value}>
      <div className="h-full rounded-full" style={{ width: `${value}%`, background: value === 100 ? '#2e7d32' : '#ffc107' }} />
    </div>
  );
}
