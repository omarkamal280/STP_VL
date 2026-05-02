import { Violation, Dispute, ZohoTicket, MessageTemplate, TemplatePlaceholder } from './types';

export const mockViolations: Violation[] = [
  {
    id: 'V-001',
    sellerId: '442777',
    projectId: 'PRJ-2024-001',
    type: 'IP Violation',
    severity: 'high',
    description: 'Nike brand complaint — listings suspected of using Nike IP without authorisation.',
    messageToSeller: 'We have received a formal complaint from Nike regarding your listings. Evidence of IP infringement has been submitted. Please respond within 5 business days with authorisation documentation.',
    createdAt: new Date('2024-03-01T10:30:00'),
    status: 'disputed',
    evidence: ['brand_complaint_nike.pdf', 'listing_screenshot.png'],
    attachments: ['distributor_auth_letter.pdf', 'invoice_march2024.pdf'],
    zohoTicketId: 'ZT-1001',
  },
  {
    id: 'V-002',
    sellerId: '10555',
    projectId: 'PRJ-2024-002',
    type: 'Counterfeit Listing',
    severity: 'critical',
    description: 'Internal audit flagged potential counterfeit Adidas listings. Photos suggest discrepancies vs authentic product.',
    messageToSeller: 'URGENT: Our audit has flagged potential counterfeit Adidas products in your listings. You must respond within 24 hours with authentication documentation.',
    createdAt: new Date('2024-03-02T08:00:00'),
    status: 'active',
    evidence: ['audit_report_adidas.pdf', 'photo_comparison.jpg'],
    zohoTicketId: 'ZT-1002',
  },
  {
    id: 'V-003',
    sellerId: '492959',
    projectId: 'PRJ-2024-003',
    type: 'Counterfeit Sale',
    severity: 'critical',
    description: 'Independent lab confirmed 12/12 Rolex units are counterfeit. Distributor invoices found to be fraudulent.',
    messageToSeller: 'We have confirmed the sale of counterfeit Rolex watches. This constitutes a critical violation and your account is subject to suspension pending investigation.',
    createdAt: new Date('2024-02-20T09:00:00'),
    status: 'enforced',
    evidence: ['lab_verification_rolex.pdf', 'fraud_invoice_analysis.pdf'],
    attachments: ['brand_letter.pdf'],
    zohoTicketId: 'ZT-1003',
  },
  {
    id: 'V-004',
    sellerId: '442777',
    projectId: 'PRJ-2024-004',
    type: 'Fake Feedback',
    severity: 'high',
    description: '47 reviews posted within 3 hours from geographically clustered IP addresses. Suspected coordinated fake review campaign.',
    messageToSeller: 'Our system has detected an unusual pattern of reviews on your listings. We are reviewing this for potential fake feedback manipulation. Please respond with your customer list.',
    createdAt: new Date('2024-03-05T07:00:00'),
    status: 'active',
    evidence: ['review_pattern_analysis.pdf'],
    zohoTicketId: 'ZT-1004',
  },
  {
    id: 'V-005',
    sellerId: '10555',
    projectId: 'PRJ-2024-005',
    type: 'Abusive Communication',
    severity: 'medium',
    description: 'Customer reported hostile messaging. Upon review, seller tone was firm but within policy. Customer had initiated hostile exchange.',
    messageToSeller: 'A customer has reported receiving hostile messages from your account. Please provide context and your full communication log for this customer.',
    createdAt: new Date('2024-02-15T12:00:00'),
    status: 'exonerated',
    evidence: ['message_logs.pdf'],
    attachments: ['response_time_report.pdf'],
    zohoTicketId: 'ZT-1005',
  },
];

export const mockDisputes: Dispute[] = [
  {
    id: 'D-001',
    violationId: 'V-001',
    sellerId: '442777',
    reason: 'All Nike products were sourced through authorised distributors. Attached are official authorisation letters and invoices confirming legitimacy.',
    evidence: ['distributor_auth_letter.pdf', 'invoice_march2024.pdf', 'carrier_delay_notice.pdf'],
    submittedAt: new Date('2024-03-03T13:00:00'),
    status: 'under_review',
  },
  {
    id: 'D-002',
    violationId: 'V-003',
    sellerId: '492959',
    reason: 'All products are authentic and sourced from authorised distributors. Attached are certificates of authenticity.',
    evidence: ['certificate_of_authenticity.pdf', 'distributor_invoice.pdf'],
    submittedAt: new Date('2024-02-22T12:00:00'),
    status: 'resolved',
    resolution: {
      action: 'enforced',
      reply: 'After independent lab verification, products were confirmed counterfeit. Certificates were fraudulent.',
      resolvedAt: new Date('2024-02-28T16:00:00'),
      resolvedBy: 'Sarah Johnson',
    },
  },
  {
    id: 'D-003',
    violationId: 'V-005',
    sellerId: '10555',
    reason: 'The customer initiated the hostile exchange with a chargeback threat. Our communication remained firm but professional throughout.',
    evidence: ['full_chat_log.pdf', 'customer_chargeback_email.pdf'],
    submittedAt: new Date('2024-02-17T09:00:00'),
    status: 'resolved',
    resolution: {
      action: 'exonerated',
      reply: 'Review confirmed no policy violation. Customer initiated hostile exchange. Seller exonerated.',
      resolvedAt: new Date('2024-02-22T11:00:00'),
      resolvedBy: 'Michael Chen',
    },
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

export interface MockSellerInfo {
  name: string;
  email: string;
  phone: string;
  countries: string[];
  accountHealth: 'Good' | 'Fair' | 'Poor' | 'Critical';
  riskScore: number;
  priorViolations: number;
  lastViolation: { label: string; date: string } | null;
  sellerRating: number;
}

export const mockSellers: Record<string, MockSellerInfo> = {
  '442777': {
    name: 'Al-Rashid Trading Co.', email: 'compliance@alrashid.ae', phone: '+971 4 555 0101',
    countries: ['AE', 'SA'], accountHealth: 'Fair', riskScore: 62,
    priorViolations: 3,
    lastViolation: { label: 'IP Violation', date: '2024-11-15' },
    sellerRating: 3.8,
  },
  '10555': {
    name: 'Gulf Electronics LLC', email: 'seller@gulfelectronics.sa', phone: '+966 11 555 0202',
    countries: ['SA', 'EG', 'KW'], accountHealth: 'Good', riskScore: 18,
    priorViolations: 1,
    lastViolation: { label: 'Duplicate Listing', date: '2025-01-03' },
    sellerRating: 4.6,
  },
  '492959': {
    name: 'Sharjah Goods Est.', email: 'ops@sharjahgoods.ae', phone: '+971 6 555 0303',
    countries: ['AE', 'QA', 'BH'], accountHealth: 'Poor', riskScore: 81,
    priorViolations: 7,
    lastViolation: { label: 'Counterfeit Sale', date: '2025-02-20' },
    sellerRating: 2.9,
  },
  '783421': {
    name: 'Cairo Retail Hub', email: 'accounts@cairoretail.eg', phone: '+20 2 555 0404',
    countries: ['EG'], accountHealth: 'Good', riskScore: 24,
    priorViolations: 0,
    lastViolation: null,
    sellerRating: 4.8,
  },
  '912567': {
    name: 'Kuwait Marketplace', email: 'seller@kuwaitmp.kw', phone: '+965 2 555 0505',
    countries: ['KW', 'BH', 'OM'], accountHealth: 'Fair', riskScore: 47,
    priorViolations: 2,
    lastViolation: { label: 'Fake Feedback / Reviews', date: '2024-09-12' },
    sellerRating: 4.1,
  },
  '334890': {
    name: 'Desert Rose Sellers', email: 'info@desertrose.sa', phone: '+966 12 555 0606',
    countries: ['SA', 'OM'], accountHealth: 'Critical', riskScore: 94,
    priorViolations: 12,
    lastViolation: { label: 'Money Laundering', date: '2025-03-05' },
    sellerRating: 2.1,
  },
  '667123': {
    name: 'Doha Direct', email: 'dohadirect@qa.com', phone: '+974 4 555 0707',
    countries: ['QA', 'BH'], accountHealth: 'Good', riskScore: 11,
    priorViolations: 1,
    lastViolation: { label: 'Abusive Communication', date: '2024-12-01' },
    sellerRating: 4.5,
  },
  '445678': {
    name: 'Nile Valley Commerce', email: 'nilevc@eg.com', phone: '+20 3 555 0808',
    countries: ['EG', 'SA'], accountHealth: 'Fair', riskScore: 55,
    priorViolations: 4,
    lastViolation: { label: 'Prohibited Product', date: '2025-01-28' },
    sellerRating: 3.5,
  },
};
