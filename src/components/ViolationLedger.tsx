import React, { useState, useMemo } from 'react';
import { Search, Plus, Filter, AlertCircle, ExternalLink, FileText, Upload, Eye, Check, X } from 'lucide-react';
import { mockViolations, mockDisputes, mockMessageTemplates, mockSellers } from '../mockData';
import { VIOLATION_CODES, COUNTRY_LABELS } from '../violationSchemas';
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
    misc: '',
    messageToSeller: ''
  });

  // Wizard state
  const [wizardStep, setWizardStep] = useState(1);
  const [verdict, setVerdict] = useState<{ type: 'actioned' | 'acquitted' | ''; reason: string }>({ type: '', reason: '' });
  const [showVerdictPanel, setShowVerdictPanel] = useState(false);
  const [privateNotes, setPrivateNotes] = useState('');
  const [violationStatus, setViolationStatus] = useState('open');

  // Derived wizard state
  const sellerInfo = mockSellers[newViolation.partnerID] || null;
  const availableCountries = sellerInfo
    ? sellerInfo.countries
    : ['AE', 'SA', 'EG', 'KW', 'QA', 'BH', 'OM'];
  const selectedViolationMeta = VIOLATION_CODES.find(v => v.code === newViolation.idViolation) || null;
  const step2SpecificFields = selectedViolationMeta?.step2Fields ?? [];

  const EMPTY_FORM = {
    partnerID: '', countryCode: '', mpCode: 'noon', idViolation: '',
    violationDate: '', idPenalty: '', family: '', brandCode: '',
    overallRisk: '', requestSource: '', triggeredByFlag: false,
    investigationType: '', investigationStatus: '', skuAsn: '',
    complaintTicket: '', currentSellerRating: '', brandName: '',
    actionOnOffers: '', disapprovalReason: '', investigatedAcquitted: false,
    actionedReason: '', actionCode: '', warningCount: '', approver2: '',
    channel: '', misc: '', messageToSeller: '',
  };

  const handleFormClose = () => {
    setShowAddForm(false);
    setSelectedTemplate(null);
    setWizardStep(1);
    setShowVerdictPanel(false);
    setVerdict({ type: '', reason: '' });
    setPrivateNotes('');
    setViolationStatus('open');
    setNewViolation(EMPTY_FORM);
  };

  const isStep1Valid = () =>
    newViolation.partnerID.trim() !== '' &&
    newViolation.countryCode !== '' &&
    newViolation.idViolation !== '' &&
    newViolation.requestSource.trim() !== '' &&
    newViolation.violationDate !== '';

  const isStep2Valid = () =>
    step2SpecificFields
      .filter(f => f.required && f.type !== 'checkbox')
      .every(f => (newViolation[f.field as keyof typeof newViolation] as string) !== '');

  const healthColor = (h: string) => ({ Good: 'text-green-700 bg-green-100', Fair: 'text-yellow-700 bg-yellow-100', Poor: 'text-orange-700 bg-orange-100', Critical: 'text-red-700 bg-red-100' }[h] ?? 'text-gray-700 bg-gray-100');
  const ic = 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm';

  // Template state
  const [selectedTemplate, setSelectedTemplate] = useState<MessageTemplate | null>(null);

  // Replace placeholders in a template string with form values
  const replaceTemplatePlaceholders = (template: string, data: typeof newViolation): string => {
    return template
      .replace(/{sellerId}/g, data.partnerID || '[Partner ID]')
      .replace(/{projectId}/g, data.idViolation || '[Violation ID]')
      .replace(/{violationCount}/g, data.warningCount || '1')
      .replace(/{brandName}/g, data.brandName || '[Brand Name]')
      .replace(/{skuAsn}/g, data.skuAsn || '[SKU/ASN]');
  };

  // When a template is selected, auto-fill investigationStatus and messageToSeller
  const handleTemplateSelect = (template: MessageTemplate) => {
    setSelectedTemplate(template);
    setNewViolation(prev => ({
      ...prev,
      messageToSeller: replaceTemplatePlaceholders(template.template, prev)
    }));
  };

  // Re-run placeholder replacement when relevant fields change
  const handleFormFieldChange = (field: keyof typeof newViolation, value: string) => {
    const updated = { ...newViolation, [field]: value };
    if (selectedTemplate) {
      updated.messageToSeller = replaceTemplatePlaceholders(selectedTemplate.template, updated);
    }
    setNewViolation(updated);
  };

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

  const handleAddViolation = () => {
    console.log('Submitting violation:', { ...newViolation, privateNotes, violationStatus, verdict: showVerdictPanel ? verdict : null });
    handleFormClose();
  };

  const handleSubmitVerdict = () => {
    console.log('Submitting verdict:', verdict, 'for violation:', newViolation.partnerID);
    handleFormClose();
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

      {/* New Violation Wizard */}
      {showAddForm && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-6 overflow-hidden">
          {/* Wizard header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50">
            <div className="flex items-center gap-8">
              {(['Universal Info', 'Violation Details', 'Resolution'] as const).map((label, idx) => (
                <React.Fragment key={idx}>
                  <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold
                      ${wizardStep > idx + 1 ? 'bg-green-500 text-white' : wizardStep === idx + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                      {wizardStep > idx + 1 ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                    </div>
                    <span className={`text-sm font-medium ${wizardStep === idx + 1 ? 'text-blue-600' : wizardStep > idx + 1 ? 'text-green-600' : 'text-gray-400'}`}>{label}</span>
                  </div>
                  {idx < 2 && <div className={`w-12 h-px ${wizardStep > idx + 1 ? 'bg-green-400' : 'bg-gray-300'}`} />}
                </React.Fragment>
              ))}
            </div>
            <button onClick={handleFormClose} className="text-gray-400 hover:text-gray-700 p-1 rounded"><X className="w-5 h-5" /></button>
          </div>

          <div className="p-6">

            {/* ── STEP 1: Universal Info ── */}
            {wizardStep === 1 && (
              <div className="max-w-xl mx-auto space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Seller ID <span className="text-red-500">*</span></label>
                    <input type="text" autoFocus value={newViolation.partnerID}
                      onChange={(e) => handleFormFieldChange('partnerID', e.target.value)}
                      className={ic} placeholder="e.g. 442777" />
                    {sellerInfo && (
                      <div className="mt-1.5 flex items-center gap-1.5 text-xs text-green-700 bg-green-50 px-2.5 py-1.5 rounded-lg">
                        <Check className="w-3 h-3 flex-shrink-0" /><span className="font-semibold">{sellerInfo.name}</span>
                      </div>
                    )}
                    {newViolation.partnerID && !sellerInfo && (
                      <p className="mt-1 text-xs text-amber-600">Unknown ID — all countries available.</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country <span className="text-red-500">*</span></label>
                    <select value={newViolation.countryCode}
                      onChange={(e) => setNewViolation({ ...newViolation, countryCode: e.target.value })}
                      disabled={!newViolation.partnerID}
                      className={`${ic} disabled:bg-gray-50 disabled:text-gray-400`}>
                      <option value="">{newViolation.partnerID ? 'Select country' : 'Enter Seller ID first'}</option>
                      {availableCountries.map(cc => (
                        <option key={cc} value={cc}>{cc} — {COUNTRY_LABELS[cc]}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Violation Code Name <span className="text-red-500">*</span></label>
                  <select value={newViolation.idViolation}
                    onChange={(e) => {
                      const meta = VIOLATION_CODES.find(v => v.code === e.target.value);
                      setNewViolation({ ...newViolation, idViolation: e.target.value, family: meta?.family || '' });
                    }}
                    className={ic}>
                    <option value="">Select violation type</option>
                    {VIOLATION_CODES.map(v => <option key={v.code} value={v.code}>{v.label}</option>)}
                  </select>
                  {selectedViolationMeta && (
                    <p className="mt-1 text-xs text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg">
                      {selectedViolationMeta.description} · <span className="font-medium">{selectedViolationMeta.family}</span>
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Source of Request <span className="text-red-500">*</span></label>
                    <input type="text" value={newViolation.requestSource}
                      onChange={(e) => setNewViolation({ ...newViolation, requestSource: e.target.value })}
                      className={ic} placeholder="e.g. Brand Report, Customer Complaint" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date of Violation <span className="text-red-500">*</span></label>
                    <input type="date" value={newViolation.violationDate}
                      onChange={(e) => setNewViolation({ ...newViolation, violationDate: e.target.value })}
                      className={ic} />
                  </div>
                </div>
              </div>
            )}

            {/* ── STEP 2: Violation Details + Seller Panel ── */}
            {wizardStep === 2 && (
              <div className="flex gap-6 items-start">
                <div className="flex-1 min-w-0 space-y-5">
                  {step2SpecificFields.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                        Specific to {selectedViolationMeta?.label}
                      </p>
                      <div className="grid grid-cols-2 gap-4">
                        {step2SpecificFields.map(f => {
                          const val = newViolation[f.field as keyof typeof newViolation];
                          if (f.type === 'checkbox') return (
                            <div key={f.field} className="flex items-center gap-2 pt-5">
                              <input type="checkbox" id={`f-${f.field}`}
                                checked={val as boolean}
                                onChange={(e) => setNewViolation({ ...newViolation, [f.field]: e.target.checked })}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded" />
                              <label htmlFor={`f-${f.field}`} className="text-sm font-medium text-gray-700">{f.label}</label>
                            </div>
                          );
                          if (f.type === 'select') return (
                            <div key={f.field}>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                {f.label}{f.required && <span className="text-red-500 ml-1">*</span>}
                              </label>
                              <select value={val as string}
                                onChange={(e) => setNewViolation({ ...newViolation, [f.field]: e.target.value })}
                                className={ic}>
                                <option value="">Select…</option>
                                {f.selectOptions?.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                              </select>
                            </div>
                          );
                          return (
                            <div key={f.field}>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                {f.label}{f.required && <span className="text-red-500 ml-1">*</span>}
                              </label>
                              <input type="text" value={val as string}
                                onChange={(e) => setNewViolation({ ...newViolation, [f.field]: e.target.value })}
                                className={ic} placeholder={f.label} />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Seller side panel */}
                <div className="w-64 flex-shrink-0 bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3 text-sm">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Seller Profile</p>
                  {sellerInfo ? (
                    <>
                      <div>
                        <p className="font-semibold text-gray-900">{sellerInfo.name}</p>
                        <p className="text-gray-500 text-xs mt-0.5">ID: {newViolation.partnerID}</p>
                      </div>
                      <div className="space-y-1 text-gray-600 text-xs">
                        <p>{sellerInfo.email}</p>
                        <p>{sellerInfo.phone}</p>
                        <p>Markets: {sellerInfo.countries.join(', ')}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">Account Health</span>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${healthColor(sellerInfo.accountHealth)}`}>{sellerInfo.accountHealth}</span>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-500">Risk Score</span>
                          <span className="text-xs font-bold text-gray-700">{sellerInfo.riskScore}/100</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div className={`h-1.5 rounded-full ${sellerInfo.riskScore >= 75 ? 'bg-red-500' : sellerInfo.riskScore >= 50 ? 'bg-orange-400' : sellerInfo.riskScore >= 25 ? 'bg-yellow-400' : 'bg-green-400'}`}
                            style={{ width: `${sellerInfo.riskScore}%` }} />
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">Seller Rating</span>
                        <span className="text-xs font-bold text-gray-700">★ {sellerInfo.sellerRating.toFixed(1)}</span>
                      </div>
                      <div className="pt-2 border-t border-gray-200">
                        <p className="text-xs text-gray-500">Prior Violations: <span className="font-semibold text-gray-700">{sellerInfo.priorViolations}</span></p>
                        {sellerInfo.lastViolation ? (
                          <p className="text-xs text-gray-500 mt-1">Last: <span className="font-medium text-gray-700">{sellerInfo.lastViolation.label}</span> <span className="text-gray-400">({sellerInfo.lastViolation.date})</span></p>
                        ) : (
                          <p className="text-xs text-green-600 mt-1">No prior violations</p>
                        )}
                      </div>
                    </>
                  ) : (
                    <p className="text-xs text-gray-400 text-center py-6">Enter a known Seller ID in Step 1 to see profile data.</p>
                  )}
                </div>
              </div>
            )}

            {/* ── STEP 3: Resolution + Summary Panel ── */}
            {wizardStep === 3 && (
              <div className="flex gap-6 items-start">
                <div className="flex-1 min-w-0 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Action Code</label>
                      <input type="text" value={newViolation.actionCode}
                        onChange={(e) => setNewViolation({ ...newViolation, actionCode: e.target.value })}
                        className={ic} placeholder="e.g. SUSPEND, WARN, RESTRICT" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Violation Status</label>
                      <select value={violationStatus} onChange={(e) => setViolationStatus(e.target.value)} className={ic}>
                        <option value="open">Open</option>
                        <option value="under_review">Under Review</option>
                        <option value="actioned">Actioned</option>
                        <option value="acquitted">Acquitted</option>
                        <option value="closed">Closed</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Ticket Owner</label>
                      <input type="text" readOnly value="Current User (Auto-assigned)"
                        className={`${ic} bg-gray-50 text-gray-500`} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Warning Count</label>
                      <input type="number" min="0" value={newViolation.warningCount}
                        onChange={(e) => handleFormFieldChange('warningCount', e.target.value)}
                        className={ic} placeholder="0" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Private Notes</label>
                    <textarea value={privateNotes} onChange={(e) => setPrivateNotes(e.target.value)}
                      className={ic} rows={2} placeholder="Internal notes — not visible to seller" />
                  </div>
                  <div className="bg-blue-50 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                        <FileText className="w-4 h-4" />Message Template
                      </label>
                      {selectedTemplate && (
                        <button type="button" onClick={() => { setSelectedTemplate(null); setNewViolation({ ...newViolation, messageToSeller: '' }); }}
                          className="text-xs text-gray-400 hover:text-gray-700">Clear</button>
                      )}
                    </div>
                    <select value={selectedTemplate?.id || ''}
                      onChange={(e) => {
                        const t = mockMessageTemplates.find(t => t.id === e.target.value);
                        if (t) handleTemplateSelect(t);
                        else { setSelectedTemplate(null); setNewViolation({ ...newViolation, messageToSeller: '' }); }
                      }}
                      className={ic}>
                      <option value="">Select a template (optional)</option>
                      {mockMessageTemplates.filter(t => t.isActive).map(t => (
                        <option key={t.id} value={t.id}>{t.name} — {t.violationType} ({t.severity})</option>
                      ))}
                    </select>
                    {selectedTemplate && <p className="text-xs text-gray-500">{selectedTemplate.description}</p>}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Message to Seller{selectedTemplate && <span className="text-xs text-blue-600 ml-2">(from template)</span>}
                      </label>
                      <textarea value={newViolation.messageToSeller}
                        onChange={(e) => setNewViolation({ ...newViolation, messageToSeller: e.target.value })}
                        className={ic} rows={4} placeholder="Message to be sent to the seller" />
                    </div>
                  </div>
                  {/* Verdict panel */}
                  {showVerdictPanel && (
                    <div className="border border-orange-200 bg-orange-50 rounded-xl p-4 space-y-3">
                      <p className="text-sm font-semibold text-orange-800">Verdict — closes the violation ticket</p>
                      <div className="flex gap-3">
                        {(['actioned', 'acquitted'] as const).map(type => (
                          <button key={type} type="button"
                            onClick={() => setVerdict(v => ({ ...v, type }))}
                            className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors
                              ${verdict.type === type
                                ? type === 'actioned' ? 'bg-red-600 text-white border-red-600' : 'bg-green-600 text-white border-green-600'
                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}>
                            {type === 'actioned' ? 'Actioned' : 'Acquitted'}
                          </button>
                        ))}
                      </div>
                      {verdict.type && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {verdict.type === 'actioned' ? 'Action Reason' : 'Acquittal Reason'} <span className="text-red-500">*</span>
                          </label>
                          <textarea value={verdict.reason}
                            onChange={(e) => setVerdict(v => ({ ...v, reason: e.target.value }))}
                            className={ic} rows={2}
                            placeholder={verdict.type === 'actioned' ? 'Why was this violation actioned?' : 'Why is the seller acquitted?'} />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Violation summary side panel */}
                <div className="w-64 flex-shrink-0 bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3 text-sm">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Violation Summary</p>
                  <div className="space-y-2">
                    <div className="flex justify-between gap-2">
                      <span className="text-gray-500 text-xs flex-shrink-0">Seller</span>
                      <span className="text-gray-800 text-xs font-medium text-right">{sellerInfo?.name || newViolation.partnerID}</span>
                    </div>
                    <div className="flex justify-between gap-2">
                      <span className="text-gray-500 text-xs flex-shrink-0">Country</span>
                      <span className="text-gray-800 text-xs font-medium">{newViolation.countryCode} — {COUNTRY_LABELS[newViolation.countryCode]}</span>
                    </div>
                    <div className="flex justify-between gap-2">
                      <span className="text-gray-500 text-xs flex-shrink-0">Violation</span>
                      <span className="text-gray-800 text-xs font-medium text-right">{selectedViolationMeta?.label || newViolation.idViolation}</span>
                    </div>
                    <div className="flex justify-between gap-2">
                      <span className="text-gray-500 text-xs flex-shrink-0">Family</span>
                      <span className="text-gray-800 text-xs font-medium">{selectedViolationMeta?.family}</span>
                    </div>
                    <div className="flex justify-between gap-2">
                      <span className="text-gray-500 text-xs flex-shrink-0">Date</span>
                      <span className="text-gray-800 text-xs font-medium">{newViolation.violationDate}</span>
                    </div>
                    <div className="flex justify-between gap-2">
                      <span className="text-gray-500 text-xs flex-shrink-0">Source</span>
                      <span className="text-gray-800 text-xs font-medium text-right">{newViolation.requestSource}</span>
                    </div>
                  </div>
                  {step2SpecificFields.length > 0 && (
                    <div className="pt-2 border-t border-gray-200 space-y-2">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{selectedViolationMeta?.label} — Specific</p>
                      {step2SpecificFields.map(f => {
                        const val = newViolation[f.field as keyof typeof newViolation];
                        const display = typeof val === 'boolean' ? (val ? 'Yes' : 'No') : (val as string) || '—';
                        return (
                          <div key={f.field} className="flex justify-between gap-2">
                            <span className="text-gray-500 text-xs flex-shrink-0">{f.label}</span>
                            <span className="text-gray-800 text-xs font-medium text-right">{display}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  <div className="pt-2 border-t border-gray-200 space-y-2">
                    <div className="flex justify-between gap-2">
                      <span className="text-gray-500 text-xs flex-shrink-0">Risk</span>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${newViolation.overallRisk === 'critical' ? 'bg-red-100 text-red-700' : newViolation.overallRisk === 'high' ? 'bg-orange-100 text-orange-700' : newViolation.overallRisk === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                        {newViolation.overallRisk || '—'}
                      </span>
                    </div>
                    {newViolation.complaintTicket && (
                      <div className="flex justify-between gap-2">
                        <span className="text-gray-500 text-xs flex-shrink-0">Ticket</span>
                        <span className="text-gray-800 text-xs font-medium">{newViolation.complaintTicket}</span>
                      </div>
                    )}
                    {sellerInfo && (
                      <>
                        <div className="flex justify-between gap-2">
                          <span className="text-gray-500 text-xs flex-shrink-0">Rating</span>
                          <span className="text-gray-800 text-xs font-medium">★ {sellerInfo.sellerRating.toFixed(1)}</span>
                        </div>
                        <div className="flex justify-between gap-2">
                          <span className="text-gray-500 text-xs flex-shrink-0">Prior</span>
                          <span className={`text-xs font-bold ${sellerInfo.priorViolations > 5 ? 'text-red-600' : sellerInfo.priorViolations > 0 ? 'text-orange-600' : 'text-green-600'}`}>{sellerInfo.priorViolations} violations</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Footer navigation */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50">
            <button type="button"
              onClick={wizardStep === 1 ? handleFormClose : () => setWizardStep(s => s - 1)}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100">
              {wizardStep === 1 ? 'Cancel' : '← Back'}
            </button>
            <div className="flex items-center gap-2">
              {wizardStep < 3 && (
                <button type="button"
                  onClick={() => setWizardStep(s => s + 1)}
                  disabled={wizardStep === 1 ? !isStep1Valid() : !isStep2Valid()}
                  className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-sm">
                  Continue →
                </button>
              )}
              {wizardStep === 3 && (
                <>
                  <button type="button"
                    onClick={() => { setShowVerdictPanel(!showVerdictPanel); if (showVerdictPanel) setVerdict({ type: '', reason: '' }); }}
                    className={`px-4 py-2 text-sm rounded-lg border transition-colors ${showVerdictPanel ? 'border-orange-400 text-orange-700 bg-orange-50 hover:bg-orange-100' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}>
                    {showVerdictPanel ? '✕ Cancel Verdict' : 'Add Verdict'}
                  </button>
                  {!showVerdictPanel && (
                    <button type="button" onClick={handleAddViolation}
                      className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">
                      Submit Violation
                    </button>
                  )}
                  {showVerdictPanel && (
                    <button type="button" onClick={handleSubmitVerdict}
                      disabled={!verdict.type || !verdict.reason.trim()}
                      className="px-5 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-40 disabled:cursor-not-allowed text-sm">
                      Submit Verdict & Close Ticket
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
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
