# University Cost Calculator

A professional financial planning tool for calculating projected UK university education costs. Designed for financial consultants to provide clients with comprehensive cost projections and savings scenarios.

![University Cost Calculator](https://img.shields.io/badge/React-18.3.1-blue)
![Vite](https://img.shields.io/badge/Vite-6.0.1-purple)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.15-cyan)

## Features

- **Comprehensive Cost Projections**: Calculate tuition fees and living costs with 2.5% annual inflation
- **Regional Cost Variations**: Select from 8 UK regions with accurate living cost estimates
- **Accommodation Options**: Include or exclude student accommodation costs
- **Dual Programme Support**: Projections for both 3-year and 4-year degree programmes
- **Investment Scenarios**: Monthly savings and lump sum calculations across multiple growth rates
- **Professional Reports**: On-screen display and downloadable PDF reports
- **FCA-Compliant Disclaimers**: Industry-standard regulatory notices

## Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS with custom glassmorphism design
- **PDF Generation**: jsPDF with autotable plugin
- **Icons**: Lucide React
- **Fonts**: Lexend & Nunito (Google Fonts)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd university-cost-calculator

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist` folder.

## Deployment

### Cloudflare Pages

1. Push your code to GitHub
2. Go to [Cloudflare Pages](https://pages.cloudflare.com/)
3. Create a new project and connect your GitHub repository
4. Configure build settings:
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Node.js version**: 18 (or later)
5. Deploy!

The `_redirects` file in the `public` folder handles SPA routing automatically.

### Google Cloud Run (Optional Backend)

This application is fully client-side and doesn't require a backend. However, if you want to add server-side functionality in the future:

1. Create a Dockerfile
2. Build and push to Google Container Registry
3. Deploy to Cloud Run

## Project Structure

```
university-cost-calculator/
├── public/
│   ├── favicon.svg
│   ├── _redirects          # Cloudflare Pages routing
│   └── _routes.json        # Cloudflare Pages config
├── src/
│   ├── components/
│   │   ├── Calculator.jsx  # Input form component
│   │   └── Report.jsx      # Report display component
│   ├── constants/
│   │   └── universityData.js # Fee data, living costs, disclaimers
│   ├── utils/
│   │   ├── calculations.js # Core calculation functions
│   │   └── pdfGenerator.js # PDF report generation
│   ├── App.jsx             # Main application component
│   ├── index.css           # Tailwind + custom styles
│   └── main.jsx            # React entry point
├── index.html
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
└── README.md
```

## Configuration

### Updating Fee Data

Edit `src/constants/universityData.js` to update:

- Current tuition fees
- Regional living costs
- Inflation rate assumptions
- Disclaimer text

### Styling Customization

The glassmorphism theme can be customized in:

- `src/index.css` - Main styles and animations
- `tailwind.config.js` - Tailwind theme extensions

## Data Sources

- **Tuition Fees**: Based on UK regulated maximum (£9,250 for 2024/25)
- **Living Costs**: Based on Save the Student National Student Money Survey and university estimates
- **Inflation**: Fixed at 2.5% per annum (configurable)

## Regulatory Compliance

This tool includes FCA-compliant disclaimers stating that:

- Projections are for illustration purposes only
- Past performance doesn't guarantee future results
- Clients should seek professional financial advice

## License

MIT License - feel free to use and modify for your needs.

## Support

For questions or issues, please open a GitHub issue.
