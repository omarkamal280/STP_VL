import React, { useState } from 'react';
import {
  X, FileText, ImageIcon, ChevronDown, ChevronUp,
  AlertCircle, Package, CheckCircle, Upload, ArrowLeft,
} from 'lucide-react';
import { Violation } from '../types';

interface Props {
  violation: Violation;
  onClose: () => void;
}

// ── Maps ──────────────────────────────────────────────────────────────────────

const VIOLATION_TITLE: Record<string, string> = {
  'IP Violation':               'Intellectual Property Violation',
  'Counterfeit Listing':        'Counterfeit Listing Violation',
  'Counterfeit Sale':           'Counterfeit Sale Violation',
  'Delivery Policy Violation':  'Delivery & Logistics Policy Violation',
  'Pricing Manipulation':       'Pricing Policy Violation',
  'Abusive Communication':      'Communication Policy Violation',
  'Abusive Conduct':            'Conduct Policy Violation',
  'Duplicate Listing':          'Listing Policy Violation',
  'Prohibited Product':         'Prohibited Product Violation',
  'Prohibited Listing':         'Prohibited Listing Violation',
  'Fake Feedback / Reviews':    'Review Integrity Violation',
  'Fake Document Submission':   'Documentation Fraud Violation',
  'Fraudulent Dispute':         'Fraudulent Dispute Violation',
  'Money Laundering':           'Financial Misconduct Violation',
  'Offer / Promotion Abuse':    'Promotion Abuse Violation',
  'Malicious Order Activity':   'Order Manipulation Violation',
  'False Legal Action Threat':  'Legal Misconduct Violation',
  'Duplicate Account':          'Account Policy Violation',
  'Improper Rating Manipulation': 'Rating Manipulation Violation',
};

const VIOLATION_SUBTITLE: Record<string, string> = {
  'IP Violation':               'Trademark or copyright infringement',
  'Counterfeit Listing':        'Suspected counterfeit products listed',
  'Counterfeit Sale':           'Counterfeit products sold to a customer',
  'Delivery Policy Violation':  'Shipping SLA breach',
  'Pricing Manipulation':       'Artificial pricing anomaly detected',
  'Abusive Communication':      'Inappropriate seller communications',
  'Abusive Conduct':            'Policy-violating seller conduct',
  'Duplicate Listing':          'Duplicate product listings detected',
  'Prohibited Product':         'Restricted items listed or sold',
  'Prohibited Listing':         'Non-compliant listing detected',
  'Fake Feedback / Reviews':    'Review manipulation detected',
};

const MOCK_SKUS: Record<string, { name: string; sku: string; badge?: string }[]> = {
  'IP Violation':              [{ name: 'Nike Air Max 270 Running Shoes',       sku: '80AAE3682D309172A2511Z-1', badge: 'express' }],
  'Counterfeit Listing':       [{ name: 'Premium Watch Collection Gold Edition', sku: '91BBF4793E410283B3622W-2', badge: 'express' }],
  'Counterfeit Sale':          [{ name: 'Adidas Original Track Jacket',          sku: '72CCG5804F521394C4733X-3' }],
  'Delivery Policy Violation': [{ name: 'Fast-Ship Electronics Bundle',          sku: '63DDH6915G632405D5844Y-4' }],
  'Pricing Manipulation':      [{ name: 'Smart Home Device Hub Pro',             sku: '54EEI7026H743516E6955Z-5', badge: 'express' }],
  'Duplicate Listing':         [{ name: 'Wireless Earphones Pro Max',            sku: '45FFJ8137I854627F7066A-6', badge: 'express' }],
  'Prohibited Product':        [{ name: 'High-Power Laser Module 5000mW',        sku: '36GGK9248J965738G8177B-7' }],
  'Fake Feedback / Reviews':   [{ name: 'Beauty Serum Ultimate Formula',         sku: '27HHJ0359K076849H9288C-8', badge: 'express' }],
};

const STATUS_PILL_CLS: Record<string, string> = {
  sanctioned:              'bg-orange-100 text-orange-700',
  disputed:                'bg-yellow-100 text-yellow-700',
  sanctioned_acknowledged: 'bg-purple-100 text-purple-700',
  upheld:                  'bg-red-100 text-red-700',
  appealed:                'bg-amber-100 text-amber-700',
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

const NON_ACTION_MSG: Record<string, { text: string; cls: string }> = {
  disputed:                { text: 'Your dispute is under review by the noon compliance team. You will be notified of the outcome within 5 business days.',    cls: 'bg-yellow-50 text-yellow-800' },
  sanctioned_acknowledged: { text: 'Your acknowledgment has been received. The compliance team is reviewing your corrective plan.',                           cls: 'bg-purple-50 text-purple-800' },
  appealed:                { text: 'This case has been escalated for a final and binding review. No further action is required from you at this time.',       cls: 'bg-blue-50 text-blue-800'   },
  upheld:                  { text: 'This violation has been upheld. All associated fines and black-point penalties have been applied to your account.',        cls: 'bg-red-50 text-red-800'     },
  dismissed:               { text: 'This violation has been dismissed following your dispute. No penalties have been applied. Your account standing is restored.', cls: 'bg-green-50 text-green-800' },
};

const SEVERITY_BP: Record<string, number> = { critical: 100, high: 80, medium: 20, low: 10 };

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmtTimeline(d: Date): string {
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${months[d.getMonth()]} ${d.getDate()} · ${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}`;
}

function timeAgo(d: Date): string {
  const days = Math.floor((Date.now() - d.getTime()) / 86400000);
  if (days === 0) return 'today';
  if (days === 1) return '1 day ago';
  return `${days} days ago`;
}

// ── Component ─────────────────────────────────────────────────────────────────

const SellerViolationModal: React.FC<Props> = ({ violation, onClose }) => {
  const [skusOpen, setSkusOpen]       = useState(false);
  const [view, setView]               = useState<'detail' | 'dispute' | 'accept'>('detail');
  const [disputeText, setDisputeText] = useState('');
  const [acceptNotes, setAcceptNotes] = useState('');
  const [acceptedSteps, setAcceptedSteps] = useState<boolean[]>([]);
  const [submitted, setSubmitted]     = useState(false);

  const canAct    = violation.status === 'sanctioned';
  const skus      = MOCK_SKUS[violation.type] ?? [{ name: 'Product listing', sku: 'N/A' }];
  const bp        = SEVERITY_BP[violation.severity] ?? 10;
  const statusLabel = STATUS_LABEL[violation.status] ?? violation.status;
  const statusCls   = STATUS_PILL_CLS[violation.status] ?? 'bg-gray-100 text-gray-500';
  const issuedDate  = violation.createdAt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  const deadline  = new Date(violation.createdAt.getTime() + 30 * 24 * 60 * 60 * 1000);
  const daysLeft  = Math.ceil((deadline.getTime() - Date.now()) / 86400000);

  const statusChangedAt = new Date(violation.createdAt.getTime() + 2 * 60 * 1000);
  const timelineEvents  = [
    { label: 'Ticket Created',              time: violation.createdAt, bold: false },
    { label: `Status changed to\n${statusLabel}`, time: statusChangedAt, bold: true },
  ];

  const poaSteps = violation.poa?.steps ?? [];

  const toggleStep = (i: number) => {
    setAcceptedSteps(prev => { const n = [...prev]; n[i] = !n[i]; return n; });
  };

  const initAccept = () => {
    setAcceptedSteps(new Array(poaSteps.length).fill(false));
    setView('accept');
  };

  const allStepsAccepted = acceptedSteps.length > 0 && acceptedSteps.every(Boolean);
  const title    = VIOLATION_TITLE[violation.type] ?? violation.type;
  const subtitle = VIOLATION_SUBTITLE[violation.type] ?? '';

  // ── Submitted confirmation ────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-10 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">
            {view === 'dispute' ? 'Dispute Submitted' : 'Acceptance Confirmed'}
          </h2>
          <p className="text-sm text-gray-500 leading-relaxed">
            {view === 'dispute'
              ? 'Your dispute has been submitted. The noon compliance team will review it and respond within 5 business days.'
              : 'Your acceptance and corrective plan have been submitted. The compliance team will review your commitment.'}
          </p>
          <button onClick={onClose} className="mt-2 px-6 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors">
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">

        {/* ── Modal header ─────────────────────────────────────────────────── */}
        <div className="flex-shrink-0 px-6 pt-6 pb-4 border-b border-gray-100">
          {view !== 'detail' && (
            <button
              onClick={() => setView('detail')}
              className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 mb-3 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to violation details
            </button>
          )}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold text-gray-900 leading-snug">
                {view === 'dispute' ? 'Submit a Dispute'
                  : view === 'accept' ? 'Accept & Commit to Fix'
                  : `${title}: ${subtitle}`}
              </h2>
              {view === 'detail' && (
                <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                  <span className="text-sm text-gray-500">Issued: {issuedDate}</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusCls}`}>{statusLabel}</span>
                  <span className="text-sm text-gray-500">{bp} Black Points</span>
                </div>
              )}
            </div>
            <button onClick={onClose} className="flex-shrink-0 p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ── DETAIL VIEW ──────────────────────────────────────────────────── */}
        {view === 'detail' && (
          <>
            <div className="flex flex-1 min-h-0 overflow-hidden">

              {/* Left panel */}
              <div className="flex-1 min-w-0 overflow-y-auto px-6 py-5 space-y-6 border-r border-gray-100">

                {/* Activity Timeline */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">Activity Timeline</h3>
                  <div className="relative">
                    <div className="absolute top-2 left-2 w-[calc(100%-3rem)] h-0.5 bg-blue-500" />
                    <div className="flex gap-16 relative z-10">
                      {timelineEvents.map((ev, i) => (
                        <div key={i} className="flex flex-col min-w-0">
                          <div className={`w-4 h-4 rounded-full border-2 border-blue-500 flex-shrink-0 ${i === timelineEvents.length - 1 ? 'bg-blue-500' : 'bg-white'}`} />
                          <p className={`text-xs mt-2 whitespace-pre-line ${ev.bold ? 'font-bold text-gray-900' : 'text-gray-600'}`}>{ev.label}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{i === timelineEvents.length - 1 ? timeAgo(ev.time) : fmtTimeline(ev.time)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{violation.description}</p>
                </div>

                {/* Evidence */}
                {violation.evidence && violation.evidence.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">Evidence and Documentation</h3>
                    <div className="space-y-2">
                      {violation.evidence.map((file, i) => {
                        const isPdf = file.endsWith('.pdf');
                        return (
                          <div key={i} className="flex items-center justify-between bg-blue-50 border border-blue-100 rounded-xl px-3 py-2.5">
                            <div className="flex items-center gap-2.5 min-w-0">
                              {isPdf
                                ? <FileText className="w-5 h-5 text-blue-500 flex-shrink-0" />
                                : <ImageIcon className="w-5 h-5 text-blue-500 flex-shrink-0" />}
                              <div className="min-w-0">
                                <p className="text-sm font-medium text-gray-800 truncate">{file}</p>
                                <p className="text-xs text-gray-400">1 MB</p>
                              </div>
                            </div>
                            <button className="ml-3 flex-shrink-0 flex items-center gap-1 text-sm text-gray-400 hover:text-red-500 transition-colors">
                              <X className="w-3.5 h-3.5" /> Remove
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Affected SKUs */}
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setSkusOpen(o => !o)}
                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 text-sm font-semibold text-gray-900 transition-colors"
                  >
                    Affected SKUs
                    {skusOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                  </button>
                  {skusOpen && (
                    <div className="border-t border-gray-100 divide-y divide-gray-100">
                      {skus.map((sku, i) => (
                        <div key={i} className="flex items-center gap-3 px-4 py-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Package className="w-5 h-5 text-gray-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-800">{sku.name}</p>
                            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                              <p className="text-xs text-gray-400 font-mono">SKU: {sku.sku}</p>
                              {sku.badge && (
                                <span className="px-1.5 py-0.5 rounded bg-yellow-100 text-yellow-700 text-xs font-bold">{sku.badge}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Right panel — noon message */}
              <div className="w-64 flex-shrink-0 flex flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto p-4">
                  {violation.messageToSeller ? (
                    <div className="bg-blue-50 rounded-xl p-4 text-sm text-gray-700 leading-relaxed space-y-3">
                      <p>{violation.messageToSeller}</p>
                      {violation.poa && (
                        <>
                          <div className="border-t border-blue-100 pt-3 space-y-2">
                            <p className="font-semibold text-gray-800 text-xs uppercase tracking-wide">Plan of Action</p>
                            <p className="text-xs text-gray-600">{violation.poa.summary}</p>
                            <ul className="space-y-1.5 pl-3">
                              {violation.poa.steps.map((step, i) => (
                                <li key={i} className="list-disc text-xs text-gray-600">{step}</li>
                              ))}
                            </ul>
                          </div>
                          <p className="text-xs text-gray-400 border-t border-blue-100 pt-2">
                            For more information, refer to our Seller Policy pages on the noon Partners portal.
                          </p>
                        </>
                      )}
                      <div className="border-t border-blue-100 pt-2">
                        <p className="text-xs text-gray-500">Shukran,<br />Team noon</p>
                        <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                          <p className="text-xs text-gray-400">
                            {violation.createdAt.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}{' '}
                            {violation.createdAt.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                          <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-full ${statusCls}`}>{statusLabel}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-400 italic">
                      No message from noon team.
                    </div>
                  )}
                </div>

                {/* Non-actionable status bar (inside right panel) */}
                {!canAct && NON_ACTION_MSG[violation.status] && (
                  <div className="flex-shrink-0 p-3 border-t border-gray-100">
                    <div className={`rounded-xl p-3 text-xs leading-relaxed ${NON_ACTION_MSG[violation.status].cls}`}>
                      {NON_ACTION_MSG[violation.status].text}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer action bar — sanctioned only */}
            {canAct && (
              <div className="flex-shrink-0 border-t border-red-100 bg-red-50 px-6 py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 min-w-0">
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                  <span className="text-sm text-gray-700 font-medium whitespace-nowrap">Response deadline:</span>
                  <span className="text-sm font-bold text-red-600 whitespace-nowrap">
                    {deadline.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    <span className="font-normal ml-1 text-red-500">
                      ({daysLeft > 0 ? `${daysLeft} days left` : 'Overdue'})
                    </span>
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => setView('dispute')}
                    className="px-4 py-2 border border-gray-300 text-sm font-semibold text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Dispute
                  </button>
                  <button
                    onClick={initAccept}
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors"
                  >
                    Accept And Fix
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* ── DISPUTE VIEW ─────────────────────────────────────────────────── */}
        {view === 'dispute' && (
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
            <div className="bg-yellow-50 border border-yellow-100 rounded-xl px-4 py-3">
              <p className="text-sm font-semibold text-yellow-800 mb-1">Before submitting a dispute:</p>
              <ul className="list-disc pl-4 space-y-1 text-xs text-yellow-700">
                <li>Ensure your dispute is based on factual, verifiable information.</li>
                <li>Provide supporting documentation where possible.</li>
                <li>Disputes are reviewed by the compliance team within 5 business days.</li>
              </ul>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Reason for Dispute <span className="text-red-500">*</span>
              </label>
              <textarea
                value={disputeText}
                onChange={e => setDisputeText(e.target.value)}
                rows={5}
                placeholder="Provide a detailed explanation of why you believe this violation should be dismissed. Include relevant context, dates, and any supporting facts."
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Supporting Documents (optional)</label>
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-blue-300 transition-colors cursor-pointer">
                <Upload className="w-6 h-6 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-400">Click to upload or drag and drop</p>
                <p className="text-xs text-gray-300 mt-1">PDF, PNG, JPG up to 10 MB</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
              <button
                onClick={() => setView('detail')}
                className="px-5 py-2.5 border border-gray-300 text-sm font-semibold text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => { if (disputeText.trim()) setSubmitted(true); }}
                disabled={!disputeText.trim()}
                className="px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Submit Dispute
              </button>
            </div>
          </div>
        )}

        {/* ── ACCEPT & FIX VIEW ────────────────────────────────────────────── */}
        {view === 'accept' && (
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
            <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
              <p className="text-sm font-semibold text-blue-800 mb-1">By accepting this violation you agree to:</p>
              <ul className="list-disc pl-4 space-y-1 text-xs text-blue-700">
                <li>Acknowledge responsibility for the listed infringement.</li>
                <li>Commit to completing all corrective action steps listed below.</li>
                <li>Accept the associated fine and black-point penalties.</li>
              </ul>
            </div>

            {violation.poa && (
              <div>
                <p className="text-sm font-semibold text-gray-900 mb-0.5">{violation.poa.title}</p>
                <p className="text-sm text-gray-500 mb-3">{violation.poa.summary}</p>
                <div className="space-y-2">
                  {poaSteps.map((step, i) => (
                    <label
                      key={i}
                      className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                        acceptedSteps[i] ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={acceptedSteps[i] ?? false}
                        onChange={() => toggleStep(i)}
                        className="mt-0.5 accent-green-600 flex-shrink-0"
                      />
                      <span className={`text-sm ${acceptedSteps[i] ? 'text-green-800 font-medium' : 'text-gray-700'}`}>{step}</span>
                    </label>
                  ))}
                </div>
                {!allStepsAccepted && poaSteps.length > 0 && (
                  <p className="text-xs text-gray-400 mt-2">Check all steps above to confirm your commitment.</p>
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Additional Notes (optional)</label>
              <textarea
                value={acceptNotes}
                onChange={e => setAcceptNotes(e.target.value)}
                rows={3}
                placeholder="Add any notes about how you will implement the corrective actions…"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
              <button
                onClick={() => setView('detail')}
                className="px-5 py-2.5 border border-gray-300 text-sm font-semibold text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => { if (allStepsAccepted) setSubmitted(true); }}
                disabled={!allStepsAccepted}
                className="px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Confirm Acceptance
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default SellerViolationModal;
