import React, { useState, useRef, useEffect } from 'react';
import { X, Send, MessageCircle, AlertTriangle, Calendar, User, FileText, ExternalLink } from 'lucide-react';
import { Violation } from '../types';

interface ChatMessage {
  id: string;
  sender: 'risk-team' | 'seller';
  message: string;
  timestamp: Date;
  senderName?: string;
}

interface ViolationDetailModalProps {
  violation: Violation | null;
  isOpen: boolean;
  onClose: () => void;
}

const ViolationDetailModal: React.FC<ViolationDetailModalProps> = ({ violation, isOpen, onClose }) => {
  const [newMessage, setNewMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  useEffect(() => {
    if (violation && isOpen) {
      // Load mock chat messages for this violation
      const mockMessages: ChatMessage[] = [
        {
          id: '1',
          sender: 'risk-team' as const,
          message: violation.messageToSeller || 'We have detected a violation in your account. Please review the details and respond accordingly.',
          timestamp: new Date(violation.createdAt.getTime() + 3600000), // 1 hour after violation
          senderName: 'Risk Team - Sarah Johnson'
        },
        ...(violation.status === 'disputed' ? [{
          id: '2',
          sender: 'seller' as const,
          message: 'I would like to dispute this violation. The circumstances were beyond my control and I have evidence to support my case.',
          timestamp: new Date(violation.createdAt.getTime() + 7200000), // 2 hours after violation
          senderName: `Seller ${violation.sellerId}`
        }] : [])
      ];
      setChatMessages(mockMessages);
    }
  }, [violation, isOpen]);

  const handleSendMessage = () => {
    if (newMessage.trim() && violation) {
      const message: ChatMessage = {
        id: Date.now().toString(),
        sender: 'risk-team',
        message: newMessage,
        timestamp: new Date(),
        senderName: 'Risk Team - Sarah Johnson'
      };
      setChatMessages([...chatMessages, message]);
      setNewMessage('');
    }
  };

  const getSeverityColor = (severity: Violation['severity']) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-blue-100 text-blue-800';
    }
  };

  const getStatusColor = (status: Violation['status']) => {
    switch (status) {
      case 'active': return 'bg-gray-100 text-gray-800';
      case 'disputed': return 'bg-purple-100 text-purple-800';
      case 'enforced': return 'bg-red-100 text-red-800';
      case 'exonerated': return 'bg-green-100 text-green-800';
    }
  };

  if (!isOpen || !violation) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
              <div>
                <h2 className="text-xl font-bold text-gray-900">Violation Details</h2>
                <p className="text-sm text-gray-600">{violation.id}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-3 h-full">
            {/* Violation Details */}
            <div className="lg:col-span-1 border-r border-gray-200 p-6 overflow-y-auto">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Violation Information</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Violation ID</label>
                  <p className="text-sm text-gray-900">{violation.id}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">Project ID</label>
                  <p className="text-sm text-gray-900">{violation.projectId}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">Seller ID</label>
                  <p className="text-sm text-gray-900">{violation.sellerId}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">Type</label>
                  <p className="text-sm text-gray-900">{violation.type}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">Severity</label>
                  <div className="mt-1">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${getSeverityColor(violation.severity)}`}>
                      {violation.severity.toUpperCase()}
                    </span>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <div className="mt-1">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(violation.status)}`}>
                      {violation.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">Created Date</label>
                  <p className="text-sm text-gray-900">
                    {violation.createdAt.toLocaleDateString()} {violation.createdAt.toLocaleTimeString()}
                  </p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">Description</label>
                  <p className="text-sm text-gray-900 mt-1">{violation.description}</p>
                </div>
                
                {violation.zohoTicketId && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Zoho Ticket</label>
                    <button className="flex items-center space-x-1 text-sm text-green-600 hover:text-green-800 mt-1">
                      <span>{violation.zohoTicketId}</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                )}
                
                {violation.attachments && violation.attachments.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Attachments</label>
                    <div className="mt-1 space-y-1">
                      {violation.attachments.map((attachment, index) => (
                        <div key={index} className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-800">
                          <FileText className="w-4 h-4" />
                          <span>{attachment}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Chat Section */}
            <div className="lg:col-span-2 flex flex-col">
              <div className="border-b border-gray-200 p-4">
                <div className="flex items-center space-x-2">
                  <MessageCircle className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Communication</h3>
                  <span className="text-sm text-gray-500">with Seller {violation.sellerId}</span>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {chatMessages.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>No messages yet</p>
                    <p className="text-sm">Start a conversation with the seller</p>
                  </div>
                ) : (
                  chatMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'risk-team' ? 'justify-start' : 'justify-end'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                          message.sender === 'risk-team'
                            ? 'bg-blue-100 text-blue-900'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <div className="flex items-center space-x-2 mb-1">
                          <User className="w-4 h-4" />
                          <span className="text-xs font-medium">
                            {message.senderName || (message.sender === 'risk-team' ? 'Risk Team' : 'Seller')}
                          </span>
                        </div>
                        <p className="text-sm">{message.message}</p>
                        <div className="flex items-center space-x-1 mt-1">
                          <Calendar className="w-3 h-3" />
                          <span className="text-xs opacity-70">
                            {message.timestamp.toLocaleDateString()} {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="border-t border-gray-200 p-4">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type your message to the seller..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send</span>
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Messages will be sent to the seller and logged in the system
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViolationDetailModal;
