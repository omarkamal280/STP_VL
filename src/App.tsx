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
    id: 'my-work',
    label: 'My Work',
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
    tag: 'My Work',
    tagColor: 'bg-purple-100 text-purple-700',
    title: 'My Work',
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
            {/* About button */}
            <button
              onClick={() => setShowBrd(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5" /> Business Requirement Document
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
