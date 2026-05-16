import React, { useState, useMemo } from 'react';
import {
  Search,
  ChevronLeft, ChevronRight,
} from 'lucide-react';
import { mockViolations, mockDisputes, mockAcknowledgments, mockSellers } from '../mockData';
import { Violation, ViolationStatus } from '../types';
import ViolationDetailModal from './ViolationDetailModal';

// ── Simulated logged-in analyst ─────────────────────────────────
const ME = 'Sarah Johnson';
const WINDOW_DAYS = 180;
const PAGE_SIZE = 8;

// ── Status config ────────────────────────────────────────────
const STATUS_PILL: Record<ViolationStatus, { label: string; cls: string }> = {
  sanctioned:   { label: 'Sanctioned',   cls: 'bg-orange-100 text-orange-700' },
  disputed:     { label: 'Disputed',     cls: 'bg-blue-100 text-blue-700'     },
  acknowledged: { label: 'Acknowledged', cls: 'bg-purple-100 text-purple-700' },
  insufficient: { label: 'Insufficient', cls: 'bg-amber-100 text-amber-700'   },
  fixed:       { label: 'Fixed',       cls: 'bg-slate-200 text-slate-700'   },
  upheld:       { label: 'Upheld',       cls: 'bg-red-100 text-red-700'       },
  appealed:     { label: 'Appealed',     cls: 'bg-indigo-100 text-indigo-700' },
  dismissed:    { label: 'Dismissed',    cls: 'bg-green-100 text-green-700'   },
  voided:       { label: 'Voided',       cls: 'bg-gray-100 text-gray-500'     },
};

// Bucket definitions
const NEEDS_ACTION: ViolationStatus[]    = ['disputed', 'acknowledged', 'appealed'];
const AWAITING_SELLER: ViolationStatus[] = ['sanctioned', 'insufficient'];
const CLOSED: ViolationStatus[]          = ['fixed', 'upheld', 'dismissed', 'voided'];

type TabKey = 'needs' | 'awaiting' | 'closed';

// ── Helpers ───────────────────────────────────────────────────────────────
function getMessageFromSeller(v: Violation): string {
  const dispute = mockDisputes.find(d => d.violationId === v.id);
  if (dispute) return dispute.reason;
  const ack = mockAcknowledgments.find(a => a.violationId === v.id);
  if (ack) return ack.poaFollowed;
  if (v.status === 'sanctioned')   return 'Awaiting seller response — no message yet.';
  if (v.status === 'insufficient') return 'Awaiting seller resubmission with additional information.';
  return '—';
}


// ── Main component ───────────────────────────────────────────────────────
const MyWork: React.FC = () => {
  const [selected, setSelected] = useState<Violation | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>('needs');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const openRow  = (v: Violation) => { setSelected(v); setIsModalOpen(true); };
  const closeRow = () => { setIsModalOpen(false); setSelected(null); };

  // 180-day window
  const cutoff = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - WINDOW_DAYS);
    return d;
  }, []);

  const mine180 = useMemo(() =>
    mockViolations
      .filter(v => v.createdAt >= cutoff && v.assignedTo === ME)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()),
  [cutoff]);

  const needsAction    = useMemo(() => mine180.filter(v => NEEDS_ACTION.includes(v.status)),    [mine180]);
  const awaitingSeller = useMemo(() => mine180.filter(v => AWAITING_SELLER.includes(v.status)), [mine180]);
  const closedRows     = useMemo(() => mine180.filter(v => CLOSED.includes(v.status)),          [mine180]);

  const tabConfig: Record<TabKey, { label: string; count: number; rows: Violation[] }> = {
    needs:    { label: 'Needs My Action',         count: needsAction.length,    rows: needsAction },
    awaiting: { label: 'Awaiting Seller Response', count: awaitingSeller.length, rows: awaitingSeller },
    closed:   { label: 'Closed',                   count: closedRows.length,     rows: closedRows },
  };

  // Filter active tab rows by search (matches violation id or seller name)
  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    const rows = tabConfig[activeTab].rows;
    if (!q) return rows;
    return rows.filter(v => {
      const seller = mockSellers[v.sellerId];
      return v.id.toLowerCase().includes(q) || (seller?.name.toLowerCase().includes(q) ?? false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, activeTab, mine180]);

  // Pagination
  const pageCount = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE));
  const safePage  = Math.min(page, pageCount);
  const pageRows  = filteredRows.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  // Reset page on tab/search change
  React.useEffect(() => { setPage(1); }, [activeTab, search]);

  const tabs: TabKey[] = ['needs', 'awaiting', 'closed'];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Assigned to Me</h1>
      </div>

      {/* KPI cards
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Assigned to Me"   value={stats.total}   Icon={ClipboardList} />
        <KpiCard label="Needs my Action"  value={stats.needsMe} Icon={Flag} />
        <KpiCard label="Awaiting Seller"  value={stats.waiting} Icon={Clock} />
        <KpiCard label="Closed"           value={stats.closed}  Icon={CheckCircle2} />
      </div> */}

      {/* Table card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Tabs */}
        <div className="px-5 pt-4 border-b border-gray-100">
          <div className="flex items-center gap-6">
            {tabs.map(key => {
              const t = tabConfig[key];
              const active = activeTab === key;
              return (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`flex items-center gap-2 pb-3 -mb-px border-b-2 text-sm font-semibold transition-colors ${
                    active
                      ? 'border-blue-600 text-blue-700'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {t.label}
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                    active ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {t.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Search */}
        <div className="px-5 py-4">
          <div className="relative max-w-xs">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search Violation Number.."
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/60">
              <tr className="text-left text-xs font-semibold text-gray-500">
                <th className="px-5 py-3">Partner Name</th>
                <th className="px-5 py-3">Violation Number</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Message from Seller</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {pageRows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-sm text-gray-400">
                    Nothing in this bucket.
                  </td>
                </tr>
              ) : pageRows.map(v => {
                const seller = mockSellers[v.sellerId];
                const { label, cls } = STATUS_PILL[v.status];
                const message = getMessageFromSeller(v);
                const actionable = NEEDS_ACTION.includes(v.status);
                return (
                  <tr key={v.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-5 py-4 align-top text-sm font-medium text-gray-900 whitespace-nowrap">
                      {seller?.name ?? v.sellerId}
                    </td>
                    <td className="px-5 py-4 align-top text-sm text-gray-700 whitespace-nowrap">
                      {v.id}
                    </td>
                    <td className="px-5 py-4 align-top whitespace-nowrap">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${cls}`}>
                        {label}
                      </span>
                    </td>
                    <td className="px-5 py-4 align-top text-sm text-gray-600 max-w-xl">
                      <p className="line-clamp-3">{message}</p>
                    </td>
                    <td className="px-5 py-4 align-top text-right whitespace-nowrap">
                      <button
                        onClick={() => openRow(v)}
                        className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        {actionable ? 'Respond' : 'View'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredRows.length > 0 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              Showing {(safePage - 1) * PAGE_SIZE + 1} to {Math.min(safePage * PAGE_SIZE, filteredRows.length)} of {filteredRows.length} entries
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={safePage === 1}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: pageCount }, (_, i) => i + 1).slice(0, 5).map(n => (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-semibold transition-colors ${
                    n === safePage
                      ? 'bg-blue-600 text-white'
                      : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {n}
                </button>
              ))}
              <button
                onClick={() => setPage(p => Math.min(pageCount, p + 1))}
                disabled={safePage === pageCount}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      <ViolationDetailModal
        violation={selected}
        isOpen={isModalOpen}
        onClose={closeRow}
        mode="ops"
      />
    </div>
  );
};

export default MyWork;
