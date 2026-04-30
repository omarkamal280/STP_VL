import React, { useState } from 'react';
import {
  FileText, MessageSquare, Scale, ChevronDown, ChevronUp,
  Clock, CheckCircle, AlertTriangle, Send, Paperclip, X,
} from 'lucide-react';
import { mockViolations, mockSellers } from '../../mockData';
import { Violation, ViolationStatus, DisputeCategory, ThreadMessage } from '../../types';

const STATUS_META: Record<ViolationStatus, { label: string; color: string; icon: React.ElementType }> = {
  open:           { label: 'Open',           color: 'bg-gray-100 text-gray-700',    icon: Clock },
  sent_to_seller: { label: 'Action Required', color: 'bg-blue-100 text-blue-700',   icon: AlertTriangle },
  acknowledged:   { label: 'Acknowledged',   color: 'bg-cyan-100 text-cyan-700',    icon: CheckCircle },
  disputed:       { label: 'Disputed',       color: 'bg-orange-100 text-orange-700', icon: Scale },
  under_review:   { label: 'Under Review',   color: 'bg-yellow-100 text-yellow-700', icon: Clock },
  upheld:         { label: 'Upheld',         color: 'bg-red-100 text-red-700',       icon: AlertTriangle },
  overturned:     { label: 'Overturned',     color: 'bg-green-100 text-green-700',   icon: CheckCircle },
  partial:        { label: 'Partial',        color: 'bg-teal-100 text-teal-700',     icon: CheckCircle },
  no_response:    { label: 'No Response',    color: 'bg-red-100 text-red-600',       icon: AlertTriangle },
  actioned:       { label: 'Actioned',       color: 'bg-red-200 text-red-800',       icon: AlertTriangle },
  acquitted:      { label: 'Acquitted',      color: 'bg-green-100 text-green-700',   icon: CheckCircle },
  closed:         { label: 'Closed',         color: 'bg-gray-100 text-gray-400',     icon: CheckCircle },
  active:         { label: 'Active',         color: 'bg-blue-100 text-blue-700',     icon: Clock },
  enforced:       { label: 'Enforced',       color: 'bg-red-100 text-red-700',       icon: AlertTriangle },
  exonerated:     { label: 'Exonerated',     color: 'bg-green-100 text-green-700',   icon: CheckCircle },
};

const DISPUTE_CATEGORIES: { value: DisputeCategory; label: string; desc: string }[] = [
  { value: 'insufficient_evidence', label: 'Insufficient Evidence', desc: 'The evidence provided does not support the violation claim.' },
  { value: 'wrong_seller', label: 'Wrongly Attributed', desc: 'This violation was assigned to the wrong seller account.' },
  { value: 'already_resolved', label: 'Already Resolved', desc: 'This issue was already corrected before this violation was filed.' },
  { value: 'policy_misapplication', label: 'Policy Misapplication', desc: 'The policy cited does not apply to my specific situation.' },
  { value: 'technical_error', label: 'Technical / System Error', desc: 'An automated system incorrectly flagged my account.' },
  { value: 'other', label: 'Other', desc: 'None of the above categories apply.' },
];

function ThreadView({ thread }: { thread: ThreadMessage[] }) {
  return (
    <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
      {thread.map(msg => (
        <div key={msg.id} className={`flex gap-2.5 ${msg.sender === 'seller' ? 'flex-row-reverse' : ''}`}>
          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
            msg.sender === 'ops' ? 'bg-blue-600 text-white' :
            msg.sender === 'seller' ? 'bg-green-600 text-white' :
            'bg-gray-300 text-gray-600'}`}>
            {msg.sender === 'ops' ? 'OP' : msg.sender === 'seller' ? 'ME' : 'SYS'}
          </div>
          <div className={`max-w-[80%] rounded-xl px-3.5 py-2.5 ${
            msg.sender === 'seller' ? 'bg-green-50 border border-green-100' :
            msg.sender === 'ops' ? 'bg-blue-50 border border-blue-100' :
            'bg-gray-100 border border-gray-200'}`}>
            {msg.isDisputeSubmission && (
              <div className="flex items-center gap-1 mb-1">
                <Scale className="w-3 h-3 text-orange-500" />
                <span className="text-[10px] font-bold text-orange-600 uppercase">Dispute Submission</span>
              </div>
            )}
            <p className="text-xs text-gray-700 leading-relaxed">{msg.content}</p>
            <p className="text-[10px] text-gray-400 mt-1 text-right">{msg.sentAt.toLocaleString()}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function ViolationRow({ violation, sellerId }: { violation: Violation; sellerId: string }) {
  const [expanded, setExpanded] = useState(false);
  const [mode, setMode] = useState<'none' | 'reply' | 'dispute'>('none');
  const [replyText, setReplyText] = useState('');
  const [disputeCategory, setDisputeCategory] = useState<DisputeCategory | ''>('');
  const [disputeExplanation, setDisputeExplanation] = useState('');

  const meta = STATUS_META[violation.status];
  const StatusIcon = meta.icon;
  const canAct = violation.status === 'sent_to_seller' || violation.status === 'acknowledged';
  const canDispute = canAct && !violation.disputes?.some(d => d.status === 'open' || d.status === 'under_review');
  const isTerminal = ['actioned', 'acquitted', 'closed', 'overturned', 'upheld'].includes(violation.status);

  return (
    <div className={`bg-white rounded-xl border ${violation.status === 'sent_to_seller' ? 'border-blue-300 shadow-sm' : 'border-gray-200'} overflow-hidden`}>
      {/* Row Header */}
      <div className="px-5 py-4 flex items-start gap-4 cursor-pointer hover:bg-gray-50" onClick={() => setExpanded(!expanded)}>
        <StatusIcon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
          violation.status === 'sent_to_seller' ? 'text-blue-500' :
          isTerminal && violation.status === 'actioned' ? 'text-red-500' :
          isTerminal ? 'text-green-500' : 'text-gray-400'}`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-sm font-bold text-gray-900">{violation.id}</span>
            <span className="text-sm text-gray-600">{violation.idViolation}</span>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${meta.color}`}>{meta.label}</span>
            {violation.status === 'sent_to_seller' && (
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full animate-pulse">Response Needed</span>
            )}
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-500 flex-wrap">
            <span>{violation.violationDate}</span>
            <span>·</span>
            <span>{violation.countryCode}</span>
            <span>·</span>
            <span className={`font-semibold ${violation.severity === 'critical' ? 'text-red-600' : violation.severity === 'high' ? 'text-orange-600' : 'text-yellow-600'}`}>{violation.severity}</span>
            {violation.warningCount > 0 && <span>· Warning #{violation.warningCount}</span>}
          </div>
        </div>
        <div className="flex-shrink-0">
          {expanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </div>
      </div>

      {/* Expanded Detail */}
      {expanded && (
        <div className="border-t border-gray-100 p-5 space-y-5">
          {/* Violation Notice */}
          {violation.messageToSeller && (
            <div>
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />Violation Notice
              </p>
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                {violation.messageToSeller}
              </div>
            </div>
          )}

          {/* Verdict / Resolution */}
          {violation.verdict && (
            <div className={`rounded-xl p-4 ${violation.verdict.type === 'acquitted' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <p className="text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5" />
                <span className={violation.verdict.type === 'acquitted' ? 'text-green-700' : 'text-red-700'}>
                  Verdict: {violation.verdict.type === 'acquitted' ? 'Acquitted' : 'Actioned'}
                </span>
              </p>
              <p className="text-sm text-gray-700">{violation.verdict.reason}</p>
              <p className="text-xs text-gray-400 mt-2">
                {violation.verdict.appealEligible && '⚠ You may appeal this decision. '}
                Issued by {violation.verdict.issuedBy} · {violation.verdict.issuedAt.toLocaleDateString()}
              </p>
            </div>
          )}

          {/* Communication Thread */}
          {(violation.thread ?? []).length > 0 && (
            <div>
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5" />Communication Thread
              </p>
              <ThreadView thread={violation.thread ?? []} />
            </div>
          )}

          {/* Action Buttons */}
          {canAct && mode === 'none' && (
            <div className="flex gap-2 pt-2">
              <button onClick={() => setMode('reply')}
                className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 flex items-center justify-center gap-2">
                <MessageSquare className="w-4 h-4" />Reply
              </button>
              {canDispute && (
                <button onClick={() => setMode('dispute')}
                  className="flex-1 py-2.5 bg-orange-600 text-white rounded-xl text-sm font-semibold hover:bg-orange-700 flex items-center justify-center gap-2">
                  <Scale className="w-4 h-4" />Formally Dispute
                </button>
              )}
            </div>
          )}

          {/* Reply Form */}
          {mode === 'reply' && (
            <div className="border border-blue-200 rounded-xl bg-blue-50 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-blue-800 flex items-center gap-1.5"><MessageSquare className="w-4 h-4" />Reply to Ops Team</p>
                <button onClick={() => setMode('none')}><X className="w-4 h-4 text-gray-400 hover:text-gray-600" /></button>
              </div>
              <p className="text-xs text-blue-600">A reply acknowledges the violation. If you believe this violation is incorrect, use "Formally Dispute" instead.</p>
              <textarea value={replyText} onChange={e => setReplyText(e.target.value)} rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                placeholder="Your response…" />
              <div className="flex items-center justify-between">
                <button className="text-xs text-gray-500 flex items-center gap-1 hover:text-gray-700">
                  <Paperclip className="w-3.5 h-3.5" />Attach file
                </button>
                <div className="flex gap-2">
                  <button onClick={() => setMode('none')} className="px-3 py-1.5 text-xs text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100">Cancel</button>
                  <button disabled={!replyText.trim()} className="px-4 py-1.5 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-40 flex items-center gap-1.5">
                    <Send className="w-3.5 h-3.5" />Send Reply
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Dispute Form */}
          {mode === 'dispute' && (
            <div className="border border-orange-200 rounded-xl bg-orange-50 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-orange-800 flex items-center gap-2"><Scale className="w-4 h-4" />Formal Dispute</p>
                <button onClick={() => setMode('none')}><X className="w-4 h-4 text-gray-400 hover:text-gray-600" /></button>
              </div>
              <div className="bg-orange-100 rounded-lg px-3 py-2 text-xs text-orange-700">
                A formal dispute is a structured challenge to this violation. You must select a category and provide a clear explanation. The ops team will review within 10 business days.
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-2">Dispute Category *</label>
                <div className="space-y-2">
                  {DISPUTE_CATEGORIES.map(cat => (
                    <label key={cat.value} className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer border transition-colors ${disputeCategory === cat.value ? 'border-orange-400 bg-white' : 'border-transparent hover:bg-white/60'}`}>
                      <input type="radio" name="disputeCategory" value={cat.value}
                        checked={disputeCategory === cat.value}
                        onChange={() => setDisputeCategory(cat.value)}
                        className="mt-0.5" />
                      <div>
                        <p className="text-xs font-semibold text-gray-800">{cat.label}</p>
                        <p className="text-[11px] text-gray-500">{cat.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-2">Explanation *</label>
                <textarea value={disputeExplanation} onChange={e => setDisputeExplanation(e.target.value)} rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
                  placeholder="Provide a detailed explanation of why this violation is incorrect. Include any relevant facts, dates, or references…" />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-2">Supporting Evidence</label>
                <button className="w-full py-2.5 border-2 border-dashed border-orange-300 text-xs text-orange-600 rounded-xl hover:border-orange-400 flex items-center justify-center gap-2">
                  <Paperclip className="w-4 h-4" />Click to attach documents, invoices, screenshots…
                </button>
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button onClick={() => setMode('none')} className="px-4 py-2 text-xs text-gray-600 border border-gray-300 rounded-xl hover:bg-gray-100">Cancel</button>
                <button
                  disabled={!disputeCategory || !disputeExplanation.trim()}
                  className="px-5 py-2 text-xs bg-orange-600 text-white rounded-xl hover:bg-orange-700 disabled:opacity-40 font-semibold flex items-center gap-1.5">
                  <Scale className="w-3.5 h-3.5" />Submit Dispute
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function MyViolations({ sellerId }: { sellerId: string }) {
  const [filter, setFilter] = useState<'all' | 'active' | 'resolved'>('all');
  const violations = mockViolations.filter(v => v.partnerID === sellerId);
  const seller = mockSellers[sellerId];

  const filtered = violations.filter(v => {
    if (filter === 'active') return !['actioned', 'acquitted', 'closed', 'overturned'].includes(v.status);
    if (filter === 'resolved') return ['actioned', 'acquitted', 'closed', 'overturned'].includes(v.status);
    return true;
  });

  const needsAction = violations.filter(v => v.status === 'sent_to_seller').length;
  const active = violations.filter(v => !['actioned', 'acquitted', 'closed', 'overturned'].includes(v.status)).length;

  return (
    <div className="space-y-6">
      {/* Attention Banner */}
      {needsAction > 0 && (
        <div className="bg-blue-600 text-white rounded-xl p-4 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <div>
            <p className="text-sm font-bold">{needsAction} violation{needsAction > 1 ? 's' : ''} require your response</p>
            <p className="text-xs text-blue-200 mt-0.5">Please respond within 5 business days to avoid automatic escalation.</p>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">{violations.length}</p>
          <p className="text-xs text-gray-500 mt-0.5">Total Violations</p>
        </div>
        <div className={`rounded-xl border p-4 text-center ${active > 0 ? 'bg-orange-50 border-orange-200' : 'bg-white border-gray-200'}`}>
          <p className={`text-2xl font-bold ${active > 0 ? 'text-orange-700' : 'text-gray-900'}`}>{active}</p>
          <p className="text-xs text-gray-500 mt-0.5">Active / Open</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">{seller?.disputeSuccessRate ?? 0}%</p>
          <p className="text-xs text-gray-500 mt-0.5">My Win Rate</p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {(['all', 'active', 'resolved'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${filter === f ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
            {f}
          </button>
        ))}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-gray-400">
          <CheckCircle className="w-10 h-10 mb-3 text-green-300" />
          <p className="text-sm">No violations in this category</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(v => <ViolationRow key={v.id} violation={v} sellerId={sellerId} />)}
        </div>
      )}
    </div>
  );
}
