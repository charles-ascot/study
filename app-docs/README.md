# University Cost Calculator

A professional financial planning tool for calculating projected UK university education costs with inflation, providing comprehensive cost projections and savings scenarios.

## Overview

This application helps financial consultants and clients project the total cost of a UK university education, taking into account:

- Current tuition fees with inflation projections
- Regional living costs (with/without accommodation)
- Multiple degree durations (3-year standard, 4-year with placement)
- Various investment growth scenarios for savings planning

## Tech Stack

- **Frontend**: React 18.3.1 + Vite 6.0.1
- **Styling**: Tailwind CSS 3.4.15 with custom glassmorphism design
- **PDF Generation**: jsPDF with autotable plugin
- **Icons**: Lucide React
- **Date Handling**: date-fns

## Features

- Interactive calculator with form validation
- Real-time cost projections with compound inflation
- Side-by-side comparison of 3-year and 4-year degree costs
- Monthly savings scenarios across 6 different growth rates (3%-8%)
- Lump sum investment scenarios
- Professional PDF report generation
- FCA-compliant disclaimers
- Responsive glassmorphism UI design

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── App.jsx                 # Main app component with state management
├── main.jsx               # React entry point
├── index.css              # Tailwind + custom styles
├── components/
│   ├── Calculator.jsx     # Input form with validation
│   └── Report.jsx         # Report display with collapsible sections
├── constants/
│   └── universityData.js  # All constants, fees, living costs, disclaimers
└── utils/
    ├── calculations.js    # Core business logic (15 functions)
    └── pdfGenerator.js    # PDF report generation
```

## Documentation

- [Variables Reference](./VARIABLES.md) - All constants, configuration options, and form state
- [Calculations Guide](./CALCULATIONS.md) - Formulas and calculation logic
- [Architecture Overview](./ARCHITECTURE.md) - App structure, data flow, and components

## Key Constants

| Constant | Value | Description |
|----------|-------|-------------|
| `CURRENT_TUITION_FEE` | £9,250 | UK regulated maximum tuition fee (2024/25) |
| `INFLATION_RATE` | 2.5% | Annual inflation applied to all projections |
| `UNIVERSITY_START_AGE` | 18 | Standard university entry age |

## Supported Regions

The calculator supports 8 UK regions with different living cost estimates:

- London (highest cost)
- South East
- South West
- Midlands
- North West
- North East
- Wales
- Northern Ireland (lowest cost)

## Compliance

The application includes FCA-compliant disclaimers clarifying that:

- Projections are for illustration purposes only
- Assumed rates are not guaranteed
- Past performance is not a reliable indicator of future results
- Professional financial advice should be sought

## Deployment

The app is configured for Cloudflare Pages deployment with:

- `_redirects` - SPA routing configuration
- `_routes.json` - Cloudflare Pages routing

## License

Proprietary - All rights reserved
