import React, { useState, useMemo } from 'react';
import {
  AlertTriangle, Clock, CheckCircle, FileText, Eye,
  MessageSquare, ShieldAlert, ChevronDown, ChevronUp,
  User, Scale,
} from 'lucide-react';
import { mockViolations, mockDisputes, mockAcknowledgments, mockSellers } from '../mockData';
import { Violation, ViolationStatus } from '../types';
import ViolationDetailModal from './ViolationDetailModal';

// ── Simulated logged-in analyst ───────────────────────────────────────────────
const ME = 'Sarah Johnson';
const WINDOW_DAYS = 180;

// ── Status config ─────────────────────────────────────────────────────────────
const STATUS_PILL: Record<ViolationStatus, { label: string; cls: string }> = {
  sanctioned:              { label: 'Sanctioned',   cls: 'bg-orange-100 text-orange-700' },
  disputed:                { label: 'Disputed',     cls: 'bg-yellow-100 text-yellow-700' },
  sanctioned_acknowledged: { label: 'Acknowledged', cls: 'bg-purple-100 text-purple-700' },
  upheld:                  { label: 'Upheld',       cls: 'bg-red-100 text-red-700'       },
  appealed:                { label: 'Appealed',     cls: 'bg-blue-100 text-blue-700'     },
  dismissed:               { label: 'Dismissed',    cls: 'bg-green-100 text-green-700'   },
  voided:                  { label: 'Voided',       cls: 'bg-gray-100 text-gray-500'     },
};

const SEV_PILL: Record<string, string> = {
  critical: 'bg-red-100 text-red-700',
  high:     'bg-orange-100 text-orange-700',
  medium:   'bg-yellow-100 text-yellow-700',
  low:      'bg-green-100 text-green-700',
};

// Bucket definitions
const NEEDS_ACTION: ViolationStatus[]  = ['disputed', 'sanctioned_acknowledged', 'appealed'];
const AWAITING_SELLER: ViolationStatus[] = ['sanctioned'];
const CLOSED: ViolationStatus[]        = ['upheld', 'dismissed', 'voided'];

function daysOld(d: Date): string {
  const n = Math.floor((Date.now() - d.getTime()) / 86400000);
  if (n === 0) return 'today';
  if (n === 1) return '1d ago';
  return `${n}d ago`;
}

// ── Violation row ─────────────────────────────────────────────────────────────
interface RowProps { v: Violation; onOpen: (v: Violation) => void; showAssignee?: boolean; }

const ViolationRow: React.FC<RowProps> = ({ v, onOpen, showAssignee }) => {
  const seller  = mockSellers[v.sellerId];
  const dispute = mockDisputes.find(d => d.violationId === v.id);
  const ack     = mockAcknowledgments.find(a => a.violationId === v.id);
  const { label, cls } = STATUS_PILL[v.status];

  const responseTag =
    v.status === 'disputed'
      ? { text: 'Seller Disputed',      cls: 'bg-yellow-100 text-yellow-700', Icon: MessageSquare }
      : v.status === 'sanctioned_acknowledged'
      ? { text: 'Seller Acknowledged',  cls: 'bg-purple-100 text-purple-700', Icon: CheckCircle   }
      : v.status === 'appealed'
      ? { text: 'Awaiting Final Decision', cls: 'bg-blue-100 text-blue-700',  Icon: Scale         }
      : null;

  const isActionable = NEEDS_ACTION.includes(v.status);

  return (
    <div className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50/80 transition-colors">
      {/* Left: icon + info */}
      <div className="flex items-start gap-3 flex-1 min-w-0">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
          isActionable ? 'bg-amber-50' : AWAITING_SELLER.includes(v.status) ? 'bg-orange-50' : 'bg-gray-50'
        }`}>
          <ShieldAlert className={`w-4 h-4 ${
            isActionable ? 'text-amber-500' : AWAITING_SELLER.includes(v.status) ? 'text-orange-400' : 'text-gray-400'
          }`} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-sm font-semibold text-gray-800">{v.id}</span>
            <span className={`px-1.5 py-0.5 rounded-full text-xs font-semibold ${SEV_PILL[v.severity]}`}>{v.severity}</span>
            <span className={`px-1.5 py-0.5 rounded-full text-xs font-semibold ${cls}`}>{label}</span>
            {responseTag && (
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${responseTag.cls}`}>
                <responseTag.Icon className="w-3 h-3" />{responseTag.text}
              </span>
            )}
          </div>

          <p className="text-xs text-gray-500 mt-0.5 truncate">
            {v.type} · {seller?.name ?? v.sellerId}
            {showAssignee && v.assignedTo && <span className="text-gray-400"> · {v.assignedTo}</span>}
          </p>

          {(dispute || ack) && (
            <p className="text-xs text-gray-400 mt-0.5 truncate max-w-xl italic">
              {dispute
                ? `"${dispute.reason.slice(0, 90)}…"`
                : ack
                ? `"${ack.poaFollowed.slice(0, 90)}…"`
                : null}
            </p>
          )}
        </div>
      </div>

      {/* Right: age + action */}
      <div className="flex items-center gap-3 flex-shrink-0 ml-4">
        <span className="text-xs text-gray-400 whitespace-nowrap">{daysOld(v.createdAt)}</span>
        <button
          onClick={() => onOpen(v)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap ${
            isActionable
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'border border-gray-200 text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          {isActionable ? 'Review & Respond' : 'View'}
        </button>
      </div>
    </div>
  );
};

// ── Collapsible section ───────────────────────────────────────────────────────
interface SectionProps {
  title: string;
  subtitle: string;
  count: number;
  borderCls: string;
  iconBg: string;
  icon: React.ReactNode;
  urgent?: boolean;
  violations: Violation[];
  onOpen: (v: Violation) => void;
  defaultOpen?: boolean;
  showAssignee?: boolean;
}

const WorkSection: React.FC<SectionProps> = ({
  title, subtitle, count, borderCls, iconBg, icon, urgent,
  violations, onOpen, defaultOpen = true, showAssignee,
}) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={`bg-white rounded-2xl border overflow-hidden ${borderCls}`}>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
            {icon}
          </div>
          <div className="text-left">
            <p className="text-sm font-bold text-gray-900">{title}</p>
            <p className="text-xs text-gray-500">{subtitle}</p>
          </div>
          <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-bold ${
            urgent && count > 0 ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'
          }`}>
            {count}
          </span>
        </div>
        {open
          ? <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" />
          : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />}
      </button>

      {open && (
        <div className="border-t border-gray-100 divide-y divide-gray-100">
          {violations.length === 0
            ? <p className="px-5 py-6 text-sm text-gray-400 text-center">Nothing here.</p>
            : violations.map(v => (
                <ViolationRow key={v.id} v={v} onOpen={onOpen} showAssignee={showAssignee} />
              ))
          }
        </div>
      )}
    </div>
  );
};

// ── Main component ────────────────────────────────────────────────────────────
const MyWork: React.FC = () => {
  const [selected, setSelected] = useState<Violation | null>(null);
  const [isOpen, setIsOpen]     = useState(false);
  const [viewAll, setViewAll]   = useState(false);

  const open  = (v: Violation) => { setSelected(v); setIsOpen(true); };
  const close = () => { setIsOpen(false); setSelected(null); };

  // 180-day window
  const cutoff = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - WINDOW_DAYS);
    return d;
  }, []);

  const all180 = useMemo(() =>
    mockViolations
      .filter(v => v.createdAt >= cutoff)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()),
  [cutoff]);

  const mine180 = useMemo(() => all180.filter(v => v.assignedTo === ME), [all180]);

  const source = viewAll ? all180 : mine180;

  const needsAction    = useMemo(() => source.filter(v => NEEDS_ACTION.includes(v.status)),    [source]);
  const awaitingSeller = useMemo(() => source.filter(v => AWAITING_SELLER.includes(v.status)), [source]);
  const closed         = useMemo(() => source.filter(v => CLOSED.includes(v.status)),          [source]);

  const stats = useMemo(() => ({
    total:    mine180.length,
    needsMe:  mine180.filter(v => NEEDS_ACTION.includes(v.status)).length,
    waiting:  mine180.filter(v => AWAITING_SELLER.includes(v.status)).length,
    closed:   mine180.filter(v => CLOSED.includes(v.status)).length,
  }), [mine180]);

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-bold text-gray-900">My Work</h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700">
              <User className="w-3 h-3" /> {ME}
            </span>
            <span className="text-xs text-gray-400 font-medium">· Past {WINDOW_DAYS} days</span>
          </div>
          <p className="text-sm text-gray-500 mt-0.5">
            {viewAll
              ? `All violations raised in the past ${WINDOW_DAYS} days across all analysts`
              : `Violations assigned to you in the past ${WINDOW_DAYS} days`}
          </p>
        </div>
        <button
          onClick={() => setViewAll(v => !v)}
          className="px-4 py-2 rounded-xl text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
        >
          {viewAll ? 'Show My Work' : 'Show All Work'}
        </button>
      </div>

      {/* Stats bar — my work only */}
      {!viewAll && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {([
            { label: 'Assigned to me',  value: stats.total,   Icon: FileText,       cls: 'text-gray-700',   bg: 'bg-gray-50   border-gray-200'  },
            { label: 'Needs my action', value: stats.needsMe, Icon: AlertTriangle,  cls: 'text-red-600',    bg: 'bg-red-50    border-red-200'    },
            { label: 'Awaiting seller', value: stats.waiting, Icon: Clock,          cls: 'text-orange-600', bg: 'bg-orange-50 border-orange-200' },
            { label: 'Closed',          value: stats.closed,  Icon: CheckCircle,    cls: 'text-green-600',  bg: 'bg-green-50  border-green-200'  },
          ] as const).map(({ label, value, Icon, cls, bg }) => (
            <div key={label} className={`flex items-center gap-3 rounded-xl border p-4 ${bg}`}>
              <Icon className={`w-5 h-5 flex-shrink-0 ${cls}`} />
              <div>
                <p className={`text-xl font-bold leading-none ${cls}`}>{value}</p>
                <p className="text-xs text-gray-500 mt-1">{label}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Triage sections */}
      <WorkSection
        title="Needs My Action"
        subtitle="Seller has responded — review their dispute or acknowledgment and decide"
        count={needsAction.length}
        borderCls="border-amber-200"
        iconBg="bg-amber-100"
        icon={<AlertTriangle className="w-4 h-4 text-amber-600" />}
        urgent
        violations={needsAction}
        onOpen={open}
        defaultOpen={true}
        showAssignee={viewAll}
      />

      <WorkSection
        title="Awaiting Seller Response"
        subtitle="Violation has been sanctioned — no reply received yet"
        count={awaitingSeller.length}
        borderCls="border-orange-200"
        iconBg="bg-orange-100"
        icon={<Clock className="w-4 h-4 text-orange-500" />}
        violations={awaitingSeller}
        onOpen={open}
        defaultOpen={true}
        showAssignee={viewAll}
      />

      <WorkSection
        title="Closed"
        subtitle="Upheld, dismissed, or voided — no further action needed"
        count={closed.length}
        borderCls="border-gray-200"
        iconBg="bg-gray-100"
        icon={<CheckCircle className="w-4 h-4 text-gray-500" />}
        violations={closed}
        onOpen={open}
        defaultOpen={false}
        showAssignee={viewAll}
      />

      {/* Modal */}
      <ViolationDetailModal
        violation={selected}
        isOpen={isOpen}
        onClose={close}
        mode="ops"
      />
    </div>
  );
};

export default MyWork;
