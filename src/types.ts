// Violation lifecycle (matches state diagram):
//   sanctioned → seller responds → acknowledged | disputed
//   disputed → analyst reviews → upheld | dismissed
//   acknowledged → analyst reviews fix → closed | insufficient
//   insufficient → seller resubmits → acknowledged
//   upheld → admin only → appealed
//   appealed → admin final review → upheld | dismissed
//   any state → voided (admin only, hidden from seller)

export type ViolationStatus =
  | 'sanctioned'    // raised by ops; seller liable, penalties apply; awaiting seller response
  | 'disputed'      // seller submitted a dispute; internal team investigating
  | 'acknowledged'  // seller accepted and is providing fix evidence; analyst reviewing
  | 'insufficient'  // analyst flagged the seller's fix evidence as missing info; seller must resubmit
  | 'fixed'        // analyst accepted the fix; violation stands and points apply, no further enforcement
  | 'upheld'        // analyst upheld disputed violation; seller liable, only admins can move to appealed
  | 'appealed'      // admin escalated for second & final review; admin only
  | 'dismissed'     // dispute accepted on merits; seller cleared, no penalty (terminal)
  | 'voided';       // admin voided due to process/claim errors; hidden from seller (terminal)

export interface POADocument {
  title: string;
  summary: string;
  steps: string[];
}

export interface Violation {
  id: string;
  sellerId: string;
  projectId: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  messageToSeller?: string;
  createdAt: Date;
  status: ViolationStatus;
  evidence?: string[];
  attachments?: string[];
  zohoTicketId?: string;
  poa?: POADocument;
  assignedTo?: string;
}

export interface Dispute {
  id: string;
  violationId: string;
  sellerId: string;
  reason: string;
  evidence: string[];
  submittedAt: Date;
  status: 'pending' | 'upheld' | 'appealed' | 'dismissed';
  opsReply?: string;
  opsRepliedAt?: Date;
  opsRepliedBy?: string;
}

export interface Acknowledgment {
  id: string;
  violationId: string;
  sellerId: string;
  poaFollowed: string;
  submittedAt: Date;
  status: 'pending' | 'accepted';
  opsReply?: string;
  opsRepliedAt?: Date;
  opsRepliedBy?: string;
}

export interface BulkViolation {
  sellerId: string;
  projectId: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
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

export interface MessageTemplate {
  id: string;
  name: string;
  description: string;
  violationType: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
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

export interface CallToAction {
  id: string;
  name: string;
  description: string;
}
