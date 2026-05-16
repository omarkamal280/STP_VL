import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Calendar, ChevronDown, ChevronLeft, ChevronRight,
  Star, Ban, Info, Check, AlertTriangle,
  X, HelpCircle, CheckCircle, XCircle, Sparkles,
} from 'lucide-react';
import { mockViolations } from '../mockData';
import { Violation, ViolationStatus } from '../types';
import SellerViolationModal from './SellerViolationModal';

// ── Maps ──────────────────────────────────────────────────────────────────────

const TYPE_FAMILY: Record<string, string> = {
  'IP Violation':                 'Marketplace Behavior Violations',
  'Counterfeit Listing':          'Marketplace Behavior Violations',
  'Counterfeit Sale':             'Marketplace Behavior Violations',
  'False Brand Representation':   'Marketplace Behavior Violations',
  'Fake Feedback / Reviews':      'Marketplace Behavior Violations',
  'Abusive Communication':        'Marketplace Behavior Violations',
  'Abusive Conduct':              'Marketplace Behavior Violations',
  'Fraudulent Dispute':           'Marketplace Behavior Violations',
  'Money Laundering':             'Marketplace Behavior Violations',
  'Malicious Order Activity':     'Marketplace Behavior Violations',
  'Offer / Promotion Abuse':      'Marketplace Behavior Violations',
  'Fake Document Submission':     'Marketplace Behavior Violations',
  'Improper Rating Manipulation': 'Marketplace Behavior Violations',
  'False Legal Action Threat':    'Marketplace Behavior Violations',
  'Pricing Manipulation':         'Pricing Violations',
  'Duplicate Listing':            'Listing Policy Violations',
  'Prohibited Product':           'Listing Policy Violations',
  'Prohibited Listing':           'Listing Policy Violations',
  'Duplicate Account':            'Account Violations',
  'Delivery Policy Violation':    'Shipping Violations',
};

const TYPE_CODE: Record<string, string> = {
  'IP Violation':                 'Listing IP',
  'Counterfeit Listing':          'Listing Counterfeit',
  'Counterfeit Sale':             'Sale Counterfeit',
  'False Brand Representation':   'Brand Misrepresentation',
  'Fake Feedback / Reviews':      'Review Fraud',
  'Abusive Communication':        'Abusive Communication',
  'Abusive Conduct':              'Abusive Conduct',
  'Fraudulent Dispute':           'Fraudulent Dispute',
  'Money Laundering':             'Financial Crime',
  'Malicious Order Activity':     'Order Manipulation',
  'Offer / Promotion Abuse':      'Promo Abuse',
  'Fake Document Submission':     'Document Fraud',
  'Improper Rating Manipulation': 'Rating Manipulation',
  'False Legal Action Threat':    'Legal Threat',
  'Pricing Manipulation':         'Price Manipulation',
  'Duplicate Listing':            'Listing Duplicate',
  'Prohibited Product':           'Prohibited Item',
  'Prohibited Listing':           'Prohibited Listing',
  'Duplicate Account':            'Duplicate Account',
  'Delivery Policy Violation':    'SLA Breach',
};

const STATUS_PILL: Record<ViolationStatus, { label: string; cls: string; icon: 'star' | 'ban' }> = {
  sanctioned:   { label: 'Sanctioned',    cls: 'bg-orange-100 text-orange-700', icon: 'star' },
  disputed:     { label: 'Disputed',      cls: 'bg-yellow-100 text-yellow-700', icon: 'star' },
  acknowledged: { label: 'Acknowledged',  cls: 'bg-purple-100 text-purple-700', icon: 'star' },
  insufficient: { label: 'Insufficient',  cls: 'bg-amber-100 text-amber-700',   icon: 'star' },
  fixed:       { label: 'Fixed',        cls: 'bg-slate-200 text-slate-700',   icon: 'star' },
  upheld:       { label: 'Upheld',        cls: 'bg-red-100 text-red-700',       icon: 'star' },
  appealed:     { label: 'Appealed',      cls: 'bg-blue-100 text-blue-700',     icon: 'star' },
  dismissed:    { label: 'Dismissed',     cls: 'bg-green-100 text-green-700',   icon: 'star' },
  voided:                  { label: 'Voided',        cls: 'bg-gray-100 text-gray-500',     icon: 'ban'  },
};

const SCALE_MARKS = [0, 60, 80, 95, 100];
const TABS = ['Dashboard', 'Satisfaction', 'Shipping', 'Compliance', 'Seller Reviews', 'Product Reviews', 'Seller Info'];
const PAGE_SIZE = 9;

// ── Helpers ───────────────────────────────────────────────────────────────────

function getFine(severity: string, status: ViolationStatus): number {
  if (['disputed', 'appealed', 'dismissed'].includes(status)) return 0;
  const base: Record<string, number> = { critical: 30000, high: 18000, medium: 15000, low: 0 };
  return base[severity] ?? 0;
}

function getBlackPoints(severity: string, status: ViolationStatus): number {
  // Black points apply once a violation is sanctioned and stay applied through the lifecycle.
  // They are only removed if the violation is voided (process error) or dismissed (cleared on merits).
  if (['voided', 'dismissed'].includes(status)) return 0;
  const base: Record<string, number> = { critical: -100, high: -80, medium: -20, low: -10 };
  return base[severity] ?? 0;
}

function computeScore(violations: Violation[]): number {
  const ms180 = 180 * 24 * 60 * 60 * 1000;
  const recent = violations.filter(v => Date.now() - v.createdAt.getTime() < ms180 && v.status !== 'voided');
  const active = recent.filter(v => v.status !== 'dismissed').length;
  return Math.max(5, 100 - active * 4);
}

// ── Component ─────────────────────────────────────────────────────────────────

const NewBadge = () => (
  <span className="ml-1.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-yellow-300 text-yellow-900 uppercase tracking-wide leading-none">
    New
  </span>
);

const SellerExperience: React.FC = () => {
  const [activeTab, setActiveTab]       = useState('Compliance');
  const [page, setPage]                 = useState(1);
  const [filterType, setFilterType]     = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [typeOpen, setTypeOpen]         = useState(false);
  const [statusOpen, setStatusOpen]     = useState(false);
  const [selected, setSelected]         = useState<Violation | null>(null);
  const [showWhatsNew, setShowWhatsNew] = useState(false);

  const typeRef   = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const popupRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (typeRef.current   && !typeRef.current.contains(e.target as Node))   setTypeOpen(false);
      if (statusRef.current && !statusRef.current.contains(e.target as Node)) setStatusOpen(false);
      if (popupRef.current  && !popupRef.current.contains(e.target as Node))  setShowWhatsNew(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const all = useMemo(() =>
    mockViolations
      .filter(v => v.status !== 'voided')
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()),
  []);

  const filtered = useMemo(() =>
    all
      .filter(v => !filterType   || (TYPE_FAMILY[v.type] ?? v.type) === filterType)
      .filter(v => !filterStatus || v.status === filterStatus),
  [all, filterType, filterStatus]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged      = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const score         = useMemo(() => computeScore(mockViolations), []);
  const scoreLabel    = score >= 80 ? 'Good' : score >= 60 ? 'Fair' : score >= 40 ? 'Poor' : 'Critical';
  const scoreBarCls   = score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-yellow-500' : score >= 40 ? 'bg-orange-500' : 'bg-red-500';
  const scoreBadgeCls = score >= 80 ? 'bg-green-100 text-green-800' : score >= 60 ? 'bg-yellow-100 text-yellow-800' : score >= 40 ? 'bg-orange-100 text-orange-800' : 'bg-red-100 text-red-800';

  const allFamilies = useMemo(() => Array.from(new Set(all.map(v => TYPE_FAMILY[v.type] ?? v.type))), [all]);

  const handleTypeSelect   = (t: string) => { setFilterType(t);   setTypeOpen(false);   setPage(1); };
  const handleStatusSelect = (s: string) => { setFilterStatus(s); setStatusOpen(false); setPage(1); };

  return (
    <div className="min-h-full bg-white -m-8 rounded-2xl overflow-hidden">

      {/* ── What's New popup ──────────────────────────────────────────────── */}
      {showWhatsNew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div ref={popupRef} className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-yellow-500" />
                <h2 className="text-base font-bold text-gray-900">What's new in Seller Experience</h2>
              </div>
              <button onClick={() => setShowWhatsNew(false)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5 space-y-5">

              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-gray-700" />
                  <p className="text-sm font-semibold text-gray-900">Black Points column</p>
                  <NewBadge />
                </div>
                <p className="text-sm text-gray-500 pl-6">
                  The compliance table now shows a Black Points value for each violation.
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-gray-700" />
                  <p className="text-sm font-semibold text-gray-900">View More — violation detail</p>
                  <NewBadge />
                </div>
                <p className="text-sm text-gray-500 pl-6">
                  Clicking View More now opens a full detail panel showing the Risk Team's message, evidence, affected SKUs, and a response section.
                </p>
              </div>

              <div className="space-y-1.5">
                <p className="text-sm font-semibold text-gray-900">Structured responses (inside View More)</p>
                <p className="text-sm text-gray-500">
                  Responses are no longer open-ended. You choose one of two paths:
                </p>
                <div className="space-y-2 pl-1">
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-green-50 border border-green-200">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-green-800"><strong>Accept &amp; Fix</strong> — acknowledge the violation, confirm you took corrective actions, and attach supporting documents. Await risk team response.</p>
                  </div>
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                    <XCircle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-yellow-800"><strong>Dispute</strong> — challenge the violation with a written reason and supporting evidence. The Risk Team will review and respond.</p>
                  </div>
                </div>
                <p className="text-xs text-gray-400 pt-1">Both paths support text fields and file attachments. Once submitted, you cannot follow up until you receive a reply from the Risk Team.</p>
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-2">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-amber-500" />
                  <p className="text-sm font-semibold text-gray-700">Open questions</p>
                </div>
                <ul className="space-y-1.5 pl-6 list-disc text-sm text-gray-500">
                  <li>Do we allow sellers to appeal if their dispute is upheld (rejected)?</li>
                  <li>Are we comfortable blocking seller follow-up until the Risk Team responds first?</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Page header ───────────────────────────────────────────────────── */}
      <div className="px-8 pt-8 pb-0">
        <div className="flex items-center gap-3 mb-5">
          <h1 className="text-2xl font-bold text-gray-900">Account Health</h1>
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${scoreBadgeCls}`}>{scoreLabel}</span>
          <Info className="w-4 h-4 text-gray-400 cursor-pointer" />
          <button
            onClick={() => setShowWhatsNew(true)}
            className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-yellow-300 text-yellow-900 hover:bg-yellow-400 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" /> What's new
          </button>
        </div>

        {/* Tab bar */}
        <nav className="flex border-b border-gray-200 -mx-8 px-8 overflow-x-auto">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-shrink-0 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* ── Non-Compliance placeholder ────────────────────────────────────── */}
      {activeTab !== 'Compliance' && (
        <div className="px-8 py-20 text-center">
          <p className="text-gray-400 text-sm">This section is under development.</p>
        </div>
      )}

      {/* ── Compliance tab ────────────────────────────────────────────────── */}
      {activeTab === 'Compliance' && (
        <div className="px-8 py-6 space-y-5">

          {/* Policy Compliance score card */}
          <div className="border border-gray-200 rounded-xl p-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-blue-600 font-semibold text-sm">Policy Compliance</span>
                  <Info className="w-3.5 h-3.5 text-gray-400 cursor-pointer" />
                </div>
                <p className="text-xs text-gray-400 mt-0.5">Last 180 Days</p>
              </div>
              <span className="text-3xl font-bold text-gray-900">{score}</span>
            </div>

            {/* Score bar */}
            <div className="relative pb-6">
              <div className="relative h-2 bg-gray-100 rounded-full overflow-visible">
                <div
                  className={`absolute inset-y-0 left-0 rounded-l-full ${scoreBarCls}`}
                  style={{ width: `${score}%` }}
                />
                <div
                  className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full border-4 border-white shadow ${scoreBarCls}`}
                  style={{ left: `calc(${score}% - 10px)` }}
                />
              </div>
              <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
                {SCALE_MARKS.map(n => (
                  <span
                    key={n}
                    className="absolute text-xs text-gray-400"
                    style={{
                      left:      n === 100 ? 'auto'  : `${n}%`,
                      right:     n === 100 ? '0'     : 'auto',
                      transform: n > 0 && n < 100 ? 'translateX(-50%)' : undefined,
                    }}
                  >
                    {n}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-400 min-w-48 cursor-default select-none">
              <Calendar className="w-4 h-4 flex-shrink-0" />
              <span>Select date range</span>
            </div>

            <div className="relative" ref={typeRef}>
              <button
                onClick={() => { setTypeOpen(o => !o); setStatusOpen(false); }}
                className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors min-w-44"
              >
                <span className="flex-1 text-left truncate">{filterType || 'Violation Type'}</span>
                <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
              </button>
              {typeOpen && (
                <div className="absolute top-full mt-1 left-0 z-20 bg-white border border-gray-200 rounded-xl shadow-lg py-1 min-w-64">
                  <button onClick={() => handleTypeSelect('')} className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">All Types</button>
                  {allFamilies.map(f => (
                    <button key={f} onClick={() => handleTypeSelect(f)}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center justify-between gap-3"
                    >
                      <span>{f}</span>
                      {filterType === f && <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="relative" ref={statusRef}>
              <button
                onClick={() => { setStatusOpen(o => !o); setTypeOpen(false); }}
                className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors min-w-32"
              >
                <span className="flex-1 text-left">{filterStatus ? (STATUS_PILL[filterStatus as ViolationStatus]?.label ?? filterStatus) : 'Status'}</span>
                <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
              </button>
              {statusOpen && (
                <div className="absolute top-full mt-1 left-0 z-20 bg-white border border-gray-200 rounded-xl shadow-lg py-1 min-w-44">
                  {(['', 'sanctioned', 'disputed', 'acknowledged', 'insufficient', 'closed', 'upheld', 'appealed', 'dismissed'] as const).map(s => (
                    <button key={s} onClick={() => handleStatusSelect(s)}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center justify-between gap-3"
                    >
                      <span>{s === '' ? 'All Statuses' : (STATUS_PILL[s as ViolationStatus]?.label ?? s)}</span>
                      {filterStatus === s && s !== '' && <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 whitespace-nowrap">Ticket No.</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 whitespace-nowrap">Violation Type</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 whitespace-nowrap">Violation Code</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 whitespace-nowrap">Violation Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 whitespace-nowrap">Fine</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 whitespace-nowrap">
                      <span className="flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5 text-gray-400" /> Black Points
                        <NewBadge />
                      </span>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 whitespace-nowrap">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {paged.map(v => {
                    const cfg = STATUS_PILL[v.status];
                    const fine = getFine(v.severity, v.status);
                    const bp   = getBlackPoints(v.severity, v.status);
                    const ticketNum = 100 + mockViolations.findIndex(mv => mv.id === v.id);
                    return (
                      <tr key={v.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{ticketNum}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{TYPE_FAMILY[v.type] ?? v.type}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{TYPE_CODE[v.type] ?? v.type}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{v.createdAt.toISOString().slice(0, 10)}</td>
                        <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">AED {fine.toLocaleString()}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{bp}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.cls}`}>
                            {cfg.icon === 'star'
                              ? <Star className="w-3 h-3" fill="currentColor" />
                              : <Ban className="w-3 h-3" />}
                            {cfg.label}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => setSelected(v)}
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                            >
                              View More
                            </button>
                            <NewBadge />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {paged.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-4 py-12 text-center text-sm text-gray-400">
                        No violations match your filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between bg-white">
              <p className="text-sm text-gray-500">
                Showing{' '}
                {filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1} to{' '}
                {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} entries
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-40 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" /> Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                      page === p ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-40 transition-colors"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* Modal */}
      {selected && <SellerViolationModal violation={selected} onClose={() => setSelected(null)} />}
    </div>
  );
};

export default SellerExperience;
