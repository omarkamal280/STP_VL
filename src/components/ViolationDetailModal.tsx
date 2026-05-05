import React, { useState } from 'react';
import {
  X, AlertTriangle, CheckCircle, XCircle, FileText, MessageSquare,
  ShieldAlert, User, Clock, BookOpen, Paperclip, ChevronDown, ChevronUp,
  Scale, Ban, TrendingUp,
} from 'lucide-react';
import { Violation, Dispute, Acknowledgment } from '../types';
import { mockDisputes, mockAcknowledgments, mockSellers } from '../mockData';

// ── Helpers ──────────────────────────────────────────────────────────────────

const SEV_PILL: Record<string, string> = {
  critical: 'bg-red-100 text-red-700',
  high:     'bg-orange-100 text-orange-700',
  medium:   'bg-yellow-100 text-yellow-700',
  low:      'bg-green-100 text-green-700',
};

const STATUS_PILL: Record<string, string> = {
  sanctioned:              'bg-orange-100 text-orange-700',
  disputed:                'bg-yellow-100 text-yellow-700',
  sanctioned_acknowledged: 'bg-purple-100 text-purple-700',
  upheld:                  'bg-red-100 text-red-700',
  appealed:                'bg-blue-100 text-blue-700',
  dismissed:               'bg-green-100 text-green-700',
  voided:                  'bg-gray-100 text-gray-500',
};

const STATUS_LABEL: Record<string, string> = {
  sanctioned:              'Sanctioned',
  disputed:                'Disputed',
  sanctioned_acknowledged: 'Acknowledged',
  upheld:                  'Upheld',
  appealed:                'Appealed',
  dismissed:               'Dismissed',
  voided:                  'Voided',
};

interface ThreadMsg { id: string; from: 'ops' | 'seller' | 'system'; name: string; text: string; ts: Date; tag?: string; tagColor?: string; }

function buildThread(v: Violation, dispute: Dispute | null, ack: Acknowledgment | null): ThreadMsg[] {
  const msgs: ThreadMsg[] = [];

  if (v.messageToSeller) {
    msgs.push({
      id: 'm1', from: 'ops', name: 'Risk Team',
      text: v.messageToSeller + (v.poa ? ' A Plan of Action is attached — please review all steps.' : ''),
      ts: new Date(v.createdAt.getTime() + 3600000),
      tag: v.poa ? 'POA Attached' : undefined,
    });
  }

  if (dispute && ['disputed', 'upheld', 'appealed', 'dismissed'].includes(v.status)) {
    msgs.push({ id: 'm2', from: 'seller', name: `Seller ${v.sellerId}`, text: dispute.reason, ts: dispute.submittedAt, tag: 'Dispute Filed' });
  }

  if (v.status === 'upheld' && dispute?.opsReply) {
    msgs.push({ id: 'm3', from: 'ops', name: 'Risk Team', text: dispute.opsReply, ts: dispute.opsRepliedAt!, tag: 'Violation Upheld', tagColor: 'bg-red-100 text-red-700' });
  }
  if (v.status === 'appealed' && dispute?.opsReply) {
    msgs.push({ id: 'm3', from: 'ops', name: 'Risk Team', text: dispute.opsReply, ts: dispute.opsRepliedAt!, tag: 'Escalated — Under Final Review', tagColor: 'bg-blue-100 text-blue-700' });
  }
  if (v.status === 'dismissed' && dispute?.opsReply) {
    msgs.push({ id: 'm3', from: 'system', name: 'System', text: dispute.opsReply, ts: dispute.opsRepliedAt!, tag: 'Violation Dismissed — Seller Cleared', tagColor: 'bg-green-100 text-green-700' });
  }

  if (ack && v.status === 'sanctioned_acknowledged') {
    msgs.push({ id: 'm4', from: 'seller', name: `Seller ${v.sellerId}`, text: ack.poaFollowed, ts: ack.submittedAt, tag: 'Acknowledged — POA Followed' });
  }
  if (ack?.opsReply && v.status === 'sanctioned_acknowledged') {
    msgs.push({ id: 'm5', from: 'system', name: 'System', text: ack.opsReply, ts: ack.opsRepliedAt!, tag: 'Acknowledgment Accepted' });
  }

  if (v.status === 'voided') {
    msgs.push({ id: 'm-void', from: 'system', name: 'System', text: 'This violation record has been voided by the admin team due to an error in the claim details. The record remains in the ledger for audit purposes but is no longer visible to the seller.', ts: v.createdAt, tag: 'Voided by Admin', tagColor: 'bg-gray-100 text-gray-600' });
  }

  return msgs;
}

// ── Props ────────────────────────────────────────────────────────────────────

interface ViolationDetailModalProps {
  violation: Violation | null;
  isOpen: boolean;
  onClose: () => void;
  mode: 'ops' | 'seller';
}

const SIMULATED_FILES = ['supporting_evidence.pdf', 'invoice_proof.pdf', 'brand_certificate.pdf', 'distributor_agreement.pdf'];

const ViolationDetailModal: React.FC<ViolationDetailModalProps> = ({ violation, isOpen, onClose, mode }) => {
  const [sellerAction, setSellerAction]     = useState<'acknowledge' | 'dispute' | ''>('');
  const [sellerAckText, setSellerAckText]   = useState('');
  const [sellerDispText, setSellerDispText] = useState('');
  const [sellerFiles, setSellerFiles]       = useState<string[]>([]);
  const [sellerDone, setSellerDone]         = useState(false);
  const [opsAction, setOpsAction]           = useState<'uphold' | 'appeal' | 'dismiss' | 'accept_ack' | 'void' | ''>('');
  const [opsReason, setOpsReason]           = useState('');
  const [opsDone, setOpsDone]               = useState(false);
  const [poaOpen, setPoaOpen]               = useState(true);

  React.useEffect(() => {
    if (isOpen) {
      setSellerAction(''); setSellerAckText(''); setSellerDispText(''); setSellerFiles([]); setSellerDone(false);
      setOpsAction(''); setOpsReason(''); setOpsDone(false); setPoaOpen(true);
    }
  }, [isOpen, violation?.id]);

  if (!isOpen || !violation) return null;

  const seller  = mockSellers[violation.sellerId];
  const dispute = mockDisputes.find(d => d.violationId === violation.id) ?? null;
  const ack     = mockAcknowledgments.find(a => a.violationId === violation.id) ?? null;
  const thread  = buildThread(violation, dispute, ack);
  const status  = violation.status;
  const fmt = (d: Date) => d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  const addFile = () => { const avail = SIMULATED_FILES.filter(f => !sellerFiles.includes(f)); if (avail.length) setSellerFiles(p => [...p, avail[0]]); };

  // ── Seller action panel ───────────────────────────────────────────────────
  const renderSellerPanel = () => {
    if (status === 'voided') return (
      <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 border border-gray-200">
        <Ban className="w-5 h-5 text-gray-400 flex-shrink-0" />
        <p className="text-sm text-gray-500">This violation is not applicable to your account.</p>
      </div>
    );
    if (sellerDone) {
      const isAck = sellerAction === 'acknowledge';
      return (
        <div className={`flex items-start gap-3 p-4 rounded-xl border ${isAck ? 'bg-purple-50 border-purple-200' : 'bg-yellow-50 border-yellow-200'}`}>
          <CheckCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isAck ? 'text-purple-500' : 'text-yellow-500'}`} />
          <div>
            <p className={`text-sm font-bold ${isAck ? 'text-purple-800' : 'text-yellow-800'}`}>
              {isAck ? 'Acknowledgment submitted — pending review' : 'Dispute submitted — under investigation'}
            </p>
            <p className={`text-xs mt-0.5 ${isAck ? 'text-purple-600' : 'text-yellow-600'}`}>The Risk Team will review your response within 5 business days.</p>
          </div>
        </div>
      );
    }
    if (status === 'dismissed') return (
      <div className="flex items-center gap-3 p-4 rounded-xl bg-green-50 border border-green-200">
        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
        <div>
          <p className="text-sm font-bold text-green-800">Violation dismissed — you are cleared</p>
          <p className="text-xs text-green-600 mt-0.5">Your dispute was accepted on its merits. No penalty applies. Record maintained to avoid double jeopardy.</p>
        </div>
      </div>
    );
    if (status === 'upheld') return (
      <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200">
        <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-red-800">Violation upheld — you are liable</p>
          <p className="text-xs text-red-600 mt-0.5">This violation has been reviewed and upheld. All applicable penalties apply. This decision cannot be disputed.</p>
        </div>
      </div>
    );
    if (status === 'appealed') return (
      <div className="flex items-center gap-3 p-4 rounded-xl bg-blue-50 border border-blue-200">
        <Scale className="w-5 h-5 text-blue-500 flex-shrink-0" />
        <div>
          <p className="text-sm font-bold text-blue-800">Under final review</p>
          <p className="text-xs text-blue-600 mt-0.5">Your dispute has been escalated for a second and final investigation. A senior risk analyst will make the final determination.</p>
        </div>
      </div>
    );
    if (status === 'disputed') return (
      <div className="flex items-center gap-3 p-4 rounded-xl bg-yellow-50 border border-yellow-200">
        <Clock className="w-5 h-5 text-yellow-500 flex-shrink-0" />
        <div>
          <p className="text-sm font-bold text-yellow-800">Dispute under investigation</p>
          <p className="text-xs text-yellow-600 mt-0.5">Your dispute has been received and is being investigated. The Risk Team will respond within 5 business days.</p>
        </div>
      </div>
    );
    if (status === 'sanctioned_acknowledged') return (
      <div className="flex items-center gap-3 p-4 rounded-xl bg-purple-50 border border-purple-200">
        <CheckCircle className="w-5 h-5 text-purple-500 flex-shrink-0" />
        <div>
          <p className="text-sm font-bold text-purple-800">Acknowledgment under review</p>
          <p className="text-xs text-purple-600 mt-0.5">Your acknowledgment has been received. The Risk Team will verify your corrective actions within 5 business days.</p>
        </div>
      </div>
    );
    return (
      <div className="space-y-3">
        <div className="flex items-start gap-2 p-3 rounded-lg bg-orange-50 border border-orange-200 text-xs text-orange-700">
          <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
          <span>Please review the Plan of Action above, then acknowledge or dispute this violation.</span>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setSellerAction('acknowledge')}
            className={`flex-1 py-2 rounded-xl text-sm font-semibold border transition-all ${sellerAction === 'acknowledge' ? 'bg-purple-600 text-white border-purple-600 shadow-sm' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}>
            ✓ Acknowledge
          </button>
          <button onClick={() => setSellerAction('dispute')}
            className={`flex-1 py-2 rounded-xl text-sm font-semibold border transition-all ${sellerAction === 'dispute' ? 'bg-yellow-500 text-white border-yellow-500 shadow-sm' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}>
            ⚑ Dispute
          </button>
        </div>
        {sellerAction === 'acknowledge' && (
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-600">How did you follow the POA and fix the issue? <span className="text-red-500">*</span></label>
            <textarea value={sellerAckText} onChange={e => setSellerAckText(e.target.value)} rows={3}
              placeholder="Describe the corrective actions you took to follow the Plan of Action and prevent recurrence…"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none" />
            <button onClick={() => { if (sellerAckText.trim()) setSellerDone(true); }} disabled={!sellerAckText.trim()}
              className="w-full py-2.5 rounded-xl text-sm font-semibold bg-purple-600 hover:bg-purple-700 text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed">
              Submit Acknowledgment
            </button>
          </div>
        )}
        {sellerAction === 'dispute' && (
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-600">Reason for dispute <span className="text-red-500">*</span></label>
            <textarea value={sellerDispText} onChange={e => setSellerDispText(e.target.value)} rows={3}
              placeholder="Explain why you dispute this violation and provide supporting context…"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none" />
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-gray-600">Evidence files</label>
                <button onClick={addFile} className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"><Paperclip className="w-3 h-3" /> Attach file</button>
              </div>
              {sellerFiles.length > 0
                ? <div className="space-y-1">{sellerFiles.map((f, i) => <div key={i} className="flex items-center gap-1.5 text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded-lg"><FileText className="w-3 h-3 text-gray-400" />{f}</div>)}</div>
                : <p className="text-xs text-gray-400 italic">No files attached</p>}
            </div>
            <button onClick={() => { if (sellerDispText.trim()) setSellerDone(true); }} disabled={!sellerDispText.trim()}
              className="w-full py-2.5 rounded-xl text-sm font-semibold bg-yellow-500 hover:bg-yellow-600 text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed">
              Submit Dispute
            </button>
          </div>
        )}
      </div>
    );
  };

  // ── Ops action panel ──────────────────────────────────────────────────────
  const renderOpsPanel = () => {
    if (opsDone) {
      const configs: Record<string, { bg: string; icon: React.ReactNode; label: string; sub: string }> = {
        uphold:     { bg: 'bg-red-50 border-red-200',    icon: <XCircle className="w-5 h-5 text-red-500" />,    label: 'Violation upheld — seller is liable',           sub: 'All penalties apply. Seller has been notified.' },
        appeal:     { bg: 'bg-blue-50 border-blue-200',  icon: <TrendingUp className="w-5 h-5 text-blue-500" />, label: 'Escalated for final review',                     sub: 'A senior risk analyst will make the final determination.' },
        dismiss:    { bg: 'bg-green-50 border-green-200',icon: <CheckCircle className="w-5 h-5 text-green-500" />,label: 'Violation dismissed — seller cleared',           sub: 'No penalties apply. Record maintained to avoid double jeopardy.' },
        accept_ack: { bg: 'bg-green-50 border-green-200',icon: <CheckCircle className="w-5 h-5 text-green-500" />,label: 'Acknowledgment accepted',                       sub: 'Seller has confirmed corrective action. Case noted.' },
        void:       { bg: 'bg-gray-50 border-gray-200',  icon: <Ban className="w-5 h-5 text-gray-400" />,        label: 'Violation voided',                              sub: 'This record is no longer visible to the seller.' },
      };
      const c = configs[opsAction] ?? configs.dismiss;
      return (
        <div className={`flex items-start gap-3 p-4 rounded-xl border ${c.bg}`}>
          <div className="flex-shrink-0 mt-0.5">{c.icon}</div>
          <div>
            <p className="text-sm font-bold text-gray-800">{c.label}</p>
            <p className="text-xs text-gray-500 mt-0.5">{c.sub}</p>
          </div>
        </div>
      );
    }

    if (status === 'dismissed') return (
      <div className="flex items-center gap-3 p-4 rounded-xl bg-green-50 border border-green-200">
        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
        <div>
          <p className="text-sm font-bold text-green-800">Dismissed — seller cleared</p>
          <p className="text-xs text-green-600 mt-0.5">Dispute was accepted on its merits. No further action required.</p>
        </div>
      </div>
    );
    if (status === 'voided') return (
      <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 border border-gray-200">
        <Ban className="w-5 h-5 text-gray-400 flex-shrink-0" />
        <div>
          <p className="text-sm font-bold text-gray-700">Voided by admin</p>
          <p className="text-xs text-gray-500 mt-0.5">This violation is no longer visible to the seller. Record maintained for audit.</p>
        </div>
      </div>
    );
    if (status === 'sanctioned') return (
      <div className="space-y-3">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-orange-50 border border-orange-200">
          <Clock className="w-4 h-4 text-orange-500 flex-shrink-0" />
          <p className="text-xs text-orange-700 font-medium">Awaiting seller response — no action required until seller responds.</p>
        </div>
        {!opsAction ? (
          <button onClick={() => setOpsAction('void')} className="w-full py-2 rounded-xl text-xs font-semibold border border-gray-200 text-gray-500 hover:bg-gray-50 transition-all">
            Void this violation (admin)
          </button>
        ) : (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-600">Reason for voiding <span className="text-red-500">*</span></p>
            <textarea value={opsReason} onChange={e => setOpsReason(e.target.value)} rows={2} placeholder="Reason for voiding this violation…"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400 resize-none" />
            <div className="flex gap-2">
              <button onClick={() => setOpsAction('')} className="flex-1 py-2 rounded-xl text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50">Back</button>
              <button onClick={() => { if (opsReason.trim()) setOpsDone(true); }} disabled={!opsReason.trim()}
                className="flex-1 py-2 rounded-xl text-sm font-semibold bg-gray-600 hover:bg-gray-700 text-white transition-all disabled:opacity-40">Confirm Void</button>
            </div>
          </div>
        )}
      </div>
    );
    if (status === 'upheld') return (
      <div className="space-y-3">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-red-50 border border-red-200">
          <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
          <p className="text-xs text-red-700 font-medium">Upheld — seller is liable. This violation cannot be re-disputed.</p>
        </div>
        {!opsAction ? (
          <button onClick={() => setOpsAction('void')} className="w-full py-2 rounded-xl text-xs font-semibold border border-gray-200 text-gray-500 hover:bg-gray-50 transition-all">
            Void this violation (admin)
          </button>
        ) : (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-600">Reason for voiding <span className="text-red-500">*</span></p>
            <textarea value={opsReason} onChange={e => setOpsReason(e.target.value)} rows={2} placeholder="Reason for voiding this violation…"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400 resize-none" />
            <div className="flex gap-2">
              <button onClick={() => setOpsAction('')} className="flex-1 py-2 rounded-xl text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50">Back</button>
              <button onClick={() => { if (opsReason.trim()) setOpsDone(true); }} disabled={!opsReason.trim()}
                className="flex-1 py-2 rounded-xl text-sm font-semibold bg-gray-600 hover:bg-gray-700 text-white transition-all disabled:opacity-40">Confirm Void</button>
            </div>
          </div>
        )}
      </div>
    );
    if (status === 'disputed') return (
      <div className="space-y-3">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Review Dispute</p>
        {!opsAction ? (
          <div className="space-y-2">
            <div className="flex gap-2">
              <button onClick={() => setOpsAction('dismiss')} className="flex-1 py-2 rounded-xl text-sm font-semibold bg-green-600 hover:bg-green-700 text-white transition-all">✓ Dismiss</button>
              <button onClick={() => setOpsAction('appeal')}  className="flex-1 py-2 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-all">↑ Appeal</button>
              <button onClick={() => setOpsAction('uphold')}  className="flex-1 py-2 rounded-xl text-sm font-semibold bg-red-600 hover:bg-red-700 text-white transition-all">✕ Uphold</button>
            </div>
            <button onClick={() => setOpsAction('void')} className="w-full py-1.5 rounded-xl text-xs font-medium border border-gray-200 text-gray-400 hover:bg-gray-50 transition-all">
              Void (admin)
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <p className={`text-xs font-semibold ${opsAction === 'dismiss' ? 'text-green-700' : opsAction === 'appeal' ? 'text-blue-700' : opsAction === 'void' ? 'text-gray-600' : 'text-red-700'}`}>
              {opsAction === 'dismiss' ? '✓ Dismissing — seller will be cleared'
               : opsAction === 'appeal'  ? '↑ Escalating for final review'
               : opsAction === 'void'    ? 'Voiding this violation'
               : '✕ Upholding — seller remains liable'}
            </p>
            <label className="text-xs font-medium text-gray-600">Reason / notes <span className="text-red-500">*</span></label>
            <textarea value={opsReason} onChange={e => setOpsReason(e.target.value)} rows={2}
              placeholder="Add your reasoning…"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none" />
            <div className="flex gap-2">
              <button onClick={() => setOpsAction('')} className="flex-1 py-2 rounded-xl text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50">Back</button>
              <button onClick={() => { if (opsReason.trim()) setOpsDone(true); }} disabled={!opsReason.trim()}
                className={`flex-1 py-2 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-40 ${
                  opsAction === 'dismiss' ? 'bg-green-600 hover:bg-green-700' :
                  opsAction === 'appeal'  ? 'bg-blue-600 hover:bg-blue-700'   :
                  opsAction === 'void'    ? 'bg-gray-600 hover:bg-gray-700'   :
                                            'bg-red-600 hover:bg-red-700'}`}>
                Confirm
              </button>
            </div>
          </div>
        )}
      </div>
    );
    if (status === 'appealed') return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-blue-50 border border-blue-200">
          <Scale className="w-4 h-4 text-blue-500 flex-shrink-0" />
          <p className="text-xs text-blue-700 font-medium">Final review — admin decision only. This is the second and final investigation.</p>
        </div>
        {!opsAction ? (
          <div className="space-y-2">
            <div className="flex gap-2">
              <button onClick={() => setOpsAction('dismiss')} className="flex-1 py-2 rounded-xl text-sm font-semibold bg-green-600 hover:bg-green-700 text-white transition-all">✓ Dismiss (Final)</button>
              <button onClick={() => setOpsAction('uphold')}  className="flex-1 py-2 rounded-xl text-sm font-semibold bg-red-600 hover:bg-red-700 text-white transition-all">✕ Uphold (Final)</button>
            </div>
            <button onClick={() => setOpsAction('void')} className="w-full py-1.5 rounded-xl text-xs font-medium border border-gray-200 text-gray-400 hover:bg-gray-50 transition-all">
              Void (admin)
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <p className={`text-xs font-semibold ${opsAction === 'dismiss' ? 'text-green-700' : opsAction === 'void' ? 'text-gray-600' : 'text-red-700'}`}>
              {opsAction === 'dismiss' ? '✓ Final dismissal — seller will be cleared'
               : opsAction === 'void'  ? 'Voiding this violation'
               : '✕ Final uphold — seller remains liable'}
            </p>
            <label className="text-xs font-medium text-gray-600">Final decision notes <span className="text-red-500">*</span></label>
            <textarea value={opsReason} onChange={e => setOpsReason(e.target.value)} rows={2}
              placeholder="Final reasoning for this decision…"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none" />
            <div className="flex gap-2">
              <button onClick={() => setOpsAction('')} className="flex-1 py-2 rounded-xl text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50">Back</button>
              <button onClick={() => { if (opsReason.trim()) setOpsDone(true); }} disabled={!opsReason.trim()}
                className={`flex-1 py-2 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-40 ${opsAction === 'dismiss' ? 'bg-green-600 hover:bg-green-700' : opsAction === 'void' ? 'bg-gray-600 hover:bg-gray-700' : 'bg-red-600 hover:bg-red-700'}`}>
                Confirm Final Decision
              </button>
            </div>
          </div>
        )}
      </div>
    );
    if (status === 'sanctioned_acknowledged') return (
      <div className="space-y-3">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Review Acknowledgment</p>
        {!opsAction ? (
          <div className="space-y-2">
            <button onClick={() => setOpsAction('accept_ack')} className="w-full py-2.5 rounded-xl text-sm font-semibold bg-green-600 hover:bg-green-700 text-white transition-all">✓ Accept Acknowledgment</button>
            <button onClick={() => setOpsAction('void')} className="w-full py-1.5 rounded-xl text-xs font-medium border border-gray-200 text-gray-400 hover:bg-gray-50 transition-all">Void (admin)</button>
          </div>
        ) : (
          <div className="space-y-2">
            <p className={`text-xs font-semibold ${opsAction === 'void' ? 'text-gray-600' : 'text-green-700'}`}>
              {opsAction === 'void' ? 'Voiding this violation' : '✓ Accepting acknowledgment'}
            </p>
            <label className="text-xs font-medium text-gray-600">{opsAction === 'void' ? 'Reason for voiding' : 'Closure note'} <span className="text-gray-400">(optional)</span></label>
            <textarea value={opsReason} onChange={e => setOpsReason(e.target.value)} rows={2} placeholder={opsAction === 'void' ? 'Reason for voiding…' : 'Any notes on acceptance…'}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none" />
            <div className="flex gap-2">
              <button onClick={() => setOpsAction('')} className="flex-1 py-2 rounded-xl text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50">Back</button>
              <button onClick={() => setOpsDone(true)}
                className={`flex-1 py-2 rounded-xl text-sm font-semibold text-white transition-all ${opsAction === 'void' ? 'bg-gray-600 hover:bg-gray-700' : 'bg-green-600 hover:bg-green-700'}`}>
                Confirm
              </button>
            </div>
          </div>
        )}
      </div>
    );
    return null;
  };

  // ── JSX ───────────────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[92vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base font-bold text-gray-900">{violation.id}</h2>
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${SEV_PILL[violation.severity]}`}>{violation.severity.toUpperCase()}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_PILL[status]}`}>{STATUS_LABEL[status]}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${mode === 'ops' ? 'bg-indigo-100 text-indigo-700' : 'bg-teal-100 text-teal-700'}`}>
                  {mode === 'ops' ? 'Risk Team View' : 'Seller View'}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">{violation.type} · {seller?.name ?? violation.sellerId} · {violation.projectId}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><X className="w-4 h-4 text-gray-500" /></button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-hidden flex">

          {/* Left panel — details */}
          <div className="w-80 flex-shrink-0 border-r border-gray-100 overflow-y-auto p-5 space-y-5">

            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Details</p>
              <div className="space-y-2 text-sm">
                {([
                  ['Seller',   seller?.name ?? violation.sellerId],
                  ['Project',  violation.projectId],
                  ['Type',     violation.type],
                  ['Created',  violation.createdAt.toLocaleDateString('en-GB')],
                  ...(violation.zohoTicketId ? [['Ticket', violation.zohoTicketId]] : []),
                ] as [string,string][]).map(([k, val]) => (
                  <div key={k} className="flex justify-between gap-2">
                    <span className="text-gray-400 flex-shrink-0">{k}</span>
                    <span className="text-gray-800 font-medium text-right">{val}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Description</p>
              <p className="text-xs text-gray-600 leading-relaxed">{violation.description}</p>
            </div>

            {mode === 'ops' && violation.evidence && violation.evidence.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Evidence (Internal)</p>
                <div className="space-y-1">
                  {violation.evidence.map((f, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-xs text-blue-600"><FileText className="w-3 h-3 flex-shrink-0" /><span>{f}</span></div>
                  ))}
                </div>
              </div>
            )}

            {/* POA document */}
            {violation.poa && (
              <div className="rounded-xl border border-blue-200 bg-blue-50 overflow-hidden">
                <button onClick={() => setPoaOpen(o => !o)}
                  className="w-full flex items-center justify-between px-3 py-2.5 text-xs font-semibold text-blue-800">
                  <div className="flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5" /><span>Plan of Action</span></div>
                  {poaOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
                {poaOpen && (
                  <div className="px-3 pb-3 space-y-2 border-t border-blue-200">
                    <p className="text-xs font-semibold text-blue-900 pt-2">{violation.poa.title}</p>
                    <p className="text-xs text-blue-700 leading-relaxed">{violation.poa.summary}</p>
                    <div className="space-y-1.5">
                      {violation.poa.steps.map((step, i) => (
                        <div key={i} className="flex items-start gap-1.5 text-xs text-blue-800">
                          <span className="font-bold flex-shrink-0">{i + 1}.</span><span>{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Dispute card — ops only */}
            {mode === 'ops' && dispute && (
              <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5 text-yellow-600" /><p className="text-xs font-semibold text-yellow-800">Dispute {dispute.id}</p></div>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${dispute.status === 'dismissed' ? 'bg-green-100 text-green-700' : dispute.status === 'upheld' ? 'bg-red-100 text-red-700' : dispute.status === 'appealed' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>{dispute.status}</span>
                </div>
                <p className="text-xs text-gray-700 leading-relaxed">{dispute.reason}</p>
                {dispute.evidence.map((f, i) => <div key={i} className="flex items-center gap-1 text-xs text-blue-600"><FileText className="w-3 h-3" /><span>{f}</span></div>)}
                {dispute.opsReply && <div className="pt-2 border-t border-yellow-200 text-xs text-gray-600"><span className="font-medium">Reply: </span>{dispute.opsReply}</div>}
              </div>
            )}

            {/* Acknowledgment card — ops only */}
            {mode === 'ops' && ack && (
              <div className="rounded-xl border border-purple-200 bg-purple-50 p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-purple-500" /><p className="text-xs font-semibold text-purple-800">Acknowledgment {ack.id}</p></div>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${ack.status === 'accepted' ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'}`}>{ack.status}</span>
                </div>
                <p className="text-xs text-gray-700 leading-relaxed">{ack.poaFollowed}</p>
                {ack.opsReply && <div className="pt-2 border-t border-purple-200 text-xs text-gray-600"><span className="font-medium">Reply: </span>{ack.opsReply}</div>}
              </div>
            )}
          </div>

          {/* Right panel — communication thread + action */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              <div className="flex items-center gap-2 mb-1">
                <MessageSquare className="w-4 h-4 text-gray-400" />
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Communication Thread</p>
              </div>
              {thread.map(msg => (
                <div key={msg.id} className={`flex ${msg.from === 'seller' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-sm px-4 py-3 rounded-2xl text-sm shadow-sm ${
                    msg.from === 'system' ? 'bg-gray-100 text-gray-600 text-xs italic w-full text-center rounded-xl' :
                    msg.from === 'ops'    ? 'bg-blue-50 text-blue-900 rounded-tl-sm' :
                                            'bg-purple-50 text-purple-900 rounded-tr-sm'
                  }`}>
                    {msg.from !== 'system' && (
                      <div className="flex items-center gap-1.5 mb-1">
                        <User className="w-3 h-3 opacity-60" />
                        <span className="text-xs font-semibold opacity-70">{msg.name}</span>
                        {msg.tag && <span className={`ml-1 px-1.5 py-0.5 rounded-full text-xs font-medium ${msg.tagColor ?? 'bg-white/70'}`}>{msg.tag}</span>}
                      </div>
                    )}
                    {msg.from === 'system' && msg.tag && <div className={`text-xs font-semibold mb-1 inline-block px-2 py-0.5 rounded-full ${msg.tagColor ?? 'bg-gray-200 text-gray-600'}`}>{msg.tag}</div>}
                    <p className={msg.from === 'system' ? 'mt-1' : ''}>{msg.text}</p>
                    <div className="flex items-center gap-1 mt-1.5 opacity-40 justify-center"><Clock className="w-3 h-3" /><span className="text-xs">{fmt(msg.ts)}</span></div>
                  </div>
                </div>
              ))}
              {thread.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                  <MessageSquare className="w-8 h-8 mb-2 opacity-30" />
                  <p className="text-xs">No messages yet</p>
                </div>
              )}
            </div>
            <div className="border-t border-gray-100 p-5 flex-shrink-0">
              {mode === 'seller' ? renderSellerPanel() : renderOpsPanel()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViolationDetailModal;
