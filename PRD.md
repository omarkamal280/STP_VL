# Product Requirements Document
## STP Violation Ledger — Seller Trust & Policy

**Version:** 1.0  
**Status:** Draft  
**Audience:** Engineering, Product, Risk Operations

---

## 1. Background & Problem Statement

### Current State

Handling a seller violation today requires jumping between two disconnected systems:

- **Ref Master** — the source of truth for violation data (codes, black points, fines)
- **Zoho** — the communication channel between the Risk Team and sellers

This creates three persistent operational problems:

1. **No single state of truth.** There is no structured lifecycle for a violation. Status updates are free-form, which means any two analysts can interpret the same case differently.
2. **Manual overhead.** Creating a violation means entering data twice — once in Ref Master and once in Zoho. Acting on a seller response means switching contexts mid-task.
3. **Seller opacity.** Sellers receive insufficient information about what went wrong, what it means for their account, and what they can do. Responses are open-ended, leading to back-and-forth that wastes both sides' time.

### Target State

A centralised internal tool — the **STP Violation Ledger** — that:

- Replaces Ref Master and Zoho for all violation-related work
- Enforces a deterministic state machine on every violation so state is never ambiguous
- Gives sellers a structured, clear experience with defined response paths
- Serves as the foundation for a full account health and enforcement model (black points, fines, seller accountability)

---

## 2. Violation Lifecycle — State Machine

### 2.1 States

| State | Who Sets It | Meaning |
|---|---|---|
| `sanctioned` | Ops/analyst | Raised by the Risk Team. Seller is liable; penalties apply. Awaiting seller response. |
| `disputed` | Seller | Seller submitted a dispute challenging the violation. Risk Team investigating. |
| `acknowledged` | Seller | Seller accepted the violation and submitted corrective action evidence. Analyst reviewing. |
| `insufficient` | Analyst | Seller's fix evidence is inadequate. Seller must resubmit. |
| `fixed` | Analyst | Analyst accepted the fix. Violation stands; black points apply. No further enforcement. |
| `upheld` | Analyst | Analyst rejected the dispute. Seller is liable. Only an admin can move to `appealed`. |
| `appealed` | Admin | Admin escalated for a second and final review. Admin-only decisions. |
| `dismissed` | Analyst / Admin | Dispute accepted on merits. Seller cleared. No penalties. Terminal state. |
| `voided` | Admin only | Violation invalidated due to process or claim error. Hidden from seller. Kept for audit. Terminal state. |

### 2.2 Transition Map

```
sanctioned
  ├── seller disputes    →  disputed
  └── seller accepts     →  acknowledged

disputed
  ├── analyst upholds    →  upheld
  ├── analyst dismisses  →  dismissed
  └── analyst requests more details   →  insufficient dispute

acknowledged
  ├── analyst accepts    →  fixed
  └── analyst requests more details      →  insufficient fix

insufficient fix
  └── seller resubmits   →  acknowledged

insufficient dispute
  └── seller resubmits   →  disputed

upheld
  └── admin appeals      →  appealed

appealed
  ├── admin upholds      →  upheld
  └── admin dismisses    →  dismissed

any state
  └── admin voids        →  voided
```

### 2.3 Terminal States

`fixed`, `dismissed`, and `voided` are terminal — no further transitions except an admin Void from `fixed` or `dismissed`.

### 2.4 Penalty Rules

- **Black points** are assigned at `sanctioned` and remain through the lifecycle.
- Black points are **removed only** if the violation is `voided` (process error) or `dismissed` (cleared on merits).


---


## 3. Internal Tool — STP Violation Ledger

The internal tool is the primary workspace for the Risk Team. It is built around five tabs.

### 3.1 Access & Roles

**Analyst (default)**
- Create violations
- View assigned queue
- Action disputes (Uphold, Dismiss, Request More Info)
- Action acknowledgments (Accept Fix, Mark Insufficient)

**Admin (elevated)**
- All analyst actions
- Void any violation from any state
- Escalate `upheld` → `appealed`
- Take final Uphold or Dismiss decisions on `appealed` violations

The admin toggle is exposed in the header. In production this will be driven by the user's role in the IAM system.

---

### 3.2 Dashboard

The entry point for daily operations.

**Metrics displayed:**
- Total violations (all time)
- Violations in the last 180 days
- Active Violations
- Violations awaiting analyst action

**Activity feeds:**
- Recent violations (latest 10, sorted by date descending)
- Recent disputes (latest 10, sorted by submission date)

Each row is clickable and opens the Violation Detail Modal.

---

### 3.3 Assigned to Me

A personal analyst queue — violations assigned to the logged-in analyst that were created in the last 180 days.

**Tabs within the view:**

| Tab | Criteria |
|---|---|
| Needs My Action | `disputed`, `acknowledged` |
| Awaiting Seller Response | `sanctioned`, `insufficient` |
| Closed | `fixed`, `upheld`, `dismissed`, `voided` |

**Features:**
- Search by seller ID, violation ID, or code name
- Paginated table (10 rows per page)
- Click any row to open the Violation Detail Modal

**Columns:** Ticket No. · Seller · Violation Code name · Status · Assigned Date

---

### 3.4 Violation Ledger

The full record of all violations across all sellers.

**Filters:**
- Search (seller ID, ticket ID, violation code name)
- Status filter (all states)
- Active violations only toggle

**Columns:** Ticket No. · Partner · Violation Code Name · Violation Type · Date · Black Points · Status · Assigned To · Actions

**Actions column:**
- **Review** — opens the Violation Detail Modal in ops mode
- **View** — opens a read-only version of the same modal

**Violation creation:**
- `+ New Violation` button opens the 3-step wizard (see 3.4.1)

#### 3.4.1 Violation Creation Wizard

**Step 1 — Core Details**

Required fields: Partner ID, Country, Violation Code, Violation Date, Request Source, Current Seller Rating, Overall Risk, ID Penalty, MP Code.

- Partner ID lookup auto-fills seller metadata (name, countries, account health, risk score, prior violations) from the seller master.
- Violation Code selection drives the dynamic fields in Step 2.

**Step 2 — Violation-Specific Fields**

Dynamic fields driven by the selected violation code from `violationSchemas`. Two sections:

- **Required** fields — must be filled to proceed
- **Visible (optional)** fields — shown but not blocking

Fields are configured per violation code in the Settings matrix (H = Hidden, V = Visible, R = Required).

**Step 3 — Message to Seller**

- Select a message template filtered by violation code
- Templates auto-populate placeholders using values from Steps 1–2 (e.g. `{sellerId}`, `{projectId}`, `{scheduledDate}`)
- Free-text override is available
- Submitted violation enters `sanctioned` state

---

### 3.5 Master Lists

Reference tables for violation codes, types, associated black point values, and fines. Replaces the ref master dependency for this data. **Admin-only access.**

---

### 3.6 Templates

Manage the message templates used in Step 3 of the violation wizard.

**Template fields:** Name · Description · Violation Code · Message body (with placeholders)

**Placeholder system:**
- Each violation code maps to a set of required placeholders (e.g. `DELIVERY` → `{sellerId}`, `{scheduledDate}`, `{actualDate}`, `{deadline}`)
- When a violation code is selected in the editor, its required placeholder bubbles appear between the violation picker and the message body
- Clicking a bubble inserts the placeholder at the current cursor position in the textarea
- Placeholders are auto-filled at violation creation time from wizard form values

**Template operations:** Create · Edit · Copy · Activate / Deactivate · Delete (with confirmation)

---

### 3.7 Violation Detail Modal (Ops Mode)

The primary action surface for analysts. Opened from the Ledger, Dashboard, or Assigned to Me queue.

**Left panel — violation context:**
- Header: title, status badge, severity, black points, assigned analyst
- Message thread: chronological chat between Risk Team and seller, with tagged events (Dispute Filed, Fix Submitted, Violation Upheld, etc.)
- POA (Plan of Action): expandable section with summary and required corrective steps
- Evidence files: documents attached by the Risk Team

**Right panel — action surface:**

Actions available depend on the current violation status:

| Status | Available Actions |
|---|---|
| `sanctioned` | Uphold, Void (admin) |
| `disputed` | Dismiss, Request More Info, Uphold, Void (admin) |
| `acknowledged` | Accept Fix, Mark Insufficient, Void (admin) |
| `insufficient` | Void (admin) |
| `upheld` | Appeal (admin), Void (admin) |
| `appealed` | Uphold (admin), Dismiss (admin), Void (admin) |
| `fixed` | Void (admin) |
| `dismissed` | Void (admin) |
| `voided` | — |

**Action flow:**
1. Actions are displayed as cards with a title, subtext, and icon
2. Selecting a card opens a confirm form with:
   - A mandatory message-to-seller textarea (required to submit)
   - Optional file attachments (simulated from a set of reference documents)
3. Submitting moves the violation to its resulting state and shows a done confirmation

**Action definitions:**

| Action | Resulting State | Notes |
|---|---|---|
| Uphold | `upheld` | Seller liable; all penalties apply |
| Dismiss | `dismissed` | Seller cleared; no penalties |
| Request More Info | stays `disputed` | Case open; seller must respond again |
| Accept Fix | `fixed` | Fix accepted; violation stands; black points apply |
| Insufficient | `insufficient` | Seller must resubmit corrective evidence |
| Appeal | `appealed` | Admin-only; escalates to second review |
| Void | `voided` | Admin-only; removes from seller view; kept for audit |

---

## 4. Seller Experience

The seller-facing view is accessed via the **Account Health** section in the Seller Portal (noon Partners).

### 4.1 Compliance Table

Located under the **Compliance** tab within Account Health.

**Columns:** Ticket No. · Violation Type · Violation Code · Violation Date · Fine · Black Points · Status · Actions

**Filters:** Date range · Violation Type · Status

**Pagination:** 9 rows per page

---

### 4.2 Policy Compliance Score

Displayed at the top of the Compliance tab.

- Score range: 0–100, computed from active violations in the last 180 days
- Score tiers: Good (≥80), Fair (≥60), Poor (≥40), Critical (<40)
- Visual: horizontal progress bar with score marker and scale ticks

---

### 4.3 Violation Detail Modal (Seller Mode)

Opened via **View More** in the compliance table. A two-panel modal.

**Left panel — violation detail:**
- Title and subtitle of the violation type
- Issued date · Status badge · Black Points
- Activity Timeline: horizontal stepper (Ticket Created → current status)
- Description: plain-text explanation of the violation
- Evidence and Documentation: files attached by the Risk Team, displayed as styled attachment cards
- Affected SKUs: collapsible list with SKU name, SKU code, and fulfilment badge

**Right panel — chat thread:**
- noon Risk Team message displayed as a **chat bubble** (blue-tinted, rounded, with "Shukran, Team noon" sign-off)
- Timestamp and status badge below the bubble
- For `sanctioned` violations: a **"Fixes needed" card** (red-tinted) listing the required corrective actions from the POA
- For terminal/pending states: a contextual status notice (e.g. "Your dispute is under review…")
- **Dispute** and **Accept And Fix** action buttons pinned to the bottom of the right panel (sanctioned only)

---

### 4.4 Seller Response Paths

For `sanctioned` violations, sellers have exactly two paths:

#### Accept And Fix
1. Seller reviews the Plan of Action and checks off each required corrective step
2. Seller adds optional notes
3. On submit: violation moves to `acknowledged`; Risk Team notified
4. **Seller cannot follow up until the Risk Team responds**

#### Dispute
1. Seller provides a written reason for the dispute (mandatory)
2. Seller optionally attaches supporting documents
3. On submit: violation moves to `disputed`; assigned analyst is notified
4. **Seller cannot follow up until the Risk Team responds**

Both paths surface a post-submission confirmation screen. Once submitted, the response form is locked.

---

## 5. Open Questions

| # | Question | Owner |
|---|---|---|
| 1 | **Echo integration:** Where do messages live — in this system or synced to/from Echo? | Engineering + Risk Ops |
| 2 | **Attachment storage:** Do we store seller-submitted files ourselves or delegate to Echo? | Engineering |
| 3 | **Seller appeals:** Do we allow sellers to appeal an upheld dispute, or is upheld final from the seller's perspective? | Risk Ops |
| 4 | **Seller follow-up:** Are we comfortable blocking seller follow-up until the Risk Team responds first? | Risk Ops |
| 5 | **Bulk uploads:** What is the validation and review queue flow before a bulk-uploaded violation is sanctioned? | Product + Engineering |
| 6 | **Black point threshold:** What cumulative black point total triggers an account suspension or downgrade? | Risk Ops |

---

## 6. Out of Scope (v1)

- Live data integration (all data is currently mocked)
- Zoho deprecation migration plan
- Ref Master deprecation migration plan
- Echo message sync
- Bulk upload implementation
- Email/push notifications on state changes
- Seller appeal flow from the seller side
- Automated state transitions (e.g. auto-void after X days without seller response)
