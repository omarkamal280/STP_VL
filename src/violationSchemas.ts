export interface ViolationCodeField {
  field: string;
  label: string;
  required?: boolean;
  type?: 'text' | 'checkbox' | 'select';
  selectOptions?: { value: string; label: string }[];
}

export interface ViolationCode {
  code: string;
  label: string;
  family: string;
  description: string;
  step2Fields: ViolationCodeField[];
}

// const INVESTIGATION_STATUS_OPTS = [
//   { value: 'pending', label: 'Pending' },
//   { value: 'in_progress', label: 'In Progress' },
//   { value: 'completed', label: 'Completed' },
//   { value: 'closed', label: 'Closed' },
// ];

// const IP_FIELDS: ViolationCodeField[] = [
//   { field: 'brandCode',   label: 'Brand Code',           required: true },
//   { field: 'brandName',   label: 'Brand Name',           required: true },
//   { field: 'skuAsn',      label: 'SKU / ASN',            required: true },
//   { field: 'investigationType',   label: 'Investigation Type' },
//   { field: 'investigationStatus', label: 'Investigation Status', type: 'select', selectOptions: INVESTIGATION_STATUS_OPTS },
//   { field: 'actionOnOffers',      label: 'Action on Offers / SKUs' },
//   { field: 'disapprovalReason',   label: 'Disapproval Reason' },
//   { field: 'investigatedAcquitted', label: 'Investigated & Acquitted', type: 'checkbox' },
// ];

// const COMPLIANCE_FIELDS: ViolationCodeField[] = [
//   { field: 'skuAsn',              label: 'SKU / ASN',          required: true },
//   { field: 'actionOnOffers',      label: 'Action on Offers / SKUs' },
//   { field: 'disapprovalReason',   label: 'Disapproval Reason' },
// ];

// const FRAUD_FIELDS: ViolationCodeField[] = [
//   { field: 'investigationType',   label: 'Investigation Type',   required: true },
//   { field: 'investigationStatus', label: 'Investigation Status', required: true, type: 'select', selectOptions: INVESTIGATION_STATUS_OPTS },
//   { field: 'triggeredByFlag',     label: 'Triggered by Flag',   type: 'checkbox' },
//   { field: 'skuAsn',              label: 'SKU / ASN (if applicable)' },
//   { field: 'investigatedAcquitted', label: 'Investigated & Acquitted', type: 'checkbox' },
// ];

// const LEGAL_FIELDS: ViolationCodeField[] = [
//   { field: 'investigationType',   label: 'Investigation Type',   required: true },
//   { field: 'investigationStatus', label: 'Investigation Status', required: true, type: 'select', selectOptions: INVESTIGATION_STATUS_OPTS },
//   { field: 'approver2',           label: 'Approver 2' },
// ];

// const ACCOUNT_FIELDS: ViolationCodeField[] = [
//   { field: 'investigationType',   label: 'Investigation Type' },
//   { field: 'investigationStatus', label: 'Investigation Status', type: 'select', selectOptions: INVESTIGATION_STATUS_OPTS },
//   { field: 'approver2',           label: 'Approver 2' },
// ];

// const CONDUCT_FIELDS: ViolationCodeField[] = [
//   { field: 'channel',             label: 'Channel',              required: true },
//   { field: 'investigationType',   label: 'Investigation Type' },
//   { field: 'investigationStatus', label: 'Investigation Status', type: 'select', selectOptions: INVESTIGATION_STATUS_OPTS },
// ];

// const CATALOG_FIELDS: ViolationCodeField[] = [
//   { field: 'skuAsn',              label: 'SKU / ASN',            required: true },
//   { field: 'brandCode',           label: 'Brand Code' },
//   { field: 'brandName',           label: 'Brand Name' },
//   { field: 'actionOnOffers',      label: 'Action on Offers / SKUs' },
// ];

const PLACEHOLDER_FIELDS: ViolationCodeField[] = [
  { field: 'placeholder', label: 'Placeholder field' },
];

export const VIOLATION_CODES: ViolationCode[] = [
  { code: 'IP_VIOLATION',       label: 'IP Violation',                   family: 'Intellectual Property', description: 'Seller is infringing intellectual property rights of a brand.',               step2Fields: PLACEHOLDER_FIELDS },
  { code: 'FALSE_BRAND_REP',    label: 'False Brand Representation',     family: 'Intellectual Property', description: 'Seller falsely represents a brand without authorisation.',                  step2Fields: PLACEHOLDER_FIELDS },
  { code: 'COUNTERFEIT_SALE',   label: 'Counterfeit Sale',               family: 'Intellectual Property', description: 'Seller is selling counterfeit products.',                                  step2Fields: PLACEHOLDER_FIELDS },
  { code: 'COUNTERFEIT_LISTING',label: 'Counterfeit Listing',            family: 'Intellectual Property', description: 'Seller has listed counterfeit products without a completed sale.',          step2Fields: PLACEHOLDER_FIELDS },
  { code: 'PROHIBITED_PRODUCT', label: 'Prohibited Product',             family: 'Compliance',            description: 'Seller is selling products that are prohibited on the platform.',          step2Fields: PLACEHOLDER_FIELDS },
  { code: 'PROHIBITED_LISTING', label: 'Prohibited Listing',             family: 'Compliance',            description: 'Seller has listed items that are restricted or not allowed.',              step2Fields: PLACEHOLDER_FIELDS },
  { code: 'FAKE_DOCUMENT',      label: 'Fake Document Submission',       family: 'Fraud',                 description: 'Seller submitted fraudulent documents during onboarding or compliance.',   step2Fields: PLACEHOLDER_FIELDS },
  { code: 'FRAUDULENT_DISPUTE', label: 'Fraudulent Dispute',             family: 'Fraud',                 description: 'Seller filed a dispute in bad faith or with falsified information.',       step2Fields: PLACEHOLDER_FIELDS },
  { code: 'MONEY_LAUNDERING',   label: 'Money Laundering',               family: 'Fraud',                 description: 'Seller account suspected of being used for financial crimes.',             step2Fields: PLACEHOLDER_FIELDS },
  { code: 'FAKE_FEEDBACK',      label: 'Fake Feedback / Reviews',        family: 'Fraud',                 description: 'Seller manipulates review or rating system with fake feedback.',           step2Fields: PLACEHOLDER_FIELDS },
  { code: 'OFFER_ABUSE',        label: 'Offer / Promotion Abuse',        family: 'Fraud',                 description: 'Seller abuses platform promotion or pricing mechanisms.',                  step2Fields: PLACEHOLDER_FIELDS },
  { code: 'MALICIOUS_ORDER',    label: 'Malicious Order Activity',       family: 'Fraud',                 description: 'Seller engages in malicious ordering patterns to harm competitors.',       step2Fields: PLACEHOLDER_FIELDS },
  { code: 'FALSE_LEGAL_ACTION', label: 'False Legal Action Threat',      family: 'Legal',                 description: 'Seller threatens or files false legal actions against the platform.',      step2Fields: PLACEHOLDER_FIELDS },
  { code: 'DUPLICATE_ACCOUNT',  label: 'Duplicate Account',              family: 'Account',               description: 'Seller operates multiple accounts in violation of platform policy.',       step2Fields: PLACEHOLDER_FIELDS },
  { code: 'ABUSIVE_COMM',       label: 'Abusive Communication',          family: 'Conduct',               description: 'Seller communicates in an abusive, threatening, or harassing manner.',    step2Fields: PLACEHOLDER_FIELDS },
  { code: 'ABUSIVE_CONDUCT',    label: 'Abusive Conduct',                family: 'Conduct',               description: 'Seller exhibits abusive behaviour towards customers or platform staff.',  step2Fields: PLACEHOLDER_FIELDS },
  { code: 'IMPROPER_RATING',    label: 'Improper Rating Manipulation',   family: 'Conduct',               description: 'Seller manipulates or disputes ratings in an improper way.',               step2Fields: PLACEHOLDER_FIELDS },
  { code: 'DUPLICATE_LISTING',  label: 'Duplicate Listing',              family: 'Catalog',               description: 'Seller has created duplicate listings for the same product.',              step2Fields: PLACEHOLDER_FIELDS },
];

export const COUNTRY_LABELS: Record<string, string> = {
  AE: 'UAE', SA: 'Saudi Arabia', EG: 'Egypt', KW: 'Kuwait',
  QA: 'Qatar', BH: 'Bahrain', OM: 'Oman',
};
