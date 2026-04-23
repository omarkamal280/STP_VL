# STP Violation Ledger Portal

A comprehensive violations management portal for the Risk Team to manage seller violations, disputes, and enforcement actions with advanced template functionality and bulk upload capabilities.

## Features

### 🎯 Template Management
- **Create & Edit Templates**: Professional template editor with dynamic placeholder insertion
- **Template Library**: Organized collection of violation message templates
- **Placeholder System**: Auto-fill templates with seller ID, project ID, and violation data
- **Template Activation**: Enable/disable templates for use in violation creation

### 📋 Bulk Upload System
- **CSV Import**: Upload violations in bulk with template mapping
- **Smart Assignment**: Three template assignment strategies (CSV, single template, auto-assignment)
- **Message Preview**: Review generated messages before submission
- **Real-time Statistics**: Track template usage and validation results

### 🚀 Violation Management
- **Individual Creation**: Add violations with template selection and placeholder replacement
- **Violation Ledger**: Complete violation tracking with search and filtering
- **Dispute Handling**: View and manage seller disputes with evidence
- **Enforcement Actions**: Reply to disputes and enforce or exonerate violations

### 🎨 Modern Interface
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Professional UI**: Built with Tailwind CSS and modern design patterns
- **Type Safety**: Full TypeScript implementation for reliability

## Demo Features

### Template System Demo
1. Navigate to **Templates** tab
2. Create new templates with placeholder insertion
3. Try the sample templates for different violation types
4. Test template activation and management

### Bulk Upload Demo
1. Navigate to **Violation Ledger** tab
2. Click **Bulk Upload** button
3. Upload the provided `sample_bulk_upload.csv` file
4. Choose template assignment strategy
5. Preview generated messages with navigation
6. Submit bulk violations

### Individual Violation Demo
1. Click **Add Violation** in Violation Ledger
2. Select a template from the dropdown
3. Observe auto-filled fields and message generation
4. Update seller/project ID to see dynamic placeholder replacement

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: React hooks (useState, useEffect)
- **File Processing**: CSV parsing with template mapping

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm start
```

The application will be available at `http://localhost:3000`

### Sample Data

The project includes:
- `sample_bulk_upload.csv` - Demo file for bulk upload feature
- Mock templates and violations for testing
- Pre-configured template placeholders

## Key Features Showcase

### Template Placeholders
- `{sellerId}` - Seller unique identifier
- `{projectId}` - Project identifier (PRJ-YYYY-XXX format)
- `{violationCount}` - Number of violations for seller
- `{scheduledDate}` - Scheduled delivery date
- `{actualDate}` - Actual delivery/event date
- `{qualityIssues}` - Quality problem descriptions
- `{suspectedItems}` - Counterfeit item lists
- `{communicationIssues}` - Communication problem details

### Bulk Upload Strategies
1. **CSV Mode**: Use template IDs specified in CSV file
2. **Single Template**: Apply one template to all violations
3. **Auto-Assignment**: Automatically match templates by type and severity

### Template Assignment Statistics
- Total violations processed
- Violations with assigned templates
- Custom message violations
- Violations without messages

## File Structure

```
src/
├── components/
│   ├── Dashboard.tsx           # Overview with metrics
│   ├── ViolationLedger.tsx     # Main violation management
│   ├── TemplatesManagement.tsx # Template CRUD operations
│   ├── ViolationData.tsx       # Static violation data
│   └── ViolationTypes.tsx      # Violation type definitions
├── types.ts                    # TypeScript interfaces
├── mockData.ts                 # Sample data and templates
└── App.tsx                     # Main application component
```

## Contributing

This prototype demonstrates advanced React development patterns including:
- Complex state management with multiple data flows
- CSV processing and validation
- Template system with placeholder replacement
- Professional UI/UX design
- TypeScript best practices

Perfect for showcasing modern web development capabilities and template system architecture.

Runs the app in development mode at [http://localhost:3000](http://localhost:3000).

### Build

```bash
npm run build
```

Builds the app for production to the `build` folder.

## Tech Stack

- React 18
- TypeScript
- Tailwind CSS
- Lucide React (Icons)
- Headless UI (Components)
