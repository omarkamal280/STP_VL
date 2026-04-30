// ─── Enumerations ─────────────────────────────────────────────────────────────

export type ViolationStatus =
  | 'open'
  | 'sent_to_seller'
  | 'acknowledged'
  | 'disputed'
  | 'under_review'
  | 'upheld'
  | 'overturned'
  | 'partial'
  | 'no_response'
  | 'actioned'
  | 'acquitted'
  | 'closed'
  | 'active'
  | 'enforced'
  | 'exonerated';

export type ViolationSeverity = 'low' | 'medium' | 'high' | 'critical';
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';
export type AccountHealth = 'Excellent' | 'Good' | 'Fair' | 'At Risk' | 'Suspended';
export type RiskTier = 'low' | 'medium' | 'high' | 'critical';
export type DisputeStatus = 'open' | 'under_review' | 'upheld' | 'overturned' | 'partial' | 'withdrawn' | 'pending' | 'resolved';
export type DisputeCategory =
  | 'insufficient_evidence'
  | 'wrong_seller'
  | 'already_resolved'
  | 'policy_misapplication'
  | 'technical_error'
  | 'other';
export type FileType = 'image' | 'document' | 'video' | 'other';
export type ActorType = 'ops' | 'seller' | 'system';
export type VerdictType = 'actioned' | 'acquitted';

// ─── Evidence ─────────────────────────────────────────────────────────────────

export interface EvidenceAttachment {
  id: string;
  fileName: string;
  fileType: FileType;
  uploadedBy: ActorType;
  uploadedAt: Date;
  url: string;
  sizeMb: number;
}

// ─── Audit Log ────────────────────────────────────────────────────────────────

export interface AuditEvent {
  id: string;
  timestamp: Date;
  actor: string;
  actorType: ActorType;
  action: string;
  fromStatus?: ViolationStatus;
  toStatus?: ViolationStatus;
  notes?: string;
}

// ─── Thread Message ───────────────────────────────────────────────────────────

export interface ThreadMessage {
  id: string;
  violationId: string;
  sender: ActorType;
  senderName: string;
  content: string;
  sentAt: Date;
  isDisputeSubmission?: boolean;
  disputeId?: string;
  attachments?: EvidenceAttachment[];
  readAt?: Date;
}

// ─── Verdict ──────────────────────────────────────────────────────────────────

export interface Verdict {
  type: VerdictType;
  reason: string;
  issuedBy: string;
  issuedAt: Date;
  appealEligible: boolean;
}

// ─── Dispute (first-class entity) ─────────────────────────────────────────────

export interface Dispute {
  id: string;
  violationId: string;
  sellerId: string;
  submittedAt: Date;
  category: DisputeCategory;
  explanation: string;
  evidence: EvidenceAttachment[];
  slaDeadline: Date;
  status: DisputeStatus;
  reviewedBy?: string;
  resolution?: 'upheld' | 'overturned' | 'partial';
  resolutionNotes?: string;
  resolvedAt?: Date;
  slaBreached: boolean;
}

// ─── Violation (rich lifecycle model) ─────────────────────────────────────────

export interface Violation {
  id: string;
  partnerID: string;
  countryCode: string;
  mpCode: string;
  idViolation: string;
  violationDate: string;
  family: string;
  severity: ViolationSeverity;
  status: ViolationStatus;
  overallRisk: RiskLevel;
  requestSource: string;
  complaintTicket: string;
  idPenalty?: string;
  actionCode?: string;
  warningCount: number;
  privateNotes?: string;
  ticketOwner: string;
  messageToSeller: string;
  brandCode?: string;
  brandName?: string;
  skuAsn?: string;
  investigationType?: string;
  investigationStatus?: string;
  triggeredByFlag?: boolean;
  investigatedAcquitted?: boolean;
  actionOnOffers?: string;
  disapprovalReason?: string;
  actionedReason?: string;
  approver2?: string;
  channel?: string;
  misc?: string;
  currentSellerRating?: string;
  disputes?: Dispute[];
  thread?: ThreadMessage[];
  auditLog?: AuditEvent[];
  evidence?: EvidenceAttachment[];
  createdAt: Date;
  updatedAt: Date;
  closedAt?: Date;
  verdict?: Verdict;
  healthImpactSuspended?: boolean;
  // Legacy fields (backward compat with old components)
  sellerId?: string;
  projectId?: string;
  type?: string;
  description?: string;
  zohoTicketId?: string;
  attachments?: string[];
}

// ─── Seller Profile ───────────────────────────────────────────────────────────

export interface PatternAlert {
  type: string;
  description: string;
  count: number;
  detectedAt: Date;
  severity: 'warning' | 'critical';
}

export interface SellerProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  countries: string[];
  accountHealth: AccountHealth;
  riskScore: number;
  riskTier: RiskTier;
  sellerRating: number;
  priorViolations: number;
  activeViolations: number;
  disputeSuccessRate: number;
  responseRate: number;
  avgResponseDays: number;
  lastViolation?: { label: string; date: string; outcome: string };
  joinedAt: Date;
  totalOrders: number;
  gmvUSD: number;
  patternAlerts: PatternAlert[];
  healthHistory: { date: string; score: number }[];
}

// ─── Analytics ────────────────────────────────────────────────────────────────

export interface ViolationTrendPoint {
  date: string;
  count: number;
  disputes: number;
  resolved: number;
}

export interface ViolationByType {
  code: string;
  label: string;
  count: number;
  openCount: number;
  disputeRate: number;
  avgResolutionDays: number;
}

// ─── Templates ────────────────────────────────────────────────────────────────

export interface MessageTemplate {
  id: string;
  name: string;
  description: string;
  violationType: string;
  severity: ViolationSeverity;
  template: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface TemplatePlaceholder {
  key: string;
  label: string;
  description: string;
  example: string;
}

// ─── Legacy / Bulk (kept for existing components) ─────────────────────────────

export interface BulkViolation {
  sellerId: string;
  projectId: string;
  type: string;
  severity: ViolationSeverity;
  description: string;
  messageToSeller?: string;
}

export interface ZohoTicket {
  id: string;
  violationId: string;
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo: string;
  createdAt: Date;
  updatedAt: Date;
  sellerId: string;
}
