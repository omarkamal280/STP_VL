import React, { useState } from 'react';
import { 
  LayoutDashboard,
  Database,
  Tag,
  FileText,
  AlertTriangle,
  MessageSquare
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import ViolationData from './components/ViolationData';
import ViolationTypes from './components/ViolationTypes';
import ViolationLedger from './components/ViolationLedger';
import TemplatesManagement from './components/TemplatesManagement';

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
  }
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
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">STP Violation Ledger</h1>
              <p className="text-xs text-gray-500">Risk Management System</p>
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
