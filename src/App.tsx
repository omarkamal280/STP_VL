import React, { useState, useRef, useEffect } from 'react';
import { 
  LayoutDashboard,
  Database,
  Tag,
  FileText,
  AlertTriangle,
  MessageSquare,
  Zap,
  Bell,
  X,
  GitBranch,
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import ViolationData from './components/ViolationData';
import ViolationTypes from './components/ViolationTypes';
import ViolationLedger from './components/ViolationLedger';
import TemplatesManagement from './components/TemplatesManagement';
import CallToActions from './components/CallToActions';

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
    id: 'violation-ledger',
    label: 'Violation Ledger',
    icon: FileText,
    component: ViolationLedger
  },
  {
    id: 'violation-data',
    label: 'Violation Data',
    icon: Database,
    component: ViolationData
  },
  {
    id: 'violation-types',
    label: 'Violation Types',
    icon: Tag,
    component: ViolationTypes
  },
  {
    id: 'templates',
    label: 'Templates',
    icon: MessageSquare,
    component: TemplatesManagement
  },
  {
    id: 'call-to-actions',
    label: 'Call to Actions',
    icon: Zap,
    component: CallToActions
  },
];

// ── Changelog entries since last push ───────────────────────────────────────
const CHANGELOG: { tag: string; tagColor: string; title: string; detail: string }[] = [
  { tag: 'New Tab',    tagColor: 'bg-indigo-100 text-indigo-700', title: 'Call to Actions tab',           detail: '18 predefined CTAs (CTA-01 → CTA-18) with id, name, and description. Table shows which violation types require each CTA.' },
  { tag: 'Updated',   tagColor: 'bg-blue-100 text-blue-700',    title: 'Violation Data — Required CTAs column', detail: 'Each violation row now shows its required CTAs as indigo pill badges (hover for description).' },
  { tag: 'Updated',   tagColor: 'bg-blue-100 text-blue-700',    title: 'Violation Ledger wizard — CTA checklist', detail: 'Step 2 now includes a scrollable CTA checklist. Required CTAs for the selected violation code are auto-checked and locked. Analysts can add extra CTAs freely.' },
  { tag: 'Updated',   tagColor: 'bg-blue-100 text-blue-700',    title: 'Violation types — requiredCtaIds',      detail: 'All 18 violation codes now carry 1–3 required CTA IDs that drive the auto-selection in the wizard.' },
  { tag: 'New Type',  tagColor: 'bg-green-100 text-green-700',  title: 'CallToAction type',                    detail: 'Added CallToAction interface { id, name, description } to types.ts.' },
  { tag: 'Lifecycle', tagColor: 'bg-orange-100 text-orange-700',title: 'Violation status model',               detail: 'New 7-state lifecycle: sanctioned → disputed / sanctioned_acknowledged → upheld / appealed / dismissed / voided.' },
  { tag: 'Rewrite',   tagColor: 'bg-purple-100 text-purple-700',title: 'ViolationDetailModal',                 detail: 'Full rewrite supporting all 7 statuses. Ops actions: Uphold, Appeal, Dismiss, Void. Seller view: Acknowledge or Dispute. Dynamic communication thread.' },
  { tag: 'Updated',   tagColor: 'bg-blue-100 text-blue-700',    title: 'ViolationLedger status filters',       detail: 'Status colour map, filter dropdown, and wizard status field updated to the new lifecycle states.' },
  { tag: 'Updated',   tagColor: 'bg-blue-100 text-blue-700',    title: 'DisputesView & ViolationsList',        detail: 'Status icons, colours, filter options, and resolve actions aligned to the new Dispute.status union (pending / upheld / appealed / dismissed).' },
  { tag: 'Data',      tagColor: 'bg-yellow-100 text-yellow-700',title: 'Mock data expanded to 22 violations',  detail: 'Covers all violation types, 8 sellers, and dates spread across the past 180 days for richer data.' },
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
  const changelogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (changelogRef.current && !changelogRef.current.contains(e.target as Node)) {
        setShowChangelog(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const ActiveComponent = tabItems.find(item => item.id === activeTab)?.component || Dashboard;

  const handleNavigate = (tab: string, state?: any) => {
    setActiveTab(tab);
    if (state) {
      setNavigationState(state);
    }
  };

  if (!unlocked) {
    return <PasswordGate onUnlock={() => setUnlocked(true)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
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

            {/* Changelog bell */}
            <div className="relative" ref={changelogRef}>
              <button
                onClick={() => setShowChangelog(v => !v)}
                className="relative flex items-center justify-center w-9 h-9 rounded-lg hover:bg-gray-100 transition-colors"
                title="What's new"
              >
                <Bell className="w-5 h-5 text-gray-500" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-600" />
              </button>

              {showChangelog && (
                <div className="absolute right-0 top-12 w-[420px] bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden">
                  {/* Panel header */}
                  <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <GitBranch className="w-4 h-4 text-gray-400" />
                      <p className="text-sm font-semibold text-gray-900">What's new since last push</p>
                    </div>
                    <button onClick={() => setShowChangelog(false)} className="p-1 rounded-md hover:bg-gray-100 text-gray-400">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  {/* Entries */}
                  <div className="overflow-y-auto max-h-[480px] divide-y divide-gray-100">
                    {CHANGELOG.map((entry, i) => (
                      <div key={i} className="px-5 py-3.5 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${entry.tagColor}`}>{entry.tag}</span>
                          <p className="text-sm font-semibold text-gray-800">{entry.title}</p>
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed">{entry.detail}</p>
                      </div>
                    ))}
                  </div>
                  <div className="px-5 py-3 border-t border-gray-100 bg-gray-50">
                    <p className="text-xs text-gray-400">Last push: <span className="font-medium text-gray-600">verdict in edits</span> · branch <span className="font-mono">main</span></p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Toolbar Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-8">
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
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1">
        <div className="p-8">
          <ActiveComponent 
            onNavigate={handleNavigate}
            navigationState={navigationState}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
