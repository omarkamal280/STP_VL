import React, { useState } from 'react';
import { Plus, Upload, X, AlertCircle, Paperclip } from 'lucide-react';
import { BulkViolation } from '../types';

type Mode = 'single' | 'bulk';

const AddViolation: React.FC = () => {
  const [mode, setMode] = useState<Mode>('single');
  const [sellerId, setSellerId] = useState('');
  const [projectId, setProjectId] = useState('');
  const [violationType, setViolationType] = useState('');
  const [severity, setSeverity] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');
  const [description, setDescription] = useState('');
  const [messageToSeller, setMessageToSeller] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [bulkData, setBulkData] = useState<BulkViolation[]>([]);
  const [csvFile, setCsvFile] = useState<File | null>(null);

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

  const handleSingleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Single violation submitted:', { 
      sellerId, 
      projectId, 
      violationType, 
      severity, 
      description, 
      messageToSeller,
      attachments: attachments.map(f => f.name)
    });
    // Reset form
    setSellerId('');
    setProjectId('');
    setViolationType('');
    setSeverity('medium');
    setDescription('');
    setMessageToSeller('');
    setAttachments([]);
  };

  const handleBulkUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCsvFile(file);
      const mockBulkData: BulkViolation[] = [
        { sellerId: '442777', projectId: 'PRJ-2024-B001', type: 'Late Delivery', severity: 'medium', description: 'Multiple late deliveries' },
        { sellerId: '10555', projectId: 'PRJ-2024-B002', type: 'Product Mismatch', severity: 'high', description: 'Wrong items shipped' },
        { sellerId: '492959', projectId: 'PRJ-2024-B003', type: 'Poor Packaging', severity: 'low', description: 'Inadequate packaging' },
      ];
      setBulkData(mockBulkData);
    }
  };

  const removeBulkItem = (index: number) => {
    setBulkData(bulkData.filter((_, i) => i !== index));
  };

  const handleBulkSubmit = () => {
    console.log('Bulk violations submitted:', bulkData);
    setBulkData([]);
    setCsvFile(null);
  };

  return (
    <div>
      <div className="flex space-x-1 mb-6 bg-gray-50 p-1 rounded-lg inline-flex">
        <button
          onClick={() => setMode('single')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            mode === 'single'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Single Violation
        </button>
        <button
          onClick={() => setMode('bulk')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            mode === 'bulk'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Bulk Upload
        </button>
      </div>

      {mode === 'single' ? (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-6">Add Single Violation</h3>
          <form onSubmit={handleSingleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Seller ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={sellerId}
                  onChange={(e) => setSellerId(e.target.value)}
                  placeholder="Enter seller ID"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  PRJ ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  placeholder="Enter project ID (e.g., PRJ-2024-001)"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Violation Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={violationType}
                  onChange={(e) => setViolationType(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select type</option>
                  {violationTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Severity <span className="text-red-500">*</span>
                </label>
                <div className="flex space-x-4">
                  {(['low', 'medium', 'high', 'critical'] as const).map((level) => (
                    <label key={level} className="flex items-center">
                      <input
                        type="radio"
                        name="severity"
                        value={level}
                        checked={severity === level}
                        onChange={(e) => setSeverity(e.target.value as typeof severity)}
                        className="mr-2"
                      />
                      <span className="text-sm capitalize">{level}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>


            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide detailed description of the violation"
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message to Seller
              </label>
              <textarea
                value={messageToSeller}
                onChange={(e) => setMessageToSeller(e.target.value)}
                placeholder="Enter message that will be sent to the seller via Zoho"
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">This message will be automatically sent to the seller through the Zoho system</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Attachments
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <input
                  type="file"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    setAttachments([...attachments, ...files]);
                  }}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <Paperclip className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">Click to upload files</span>
                  <span className="text-xs text-gray-500">PDF, JPG, PNG up to 10MB</span>
                </label>
              </div>
              
              {attachments.length > 0 && (
                <div className="mt-3 space-y-2">
                  <p className="text-sm font-medium text-gray-700">Selected files:</p>
                  {attachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <span className="text-sm text-gray-700">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => setAttachments(attachments.filter((_, i) => i !== index))}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Violation</span>
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-6">Bulk Upload Violations</h3>
          
          <div className="mb-6">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-sm text-gray-600 mb-2">
                Upload CSV file with violation data
              </p>
              <p className="text-xs text-gray-500 mb-4">
                Required columns: seller_id, project_id, type, severity, description
              </p>
              <label className="inline-block">
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleBulkUpload}
                  className="hidden"
                />
                <span className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer inline-flex items-center space-x-2">
                  <Upload className="w-4 h-4" />
                  <span>Choose File</span>
                </span>
              </label>
              {csvFile && (
                <p className="text-sm text-gray-700 mt-3">
                  Selected: {csvFile.name}
                </p>
              )}
            </div>
          </div>

          {bulkData.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-gray-900">
                  Preview ({bulkData.length} violations)
                </h4>
                <button
                  onClick={() => {
                    setBulkData([]);
                    setCsvFile(null);
                  }}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Clear All
                </button>
              </div>

              <div className="border border-gray-200 rounded-lg overflow-hidden mb-6">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Seller ID</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">PRJ ID</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Severity</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {bulkData.map((item, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3 text-sm text-gray-900">{item.sellerId}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{item.projectId}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{item.type}</td>
                        <td className="px-4 py-3 text-sm">
                          <span className="capitalize">{item.severity}</span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{item.description}</td>
                        <td className="px-4 py-3 text-sm">
                          <button
                            onClick={() => removeBulkItem(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setBulkData([]);
                    setCsvFile(null);
                  }}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBulkSubmit}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Submit {bulkData.length} Violations</span>
                </button>
              </div>
            </div>
          )}

          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex">
              <AlertCircle className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">CSV Format Requirements:</p>
                <ul className="list-disc list-inside space-y-1 text-blue-700">
                  <li>First row must contain headers: seller_id, project_id, type, severity, description</li>
                  <li>Severity must be one of: low, medium, high, critical</li>
                  <li>All fields are required</li>
                  <li>Optional columns: message_to_seller</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddViolation;
