# Variables Reference

Complete reference of all variables, constants, and configuration options used in the University Cost Calculator.

## Core Constants

Located in `src/constants/universityData.js`

| Constant | Type | Value | Description |
|----------|------|-------|-------------|
| `CURRENT_TUITION_FEE` | Number | `9250` | UK regulated maximum tuition fee for 2024/25 (GBP) |
| `INFLATION_RATE` | Number | `0.025` | Fixed 2.5% annual inflation rate applied to all projections |
| `UNIVERSITY_START_AGE` | Number | `18` | Standard university entry age in the UK |

## Living Costs by Region

The `LIVING_COSTS` object contains cost estimates for 8 UK regions, each with two options:

| Region Key | Label | With Accommodation | Without Accommodation |
|------------|-------|-------------------|----------------------|
| `london` | London | £15,180 | £6,680 |
| `southEast` | South East | £13,200 | £5,800 |
| `southWest` | South West | £12,400 | £5,400 |
| `midlands` | Midlands | £11,800 | £5,200 |
| `northWest` | North West | £11,400 | £5,000 |
| `northEast` | North East | £10,800 | £4,800 |
| `wales` | Wales | £10,600 | £4,600 |
| `northernIreland` | Northern Ireland | £9,800 | £4,400 |

### Structure

```javascript
LIVING_COSTS = {
  london: {
    label: 'London',
    withAccommodation: 15180,
    withoutAccommodation: 6680
  },
  // ... other regions
}
```

## Degree Durations

The `DEGREE_DURATIONS` object defines available degree program lengths:

| Key | Years | Label |
|-----|-------|-------|
| `standard` | 3 | 3 Years (Standard Degree) |
| `withPlacement` | 4 | 4 Years (With Placement/Sandwich Year) |

### Structure

```javascript
DEGREE_DURATIONS = {
  standard: { years: 3, label: '3 Years (Standard Degree)' },
  withPlacement: { years: 4, label: '4 Years (With Placement/Sandwich Year)' }
}
```

## Growth Rate Benchmarks

The `GROWTH_RATE_BENCHMARKS` array defines annual growth rates used for savings scenarios:

```javascript
GROWTH_RATE_BENCHMARKS = [0.03, 0.04, 0.05, 0.06, 0.07, 0.08]
// Represents: 3%, 4%, 5%, 6%, 7%, 8% annual returns
```

## Financial Products Reference

The `FINANCIAL_PRODUCTS` array provides informational reference for investment types:

| Product | Expected Return | Risk Level |
|---------|-----------------|------------|
| Cash ISA | 4% | Low |
| Junior ISA | 5% | Low-Medium |
| Stocks & Shares ISA | 7% | Medium |
| Investment Bond | 8% | Medium-High |
| General Investment Account | 6% | Variable |

### Structure

```javascript
FINANCIAL_PRODUCTS = [
  {
    name: 'Cash ISA',
    expectedReturn: 0.04,
    riskLevel: 'Low',
    description: 'Tax-free savings with guaranteed capital'
  },
  // ... other products
]
```

## Calculator Form State

Variables managed in `Calculator.jsx`:

| Variable | Type | Default | Validation Rules |
|----------|------|---------|------------------|
| `clientName` | String | `''` | Required, must not be empty/whitespace |
| `dateOfBirth` | Date | `null` | Required, child must be 6 months to 17.99 years old |
| `location` | String | `'london'` | Must be a valid key from `LIVING_COSTS` |
| `includeAccommodation` | Boolean | `true` | Determines which living cost value to use |

### Validation Error Messages

```javascript
errors = {
  clientName: 'Please enter a client name',
  dateOfBirth: 'Please enter a valid date of birth (child must be under 18)'
}
```

## Report Data Structure

The `reportData` object returned by `generateReport()`:

### Report Meta

```javascript
reportMeta: {
  generatedAt: Date,           // Timestamp of report generation
  clientName: String,          // Client's name from form
  referenceNumber: String      // Format: "UNI-{timestamp_base36}"
}
```

### Child Info

```javascript
childInfo: {
  dateOfBirth: Date,           // Child's date of birth
  currentAge: Number,          // Current age in decimal years
  yearsUntilUniversity: Number, // Years until age 18
  projectedStartYear: Number   // Year child will start university
}
```

### Assumptions

```javascript
assumptions: {
  inflationRate: 0.025,        // Always 2.5%
  currentTuitionFee: 9250,     // Always £9,250
  location: String,            // Region label (e.g., "London")
  includeAccommodation: Boolean,
  currentLivingCost: Number    // Selected living cost amount
}
```

### Projections

```javascript
projections: {
  threeYear: {
    costs: CostBreakdown,
    monthlySavings: SavingsScenario[],
    lumpSum: LumpSumScenario[]
  },
  fourYear: {
    costs: CostBreakdown,
    monthlySavings: SavingsScenario[],
    lumpSum: LumpSumScenario[]
  }
}
```

### Cost Breakdown Object

```javascript
CostBreakdown = {
  tuition: {
    currentFee: Number,
    yearsUntilStart: Number,
    startYear: Number,
    degreeYears: Number,
    yearlyProjections: YearlyProjection[],
    totalTuitionFees: Number
  },
  living: {
    location: String,
    includeAccommodation: Boolean,
    currentAnnualCost: Number,
    yearlyProjections: YearlyProjection[],
    totalLivingCosts: Number
  },
  yearlyBreakdown: CombinedYearBreakdown[],
  totalTuitionFees: Number,
  totalLivingCosts: Number,
  grandTotal: Number
}
```

### Yearly Projection Object

```javascript
YearlyProjection = {
  year: Number,               // Index (0, 1, 2, ...)
  academicYear: Number,       // Actual year (2030, 2031, ...)
  yearsFromNow: Number,       // Years from current date
  projectedFee: Number        // Inflated cost amount
}
```

### Savings Scenario Object

```javascript
SavingsScenario = {
  annualRate: Number,         // Decimal (0.03)
  annualRatePercent: String,  // Display string ("3.0")
  monthlySavings: Number,     // Required monthly payment
  totalContributions: Number, // Sum of all payments
  investmentGrowth: Number,   // Growth earned
  growthPercentOfTarget: Number // Growth as % of total
}
```

### Lump Sum Scenario Object

```javascript
LumpSumScenario = {
  annualRate: Number,         // Decimal (0.03)
  annualRatePercent: String,  // Display string ("3.0")
  lumpSumRequired: Number,    // One-time investment needed
  totalGrowth: Number,        // Growth earned
  growthPercentOfTarget: Number // Growth as % of total
}
```

## App State Variables

Variables managed in `App.jsx`:

| Variable | Type | Description |
|----------|------|-------------|
| `reportData` | Object/null | Stores the generated report object |
| `showReport` | Boolean | Controls whether to show Calculator or Report view |

## PDF Generator Variables

Variables used in `pdfGenerator.js`:

| Variable | Value | Description |
|----------|-------|-------------|
| `pageWidth` | Dynamic | A4 page width (typically 210mm) |
| `margin` | 20 | Margin in PDF units (all sides) |
| `contentWidth` | pageWidth - 40 | Usable content width |
| `yPos` | Dynamic | Current Y position for content flow |

### Color Constants

| Color | RGB Values | Usage |
|-------|------------|-------|
| Primary | (99, 102, 241) | Indigo - headers, accents |
| Secondary | (168, 85, 247) | Purple - highlights |
| Text | (51, 51, 51) | Dark gray - body text |
| Light Gray | (128, 128, 128) | Secondary text |

## Disclaimer Text Variables

| Variable | Description |
|----------|-------------|
| `DISCLAIMER_TEXT` | Full FCA-compliant disclaimer for PDF reports |
| `SHORT_DISCLAIMER` | Condensed version for on-screen display |

## Customization Points

To modify the calculator behavior, edit these values in `src/constants/universityData.js`:

1. **Tuition Fee**: Change `CURRENT_TUITION_FEE`
2. **Inflation Rate**: Change `INFLATION_RATE`
3. **Regions**: Add/modify entries in `LIVING_COSTS`
4. **Growth Rates**: Modify `GROWTH_RATE_BENCHMARKS` array
5. **Degree Options**: Add entries to `DEGREE_DURATIONS`
6. **Disclaimers**: Edit `DISCLAIMER_TEXT` or `SHORT_DISCLAIMER`
