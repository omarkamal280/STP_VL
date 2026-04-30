import React from 'react';
import { Scale, Clock, CheckCircle, XCircle, AlertTriangle, FileText } from 'lucide-react';
import { mockDisputes, mockViolations } from '../../mockData';
import { DisputeStatus, DisputeCategory } from '../../types';

const STATUS_META: Record<DisputeStatus, { label: string; color: string; icon: React.ElementType }> = {
  open:         { label: 'Submitted — Awaiting Review', color: 'bg-orange-100 text-orange-700', icon: Clock },
  under_review: { label: 'Under Review',                color: 'bg-yellow-100 text-yellow-700', icon: Clock },
  upheld:       { label: 'Rejected — Violation Stands', color: 'bg-red-100 text-red-700',       icon: XCircle },
  overturned:   { label: 'Won — Violation Overturned',  color: 'bg-green-100 text-green-700',   icon: CheckCircle },
  partial:      { label: 'Partially Accepted',          color: 'bg-teal-100 text-teal-700',     icon: CheckCircle },
  withdrawn:    { label: 'Withdrawn',                   color: 'bg-gray-100 text-gray-500',     icon: AlertTriangle },
  pending:      { label: 'Pending',                     color: 'bg-orange-100 text-orange-600', icon: Clock },
  resolved:     { label: 'Resolved',                    color: 'bg-gray-100 text-gray-500',     icon: CheckCircle },
};

const CATEGORY_LABELS: Record<DisputeCategory, string> = {
  insufficient_evidence:  'Insufficient Evidence',
  wrong_seller:           'Wrongly Attributed',
  already_resolved:       'Already Resolved',
  policy_misapplication:  'Policy Misapplication',
  technical_error:        'Technical / System Error',
  other:                  'Other',
};

export default function MyDisputes({ sellerId }: { sellerId: string }) {
  const disputes = mockDisputes.filter(d => d.sellerId === sellerId);
  const violations = Object.fromEntries(mockViolations.map(v => [v.id, v]));

  const open = disputes.filter(d => d.status === 'open' || d.status === 'under_review');
  const won  = disputes.filter(d => d.resolution === 'overturned' || d.resolution === 'partial');
  const lost = disputes.filter(d => d.resolution === 'upheld');

  if (disputes.length === 0) {
    return (
      <div className="flex flex-col items-center py-20 text-gray-400">
        <Scale className="w-12 h-12 mb-3 text-gray-200" />
        <p className="text-sm font-medium">No disputes filed</p>
        <p className="text-xs mt-1">When you formally dispute a violation, it will appear here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className={`rounded-xl border p-4 text-center ${open.length > 0 ? 'bg-orange-50 border-orange-200' : 'bg-white border-gray-200'}`}>
          <p className={`text-2xl font-bold ${open.length > 0 ? 'text-orange-700' : 'text-gray-900'}`}>{open.length}</p>
          <p className="text-xs text-gray-500 mt-0.5">Pending</p>
        </div>
        <div className="bg-green-50 rounded-xl border border-green-200 p-4 text-center">
          <p className="text-2xl font-bold text-green-700">{won.length}</p>
          <p className="text-xs text-gray-500 mt-0.5">Won</p>
        </div>
        <div className="bg-red-50 rounded-xl border border-red-200 p-4 text-center">
          <p className="text-2xl font-bold text-red-700">{lost.length}</p>
          <p className="text-xs text-gray-500 mt-0.5">Lost</p>
        </div>
      </div>

      {/* Dispute Cards */}
      <div className="space-y-4">
        {disputes.map(d => {
          const violation = violations[d.violationId];
          const meta = STATUS_META[d.status];
          const StatusIcon = meta.icon;
          const daysLeft = (d.slaDeadline.getTime() - Date.now()) / 86_400_000;
          const isOpen = d.status === 'open' || d.status === 'under_review';

          return (
            <div key={d.id} className={`bg-white rounded-xl border ${isOpen ? 'border-orange-200' : 'border-gray-200'} p-5 space-y-4`}>
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold text-gray-900">{d.id}</span>
                    <span className="text-gray-300">·</span>
                    <span className="text-sm text-gray-600">{violation?.idViolation ?? d.violationId}</span>
                  </div>
                  <p className="text-xs text-gray-500">Filed {d.submittedAt.toLocaleDateString()} · {CATEGORY_LABELS[d.category]}</p>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5 ${meta.color}`}>
                  <StatusIcon className="w-3 h-3" />{meta.label}
                </span>
              </div>

              {/* SLA (only for open) */}
              {isOpen && (
                <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold ${
                  daysLeft < 2 ? 'bg-red-50 text-red-700 border border-red-200' :
                  daysLeft < 5 ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                  'bg-green-50 text-green-700 border border-green-200'}`}>
                  <Clock className="w-3.5 h-3.5" />
                  {daysLeft < 0 ? 'Review SLA breached — follow up with ops team' :
                    `Review deadline: ${d.slaDeadline.toLocaleDateString()} (${Math.ceil(daysLeft)} days)`}
                </div>
              )}

              {/* Explanation */}
              <div>
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1.5">Your Explanation</p>
                <p className="text-sm text-gray-700 bg-gray-50 rounded-lg px-3 py-2.5 leading-relaxed">{d.explanation}</p>
              </div>

              {/* Evidence */}
              {d.evidence.length > 0 && (
                <div>
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1.5">Your Evidence</p>
                  <div className="flex flex-wrap gap-2">
                    {d.evidence.map(ev => (
                      <div key={ev.id} className="flex items-center gap-1.5 bg-gray-100 px-2.5 py-1 rounded-lg text-xs text-gray-600 hover:bg-gray-200 cursor-pointer">
                        <FileText className="w-3 h-3 text-gray-400" />{ev.fileName}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Resolution */}
              {!isOpen && d.resolution && (
                <div className={`rounded-xl p-4 ${d.resolution === 'overturned' || d.resolution === 'partial' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                  <p className={`text-xs font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1.5 ${d.resolution === 'overturned' || d.resolution === 'partial' ? 'text-green-700' : 'text-red-700'}`}>
                    {d.resolution === 'overturned' || d.resolution === 'partial' ? <CheckCircle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                    Ops Decision: {d.resolution.charAt(0).toUpperCase() + d.resolution.slice(1)}
                  </p>
                  {d.resolutionNotes && <p className="text-sm text-gray-700">{d.resolutionNotes}</p>}
                  <p className="text-xs text-gray-400 mt-2">
                    Reviewed by {d.reviewedBy} · {d.resolvedAt?.toLocaleDateString()}
                  </p>
                  {violation?.verdict?.appealEligible && d.resolution === 'upheld' && (
                    <div className="mt-3 flex items-center gap-2 bg-white border border-red-200 rounded-lg px-3 py-2">
                      <AlertTriangle className="w-3.5 h-3.5 text-orange-500 flex-shrink-0" />
                      <p className="text-xs text-gray-600">You are eligible to appeal this decision. Contact your account manager.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
