import React, { useState, createContext } from 'react';
import { 
  LayoutDashboard,
  FileText,
  AlertTriangle,
  MessageSquare,
  List,
  X,
  Sparkles,
  Briefcase,
  ShoppingBag,
  BookOpen,
  Shield,
  ScrollText,
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import ViolationLedger from './components/ViolationLedger';
import TemplatesManagement from './components/TemplatesManagement';
import SellerExperience from './components/SellerExperience';
import MyWork from './components/MyWork';
import MasterLists from './components/MasterLists';

// Admin role context — admin-only actions (Appeal, Void, decisions on Appealed) are gated by this flag
export const AdminContext = createContext<boolean>(false);

type TabItem = {
  id: string;
  label: string;
  icon: React.ElementType;
  component: React.ComponentType;
};

const tabItems: TabItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    component: Dashboard
  },
  {
    id: 'assigned-to-me',
    label: 'Assigned to Me',
    icon: Briefcase,
    component: MyWork
  },
  {
    id: 'violation-ledger',
    label: 'Violation Ledger',
    icon: FileText,
    component: ViolationLedger
  },
  {
    id: 'master-lists',
    label: 'Master Lists',
    icon: List,
    component: MasterLists
  },
  {
    id: 'templates',
    label: 'Templates',
    icon: MessageSquare,
    component: TemplatesManagement
  },
];

// ── What's New entries for internal risk team ────────────────────────────────
const CHANGELOG: { tag: string; tagColor: string; title: string; detail: string[] }[] = [
  {
    tag: 'Overview',
    tagColor: 'bg-gray-100 text-gray-700',
    title: 'STP Violation Ledger',
    detail: [
      'A centralised tool for the Risk Team to create, track, and action seller violations — from first sanction through seller response, dispute resolution, and final verdict.',
      'Use "Seller View" (top right) to preview exactly what sellers see.',
    ],
  },
  {
    tag: 'Dashboard',
    tagColor: 'bg-blue-100 text-blue-700',
    title: 'Dashboard',
    detail: [
      'High-level overview of violation activity: total violations by status, recent activity feed, and key metrics at a glance.',
      'Use this as your daily starting point to see what needs attention.',
    ],
  },
  {
    tag: 'Assigned to Me',
    tagColor: 'bg-purple-100 text-purple-700',
    title: 'Assigned to Me',
    detail: [
      'An analyst\'s personal queue — violations assigned to user and disputes awaiting their review.',
      'Keeps your workload focused without needing to filter the full ledger.',
    ],
  },
  {
    tag: 'Violation Ledger',
    tagColor: 'bg-orange-100 text-orange-700',
    title: 'Violation Ledger',
    detail: [
      'The full record of all violations across all sellers.',
      'Filter by type, status, seller, or date.',
      'Click any row to open the detail modal where you can view the seller\'s response and take action (Uphold, Dismiss, Void).',
    ],
  },
  {
    tag: 'Violation Ledger',
    tagColor: 'bg-orange-100 text-orange-700',
    title: 'Violation creation wizard',
    detail: [
      'Click "+ New Violation" inside the Violation Ledger to open the 3-step wizard.',
      'Step 1: partner details, violation code, date, and risk metadata.',
      'Step 2: dynamic fields specific to the selected violation code, plus a CTA checklist.',
      'Step 3: choose a message template and finalise the seller-facing message.',
      'Important note is how we make user enter minimal data about the seller and we fetch the rest of the information for him.',
    ],
  },
  {
    tag: 'Master Lists',
    tagColor: 'bg-teal-100 text-teal-700',
    title: 'Master Lists',
    detail: [
      'Reference tables to deprecate ref master usage for violation types, codes, and their associated black point values and fines.',
      'Hidden behind admin access.',
    ],
  },
  {
    tag: 'Templates',
    tagColor: 'bg-indigo-100 text-indigo-700',
    title: 'Templates',
    detail: [
      'Manage the message templates used in Step 3 of the violation wizard.',
      'Each template maps to a violation. A violation can have multiple templates mapped to it.',
      'Templates will include placeholders that get filled automatically with fields entered within the wizard.',
    ],
  },
  {
    tag: 'Bulk Uploads',
    tagColor: 'bg-rose-100 text-rose-700',
    title: 'Bulk Uploads',
    detail: [
      'Upload multiple violations at once via a structured CSV or Excel file.',
      'Each row maps to a single violation — required fields match those in the creation wizard.',
      'Uploaded violations are queued for review before being sanctioned, allowing analysts to catch errors before they reach sellers.',
    ],
  },
  {
    tag: 'Admin Role',
    tagColor: 'bg-purple-100 text-purple-700',
    title: 'Admin role — gated actions for senior risk users',
    detail: [
      'Toggle the Admin On/Off pill in the top-right header to switch between analyst and admin views. The flag is for prototyping only — in production this will be driven by the user\'s role.',
      'Admins are the only ones who can Void a violation from any state. Voiding hides the record from the seller and removes black points (used for process or claim errors).',
      'Admins are the only ones who can Appeal an upheld violation, escalating it for a second and final review.',
      'Once a violation is in the Appealed state, only admins can take the final Uphold or Dismiss decision. Analysts in this state see a notice prompting them to switch on Admin mode.',
      'All other actions (Uphold, Dismiss, Accept Fix, Mark Insufficient) remain available to regular analysts.',
    ],
  },
  {
    tag: 'Open question',
    tagColor: 'bg-amber-100 text-amber-800',
    title: 'Echo integration — how do we integrate with Echo on this?',
    detail: [
      'How will messages between the Risk Team and sellers be stored and synced — do they live in this system or are they pushed to / pulled from Echo?',
      'How will we manage storing attachments submitted by sellers (evidence files, corrective action docs)? Are we storing them ourselves or delegating to Echo?',
    ],
  },
];

const CORRECT_PASSWORD = 'iknowomarkamal';

function PasswordGate({ onUnlock }: { onUnlock: () => void }) {
  const [input, setInput] = useState('');
  const [wrong, setWrong] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input === CORRECT_PASSWORD) {
      onUnlock();
    } else {
      setWrong(true);
      setInput('');
    }
  };

  if (wrong) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-red-500 text-5xl font-black tracking-widest select-none">STRANGER DANGER</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl p-10 w-full max-w-sm flex flex-col items-center space-y-6">
        <div className="flex items-center justify-center w-14 h-14 bg-blue-600 rounded-xl">
          <AlertTriangle className="w-8 h-8 text-white" />
        </div>
        <div className="text-center">
          <h1 className="text-xl font-bold text-gray-900">STP Violation Ledger</h1>
          <p className="text-sm text-gray-500 mt-1">Enter password to continue</p>
        </div>
        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <input
            type="password"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            autoFocus
            placeholder="Password"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center tracking-widest"
          />
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Enter
          </button>
        </form>
      </div>
    </div>
  );
}

function App() {
  const [unlocked, setUnlocked] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [navigationState, setNavigationState] = useState<any>({});
  const [showChangelog, setShowChangelog] = useState(false);
  const [sellerMode, setSellerMode] = useState(false);
  const [showBrd, setShowBrd] = useState(false);
  const [showPrd, setShowPrd] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const handleUnlock = () => { setUnlocked(true); setShowBrd(true); };

  const ActiveComponent = tabItems.find(item => item.id === activeTab)?.component || Dashboard;

  const handleNavigate = (tab: string, state?: any) => {
    setActiveTab(tab);
    if (state) {
      setNavigationState(state);
    }
  };

  if (!unlocked) {
    return <PasswordGate onUnlock={handleUnlock} />;
  }

  return (
    <AdminContext.Provider value={isAdmin}>
    <div className="min-h-screen bg-gray-50">
      {/* PRD modal */}
      {showPrd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setShowPrd(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>

            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <ScrollText className="w-4 h-4 text-blue-600" />
                <div>
                  <h2 className="text-base font-bold text-gray-900">Product Requirements Document</h2>
                  <p className="text-xs text-gray-400">STP Violation Ledger · Seller Trust &amp; Policy · v1.0 · Draft</p>
                </div>
              </div>
              <button onClick={() => setShowPrd(false)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 px-8 py-6 space-y-10 text-sm text-gray-700">

              {/* 1. Background */}
              <section className="space-y-3">
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide pb-1.5 border-b border-gray-100">1. Background &amp; Problem Statement</h2>
                <p className="font-semibold text-gray-800">Current State</p>
                <p>Handling a seller violation today requires jumping between two disconnected systems: <span className="font-medium text-gray-900">Ref Master</span> (violation data, black points, fines) and <span className="font-medium text-gray-900">Zoho</span> (communication with sellers).</p>
                <ul className="list-disc pl-5 space-y-1 text-gray-600">
                  <li><span className="font-medium text-gray-800">No single state of truth.</span> Status updates are free-form — any two analysts can interpret the same case differently.</li>
                  <li><span className="font-medium text-gray-800">Manual overhead.</span> Creating a violation means entering data twice. Acting on a seller response means switching contexts mid-task.</li>
                  <li><span className="font-medium text-gray-800">Seller opacity.</span> Sellers receive insufficient information about what went wrong and what they can do about it.</li>
                </ul>
                <p className="font-semibold text-gray-800 pt-1">Target State</p>
                <p>A centralised internal tool — the <span className="font-semibold">STP Violation Ledger</span> — that replaces Ref Master and Zoho, enforces a deterministic state machine on every violation, gives sellers structured response paths, and serves as the foundation for an account health and enforcement model.</p>
              </section>

              {/* 2. Violation Lifecycle */}
              <section className="space-y-4">
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide pb-1.5 border-b border-gray-100">2. Violation Lifecycle — State Machine</h2>

                <p className="font-semibold text-gray-800">2.1 States</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="text-left px-3 py-2 border border-gray-200 font-semibold text-gray-700 w-32">State</th>
                        <th className="text-left px-3 py-2 border border-gray-200 font-semibold text-gray-700 w-28">Set by</th>
                        <th className="text-left px-3 py-2 border border-gray-200 font-semibold text-gray-700">Meaning</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { state: 'sanctioned',   by: 'Analyst',        cls: 'bg-orange-100 text-orange-700', meaning: 'Raised by the Risk Team. Seller is liable; penalties apply. Awaiting seller response.' },
                        { state: 'disputed',     by: 'Seller',         cls: 'bg-yellow-100 text-yellow-700', meaning: 'Seller submitted a dispute. Risk Team investigating.' },
                        { state: 'acknowledged', by: 'Seller',         cls: 'bg-purple-100 text-purple-700', meaning: 'Seller accepted and submitted corrective action evidence. Analyst reviewing.' },
                        { state: 'insufficient', by: 'Analyst',        cls: 'bg-amber-100 text-amber-700',   meaning: 'Fix evidence is inadequate. Seller must resubmit.' },
                        { state: 'fixed',        by: 'Analyst',        cls: 'bg-slate-200 text-slate-700',   meaning: 'Fix accepted. Violation stands; black points apply. No further enforcement.' },
                        { state: 'upheld',       by: 'Analyst',        cls: 'bg-red-100 text-red-700',       meaning: 'Dispute rejected. Seller liable. Only admin can move to appealed.' },
                        { state: 'appealed',     by: 'Admin',          cls: 'bg-blue-100 text-blue-700',     meaning: 'Escalated for second and final review. Admin-only decisions.' },
                        { state: 'dismissed',    by: 'Analyst / Admin',cls: 'bg-green-100 text-green-700',   meaning: 'Dispute accepted on merits. Seller cleared. No penalties. Terminal.' },
                        { state: 'voided',       by: 'Admin only',     cls: 'bg-gray-100 text-gray-500',     meaning: 'Process or claim error. Hidden from seller. Kept for audit. Terminal.' },
                      ].map(r => (
                        <tr key={r.state} className="hover:bg-gray-50">
                          <td className="px-3 py-2 border border-gray-200"><span className={`px-1.5 py-0.5 rounded-full text-xs font-semibold ${r.cls}`}>{r.state}</span></td>
                          <td className="px-3 py-2 border border-gray-200 text-gray-600">{r.by}</td>
                          <td className="px-3 py-2 border border-gray-200 text-gray-600">{r.meaning}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <p className="font-semibold text-gray-800 pt-1">2.2 Transition Map</p>
                <div className="bg-gray-50 rounded-xl p-4 font-mono text-xs text-gray-600 leading-relaxed whitespace-pre">{`sanctioned
  ├── seller disputes      →  disputed
  └── seller accepts       →  acknowledged

disputed
  ├── analyst upholds      →  upheld
  ├── analyst dismisses    →  dismissed
  └── analyst requests     →  insufficient dispute

acknowledged
  ├── analyst accepts      →  fixed
  └── analyst requests     →  insufficient fix

insufficient fix
  └── seller resubmits     →  acknowledged

insufficient dispute
  └── seller resubmits     →  disputed

upheld   └── admin appeals       →  appealed
appealed ├── admin upholds       →  upheld
         └── admin dismisses     →  dismissed

any state
  └── admin voids          →  voided`}</div>

                <p className="font-semibold text-gray-800 pt-1">2.3 Penalty Rules</p>
                <ul className="list-disc pl-5 space-y-1 text-gray-600">
                  <li>Black points are assigned at <span className="font-mono bg-gray-100 px-1 rounded">sanctioned</span> and persist through the lifecycle.</li>
                  <li>Black points are removed only on <span className="font-mono bg-gray-100 px-1 rounded">voided</span> (process error) or <span className="font-mono bg-gray-100 px-1 rounded">dismissed</span> (cleared on merits).</li>
                </ul>
              </section>

              {/* 3. Internal Tool */}
              <section className="space-y-5">
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide pb-1.5 border-b border-gray-100">3. Internal Tool — STP Violation Ledger</h2>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4 space-y-1.5">
                    <p className="font-semibold text-gray-800 text-xs">Analyst (default)</p>
                    <ul className="text-xs text-gray-600 space-y-0.5 list-disc pl-4">
                      <li>Create violations</li>
                      <li>View assigned queue</li>
                      <li>Action disputes (Uphold, Dismiss, Request More Info)</li>
                      <li>Action acknowledgments (Accept Fix, Mark Insufficient)</li>
                    </ul>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-4 space-y-1.5">
                    <p className="font-semibold text-purple-800 text-xs">Admin (elevated)</p>
                    <ul className="text-xs text-purple-700 space-y-0.5 list-disc pl-4">
                      <li>All analyst actions</li>
                      <li>Void any violation from any state</li>
                      <li>Escalate upheld → appealed</li>
                      <li>Final Uphold or Dismiss on appealed violations</li>
                    </ul>
                  </div>
                </div>

                {[
                  {
                    id: '3.2', title: 'Dashboard',
                    body: 'Entry point for daily operations. Shows total violations (all time), violations in the last 180 days, active violations, and violations awaiting analyst action. Two activity feeds: recent violations and recent disputes (latest 10 each). Every row opens the Violation Detail Modal.',
                  },
                  {
                    id: '3.3', title: 'Assigned to Me',
                    body: 'Personal analyst queue — violations assigned to the logged-in analyst created in the last 180 days. Three sub-tabs: Needs My Action (disputed, acknowledged), Awaiting Seller Response (sanctioned, insufficient), Closed (fixed, upheld, dismissed, voided). Searchable by seller ID, violation ID, or code name. Paginated (10 rows).',
                  },
                  {
                    id: '3.4', title: 'Violation Ledger',
                    body: 'Full record of all violations. Filterable by search (seller ID, ticket ID, violation code name), status, and active-violations-only toggle. Columns: Ticket No. · Partner · Violation Code Name · Violation Type · Date · Black Points · Status · Assigned To · Actions.',
                  },
                  {
                    id: '3.5', title: 'Master Lists',
                    body: 'Reference tables for violation codes, types, black point values, and fines. Replaces Ref Master for this data. Admin-only access.',
                  },
                  {
                    id: '3.6', title: 'Templates',
                    body: 'Manage message templates used in Step 3 of the wizard. Each template maps to a violation code. Placeholder system: each violation code maps to required placeholders (e.g. DELIVERY → {sellerId}, {scheduledDate}). Selecting a violation code auto-shows placeholder bubbles that insert at cursor on click. Operations: Create · Edit · Copy · Activate/Deactivate · Delete.',
                  },
                ].map(s => (
                  <div key={s.id} className="space-y-1">
                    <p className="font-semibold text-gray-800">{s.id} {s.title}</p>
                    <p className="text-gray-600 leading-relaxed">{s.body}</p>
                  </div>
                ))}

                <div className="space-y-2">
                  <p className="font-semibold text-gray-800">3.4.1 Violation Creation Wizard</p>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { step: 'Step 1', label: 'Core Details', desc: 'Partner ID, Country, Violation Code, Date, Request Source, Seller Rating, Overall Risk, ID Penalty, MP Code. Partner ID auto-fills seller metadata.' },
                      { step: 'Step 2', label: 'Violation-Specific Fields', desc: 'Dynamic fields per violation code from violationSchemas. Required fields block progression; Visible fields are optional. Configurable per code via the Settings matrix (H / V / R).' },
                      { step: 'Step 3', label: 'Message to Seller', desc: 'Select a template filtered by violation code. Placeholders are auto-populated from Step 1–2 values. Free-text override available. Submitting creates the violation in sanctioned state.' },
                    ].map(s => (
                      <div key={s.step} className="bg-blue-50 rounded-xl p-3 space-y-1">
                        <p className="text-xs font-bold text-blue-700">{s.step}</p>
                        <p className="text-xs font-semibold text-gray-800">{s.label}</p>
                        <p className="text-xs text-gray-600 leading-relaxed">{s.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="font-semibold text-gray-800">3.7 Violation Detail Modal (Ops Mode)</p>
                  <p className="text-gray-600">Left panel: message thread (chronological, tagged events), POA expandable section, evidence files. Right panel: action cards gated by status and role.</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs border-collapse">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="text-left px-3 py-2 border border-gray-200 font-semibold text-gray-700">Status</th>
                          <th className="text-left px-3 py-2 border border-gray-200 font-semibold text-gray-700">Available Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { status: 'sanctioned',   cls: 'bg-orange-100 text-orange-700', actions: 'Uphold · Void (admin)' },
                          { status: 'disputed',     cls: 'bg-yellow-100 text-yellow-700', actions: 'Dismiss · Request More Info · Uphold · Void (admin)' },
                          { status: 'acknowledged', cls: 'bg-purple-100 text-purple-700', actions: 'Accept Fix · Mark Insufficient · Void (admin)' },
                          { status: 'insufficient', cls: 'bg-amber-100 text-amber-700',   actions: 'Void (admin)' },
                          { status: 'upheld',       cls: 'bg-red-100 text-red-700',       actions: 'Appeal (admin) · Void (admin)' },
                          { status: 'appealed',     cls: 'bg-blue-100 text-blue-700',     actions: 'Uphold (admin) · Dismiss (admin) · Void (admin)' },
                          { status: 'fixed',        cls: 'bg-slate-200 text-slate-700',   actions: 'Void (admin)' },
                          { status: 'dismissed',    cls: 'bg-green-100 text-green-700',   actions: 'Void (admin)' },
                          { status: 'voided',       cls: 'bg-gray-100 text-gray-500',     actions: '—' },
                        ].map(r => (
                          <tr key={r.status} className="hover:bg-gray-50">
                            <td className="px-3 py-2 border border-gray-200"><span className={`px-1.5 py-0.5 rounded-full text-xs font-semibold ${r.cls}`}>{r.status}</span></td>
                            <td className="px-3 py-2 border border-gray-200 text-gray-600">{r.actions}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>

              {/* 4. Seller Experience */}
              <section className="space-y-4">
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide pb-1.5 border-b border-gray-100">4. Seller Experience</h2>
                <p>Accessed via the <span className="font-medium">Account Health</span> section of the Seller Portal (noon Partners), under the <span className="font-medium">Compliance</span> tab.</p>

                <div className="space-y-1">
                  <p className="font-semibold text-gray-800">4.2 Policy Compliance Score</p>
                  <p className="text-gray-600">Score 0–100 computed from active violations in the last 180 days. Tiers: Good (≥80) · Fair (≥60) · Poor (≥40) · Critical (&lt;40). Displayed as a horizontal progress bar at the top of the Compliance tab.</p>
                </div>

                <div className="space-y-1">
                  <p className="font-semibold text-gray-800">4.3 Violation Detail Modal (Seller Mode)</p>
                  <p className="text-gray-600">Two-panel modal opened from the compliance table.</p>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    <div className="bg-gray-50 rounded-xl p-3 space-y-1.5">
                      <p className="text-xs font-semibold text-gray-700">Left panel — violation detail</p>
                      <ul className="text-xs text-gray-600 list-disc pl-3 space-y-0.5">
                        <li>Title, subtitle, issued date, status badge, black points</li>
                        <li>Horizontal activity timeline (Ticket Created → current status)</li>
                        <li>Plain-text description of the violation</li>
                        <li>Evidence &amp; documentation files (Risk Team attachments)</li>
                        <li>Affected SKUs — collapsible list with fulfilment badges</li>
                      </ul>
                    </div>
                    <div className="bg-blue-50 rounded-xl p-3 space-y-1.5">
                      <p className="text-xs font-semibold text-blue-800">Right panel — chat thread</p>
                      <ul className="text-xs text-blue-700 list-disc pl-3 space-y-0.5">
                        <li>noon Risk Team message as a chat bubble (blue-tinted, "Shukran, Team noon")</li>
                        <li>Timestamp and status badge below the bubble</li>
                        <li>"Fixes needed" card (red) for sanctioned violations</li>
                        <li>Contextual status notice for non-actionable states</li>
                        <li>Dispute + Accept And Fix buttons pinned at the bottom (sanctioned only)</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="font-semibold text-gray-800">4.4 Seller Response Paths (sanctioned only)</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="border border-gray-200 rounded-xl p-3 space-y-1">
                      <p className="text-xs font-bold text-gray-700">Accept And Fix</p>
                      <ol className="text-xs text-gray-600 list-decimal pl-3 space-y-0.5">
                        <li>Review POA and check off each corrective step</li>
                        <li>Add optional notes</li>
                        <li>Submit → violation moves to <span className="font-mono bg-gray-100 px-1 rounded">acknowledged</span></li>
                        <li>Seller locked out until Risk Team responds</li>
                      </ol>
                    </div>
                    <div className="border border-gray-200 rounded-xl p-3 space-y-1">
                      <p className="text-xs font-bold text-gray-700">Dispute</p>
                      <ol className="text-xs text-gray-600 list-decimal pl-3 space-y-0.5">
                        <li>Write dispute reason (mandatory)</li>
                        <li>Optionally attach supporting documents</li>
                        <li>Submit → violation moves to <span className="font-mono bg-gray-100 px-1 rounded">disputed</span></li>
                        <li>Seller locked out until Risk Team responds</li>
                      </ol>
                    </div>
                  </div>
                </div>
              </section>

              {/* 5. Open Questions */}
              <section className="space-y-3">
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide pb-1.5 border-b border-gray-100">5. Open Questions</h2>
                <div className="space-y-2">
                  {[
                    { q: 'Echo integration', detail: 'Where do messages live — in this system or synced to/from Echo?', owner: 'Engineering + Risk Ops' },
                    { q: 'Attachment storage', detail: 'Do we store seller-submitted files ourselves or delegate to Echo?', owner: 'Engineering' },
                    { q: 'Seller appeals', detail: 'Do we allow sellers to appeal an upheld dispute, or is upheld final from the seller\'s perspective?', owner: 'Risk Ops' },
                    { q: 'Seller follow-up', detail: 'Are we comfortable blocking seller follow-up until the Risk Team responds first?', owner: 'Risk Ops' },
                    { q: 'Bulk uploads', detail: 'What is the validation and review queue flow before a bulk-uploaded violation is sanctioned?', owner: 'Product + Engineering' },
                    { q: 'Black point threshold', detail: 'What cumulative black point total triggers an account suspension or downgrade?', owner: 'Risk Ops' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2.5">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-200 text-amber-800 text-xs font-bold flex items-center justify-center mt-0.5">{i + 1}</span>
                      <div className="min-w-0">
                        <span className="font-semibold text-gray-800">{item.q}: </span>
                        <span className="text-gray-600">{item.detail}</span>
                        <span className="ml-2 text-xs text-amber-700 font-medium">Owner: {item.owner}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* 6. Out of Scope */}
              <section className="space-y-3">
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide pb-1.5 border-b border-gray-100">6. Out of Scope (v1)</h2>
                <ul className="list-disc pl-5 space-y-1 text-gray-600">
                  <li>Live data integration (all data is currently mocked)</li>
                  <li>Zoho deprecation migration plan</li>
                  <li>Ref Master deprecation migration plan</li>
                  <li>Echo message sync</li>
                  <li>Bulk upload implementation</li>
                  <li>Email/push notifications on state changes</li>
                  <li>Seller appeal flow from the seller side</li>
                  <li>Automated state transitions (e.g. auto-void after X days without seller response)</li>
                </ul>
              </section>

            </div>
          </div>
        </div>
      )}

      {/* BRD overview modal */}
      {showBrd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-600" />
                <h2 className="text-base font-bold text-gray-900">What is this and why are we building it?</h2>
              </div>
              <button onClick={() => setShowBrd(false)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="overflow-y-auto max-h-[80vh] px-6 py-5 space-y-5">

              <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-900">The internal tool</p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Right now, handling a violation means jumping between Zoho for communication and Ref Master for data — it's slow, manual, and easy to lose track of where things stand. This tool replaces that. Everything lives in one place: creating violations, tracking their status, and acting on seller responses.
                </p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  We're introducing a more structured, deterministic state model for violations. Instead of free-form updates, each violation moves through defined states — which means less ambiguity, easier handoffs between analysts, and the ability to automate state changes over time.
                </p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  We're also adding bulk uploads so analysts can process multiple violations at once instead of going one by one. The long-term target is to fully deprecate both Ref Master and Zoho for violation handling.
                </p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  This new tool will live inside the trust profile product as its separate tool.
                </p>
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-2">
                <p className="text-sm font-semibold text-gray-900">The seller experience</p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  On the seller side, the current view doesn't give sellers enough to work with. They see a violation but don't know exactly what went wrong, what it means for their account, or what they can do about it.
                </p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  We're improving this with a more detailed violation view — better information granularity so sellers can understand the specific issue, and clear structured paths to either fix it or dispute it. No more open-ended responses.
                </p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  This is also a foundation for the next step: a full account health and enforcement model built around violations, black points, and seller accountability.
                </p>
              </div>

            </div>
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end">
              <button
                onClick={() => setShowBrd(false)}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header with Logo */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">STP Violation Ledger</h1>
                <p className="text-xs text-gray-500">Risk Management System</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
            {/* BRD button */}
            <button
              onClick={() => setShowBrd(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5" /> Business Requirement Document
            </button>
            {/* PRD button */}
            
            <button
              onClick={() => setShowPrd(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <ScrollText className="w-3.5 h-3.5" /> Technical PRD
            </button>

            

            {/* Admin role toggle */}
            <button
              onClick={() => setIsAdmin(v => !v)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
                isAdmin
                  ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
              title="Toggle admin role — unlocks admin-only actions on violations (Appeal, Void, final decisions)"
            >
              <Shield className="w-3.5 h-3.5" /> Admin {isAdmin ? 'On' : 'Off'}
            </button>

            {/* Seller View toggle */}
            <button
              onClick={() => setSellerMode(v => !v)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold border transition-colors ${
                sellerMode
                  ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              Seller View
            </button>

            </div>
          </div>
        </div>
      </header>

      {/* Toolbar Tabs — hidden in seller mode */}
      {!sellerMode && (
        <div className="bg-white border-b border-gray-200">
          <div className="px-8 flex items-center justify-between">
            <nav className="flex space-x-8">
              {tabItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 transition-colors ${
                      isActive
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* What's New */}
            <button
              onClick={() => setShowChangelog(v => !v)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-yellow-300 text-yellow-900 hover:bg-yellow-400 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" /> What's new
            </button>
          </div>
        </div>
      )}

      {/* What's New modal */}
      {showChangelog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={() => setShowChangelog(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-yellow-500" />
                <h2 className="text-base font-bold text-gray-900">Tool guide — STP Violation Ledger</h2>
              </div>
              <button onClick={() => setShowChangelog(false)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="overflow-y-auto max-h-[85vh] divide-y divide-gray-100">
              {CHANGELOG.map((entry, i) => (
                <div key={i} className="px-6 py-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${entry.tagColor}`}>{entry.tag}</span>
                    <p className="text-sm font-semibold text-gray-900">{entry.title}</p>
                  </div>
                  <div className="space-y-1.5 pl-1">
                    {entry.detail.map((line, j) => (
                      <p key={j} className="text-sm text-gray-500 leading-relaxed">{line}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1">
        <div className="p-8">
          {sellerMode
            ? <SellerExperience />
            : <ActiveComponent onNavigate={handleNavigate} navigationState={navigationState} />
          }
        </div>
      </main>
    </div>
    </AdminContext.Provider>
  );
}

export default App;
