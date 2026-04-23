import React, { useState } from 'react';
import { AlertTriangle, Clock, Users, FileText, Eye, Tag, TrendingUp } from 'lucide-react';
import { mockViolations, mockDisputes } from '../mockData';
import { Violation } from '../types';
import ViolationDetailModal from './ViolationDetailModal';

interface DashboardProps {
  onNavigate?: (tab: string, state?: any) => void;
  navigationState?: any;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const [selectedViolation, setSelectedViolation] = useState<Violation | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Calculate dashboard metrics
  const totalViolations = mockViolations.length;
  const activeDisputes = mockDisputes.filter(d => d.status === 'pending' || d.status === 'under_review').length;
  const pendingDisputes = mockDisputes.filter(d => d.status === 'pending').length;
  
  // Get violations from past 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const violationsPast30Days = mockViolations.filter(v => v.createdAt > thirtyDaysAgo).length;

  // Get recent violations (last 10)
  const recentViolations = [...mockViolations]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 10);

  // Get recent disputes (last 10)
  const recentDisputes = [...mockDisputes]
    .sort((a, b) => b.submittedAt.getTime() - a.submittedAt.getTime())
    .slice(0, 10);

  const handleViolationClick = (violation: Violation) => {
    setSelectedViolation(violation);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedViolation(null);
  };

  const StatCard: React.FC<{ title: string; value: number; icon: React.ElementType; color: string; subtitle?: string }> = 
    ({ title, value, icon: Icon, color, subtitle }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-2xl font-bold ${color}`}>{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-lg ${color.replace('text', 'bg').replace('600', '100')}`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Violation Management Dashboard</h1>
        <p className="text-gray-600 mt-1">Overview of violations, disputes, and tickets requiring attention</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Violations"
          value={totalViolations}
          icon={FileText}
          color="text-blue-600"
          subtitle="All time"
        />
        <StatCard
          title="Violations (30 days)"
          value={violationsPast30Days}
          icon={AlertTriangle}
          color="text-orange-600"
          subtitle="Past 30 days"
        />
        <StatCard
          title="Active Disputes"
          value={activeDisputes}
          icon={Users}
          color="text-purple-600"
          subtitle="Under review"
        />
        <StatCard
          title="Pending Disputes"
          value={pendingDisputes}
          icon={Clock}
          color="text-green-600"
          subtitle="Awaiting response"
        />
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <Tag className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Total Types</p>
              <p className="text-xl font-bold text-gray-900">9</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-8 h-8 text-orange-600" />
            <div>
              <p className="text-sm text-gray-600">Most Common</p>
              <p className="text-lg font-bold text-gray-900">Quality Issues</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <TrendingUp className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-sm text-gray-600">Fastest Growing</p>
              <p className="text-lg font-bold text-gray-900">Quality Issues</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <Users className="w-8 h-8 text-purple-600" />
            <div>
              <p className="text-sm text-gray-600">Total Cases</p>
              <p className="text-xl font-bold text-gray-900">1,459</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Violations */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent Violations</h2>
              <span className="text-sm text-gray-500">Last 10</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Seller</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Severity</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentViolations.map((violation) => (
                  <tr key={violation.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{violation.id}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{violation.type}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{violation.sellerId}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        violation.severity === 'critical' ? 'bg-red-100 text-red-800' :
                        violation.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                        violation.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {violation.severity}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        violation.status === 'active' ? 'bg-blue-100 text-blue-800' :
                        violation.status === 'disputed' ? 'bg-purple-100 text-purple-800' :
                        violation.status === 'enforced' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {violation.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {violation.createdAt.toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleViolationClick(violation)}
                        className="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                      >
                        <Eye className="w-4 h-4" />
                        <span className="text-xs">View</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Disputes */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent Disputes</h2>
              <span className="text-sm text-gray-500">Last 10</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Violation</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Seller</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentDisputes.map((dispute) => {
                  // Find the related violation
                  const relatedViolation = mockViolations.find(v => v.id === dispute.violationId);
                  return (
                    <tr key={dispute.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{dispute.id}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{dispute.violationId}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{dispute.sellerId}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          dispute.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          dispute.status === 'under_review' ? 'bg-blue-100 text-blue-800' :
                          dispute.status === 'resolved' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {dispute.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {dispute.submittedAt.toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        {relatedViolation && (
                          <button
                            onClick={() => handleViolationClick(relatedViolation)}
                            className="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                          >
                            <Eye className="w-4 h-4" />
                            <span className="text-xs">View Violation</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      
      {/* Violation Detail Modal */}
      <ViolationDetailModal
        violation={selectedViolation}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default Dashboard;
