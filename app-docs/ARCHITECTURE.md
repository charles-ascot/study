# Architecture Overview

Technical documentation of the University Cost Calculator's architecture, components, and data flow.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        User Interface                           │
│  ┌─────────────────────┐     ┌─────────────────────────────┐   │
│  │   Calculator.jsx    │────▶│        Report.jsx           │   │
│  │   (Input Form)      │     │   (Results Display)         │   │
│  └─────────────────────┘     └─────────────────────────────┘   │
│                                          │                      │
│                                          ▼                      │
│                              ┌─────────────────────────────┐   │
│                              │     pdfGenerator.js         │   │
│                              │   (PDF Export)              │   │
│                              └─────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       Business Logic                            │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                   calculations.js                        │   │
│  │  • Age & timeline calculations                           │   │
│  │  • Cost projections with inflation                       │   │
│  │  • Savings scenarios (monthly & lump sum)                │   │
│  │  • Report generation                                     │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Configuration                              │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                  universityData.js                       │   │
│  │  • Tuition fees & inflation rate                         │   │
│  │  • Regional living costs                                 │   │
│  │  • Growth rate benchmarks                                │   │
│  │  • Disclaimers                                           │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## File Structure

```
src/
├── App.jsx                 # Root component, state management
├── main.jsx               # React entry point, DOM rendering
├── index.css              # Global styles, Tailwind config
│
├── components/
│   ├── Calculator.jsx     # Input form component
│   └── Report.jsx         # Results display component
│
├── constants/
│   └── universityData.js  # All configuration constants
│
└── utils/
    ├── calculations.js    # Core calculation functions
    └── pdfGenerator.js    # PDF generation logic
```

## Component Details

### App.jsx

**Role:** Root component and state container

**State:**
```javascript
const [reportData, setReportData] = useState(null);
const [showReport, setShowReport] = useState(false);
```

**Event Handlers:**
- `handleCalculate(formData)` - Generates report and switches view
- `handleBack()` - Returns to calculator, preserves report
- `handleNewCalculation()` - Resets all state

**Render Logic:**
```javascript
{showReport ? <Report /> : <Calculator />}
```

### Calculator.jsx

**Role:** User input form with validation

**Local State:**
```javascript
const [formData, setFormData] = useState({
  clientName: '',
  dateOfBirth: null,
  location: 'london',
  includeAccommodation: true
});
const [errors, setErrors] = useState({});
const [touched, setTouched] = useState({});
```

**Validation:**
- Client name: Required, non-empty
- Date of birth: Required, child must be 6 months to 17.99 years old

**Props:**
- `onCalculate(formData)` - Callback when form is submitted

**UI Elements:**
- Text input for client name
- Date picker for date of birth
- Dropdown for location selection
- Checkbox for accommodation option
- Dynamic cost display based on selections

### Report.jsx

**Role:** Display calculation results with interactive features

**Props:**
```javascript
{
  reportData: Object,    // Complete report object from generateReport()
  onBack: Function,      // Return to calculator
  onNewCalculation: Function  // Start fresh
}
```

**Features:**
- Collapsible sections for 3-year and 4-year degree details
- Year-by-year cost breakdown tables
- Monthly savings scenario tables
- Lump sum scenario tables
- PDF download button
- Disclaimer display

**Local State:**
```javascript
const [expandedSections, setExpandedSections] = useState({
  threeYear: true,
  fourYear: false
});
```

## Data Flow

### Calculator to Report Flow

```
1. User fills Calculator form
           │
           ▼
2. Form validation on blur/submit
           │
           ▼
3. onCalculate(formData) called
           │
           ▼
4. App.jsx: generateReport(formData)
           │
           ▼
5. calculations.js processes:
   • calculateCurrentAge()
   • calculateYearsUntilUniversity()
   • calculateTotalCosts() × 2 (3yr, 4yr)
   • calculateRequiredSavings() × 2
   • calculateLumpSumRequired() × 2
           │
           ▼
6. Report object returned
           │
           ▼
7. App.jsx: setReportData(report)
           │
           ▼
8. App.jsx: setShowReport(true)
           │
           ▼
9. Report.jsx renders with data
```

### PDF Generation Flow

```
1. User clicks "Download PDF" in Report.jsx
           │
           ▼
2. downloadPDF(reportData, filename) called
           │
           ▼
3. pdfGenerator.js creates jsPDF instance
           │
           ▼
4. Content added in order:
   • Header with branding
   • Client information table
   • Assumptions table
   • 3-year degree section
   • 4-year degree section
   • Disclaimer
   • Page footers
           │
           ▼
5. PDF saved to user's device
```

## Styling Architecture

### Design System

**Colors (defined in index.css):**
```css
--color-bg: #0a0a0f;
--color-indigo: #6366f1;
--color-purple: #a855f7;
--color-pink: #ec4899;
--color-cyan: #22d3ee;
--color-green: #34d399;
--color-amber: #f59e0b;
```

**Typography:**
- Headings: Lexend (weights 300-700)
- Body: Nunito (weights 300-700)

### Glassmorphism Components

```css
.glass-panel {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
}

.glass-input {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  /* Focus states with indigo glow */
}

.glass-button {
  background: linear-gradient(135deg, var(--color-indigo), var(--color-purple));
  /* Hover and active states */
}
```

### Animations

```css
@keyframes floating-orbs { /* Background animation */ }
@keyframes gradientShift { /* Gradient movement */ }
@keyframes fadeIn { /* Content fade in */ }
```

## State Management Pattern

The app uses React's built-in useState for simplicity:

```
App.jsx (Global State)
├── reportData: Report object or null
└── showReport: Boolean view toggle
    │
    ├── Calculator.jsx (Local State)
    │   ├── formData: Form values
    │   ├── errors: Validation errors
    │   └── touched: Field interaction tracking
    │
    └── Report.jsx (Local State)
        └── expandedSections: Collapsible state
```

**Why no Redux/Context?**
- Simple data flow (parent → child)
- No need for cross-component state sharing
- Form state is local to Calculator
- Report state is passed as props

## Error Handling

### Form Validation

```javascript
// Calculator.jsx
const validateField = (name, value) => {
  switch (name) {
    case 'clientName':
      return !value.trim() ? 'Please enter a client name' : '';
    case 'dateOfBirth':
      // Age validation (6 months to 17.99 years)
      return !isValidAge(value) ? 'Invalid date of birth' : '';
    default:
      return '';
  }
};
```

### Calculation Edge Cases

```javascript
// calculations.js
const calculateYearsUntilUniversity = (dateOfBirth) => {
  const years = UNIVERSITY_START_AGE - calculateCurrentAge(dateOfBirth);
  return Math.max(0, years);  // Never negative
};

const calculateRequiredSavings = (target, years) => {
  if (rate === 0) {
    return target / (years * 12);  // Handle zero growth
  }
  // Normal compound interest calculation
};
```

## Build and Deployment

### Vite Configuration

```javascript
// vite.config.js
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false
  }
});
```

### Cloudflare Pages

**_redirects:**
```
/* /index.html 200
```

**_routes.json:**
```json
{
  "version": 1,
  "include": ["/*"],
  "exclude": []
}
```

## Dependencies

### Production

| Package | Version | Purpose |
|---------|---------|---------|
| react | 18.3.1 | UI framework |
| react-dom | 18.3.1 | DOM rendering |
| jspdf | ^2.5.2 | PDF generation |
| jspdf-autotable | ^3.8.4 | PDF tables |
| lucide-react | ^0.460.0 | Icons |
| date-fns | ^4.1.0 | Date utilities |

### Development

| Package | Version | Purpose |
|---------|---------|---------|
| vite | 6.0.1 | Build tool |
| tailwindcss | 3.4.15 | CSS framework |
| postcss | ^8.4.49 | CSS processing |
| autoprefixer | ^10.4.20 | CSS vendor prefixes |
| @vitejs/plugin-react | 4.3.4 | React plugin for Vite |

## Performance Considerations

1. **No external API calls** - All calculations are client-side
2. **Lazy PDF generation** - Only generates when user requests download
3. **Minimal re-renders** - Local state in child components
4. **CSS animations use GPU** - transform and opacity only
5. **Tree-shaking** - Vite removes unused code

## Security Notes

1. **No user data storage** - All data is session-only
2. **No external data transmission** - Client-side only
3. **Input validation** - All form inputs validated before use
4. **No user-generated content display** - Prevents XSS
