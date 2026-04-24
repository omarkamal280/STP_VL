import React from 'react';

interface ViolationTypesProps {
  onNavigate?: (tab: string, state?: any) => void;
  navigationState?: any;
}

const ViolationTypes: React.FC<ViolationTypesProps> = () => {
  // Static violation types with their properties
  const violationTypes = [
    {
      type: 'Late Delivery',
      severity: 'Medium',
      frequency: 234,
      trend: '+12%',
      description: 'Orders delivered beyond promised delivery date',
      icon: '📦'
    },
    {
      type: 'Product Mismatch',
      severity: 'High',
      frequency: 189,
      trend: '+8%',
      description: 'Delivered product does not match listing description',
      icon: '🔄'
    },
    {
      type: 'Counterfeit Goods',
      severity: 'Critical',
      frequency: 67,
      trend: '+5%',
      description: 'Suspected counterfeit branded items',
      icon: '⚠️'
    },
    {
      type: 'Poor Packaging',
      severity: 'Low',
      frequency: 156,
      trend: '-3%',
      description: 'Items arrived damaged due to inadequate packaging',
      icon: '📦'
    },
    {
      type: 'Unresponsive Communication',
      severity: 'Medium',
      frequency: 203,
      trend: '+15%',
      description: 'Seller not responding within required timeframe',
      icon: '💬'
    },
    {
      type: 'Fraudulent Activity',
      severity: 'Critical',
      frequency: 45,
      trend: '+2%',
      description: 'Suspicious or fraudulent seller behavior',
      icon: '🚨'
    },
    {
      type: 'Policy Violation',
      severity: 'High',
      frequency: 178,
      trend: '+6%',
      description: 'Violation of platform policies or terms',
      icon: '📋'
    },
    {
      type: 'Quality Issues',
      severity: 'Medium',
      frequency: 298,
      trend: '+18%',
      description: 'Product quality below expected standards',
      icon: '🔍'
    },
    {
      type: 'Other',
      severity: 'Variable',
      frequency: 89,
      trend: '+4%',
      description: 'Other types of violations not categorized above',
      icon: '📌'
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTrendIcon = (trend: string) => {
    return trend.startsWith('+') ? '📈' : '📉';
  };

  const getTrendColor = (trend: string) => {
    return trend.startsWith('+') ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Violation Types</h1>
        <p className="text-gray-600 mt-1">Comprehensive list of violation categories and their statistics</p>
      </div>

      
      {/* Violation Types Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Violation Categories</h2>
          <p className="text-sm text-gray-600 mt-1">Detailed breakdown of all violation types</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Severity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Frequency
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trend
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {violationTypes.map((violation, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{violation.icon}</span>
                      <span className="text-sm font-medium text-gray-900">{violation.type}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${getSeverityColor(violation.severity)}`}>
                      {violation.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{violation.frequency}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-1">
                      <span>{getTrendIcon(violation.trend)}</span>
                      <span className={`text-sm font-medium ${getTrendColor(violation.trend)}`}>
                        {violation.trend}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">{violation.description}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Severity Distribution */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Severity Distribution</h2>
          <p className="text-sm text-gray-600 mt-1">Breakdown by violation severity levels</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">112</div>
              <p className="text-sm text-red-800 font-medium">Critical</p>
              <p className="text-xs text-red-600 mt-1">7.7% of total</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">367</div>
              <p className="text-sm text-orange-800 font-medium">High</p>
              <p className="text-xs text-orange-600 mt-1">25.2% of total</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">735</div>
              <p className="text-sm text-yellow-800 font-medium">Medium</p>
              <p className="text-xs text-yellow-600 mt-1">50.4% of total</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">245</div>
              <p className="text-sm text-blue-800 font-medium">Low</p>
              <p className="text-xs text-blue-600 mt-1">16.8% of total</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViolationTypes;
