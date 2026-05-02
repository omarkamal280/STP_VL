import React, { useState } from 'react';
import {
  X, Scale, AlertTriangle, CheckCircle, FileText,
  MessageSquare, ShieldAlert, User, Clock,
} from 'lucide-react';
import { Violation } from '../types';
import { mockDisputes, mockSellers } from '../mockData';

// ── Helpers ────────────────────────────────────────────────────────────────

const SEV_PILL: Record<string, string> = {
  critical: 'bg-red-100 text-red-700',
  high:     'bg-orange-100 text-orange-700',
  medium:   'bg-yellow-100 text-yellow-700',
  low:      'bg-green-100 text-green-700',
};

const STATUS_PILL: Record<string, string> = {
  active:     'bg-blue-100 text-blue-700',
  disputed:   'bg-orange-100 text-orange-700',
  enforced:   'bg-red-100 text-red-800',
  exonerated: 'bg-green-100 text-green-800',
};

interface SimMsg { id: string; from: 'ops' | 'seller' | 'system'; name: string; text: string; ts: Date; tag?: string; }

function buildThread(v: Violation, disputeReason?: string): SimMsg[] {
  const msgs: SimMsg[] = [];
  msgs.push({ id: 'm1', from: 'ops', name: 'Risk Team', text: v.messageToSeller || 'This violation has been raised on your account. Please review and respond.', ts: new Date(v.createdAt.getTime() + 3600000), });
  if (v.status === 'disputed' || v.status === 'enforced' || v.status === 'exonerated') {
    msgs.push({ id: 'm2', from: 'seller', name: `Seller ${v.sellerId}`, text: disputeReason || 'Thank you for the notice. We are reviewing the matter and will respond with supporting documentation.', ts: new Date(v.createdAt.getTime() + 86400000), });
  }
  if (v.status === 'disputed') {
    msgs.push({ id: 'm3', from: 'ops', name: 'Risk Team', text: 'Dispute received and logged. We are reviewing your evidence. SLA: 5 business days.', ts: new Date(v.createdAt.getTime() + 90000000), tag: 'Dispute under review', });
  }
  if (v.status === 'enforced') {
    msgs.push({ id: 'm4', from: 'system', name: 'System', text: 'Investigation complete. Violation enforced. Relevant penalties have been applied.', ts: new Date(v.createdAt.getTime() + 172800000), tag: 'Verdict: Enforced', });
  }
  if (v.status === 'exonerated') {
    msgs.push({ id: 'm5', from: 'system', name: 'System', text: 'Investigation complete. Seller exonerated. No policy violation confirmed.', ts: new Date(v.createdAt.getTime() + 172800000), tag: 'Verdict: Exonerated', });
  }
  return msgs;
}

// ── Props ──────────────────────────────────────────────────────────────────

interface ViolationDetailModalProps {
  violation: Violation | null;
  isOpen: boolean;
  onClose: () => void;
  focusVerdict?: boolean;
}

const ViolationDetailModal: React.FC<ViolationDetailModalProps> = ({
  violation, isOpen, onClose, focusVerdict = false,
}) => {
  const [verdictType, setVerdictType] = useState<'enforced' | 'exonerated' | ''>('');
  const [verdictReason, setVerdictReason] = useState('');
  const [appealEligible, setAppealEligible] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  React.useEffect(() => {
    if (isOpen) { setVerdictType(''); setVerdictReason(''); setAppealEligible(false); setSubmitted(false); }
  }, [isOpen, violation?.id]);

  if (!isOpen || !violation) return null;

  const seller = mockSellers[violation.sellerId];
  const dispute = mockDisputes.find(d => d.violationId === violation.id);
  const isTerminal = violation.status === 'enforced' || violation.status === 'exonerated';
  const canGiveVerdict = !isTerminal;
  const thread = buildThread(violation, dispute?.reason);

  const fmt = (d: Date) => d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  const handleSubmit = () => {
    if (verdictType && verdictReason.trim()) setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[92vh] flex flex-col">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-gray-900">{violation.id}</h2>
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${SEV_PILL[violation.severity]}`}>
                  {violation.severity.toUpperCase()}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_PILL[violation.status]}`}>
                  {violation.status.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">{violation.type} · {seller?.name ?? violation.sellerId} · {violation.projectId}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* ── Body ───────────────────────────────────────────────────────── */}
        <div className="flex-1 overflow-hidden flex">

          {/* Left — details + dispute */}
          <div className="w-72 flex-shrink-0 border-r border-gray-100 overflow-y-auto p-5 space-y-5">

            {/* Core meta */}
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Details</p>
              <div className="space-y-2 text-sm">
                {[
                  ['Seller', seller?.name ?? violation.sellerId],
                  ['Project', violation.projectId],
                  ['Type', violation.type],
                  ['Created', violation.createdAt.toLocaleDateString('en-GB')],
                  ...(violation.zohoTicketId ? [['Ticket', violation.zohoTicketId]] : []),
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-2">
                    <span className="text-gray-400 flex-shrink-0">{k}</span>
                    <span className="text-gray-800 font-medium text-right">{v}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Description</p>
              <p className="text-xs text-gray-600 leading-relaxed">{violation.description}</p>
            </div>

            {/* Evidence */}
            {violation.evidence && violation.evidence.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Evidence (Ops)</p>
                <div className="space-y-1">
                  {violation.evidence.map((f, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-xs text-blue-600">
                      <FileText className="w-3 h-3 flex-shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Seller attachments */}
            {violation.attachments && violation.attachments.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Submitted by Seller</p>
                <div className="space-y-1">
                  {violation.attachments.map((f, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-xs text-gray-600">
                      <FileText className="w-3 h-3 flex-shrink-0 text-gray-400" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Dispute summary */}
            {dispute && (
              <div className="rounded-xl border border-orange-200 bg-orange-50 p-3 space-y-2">
                <div className="flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-orange-500" />
                  <p className="text-xs font-semibold text-orange-700">Dispute {dispute.id}</p>
                  <span className={`ml-auto text-xs px-1.5 py-0.5 rounded-full font-medium ${dispute.status === 'resolved' ? 'bg-gray-100 text-gray-600' : 'bg-orange-100 text-orange-700'}`}>
                    {dispute.status.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-xs text-gray-700 leading-relaxed">{dispute.reason}</p>
                {dispute.evidence.map((f, i) => (
                  <div key={i} className="flex items-center gap-1 text-xs text-blue-600">
                    <FileText className="w-3 h-3" /><span>{f}</span>
                  </div>
                ))}
                {dispute.resolution && (
                  <div className="pt-2 border-t border-orange-200 text-xs text-gray-600">
                    <span className="font-medium">Resolution: </span>{dispute.resolution.reply}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right — thread + verdict */}
          <div className="flex-1 flex flex-col overflow-hidden">

            {/* Thread */}
            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              <div className="flex items-center gap-2 mb-1">
                <MessageSquare className="w-4 h-4 text-gray-400" />
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Communication Thread</p>
              </div>

              {thread.map(msg => (
                <div key={msg.id} className={`flex ${msg.from === 'seller' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-sm px-4 py-3 rounded-2xl text-sm shadow-sm ${
                    msg.from === 'ops'    ? 'bg-blue-50 text-blue-900 rounded-tl-sm' :
                    msg.from === 'system' ? 'bg-gray-100 text-gray-600 text-xs italic w-full text-center rounded-lg' :
                                            'bg-orange-50 text-orange-900 rounded-tr-sm'
                  }`}>
                    {msg.from !== 'system' && (
                      <div className="flex items-center gap-1.5 mb-1">
                        <User className="w-3 h-3 opacity-60" />
                        <span className="text-xs font-semibold opacity-70">{msg.name}</span>
                        {msg.tag && (
                          <span className="ml-1 px-1.5 py-0.5 rounded-full text-xs font-medium bg-white/60 border border-current/20">{msg.tag}</span>
                        )}
                      </div>
                    )}
                    <p>{msg.text}</p>
                    <div className="flex items-center gap-1 mt-1 opacity-50">
                      <Clock className="w-3 h-3" />
                      <span className="text-xs">{fmt(msg.ts)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Verdict section */}
            <div className="border-t border-gray-100 p-5">
              {/* Already closed */}
              {violation.status === 'enforced' && (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-200">
                  <Scale className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-red-800">Verdict: Enforced</p>
                    <p className="text-xs text-red-600 mt-0.5">This violation has been actioned. The case is closed.</p>
                  </div>
                </div>
              )}
              {violation.status === 'exonerated' && (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-green-50 border border-green-200">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-green-800">Verdict: Exonerated</p>
                    <p className="text-xs text-green-600 mt-0.5">Seller has been cleared. No policy violation confirmed.</p>
                  </div>
                </div>
              )}

              {/* Submitted confirmation */}
              {canGiveVerdict && submitted && (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-green-50 border border-green-200">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-green-800">
                      Verdict submitted — {verdictType === 'enforced' ? 'Enforced' : 'Exonerated'}
                    </p>
                    <p className="text-xs text-green-600 mt-0.5">The ticket is closed and the seller has been notified.</p>
                  </div>
                </div>
              )}

              {/* Verdict form */}
              {canGiveVerdict && !submitted && (
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Scale className="w-3.5 h-3.5" /> Give Verdict
                  </p>
                  {/* Toggle */}
                  <div className="flex gap-2">
                    {(['enforced', 'exonerated'] as const).map(v => (
                      <button key={v} onClick={() => setVerdictType(v)}
                        className={`flex-1 py-2 rounded-xl text-sm font-semibold border transition-all ${
                          verdictType === v
                            ? v === 'enforced' ? 'bg-red-600 text-white border-red-600 shadow-sm' : 'bg-green-600 text-white border-green-600 shadow-sm'
                            : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                        }`}>
                        {v === 'enforced' ? '⚡ Enforce' : '✓ Exonerate'}
                      </button>
                    ))}
                  </div>
                  {/* Reason */}
                  {verdictType && (
                    <>
                      <textarea
                        value={verdictReason}
                        onChange={e => setVerdictReason(e.target.value)}
                        rows={2}
                        placeholder={verdictType === 'enforced' ? 'Reason for enforcement and penalty applied…' : 'Reason for exoneration…'}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                      />
                      <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                        <input type="checkbox" checked={appealEligible} onChange={e => setAppealEligible(e.target.checked)}
                          className="rounded" />
                        Mark as appeal-eligible
                      </label>
                    </>
                  )}
                  <button
                    onClick={handleSubmit}
                    disabled={!verdictType || !verdictReason.trim()}
                    className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                      verdictType === 'enforced' ? 'bg-red-600 hover:bg-red-700 text-white' :
                      verdictType === 'exonerated' ? 'bg-green-600 hover:bg-green-700 text-white' :
                      'bg-gray-300 text-gray-500'
                    }`}>
                    Confirm &amp; Close Ticket
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViolationDetailModal;
