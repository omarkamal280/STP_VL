import React, { useState } from 'react';
import { Database, Tag, Zap } from 'lucide-react';
import ViolationData from './ViolationData';
import ViolationTypes from './ViolationTypes';
import CallToActions from './CallToActions';

const SUB_TABS = [
  { id: 'violation-data',  label: 'Violation Data',  Icon: Database,  Component: ViolationData  },
  { id: 'violation-types', label: 'Violation Types', Icon: Tag,        Component: ViolationTypes },
  { id: 'call-to-actions', label: 'Call to Actions', Icon: Zap,        Component: CallToActions  },
] as const;

type SubTabId = typeof SUB_TABS[number]['id'];

const MasterLists: React.FC = () => {
  const [active, setActive] = useState<SubTabId>('violation-data');
  const ActiveComponent = SUB_TABS.find(t => t.id === active)!.Component;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Master Lists</h1>
        <p className="text-gray-600 mt-1">Reference data — violation records, types, and call-to-action definitions</p>
      </div>

      {/* Sub-tab bar */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="flex border-b border-gray-200">
          {SUB_TABS.map(({ id, label, Icon }) => {
            const isActive = active === id;
            return (
              <button
                key={id}
                onClick={() => setActive(id)}
                className={`flex items-center gap-2 px-6 py-3.5 text-sm font-medium border-b-2 transition-colors ${
                  isActive
                    ? 'border-blue-600 text-blue-600 bg-blue-50/40'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            );
          })}
        </div>

        <div className="p-6">
          <ActiveComponent />
        </div>
      </div>
    </div>
  );
};

export default MasterLists;
