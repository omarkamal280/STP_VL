import { CallToAction } from './types';

export const CALL_TO_ACTIONS: CallToAction[] = [
  { id: 'CTA-01', name: 'Remove Listing',            description: 'Instruct seller to immediately take down all flagged product listings from the platform.' },
  { id: 'CTA-02', name: 'Submit Authenticity Proof',  description: 'Require seller to provide certificates of authenticity or brand authorisation letters.' },
  { id: 'CTA-03', name: 'Submit Invoices',            description: 'Require seller to submit valid purchase invoices traceable to an authorised source.' },
  { id: 'CTA-04', name: 'Update Delivery Estimates',  description: 'Require seller to correct their stated handling and delivery times to match actual capability.' },
  { id: 'CTA-05', name: 'Submit Logistics Plan',      description: 'Require seller to provide a revised logistics and fulfilment plan with carrier SLAs.' },
  { id: 'CTA-06', name: 'Remove Prohibited Items',    description: 'Require seller to remove all listings containing prohibited or restricted products.' },
  { id: 'CTA-07', name: 'Submit Compliance Docs',     description: 'Require seller to provide regulatory compliance documentation for flagged products.' },
  { id: 'CTA-08', name: 'Submit Onboarding Docs',     description: 'Require seller to re-submit valid onboarding documents for identity and business verification.' },
  { id: 'CTA-09', name: 'Account Suspension Review',  description: 'Trigger a formal account suspension review process pending further investigation.' },
  { id: 'CTA-10', name: 'Correct Pricing',            description: 'Require seller to correct all flagged SKU prices to comply with the fair pricing policy.' },
  { id: 'CTA-11', name: 'Submit Repricing Config',    description: 'Require seller to submit their repricing algorithm configuration for compliance review.' },
  { id: 'CTA-12', name: 'Remove Fake Reviews',        description: 'Require seller to identify and remove all injected or manipulated product reviews.' },
  { id: 'CTA-13', name: 'Submit Review Evidence',     description: 'Require seller to provide sourcing evidence for flagged reviews (reviewer identity, order IDs).' },
  { id: 'CTA-14', name: 'Retrain Support Staff',      description: 'Require seller to complete communication policy training for all customer-facing staff.' },
  { id: 'CTA-15', name: 'Submit Communication Log',   description: 'Require seller to submit the full communication thread for the flagged interaction.' },
  { id: 'CTA-16', name: 'Merge Duplicate Accounts',   description: 'Require seller to consolidate duplicate seller accounts under a single verified entity.' },
  { id: 'CTA-17', name: 'Consolidate Listings',       description: 'Require seller to merge duplicate product listings into a single canonical listing.' },
  { id: 'CTA-18', name: 'Legal Compliance Notice',    description: 'Issue a formal legal compliance notice and require written acknowledgment within 48 hours.' },
];
