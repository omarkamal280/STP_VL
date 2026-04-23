export interface Violation {
  id: string;
  sellerId: string;
  projectId: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  messageToSeller?: string;
  createdAt: Date;
  status: 'active' | 'disputed' | 'enforced' | 'exonerated';
  evidence?: string[];
  attachments?: string[];
  zohoTicketId?: string;
}

export interface Dispute {
  id: string;
  violationId: string;
  sellerId: string;
  reason: string;
  evidence: string[];
  submittedAt: Date;
  status: 'pending' | 'under_review' | 'resolved';
  resolution?: {
    action: 'enforced' | 'exonerated';
    reply: string;
    resolvedAt: Date;
    resolvedBy: string;
  };
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
