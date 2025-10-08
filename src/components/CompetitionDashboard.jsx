import React, { useEffect, useMemo, useState } from 'react';
import { TrendingUp, Filter, Info } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#1a365d', '#2e7d32', '#ffc107', '#3b82f6', '#ef4444', '#14b8a6'];
const timeRanges = ['Daily', 'Weekly', 'Monthly', 'YTD'];

const initialModels = [
  {
    id: 'alpha-1', name: 'AlphaQuant V3', returns: 18.6, sharpe: 1.42, mdd: -6.3,
    seriesSeed: 1,
    sectors: [
      { name: 'Tech', value: 38 }, { name: 'Health', value: 18 }, { name: 'Finance', value: 16 }, { name: 'Energy', value: 10 }, { name: 'Other', value: 18 },
    ],
  },
  {
    id: 'neuron-7', name: 'NeuralEdge 7', returns: 22.9, sharpe: 1.66, mdd: -7.4,
    seriesSeed: 2,
    sectors: [
      { name: 'Tech', value: 42 }, { name: 'Health', value: 12 }, { name: 'Finance', value: 14 }, { name: 'Energy', value: 8 }, { name: 'Other', value: 24 },
    ],
  },
  {
    id: 'omega-x', name: 'OmegaX RL', returns: 15.1, sharpe: 1.12, mdd: -5.0,
    seriesSeed: 3,
    sectors: [
      { name: 'Tech', value: 33 }, { name: 'Health', value: 17 }, { name: 'Finance', value: 20 }, { name: 'Energy', value: 9 }, { name: 'Other', value: 21 },
    ],
  },
];

export default function CompetitionDashboard() {
  const [range, setRange] = useState('Monthly');
  const [loading, setLoading] = useState(true);
  const [models, setModels] = useState(initialModels);
  const [selected, setSelected] = useState(initialModels[0]);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(t);
  }, []);

  const leaderboard = useMemo(() => {
    return [...models].sort((a, b) => b.returns - a.returns);
  }, [models]);

  const chartData = useMemo(() => buildSeriesData(models, range), [models, range]);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" aria-label="Competition dashboard">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#1a365d]">Competition Leaderboard</h2>
          <p className="text-sm text-slate-600">Compare model returns, risk-adjusted performance, and drawdowns.</p>
        </div>
        <div className="flex items-center gap-2" role="group" aria-label="Select time period">
          <Filter size={18} className="text-slate-500" aria-hidden />
          {timeRanges.map((t) => (
            <button
              key={t}
              onClick={() => setRange(t)}
              className={`px-3 py-1.5 rounded-full text-sm border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#1a365d] ${
                range === t ? 'bg-[#1a365d] text-white border-[#1a365d]' : 'bg-white border-slate-300 hover:bg-slate-50'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 rounded-xl bg-white border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <TrendingUp size={18} className="text-[#2e7d32]" />
              <h3 className="font-semibold text-slate-800">Model Performance</h3>
            </div>
            <span className="text-xs text-slate-500">{range}</span>
          </div>
          {loading ? (
            <div className="h-[280px] animate-pulse bg-slate-100 rounded-md" aria-busy="true" aria-live="polite" />
          ) : (
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  {models.map((m, idx) => (
                    <Line key={m.id} type="monotone" dataKey={m.id} name={m.name} stroke={COLORS[idx % COLORS.length]} strokeWidth={2} dot={false} />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
          <div className="mt-3 text-xs text-slate-600 flex items-start gap-2">
            <Info size={14} className="mt-0.5 text-slate-500" aria-hidden />
            <div>
              <p>Sharpe greater than 1 suggests favorable risk-adjusted performance. Max drawdown indicates worst historical drop. Compare timeframes to assess stability.</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 rounded-xl bg-white border border-slate-200 p-4 shadow-sm">
          <h3 className="font-semibold text-slate-800">Leaderboard</h3>
          {loading ? (
            <div className="mt-3 space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-slate-100 rounded-md animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="mt-2 overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-600">
                    <th className="py-2 pr-4">Model</th>
                    <th className="py-2 pr-4">Return</th>
                    <th className="py-2 pr-4">Sharpe</th>
                    <th className="py-2">Max DD</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((m, idx) => (
                    <tr key={m.id} className={`border-t border-slate-100 hover:bg-slate-50 focus-within:bg-slate-50 ${selected.id === m.id ? 'bg-[#f5f7fa]' : ''}`}>
                      <td className="py-2 pr-4">
                        <button
                          onClick={() => setSelected(m)}
                          className="text-left w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#2e7d32] rounded"
                          aria-pressed={selected.id === m.id}
                        >
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold" style={{ backgroundColor: idx === 0 ? '#ffc107' : '#e2e8f0', color: idx === 0 ? '#1a365d' : '#334155' }}>{idx + 1}</span>
                            <span className="font-medium text-slate-800">{m.name}</span>
                          </div>
                        </button>
                      </td>
                      <td className="py-2 pr-4 ui-serif font-semibold text-[#1a365d]">{m.returns.toFixed(1)}%</td>
                      <td className="py-2 pr-4 ui-serif">{m.sharpe.toFixed(2)}</td>
                      <td className="py-2 ui-serif text-rose-600">{m.mdd.toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="rounded-xl bg-white border border-slate-200 p-4 shadow-sm">
          <h3 className="font-semibold text-slate-800">{selected.name} • Sector Allocation</h3>
          {loading ? (
            <div className="h-[240px] bg-slate-100 rounded-md animate-pulse mt-2" />
          ) : (
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={selected.sectors} dataKey="value" nameKey="name" outerRadius={90} innerRadius={50}>
                    {selected.sectors.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
        <div className="rounded-xl bg-white border border-slate-200 p-4 shadow-sm lg:col-span-2">
          <h3 className="font-semibold text-slate-800">{selected.name} • Trade Timeline</h3>
          {loading ? (
            <div className="h-[240px] bg-slate-100 rounded-md animate-pulse mt-2" />
          ) : (
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={buildSingleSeries(selected.seriesSeed, range)} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" name="PnL" stroke="#2e7d32" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="rounded-xl bg-white border border-slate-200 p-4 shadow-sm">
          <h3 className="font-semibold text-slate-800">Risk Metrics</h3>
          <p className="text-sm text-slate-600">Volatility, Value-at-Risk, and correlation heatmap.</p>
          <Heatmap ariaLabel="Risk correlation heatmap" />
        </div>
        <div className="rounded-xl bg-white border border-slate-200 p-4 shadow-sm lg:col-span-2">
          <h3 className="font-semibold text-slate-800">Insights</h3>
          <ul className="mt-2 text-sm text-slate-700 list-disc pl-5">
            <li>{selected.name} maintains balanced sector exposure with emphasis on technology.</li>
            <li>Risk control appears consistent with moderate drawdowns.</li>
            <li>Review multi-period consistency to evaluate regime robustness.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

function buildSeriesData(models, range) {
  const points = range === 'Daily' ? 14 : range === 'Weekly' ? 8 : range === 'Monthly' ? 12 : 10;
  const arr = Array.from({ length: points }).map((_, i) => ({ name: labelForIndex(i, range) }));
  return arr.map((row, idx) => {
    const out = { ...row };
    models.forEach((m) => {
      const base = m.seriesSeed * 10 + idx * (m.seriesSeed + 3);
      out[m.id] = Number((100 + Math.sin((idx + m.seriesSeed) / 2) * 5 + base % 7 - 3).toFixed(2));
    });
    return out;
  });
}

function buildSingleSeries(seed, range) {
  const points = range === 'Daily' ? 20 : range === 'Weekly' ? 16 : range === 'Monthly' ? 12 : 24;
  return Array.from({ length: points }).map((_, i) => ({
    name: labelForIndex(i, range),
    value: Number((Math.sin((i + seed) / 3) * 8 + (i * 1.2) + (seed % 5)).toFixed(2)),
  }));
}

function labelForIndex(i, range) {
  if (range === 'Daily') return `D${i + 1}`;
  if (range === 'Weekly') return `W${i + 1}`;
  if (range === 'Monthly') return `M${i + 1}`;
  return `P${i + 1}`;
}

function Heatmap({ ariaLabel = 'Heatmap' }) {
  const headers = ['Vol', 'VaR', 'Beta', 'Corr', 'Skew'];
  const rows = 5;
  const data = Array.from({ length: rows }).map((_, r) => (
    Array.from({ length: headers.length }).map((_, c) => {
      const v = Math.sin(r + c) * 0.5 + 0.5; // 0..1
      return v;
    })
  ));

  return (
    <div className="mt-3" role="table" aria-label={ariaLabel}>
      <div className="grid grid-cols-6 gap-1 text-xs text-slate-600" role="rowgroup">
        <div role="columnheader" className="p-2" />
        {headers.map((h) => (
          <div key={h} role="columnheader" className="p-2 text-center">{h}</div>
        ))}
      </div>
      {data.map((row, ri) => (
        <div key={ri} className="grid grid-cols-6 gap-1 items-center" role="row">
          <div role="rowheader" className="p-2 text-xs text-slate-600">{`R${ri + 1}`}</div>
          {row.map((v, ci) => (
            <div
              key={ci}
              role="cell"
              className="h-8 rounded"
              title={`R${ri + 1} ${headers[ci]}: ${(v * 100).toFixed(0)}%`}
              style={{
                background: `linear-gradient(90deg, rgba(46,125,50,${v}) 0%, rgba(26,54,93,${0.6 * v}) 100%)`,
                border: '1px solid rgba(15, 23, 42, 0.06)'
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
