import {
  Violation, Dispute, MessageTemplate, TemplatePlaceholder,
  SellerProfile, ViolationTrendPoint, ViolationByType
} from './types';

// ─── Seller Profiles ──────────────────────────────────────────────────────────

export const mockSellers: Record<string, SellerProfile> = {
  '442777': {
    id: '442777', name: 'Al Fajr Electronics', email: 'compliance@alfajr.ae',
    phone: '+971 50 234 5678', countries: ['AE', 'SA', 'KW'],
    accountHealth: 'At Risk', riskScore: 72, riskTier: 'high',
    sellerRating: 3.8, priorViolations: 8, activeViolations: 2,
    disputeSuccessRate: 25, responseRate: 88, avgResponseDays: 3.2,
    lastViolation: { label: 'Counterfeit Goods', date: '2025-03-10', outcome: 'Actioned' },
    joinedAt: new Date('2021-04-15'), totalOrders: 14820, gmvUSD: 3_240_000,
    patternAlerts: [
      { type: 'repeat_violation', description: 'IP_COUNTERFEIT filed 3 times in 12 months', count: 3, detectedAt: new Date('2025-03-15'), severity: 'critical' },
      { type: 'low_dispute_success', description: 'Dispute success rate below 30%', count: 6, detectedAt: new Date('2025-02-01'), severity: 'warning' },
    ],
    healthHistory: [
      { date: '2025-01', score: 82 }, { date: '2025-02', score: 75 },
      { date: '2025-03', score: 68 }, { date: '2025-04', score: 72 },
    ],
  },
  '10555': {
    id: '10555', name: 'SkyMart Trading LLC', email: 'seller@skymart.com',
    phone: '+971 55 987 6543', countries: ['AE', 'EG'],
    accountHealth: 'Good', riskScore: 38, riskTier: 'medium',
    sellerRating: 4.4, priorViolations: 3, activeViolations: 1,
    disputeSuccessRate: 67, responseRate: 95, avgResponseDays: 1.8,
    lastViolation: { label: 'Fake Reviews', date: '2025-02-20', outcome: 'Under Review' },
    joinedAt: new Date('2020-09-01'), totalOrders: 42_100, gmvUSD: 7_800_000,
    patternAlerts: [],
    healthHistory: [
      { date: '2025-01', score: 88 }, { date: '2025-02', score: 84 },
      { date: '2025-03', score: 80 }, { date: '2025-04', score: 78 },
    ],
  },
  '88234': {
    id: '88234', name: 'Horizon Pharma Retail', email: 'ops@horizonpharma.eg',
    phone: '+20 10 1234 5678', countries: ['EG', 'SA'],
    accountHealth: 'Excellent', riskScore: 14, riskTier: 'low',
    sellerRating: 4.8, priorViolations: 1, activeViolations: 0,
    disputeSuccessRate: 100, responseRate: 100, avgResponseDays: 0.9,
    lastViolation: { label: 'Price Fixing', date: '2024-11-05', outcome: 'Acquitted' },
    joinedAt: new Date('2019-03-22'), totalOrders: 89_300, gmvUSD: 12_100_000,
    patternAlerts: [],
    healthHistory: [
      { date: '2025-01', score: 96 }, { date: '2025-02', score: 97 },
      { date: '2025-03', score: 95 }, { date: '2025-04', score: 96 },
    ],
  },
  '55789': {
    id: '55789', name: 'Desert Rose Apparel', email: 'brand@desertrose.sa',
    phone: '+966 55 321 0987', countries: ['SA', 'AE', 'BH', 'OM'],
    accountHealth: 'Fair', riskScore: 55, riskTier: 'medium',
    sellerRating: 4.1, priorViolations: 5, activeViolations: 1,
    disputeSuccessRate: 40, responseRate: 82, avgResponseDays: 4.5,
    lastViolation: { label: 'Trademark Infringement', date: '2025-03-28', outcome: 'Acknowledged' },
    joinedAt: new Date('2022-01-10'), totalOrders: 22_450, gmvUSD: 4_100_000,
    patternAlerts: [
      { type: 'slow_response', description: 'Avg response time exceeded 4 days in last quarter', count: 4, detectedAt: new Date('2025-03-01'), severity: 'warning' },
    ],
    healthHistory: [
      { date: '2025-01', score: 74 }, { date: '2025-02', score: 70 },
      { date: '2025-03', score: 65 }, { date: '2025-04', score: 68 },
    ],
  },
  '23456': {
    id: '23456', name: 'Gulf Power Tools', email: 'account@gulfpower.kw',
    phone: '+965 9988 7766', countries: ['KW', 'QA', 'BH'],
    accountHealth: 'Good', riskScore: 29, riskTier: 'low',
    sellerRating: 4.6, priorViolations: 2, activeViolations: 1,
    disputeSuccessRate: 50, responseRate: 90, avgResponseDays: 2.1,
    lastViolation: { label: 'Dangerous Goods', date: '2025-04-02', outcome: 'Open' },
    joinedAt: new Date('2023-06-01'), totalOrders: 9_870, gmvUSD: 1_900_000,
    patternAlerts: [],
    healthHistory: [
      { date: '2025-01', score: 91 }, { date: '2025-02', score: 90 },
      { date: '2025-03', score: 88 }, { date: '2025-04', score: 85 },
    ],
  },
  '67890': {
    id: '67890', name: 'Nile Valley Imports', email: 'info@nilevalley.eg',
    phone: '+20 11 9876 5432', countries: ['EG'],
    accountHealth: 'Suspended', riskScore: 91, riskTier: 'critical',
    sellerRating: 2.9, priorViolations: 14, activeViolations: 3,
    disputeSuccessRate: 7, responseRate: 45, avgResponseDays: 9.8,
    lastViolation: { label: 'Gray Market Goods', date: '2025-04-10', outcome: 'No Response' },
    joinedAt: new Date('2020-11-01'), totalOrders: 5_200, gmvUSD: 680_000,
    patternAlerts: [
      { type: 'no_response_pattern', description: '3 consecutive violations with no seller response', count: 3, detectedAt: new Date('2025-04-15'), severity: 'critical' },
      { type: 'repeat_violation', description: 'COMPLIANCE_GRAY_MARKET filed 4 times', count: 4, detectedAt: new Date('2025-03-20'), severity: 'critical' },
      { type: 'account_suspension_risk', description: 'Risk score exceeds suspension threshold', count: 1, detectedAt: new Date('2025-04-12'), severity: 'critical' },
    ],
    healthHistory: [
      { date: '2025-01', score: 48 }, { date: '2025-02', score: 38 },
      { date: '2025-03', score: 22 }, { date: '2025-04', score: 12 },
    ],
  },
};

// ─── Violations (full lifecycle coverage) ─────────────────────────────────────

export const mockViolations: Violation[] = [
  // V-001: UNDER REVIEW — seller disputed, ops is reviewing
  {
    id: 'V-001', partnerID: '442777', countryCode: 'AE', mpCode: 'noon',
    idViolation: 'IP_COUNTERFEIT', violationDate: '2025-03-10',
    family: 'IP & Authenticity', severity: 'critical', status: 'under_review',
    overallRisk: 'critical', requestSource: 'Brand Report — Apple Inc.',
    complaintTicket: 'CMP-8821', idPenalty: 'PNL-441',
    actionCode: 'SUSPEND_LISTING', warningCount: 3,
    ticketOwner: 'Nour Al-Rashid', messageToSeller: 'We have received a formal brand report from Apple Inc. alleging that your listing ASN-99201 contains counterfeit AirPods. The listing has been suspended pending investigation. Please provide proof of authenticity within 5 business days.',
    brandCode: 'APPLE', brandName: 'Apple', skuAsn: 'ASN-99201',
    createdAt: new Date('2025-03-10T09:15:00'), updatedAt: new Date('2025-03-15T14:00:00'),
    healthImpactSuspended: true,
    evidence: [
      { id: 'EV-001a', fileName: 'brand_report_apple.pdf', fileType: 'document', uploadedBy: 'ops', uploadedAt: new Date('2025-03-10T09:00:00'), url: '#', sizeMb: 1.2 },
      { id: 'EV-001b', fileName: 'listing_screenshot.png', fileType: 'image', uploadedBy: 'ops', uploadedAt: new Date('2025-03-10T09:05:00'), url: '#', sizeMb: 0.4 },
    ],
    disputes: [{
      id: 'DIS-001', violationId: 'V-001', sellerId: '442777',
      submittedAt: new Date('2025-03-13T11:30:00'),
      category: 'insufficient_evidence',
      explanation: 'We are an authorized Apple reseller. The brand report was filed in error. We have attached our official Apple Authorized Reseller certificate valid through 2026. The ASN in question was sourced directly from Apple MENA distribution.',
      evidence: [
        { id: 'DEV-001a', fileName: 'apple_authorized_reseller_cert.pdf', fileType: 'document', uploadedBy: 'seller', uploadedAt: new Date('2025-03-13T11:25:00'), url: '#', sizeMb: 0.8 },
        { id: 'DEV-001b', fileName: 'invoice_apple_mena.pdf', fileType: 'document', uploadedBy: 'seller', uploadedAt: new Date('2025-03-13T11:26:00'), url: '#', sizeMb: 1.5 },
      ],
      slaDeadline: new Date('2025-04-13T11:30:00'),
      status: 'under_review', reviewedBy: 'Nour Al-Rashid',
      slaBreached: false,
    }],
    thread: [
      { id: 'TH-001a', violationId: 'V-001', sender: 'ops', senderName: 'Nour Al-Rashid', content: 'We have received a formal brand report from Apple Inc. alleging that your listing ASN-99201 contains counterfeit AirPods...', sentAt: new Date('2025-03-10T09:15:00') },
      { id: 'TH-001b', violationId: 'V-001', sender: 'seller', senderName: 'Al Fajr Electronics', content: 'This is incorrect. We are an Apple Authorized Reseller. Please see our attached certificate.', sentAt: new Date('2025-03-13T10:00:00') },
      { id: 'TH-001c', violationId: 'V-001', sender: 'seller', senderName: 'Al Fajr Electronics', content: 'We are formally disputing this violation. Certificate and original invoice attached to the dispute form.', sentAt: new Date('2025-03-13T11:30:00'), isDisputeSubmission: true, disputeId: 'DIS-001' },
      { id: 'TH-001d', violationId: 'V-001', sender: 'ops', senderName: 'Nour Al-Rashid', content: 'Dispute received. We have escalated to the Brand Protection team for verification with Apple. Expected resolution within 10 business days.', sentAt: new Date('2025-03-14T09:00:00') },
    ],
    auditLog: [
      { id: 'AL-001a', timestamp: new Date('2025-03-10T09:15:00'), actor: 'Nour Al-Rashid', actorType: 'ops', action: 'Violation created', toStatus: 'open' },
      { id: 'AL-001b', timestamp: new Date('2025-03-10T09:20:00'), actor: 'Nour Al-Rashid', actorType: 'ops', action: 'Notice sent to seller', fromStatus: 'open', toStatus: 'sent_to_seller' },
      { id: 'AL-001c', timestamp: new Date('2025-03-13T11:30:00'), actor: 'Al Fajr Electronics', actorType: 'seller', action: 'Formal dispute submitted', fromStatus: 'sent_to_seller', toStatus: 'disputed' },
      { id: 'AL-001d', timestamp: new Date('2025-03-14T09:00:00'), actor: 'Nour Al-Rashid', actorType: 'ops', action: 'Dispute moved to review', fromStatus: 'disputed', toStatus: 'under_review' },
    ],
  },

  // V-002: DISPUTED — seller just opened dispute, awaiting ops action
  {
    id: 'V-002', partnerID: '10555', countryCode: 'AE', mpCode: 'noon',
    idViolation: 'CONDUCT_FAKE_REVIEWS', violationDate: '2025-02-20',
    family: 'Seller Conduct', severity: 'high', status: 'disputed',
    overallRisk: 'high', requestSource: 'Internal Audit — Review Quality Team',
    complaintTicket: 'CMP-9012', warningCount: 1,
    ticketOwner: 'Samira Haddad', messageToSeller: 'Our review quality system detected a cluster of suspiciously similar 5-star reviews on your store submitted from the same IP subnet over a 3-day period. This constitutes a potential violation of our review integrity policy.',
    createdAt: new Date('2025-02-20T14:00:00'), updatedAt: new Date('2025-02-28T10:00:00'),
    healthImpactSuspended: true,
    evidence: [
      { id: 'EV-002a', fileName: 'review_cluster_report.pdf', fileType: 'document', uploadedBy: 'ops', uploadedAt: new Date('2025-02-20T13:50:00'), url: '#', sizeMb: 0.9 },
    ],
    disputes: [{
      id: 'DIS-002', violationId: 'V-002', sellerId: '10555',
      submittedAt: new Date('2025-02-28T10:00:00'),
      category: 'policy_misapplication',
      explanation: 'The reviews in question were from a legitimate marketing campaign we ran on our social media. We encouraged customers to leave honest reviews. We have proof of our campaign dates and influencer contracts that match the review dates.',
      evidence: [
        { id: 'DEV-002a', fileName: 'social_campaign_report.pdf', fileType: 'document', uploadedBy: 'seller', uploadedAt: new Date('2025-02-28T09:55:00'), url: '#', sizeMb: 2.1 },
      ],
      slaDeadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now - urgent!
      status: 'open', slaBreached: false,
    }],
    thread: [
      { id: 'TH-002a', violationId: 'V-002', sender: 'ops', senderName: 'Samira Haddad', content: 'Our review quality system detected suspicious review patterns on your store...', sentAt: new Date('2025-02-20T14:00:00') },
      { id: 'TH-002b', violationId: 'V-002', sender: 'seller', senderName: 'SkyMart Trading LLC', content: 'We ran a marketing campaign which explains the review pattern. Please see our dispute with full evidence.', sentAt: new Date('2025-02-28T10:00:00'), isDisputeSubmission: true, disputeId: 'DIS-002' },
    ],
    auditLog: [
      { id: 'AL-002a', timestamp: new Date('2025-02-20T14:00:00'), actor: 'Samira Haddad', actorType: 'ops', action: 'Violation created', toStatus: 'open' },
      { id: 'AL-002b', timestamp: new Date('2025-02-20T14:05:00'), actor: 'Samira Haddad', actorType: 'ops', action: 'Notice sent to seller', fromStatus: 'open', toStatus: 'sent_to_seller' },
      { id: 'AL-002c', timestamp: new Date('2025-02-28T10:00:00'), actor: 'SkyMart Trading LLC', actorType: 'seller', action: 'Formal dispute submitted', fromStatus: 'sent_to_seller', toStatus: 'disputed' },
    ],
  },

  // V-003: ACTIONED — closed with penalty, seller did not dispute
  {
    id: 'V-003', partnerID: '88234', countryCode: 'EG', mpCode: 'noon',
    idViolation: 'COMPLIANCE_PRICE_FIX', violationDate: '2024-11-05',
    family: 'Compliance & Legal', severity: 'high', status: 'acquitted',
    overallRisk: 'medium', requestSource: 'Regulatory Report — Egyptian Competition Authority',
    complaintTicket: 'CMP-6601', warningCount: 0,
    ticketOwner: 'Omar Khalil', messageToSeller: 'We have received notification from the Egyptian Competition Authority regarding potential price coordination between your pharmacy listings and a competitor. This is being reviewed.',
    createdAt: new Date('2024-11-05T10:00:00'), updatedAt: new Date('2024-11-20T16:00:00'),
    closedAt: new Date('2024-11-20T16:00:00'),
    verdict: { type: 'acquitted', reason: 'After review with the Competition Authority, the price similarity was found to be coincidental market pricing, not coordinated. Seller provided independent pricing methodology documentation.', issuedBy: 'Omar Khalil', issuedAt: new Date('2024-11-20T16:00:00'), appealEligible: false },
    thread: [
      { id: 'TH-003a', violationId: 'V-003', sender: 'ops', senderName: 'Omar Khalil', content: 'We have received a regulatory notification regarding your pricing...', sentAt: new Date('2024-11-05T10:00:00') },
      { id: 'TH-003b', violationId: 'V-003', sender: 'seller', senderName: 'Horizon Pharma Retail', content: 'Our pricing is set independently based on supplier costs and market research. We have never coordinated with any competitor. Happy to provide our pricing methodology document.', sentAt: new Date('2024-11-07T09:30:00') },
      { id: 'TH-003c', violationId: 'V-003', sender: 'ops', senderName: 'Omar Khalil', content: 'Thank you. After thorough review and coordination with the Competition Authority, this case has been closed as acquitted. No action will be taken.', sentAt: new Date('2024-11-20T16:00:00') },
    ],
    auditLog: [
      { id: 'AL-003a', timestamp: new Date('2024-11-05T10:00:00'), actor: 'Omar Khalil', actorType: 'ops', action: 'Violation created', toStatus: 'open' },
      { id: 'AL-003b', timestamp: new Date('2024-11-05T10:05:00'), actor: 'Omar Khalil', actorType: 'ops', action: 'Notice sent to seller', fromStatus: 'open', toStatus: 'sent_to_seller' },
      { id: 'AL-003c', timestamp: new Date('2024-11-07T09:30:00'), actor: 'Horizon Pharma Retail', actorType: 'seller', action: 'Seller replied', fromStatus: 'sent_to_seller', toStatus: 'acknowledged' },
      { id: 'AL-003d', timestamp: new Date('2024-11-20T16:00:00'), actor: 'Omar Khalil', actorType: 'ops', action: 'Verdict issued: Acquitted', fromStatus: 'acknowledged', toStatus: 'acquitted' },
    ],
    disputes: [], evidence: [],
  },

  // V-004: ACKNOWLEDGED — seller replied, no dispute
  {
    id: 'V-004', partnerID: '55789', countryCode: 'SA', mpCode: 'noon',
    idViolation: 'IP_TRADEMARK', violationDate: '2025-03-28',
    family: 'IP & Authenticity', severity: 'high', status: 'acknowledged',
    overallRisk: 'high', requestSource: 'Brand Report — Zara International',
    complaintTicket: 'CMP-9234', idPenalty: 'PNL-222', warningCount: 2,
    ticketOwner: 'Layla Mansour', messageToSeller: 'A trademark infringement report has been submitted against your listing SKU-DRSA2901 by Zara International, claiming your product uses the Zara trademark without authorization.',
    skuAsn: 'SKU-DRSA2901', brandCode: 'ZARA', brandName: 'Zara',
    createdAt: new Date('2025-03-28T11:00:00'), updatedAt: new Date('2025-04-01T14:30:00'),
    thread: [
      { id: 'TH-004a', violationId: 'V-004', sender: 'ops', senderName: 'Layla Mansour', content: 'A trademark infringement report has been filed against your listing...', sentAt: new Date('2025-03-28T11:00:00') },
      { id: 'TH-004b', violationId: 'V-004', sender: 'seller', senderName: 'Desert Rose Apparel', content: 'We acknowledge this notice. The product in question has been removed from our listings immediately. We are reviewing our sourcing process to ensure this does not recur.', sentAt: new Date('2025-04-01T14:30:00') },
    ],
    auditLog: [
      { id: 'AL-004a', timestamp: new Date('2025-03-28T11:00:00'), actor: 'Layla Mansour', actorType: 'ops', action: 'Violation created', toStatus: 'open' },
      { id: 'AL-004b', timestamp: new Date('2025-03-28T11:05:00'), actor: 'Layla Mansour', actorType: 'ops', action: 'Notice sent to seller', fromStatus: 'open', toStatus: 'sent_to_seller' },
      { id: 'AL-004c', timestamp: new Date('2025-04-01T14:30:00'), actor: 'Desert Rose Apparel', actorType: 'seller', action: 'Seller acknowledged, listing removed', fromStatus: 'sent_to_seller', toStatus: 'acknowledged' },
    ],
    disputes: [], evidence: [],
  },

  // V-005: OPEN — just created, notice not yet sent
  {
    id: 'V-005', partnerID: '23456', countryCode: 'KW', mpCode: 'noon',
    idViolation: 'SAFETY_DANGEROUS', violationDate: '2025-04-02',
    family: 'Safety & Compliance', severity: 'critical', status: 'open',
    overallRisk: 'critical', requestSource: 'Customer Complaint + Internal QA',
    complaintTicket: 'CMP-9401', warningCount: 1,
    ticketOwner: 'Nour Al-Rashid', messageToSeller: '',
    createdAt: new Date('2025-04-02T16:00:00'), updatedAt: new Date('2025-04-02T16:00:00'),
    disputes: [], thread: [], evidence: [],
    auditLog: [
      { id: 'AL-005a', timestamp: new Date('2025-04-02T16:00:00'), actor: 'Nour Al-Rashid', actorType: 'ops', action: 'Violation created', toStatus: 'open' },
    ],
  },

  // V-006: OVERTURNED — seller won the dispute
  {
    id: 'V-006', partnerID: '442777', countryCode: 'SA', mpCode: 'noon',
    idViolation: 'CONDUCT_RATING_MANIP', violationDate: '2025-01-15',
    family: 'Seller Conduct', severity: 'medium', status: 'overturned',
    overallRisk: 'medium', requestSource: 'Automated Flag — Review System',
    complaintTicket: 'CMP-8100', warningCount: 0,
    ticketOwner: 'Samira Haddad', messageToSeller: 'Our systems detected patterns consistent with rating manipulation on your store in SA.',
    createdAt: new Date('2025-01-15T10:00:00'), updatedAt: new Date('2025-02-10T15:00:00'),
    closedAt: new Date('2025-02-10T15:00:00'),
    disputes: [{
      id: 'DIS-006', violationId: 'V-006', sellerId: '442777',
      submittedAt: new Date('2025-01-20T09:00:00'),
      category: 'technical_error',
      explanation: 'The flagged reviews were from our verified purchase program. All reviewers were genuine customers who submitted receipts. The pattern detection appears to have been triggered by our holiday campaign timing, not actual manipulation.',
      evidence: [],
      slaDeadline: new Date('2025-02-20T09:00:00'),
      status: 'overturned', reviewedBy: 'Samira Haddad',
      resolution: 'overturned',
      resolutionNotes: 'After audit, all 47 flagged reviews confirmed as genuine verified purchases. System false positive. Violation overturned, health impact reversed.',
      resolvedAt: new Date('2025-02-10T15:00:00'),
      slaBreached: false,
    }],
    verdict: { type: 'acquitted', reason: 'Dispute upheld in favor of seller. All flagged reviews confirmed as genuine. System false positive. No action taken.', issuedBy: 'Samira Haddad', issuedAt: new Date('2025-02-10T15:00:00'), appealEligible: false },
    thread: [
      { id: 'TH-006a', violationId: 'V-006', sender: 'ops', senderName: 'Samira Haddad', content: 'Our systems detected patterns consistent with rating manipulation...', sentAt: new Date('2025-01-15T10:00:00') },
      { id: 'TH-006b', violationId: 'V-006', sender: 'seller', senderName: 'Al Fajr Electronics', content: 'These are verified purchase reviews from our legitimate holiday campaign. We are formally disputing this.', sentAt: new Date('2025-01-20T09:00:00'), isDisputeSubmission: true, disputeId: 'DIS-006' },
      { id: 'TH-006c', violationId: 'V-006', sender: 'ops', senderName: 'Samira Haddad', content: 'After full audit: dispute upheld. This was a system false positive. Violation overturned, all health impacts reversed. Apologies for the inconvenience.', sentAt: new Date('2025-02-10T15:00:00') },
    ],
    auditLog: [
      { id: 'AL-006a', timestamp: new Date('2025-01-15T10:00:00'), actor: 'system', actorType: 'system', action: 'Auto-flagged by review detection system', toStatus: 'open' },
      { id: 'AL-006b', timestamp: new Date('2025-01-15T10:30:00'), actor: 'Samira Haddad', actorType: 'ops', action: 'Notice sent to seller', fromStatus: 'open', toStatus: 'sent_to_seller' },
      { id: 'AL-006c', timestamp: new Date('2025-01-20T09:00:00'), actor: 'Al Fajr Electronics', actorType: 'seller', action: 'Dispute submitted', fromStatus: 'sent_to_seller', toStatus: 'disputed' },
      { id: 'AL-006d', timestamp: new Date('2025-01-21T10:00:00'), actor: 'Samira Haddad', actorType: 'ops', action: 'Dispute under review', fromStatus: 'disputed', toStatus: 'under_review' },
      { id: 'AL-006e', timestamp: new Date('2025-02-10T15:00:00'), actor: 'Samira Haddad', actorType: 'ops', action: 'Dispute resolved: Overturned', fromStatus: 'under_review', toStatus: 'overturned' },
    ],
    evidence: [],
  },

  // V-007: NO RESPONSE — SLA expired, seller never replied
  {
    id: 'V-007', partnerID: '67890', countryCode: 'EG', mpCode: 'noon',
    idViolation: 'COMPLIANCE_GRAY_MARKET', violationDate: '2025-04-10',
    family: 'Compliance & Legal', severity: 'high', status: 'no_response',
    overallRisk: 'high', requestSource: 'Brand Report — Samsung Electronics',
    complaintTicket: 'CMP-9502', idPenalty: 'PNL-550', warningCount: 4,
    ticketOwner: 'Omar Khalil', messageToSeller: 'We have received a report that products on your listings may be gray market Samsung goods not intended for sale in the MENA region. Please provide proof of authorized distribution within 5 business days.',
    brandCode: 'SAMSUNG', brandName: 'Samsung',
    createdAt: new Date('2025-04-10T09:00:00'), updatedAt: new Date('2025-04-18T09:00:00'),
    disputes: [], thread: [
      { id: 'TH-007a', violationId: 'V-007', sender: 'ops', senderName: 'Omar Khalil', content: 'We have received a report that products on your listings may be gray market Samsung goods...', sentAt: new Date('2025-04-10T09:00:00') },
      { id: 'TH-007b', violationId: 'V-007', sender: 'system', senderName: 'System', content: 'Automated reminder: 3 days remaining to respond to violation V-007.', sentAt: new Date('2025-04-14T09:00:00') },
      { id: 'TH-007c', violationId: 'V-007', sender: 'system', senderName: 'System', content: 'SLA expired. Seller did not respond within 5 business days. Status updated to No Response.', sentAt: new Date('2025-04-17T09:00:00') },
    ],
    auditLog: [
      { id: 'AL-007a', timestamp: new Date('2025-04-10T09:00:00'), actor: 'Omar Khalil', actorType: 'ops', action: 'Violation created', toStatus: 'open' },
      { id: 'AL-007b', timestamp: new Date('2025-04-10T09:05:00'), actor: 'Omar Khalil', actorType: 'ops', action: 'Notice sent to seller', fromStatus: 'open', toStatus: 'sent_to_seller' },
      { id: 'AL-007c', timestamp: new Date('2025-04-17T09:00:00'), actor: 'system', actorType: 'system', action: 'SLA expired, no seller response', fromStatus: 'sent_to_seller', toStatus: 'no_response' },
    ],
    evidence: [],
  },

  // V-008: UPHELD — seller disputed but lost
  {
    id: 'V-008', partnerID: '10555', countryCode: 'AE', mpCode: 'noon',
    idViolation: 'IP_COUNTERFEIT', violationDate: '2025-01-08',
    family: 'IP & Authenticity', severity: 'critical', status: 'upheld',
    overallRisk: 'critical', requestSource: 'Brand Report — Sony Corporation',
    complaintTicket: 'CMP-7900', idPenalty: 'PNL-381', actionCode: 'SUSPEND_SELLER_AE',
    warningCount: 2, ticketOwner: 'Layla Mansour',
    messageToSeller: 'A formal counterfeit complaint has been filed by Sony Corporation regarding your PS5 controller listings. These items have failed authentication checks.',
    brandCode: 'SONY', brandName: 'Sony', skuAsn: 'ASN-PS5-CTRL-001',
    createdAt: new Date('2025-01-08T10:00:00'), updatedAt: new Date('2025-02-05T17:00:00'),
    closedAt: new Date('2025-02-05T17:00:00'),
    disputes: [{
      id: 'DIS-008', violationId: 'V-008', sellerId: '10555',
      submittedAt: new Date('2025-01-15T14:00:00'),
      category: 'insufficient_evidence',
      explanation: 'We purchased these controllers from a legitimate wholesale supplier. We have the invoice and shipping documents.',
      evidence: [
        { id: 'DEV-008a', fileName: 'supplier_invoice.pdf', fileType: 'document', uploadedBy: 'seller', uploadedAt: new Date('2025-01-15T13:55:00'), url: '#', sizeMb: 0.6 },
      ],
      slaDeadline: new Date('2025-02-15T14:00:00'),
      status: 'upheld', reviewedBy: 'Layla Mansour',
      resolution: 'upheld',
      resolutionNotes: 'Sony authentication labs confirmed products are counterfeit. Supplier invoice was also found to be fraudulent. Violation upheld, account suspended in AE.',
      resolvedAt: new Date('2025-02-05T17:00:00'),
      slaBreached: false,
    }],
    verdict: { type: 'actioned', reason: 'Sony authentication confirmed counterfeit goods. Dispute rejected. Account suspended for AE marketplace. Warning 2 of 3 before permanent ban.', issuedBy: 'Layla Mansour', issuedAt: new Date('2025-02-05T17:00:00'), appealEligible: true },
    thread: [
      { id: 'TH-008a', violationId: 'V-008', sender: 'ops', senderName: 'Layla Mansour', content: 'A formal counterfeit complaint has been filed by Sony Corporation...', sentAt: new Date('2025-01-08T10:00:00') },
      { id: 'TH-008b', violationId: 'V-008', sender: 'seller', senderName: 'SkyMart Trading LLC', content: 'We dispute this. Products sourced legitimately. See attached invoice.', sentAt: new Date('2025-01-15T14:00:00'), isDisputeSubmission: true, disputeId: 'DIS-008' },
      { id: 'TH-008c', violationId: 'V-008', sender: 'ops', senderName: 'Layla Mansour', content: 'Dispute reviewed. Sony authentication labs confirmed counterfeits. Dispute is rejected. Verdict: Actioned. Your account has been suspended for the AE marketplace. This is warning 2 of 3.', sentAt: new Date('2025-02-05T17:00:00') },
    ],
    auditLog: [
      { id: 'AL-008a', timestamp: new Date('2025-01-08T10:00:00'), actor: 'Layla Mansour', actorType: 'ops', action: 'Violation created', toStatus: 'open' },
      { id: 'AL-008b', timestamp: new Date('2025-01-08T10:10:00'), actor: 'Layla Mansour', actorType: 'ops', action: 'Notice sent to seller', fromStatus: 'open', toStatus: 'sent_to_seller' },
      { id: 'AL-008c', timestamp: new Date('2025-01-15T14:00:00'), actor: 'SkyMart Trading LLC', actorType: 'seller', action: 'Dispute submitted', fromStatus: 'sent_to_seller', toStatus: 'disputed' },
      { id: 'AL-008d', timestamp: new Date('2025-01-16T09:00:00'), actor: 'Layla Mansour', actorType: 'ops', action: 'Escalated to Sony authentication', fromStatus: 'disputed', toStatus: 'under_review' },
      { id: 'AL-008e', timestamp: new Date('2025-02-05T17:00:00'), actor: 'Layla Mansour', actorType: 'ops', action: 'Dispute upheld, verdict: Actioned', fromStatus: 'under_review', toStatus: 'upheld' },
    ],
    evidence: [
      { id: 'EV-008a', fileName: 'sony_auth_report.pdf', fileType: 'document', uploadedBy: 'ops', uploadedAt: new Date('2025-02-04T14:00:00'), url: '#', sizeMb: 2.3 },
    ],
  },

  // V-009: SENT_TO_SELLER — awaiting seller response
  {
    id: 'V-009', partnerID: '67890', countryCode: 'EG', mpCode: 'noon',
    idViolation: 'FRAUD_MISREPRESENTATION', violationDate: '2025-04-18',
    family: 'Fraud & Deception', severity: 'high', status: 'sent_to_seller',
    overallRisk: 'high', requestSource: 'Customer Complaint Cluster',
    complaintTicket: 'CMP-9601', warningCount: 2,
    ticketOwner: 'Nour Al-Rashid', messageToSeller: 'We have received 12 customer complaints in the past 30 days reporting that products delivered from your store do not match listing descriptions. This pattern constitutes a product misrepresentation violation.',
    createdAt: new Date('2025-04-18T11:00:00'), updatedAt: new Date('2025-04-18T11:05:00'),
    disputes: [], thread: [
      { id: 'TH-009a', violationId: 'V-009', sender: 'ops', senderName: 'Nour Al-Rashid', content: 'We have received 12 customer complaints in the past 30 days...', sentAt: new Date('2025-04-18T11:05:00') },
    ],
    auditLog: [
      { id: 'AL-009a', timestamp: new Date('2025-04-18T11:00:00'), actor: 'Nour Al-Rashid', actorType: 'ops', action: 'Violation created', toStatus: 'open' },
      { id: 'AL-009b', timestamp: new Date('2025-04-18T11:05:00'), actor: 'Nour Al-Rashid', actorType: 'ops', action: 'Notice sent to seller', fromStatus: 'open', toStatus: 'sent_to_seller' },
    ],
    evidence: [],
  },

  // V-010: ACTIONED — severe, closed with suspension
  {
    id: 'V-010', partnerID: '67890', countryCode: 'SA', mpCode: 'noon',
    idViolation: 'COMPLIANCE_GRAY_MARKET', violationDate: '2025-03-01',
    family: 'Compliance & Legal', severity: 'critical', status: 'actioned',
    overallRisk: 'critical', requestSource: 'Brand Report + Internal Investigation',
    complaintTicket: 'CMP-8750', idPenalty: 'PNL-430', actionCode: 'ACCOUNT_SUSPENSION',
    warningCount: 5, ticketOwner: 'Omar Khalil',
    messageToSeller: 'This is your 5th gray market violation. Your account has been permanently suspended per our repeat violation policy.',
    createdAt: new Date('2025-03-01T10:00:00'), updatedAt: new Date('2025-03-15T16:00:00'),
    closedAt: new Date('2025-03-15T16:00:00'),
    verdict: { type: 'actioned', reason: 'Fifth gray market violation. Account permanently suspended per repeat violation policy section 4.3.', issuedBy: 'Omar Khalil', issuedAt: new Date('2025-03-15T16:00:00'), appealEligible: false },
    disputes: [], thread: [], evidence: [],
    auditLog: [
      { id: 'AL-010a', timestamp: new Date('2025-03-01T10:00:00'), actor: 'Omar Khalil', actorType: 'ops', action: 'Violation created', toStatus: 'open' },
      { id: 'AL-010b', timestamp: new Date('2025-03-01T10:05:00'), actor: 'Omar Khalil', actorType: 'ops', action: 'Notice sent to seller', fromStatus: 'open', toStatus: 'sent_to_seller' },
      { id: 'AL-010c', timestamp: new Date('2025-03-10T09:00:00'), actor: 'system', actorType: 'system', action: 'SLA expired, no response', fromStatus: 'sent_to_seller', toStatus: 'no_response' },
      { id: 'AL-010d', timestamp: new Date('2025-03-15T16:00:00'), actor: 'Omar Khalil', actorType: 'ops', action: 'Verdict issued: Account suspended', fromStatus: 'no_response', toStatus: 'actioned' },
    ],
  },
];

// ─── All disputes (flat list for the disputes queue) ──────────────────────────

export const mockDisputes = mockViolations
  .flatMap(v => v.disputes ?? []);

// ─── Message Templates ────────────────────────────────────────────────────────

export const mockMessageTemplates: MessageTemplate[] = [
  {
    id: 'T-001', name: 'IP Counterfeit Notice', violationType: 'IP_COUNTERFEIT',
    severity: 'critical', isActive: true, createdBy: 'Admin',
    description: 'Formal notice for counterfeit product violations.',
    template: 'Dear Partner {sellerId},\n\nWe have received a brand protection report (Ticket: {projectId}) regarding a potential counterfeit item on your store. The reported listing (SKU/ASN: {skuAsn}) has been temporarily suspended pending investigation.\n\nWarning Count: {violationCount} of 3\n\nPlease provide proof of product authenticity within 5 business days to avoid further action.\n\nRegards,\nSTP Trust & Safety Team',
    createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'T-002', name: 'Seller Conduct Warning', violationType: 'CONDUCT_FAKE_REVIEWS',
    severity: 'high', isActive: true, createdBy: 'Admin',
    description: 'Warning for review manipulation or fake review activity.',
    template: 'Dear Partner {sellerId},\n\nOur trust & safety systems have detected activity on your account that violates our seller conduct policy (Ticket: {projectId}).\n\nWarning {violationCount} has been issued. Continued violations may result in account suspension.\n\nPlease review our Seller Conduct Policy and ensure compliance.\n\nRegards,\nSTP Trust & Safety Team',
    createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'T-003', name: 'Trademark Infringement Notice', violationType: 'IP_TRADEMARK',
    severity: 'high', isActive: true, createdBy: 'Admin',
    description: 'Notice for trademark / unauthorized brand use violations.',
    template: 'Dear Partner {sellerId},\n\nA trademark infringement report has been filed against your listing ({skuAsn}) by {brandName} (Ticket: {projectId}).\n\nThe listing has been removed. This is warning {violationCount}.\n\nTo reinstate, provide authorization documentation from the brand owner.\n\nRegards,\nSTP Trust & Safety Team',
    createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'T-004', name: 'Gray Market Warning', violationType: 'COMPLIANCE_GRAY_MARKET',
    severity: 'high', isActive: true, createdBy: 'Admin',
    description: 'Warning for gray market / parallel import goods.',
    template: 'Dear Partner {sellerId},\n\nWe have identified products on your store that appear to be gray market goods not authorized for sale in this region (Ticket: {projectId}).\n\nWarning: {violationCount} issued. Please provide regional distribution authorization.\n\nRegards,\nSTP Trust & Safety Team',
    createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01'),
  },
];

export const mockTemplatePlaceholders: TemplatePlaceholder[] = [
  { key: '{sellerId}', label: 'Seller ID', description: 'The partner/seller ID', example: '442777' },
  { key: '{projectId}', label: 'Violation / Ticket ID', description: 'The complaint ticket reference', example: 'CMP-8821' },
  { key: '{violationCount}', label: 'Warning Count', description: 'Current warning count', example: '2' },
  { key: '{brandName}', label: 'Brand Name', description: 'The affected brand', example: 'Apple' },
  { key: '{skuAsn}', label: 'SKU / ASN', description: 'The specific product identifier', example: 'ASN-99201' },
];

// ─── Analytics ────────────────────────────────────────────────────────────────

export const mockViolationTrend: ViolationTrendPoint[] = [
  { date: 'Apr 1', count: 4, disputes: 1, resolved: 2 },
  { date: 'Apr 3', count: 7, disputes: 2, resolved: 3 },
  { date: 'Apr 5', count: 5, disputes: 1, resolved: 4 },
  { date: 'Apr 7', count: 9, disputes: 3, resolved: 5 },
  { date: 'Apr 9', count: 6, disputes: 2, resolved: 6 },
  { date: 'Apr 11', count: 11, disputes: 4, resolved: 4 },
  { date: 'Apr 13', count: 8, disputes: 2, resolved: 7 },
  { date: 'Apr 15', count: 13, disputes: 5, resolved: 6 },
  { date: 'Apr 17', count: 10, disputes: 3, resolved: 8 },
  { date: 'Apr 19', count: 7, disputes: 1, resolved: 5 },
  { date: 'Apr 21', count: 14, disputes: 4, resolved: 9 },
  { date: 'Apr 23', count: 9, disputes: 3, resolved: 7 },
  { date: 'Apr 25', count: 12, disputes: 3, resolved: 10 },
  { date: 'Apr 27', count: 8, disputes: 2, resolved: 6 },
  { date: 'Apr 29', count: 11, disputes: 4, resolved: 8 },
];

export const mockViolationByType: ViolationByType[] = [
  { code: 'IP_COUNTERFEIT', label: 'Counterfeit Goods', count: 38, openCount: 9, disputeRate: 62, avgResolutionDays: 14 },
  { code: 'COMPLIANCE_GRAY_MARKET', label: 'Gray Market', count: 27, openCount: 6, disputeRate: 44, avgResolutionDays: 9 },
  { code: 'CONDUCT_FAKE_REVIEWS', label: 'Fake Reviews', count: 21, openCount: 5, disputeRate: 55, avgResolutionDays: 7 },
  { code: 'IP_TRADEMARK', label: 'Trademark Infringement', count: 19, openCount: 4, disputeRate: 47, avgResolutionDays: 11 },
  { code: 'FRAUD_MISREPRESENTATION', label: 'Product Misrepresentation', count: 15, openCount: 3, disputeRate: 33, avgResolutionDays: 5 },
  { code: 'SAFETY_DANGEROUS', label: 'Dangerous Goods', count: 12, openCount: 2, disputeRate: 25, avgResolutionDays: 3 },
  { code: 'CONDUCT_RATING_MANIP', label: 'Rating Manipulation', count: 9, openCount: 1, disputeRate: 67, avgResolutionDays: 12 },
  { code: 'COMPLIANCE_PRICE_FIX', label: 'Price Fixing', count: 6, openCount: 0, disputeRate: 83, avgResolutionDays: 18 },
];

// ─── ZohoTickets (legacy — kept for existing components) ──────────────────────

export const mockZohoTickets = mockViolations.map(v => ({
  id: `ZT-${v.id}`, violationId: v.id,
  subject: `Violation ${v.id} — ${v.idViolation}`,
  description: v.messageToSeller,
  status: v.status === 'closed' || v.status === 'actioned' || v.status === 'acquitted' ? 'closed' as const : 'open' as const,
  priority: (v.severity === 'critical' ? 'urgent' : v.severity === 'high' ? 'high' : v.severity === 'medium' ? 'medium' : 'low') as 'urgent' | 'high' | 'medium' | 'low',
  assignedTo: v.ticketOwner, sellerId: v.partnerID,
  createdAt: v.createdAt, updatedAt: v.updatedAt,
}));
