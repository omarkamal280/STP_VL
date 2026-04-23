import React from 'react';
import { Database, AlertTriangle } from 'lucide-react';

interface ViolationDataProps {
  onNavigate?: (tab: string, state?: any) => void;
  navigationState?: any;
}

const ViolationData: React.FC<ViolationDataProps> = () => {
  // Static violations data
  const violationsData = [
    {
      id: 1,
      name: 'Late Delivery',
      type: 'DELIVERY',
      blackPoints: 3,
      severity: 'Medium',
      descriptionEn: 'Orders delivered beyond the promised delivery date',
      descriptionAr: 'Orders delivered beyond the promised delivery date'
    },
    {
      id: 2,
      name: 'Product Mismatch',
      type: 'PRODUCT',
      blackPoints: 5,
      severity: 'High',
      descriptionEn: 'Delivered product does not match listing description',
      descriptionAr: 'Delivered product does not match listing description'
    },
    {
      id: 3,
      name: 'Counterfeit Goods',
      type: 'PRODUCT',
      blackPoints: 10,
      severity: 'Critical',
      descriptionEn: 'Suspected counterfeit branded items',
      descriptionAr: 'Suspected counterfeit branded items'
    },
    {
      id: 4,
      name: 'Poor Packaging',
      type: 'PACKAGING',
      blackPoints: 2,
      severity: 'Low',
      descriptionEn: 'Items arrived damaged due to inadequate packaging',
      descriptionAr: 'Items arrived damaged due to inadequate packaging'
    },
    {
      id: 5,
      name: 'Unresponsive Communication',
      type: 'COMMUNICATION',
      blackPoints: 4,
      severity: 'Medium',
      descriptionEn: 'Seller not responding within required timeframe',
      descriptionAr: 'Seller not responding within required timeframe'
    },
    {
      id: 6,
      name: 'Fraudulent Activity',
      type: 'FRAUD',
      blackPoints: 10,
      severity: 'Critical',
      descriptionEn: 'Suspicious or fraudulent seller behavior',
      descriptionAr: 'Suspicious or fraudulent seller behavior'
    },
    {
      id: 7,
      name: 'Policy Violation',
      type: 'POLICY',
      blackPoints: 6,
      severity: 'High',
      descriptionEn: 'Violation of platform policies or terms',
      descriptionAr: 'Violation of platform policies or terms'
    },
    {
      id: 8,
      name: 'Quality Issues',
      type: 'QUALITY',
      blackPoints: 4,
      severity: 'Medium',
      descriptionEn: 'Product quality below expected standards',
      descriptionAr: 'Product quality below expected standards'
    }
  ];

  // Static violation types data
  const violationTypes = [
    {
      typeId: 'DELIVERY',
      codeName: 'Delivery Violations',
      descriptionEn: 'Violations related to delivery and shipping issues',
      descriptionAr: 'Violations related to delivery and shipping issues',
      codeNameAr: 'Violations related to delivery and shipping issues',
      isActive: true
    },
    {
      typeId: 'PRODUCT',
      codeName: 'Product Violations',
      descriptionEn: 'Violations related to product quality and accuracy',
      descriptionAr: 'Violations related to product quality and accuracy',
      codeNameAr: 'Violations related to product quality and accuracy',
      isActive: true
    },
    {
      typeId: 'PACKAGING',
      codeName: 'Packaging Violations',
      descriptionEn: 'Violations related to packaging and damage during transit',
      descriptionAr: 'Violations related to packaging and damage during transit',
      codeNameAr: 'Violations related to packaging and damage during transit',
      isActive: true
    },
    {
      typeId: 'COMMUNICATION',
      codeName: 'Communication Violations',
      descriptionEn: 'Violations related to seller responsiveness and communication',
      descriptionAr: 'Violations related to seller responsiveness and communication',
      codeNameAr: 'Violations related to seller responsiveness and communication',
      isActive: true
    },
    {
      typeId: 'FRAUD',
      codeName: 'Fraud Violations',
      descriptionEn: 'Violations related to fraudulent activities and suspicious behavior',
      descriptionAr: 'Violations related to fraudulent activities and suspicious behavior',
      codeNameAr: 'Violations related to fraudulent activities and suspicious behavior',
      isActive: true
    },
    {
      typeId: 'POLICY',
      codeName: 'Policy Violations',
      descriptionEn: 'Violations of platform policies and terms of service',
      descriptionAr: 'Violations of platform policies and terms of service',
      codeNameAr: 'Violations of platform policies and terms of service',
      isActive: true
    },
    {
      typeId: 'QUALITY',
      codeName: 'Quality Violations',
      descriptionEn: 'Violations related to product quality standards',
      descriptionAr: 'Violations related to product quality standards',
      codeNameAr: 'Violations related to product quality standards',
      isActive: true
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Violation Data</h1>
        <p className="text-gray-600 mt-1">Static violation data and type definitions</p>
      </div>

      {/* Violations Data Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Database className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Violations Data</h2>
          </div>
          <p className="text-sm text-gray-600 mt-1">Master list of all violation definitions</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Black Points
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Severity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description (EN)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description (AR)
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {violationsData.map((violation) => (
                <tr key={violation.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {violation.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {violation.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {violation.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {violation.blackPoints}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${getSeverityColor(violation.severity)}`}>
                      {violation.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                    {violation.descriptionEn}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                    {violation.descriptionAr}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ViolationData;
