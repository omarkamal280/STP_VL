import React, { useState } from 'react';
import { Scale, Clock, CheckCircle, XCircle, ChevronDown, ChevronUp, FileText, User, AlertTriangle } from 'lucide-react';
import { mockDisputes, mockViolations, mockSellers } from '../../mockData';
import { Dispute, DisputeStatus, DisputeCategory } from '../../types';

const CATEGORY_LABELS: Record<DisputeCategory, string> = {
  insufficient_evidence: 'Insufficient Evidence',
  wrong_seller: 'Wrong Seller',
  already_resolved: 'Already Resolved',
  policy_misapplication: 'Policy Misapplication',
  technical_error: 'Technical Error',
  other: 'Other',
};

const STATUS_META: Record<DisputeStatus, { label: string; color: string }> = {
  open: { label: 'Open', color: 'bg-orange-100 text-orange-700' },
  under_review: { label: 'Under Review', color: 'bg-yellow-100 text-yellow-700' },
  upheld: { label: 'Upheld', color: 'bg-red-100 text-red-700' },
  overturned: { label: 'Overturned', color: 'bg-green-100 text-green-700' },
  partial: { label: 'Partial', color: 'bg-teal-100 text-teal-700' },
  withdrawn: { label: 'Withdrawn', color: 'bg-gray-100 text-gray-500' },
  pending:    { label: 'Pending',   color: 'bg-orange-100 text-orange-600' },
  resolved:   { label: 'Resolved',  color: 'bg-gray-100 text-gray-500' },
};

function slaInfo(deadline: Date, breached: boolean) {
  if (breached) return { label: 'SLA Breached', cls: 'bg-red-100 text-red-700 border border-red-300', dot: 'bg-red-500' };
  const days = (deadline.getTime() - Date.now()) / 86_400_000;
  if (days < 0) return { label: 'SLA Breached', cls: 'bg-red-100 text-red-700 border border-red-300', dot: 'bg-red-500' };
  if (days < 2) return { label: `${Math.ceil(days)}d — Urgent`, cls: 'bg-red-50 text-red-700 border border-red-200', dot: 'bg-red-500' };
  if (days < 5) return { label: `${Math.ceil(days)}d remaining`, cls: 'bg-amber-50 text-amber-700 border border-amber-200', dot: 'bg-amber-400' };
  return { label: `${Math.ceil(days)}d remaining`, cls: 'bg-green-50 text-green-700 border border-green-200', dot: 'bg-green-400' };
}

function DisputeCard({ dispute, expanded, onToggle }: { dispute: Dispute; expanded: boolean; onToggle: () => void }) {
  const violation = mockViolations.find(v => v.id === dispute.violationId);
  const seller = mockSellers[dispute.sellerId];
  const sla = slaInfo(dispute.slaDeadline, dispute.slaBreached);
  const statusMeta = STATUS_META[dispute.status];
  const isOpen = dispute.status === 'open' || dispute.status === 'under_review';

  const [resolution, setResolution] = useState<'upheld' | 'overturned' | 'partial' | ''>('');
  const [resNotes, setResNotes] = useState('');

  return (
    <div className={`bg-white rounded-xl border ${isOpen ? 'border-orange-200' : 'border-gray-200'} overflow-hidden`}>
      {/* Header */}
      <div className="px-5 py-4 flex items-start gap-4 cursor-pointer hover:bg-gray-50" onClick={onToggle}>
        <div className="flex-shrink-0 mt-0.5">
          <div className={`w-2.5 h-2.5 rounded-full ${sla.dot}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-bold text-gray-900">{dispute.id}</span>
            <span className="text-gray-300">·</span>
            <span className="text-sm text-gray-600">{violation?.idViolation ?? dispute.violationId}</span>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusMeta.color}`}>{statusMeta.label}</span>
          </div>
          <div className="flex items-center gap-3 mt-1 flex-wrap">
            <span className="text-xs text-gray-500 flex items-center gap-1"><User className="w-3 h-3" />{seller?.name ?? dispute.sellerId}</span>
            <span className="text-xs text-gray-400">{CATEGORY_LABELS[dispute.category]}</span>
            <span className="text-xs text-gray-400">{dispute.submittedAt.toLocaleDateString()}</span>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${sla.cls}`}>{sla.label}</span>
          {expanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </div>
      </div>

      {/* Expanded */}
      {expanded && (
        <div className="border-t border-gray-100 p-5 space-y-5">
          {/* Context */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1.5">Violation</p>
              <p className="font-semibold text-gray-800">{violation?.idViolation}</p>
              <p className="text-xs text-gray-500">{violation?.countryCode} · {violation?.complaintTicket}</p>
              <p className="text-xs text-gray-500 mt-1">Severity: <span className={`font-semibold ${violation?.severity === 'critical' ? 'text-red-600' : violation?.severity === 'high' ? 'text-orange-600' : 'text-yellow-600'}`}>{violation?.severity}</span></p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1.5">Seller</p>
              <p className="font-semibold text-gray-800">{seller?.name}</p>
              <p className="text-xs text-gray-500">{seller?.email}</p>
              <p className="text-xs text-gray-500 mt-1">Risk: <span className={`font-semibold ${seller?.riskScore && seller.riskScore >= 75 ? 'text-red-600' : seller?.riskScore && seller.riskScore >= 50 ? 'text-orange-600' : 'text-green-600'}`}>{seller?.riskScore}/100</span></p>
            </div>
          </div>

          {/* Seller's Explanation */}
          <div>
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2">Seller Explanation</p>
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-sm text-gray-700 leading-relaxed">
              {dispute.explanation}
            </div>
          </div>

          {/* Evidence */}
          {dispute.evidence.length > 0 && (
            <div>
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2">Submitted Evidence</p>
              <div className="flex flex-wrap gap-2">
                {dispute.evidence.map(ev => (
                  <div key={ev.id} className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-lg text-xs text-gray-700 cursor-pointer hover:bg-gray-200">
                    <FileText className="w-3.5 h-3.5 text-gray-500" />{ev.fileName} <span className="text-gray-400">({ev.sizeMb}MB)</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Resolution (if already resolved) */}
          {!isOpen && dispute.resolution && (
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2">Resolution</p>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${STATUS_META[dispute.resolution].color}`}>{STATUS_META[dispute.resolution].label}</span>
              {dispute.resolutionNotes && <p className="text-sm text-gray-700 mt-2">{dispute.resolutionNotes}</p>}
              <p className="text-xs text-gray-400 mt-2">Resolved by {dispute.reviewedBy} on {dispute.resolvedAt?.toLocaleDateString()}</p>
            </div>
          )}

          {/* Resolution Panel (if open) */}
          {isOpen && (
            <div className="border border-orange-200 bg-orange-50 rounded-xl p-4 space-y-3">
              <p className="text-sm font-semibold text-orange-800 flex items-center gap-2">
                <Scale className="w-4 h-4" />Resolve Dispute
              </p>
              <div className="flex gap-2">
                {(['upheld', 'overturned', 'partial'] as const).map(opt => (
                  <button key={opt} type="button"
                    onClick={() => setResolution(opt)}
                    className={`flex-1 py-2 rounded-lg text-xs font-semibold border transition-colors capitalize
                      ${resolution === opt
                        ? opt === 'upheld' ? 'bg-red-600 text-white border-red-600'
                          : opt === 'overturned' ? 'bg-green-600 text-white border-green-600'
                          : 'bg-teal-600 text-white border-teal-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}>
                    {opt}
                  </button>
                ))}
              </div>
              {resolution && (
                <>
                  <textarea value={resNotes} onChange={e => setResNotes(e.target.value)} rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                    placeholder="Resolution notes (required)..." />
                  <div className="flex justify-end gap-2">
                    <button className="px-3 py-1.5 text-xs text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg" onClick={() => { setResolution(''); setResNotes(''); }}>
                      Clear
                    </button>
                    <button disabled={!resNotes.trim()}
                      className="px-4 py-1.5 text-xs bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-40">
                      Submit Resolution
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function DisputesQueue() {
  const [expandedId, setExpandedId] = useState<string | null>(mockDisputes[0]?.id ?? null);
  const [filter, setFilter] = useState<'all' | 'open' | 'resolved'>('all');

  const filtered = mockDisputes.filter(d => {
    if (filter === 'open') return d.status === 'open' || d.status === 'under_review';
    if (filter === 'resolved') return !['open', 'under_review'].includes(d.status);
    return true;
  }).sort((a, b) => {
    const aUrgent = ['open', 'under_review'].includes(a.status);
    const bUrgent = ['open', 'under_review'].includes(b.status);
    if (aUrgent !== bUrgent) return aUrgent ? -1 : 1;
    return a.slaDeadline.getTime() - b.slaDeadline.getTime();
  });

  const openCount = mockDisputes.filter(d => d.status === 'open' || d.status === 'under_review').length;
  const breachedCount = mockDisputes.filter(d => d.slaBreached || d.slaDeadline < new Date()).length;
  const resolvedCount = mockDisputes.filter(d => !['open', 'under_review'].includes(d.status)).length;
  const winRate = resolvedCount > 0
    ? Math.round((mockDisputes.filter(d => d.resolution === 'overturned' || d.resolution === 'partial').length / resolvedCount) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">{mockDisputes.length}</p>
          <p className="text-xs text-gray-500 mt-0.5">Total Disputes</p>
        </div>
        <div className="bg-orange-50 rounded-xl border border-orange-200 p-4 text-center">
          <p className="text-2xl font-bold text-orange-700">{openCount}</p>
          <p className="text-xs text-orange-600 mt-0.5">Open / Under Review</p>
        </div>
        <div className="bg-red-50 rounded-xl border border-red-200 p-4 text-center">
          <p className="text-2xl font-bold text-red-700">{breachedCount}</p>
          <p className="text-xs text-red-600 mt-0.5">SLA Breached / Urgent</p>
        </div>
        <div className="bg-green-50 rounded-xl border border-green-200 p-4 text-center">
          <p className="text-2xl font-bold text-green-700">{winRate}%</p>
          <p className="text-xs text-green-600 mt-0.5">Seller Win Rate</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {(['all', 'open', 'resolved'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${filter === f ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
            {f}
          </button>
        ))}
      </div>

      {/* Disputes */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-gray-400">
          <CheckCircle className="w-10 h-10 mb-3 text-green-300" />
          <p className="text-sm">No disputes in this category</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(d => (
            <DisputeCard key={d.id} dispute={d}
              expanded={expandedId === d.id}
              onToggle={() => setExpandedId(expandedId === d.id ? null : d.id)} />
          ))}
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs text-gray-400 pt-2">
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500" />Urgent / Breached</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-400" />Action within 5 days</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-green-400" />Within SLA</span>
      </div>
    </div>
  );
}
