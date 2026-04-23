import React, { useState } from 'react';
import { Search, Filter, ExternalLink, Clock, User, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { mockZohoTickets, mockViolations } from '../mockData';
import { ZohoTicket } from '../types';

const ZohoTicketView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [selectedTicket, setSelectedTicket] = useState<ZohoTicket | null>(null);

  const filteredTickets = mockZohoTickets.filter(ticket => {
    const matchesSearch = ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.sellerId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'pending':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'resolved':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'closed':
        return <XCircle className="w-4 h-4 text-gray-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRelatedViolation = (violationId: string) => {
    return mockViolations.find(v => v.id === violationId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Zoho Ticket Management</h1>
        <p className="text-gray-600 mt-1">View and manage support tickets created from violations</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by ticket ID, subject, or seller ID..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex gap-3">
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="pending">Pending</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
            
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="all">All Priority</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tickets List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Tickets ({filteredTickets.length})
              </h2>
            </div>
            
            <div className="divide-y divide-gray-200">
              {filteredTickets.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <p>No tickets found matching your criteria</p>
                </div>
              ) : (
                filteredTickets.map((ticket) => {
                  const violation = getRelatedViolation(ticket.violationId);
                  return (
                    <div
                      key={ticket.id}
                      className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                        selectedTicket?.id === ticket.id ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => setSelectedTicket(ticket)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-sm font-medium text-gray-900">{ticket.id}</span>
                            <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(ticket.status)}`}>
                              {ticket.status}
                            </span>
                            <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(ticket.priority)}`}>
                              {ticket.priority}
                            </span>
                          </div>
                          
                          <h3 className="text-sm font-medium text-gray-900 mb-1">{ticket.subject}</h3>
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">{ticket.description}</p>
                          
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span className="flex items-center space-x-1">
                              <User className="w-3 h-3" />
                              <span>Seller: {ticket.sellerId}</span>
                            </span>
                            {violation && (
                              <span className="flex items-center space-x-1">
                                <AlertTriangle className="w-3 h-3" />
                                <span>Violation: {violation.type}</span>
                              </span>
                            )}
                            <span className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>{ticket.createdAt.toLocaleDateString()}</span>
                            </span>
                          </div>
                          
                          {ticket.assignedTo && (
                            <div className="mt-2">
                              <span className="text-xs text-gray-500">Assigned to: {ticket.assignedTo}</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="ml-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              // Open Zoho ticket in new tab (mock)
                              console.log(`Opening ticket ${ticket.id} in Zoho`);
                            }}
                            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                            title="View in Zoho"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Ticket Details */}
        <div className="lg:col-span-1">
          {selectedTicket ? (
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Ticket Details</h2>
              </div>
              
              <div className="p-4 space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Ticket ID</label>
                  <p className="text-sm text-gray-900">{selectedTicket.id}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">Subject</label>
                  <p className="text-sm text-gray-900">{selectedTicket.subject}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">Description</label>
                  <p className="text-sm text-gray-900">{selectedTicket.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Status</label>
                    <div className="mt-1">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(selectedTicket.status)}`}>
                        {selectedTicket.status}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Priority</label>
                    <div className="mt-1">
                      <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(selectedTicket.priority)}`}>
                        {selectedTicket.priority}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">Seller ID</label>
                  <p className="text-sm text-gray-900">{selectedTicket.sellerId}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">Violation ID</label>
                  <p className="text-sm text-gray-900">{selectedTicket.violationId}</p>
                </div>
                
                {selectedTicket.assignedTo && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Assigned To</label>
                    <p className="text-sm text-gray-900">{selectedTicket.assignedTo}</p>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Created</label>
                    <p className="text-sm text-gray-900">
                      {selectedTicket.createdAt.toLocaleDateString()} {selectedTicket.createdAt.toLocaleTimeString()}
                    </p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Updated</label>
                    <p className="text-sm text-gray-900">
                      {selectedTicket.updatedAt.toLocaleDateString()} {selectedTicket.updatedAt.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                
                {/* Related Violation Info */}
                {(() => {
                  const violation = getRelatedViolation(selectedTicket.violationId);
                  if (violation) {
                    return (
                      <div className="border-t pt-4">
                        <label className="text-sm font-medium text-gray-500 mb-2 block">Related Violation</label>
                        <div className="bg-gray-50 p-3 rounded space-y-2">
                          <div className="flex justify-between">
                            <span className="text-xs text-gray-500">Type:</span>
                            <span className="text-xs text-gray-900">{violation.type}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-xs text-gray-500">Severity:</span>
                            <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(violation.severity)}`}>
                              {violation.severity}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-xs text-gray-500">Status:</span>
                            <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(violation.status)}`}>
                              {violation.status}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-xs text-gray-500">Project ID:</span>
                            <span className="text-xs text-gray-900">{violation.projectId}</span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                })()}
                
                <div className="border-t pt-4">
                  <button
                    onClick={() => {
                      console.log(`Opening ticket ${selectedTicket.id} in Zoho`);
                    }}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Open in Zoho</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
              <div className="text-gray-400 mb-4">
                <ExternalLink className="w-12 h-12 mx-auto" />
              </div>
              <p className="text-gray-500">Select a ticket to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ZohoTicketView;
