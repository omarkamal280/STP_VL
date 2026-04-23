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
    id: 'violation-ledger',
    label: 'Violation Ledger',
    icon: FileText,
    component: ViolationLedger
  },
  {
    id: 'templates',
    label: 'Templates',
    icon: MessageSquare,
    component: TemplatesManagement
  }
];

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [navigationState, setNavigationState] = useState<any>({});

  const ActiveComponent = tabItems.find(item => item.id === activeTab)?.component || Dashboard;

  const handleNavigate = (tab: string, state?: any) => {
    setActiveTab(tab);
    if (state) {
      setNavigationState(state);
    }
  };

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
