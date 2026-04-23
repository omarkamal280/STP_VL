import React, { useState } from 'react';
import ViolationsList from './ViolationsList';
import AddViolation from './AddViolation';
import DisputesView from './DisputesView';

type SubTab = 'list' | 'add' | 'disputes';

const ViolationsTab: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('list');

  return (
    <div>
      <div className="flex space-x-1 mb-6 bg-gray-50 p-1 rounded-lg inline-flex">
        <button
          onClick={() => setActiveSubTab('list')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeSubTab === 'list'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          All Violations
        </button>
        <button
          onClick={() => setActiveSubTab('add')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeSubTab === 'add'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Add Violation
        </button>
        <button
          onClick={() => setActiveSubTab('disputes')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeSubTab === 'disputes'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Disputes
        </button>
      </div>

      <div>
        {activeSubTab === 'list' && <ViolationsList />}
        {activeSubTab === 'add' && <AddViolation />}
        {activeSubTab === 'disputes' && <DisputesView />}
      </div>
    </div>
  );
};

export default ViolationsTab;
