// @ts-nocheck — legacy component, superseded by ops/DisputesQueue in perfect-system branch
import React, { useState } from 'react';
import { MessageSquare, FileText, ExternalLink, CheckCircle, XCircle, Clock } from 'lucide-react';
import { mockDisputes } from '../mockData';
import { Dispute } from '../types';

const DisputesView: React.FC = () => {
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [replyText, setReplyText] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredDisputes = mockDisputes.filter(d => 
    filterStatus === 'all' || d.status === filterStatus
  );

  const handleResolve = (action: 'enforced' | 'exonerated') => {
    if (!selectedDispute || !replyText.trim()) {
      alert('Please provide a reply before resolving the dispute');
      return;
    }
    console.log('Resolving dispute:', {
      disputeId: selectedDispute.id,
      action,
      reply: replyText
    });
    setReplyText('');
    setSelectedDispute(null);
  };

  const getStatusIcon = (status: Dispute['status']) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'under_review': return <MessageSquare className="w-4 h-4 text-blue-600" />;
      case 'resolved': return <CheckCircle className="w-4 h-4 text-green-600" />;
    }
  };

  const getStatusColor = (status: Dispute['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'under_review': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
    }
  };

  return (
    <div className="grid grid-cols-2 gap-6">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Disputes</h3>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="under_review">Under Review</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>

        <div className="space-y-3">
          {filteredDisputes.map((dispute) => (
            <div
              key={dispute.id}
              onClick={() => setSelectedDispute(dispute)}
              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                selectedDispute?.id === dispute.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(dispute.status)}
                  <span className="font-medium text-gray-900">{dispute.id}</span>
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(dispute.status)}`}>
                  {dispute.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>
              
              <div className="space-y-1 text-sm">
                <div className="flex items-center space-x-2 text-gray-600">
                  <span className="font-medium">Violation:</span>
                  <span>{dispute.violationId}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <span className="font-medium">Seller:</span>
                  <button className="text-blue-600 hover:text-blue-800 flex items-center space-x-1">
                    <span>{dispute.sellerId}</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
                <div className="text-gray-600">
                  <span className="font-medium">Submitted:</span>{' '}
                  {dispute.submittedAt.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </div>
              </div>

              {dispute.status === 'resolved' && dispute.resolution && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="flex items-center space-x-2">
                    {dispute.resolution.action === 'enforced' ? (
                      <XCircle className="w-4 h-4 text-red-600" />
                    ) : (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    )}
                    <span className={`text-sm font-medium ${
                      dispute.resolution.action === 'enforced' ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {dispute.resolution.action === 'enforced' ? 'Violation Enforced' : 'Seller Exonerated'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredDisputes.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">No disputes found</p>
          </div>
        )}
      </div>

      <div>
        {selectedDispute ? (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Dispute Details</h3>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedDispute.status)}`}>
                  {selectedDispute.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Dispute ID</label>
                  <p className="text-gray-900">{selectedDispute.id}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Related Violation</label>
                  <p className="text-blue-600 font-medium">{selectedDispute.violationId}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Seller ID</label>
                  <button className="text-blue-600 hover:text-blue-800 font-medium flex items-center space-x-1">
                    <span>{selectedDispute.sellerId}</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Submitted Date</label>
                  <p className="text-gray-900">
                    {selectedDispute.submittedAt.toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Reason for Dispute</label>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <p className="text-gray-900 text-sm leading-relaxed">{selectedDispute.reason}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Evidence Attached ({selectedDispute.evidence.length})
                  </label>
                  <div className="space-y-2">
                    {selectedDispute.evidence.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center space-x-2">
                          <FileText className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-900">{file}</span>
                        </div>
                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                          View
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedDispute.status === 'resolved' && selectedDispute.resolution && (
                  <div className="pt-4 border-t border-gray-200">
                    <div className="mb-4">
                      <div className="flex items-center space-x-2 mb-2">
                        {selectedDispute.resolution.action === 'enforced' ? (
                          <XCircle className="w-5 h-5 text-red-600" />
                        ) : (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        )}
                        <label className="text-sm font-medium text-gray-700">Resolution</label>
                      </div>
                      <p className={`text-sm font-semibold ${
                        selectedDispute.resolution.action === 'enforced' ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {selectedDispute.resolution.action === 'enforced' ? 'Violation Enforced' : 'Seller Exonerated'}
                      </p>
                    </div>

                    <div className="mb-4">
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Team Reply</label>
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <p className="text-gray-900 text-sm leading-relaxed">{selectedDispute.resolution.reply}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <label className="text-gray-600">Resolved By</label>
                        <p className="text-gray-900 font-medium">{selectedDispute.resolution.resolvedBy}</p>
                      </div>
                      <div>
                        <label className="text-gray-600">Resolved Date</label>
                        <p className="text-gray-900 font-medium">
                          {selectedDispute.resolution.resolvedAt.toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {selectedDispute.status !== 'resolved' && (
                  <div className="pt-4 border-t border-gray-200">
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Your Reply <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Provide your response to the seller's dispute..."
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                    />

                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleResolve('exonerated')}
                        className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center space-x-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Exonerate Seller</span>
                      </button>
                      <button
                        onClick={() => handleResolve('enforced')}
                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center space-x-2"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Enforce Violation</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Select a dispute to view details</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DisputesView;
