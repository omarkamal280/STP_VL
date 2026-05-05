import React, { useState } from 'react';
import { Zap, Search } from 'lucide-react';
import { CALL_TO_ACTIONS } from '../ctaData';
import { VIOLATION_CODES } from '../violationSchemas';

const CallToActions: React.FC = () => {
  const [search, setSearch] = useState('');

  const filtered = CALL_TO_ACTIONS.filter(c =>
    c.id.toLowerCase().includes(search.toLowerCase()) ||
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.description.toLowerCase().includes(search.toLowerCase())
  );

  // For each CTA, which violation codes reference it?
  const usageMap: Record<string, string[]> = {};
  for (const cta of CALL_TO_ACTIONS) {
    usageMap[cta.id] = VIOLATION_CODES
      .filter(v => v.requiredCtaIds.includes(cta.id))
      .map(v => v.label);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Call to Actions</h1>
        <p className="text-gray-500 mt-1 text-sm">Master list of CTAs that can be assigned to violation types. Required CTAs are auto-selected during violation creation.</p>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
            <Zap className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Total CTAs</p>
            <p className="text-2xl font-bold text-gray-900">{CALL_TO_ACTIONS.length}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0">
            <Zap className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Violation Types Covered</p>
            <p className="text-2xl font-bold text-gray-900">{VIOLATION_CODES.length}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
            <Zap className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Avg CTAs per Violation</p>
            <p className="text-2xl font-bold text-gray-900">
              {(VIOLATION_CODES.reduce((s, v) => s + v.requiredCtaIds.length, 0) / VIOLATION_CODES.length).toFixed(1)}
            </p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search CTAs…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-9 pr-4 py-2 w-full border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-24">ID</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-56">Name</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Used By (Violation Types)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map(cta => (
              <tr key={cta.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-xs font-mono font-semibold">
                    {cta.id}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                  {cta.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 max-w-md">
                  {cta.description}
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1.5">
                    {usageMap[cta.id].length === 0 ? (
                      <span className="text-xs text-gray-400">—</span>
                    ) : (
                      usageMap[cta.id].map(label => (
                        <span key={label} className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">
                          {label}
                        </span>
                      ))
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-10 text-center text-sm text-gray-400">
                  No CTAs match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CallToActions;
