import React, { useState, useMemo } from 'react';
import { Search, Plus, Filter, AlertCircle, ExternalLink, FileText, Upload, Eye, Check, X } from 'lucide-react';
import { mockViolations, mockDisputes, mockMessageTemplates } from '../mockData';
import { Violation, MessageTemplate } from '../types';
import ViolationDetailModal from './ViolationDetailModal';

interface ViolationLedgerProps {
  onNavigate?: (tab: string, state?: any) => void;
  navigationState?: any;
}

const ViolationLedger: React.FC<ViolationLedgerProps> = ({ navigationState }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeDisputesOnly, setActiveDisputesOnly] = useState(false);
  const [selectedViolation, setSelectedViolation] = useState<Violation | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Handle navigation state from Dashboard
  React.useEffect(() => {
    if (navigationState) {
      if (navigationState.showAddForm) {
        setShowAddForm(true);
      }
      if (navigationState.activeDisputesOnly) {
        setActiveDisputesOnly(true);
      }
    }
  }, [navigationState]);

  // Form state for adding violations
  const [newViolation, setNewViolation] = useState({
    partnerID: '',
    countryCode: '',
    mpCode: 'noon',
    idViolation: '',
    violationDate: '',
    idPenalty: '',
    family: '',
    brandCode: '',
    overallRisk: '',
    requestSource: '',
    triggeredByFlag: false,
    investigationType: '',
    investigationStatus: '',
    skuAsn: '',
    complaintTicket: '',
    currentSellerRating: '',
    brandName: '',
    actionOnOffers: '',
    disapprovalReason: '',
    investigatedAcquitted: false,
    actionedReason: '',
    actionCode: '',
    warningCount: '',
    approver2: '',
    channel: '',
    misc: ''
  });

  // Template state
  const [selectedTemplate, setSelectedTemplate] = useState<MessageTemplate | null>(null);

  // Bulk upload state
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [bulkData, setBulkData] = useState<any[]>([]);
  const [bulkTemplateStrategy, setBulkTemplateStrategy] = useState<'csv' | 'auto' | 'single'>('csv');
  const [selectedBulkTemplate, setSelectedBulkTemplate] = useState<MessageTemplate | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [currentPreviewIndex, setCurrentPreviewIndex] = useState(0);

  // Bulk violation interface
  interface BulkViolation {
    partnerID: string;
    countryCode: string;
    mpCode: string;
    idViolation: string;
    violationDate: string;
    idPenalty: string;
    family: string;
    brandCode: string;
    overallRisk: string;
    requestSource: string;
    triggeredByFlag: string;
    investigationType: string;
    investigationStatus: string;
    skuAsn: string;
    complaintTicket: string;
    currentSellerRating: string;
    brandName: string;
    actionOnOffers: string;
    disapprovalReason: string;
    investigatedAcquitted: string;
    actionedReason: string;
    actionCode: string;
    warningCount: string;
    approver2: string;
    channel: string;
    misc: string;
    // legacy fields kept for template message generation
    sellerId?: string;
    projectId?: string;
    templateId?: string;
    customMessage?: string;
    generatedMessage?: string;
    templateUsed?: MessageTemplate | null;
  }

  // Clear template selection
  const handleClearTemplate = () => {
    setSelectedTemplate(null);
  };

  // Bulk upload template functions
  const processBulkTemplates = (data: BulkViolation[]): BulkViolation[] => {
    return data.map((violation, index) => {
      let template: MessageTemplate | null = null;
      let generatedMessage = '';

      // Strategy 1: Use CSV templateId
      if (bulkTemplateStrategy === 'csv' && violation.templateId) {
        template = mockMessageTemplates.find(t => t.id === violation.templateId) || null;
      }
      // Strategy 2: Use single template for all
      else if (bulkTemplateStrategy === 'single' && selectedBulkTemplate) {
        template = selectedBulkTemplate;
      }
      // Strategy 3: Auto-assign by type and severity
      else if (bulkTemplateStrategy === 'auto') {
        template = mockMessageTemplates.find(t => 
          t.violationType === violation.idViolation && 
          t.severity === violation.overallRisk &&
          t.isActive
        ) || null;
      }

      // Generate message
      if (template) {
        generatedMessage = template.template
          .replace(/{sellerId}/g, violation.sellerId || '[Seller ID]')
          .replace(/{projectId}/g, violation.projectId || '[Project ID]')
          .replace(/{violationCount}/g, '1');
      } else if (violation.customMessage) {
        generatedMessage = violation.customMessage;
      }

      return {
        ...violation,
        templateUsed: template,
        generatedMessage: generatedMessage || 'No message generated'
      };
    });
  };

  const handleBulkUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const lines = text.split('\n').filter(line => line.trim());
        const headers = lines[0].split(',').map(h => h.trim());
        
        const data: BulkViolation[] = lines.slice(1).map((line, index) => {
          const values = line.split(',').map(v => v.trim());
          const violation: any = {};
          headers.forEach((header, i) => {
            violation[header] = values[i] || '';
          });
          
          return {
            partnerID: violation.partnerID || '',
            countryCode: violation.countryCode || '',
            mpCode: violation.mpCode || 'noon',
            idViolation: violation.idViolation || '',
            violationDate: violation.violationDate || '',
            idPenalty: violation.idPenalty || '',
            family: violation.family || '',
            brandCode: violation.brandCode || '',
            overallRisk: violation.overallRisk || '',
            requestSource: violation.requestSource || '',
            triggeredByFlag: violation.triggeredByFlag || '',
            investigationType: violation.investigationType || '',
            investigationStatus: violation.investigationStatus || '',
            skuAsn: violation.skuAsn || '',
            complaintTicket: violation.complaintTicket || '',
            currentSellerRating: violation.currentSellerRating || '',
            brandName: violation.brandName || '',
            actionOnOffers: violation.actionOnOffers || '',
            disapprovalReason: violation.disapprovalReason || '',
            investigatedAcquitted: violation.investigatedAcquitted || '',
            actionedReason: violation.actionedReason || '',
            actionCode: violation.actionCode || '',
            warningCount: violation.warningCount || '',
            approver2: violation.approver2 || '',
            channel: violation.channel || '',
            misc: violation.misc || '',
            sellerId: violation.partnerID || '',
            projectId: violation.idViolation || '',
            templateId: violation.templateId || undefined,
            customMessage: violation.customMessage || undefined
          };
        });

        setBulkData(data);
        setShowBulkUpload(true);
      };
      reader.readAsText(file);
    }
  };

  const handlePreviewMessages = () => {
    const processedData = processBulkTemplates(bulkData);
    setBulkData(processedData);
    setPreviewMode(true);
    setCurrentPreviewIndex(0);
  };

  const handleBulkSubmit = () => {
    console.log('Submitting bulk violations:', bulkData);
    // Reset bulk upload state
    setShowBulkUpload(false);
    setBulkData([]);
    setPreviewMode(false);
    setCurrentPreviewIndex(0);
    setSelectedBulkTemplate(null);
  };

  const getTemplateAssignmentStats = () => {
    const processed = processBulkTemplates(bulkData);
    const withTemplate = processed.filter(v => v.templateUsed).length;
    const withCustom = processed.filter(v => v.customMessage).length;
    const withoutMessage = processed.filter(v => !v.generatedMessage || v.generatedMessage === 'No message generated').length;
    
    return { total: processed.length, withTemplate, withCustom, withoutMessage };
  };

  const violationTypes = [
    'Late Delivery',
    'Product Mismatch',
    'Counterfeit Goods',
    'Poor Packaging',
    'Unresponsive Communication',
    'Fraudulent Activity',
    'Policy Violation',
    'Quality Issues',
    'Other'
  ];

  const filteredViolations = useMemo(() => {
    let filtered = [...mockViolations];
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(v => 
        v.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.sellerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.projectId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(v => v.status === filterStatus);
    }
    
    // Filter active disputes only
    if (activeDisputesOnly) {
      const disputedViolationIds = mockDisputes
        .filter(d => d.status === 'pending' || d.status === 'under_review')
        .map(d => d.violationId);
      filtered = filtered.filter(v => disputedViolationIds.includes(v.id));
    }
    
    return filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }, [searchTerm, filterStatus, activeDisputesOnly]);

  const handleAddViolation = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Adding violation:', newViolation);
    // Reset form and template state
    setNewViolation({
      partnerID: '',
      countryCode: '',
      mpCode: 'noon',
      idViolation: '',
      violationDate: '',
      idPenalty: '',
      family: '',
      brandCode: '',
      overallRisk: '',
      requestSource: '',
      triggeredByFlag: false,
      investigationType: '',
      investigationStatus: '',
      skuAsn: '',
      complaintTicket: '',
      currentSellerRating: '',
      brandName: '',
      actionOnOffers: '',
      disapprovalReason: '',
      investigatedAcquitted: false,
      actionedReason: '',
      actionCode: '',
      warningCount: '',
      approver2: '',
      channel: '',
      misc: ''
    });
    setSelectedTemplate(null);
    setShowAddForm(false);
  };

  const handleViolationClick = (violation: Violation) => {
    setSelectedViolation(violation);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedViolation(null);
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Violation Ledger</h1>
          <p className="text-gray-600 mt-1">Manage and track all seller violations</p>
        </div>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Violation</span>
        </button>
        
        <label className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2 cursor-pointer">
          <Upload className="w-4 h-4" />
          <span>Bulk Upload</span>
          <input
            type="file"
            accept=".csv"
            onChange={handleBulkUpload}
            className="hidden"
          />
        </label>
      </div>

      {/* Add Violation Form */}
      {showAddForm && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Add New Violation</h3>
            <button
              onClick={() => {
                setShowAddForm(false);
                setSelectedTemplate(null);
                setNewViolation({
                  partnerID: '', countryCode: '', mpCode: 'noon', idViolation: '',
                  violationDate: '', idPenalty: '', family: '', brandCode: '',
                  overallRisk: '', requestSource: '', triggeredByFlag: false,
                  investigationType: '', investigationStatus: '', skuAsn: '',
                  complaintTicket: '', currentSellerRating: '', brandName: '',
                  actionOnOffers: '', disapprovalReason: '', investigatedAcquitted: false,
                  actionedReason: '', actionCode: '', warningCount: '', approver2: '',
                  channel: '', misc: ''
                });
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <form onSubmit={handleAddViolation} noValidate className="space-y-6">

            {/* Section 1: Core Identifiers */}
            <div>
              <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Core Identifiers</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ID Partner <span className="text-red-500">*</span></label>
                  <input type="text" required value={newViolation.partnerID}
                    onChange={(e) => setNewViolation({...newViolation, partnerID: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Partner ID" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country Code <span className="text-red-500">*</span></label>
                  <select required value={newViolation.countryCode}
                    onChange={(e) => setNewViolation({...newViolation, countryCode: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Select country</option>
                    <option value="AE">AE - UAE</option>
                    <option value="SA">SA - Saudi Arabia</option>
                    <option value="EG">EG - Egypt</option>
                    <option value="KW">KW - Kuwait</option>
                    <option value="QA">QA - Qatar</option>
                    <option value="BH">BH - Bahrain</option>
                    <option value="OM">OM - Oman</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">MP Code <span className="text-red-500">*</span></label>
                  <input type="text" required value={newViolation.mpCode}
                    onChange={(e) => setNewViolation({...newViolation, mpCode: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                    placeholder="noon" />
                  <p className="text-xs text-gray-400 mt-1">Auto-filled</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ID Violation <span className="text-red-500">*</span></label>
                  <input type="text" required value={newViolation.idViolation}
                    onChange={(e) => setNewViolation({...newViolation, idViolation: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Violation code name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Violation Date <span className="text-red-500">*</span></label>
                  <input type="date" required value={newViolation.violationDate}
                    onChange={(e) => setNewViolation({...newViolation, violationDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ID Penalty <span className="text-red-500">*</span></label>
                  <input type="text" required value={newViolation.idPenalty}
                    onChange={(e) => setNewViolation({...newViolation, idPenalty: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Penalty ID" />
                </div>
              </div>
            </div>

            {/* Section 2: Classification */}
            <div>
              <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Classification</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Family <span className="text-red-500">*</span></label>
                  <input type="text" required value={newViolation.family}
                    onChange={(e) => setNewViolation({...newViolation, family: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Violation family" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Brand Code <span className="text-red-500">*</span></label>
                  <input type="text" required value={newViolation.brandCode}
                    onChange={(e) => setNewViolation({...newViolation, brandCode: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Brand code" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Brand Name</label>
                  <input type="text" value={newViolation.brandName}
                    onChange={(e) => setNewViolation({...newViolation, brandName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Brand name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Overall Risk <span className="text-red-500">*</span></label>
                  <select required value={newViolation.overallRisk}
                    onChange={(e) => setNewViolation({...newViolation, overallRisk: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Select risk</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Request Source <span className="text-red-500">*</span></label>
                  <input type="text" required value={newViolation.requestSource}
                    onChange={(e) => setNewViolation({...newViolation, requestSource: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Source of request" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Warning Count <span className="text-red-500">*</span></label>
                  <input type="number" required min="0" value={newViolation.warningCount}
                    onChange={(e) => setNewViolation({...newViolation, warningCount: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0" />
                </div>
              </div>
            </div>

            {/* Section 3: Investigation */}
            <div>
              <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Investigation</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Investigation Type</label>
                  <input type="text" value={newViolation.investigationType}
                    onChange={(e) => setNewViolation({...newViolation, investigationType: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Investigation type" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Investigation Status <span className="text-xs text-blue-600 font-normal">(Controls Template)</span></label>
                  <select value={newViolation.investigationStatus}
                    onChange={(e) => setNewViolation({...newViolation, investigationStatus: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Select status</option>
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
                <div className="flex items-center space-x-3 pt-6">
                  <input type="checkbox" id="triggeredByFlag" checked={newViolation.triggeredByFlag}
                    onChange={(e) => setNewViolation({...newViolation, triggeredByFlag: e.target.checked})}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded" />
                  <label htmlFor="triggeredByFlag" className="text-sm font-medium text-gray-700">Triggered by Flag</label>
                </div>
                <div className="flex items-center space-x-3 pt-6">
                  <input type="checkbox" id="investigatedAcquitted" checked={newViolation.investigatedAcquitted}
                    onChange={(e) => setNewViolation({...newViolation, investigatedAcquitted: e.target.checked})}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded" />
                  <label htmlFor="investigatedAcquitted" className="text-sm font-medium text-gray-700">Investigated and Acquitted</label>
                </div>
              </div>
            </div>

            {/* Section 4: SKU / Ticket */}
            <div>
              <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">SKU / Ticket</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">SKU / ASN <span className="text-red-500">*</span></label>
                  <input type="text" required value={newViolation.skuAsn}
                    onChange={(e) => setNewViolation({...newViolation, skuAsn: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="SKU or ASN" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Complaint Ticket <span className="text-red-500">*</span></label>
                  <input type="text" required value={newViolation.complaintTicket}
                    onChange={(e) => setNewViolation({...newViolation, complaintTicket: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ticket ID" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Seller Rating</label>
                  <input type="text" value={newViolation.currentSellerRating}
                    onChange={(e) => setNewViolation({...newViolation, currentSellerRating: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. 4.2" />
                </div>
              </div>
            </div>

            {/* Section 5: Actions */}
            <div>
              <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Actions</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Action Taken on Offers / SKUs</label>
                  <input type="text" value={newViolation.actionOnOffers}
                    onChange={(e) => setNewViolation({...newViolation, actionOnOffers: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe action taken" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Disapproval Reason</label>
                  <input type="text" value={newViolation.disapprovalReason}
                    onChange={(e) => setNewViolation({...newViolation, disapprovalReason: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Reason for disapproval" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Actioned Reason</label>
                  <input type="text" value={newViolation.actionedReason}
                    onChange={(e) => setNewViolation({...newViolation, actionedReason: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Reason for action" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Action Code</label>
                  <input type="text" value={newViolation.actionCode}
                    onChange={(e) => setNewViolation({...newViolation, actionCode: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Action code" />
                </div>
              </div>
            </div>

            {/* Section 6: Additional Info */}
            <div>
              <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Additional Info</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Approver 2</label>
                  <input type="text" value={newViolation.approver2}
                    onChange={(e) => setNewViolation({...newViolation, approver2: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Approver name or ID" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Channel</label>
                  <input type="text" value={newViolation.channel}
                    onChange={(e) => setNewViolation({...newViolation, channel: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Channel" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Misc</label>
                  <input type="text" value={newViolation.misc}
                    onChange={(e) => setNewViolation({...newViolation, misc: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Miscellaneous notes" />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setSelectedTemplate(null);
                  setNewViolation({
                    partnerID: '',
                    countryCode: '',
                    mpCode: 'noon',
                    idViolation: '',
                    violationDate: '',
                    idPenalty: '',
                    family: '',
                    brandCode: '',
                    overallRisk: '',
                    requestSource: '',
                    triggeredByFlag: false,
                    investigationType: '',
                    investigationStatus: '',
                    skuAsn: '',
                    complaintTicket: '',
                    currentSellerRating: '',
                    brandName: '',
                    actionOnOffers: '',
                    disapprovalReason: '',
                    investigatedAcquitted: false,
                    actionedReason: '',
                    actionCode: '',
                    warningCount: '',
                    approver2: '',
                    channel: '',
                    misc: ''
                  });
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add Violation
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters and Table - Hidden when add form is open */}
      {!showAddForm && (
        <>
          {/* Filters */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by violation ID, seller ID, project ID, or type..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex gap-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="disputed">Disputed</option>
              <option value="enforced">Enforced</option>
              <option value="exonerated">Exonerated</option>
            </select>
            
            <button
              onClick={() => setActiveDisputesOnly(!activeDisputesOnly)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeDisputesOnly
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Filter className="w-4 h-4 inline mr-2" />
              Active Disputes Only
            </button>
          </div>
        </div>
        
        <div className="mt-3 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {filteredViolations.length} violation{filteredViolations.length !== 1 ? 's' : ''} found
          </div>
          <button
            onClick={() => {
              setSearchTerm('');
              setFilterStatus('all');
              setActiveDisputesOnly(false);
            }}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Clear filters
          </button>
        </div>
      </div>

      {/* Violations Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Violation ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Project ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Seller ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Severity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredViolations.map((violation) => (
              <tr 
                key={violation.id} 
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => handleViolationClick(violation)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <AlertCircle className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm font-medium text-gray-900">{violation.id}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-900 font-mono">{violation.projectId}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button 
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center space-x-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span>{violation.sellerId}</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-900">{violation.type}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${getSeverityColor(violation.severity)}`}>
                    {violation.severity.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(violation.status)}`}>
                    {violation.status.replace('_', ' ').toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {violation.createdAt.toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button 
                    className="text-blue-600 hover:text-blue-900 mr-3"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViolationClick(violation);
                    }}
                  >
                    View Details
                  </button>
                  {violation.zohoTicketId && (
                    <button 
                      className="text-green-600 hover:text-green-900"
                      onClick={(e) => e.stopPropagation()}
                    >
                      View Ticket
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredViolations.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">No violations found matching your criteria</p>
        </div>
      )}

      {/* Bulk Upload Modal */}
      {showBulkUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Bulk Upload - Template Mapping</h2>
                <button
                  onClick={() => {
                    setShowBulkUpload(false);
                    setBulkData([]);
                    setPreviewMode(false);
                    setCurrentPreviewIndex(0);
                    setSelectedBulkTemplate(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {!previewMode ? (
                <div className="space-y-6">
                  {/* CSV Preview */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">📋 CSV Preview ({bulkData.length} violations)</h3>
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <div className="max-h-64 overflow-y-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Seller ID</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Project ID</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Severity</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Template ID</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {bulkData.slice(0, 10).map((violation, index) => (
                              <tr key={index} className="hover:bg-gray-50">
                                <td className="px-4 py-2 text-sm text-gray-900">{violation.sellerId}</td>
                                <td className="px-4 py-2 text-sm text-gray-900">{violation.projectId}</td>
                                <td className="px-4 py-2 text-sm text-gray-900">{violation.type}</td>
                                <td className="px-4 py-2 text-sm text-gray-900">{violation.severity}</td>
                                <td className="px-4 py-2 text-sm text-gray-900">{violation.templateId || '-'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      {bulkData.length > 10 && (
                        <div className="bg-gray-50 px-4 py-2 text-sm text-gray-600">
                          ... and {bulkData.length - 10} more rows
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Template Strategy Selection */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">🎯 Template Assignment Strategy</h3>
                    <div className="space-y-3">
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          value="csv"
                          checked={bulkTemplateStrategy === 'csv'}
                          onChange={(e) => setBulkTemplateStrategy(e.target.value as any)}
                          className="text-blue-600"
                        />
                        <div>
                          <span className="font-medium">Use CSV templateId column</span>
                          <p className="text-sm text-gray-600">Use template IDs specified in the CSV file</p>
                        </div>
                      </label>
                      
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          value="single"
                          checked={bulkTemplateStrategy === 'single'}
                          onChange={(e) => setBulkTemplateStrategy(e.target.value as any)}
                          className="text-blue-600"
                        />
                        <div>
                          <span className="font-medium">Apply single template to all</span>
                          <p className="text-sm text-gray-600">Use one template for all violations</p>
                        </div>
                      </label>
                      
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          value="auto"
                          checked={bulkTemplateStrategy === 'auto'}
                          onChange={(e) => setBulkTemplateStrategy(e.target.value as any)}
                          className="text-blue-600"
                        />
                        <div>
                          <span className="font-medium">Auto-assign by type & severity</span>
                          <p className="text-sm text-gray-600">Automatically match templates based on violation type and severity</p>
                        </div>
                      </label>
                    </div>

                    {bulkTemplateStrategy === 'single' && (
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Select Template</label>
                        <select
                          value={selectedBulkTemplate?.id || ''}
                          onChange={(e) => {
                            const template = mockMessageTemplates.find(t => t.id === e.target.value);
                            setSelectedBulkTemplate(template || null);
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select a template</option>
                          {mockMessageTemplates
                            .filter(template => template.isActive)
                            .map(template => (
                              <option key={template.id} value={template.id}>
                                {template.name} - {template.violationType} ({template.severity})
                              </option>
                            ))}
                        </select>
                      </div>
                    )}
                  </div>

                  {/* Template Assignment Stats */}
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">📊 Template Assignment Preview</h3>
                    <div className="grid grid-cols-4 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-blue-600">{getTemplateAssignmentStats().total}</div>
                        <div className="text-sm text-gray-600">Total Violations</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-600">{getTemplateAssignmentStats().withTemplate}</div>
                        <div className="text-sm text-gray-600">With Template</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-yellow-600">{getTemplateAssignmentStats().withCustom}</div>
                        <div className="text-sm text-gray-600">Custom Messages</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-red-600">{getTemplateAssignmentStats().withoutMessage}</div>
                        <div className="text-sm text-gray-600">No Message</div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => {
                        setShowBulkUpload(false);
                        setBulkData([]);
                        setPreviewMode(false);
                        setCurrentPreviewIndex(0);
                        setSelectedBulkTemplate(null);
                      }}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handlePreviewMessages}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Preview Messages</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Message Preview Mode */
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">📝 Message Preview</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <span className="text-sm text-gray-600">Violation {currentPreviewIndex + 1} of {bulkData.length}</span>
                          <h4 className="font-medium text-gray-900">
                            {bulkData[currentPreviewIndex]?.type} - {bulkData[currentPreviewIndex]?.severity}
                          </h4>
                          <p className="text-sm text-gray-600">
                            Seller: {bulkData[currentPreviewIndex]?.sellerId} | Project: {bulkData[currentPreviewIndex]?.projectId}
                          </p>
                        </div>
                        {bulkData[currentPreviewIndex]?.templateUsed && (
                          <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                            {bulkData[currentPreviewIndex]?.templateUsed?.name}
                          </div>
                        )}
                      </div>
                      
                      <div className="bg-white rounded border border-gray-200 p-4">
                        <div className="whitespace-pre-wrap text-gray-900">
                          {bulkData[currentPreviewIndex]?.generatedMessage}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Preview Navigation */}
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => setCurrentPreviewIndex(Math.max(0, currentPreviewIndex - 1))}
                      disabled={currentPreviewIndex === 0}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
                    >
                      ← Previous
                    </button>
                    
                    <div className="text-sm text-gray-600">
                      {currentPreviewIndex + 1} / {bulkData.length}
                    </div>
                    
                    <button
                      onClick={() => setCurrentPreviewIndex(Math.min(bulkData.length - 1, currentPreviewIndex + 1))}
                      disabled={currentPreviewIndex === bulkData.length - 1}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
                    >
                      Next →
                    </button>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setPreviewMode(false)}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                      Back to Mapping
                    </button>
                    <button
                      onClick={handleBulkSubmit}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
                    >
                      <Check className="w-4 h-4" />
                      <span>Submit Bulk Upload</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Violation Detail Modal */}
      <ViolationDetailModal
        violation={selectedViolation}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
        </>
      )}
    </div>
  );
};

export default ViolationLedger;
