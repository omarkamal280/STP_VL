export interface ViolationCodeField {
  field: string;
  label: string;
  required?: boolean;
  type?: 'text' | 'checkbox' | 'select';
  selectOptions?: { value: string; label: string }[];
  csvColumn?: string;
}

export interface ViolationCode {
  id: number;
  code: string;
  label: string;
  family: string;
  description: string;
  step2Fields: ViolationCodeField[];
  requiredCtaIds: string[];
}

const OFFER_FIELDS: ViolationCodeField[] = [
  { field: 'offerCode',       label: 'Offer Code',       required: true,  csvColumn: 'offer_code' },
  { field: 'sku',             label: 'SKU',              required: true,  csvColumn: 'sku' },
  { field: 'brandCode',       label: 'Brand Code',       required: true,  csvColumn: 'brand_code' },
  { field: 'productFulltype', label: 'Product Full Type',                 csvColumn: 'product_fulltype' },
  { field: 'categoryComcat',  label: 'Category / Comcat',                 csvColumn: 'category_comcat' },
];

const ORDER_OFFER_FIELDS: ViolationCodeField[] = [
  { field: 'itemNr',          label: 'Item Nr',          required: true,  csvColumn: 'item_nr' },
  { field: 'orderNr',         label: 'Order Nr',         required: true,  csvColumn: 'order_nr' },
  { field: 'offerCode',       label: 'Offer Code',       required: true,  csvColumn: 'offer_code' },
  { field: 'sku',             label: 'SKU',              required: true,  csvColumn: 'sku' },
  { field: 'brandCode',       label: 'Brand Code',       required: true,  csvColumn: 'brand_code' },
  { field: 'productFulltype', label: 'Product Full Type',                 csvColumn: 'product_fulltype' },
  { field: 'categoryComcat',  label: 'Category / Comcat',                 csvColumn: 'category_comcat' },
];

const MULTIPLE_ACCOUNTS_FIELDS: ViolationCodeField[] = [
  { field: 'linkedPartnerId',   label: 'Linked Partner ID',    required: true, csvColumn: 'id_partner' },
  { field: 'linkedCountryCode', label: 'Linked Country Code',  required: true, csvColumn: 'country_code' },
  { field: 'linkageType',       label: 'Linkage Type',         required: true, csvColumn: 'linkage_type' },
  { field: 'linkingParameter',  label: 'Linking Parameter',    required: true, csvColumn: 'linking_parameter' },
];

export const VIOLATION_CODES: ViolationCode[] = [
  {
    id: 1,  code: 'listing_restricted',        label: 'Listing Restricted',
    family: 'Compliance',
    description: 'Seller has one or more listings that are restricted on the platform.',
    step2Fields: OFFER_FIELDS,
    requiredCtaIds: ['CTA-06', 'CTA-07'],
  },
  {
    id: 2,  code: 'listing_counterfeit',        label: 'Listing Counterfeit',
    family: 'Intellectual Property',
    description: 'Seller has listed counterfeit products without a completed sale.',
    step2Fields: OFFER_FIELDS,
    requiredCtaIds: ['CTA-01', 'CTA-02'],
  },
  {
    id: 3,  code: 'sale_counterfeit',           label: 'Sale Counterfeit',
    family: 'Intellectual Property',
    description: 'Seller completed a sale of counterfeit products.',
    step2Fields: ORDER_OFFER_FIELDS,
    requiredCtaIds: ['CTA-01', 'CTA-02', 'CTA-09'],
  },
  {
    id: 4,  code: 'rating_solicitation',        label: 'Rating Solicitation',
    family: 'Conduct',
    description: 'Seller solicited ratings or reviews in violation of platform policy.',
    step2Fields: ORDER_OFFER_FIELDS,
    requiredCtaIds: ['CTA-12', 'CTA-13'],
  },
  {
    id: 5,  code: 'behavior_battery',           label: 'Battery',
    family: 'Conduct',
    description: 'Seller engaged in battery against a customer or platform representative.',
    step2Fields: [],
    requiredCtaIds: ['CTA-14', 'CTA-15', 'CTA-09'],
  },
  {
    id: 6,  code: 'behavior_assault',           label: 'Assault',
    family: 'Conduct',
    description: 'Seller engaged in assault against a customer or platform representative.',
    step2Fields: [],
    requiredCtaIds: ['CTA-14', 'CTA-15', 'CTA-09'],
  },
  {
    id: 7,  code: 'behavior_stock_blocking',    label: 'Stock Blocking',
    family: 'Fraud',
    description: 'Seller blocked competitor stock through malicious ordering.',
    step2Fields: ORDER_OFFER_FIELDS,
    requiredCtaIds: ['CTA-09', 'CTA-18'],
  },
  {
    id: 8,  code: 'behavior_offer_abuse',       label: 'Offer Abuse',
    family: 'Fraud',
    description: 'Seller abused platform offer or promotion mechanisms.',
    step2Fields: ORDER_OFFER_FIELDS,
    requiredCtaIds: ['CTA-10', 'CTA-09'],
  },
  {
    id: 9,  code: 'rating_manipulation',        label: 'Rating Manipulation',
    family: 'Conduct',
    description: 'Seller manipulates the ratings or review system.',
    step2Fields: ORDER_OFFER_FIELDS,
    requiredCtaIds: ['CTA-12', 'CTA-13'],
  },
  {
    id: 10, code: 'behavior_money_laundering',  label: 'Money Laundering',
    family: 'Fraud',
    description: 'Seller account suspected of being used for financial crimes.',
    step2Fields: ORDER_OFFER_FIELDS,
    requiredCtaIds: ['CTA-09', 'CTA-18'],
  },
  {
    id: 11, code: 'behavior_fraud_dispute',     label: 'Fraud / Dispute',
    family: 'Fraud',
    description: 'Seller filed a dispute in bad faith or with falsified information.',
    step2Fields: ORDER_OFFER_FIELDS,
    requiredCtaIds: ['CTA-09', 'CTA-15'],
  },
  {
    id: 12, code: 'account_forgery',            label: 'Account Forgery',
    family: 'Account',
    description: 'Seller submitted forged documents or falsified account information.',
    step2Fields: [],
    requiredCtaIds: ['CTA-08', 'CTA-09'],
  },
  {
    id: 13, code: 'account_multiple_accounts',  label: 'Multiple Accounts',
    family: 'Account',
    description: 'Seller operates multiple accounts in violation of platform policy.',
    step2Fields: MULTIPLE_ACCOUNTS_FIELDS,
    requiredCtaIds: ['CTA-16', 'CTA-09'],
  },
  {
    id: 14, code: 'listing_duplicate',          label: 'Listing Duplicate',
    family: 'Catalog',
    description: 'Seller has created duplicate listings for the same product.',
    step2Fields: OFFER_FIELDS,
    requiredCtaIds: ['CTA-17'],
  },
  {
    id: 15, code: 'legal_false_lawsuit',        label: 'Legal / False Lawsuit',
    family: 'Legal',
    description: 'Seller threatens or files a false legal action against the platform.',
    step2Fields: [],
    requiredCtaIds: ['CTA-18'],
  },
  {
    id: 16, code: 'behavior_impersonation',     label: 'Behavior Impersonation',
    family: 'Conduct',
    description: 'Seller impersonates another seller, brand, or platform entity.',
    step2Fields: [],
    requiredCtaIds: ['CTA-14', 'CTA-15'],
  },
  {
    id: 17, code: 'sale_restricted',            label: 'Sale Restricted',
    family: 'Compliance',
    description: 'Seller completed a sale of restricted products.',
    step2Fields: ORDER_OFFER_FIELDS,
    requiredCtaIds: ['CTA-06', 'CTA-07'],
  },
  {
    id: 18, code: 'sale_intelectual_property',  label: 'Sale IP',
    family: 'Intellectual Property',
    description: 'Seller completed a sale infringing intellectual property rights.',
    step2Fields: ORDER_OFFER_FIELDS,
    requiredCtaIds: ['CTA-01', 'CTA-02', 'CTA-03'],
  },
];

export const COUNTRY_LABELS: Record<string, string> = {
  AE: 'UAE', SA: 'Saudi Arabia', EG: 'Egypt', KW: 'Kuwait',
  QA: 'Qatar', BH: 'Bahrain', OM: 'Oman',
};
