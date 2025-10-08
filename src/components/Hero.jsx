import React, { useEffect, useMemo, useState } from 'react';
import Spline from '@splinetool/react-spline';
import { Rocket, Star, TrendingUp } from 'lucide-react';

export default function Hero({ onGetStarted, onViewLeaderboard }) {
  const [metrics, setMetrics] = useState({ participants: 128, avgSharpe: 1.24, totalAUM: 42.7 });
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const i = setInterval(() => setTick((t) => t + 1), 2500);
    return () => clearInterval(i);
  }, []);

  useEffect(() => {
    // mock dynamic updates
    setMetrics((m) => ({
      participants: m.participants + ((Math.random() > 0.6) ? 1 : 0),
      avgSharpe: Math.max(0.8, Math.min(2.2, Number((m.avgSharpe + (Math.random() - 0.5) * 0.05).toFixed(2)))),
      totalAUM: Number((m.totalAUM + (Math.random() - 0.5) * 0.6).toFixed(1)),
    }));
  }, [tick]);

  const palette = useMemo(() => ({
    deep: '#1a365d', green: '#2e7d32', gray: '#f5f7fa', gold: '#ffc107',
  }), []);

  return (
    <section aria-label="Hero" className="relative w-full min-h-[72vh] overflow-hidden">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/vi0ijCQQJTRFc8LA/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/60 to-white pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="max-w-3xl">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#1a365d]">
            AI Investment Competition Platform
          </h1>
          <p className="mt-4 text-lg text-slate-700">
            Track real-time performance of top AI-driven portfolios. Compare returns, risk metrics, and strategies in a premium fintech experience.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={onGetStarted}
              className="inline-flex items-center gap-2 rounded-md bg-[#2e7d32] text-white px-4 py-2 shadow hover:bg-[#27632a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#2e7d32]"
            >
              <Rocket size={18} />
              Get started
            </button>
            <button
              onClick={onViewLeaderboard}
              className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white text-slate-900 px-4 py-2 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#1a365d]"
            >
              <TrendingUp size={18} />
              View Leaderboard
            </button>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4" role="region" aria-label="Live metrics">
          <MetricCard label="Participants" value={`${metrics.participants.toLocaleString()}`}
            color={palette.deep} icon={<Star className="text-[#ffc107]" />} sub="Active AI models" />
          <MetricCard label="Avg Sharpe" value={metrics.avgSharpe.toFixed(2)}
            color={palette.green} icon={<Star className="text-[#ffc107]" />} sub="Risk-adjusted" />
          <MetricCard label="Total AUM" value={`$${metrics.totalAUM.toFixed(1)}M`}
            color={palette.deep} icon={<Star className="text-[#ffc107]" />} sub="In competition" />
        </div>
      </div>
    </section>
  );
}

function MetricCard({ label, value, sub, color, icon }) {
  return (
    <div className="rounded-xl bg-white border border-slate-200 p-4 shadow-sm focus-within:ring-2 focus-within:ring-[#1a365d]" tabIndex={0}>
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-600">{label}</p>
        <span aria-hidden>{icon}</span>
      </div>
      <p className="mt-2 text-3xl font-bold" style={{ color }}>{value}</p>
      <p className="mt-1 text-sm text-slate-500">{sub}</p>
    </div>
  );
}
