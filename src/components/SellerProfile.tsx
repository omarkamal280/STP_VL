import React, { useState } from 'react';
import { Search } from 'lucide-react';
import ViolationsTab from './ViolationsTab';

type Tab = 'profile' | 'violations';

const SellerProfile: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [searchType, setSearchType] = useState('Project ID');
  const [searchValue, setSearchValue] = useState('');
  const [recentSearches] = useState(['442777', '10555', '492959']);

  return (
    <div className="h-full flex flex-col">
      <header className="bg-white border-b border-gray-200 px-8 py-4">
        <div className="flex items-center space-x-2 text-gray-600">
          <Store className="w-5 h-5" />
          <h1 className="text-sm font-medium uppercase tracking-wide">SELLER PROFILE</h1>
        </div>
      </header>

      <div className="flex-1 bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="mb-8">
              <div className="flex items-center space-x-2 mb-6">
                <Search className="w-5 h-5 text-blue-500" />
                <h2 className="text-lg font-semibold">Search</h2>
              </div>

              <div className="flex items-center space-x-4">
                <select 
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                >
                  <option>Project ID</option>
                  <option>Seller Name</option>
                  <option>Email</option>
                </select>
                <input
                  type="text"
                  placeholder="Search by project ID"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
                <button className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center space-x-2">
                  <span>Search</span>
                  <Search className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide">Recent Searches</h3>
                  <button className="text-sm text-gray-500 hover:text-gray-700">Clear</button>
                </div>
                <div className="space-y-2">
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 w-full text-left py-2 px-3 rounded hover:bg-gray-50"
                    >
                      <Store className="w-4 h-4" />
                      <span>{search}</span>
                      <span className="ml-auto text-gray-400">→</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <div className="flex space-x-1 border-b border-gray-200">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`px-6 py-3 font-medium text-sm transition-colors ${
                    activeTab === 'profile'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Profile & Metrics
                </button>
                <button
                  onClick={() => setActiveTab('violations')}
                  className={`px-6 py-3 font-medium text-sm transition-colors ${
                    activeTab === 'violations'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Violations
                </button>
              </div>

              <div className="mt-6">
                {activeTab === 'profile' && (
                  <div className="text-center py-12 text-gray-500">
                    <p>Select a seller from search to view profile and metrics</p>
                  </div>
                )}
                {activeTab === 'violations' && <ViolationsTab />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Store: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

export default SellerProfile;
