// UK University Cost Data (2024/2025 academic year)
// Sources: UCAS, SLC, Save the Student surveys

export const CURRENT_TUITION_FEE = 9250; // Maximum regulated fee for England, Wales, NI

export const INFLATION_RATE = 0.025; // 2.5% fixed inflation

export const UNIVERSITY_START_AGE = 18; // Standard university entry age

// Living costs by location (annual estimates including accommodation)
// Based on Save the Student National Student Money Survey and university estimates
export const LIVING_COSTS = {
  london: {
    label: 'London',
    withAccommodation: 15180,
    withoutAccommodation: 6680,
    description: 'Highest cost region in the UK'
  },
  southEast: {
    label: 'South East England',
    withAccommodation: 13200,
    withoutAccommodation: 5800,
    description: 'Includes Oxford, Cambridge, Brighton'
  },
  southWest: {
    label: 'South West England',
    withAccommodation: 12400,
    withoutAccommodation: 5400,
    description: 'Includes Bristol, Bath, Exeter'
  },
  midlands: {
    label: 'Midlands',
    withAccommodation: 11800,
    withoutAccommodation: 5200,
    description: 'Includes Birmingham, Nottingham, Leicester'
  },
  northWest: {
    label: 'North West England',
    withAccommodation: 11400,
    withoutAccommodation: 5000,
    description: 'Includes Manchester, Liverpool, Lancaster'
  },
  northEast: {
    label: 'North East England',
    withAccommodation: 10800,
    withoutAccommodation: 4800,
    description: 'Includes Newcastle, Durham, York'
  },
  wales: {
    label: 'Wales',
    withAccommodation: 10600,
    withoutAccommodation: 4600,
    description: 'Includes Cardiff, Swansea, Aberystwyth'
  },
  northernIreland: {
    label: 'Northern Ireland',
    withAccommodation: 9800,
    withoutAccommodation: 4400,
    description: 'Includes Belfast, Ulster'
  }
};

// Degree duration options (excluding Scotland)
export const DEGREE_DURATIONS = {
  standard: {
    years: 3,
    label: '3 Years (Standard Degree)'
  },
  withPlacement: {
    years: 4,
    label: '4 Years (With Placement/Sandwich Year)'
  }
};

// Financial product assumptions for projection calculations
export const FINANCIAL_PRODUCTS = {
  cashISA: {
    label: 'Cash ISA (Low Risk)',
    expectedReturn: 0.04, // 4%
    riskLevel: 'Low',
    description: 'Tax-free savings account with variable interest'
  },
  juniorISA: {
    label: 'Junior ISA (Mixed)',
    expectedReturn: 0.05, // 5%
    riskLevel: 'Low-Medium',
    description: 'Tax-free savings for under-18s, can include stocks & shares'
  },
  stocksSharesISA: {
    label: 'Stocks & Shares ISA (Medium Risk)',
    expectedReturn: 0.07, // 7%
    riskLevel: 'Medium',
    description: 'Investment ISA with market exposure'
  },
  investmentBond: {
    label: 'Investment Bond (Medium-High Risk)',
    expectedReturn: 0.08, // 8%
    riskLevel: 'Medium-High',
    description: 'Insurance-based investment product'
  },
  generalInvestment: {
    label: 'General Investment Account (Variable)',
    expectedReturn: 0.06, // 6%
    riskLevel: 'Variable',
    description: 'Flexible investment account'
  }
};

// Standard growth rate milestones for generic projections
export const GROWTH_RATE_BENCHMARKS = [0.03, 0.04, 0.05, 0.06, 0.07, 0.08];

// FCA-compliant disclaimer text
export const DISCLAIMER_TEXT = `
IMPORTANT INFORMATION

This illustration is for guidance purposes only and does not constitute financial advice. The figures shown are based on assumed rates of inflation (2.5% per annum) and projected investment returns which are not guaranteed.

Past performance is not a reliable indicator of future results. The value of investments can go down as well as up, and you may get back less than you originally invested.

University costs, including tuition fees and living expenses, may vary significantly from those illustrated. Actual costs will depend on the specific university, course of study, and individual circumstances.

This document has been prepared using information believed to be reliable at the time of production. However, no guarantee can be given regarding the accuracy or completeness of the information provided.

Before making any financial decisions, we strongly recommend seeking professional financial advice tailored to your individual circumstances from a qualified Financial Adviser authorised and regulated by the Financial Conduct Authority (FCA).

Tax treatment depends on individual circumstances and may be subject to change in the future.
`.trim();

export const SHORT_DISCLAIMER = `This illustration is for guidance purposes only and does not constitute financial advice. Figures are based on assumed inflation of 2.5% p.a. and are not guaranteed. Past performance is not a reliable indicator of future results. Please seek professional advice before making financial decisions.`;
