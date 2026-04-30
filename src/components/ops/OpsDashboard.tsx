import React, { useState } from 'react';
import {
  AlertTriangle, CheckCircle, Clock, TrendingUp, Users,
  FileText, Shield, AlertCircle, ChevronRight, Activity,
  Scale, XCircle,
} from 'lucide-react';
import { mockViolations, mockDisputes, mockSellers } from '../../mockData';
import { ViolationStatus, Violation } from '../../types';

const STATUS_META: Record<ViolationStatus, { label: string; color: string }> = {
  open:           { label: 'Open',          color: 'bg-gray-100 text-gray-700' },
  sent_to_seller: { label: 'Awaiting Reply', color: 'bg-blue-100 text-blue-700' },
  acknowledged:   { label: 'Acknowledged',  color: 'bg-cyan-100 text-cyan-700' },
  disputed:       { label: 'Disputed',      color: 'bg-orange-100 text-orange-700' },
  under_review:   { label: 'Under Review',  color: 'bg-yellow-100 text-yellow-700' },
  upheld:         { label: 'Upheld',        color: 'bg-purple-100 text-purple-700' },
  overturned:     { label: 'Overturned',    color: 'bg-teal-100 text-teal-700' },
  partial:        { label: 'Partial',       color: 'bg-indigo-100 text-indigo-700' },
  no_response:    { label: 'No Response',   color: 'bg-red-100 text-red-700' },
  actioned:       { label: 'Actioned',      color: 'bg-red-100 text-red-800' },
  acquitted:      { label: 'Acquitted',     color: 'bg-green-100 text-green-700' },
  closed:         { label: 'Closed',        color: 'bg-gray-100 text-gray-500' },
  active:         { label: 'Active',         color: 'bg-blue-100 text-blue-700' },
  enforced:       { label: 'Enforced',       color: 'bg-red-100 text-red-700' },
  exonerated:     { label: 'Exonerated',     color: 'bg-green-100 text-green-700' },
};

function slaLabel(deadline: Date): { label: string; cls: string } {
  const days = (deadline.getTime() - Date.now()) / 86_400_000;
  if (days < 0)   return { label: 'SLA BREACHED', cls: 'text-red-700 bg-red-50 border border-red-200' };
  if (days < 2)   return { label: `${Math.ceil(days)}d left`, cls: 'text-red-700 bg-red-50 border border-red-200' };
  if (days < 5)   return { label: `${Math.ceil(days)}d left`, cls: 'text-amber-700 bg-amber-50 border border-amber-200' };
  return           { label: `${Math.ceil(days)}d left`, cls: 'text-green-700 bg-green-50 border border-green-200' };
}

function StatCard({ label, value, sub, icon: Icon, color }: { label: string; value: number | string; sub?: string; icon: React.ElementType; color: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-start gap-4">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm font-medium text-gray-600">{label}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

export default function OpsDashboard() {
  const [, setSelectedViolation] = useState<Violation | null>(null);

  const active = mockViolations.filter(v => !['actioned', 'acquitted', 'closed', 'overturned'].includes(v.status));
  const openDisputes = mockDisputes.filter(d => d.status === 'open' || d.status === 'under_review');
  const urgentDisputes = openDisputes.filter(d => {
    const days = (d.slaDeadline.getTime() - Date.now()) / 86_400_000;
    return days < 3;
  });
  const atRiskSellers = Object.values(mockSellers).filter(s => s.riskTier === 'high' || s.riskTier === 'critical');
  const noResponseViolations = mockViolations.filter(v => v.status === 'no_response');

  const allAuditEvents = mockViolations
    .flatMap(v => (v.auditLog ?? []).map(e => ({ ...e, violationId: v.id })))
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, 10);

  return (
    <div className="space-y-8">
      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Active Violations" value={active.length} sub={`${mockViolations.length} total`} icon={FileText} color="bg-blue-100 text-blue-600" />
        <StatCard label="Open Disputes" value={openDisputes.length} sub={urgentDisputes.length > 0 ? `${urgentDisputes.length} urgent (<3 days)` : 'All within SLA'} icon={Scale} color="bg-orange-100 text-orange-600" />
        <StatCard label="Sellers At Risk" value={atRiskSellers.length} sub="High / Critical tier" icon={Users} color="bg-red-100 text-red-600" />
        <StatCard label="No Response" value={noResponseViolations.length} sub="Awaiting ops action" icon={AlertCircle} color="bg-yellow-100 text-yellow-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Dispute SLA Alerts */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <Scale className="w-4 h-4 text-orange-500" />Disputes Requiring Attention
            </h2>
            <span className="text-xs text-gray-400">{openDisputes.length} open</span>
          </div>
          <div className="divide-y divide-gray-50">
            {openDisputes.length === 0 && (
              <div className="flex flex-col items-center py-10 text-gray-400">
                <CheckCircle className="w-8 h-8 mb-2 text-green-400" />
                <p className="text-sm">No open disputes</p>
              </div>
            )}
            {openDisputes.map(d => {
              const violation = mockViolations.find(v => v.id === d.violationId);
              const seller = mockSellers[d.sellerId];
              const sla = slaLabel(d.slaDeadline);
              return (
                <div key={d.id} className="px-5 py-3 hover:bg-gray-50 cursor-pointer flex items-center gap-3"
                  onClick={() => setSelectedViolation(violation ?? null)}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-semibold text-gray-800">{d.id}</span>
                      <span className="text-xs text-gray-400">→</span>
                      <span className="text-sm text-gray-600 truncate">{violation?.idViolation}</span>
                    </div>
                    <p className="text-xs text-gray-500 truncate">
                      {seller?.name ?? d.sellerId} · {d.category.replace(/_/g, ' ')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${sla.cls}`}>{sla.label}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_META[d.status as ViolationStatus]?.color ?? 'bg-gray-100 text-gray-600'}`}>{d.status.replace(/_/g, ' ')}</span>
                    <ChevronRight className="w-4 h-4 text-gray-300" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Risk Snapshot */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <Shield className="w-4 h-4 text-red-500" />Seller Risk Snapshot
            </h2>
          </div>
          <div className="p-4 space-y-3">
            {Object.values(mockSellers).sort((a, b) => b.riskScore - a.riskScore).map(s => (
              <div key={s.id} className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-800 truncate">{s.name}</p>
                  <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1">
                    <div
                      className={`h-1.5 rounded-full ${s.riskScore >= 75 ? 'bg-red-500' : s.riskScore >= 50 ? 'bg-orange-400' : s.riskScore >= 25 ? 'bg-yellow-400' : 'bg-green-400'}`}
                      style={{ width: `${s.riskScore}%` }}
                    />
                  </div>
                </div>
                <span className="text-xs font-bold text-gray-600 w-8 text-right flex-shrink-0">{s.riskScore}</span>
                {s.patternAlerts.length > 0 && (
                  <span className="w-4 h-4 flex-shrink-0">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Violation Status Overview + Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status Breakdown */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-500" />Violation Status Breakdown
            </h2>
          </div>
          <div className="p-4 space-y-2">
            {(Object.keys(STATUS_META) as ViolationStatus[]).map(status => {
              const count = mockViolations.filter(v => v.status === status).length;
              if (count === 0) return null;
              const meta = STATUS_META[status];
              return (
                <div key={status} className="flex items-center justify-between">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${meta.color}`}>{meta.label}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-gray-100 rounded-full h-1.5">
                      <div className="h-1.5 bg-blue-400 rounded-full" style={{ width: `${(count / mockViolations.length) * 100}%` }} />
                    </div>
                    <span className="text-xs font-bold text-gray-600 w-4 text-right">{count}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <Activity className="w-4 h-4 text-purple-500" />Recent Activity
            </h2>
          </div>
          <div className="divide-y divide-gray-50">
            {allAuditEvents.map(e => {
              const actorColor = e.actorType === 'ops' ? 'bg-blue-100 text-blue-700' : e.actorType === 'seller' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600';
              const statusTo = e.toStatus ? STATUS_META[e.toStatus] : null;
              return (
                <div key={e.id} className="px-5 py-2.5 flex items-start gap-3">
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded flex-shrink-0 mt-0.5 ${actorColor}`}>
                    {e.actorType.toUpperCase()}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-700">
                      <span className="font-semibold">{e.actor}</span> — {e.action}
                      {' '}<span className="text-gray-400">on {(e as any).violationId}</span>
                    </p>
                    {statusTo && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${statusTo.color}`}>{statusTo.label}</span>
                    )}
                  </div>
                  <span className="text-[10px] text-gray-400 flex-shrink-0 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {e.timestamp.toLocaleDateString()}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* No Response — needs action */}
      {noResponseViolations.length > 0 && (
        <div className="bg-white rounded-xl border border-red-200">
          <div className="px-5 py-4 border-b border-red-100 flex items-center gap-2">
            <XCircle className="w-4 h-4 text-red-500" />
            <h2 className="text-sm font-semibold text-red-700">No Response — Requires Ops Decision</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {noResponseViolations.map(v => {
              const seller = mockSellers[v.partnerID];
              return (
                <div key={v.id} className="px-5 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{v.id} — {v.idViolation}</p>
                    <p className="text-xs text-gray-500">{seller?.name ?? v.partnerID} · {v.countryCode} · Warning #{v.warningCount}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${v.severity === 'critical' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>{v.severity}</span>
                    <button className="text-xs px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700">Take Action</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
