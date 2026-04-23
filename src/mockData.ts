import { Violation, Dispute, ZohoTicket, MessageTemplate, TemplatePlaceholder } from './types';

export const mockViolations: Violation[] = [
  {
    id: 'V-001',
    sellerId: '442777',
    projectId: 'PRJ-2024-001',
    type: 'Late Delivery',
    severity: 'medium',
    description: 'Multiple orders delivered beyond the promised delivery date',
    messageToSeller: 'We have received multiple complaints regarding late deliveries. Please improve your shipping timeline or provide valid reasons for delays.',
    createdAt: new Date('2024-03-03T10:30:00'),
    status: 'disputed',
    evidence: ['tracking_001.pdf', 'customer_complaints.pdf'],
    attachments: ['delivery_proof.pdf', 'customer_emails.pdf'],
    zohoTicketId: 'ZT-1001'
  },
  {
    id: 'V-002',
    sellerId: '10555',
    projectId: 'PRJ-2024-002',
    type: 'Product Mismatch',
    severity: 'high',
    description: 'Delivered product does not match listing description',
    messageToSeller: 'Customers have reported receiving products that differ significantly from your listing descriptions. Please ensure accurate product representation.',
    createdAt: new Date('2024-03-02T14:20:00'),
    status: 'active',
    evidence: ['product_images.jpg', 'listing_screenshot.png'],
    attachments: ['comparison_photos.jpg'],
    zohoTicketId: 'ZT-1002'
  },
  {
    id: 'V-003',
    sellerId: '492959',
    projectId: 'PRJ-2024-003',
    type: 'Counterfeit Goods',
    severity: 'critical',
    description: 'Suspected counterfeit branded items',
    messageToSeller: 'URGENT: We have received reports of potential counterfeit goods. Please provide authentication certificates immediately.',
    createdAt: new Date('2024-03-01T09:15:00'),
    status: 'enforced',
    evidence: ['authentication_report.pdf', 'brand_complaint.pdf'],
    attachments: ['brand_letter.pdf', 'fake_products.jpg'],
    zohoTicketId: 'ZT-1003'
  },
  {
    id: 'V-004',
    sellerId: '442777',
    projectId: 'PRJ-2024-004',
    type: 'Poor Packaging',
    severity: 'low',
    description: 'Items arrived damaged due to inadequate packaging',
    messageToSeller: 'Several items have arrived damaged due to insufficient packaging. Please review and improve your packaging standards.',
    createdAt: new Date('2024-02-28T16:45:00'),
    status: 'active',
    evidence: ['damage_photos.jpg'],
    attachments: ['packaging_guidelines.pdf'],
    zohoTicketId: 'ZT-1004'
  },
  {
    id: 'V-005',
    sellerId: '10555',
    projectId: 'PRJ-2024-005',
    type: 'Unresponsive Communication',
    severity: 'medium',
    description: 'Seller not responding to customer inquiries within 24 hours',
    messageToSeller: 'Response times have exceeded our 24-hour requirement. Please ensure timely responses to maintain service standards.',
    createdAt: new Date('2024-02-27T11:30:00'),
    status: 'exonerated',
    evidence: ['message_logs.pdf'],
    attachments: ['response_time_report.pdf'],
    zohoTicketId: 'ZT-1005'
  },
];

export const mockDisputes: Dispute[] = [
  {
    id: 'D-001',
    violationId: 'V-001',
    sellerId: '442777',
    reason: 'The delays were caused by carrier issues beyond my control. I have proof of timely handover to the shipping company.',
    evidence: ['carrier_receipt.pdf', 'shipping_timeline.pdf', 'carrier_delay_notice.pdf'],
    submittedAt: new Date('2024-03-03T15:00:00'),
    status: 'pending',
  },
  {
    id: 'D-002',
    violationId: 'V-003',
    sellerId: '492959',
    reason: 'All products are authentic and sourced from authorized distributors. Attached are certificates of authenticity.',
    evidence: ['certificate_of_authenticity.pdf', 'distributor_invoice.pdf'],
    submittedAt: new Date('2024-03-01T12:00:00'),
    status: 'resolved',
    resolution: {
      action: 'enforced',
      reply: 'After reviewing the evidence and conducting independent verification, the products were confirmed to be counterfeit. The certificates provided were found to be fraudulent.',
      resolvedAt: new Date('2024-03-02T10:00:00'),
      resolvedBy: 'Risk Team - Sarah Johnson'
    }
  },
  {
    id: 'D-003',
    violationId: 'V-005',
    sellerId: '10555',
    reason: 'I was on medical leave during this period and had set up an auto-responder. All messages were addressed within 48 hours of my return.',
    evidence: ['medical_certificate.pdf', 'response_logs.pdf'],
    submittedAt: new Date('2024-02-28T09:00:00'),
    status: 'resolved',
    resolution: {
      action: 'exonerated',
      reply: 'Given the medical emergency and the fact that all customers were eventually responded to with satisfactory resolutions, we are exonerating this violation.',
      resolvedAt: new Date('2024-02-29T14:00:00'),
      resolvedBy: 'Risk Team - Michael Chen'
    }
  },
];

export const mockZohoTickets: ZohoTicket[] = [
  {
    id: 'ZT-1001',
    violationId: 'V-001',
    subject: 'Late Delivery Violation - Seller 442777',
    description: 'Multiple customer complaints regarding late deliveries. Seller needs to improve shipping timeline.',
    status: 'open',
    priority: 'medium',
    createdAt: new Date('2024-03-03T10:35:00'),
    updatedAt: new Date('2024-03-03T15:00:00'),
    assignedTo: 'Sarah Johnson',
    sellerId: '442777'
  },
  {
    id: 'ZT-1002',
    violationId: 'V-002',
    subject: 'Product Mismatch - Seller 10555',
    description: 'Customers receiving products that do not match listing descriptions.',
    status: 'open',
    priority: 'high',
    createdAt: new Date('2024-03-02T14:25:00'),
    updatedAt: new Date('2024-03-02T16:30:00'),
    assignedTo: 'Michael Chen',
    sellerId: '10555'
  },
  {
    id: 'ZT-1003',
    violationId: 'V-003',
    subject: 'URGENT: Counterfeit Goods Investigation - Seller 492959',
    description: 'Suspected counterfeit branded items reported by multiple customers.',
    status: 'resolved',
    priority: 'urgent',
    createdAt: new Date('2024-03-01T09:20:00'),
    updatedAt: new Date('2024-03-02T10:00:00'),
    assignedTo: 'Sarah Johnson',
    sellerId: '492959'
  },
  {
    id: 'ZT-1004',
    violationId: 'V-004',
    subject: 'Packaging Issues - Seller 442777',
    description: 'Items arriving damaged due to inadequate packaging.',
    status: 'open',
    priority: 'low',
    createdAt: new Date('2024-02-28T16:50:00'),
    updatedAt: new Date('2024-02-29T09:15:00'),
    assignedTo: 'Emily Davis',
    sellerId: '442777'
  },
  {
    id: 'ZT-1005',
    violationId: 'V-005',
    subject: 'Communication Response Time - Seller 10555',
    description: 'Seller not responding within 24-hour requirement.',
    status: 'closed',
    priority: 'medium',
    createdAt: new Date('2024-02-27T11:35:00'),
    updatedAt: new Date('2024-02-29T14:00:00'),
    assignedTo: 'Michael Chen',
    sellerId: '10555'
  },
];

// Mock message templates
export const mockMessageTemplates: MessageTemplate[] = [
  {
    id: 'template-1',
    name: 'Late Delivery Warning',
    description: 'Template for late delivery violations',
    violationType: 'DELIVERY',
    severity: 'medium',
    template: 'Dear Seller {sellerId},\n\nWe have detected a late delivery violation for project {projectId}. The order was scheduled for delivery on {scheduledDate} but was delivered on {actualDate}.\n\nThis violates our delivery timeline policy. Please ensure timely deliveries to maintain your seller rating.\n\nIf you believe this is an error, please contact our support team within 48 hours.\n\nRegards,\nTrust & Safety Team',
    isActive: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    createdBy: 'sarah.johnson@noon.com'
  },
  {
    id: 'template-2',
    name: 'Product Quality Issue',
    description: 'Template for product quality violations',
    violationType: 'QUALITY',
    severity: 'high',
    template: 'Dear Seller {sellerId},\n\nWe have received complaints regarding the quality of products from project {projectId}. Customers reported: {qualityIssues}.\n\nThis violates our quality standards policy. Please review your quality control processes immediately.\n\nYou have 7 days to respond with corrective actions.\n\nRegards,\nTrust & Safety Team',
    isActive: true,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-02-01'),
    createdBy: 'malak.ali@noon.com'
  },
  {
    id: 'template-3',
    name: 'Counterfeit Goods Alert',
    description: 'Template for suspected counterfeit items',
    violationType: 'PRODUCT',
    severity: 'critical',
    template: 'Dear Seller {sellerId},\n\nURGENT: We have detected potential counterfeit goods in project {projectId}. The following items are under investigation: {suspectedItems}.\n\nThis is a critical violation that may result in immediate account suspension.\n\nYou must respond within 24 hours with documentation proving product authenticity.\n\nRegards,\nTrust & Safety Team',
    isActive: true,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
    createdBy: 'cris.chen@noon.com'
  },
  {
    id: 'template-4',
    name: 'Poor Packaging Notice',
    description: 'Template for packaging-related violations',
    violationType: 'PACKAGING',
    severity: 'low',
    template: 'Dear Seller {sellerId},\n\nWe have identified packaging issues in project {projectId}. Items arrived damaged due to inadequate packaging.\n\nPlease improve your packaging standards to prevent future incidents.\n\nRegards,\nTrust & Safety Team',
    isActive: true,
    createdAt: new Date('2024-02-05'),
    updatedAt: new Date('2024-02-05'),
    createdBy: 'sarah.johnson@noon.com'
  },
  {
    id: 'template-5',
    name: 'Communication Violation',
    description: 'Template for unresponsive seller violations',
    violationType: 'COMMUNICATION',
    severity: 'medium',
    template: 'Dear Seller {sellerId},\n\nWe have recorded {communicationIssues} regarding your response time to customer inquiries for project {projectId}.\n\nPlease maintain response times within our service level agreements.\n\nRegards,\nTrust & Safety Team',
    isActive: true,
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-02-10'),
    createdBy: 'malak.ali@noon.com'
  }
];

// Template placeholders that can be used in templates
export const templatePlaceholders: TemplatePlaceholder[] = [
  {
    key: '{sellerId}',
    label: 'Seller ID',
    description: 'The unique identifier of the seller',
    example: 'SELLER-12345'
  },
  {
    key: '{projectId}',
    label: 'Project ID',
    description: 'The project identifier (PRJ-YYYY-XXX format)',
    example: 'PRJ-2024-001'
  },
  {
    key: '{scheduledDate}',
    label: 'Scheduled Date',
    description: 'The originally scheduled delivery date',
    example: '2024-03-15'
  },
  {
    key: '{actualDate}',
    label: 'Actual Date',
    description: 'The actual delivery or event date',
    example: '2024-03-17'
  },
  {
    key: '{qualityIssues}',
    label: 'Quality Issues',
    description: 'Description of quality problems reported',
    example: 'Items arrived damaged, poor packaging'
  },
  {
    key: '{suspectedItems}',
    label: 'Suspected Items',
    description: 'List of items suspected to be counterfeit',
    example: 'Brand X watches, Brand Y bags'
  },
  {
    key: '{communicationIssues}',
    label: 'Communication Issues',
    description: 'Details of communication problems',
    example: 'No response to customer inquiries for 48 hours'
  },
  {
    key: '{violationCount}',
    label: 'Violation Count',
    description: 'Number of violations for this seller',
    example: '3'
  },
  {
    key: '{deadline}',
    label: 'Response Deadline',
    description: 'Deadline for seller response',
    example: '2024-03-20'
  }
];
