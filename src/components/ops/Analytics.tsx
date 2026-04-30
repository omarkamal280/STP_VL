import React, { useState } from 'react';
import { BarChart2, TrendingUp, Scale, Clock } from 'lucide-react';
import { mockViolationTrend, mockViolationByType, mockDisputes, mockViolations } from '../../mockData';

function MiniBar({ value, max, color }: { value: number; max: number; color: string }) {
  return (
    <div className="w-full bg-gray-100 rounded-full h-2">
      <div className={`h-2 rounded-full ${color} transition-all`} style={{ width: `${Math.min((value / max) * 100, 100)}%` }} />
    </div>
  );
}

function TrendChart() {
  const maxCount = Math.max(...mockViolationTrend.map(p => p.count));
  const maxResolved = Math.max(...mockViolationTrend.map(p => p.resolved));
  const maxAny = Math.max(maxCount, maxResolved);
  const H = 120;

  const countPts = mockViolationTrend.map((p, i) => {
    const x = (i / (mockViolationTrend.length - 1)) * 600;
    const y = H - (p.count / maxAny) * H;
    return `${x},${y}`;
  }).join(' ');

  const resolvedPts = mockViolationTrend.map((p, i) => {
    const x = (i / (mockViolationTrend.length - 1)) * 600;
    const y = H - (p.resolved / maxAny) * H;
    return `${x},${y}`;
  }).join(' ');

  const disputePts = mockViolationTrend.map((p, i) => {
    const x = (i / (mockViolationTrend.length - 1)) * 600;
    const y = H - (p.disputes / maxAny) * H;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div>
      <svg viewBox={`0 0 600 ${H + 10}`} className="w-full" style={{ height: 150 }}>
        <polyline points={countPts} fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinejoin="round" />
        <polyline points={resolvedPts} fill="none" stroke="#22c55e" strokeWidth="2" strokeLinejoin="round" strokeDasharray="4 2" />
        <polyline points={disputePts} fill="none" stroke="#f97316" strokeWidth="2" strokeLinejoin="round" strokeDasharray="2 3" />
        {mockViolationTrend.map((p, i) => {
          const x = (i / (mockViolationTrend.length - 1)) * 600;
          const y = H - (p.count / maxAny) * H;
          return <circle key={i} cx={x} cy={y} r="3" fill="#3b82f6" />;
        })}
      </svg>
      <div className="flex items-center gap-4 mt-2 justify-center">
        <span className="flex items-center gap-1.5 text-xs text-gray-500"><span className="w-4 h-0.5 bg-blue-500 inline-block" />New</span>
        <span className="flex items-center gap-1.5 text-xs text-gray-500"><span className="w-4 h-0.5 bg-green-500 inline-block border-dashed" />Resolved</span>
        <span className="flex items-center gap-1.5 text-xs text-gray-500"><span className="w-4 h-0.5 bg-orange-500 inline-block" />Disputed</span>
      </div>
    </div>
  );
}

export default function Analytics() {
  const [period] = useState('Apr 2025');

  const totalVios = mockViolationByType.reduce((s, t) => s + t.count, 0);
  const avgDisputeRate = Math.round(mockViolationByType.reduce((s, t) => s + t.disputeRate, 0) / mockViolationByType.length);
  const avgResolutionDays = Math.round(mockViolationByType.reduce((s, t) => s + t.avgResolutionDays, 0) / mockViolationByType.length);

  const resolvedDisputes = mockDisputes.filter(d => !['open', 'under_review'].includes(d.status));
  const overturnedCount = resolvedDisputes.filter(d => d.resolution === 'overturned' || d.resolution === 'partial').length;
  const upheldCount = resolvedDisputes.filter(d => d.resolution === 'upheld').length;

  const byCountry: Record<string, number> = {};
  mockViolations.forEach(v => { byCountry[v.countryCode] = (byCountry[v.countryCode] ?? 0) + 1; });
  const maxCountry = Math.max(...Object.values(byCountry));

  const bySeverity = { low: 0, medium: 0, high: 0, critical: 0 };
  mockViolations.forEach(v => { bySeverity[v.severity]++; });

  return (
    <div className="space-y-8">
      {/* Summary KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Total Violations</p>
          <p className="text-3xl font-black text-gray-900">{totalVios}</p>
          <p className="text-xs text-gray-400 mt-1">{period}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Avg Dispute Rate</p>
          <p className="text-3xl font-black text-orange-600">{avgDisputeRate}%</p>
          <p className="text-xs text-gray-400 mt-1">across all types</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Avg Resolution</p>
          <p className="text-3xl font-black text-blue-600">{avgResolutionDays}d</p>
          <p className="text-xs text-gray-400 mt-1">days to close</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Seller Win Rate</p>
          <p className="text-3xl font-black text-green-600">
            {resolvedDisputes.length > 0 ? Math.round((overturnedCount / resolvedDisputes.length) * 100) : 0}%
          </p>
          <p className="text-xs text-gray-400 mt-1">of disputes overturned</p>
        </div>
      </div>

      {/* Trend Chart + Dispute Outcomes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-500" />Violation Trend — {period}
            </h2>
          </div>
          <TrendChart />
          <div className="flex justify-between mt-2">
            <span className="text-[10px] text-gray-400">{mockViolationTrend[0].date}</span>
            <span className="text-[10px] text-gray-400">{mockViolationTrend[mockViolationTrend.length - 1].date}</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-5">
          <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <Scale className="w-4 h-4 text-orange-500" />Dispute Outcomes
          </h2>
          {resolvedDisputes.length === 0 ? (
            <p className="text-sm text-gray-400">No resolved disputes yet</p>
          ) : (
            <>
              <div className="flex gap-3">
                <div className="flex-1 bg-red-50 rounded-xl p-3 text-center">
                  <p className="text-2xl font-black text-red-600">{upheldCount}</p>
                  <p className="text-xs text-red-500 mt-0.5">Upheld</p>
                  <p className="text-[10px] text-gray-400">{Math.round((upheldCount / resolvedDisputes.length) * 100)}%</p>
                </div>
                <div className="flex-1 bg-green-50 rounded-xl p-3 text-center">
                  <p className="text-2xl font-black text-green-600">{overturnedCount}</p>
                  <p className="text-xs text-green-500 mt-0.5">Overturned</p>
                  <p className="text-[10px] text-gray-400">{Math.round((overturnedCount / resolvedDisputes.length) * 100)}%</p>
                </div>
              </div>
              {/* Donut visual using CSS */}
              <div className="flex justify-center">
                <div className="relative w-24 h-24">
                  <svg viewBox="0 0 36 36" className="w-24 h-24 -rotate-90">
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="#fee2e2" strokeWidth="3.2" />
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="#ef4444" strokeWidth="3.2"
                      strokeDasharray={`${(upheldCount / resolvedDisputes.length) * 100} 100`} />
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="#22c55e" strokeWidth="3.2"
                      strokeDasharray={`${(overturnedCount / resolvedDisputes.length) * 100} 100`}
                      strokeDashoffset={`${-((upheldCount / resolvedDisputes.length) * 100)}`} />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-lg font-black text-gray-800">{resolvedDisputes.length}</p>
                    <p className="text-[9px] text-gray-400">resolved</p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Severity breakdown */}
          <div className="space-y-2 pt-2 border-t border-gray-100">
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">By Severity</p>
            {(['critical', 'high', 'medium', 'low'] as const).map(s => (
              <div key={s} className="flex items-center gap-2">
                <span className={`text-[10px] font-bold w-14 flex-shrink-0 capitalize ${s === 'critical' ? 'text-red-600' : s === 'high' ? 'text-orange-600' : s === 'medium' ? 'text-yellow-600' : 'text-green-600'}`}>{s}</span>
                <div className="flex-1"><MiniBar value={bySeverity[s]} max={mockViolations.length} color={s === 'critical' ? 'bg-red-500' : s === 'high' ? 'bg-orange-400' : s === 'medium' ? 'bg-yellow-400' : 'bg-green-400'} /></div>
                <span className="text-xs font-semibold text-gray-600 w-4 text-right">{bySeverity[s]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Violation Type Breakdown */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2 mb-5">
          <BarChart2 className="w-4 h-4 text-purple-500" />Violations by Type
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider text-left">
                <th className="pb-3 pr-4">Violation Type</th>
                <th className="pb-3 pr-4 text-right">Total</th>
                <th className="pb-3 pr-4">Volume</th>
                <th className="pb-3 pr-4 text-right">Open</th>
                <th className="pb-3 pr-4 text-right">Dispute Rate</th>
                <th className="pb-3 text-right flex items-center gap-1 justify-end"><Clock className="w-3 h-3" />Avg Days</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {mockViolationByType.map(t => {
                const maxCount = Math.max(...mockViolationByType.map(x => x.count));
                return (
                  <tr key={t.code} className="hover:bg-gray-50">
                    <td className="py-3 pr-4">
                      <p className="font-semibold text-gray-800 text-xs">{t.label}</p>
                      <p className="text-[10px] text-gray-400">{t.code}</p>
                    </td>
                    <td className="py-3 pr-4 text-right font-bold text-gray-800">{t.count}</td>
                    <td className="py-3 pr-8 min-w-[120px]">
                      <MiniBar value={t.count} max={maxCount} color="bg-blue-400" />
                    </td>
                    <td className="py-3 pr-4 text-right">
                      <span className={`font-semibold ${t.openCount > 0 ? 'text-orange-600' : 'text-gray-400'}`}>{t.openCount}</span>
                    </td>
                    <td className="py-3 pr-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <MiniBar value={t.disputeRate} max={100} color={t.disputeRate > 60 ? 'bg-orange-400' : t.disputeRate > 40 ? 'bg-yellow-400' : 'bg-green-400'} />
                        <span className="text-xs font-semibold text-gray-600 w-8">{t.disputeRate}%</span>
                      </div>
                    </td>
                    <td className="py-3 text-right">
                      <span className={`text-xs font-bold ${t.avgResolutionDays > 14 ? 'text-red-600' : t.avgResolutionDays > 7 ? 'text-orange-600' : 'text-green-600'}`}>{t.avgResolutionDays}d</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Country Breakdown */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">Violations by Country</h2>
        <div className="space-y-2">
          {Object.entries(byCountry).sort((a, b) => b[1] - a[1]).map(([country, count]) => (
            <div key={country} className="flex items-center gap-3">
              <span className="text-xs font-bold text-gray-700 w-8">{country}</span>
              <div className="flex-1"><MiniBar value={count} max={maxCountry} color="bg-purple-400" /></div>
              <span className="text-xs font-bold text-gray-600 w-4 text-right">{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
