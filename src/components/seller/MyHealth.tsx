import React from 'react';
import { Shield, Star, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { mockSellers, mockViolations } from '../../mockData';
import { AccountHealth } from '../../types';

const HEALTH_META: Record<AccountHealth, { color: string; bg: string; ring: string; desc: string }> = {
  Excellent:  { color: 'text-green-700',  bg: 'bg-green-50',  ring: '#22c55e', desc: 'Your account is in great standing. Keep up the excellent work.' },
  Good:       { color: 'text-blue-700',   bg: 'bg-blue-50',   ring: '#3b82f6', desc: 'Your account is performing well. Monitor any open violations.' },
  Fair:       { color: 'text-yellow-700', bg: 'bg-yellow-50', ring: '#eab308', desc: 'Your account has some risk factors. Address open violations promptly.' },
  'At Risk':  { color: 'text-orange-700', bg: 'bg-orange-50', ring: '#f97316', desc: 'Your account is at risk. Take immediate action on outstanding violations.' },
  Suspended:  { color: 'text-red-700',    bg: 'bg-red-50',    ring: '#ef4444', desc: 'Your account is currently suspended. Contact support for reinstatement options.' },
};

function RingGauge({ score, health }: { score: number; health: AccountHealth }) {
  const meta = HEALTH_META[health];
  const r = 60;
  const circ = 2 * Math.PI * r;
  const pct = score / 100;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-40 h-40">
        <svg viewBox="0 0 160 160" className="w-40 h-40 -rotate-90">
          <circle cx="80" cy="80" r={r} fill="none" stroke="#f3f4f6" strokeWidth="14" />
          <circle cx="80" cy="80" r={r} fill="none" stroke={meta.ring} strokeWidth="14"
            strokeDasharray={`${pct * circ} ${circ}`} strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-black text-gray-900">{score}</span>
          <span className="text-xs text-gray-400 font-medium">/ 100</span>
        </div>
      </div>
      <span className={`text-base font-bold mt-2 ${meta.color}`}>{health}</span>
      <p className={`text-xs text-center mt-1.5 max-w-xs ${meta.color} px-3`}>{meta.desc}</p>
    </div>
  );
}

function ScoreItem({ label, value, impact, help }: { label: string; value: string; impact: 'positive' | 'negative' | 'neutral'; help?: string }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800">{label}</p>
        {help && <p className="text-xs text-gray-400 mt-0.5">{help}</p>}
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <span className="text-sm font-bold text-gray-700">{value}</span>
        {impact === 'positive' && <TrendingUp className="w-4 h-4 text-green-500" />}
        {impact === 'negative' && <TrendingDown className="w-4 h-4 text-red-500" />}
        {impact === 'neutral' && <div className="w-4 h-0.5 bg-gray-300 rounded" />}
      </div>
    </div>
  );
}

export default function MyHealth({ sellerId }: { sellerId: string }) {
  const seller = mockSellers[sellerId];
  if (!seller) return <p className="text-gray-400 text-sm">No seller found.</p>;

  const violations = mockViolations.filter(v => v.partnerID === sellerId);
  const activeVios = violations.filter(v => !['actioned', 'acquitted', 'closed', 'overturned'].includes(v.status));
  const actionedVios = violations.filter(v => v.status === 'actioned');
  const overturnedVios = violations.filter(v => v.status === 'overturned');
  const noRespVios = violations.filter(v => v.status === 'no_response');

  const healthMeta = HEALTH_META[seller.accountHealth];

  const sparkMax = Math.max(...seller.healthHistory.map(h => h.score));
  const sparkMin = Math.min(...seller.healthHistory.map(h => h.score));
  const H = 48;
  const sparkPts = seller.healthHistory.map((p, i) => {
    const x = (i / (seller.healthHistory.length - 1)) * 300;
    const y = H - ((p.score - sparkMin) / Math.max(sparkMax - sparkMin, 1)) * H;
    return `${x},${y}`;
  }).join(' ');
  const last = seller.healthHistory[seller.healthHistory.length - 1];
  const first = seller.healthHistory[0];
  const trending = last.score >= first.score;

  return (
    <div className="space-y-6">
      {/* Header Score */}
      <div className={`rounded-2xl p-8 ${healthMeta.bg} flex flex-col items-center`}>
        <RingGauge score={seller.riskScore > 0 ? 100 - seller.riskScore : 100} health={seller.accountHealth} />
      </div>

      {/* Trend Sparkline */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-900">Health Score Trend</h3>
          <div className={`flex items-center gap-1 text-xs font-semibold ${trending ? 'text-green-600' : 'text-red-600'}`}>
            {trending ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            {trending ? 'Improving' : 'Declining'}
          </div>
        </div>
        <svg viewBox={`0 0 300 ${H + 4}`} className="w-full" style={{ height: 60 }}>
          <polyline points={sparkPts} fill="none" stroke={trending ? '#22c55e' : '#ef4444'} strokeWidth="2.5" strokeLinejoin="round" />
          {seller.healthHistory.map((p, i) => {
            const x = (i / (seller.healthHistory.length - 1)) * 300;
            const y = H - ((p.score - sparkMin) / Math.max(sparkMax - sparkMin, 1)) * H;
            return <circle key={i} cx={x} cy={y} r="3.5" fill={trending ? '#22c55e' : '#ef4444'} />;
          })}
        </svg>
        <div className="flex justify-between mt-2 text-[10px] text-gray-400">
          {seller.healthHistory.map(h => <span key={h.date}>{h.date}</span>)}
        </div>
      </div>

      {/* Score Breakdown */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-sm font-semibold text-gray-900 mb-1">What's Affecting Your Score</h3>
        <p className="text-xs text-gray-400 mb-4 flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5" />Score is calculated on a combination of violation history, response behavior, and dispute outcomes.
        </p>
        <div>
          <ScoreItem label="Seller Rating" value={`${seller.sellerRating} / 5`}
            impact={seller.sellerRating >= 4.5 ? 'positive' : seller.sellerRating >= 3.5 ? 'neutral' : 'negative'}
            help="Based on customer feedback across all markets" />
          <ScoreItem label="Response Rate" value={`${seller.responseRate}%`}
            impact={seller.responseRate >= 90 ? 'positive' : seller.responseRate >= 70 ? 'neutral' : 'negative'}
            help="% of violations you responded to" />
          <ScoreItem label="Avg Response Time" value={`${seller.avgResponseDays} days`}
            impact={seller.avgResponseDays <= 2 ? 'positive' : seller.avgResponseDays <= 5 ? 'neutral' : 'negative'}
            help="Faster responses improve your score" />
          <ScoreItem label="Active Violations" value={`${activeVios.length}`}
            impact={activeVios.length === 0 ? 'positive' : activeVios.length <= 2 ? 'neutral' : 'negative'}
            help="Open/unresolved violations against your account" />
          <ScoreItem label="Actioned Violations" value={`${actionedVios.length}`}
            impact={actionedVios.length === 0 ? 'positive' : 'negative'}
            help="Violations where a penalty was applied" />
          <ScoreItem label="Successful Disputes" value={`${overturnedVios.length}`}
            impact={overturnedVios.length > 0 ? 'positive' : 'neutral'}
            help="Violations overturned in your favor" />
          <ScoreItem label="No-Response Violations" value={`${noRespVios.length}`}
            impact={noRespVios.length === 0 ? 'positive' : 'negative'}
            help="Missing response SLA significantly hurts your score" />
          <ScoreItem label="Dispute Win Rate" value={`${seller.disputeSuccessRate}%`}
            impact={seller.disputeSuccessRate >= 60 ? 'positive' : seller.disputeSuccessRate >= 30 ? 'neutral' : 'negative'}
            help="% of your disputes that resulted in overturned violations" />
        </div>
      </div>

      {/* Pattern Alerts */}
      {seller.patternAlerts.length > 0 && (
        <div className="bg-white rounded-xl border border-red-200 p-5">
          <h3 className="text-sm font-semibold text-red-700 flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4" />Pattern Alerts
          </h3>
          <div className="space-y-2">
            {seller.patternAlerts.map((a, i) => (
              <div key={i} className={`rounded-lg p-3 ${a.severity === 'critical' ? 'bg-red-50 border border-red-200' : 'bg-amber-50 border border-amber-200'}`}>
                <p className="text-xs font-semibold text-gray-800 capitalize">{a.type.replace(/_/g, ' ')}</p>
                <p className="text-xs text-gray-600 mt-0.5">{a.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-green-500" />How to Improve Your Score
        </h3>
        <ul className="space-y-2 text-sm text-gray-600">
          {seller.responseRate < 90 && <li className="flex items-start gap-2"><span className="text-blue-500 mt-0.5">→</span>Respond to all violations within 2 business days to improve your response rate.</li>}
          {activeVios.length > 0 && <li className="flex items-start gap-2"><span className="text-orange-500 mt-0.5">→</span>You have {activeVios.length} active violation(s). Address them promptly to stop score decline.</li>}
          {seller.riskScore >= 50 && <li className="flex items-start gap-2"><span className="text-red-500 mt-0.5">→</span>Review your sourcing and product compliance processes to prevent future violations.</li>}
          {seller.sellerRating < 4.0 && <li className="flex items-start gap-2"><span className="text-yellow-500 mt-0.5">→</span>Work on improving customer satisfaction to raise your seller rating above 4.0.</li>}
          {actionedVios.length === 0 && overturnedVios.length === 0 && seller.priorViolations === 0 && (
            <li className="flex items-start gap-2"><span className="text-green-500 mt-0.5">✓</span>No recommendations — your account is in excellent standing!</li>
          )}
        </ul>
      </div>
    </div>
  );
}
