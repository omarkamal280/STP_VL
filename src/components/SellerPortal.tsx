import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle, Clock, FileText, ChevronRight } from 'lucide-react';
import { Violation, ViolationStatus } from '../types';
import { mockViolations, mockSellers } from '../mockData';
import ViolationDetailModal from './ViolationDetailModal';

// ── Seller-facing status labels and styles ───────────────────────────────────

const SELLER_STATUS: Record<ViolationStatus, { label: string; pill: string; icon: React.ReactNode; action?: string }> = {
  sanctioned:   { label: 'Action Required',     pill: 'bg-red-100 text-red-700',       icon: <AlertTriangle className="w-3.5 h-3.5" />, action: 'Respond' },
  disputed:     { label: 'Under Investigation', pill: 'bg-yellow-100 text-yellow-700', icon: <Clock className="w-3.5 h-3.5" /> },
  acknowledged: { label: 'Fix Under Review',    pill: 'bg-purple-100 text-purple-700', icon: <Clock className="w-3.5 h-3.5" /> },
  insufficient: { label: 'More Info Needed',    pill: 'bg-amber-100 text-amber-700',   icon: <AlertTriangle className="w-3.5 h-3.5" />, action: 'Resubmit' },
  closed:       { label: 'Closed',              pill: 'bg-slate-200 text-slate-700',   icon: <CheckCircle className="w-3.5 h-3.5" /> },
  upheld:       { label: 'Upheld',              pill: 'bg-red-100 text-red-700',       icon: <AlertTriangle className="w-3.5 h-3.5" /> },
  appealed:     { label: 'Final Review',        pill: 'bg-blue-100 text-blue-700',     icon: <Clock className="w-3.5 h-3.5" /> },
  dismissed:    { label: 'Dismissed',           pill: 'bg-green-100 text-green-700',   icon: <CheckCircle className="w-3.5 h-3.5" /> },
  voided:       { label: 'N/A',                 pill: 'bg-gray-100 text-gray-400',     icon: <CheckCircle className="w-3.5 h-3.5" /> },
};

const SEV_PILL: Record<string, string> = {
  critical: 'bg-red-100 text-red-700',
  high:     'bg-orange-100 text-orange-700',
  medium:   'bg-yellow-100 text-yellow-700',
  low:      'bg-green-100 text-green-700',
};

// ── Simulated seller ID for this portal view ─────────────────────────────────
const SELLER_ID = '442777';

const SellerPortal: React.FC = () => {
  const [selectedViolation, setSelectedViolation] = useState<Violation | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const sellerInfo = mockSellers[SELLER_ID];
  const violations = mockViolations
    .filter(v => v.sellerId === SELLER_ID && v.status !== 'voided')
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  const actionRequired = violations.filter(v => v.status === 'sanctioned').length;
  const underReview    = violations.filter(v => ['disputed', 'sanctioned_acknowledged', 'appealed'].includes(v.status)).length;
  const resolved       = violations.filter(v => v.status === 'dismissed' || v.status === 'upheld').length;

  const open = (v: Violation) => { setSelectedViolation(v); setIsModalOpen(true); };
  const close = () => { setIsModalOpen(false); setSelectedViolation(null); };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Seller Portal</h1>
          <p className="text-gray-500 mt-1 text-sm">Simulated as <strong>{sellerInfo?.name ?? SELLER_ID}</strong> · ID: {SELLER_ID}</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-teal-50 border border-teal-200 rounded-xl text-xs font-medium text-teal-700">
          <ShieldAlert className="w-3.5 h-3.5" /> Seller View
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-red-200 p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{actionRequired}</p>
            <p className="text-xs text-gray-500">Action Required</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-orange-200 p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
            <Clock className="w-5 h-5 text-orange-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{underReview}</p>
            <p className="text-xs text-gray-500">Under Review</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-green-200 p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-green-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{resolved}</p>
            <p className="text-xs text-gray-500">Resolved</p>
          </div>
        </div>
      </div>

      {/* Violation list */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-700">Your Violations</h2>
          <p className="text-xs text-gray-400 mt-0.5">Click a violation to view details, review the Plan of Action, and submit your response.</p>
        </div>

        <div className="divide-y divide-gray-100">
          {violations.map(v => {
            const s = SELLER_STATUS[v.status];
            return (
              <button
                key={v.id}
                onClick={() => open(v)}
                className="w-full text-left px-6 py-4 hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-center justify-between gap-4">
                  {/* Left — violation info */}
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <ShieldAlert className="w-4 h-4 text-orange-500" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-gray-800">{v.id}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${SEV_PILL[v.severity]}`}>
                          {v.severity.toUpperCase()}
                        </span>
                        {v.poa && (
                          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-600">
                            <FileText className="w-3 h-3" /> POA Attached
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{v.type} · {v.projectId}</p>
                      <p className="text-xs text-gray-400 mt-1 truncate max-w-lg">{v.description}</p>
                    </div>
                  </div>

                  {/* Right — status + date + action */}
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="text-right">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${s.pill}`}>
                        {s.icon}{s.label}
                      </span>
                      <p className="text-xs text-gray-400 mt-1">{v.createdAt.toLocaleDateString('en-GB')}</p>
                    </div>
                    {s.action && (
                      <span className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-red-600 text-white group-hover:bg-red-700 transition-colors">
                        {s.action}
                      </span>
                    )}
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Detail modal — seller mode */}
      <ViolationDetailModal
        violation={selectedViolation}
        isOpen={isModalOpen}
        onClose={close}
        mode="seller"
      />
    </div>
  );
};

export default SellerPortal;
