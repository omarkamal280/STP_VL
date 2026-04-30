import React, { useState } from 'react';
import {
  LayoutDashboard, FileText, Scale, Users, BarChart2,
  MessageSquare, AlertTriangle, Shield, ChevronDown,
} from 'lucide-react';

import Dashboard from './components/Dashboard';
import ViolationLedger from './components/ViolationLedger';
import ViolationData from './components/ViolationData';
import ViolationTypes from './components/ViolationTypes';
import TemplatesManagement from './components/TemplatesManagement';

import OpsDashboard from './components/ops/OpsDashboard';
import DisputesQueue from './components/ops/DisputesQueue';
import SellerProfiles from './components/ops/SellerProfiles';
import Analytics from './components/ops/Analytics';

import MyViolations from './components/seller/MyViolations';
import MyDisputes from './components/seller/MyDisputes';
import MyHealth from './components/seller/MyHealth';

import { mockSellers } from './mockData';

// ─── Types ────────────────────────────────────────────────────────────────────

type Portal = 'ops' | 'seller';

// ─── OPS TABS ─────────────────────────────────────────────────────────────────

type OpsTab = 'ops-dashboard' | 'violations' | 'disputes' | 'sellers' | 'analytics' | 'templates' | 'violation-data' | 'violation-types';

const OPS_TABS: { id: OpsTab; label: string; icon: React.ElementType }[] = [
  { id: 'ops-dashboard',  label: 'Dashboard',       icon: LayoutDashboard },
  { id: 'violations',     label: 'Violations',      icon: FileText },
  { id: 'disputes',       label: 'Disputes',        icon: Scale },
  { id: 'sellers',        label: 'Sellers',         icon: Users },
  { id: 'analytics',      label: 'Analytics',       icon: BarChart2 },
  { id: 'templates',      label: 'Templates',       icon: MessageSquare },
];

// ─── SELLER TABS ──────────────────────────────────────────────────────────────

type SellerTab = 'my-violations' | 'my-disputes' | 'my-health';

const SELLER_TABS: { id: SellerTab; label: string; icon: React.ElementType }[] = [
  { id: 'my-violations', label: 'My Violations', icon: FileText },
  { id: 'my-disputes',   label: 'My Disputes',   icon: Scale },
  { id: 'my-health',     label: 'My Health',     icon: Shield },
];

// ─── Password Gate ────────────────────────────────────────────────────────────

const CORRECT_PASSWORD = 'iknowomarkamal';

function PasswordGate({ onUnlock }: { onUnlock: () => void }) {
  const [input, setInput] = useState('');
  const [wrong, setWrong] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input === CORRECT_PASSWORD) { onUnlock(); }
    else { setWrong(true); setInput(''); }
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
          <input type="password" value={input} onChange={e => setInput(e.target.value)}
            autoFocus placeholder="Password"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center tracking-widest" />
          <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">Enter</button>
        </form>
      </div>
    </div>
  );
}

// ─── Portal Switcher Bar ──────────────────────────────────────────────────────

function PortalSwitcher({ portal, onSwitch }: { portal: Portal; onSwitch: (p: Portal) => void }) {
  return (
    <div className="bg-gray-900 text-white px-8 py-2 flex items-center justify-between text-xs">
      <span className="text-gray-500 font-medium tracking-wide uppercase">STP Violation Platform</span>
      <div className="flex items-center gap-1 bg-gray-800 rounded-lg p-0.5">
        <button onClick={() => onSwitch('ops')}
          className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-colors ${portal === 'ops' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-gray-200'}`}>
          OPS Portal
        </button>
        <button onClick={() => onSwitch('seller')}
          className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-colors ${portal === 'seller' ? 'bg-emerald-600 text-white' : 'text-gray-400 hover:text-gray-200'}`}>
          Seller Portal
        </button>
      </div>
    </div>
  );
}

// ─── Seller Selector ──────────────────────────────────────────────────────────

function SellerSelector({ sellerId, onChange }: { sellerId: string; onChange: (id: string) => void }) {
  const seller = mockSellers[sellerId];
  return (
    <div className="relative inline-flex items-center gap-2">
      <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-[10px] font-black text-white">
        {seller?.name?.[0] ?? '?'}
      </div>
      <select value={sellerId} onChange={e => onChange(e.target.value)}
        className="pl-1 pr-6 py-0.5 text-xs font-semibold text-gray-700 bg-transparent focus:outline-none cursor-pointer appearance-none">
        {Object.values(mockSellers).map(s => (
          <option key={s.id} value={s.id}>{s.name} ({s.id})</option>
        ))}
      </select>
      <ChevronDown className="w-3 h-3 text-gray-500 absolute right-0 pointer-events-none" />
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

function App() {
  const [unlocked, setUnlocked] = useState(false);
  const [portal, setPortal] = useState<Portal>('ops');
  const [opsTab, setOpsTab] = useState<OpsTab>('ops-dashboard');
  const [sellerTab, setSellerTab] = useState<SellerTab>('my-violations');
  const [demoSellerId, setDemoSellerId] = useState(Object.keys(mockSellers)[0]);
  const [navigationState, setNavigationState] = useState<any>({});

  const handleNavigate = (tab: string, state?: any) => {
    setOpsTab(tab as OpsTab);
    if (state) setNavigationState(state);
  };

  if (!unlocked) return <PasswordGate onUnlock={() => setUnlocked(true)} />;

  const accentColor = portal === 'ops' ? 'border-blue-600 text-blue-600' : 'border-emerald-600 text-emerald-600';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Portal Switcher */}
      <PortalSwitcher portal={portal} onSwitch={p => { setPortal(p); }} />

      {/* Header */}
      <header className={`bg-white border-b border-gray-200`}>
        <div className="px-8 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`flex items-center justify-center w-9 h-9 rounded-lg ${portal === 'ops' ? 'bg-blue-600' : 'bg-emerald-600'}`}>
              {portal === 'ops' ? <AlertTriangle className="w-5 h-5 text-white" /> : <Shield className="w-5 h-5 text-white" />}
            </div>
            <div>
              <h1 className="text-base font-bold text-gray-900">
                {portal === 'ops' ? 'Operations Portal' : 'Seller Portal'}
              </h1>
              <p className="text-xs text-gray-500">
                {portal === 'ops' ? 'Violation & Risk Management' : 'Manage your violations & account health'}
              </p>
            </div>
          </div>
          {portal === 'seller' && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">Viewing as:</span>
              <SellerSelector sellerId={demoSellerId} onChange={setDemoSellerId} />
            </div>
          )}
          {portal === 'ops' && (
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-[10px] font-bold">NR</div>
              <span>Nour Al-Rashid</span>
            </div>
          )}
        </div>
      </header>

      {/* Tab Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-8">
          <nav className="flex space-x-1">
            {portal === 'ops' ? OPS_TABS.map(tab => {
              const Icon = tab.icon;
              const isActive = opsTab === tab.id;
              return (
                <button key={tab.id} onClick={() => setOpsTab(tab.id)}
                  className={`flex items-center gap-1.5 py-3.5 px-3 border-b-2 text-sm font-medium transition-colors ${isActive ? accentColor : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                  <Icon className="w-4 h-4" />{tab.label}
                </button>
              );
            }) : SELLER_TABS.map(tab => {
              const Icon = tab.icon;
              const isActive = sellerTab === tab.id;
              return (
                <button key={tab.id} onClick={() => setSellerTab(tab.id)}
                  className={`flex items-center gap-1.5 py-3.5 px-3 border-b-2 text-sm font-medium transition-colors ${isActive ? accentColor : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                  <Icon className="w-4 h-4" />{tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 p-8">
        {portal === 'ops' ? (
          <>
            {opsTab === 'ops-dashboard'  && <OpsDashboard />}
            {opsTab === 'violations'     && <ViolationLedger onNavigate={handleNavigate} navigationState={navigationState} />}
            {opsTab === 'disputes'       && <DisputesQueue />}
            {opsTab === 'sellers'        && <SellerProfiles />}
            {opsTab === 'analytics'      && <Analytics />}
            {opsTab === 'templates'      && <TemplatesManagement onNavigate={handleNavigate} navigationState={navigationState} />}
          </>
        ) : (
          <>
            {sellerTab === 'my-violations' && <MyViolations sellerId={demoSellerId} />}
            {sellerTab === 'my-disputes'   && <MyDisputes sellerId={demoSellerId} />}
            {sellerTab === 'my-health'     && <MyHealth sellerId={demoSellerId} />}
          </>
        )}
      </main>
    </div>
  );
}

export default App;
