import React, { useState } from 'react';
import {
  Users, AlertTriangle, Shield, Star, TrendingDown, TrendingUp,
  ChevronRight, X, Globe, Mail, Phone, BarChart2,
} from 'lucide-react';
import { mockSellers, mockViolations } from '../../mockData';
import { SellerProfile, AccountHealth, RiskTier } from '../../types';

const HEALTH_META: Record<AccountHealth, { color: string; dot: string }> = {
  Excellent:  { color: 'bg-green-100 text-green-700',  dot: 'bg-green-500' },
  Good:       { color: 'bg-blue-100 text-blue-700',    dot: 'bg-blue-500' },
  Fair:       { color: 'bg-yellow-100 text-yellow-700', dot: 'bg-yellow-500' },
  'At Risk':  { color: 'bg-orange-100 text-orange-700', dot: 'bg-orange-500' },
  Suspended:  { color: 'bg-red-100 text-red-700',      dot: 'bg-red-600' },
};

const RISK_META: Record<RiskTier, { label: string; bar: string }> = {
  low:      { label: 'Low',      bar: 'bg-green-400' },
  medium:   { label: 'Medium',   bar: 'bg-yellow-400' },
  high:     { label: 'High',     bar: 'bg-orange-500' },
  critical: { label: 'Critical', bar: 'bg-red-600' },
};

function HealthSparkline({ history }: { history: { date: string; score: number }[] }) {
  if (!history.length) return null;
  const max = 100;
  const h = 32;
  const w = 80;
  const pts = history.map((p, i) => {
    const x = (i / (history.length - 1)) * w;
    const y = h - (p.score / max) * h;
    return `${x},${y}`;
  }).join(' ');
  const last = history[history.length - 1];
  const first = history[0];
  const up = last.score >= first.score;
  return (
    <div className="flex items-end gap-2">
      <svg width={w} height={h} className="overflow-visible">
        <polyline points={pts} fill="none" stroke={up ? '#22c55e' : '#ef4444'} strokeWidth="2" strokeLinejoin="round" />
      </svg>
      <span className={`text-xs font-semibold flex items-center gap-0.5 ${up ? 'text-green-600' : 'text-red-600'}`}>
        {up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
        {last.score}
      </span>
    </div>
  );
}

function SellerCard({ seller, onClick }: { seller: SellerProfile; onClick: () => void }) {
  const health = HEALTH_META[seller.accountHealth];
  const risk = RISK_META[seller.riskTier];
  const violations = mockViolations.filter(v => v.partnerID === seller.id);
  const openVios = violations.filter(v => !['actioned', 'acquitted', 'closed', 'overturned'].includes(v.status));

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:border-gray-300 hover:shadow-sm cursor-pointer transition-all" onClick={onClick}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-gray-900">{seller.name}</h3>
          <p className="text-xs text-gray-500 mt-0.5">{seller.id}</p>
        </div>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5 ${health.color}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${health.dot}`} />{seller.accountHealth}
        </span>
      </div>

      <div className="flex items-center gap-1.5 mb-3 flex-wrap">
        {seller.countries.map(c => (
          <span key={c} className="text-[10px] font-semibold px-2 py-0.5 bg-gray-100 text-gray-600 rounded">{c}</span>
        ))}
        <span className="text-[10px] text-gray-400 ml-auto flex items-center gap-1">
          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />{seller.sellerRating}
        </span>
      </div>

      {/* Risk Bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] text-gray-500 font-medium">Risk Score</span>
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${risk.bar === 'bg-red-600' ? 'bg-red-100 text-red-700' : risk.bar === 'bg-orange-500' ? 'bg-orange-100 text-orange-700' : risk.bar === 'bg-yellow-400' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
            {risk.label}
          </span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2">
          <div className={`h-2 rounded-full ${risk.bar}`} style={{ width: `${seller.riskScore}%` }} />
        </div>
        <span className="text-[10px] text-gray-400 mt-0.5 block text-right">{seller.riskScore}/100</span>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-gray-50 rounded-lg py-1.5">
          <p className="text-sm font-bold text-gray-800">{seller.priorViolations}</p>
          <p className="text-[10px] text-gray-500">Total Vios</p>
        </div>
        <div className={`rounded-lg py-1.5 ${openVios.length > 0 ? 'bg-orange-50' : 'bg-gray-50'}`}>
          <p className={`text-sm font-bold ${openVios.length > 0 ? 'text-orange-700' : 'text-gray-800'}`}>{openVios.length}</p>
          <p className="text-[10px] text-gray-500">Active</p>
        </div>
        <div className="bg-gray-50 rounded-lg py-1.5">
          <p className="text-sm font-bold text-gray-800">{seller.disputeSuccessRate}%</p>
          <p className="text-[10px] text-gray-500">Win Rate</p>
        </div>
      </div>

      {/* Pattern Alerts */}
      {seller.patternAlerts.length > 0 && (
        <div className="mt-3 flex items-center gap-2">
          <AlertTriangle className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
          <p className="text-xs text-red-600 font-medium">{seller.patternAlerts.length} pattern alert{seller.patternAlerts.length > 1 ? 's' : ''}</p>
        </div>
      )}
    </div>
  );
}

function SellerDetailPanel({ seller, onClose }: { seller: SellerProfile; onClose: () => void }) {
  const violations = mockViolations.filter(v => v.partnerID === seller.id);
  const health = HEALTH_META[seller.accountHealth];
  const risk = RISK_META[seller.riskTier];

  return (
    <div className="fixed inset-y-0 right-0 w-[460px] bg-white border-l border-gray-200 shadow-2xl z-50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50">
        <div>
          <h2 className="text-base font-bold text-gray-900">{seller.name}</h2>
          <p className="text-xs text-gray-500">Seller ID {seller.id}</p>
        </div>
        <button onClick={onClose} className="p-1.5 hover:bg-gray-200 rounded-lg">
          <X className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Health + Badges */}
        <div className="flex items-center gap-3 flex-wrap">
          <span className={`text-sm font-semibold px-3 py-1.5 rounded-full flex items-center gap-2 ${health.color}`}>
            <span className={`w-2 h-2 rounded-full ${health.dot}`} />{seller.accountHealth}
          </span>
          <span className={`text-sm font-semibold px-3 py-1.5 rounded-full ${risk.bar === 'bg-red-600' ? 'bg-red-100 text-red-700' : risk.bar === 'bg-orange-500' ? 'bg-orange-100 text-orange-700' : risk.bar === 'bg-yellow-400' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
            {risk.label} Risk
          </span>
          <span className="text-sm font-semibold px-3 py-1.5 rounded-full bg-yellow-50 text-yellow-700 flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />{seller.sellerRating}
          </span>
        </div>

        {/* Contact Info */}
        <div className="space-y-2">
          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Contact</p>
          <p className="text-sm text-gray-700 flex items-center gap-2"><Mail className="w-4 h-4 text-gray-400" />{seller.email}</p>
          <p className="text-sm text-gray-700 flex items-center gap-2"><Phone className="w-4 h-4 text-gray-400" />{seller.phone}</p>
          <p className="text-sm text-gray-700 flex items-center gap-2"><Globe className="w-4 h-4 text-gray-400" />{seller.countries.join(', ')}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Member Since', value: seller.joinedAt.toLocaleDateString() },
            { label: 'Total Orders', value: seller.totalOrders.toLocaleString() },
            { label: 'GMV (USD)', value: `$${(seller.gmvUSD / 1_000_000).toFixed(1)}M` },
            { label: 'Response Rate', value: `${seller.responseRate}%` },
            { label: 'Avg Response', value: `${seller.avgResponseDays}d` },
            { label: 'Dispute Win Rate', value: `${seller.disputeSuccessRate}%` },
          ].map(s => (
            <div key={s.label} className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500">{s.label}</p>
              <p className="text-sm font-bold text-gray-800 mt-0.5">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Risk Score + Sparkline */}
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Risk Score Trend</p>
            <HealthSparkline history={seller.healthHistory} />
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div className={`h-3 rounded-full ${risk.bar} transition-all`} style={{ width: `${seller.riskScore}%` }} />
          </div>
          <div className="flex justify-between mt-1 text-[10px] text-gray-400">
            <span>0</span><span className="font-bold text-gray-700">{seller.riskScore}</span><span>100</span>
          </div>
        </div>

        {/* Pattern Alerts */}
        {seller.patternAlerts.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-red-500" />Pattern Alerts
            </p>
            {seller.patternAlerts.map((a, i) => (
              <div key={i} className={`rounded-lg p-3 flex gap-3 ${a.severity === 'critical' ? 'bg-red-50 border border-red-200' : 'bg-amber-50 border border-amber-200'}`}>
                <AlertTriangle className={`w-4 h-4 flex-shrink-0 mt-0.5 ${a.severity === 'critical' ? 'text-red-500' : 'text-amber-500'}`} />
                <div>
                  <p className="text-xs font-semibold text-gray-800">{a.type.replace(/_/g, ' ')}</p>
                  <p className="text-xs text-gray-600 mt-0.5">{a.description}</p>
                  <p className="text-[10px] text-gray-400 mt-1">{a.detectedAt.toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Violation History */}
        <div className="space-y-2">
          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider flex items-center gap-1.5">
            <BarChart2 className="w-3.5 h-3.5" />Violation History ({violations.length})
          </p>
          {violations.length === 0 ? (
            <p className="text-sm text-gray-400 py-2">No violations on record</p>
          ) : violations.map(v => (
            <div key={v.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
              <div>
                <p className="text-xs font-semibold text-gray-800">{v.idViolation}</p>
                <p className="text-[10px] text-gray-500">{v.violationDate} · {v.countryCode}</p>
              </div>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                v.status === 'actioned' ? 'bg-red-100 text-red-700' :
                v.status === 'acquitted' || v.status === 'overturned' ? 'bg-green-100 text-green-700' :
                v.status === 'under_review' || v.status === 'disputed' ? 'bg-orange-100 text-orange-700' :
                'bg-gray-100 text-gray-600'
              }`}>{v.status.replace(/_/g, ' ')}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function SellerProfiles() {
  const [filter, setFilter] = useState<'all' | 'at_risk' | 'suspended'>('all');
  const [selected, setSelected] = useState<SellerProfile | null>(null);
  const [search, setSearch] = useState('');

  const sellers = Object.values(mockSellers).filter(s => {
    const matchesSearch = !search ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.id.includes(search);
    const matchesFilter =
      filter === 'all' ? true :
      filter === 'at_risk' ? (s.riskTier === 'high' || s.riskTier === 'critical') :
      s.accountHealth === 'Suspended';
    return matchesSearch && matchesFilter;
  }).sort((a, b) => b.riskScore - a.riskScore);

  const atRisk = Object.values(mockSellers).filter(s => s.riskTier === 'high' || s.riskTier === 'critical').length;
  const suspended = Object.values(mockSellers).filter(s => s.accountHealth === 'Suspended').length;
  const withPatterns = Object.values(mockSellers).filter(s => s.patternAlerts.length > 0).length;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">{Object.keys(mockSellers).length}</p>
          <p className="text-xs text-gray-500 mt-0.5">Total Sellers</p>
        </div>
        <div className="bg-orange-50 rounded-xl border border-orange-200 p-4 text-center">
          <p className="text-2xl font-bold text-orange-700">{atRisk}</p>
          <p className="text-xs text-orange-600 mt-0.5">High / Critical Risk</p>
        </div>
        <div className="bg-red-50 rounded-xl border border-red-200 p-4 text-center">
          <p className="text-2xl font-bold text-red-700">{suspended}</p>
          <p className="text-xs text-red-600 mt-0.5">Suspended</p>
        </div>
        <div className="bg-yellow-50 rounded-xl border border-yellow-200 p-4 text-center">
          <p className="text-2xl font-bold text-yellow-700">{withPatterns}</p>
          <p className="text-xs text-yellow-600 mt-0.5">Pattern Alerts</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        <input value={search} onChange={e => setSearch(e.target.value)}
          className="flex-1 max-w-xs px-4 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Search seller name or ID…" />
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
          {(['all', 'at_risk', 'suspended'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${filter === f ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
              {f.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sellers.map(s => (
          <SellerCard key={s.id} seller={s} onClick={() => setSelected(s)} />
        ))}
      </div>

      {/* Detail Panel */}
      {selected && (
        <>
          <div className="fixed inset-0 bg-black/20 z-40" onClick={() => setSelected(null)} />
          <SellerDetailPanel seller={selected} onClose={() => setSelected(null)} />
        </>
      )}
    </div>
  );
}
