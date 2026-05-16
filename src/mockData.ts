import { Violation, Dispute, Acknowledgment, ZohoTicket, MessageTemplate, TemplatePlaceholder } from './types';

// ── Violations — multi-seller, all types, spread across past 180 days ────────

// Helper: date N days ago from today
const daysAgo = (n: number) => { const d = new Date(); d.setDate(d.getDate() - n); return d; };

export const mockViolations: Violation[] = [
  // ─── V-001 · SANCTIONED ─────────────────────────────────────────────────────
  {
    id: 'V-001', sellerId: '442777', projectId: 'PRJ-2025-001',
    type: 'IP Violation', severity: 'high', assignedTo: 'Sarah Johnson',
    description: 'Nike brand complaint — listings suspected of using Nike IP without authorisation.',
    messageToSeller: 'We have received a formal complaint from Nike. Please review the Plan of Action and respond within 5 business days.',
    createdAt: daysAgo(3), status: 'sanctioned',
    evidence: ['brand_complaint_nike.pdf', 'listing_screenshot.png'],
    zohoTicketId: 'ZT-1001',
    poa: {
      title: 'IP Violation — Plan of Action',
      summary: 'Your account has been flagged for IP infringement involving Nike-branded products.',
      steps: ['Remove all Nike-branded listings.', 'Provide authorisation letter from Nike.', 'Submit purchasing invoices.', 'Complete IP Compliance training.'],
    },
  },
  // ─── V-002 · DISPUTED ───────────────────────────────────────────────────────
  {
    id: 'V-002', sellerId: '442777', projectId: 'PRJ-2025-002',
    type: 'Counterfeit Listing', severity: 'critical', assignedTo: 'Sarah Johnson',
    description: 'Internal audit flagged potential counterfeit Adidas products.',
    messageToSeller: 'URGENT: Potential counterfeit Adidas products flagged. Respond within 24 hours.',
    createdAt: daysAgo(8), status: 'disputed',
    evidence: ['audit_report_adidas.pdf', 'photo_comparison.jpg'], zohoTicketId: 'ZT-1002',
    poa: { title: 'Counterfeit Product — Plan of Action', summary: 'Flagged listings must be removed and authenticity proven.', steps: ['Remove all flagged Adidas listings.', 'Submit certificates of authenticity.', 'Provide purchasing invoices.'] },
  },
  // ─── V-003 · ACKNOWLEDGED (seller submitted fix, analyst reviewing) ───────────
  {
    id: 'V-003', sellerId: '442777', projectId: 'PRJ-2025-003',
    type: 'Delivery Policy Violation', severity: 'medium', assignedTo: 'Sarah Johnson',
    description: 'Multiple SLA breaches — 14 orders delivered 3–7 days beyond window.',
    messageToSeller: 'Repeated delivery SLA breaches recorded. Review Plan of Action and confirm corrective measures.',
    createdAt: daysAgo(15), status: 'acknowledged',
    evidence: ['sla_breach_report.pdf'], zohoTicketId: 'ZT-1003',
    poa: { title: 'Delivery SLA Breach — Plan of Action', summary: 'Outline corrective steps for repeated SLA violations.', steps: ['Audit fulfilment workflow.', 'Update delivery times.', 'Submit revised logistics plan.'] },
  },
  // ─── V-004 · UPHELD ─────────────────────────────────────────────────────────
  {
    id: 'V-004', sellerId: '442777', projectId: 'PRJ-2025-004',
    type: 'Pricing Manipulation', severity: 'high', assignedTo: 'Michael Chen',
    description: 'System detected artificial price inflation of 340% on 8 SKUs during high-demand window.',
    messageToSeller: 'Pricing anomalies detected violating fair pricing policy.',
    createdAt: daysAgo(22), status: 'upheld',
    evidence: ['price_audit_timeline.pdf'], zohoTicketId: 'ZT-1004',
    poa: { title: 'Pricing Manipulation — Plan of Action', summary: 'Artificial price inflation is a serious policy breach. All penalties apply.', steps: ['Correct all flagged SKUs.', 'Align prices with policy.', 'Implement repricing controls.'] },
  },
  // ─── V-005 · APPEALED ───────────────────────────────────────────────────────
  {
    id: 'V-005', sellerId: '442777', projectId: 'PRJ-2025-005',
    type: 'Abusive Communication', severity: 'medium', assignedTo: 'Michael Chen',
    description: 'Customer filed hostile communication complaint. Escalated for final review.',
    messageToSeller: 'Dispute escalated for second and final review.',
    createdAt: daysAgo(30), status: 'appealed',
    evidence: ['customer_complaint_ref.pdf'], zohoTicketId: 'ZT-1005',
    poa: { title: 'Communication Policy — Plan of Action', summary: 'All communications must remain professional.', steps: ['Review communication threads.', 'Train team on de-escalation.', 'Submit full communication log.'] },
  },
  // ─── V-006 · DISMISSED ──────────────────────────────────────────────────────
  {
    id: 'V-006', sellerId: '442777', projectId: 'PRJ-2025-006',
    type: 'Duplicate Listing', severity: 'low', assignedTo: 'Emily Davis',
    description: 'Duplicate listings flagged — seller proved they were canonical variants.',
    messageToSeller: 'Dispute accepted — violation dismissed.',
    createdAt: daysAgo(45), status: 'dismissed',
    evidence: ['duplicate_listing_report.pdf'], zohoTicketId: 'ZT-1006',
    poa: { title: 'Duplicate Listing — Plan of Action', summary: 'All duplicates must be removed.', steps: ['Remove duplicate listings.', 'Consolidate reviews.', 'Implement listing audit process.'] },
  },
  // ─── V-007 · VOIDED ─────────────────────────────────────────────────────────
  {
    id: 'V-007', sellerId: '442777', projectId: 'PRJ-2025-007',
    type: 'Prohibited Product', severity: 'critical', assignedTo: 'Emily Davis',
    description: 'Violation claim filed against wrong seller ID — data entry error.',
    messageToSeller: '',
    createdAt: daysAgo(60), status: 'voided',
    evidence: ['incident_report_correction.pdf'], zohoTicketId: 'ZT-1007',
    poa: { title: 'Prohibited Product — Plan of Action', summary: 'Voided — no action required.', steps: ['No action required.'] },
  },

  // ─── Additional violations for chart/metric richness ─────────────────────────

  {
    id: 'V-008', sellerId: '492959', projectId: 'PRJ-2025-008',
    type: 'IP Violation', severity: 'critical', assignedTo: 'Sarah Johnson',
    description: 'Adidas counterfeit complaint filed by brand protection team.',
    messageToSeller: 'Critical IP violation. Respond within 24 hours.',
    createdAt: daysAgo(5), status: 'sanctioned',
    evidence: ['adidas_complaint.pdf'], zohoTicketId: 'ZT-1008',
    poa: { title: 'IP Violation — Plan of Action', summary: 'Remove infringing products immediately.', steps: ['Remove listings.', 'Submit authorisation.'] },
  },
  {
    id: 'V-009', sellerId: '334890', projectId: 'PRJ-2025-009',
    type: 'Counterfeit Listing', severity: 'critical', assignedTo: 'Michael Chen',
    description: 'High-confidence counterfeit detection on luxury handbag listings.',
    messageToSeller: 'Hi seller, Counterfeit listings detected. Immediate response required. Please dont do this again. For more information refer to the following: fhbhywbubuvbrvrvbhwrbv whv wbvhfebfhr3bhr3bfhr3fbrhfubfhefbehfuebfedbudvudhwvbwvhubvdv',
    createdAt: daysAgo(2), status: 'sanctioned',
    evidence: ['counterfeit_report.pdf'], zohoTicketId: 'ZT-1009',
    poa: { title: 'Counterfeit — Plan of Action', summary: 'Remove all flagged items.', steps: ['Remove listings.', 'Prove authenticity.'] },
  },
  {
    id: 'V-010', sellerId: '10555', projectId: 'PRJ-2025-010',
    type: 'Delivery Policy Violation', severity: 'medium', assignedTo: 'Emily Davis',
    description: 'SLA breach reported on 9 orders across two weeks.',
    messageToSeller: 'SLA breaches recorded on your account.',
    createdAt: daysAgo(18), status: 'upheld',
    evidence: ['sla_report_q1.pdf'], zohoTicketId: 'ZT-1010',
    poa: { title: 'Delivery SLA — Plan of Action', summary: 'Corrective steps for SLA breach.', steps: ['Update delivery estimates.', 'Submit logistics plan.'] },
  },
  {
    id: 'V-011', sellerId: '912567', projectId: 'PRJ-2025-011',
    type: 'Fake Feedback / Reviews', severity: 'high', assignedTo: 'Sarah Johnson',
    description: 'Coordinated review injection detected across 22 products.',
    messageToSeller: 'Review manipulation detected. Please respond.',
    createdAt: daysAgo(12), status: 'disputed',
    evidence: ['review_audit.pdf'], zohoTicketId: 'ZT-1011',
    poa: { title: 'Fake Reviews — Plan of Action', summary: 'Review manipulation violates platform policy.', steps: ['Remove injected reviews.', 'Provide reviewer evidence.'] },
  },
  {
    id: 'V-012', sellerId: '334890', projectId: 'PRJ-2025-012',
    type: 'Prohibited Product', severity: 'critical', assignedTo: 'Michael Chen',
    description: 'Listings contain prohibited items under customs and import regulations.',
    messageToSeller: 'Prohibited product listings detected.',
    createdAt: daysAgo(7), status: 'sanctioned',
    evidence: ['prohibited_items_list.pdf'], zohoTicketId: 'ZT-1012',
    poa: { title: 'Prohibited Product — Plan of Action', summary: 'Remove all prohibited items.', steps: ['Remove prohibited listings.', 'Confirm compliance.'] },
  },
  {
    id: 'V-013', sellerId: '445678', projectId: 'PRJ-2025-013',
    type: 'Pricing Manipulation', severity: 'high', assignedTo: 'Sarah Johnson',
    description: 'Price gouging detected during Ramadan demand spike.',
    messageToSeller: 'Price manipulation during peak period violates fair pricing policy.',
    createdAt: daysAgo(25), status: 'insufficient',
    evidence: ['pricing_audit_ramadan.pdf'], zohoTicketId: 'ZT-1013',
    poa: { title: 'Pricing — Plan of Action', summary: 'Correct pricing to comply with policy.', steps: ['Revert flagged prices.', 'Commit to fair pricing.'] },
  },
  {
    id: 'V-014', sellerId: '667123', projectId: 'PRJ-2025-014',
    type: 'Abusive Communication', severity: 'low', assignedTo: 'Emily Davis',
    description: 'Seller support representative used inappropriate language with a customer.',
    messageToSeller: 'Communication policy breach on record.',
    createdAt: daysAgo(40), status: 'dismissed',
    evidence: ['chat_log.pdf'], zohoTicketId: 'ZT-1014',
    poa: { title: 'Communication — Plan of Action', summary: 'Review communication standards.', steps: ['Retrain support staff.'] },
  },
  {
    id: 'V-015', sellerId: '492959', projectId: 'PRJ-2025-015',
    type: 'IP Violation', severity: 'high', assignedTo: 'Michael Chen',
    description: 'Lacoste brand protection complaint for 12 unlicensed polo shirt listings.',
    messageToSeller: 'IP violation: Lacoste complaint filed.',
    createdAt: daysAgo(10), status: 'disputed',
    evidence: ['lacoste_complaint.pdf'], zohoTicketId: 'ZT-1015',
    poa: { title: 'IP — Plan of Action', summary: 'Remove unlicensed Lacoste listings.', steps: ['Remove listings.', 'Submit authorisation.'] },
  },
  {
    id: 'V-016', sellerId: '783421', projectId: 'PRJ-2025-016',
    type: 'Duplicate Listing', severity: 'low', assignedTo: 'Sarah Johnson',
    description: '8 duplicate ASIN listings detected.',
    messageToSeller: 'Duplicate listings detected on your account.',
    createdAt: daysAgo(55), status: 'dismissed',
    evidence: ['dup_asin_report.pdf'], zohoTicketId: 'ZT-1016',
    poa: { title: 'Duplicate Listing — Plan of Action', summary: 'Remove duplicates.', steps: ['Remove duplicates.', 'Consolidate catalogue.'] },
  },
  {
    id: 'V-017', sellerId: '912567', projectId: 'PRJ-2025-017',
    type: 'Counterfeit Listing', severity: 'high', assignedTo: 'Emily Davis',
    description: 'Suspected counterfeit watches flagged by authenticity scanner.',
    messageToSeller: 'Counterfeit watch listings detected.',
    createdAt: daysAgo(35), status: 'upheld',
    evidence: ['watch_scan_report.pdf'], zohoTicketId: 'ZT-1017',
    poa: { title: 'Counterfeit — Plan of Action', summary: 'All counterfeit listings removed.', steps: ['Remove listings.', 'Provide authenticity certs.'] },
  },
  {
    id: 'V-018', sellerId: '334890', projectId: 'PRJ-2025-018',
    type: 'Fake Feedback / Reviews', severity: 'critical', assignedTo: 'Michael Chen',
    description: 'Bot-generated 5-star reviews across 45 products detected.',
    messageToSeller: 'Bot review injection detected.',
    createdAt: daysAgo(20), status: 'appealed',
    evidence: ['bot_review_report.pdf'], zohoTicketId: 'ZT-1018',
    poa: { title: 'Fake Reviews — Plan of Action', summary: 'Review manipulation escalated for final review.', steps: ['Remove injected reviews.', 'Submit review source evidence.'] },
  },
  {
    id: 'V-019', sellerId: '445678', projectId: 'PRJ-2025-019',
    type: 'IP Violation', severity: 'medium', assignedTo: 'Sarah Johnson',
    description: 'Unverified Apple accessory listings — possible trademark infringement.',
    messageToSeller: 'Apple IP complaint received. Please respond.',
    createdAt: daysAgo(50), status: 'fixed',
    evidence: ['apple_complaint.pdf'], zohoTicketId: 'ZT-1019',
    poa: { title: 'IP — Plan of Action', summary: 'Provide Apple authorisation or remove listings.', steps: ['Remove listings or provide authorisation.'] },
  },
  {
    id: 'V-020', sellerId: '10555', projectId: 'PRJ-2025-020',
    type: 'Prohibited Product', severity: 'high', assignedTo: 'Emily Davis',
    description: 'Laser pointer listings exceed permitted output class.',
    messageToSeller: 'Prohibited laser products detected.',
    createdAt: daysAgo(70), status: 'voided',
    evidence: ['laser_spec_report.pdf'], zohoTicketId: 'ZT-1020',
    poa: { title: 'Prohibited Product — Plan of Action', summary: 'Voided due to incorrect classification.', steps: ['No action required.'] },
  },
  {
    id: 'V-021', sellerId: '783421', projectId: 'PRJ-2025-021',
    type: 'Delivery Policy Violation', severity: 'low', assignedTo: 'Emily Davis',
    description: '3 orders breached SLA by 1 day during public holiday weekend.',
    messageToSeller: 'Minor SLA breach recorded.',
    createdAt: daysAgo(90), status: 'dismissed',
    evidence: ['holiday_breach_report.pdf'], zohoTicketId: 'ZT-1021',
    poa: { title: 'Delivery SLA — Plan of Action', summary: 'Adjust holiday delivery estimates.', steps: ['Update holiday handling times.'] },
  },
  {
    id: 'V-022', sellerId: '667123', projectId: 'PRJ-2025-022',
    type: 'Pricing Manipulation', severity: 'medium', assignedTo: 'Michael Chen',
    description: 'Dynamic repricing algorithm caused repeated 200%+ price spikes.',
    messageToSeller: 'Automated repricing policy breach detected.',
    createdAt: daysAgo(14), status: 'disputed',
    evidence: ['repricing_log.pdf'], zohoTicketId: 'ZT-1022',
    poa: { title: 'Pricing — Plan of Action', summary: 'Repricing algorithm must comply with policy caps.', steps: ['Cap repricing at 50% deviation.', 'Submit updated algorithm config.'] },
  },
];

// ── Disputes ─────────────────────────────────────────────────────────────────

export const mockDisputes: Dispute[] = [
  // D-001 → V-002 (disputed · pending ops review)
  {
    id: 'D-001',
    violationId: 'V-002',
    sellerId: '442777',
    reason: 'All Adidas products were sourced directly from Adidas Gulf Distribution. I have attached the official distributor agreement, product certificates, and itemised invoices. These are fully authenticated goods.',
    evidence: ['adidas_distributor_agreement.pdf', 'certificate_of_authenticity.pdf', 'invoice_feb2024.pdf'],
    submittedAt: new Date('2024-03-06T11:00:00'),
    status: 'pending',
  },
  // D-002 → V-004 (upheld · ops upheld the violation after dispute)
  {
    id: 'D-002',
    violationId: 'V-004',
    sellerId: '442777',
    reason: 'The price increase was triggered by a legitimate supply shortage caused by a carrier delay. We raised prices temporarily to manage demand and prevent overselling. This was not intentional manipulation.',
    evidence: ['carrier_delay_certificate.pdf', 'stock_level_log.pdf'],
    submittedAt: new Date('2024-02-22T10:00:00'),
    status: 'upheld',
    opsReply: 'The price increase of 340% far exceeds what a supply-side justification could warrant. The audit shows the rollback occurred within 2 hours of the final sale — a pattern consistent with intentional manipulation. Violation upheld. All penalties apply.',
    opsRepliedAt: new Date('2024-02-25T14:30:00'),
    opsRepliedBy: 'Sarah Johnson',
  },
  // D-003 → V-005 (appealed · ops escalated for second review)
  {
    id: 'D-003',
    violationId: 'V-005',
    sellerId: '442777',
    reason: 'The customer opened with a chargeback threat and used abusive language first. Our agent remained professional throughout. I have attached the full communication log and the customer\'s initial message.',
    evidence: ['full_chat_export.pdf', 'customer_chargeback_email.pdf'],
    submittedAt: new Date('2024-01-30T09:00:00'),
    status: 'appealed',
    opsReply: 'New evidence has been reviewed. This case has been escalated for a second and final investigation. A senior risk analyst will make the final determination.',
    opsRepliedAt: new Date('2024-02-01T10:00:00'),
    opsRepliedBy: 'Michael Chen',
  },
  // D-004 → V-006 (dismissed · dispute accepted, seller cleared)
  {
    id: 'D-004',
    violationId: 'V-006',
    sellerId: '442777',
    reason: 'These listings are canonical product variants with different size and colour attributes — they are not duplicates. Each listing references a unique SKU. I have attached the full product catalogue mapping.',
    evidence: ['product_catalogue_mapping.pdf', 'sku_attribute_diff.pdf'],
    submittedAt: new Date('2024-01-16T09:00:00'),
    status: 'dismissed',
    opsReply: 'Review of the product catalogue confirms the flagged listings represent distinct attribute variants, not duplicates. Violation claim dismissed on merits. Seller is cleared. Record maintained to avoid double jeopardy.',
    opsRepliedAt: new Date('2024-01-18T11:30:00'),
    opsRepliedBy: 'Emily Davis',
  },
];

// ── Acknowledgments ──────────────────────────────────────────────────────────

export const mockAcknowledgments: Acknowledgment[] = [
  // A-001 → V-003 (acknowledged · pending analyst review)
  {
    id: 'A-001',
    violationId: 'V-003',
    sellerId: '442777',
    poaFollowed: 'I have completed a full audit of our fulfilment workflow and identified the root cause as a manual handoff delay between warehouse packing and courier collection. I have now implemented same-day courier booking cutoffs, updated all listing delivery windows to +2 days buffer, and have enrolled our operations team in the SLA compliance module. A revised logistics plan with carrier SLA confirmation is attached.',
    submittedAt: new Date('2024-02-13T15:00:00'),
    status: 'pending',
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

// Per-violation required placeholder keys
export const violationPlaceholders: Record<string, string[]> = {
  DELIVERY:      ['{sellerId}', '{projectId}', '{scheduledDate}', '{actualDate}', '{deadline}'],
  PRODUCT:       ['{sellerId}', '{projectId}', '{suspectedItems}', '{violationCount}', '{deadline}'],
  PACKAGING:     ['{sellerId}', '{projectId}', '{qualityIssues}', '{deadline}'],
  COMMUNICATION: ['{sellerId}', '{projectId}', '{communicationIssues}', '{deadline}'],
  FRAUD:         ['{sellerId}', '{projectId}', '{suspectedItems}', '{violationCount}', '{deadline}'],
};

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
