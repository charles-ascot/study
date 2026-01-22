import { 
  CURRENT_TUITION_FEE, 
  INFLATION_RATE, 
  UNIVERSITY_START_AGE,
  LIVING_COSTS,
  GROWTH_RATE_BENCHMARKS
} from '../constants/universityData';

/**
 * Calculate the child's current age based on date of birth
 * @param {Date} dateOfBirth - Child's date of birth
 * @returns {number} Current age in years (decimal)
 */
export function calculateCurrentAge(dateOfBirth) {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  const ageInMs = today - birthDate;
  const ageInYears = ageInMs / (1000 * 60 * 60 * 24 * 365.25);
  return ageInYears;
}

/**
 * Calculate years until university start
 * @param {Date} dateOfBirth - Child's date of birth
 * @returns {number} Years until university (can be negative if already past 18)
 */
export function calculateYearsUntilUniversity(dateOfBirth) {
  const currentAge = calculateCurrentAge(dateOfBirth);
  return Math.max(0, UNIVERSITY_START_AGE - currentAge);
}

/**
 * Calculate the projected university start year
 * @param {Date} dateOfBirth - Child's date of birth
 * @returns {number} The year the child will likely start university
 */
export function calculateUniversityStartYear(dateOfBirth) {
  const birthDate = new Date(dateOfBirth);
  return birthDate.getFullYear() + UNIVERSITY_START_AGE;
}

/**
 * Apply compound inflation to a value
 * @param {number} currentValue - The current value
 * @param {number} years - Number of years to project
 * @param {number} rate - Inflation rate (default 2.5%)
 * @returns {number} Inflated value
 */
export function applyInflation(currentValue, years, rate = INFLATION_RATE) {
  return currentValue * Math.pow(1 + rate, years);
}

/**
 * Calculate projected tuition fees for each year of university
 * @param {Date} dateOfBirth - Child's date of birth
 * @param {number} degreeYears - Number of years for the degree (3 or 4)
 * @returns {Object} Detailed tuition fee projections
 */
export function calculateProjectedTuitionFees(dateOfBirth, degreeYears) {
  const yearsUntilStart = calculateYearsUntilUniversity(dateOfBirth);
  const startYear = calculateUniversityStartYear(dateOfBirth);
  
  const yearlyProjections = [];
  let totalTuitionFees = 0;

  for (let i = 0; i < degreeYears; i++) {
    const yearsFromNow = yearsUntilStart + i;
    const academicYear = startYear + i;
    const projectedFee = applyInflation(CURRENT_TUITION_FEE, yearsFromNow);
    
    yearlyProjections.push({
      year: i + 1,
      academicYear: `${academicYear}/${academicYear + 1}`,
      projectedFee: projectedFee,
      inflationYears: yearsFromNow
    });
    
    totalTuitionFees += projectedFee;
  }

  return {
    currentFee: CURRENT_TUITION_FEE,
    yearsUntilStart: yearsUntilStart,
    startYear: startYear,
    degreeYears: degreeYears,
    yearlyProjections: yearlyProjections,
    totalTuitionFees: totalTuitionFees
  };
}

/**
 * Calculate projected living costs for each year of university
 * @param {Date} dateOfBirth - Child's date of birth
 * @param {number} degreeYears - Number of years for the degree
 * @param {string} location - Location key from LIVING_COSTS
 * @param {boolean} includeAccommodation - Whether to include accommodation costs
 * @returns {Object} Detailed living cost projections
 */
export function calculateProjectedLivingCosts(dateOfBirth, degreeYears, location, includeAccommodation) {
  const yearsUntilStart = calculateYearsUntilUniversity(dateOfBirth);
  const startYear = calculateUniversityStartYear(dateOfBirth);
  const locationData = LIVING_COSTS[location];
  
  const currentAnnualCost = includeAccommodation 
    ? locationData.withAccommodation 
    : locationData.withoutAccommodation;
  
  const yearlyProjections = [];
  let totalLivingCosts = 0;

  for (let i = 0; i < degreeYears; i++) {
    const yearsFromNow = yearsUntilStart + i;
    const academicYear = startYear + i;
    const projectedCost = applyInflation(currentAnnualCost, yearsFromNow);
    
    yearlyProjections.push({
      year: i + 1,
      academicYear: `${academicYear}/${academicYear + 1}`,
      projectedCost: projectedCost,
      inflationYears: yearsFromNow
    });
    
    totalLivingCosts += projectedCost;
  }

  return {
    location: locationData.label,
    locationDescription: locationData.description,
    includeAccommodation: includeAccommodation,
    currentAnnualCost: currentAnnualCost,
    yearsUntilStart: yearsUntilStart,
    startYear: startYear,
    degreeYears: degreeYears,
    yearlyProjections: yearlyProjections,
    totalLivingCosts: totalLivingCosts
  };
}

/**
 * Calculate the total projected university costs
 * @param {Date} dateOfBirth - Child's date of birth
 * @param {number} degreeYears - Number of years for the degree
 * @param {string} location - Location key
 * @param {boolean} includeAccommodation - Whether to include accommodation
 * @returns {Object} Complete cost breakdown
 */
export function calculateTotalCosts(dateOfBirth, degreeYears, location, includeAccommodation) {
  const tuition = calculateProjectedTuitionFees(dateOfBirth, degreeYears);
  const living = calculateProjectedLivingCosts(dateOfBirth, degreeYears, location, includeAccommodation);
  
  const totalCost = tuition.totalTuitionFees + living.totalLivingCosts;
  
  // Combine yearly projections
  const yearlyBreakdown = tuition.yearlyProjections.map((tuitionYear, index) => {
    const livingYear = living.yearlyProjections[index];
    return {
      year: tuitionYear.year,
      academicYear: tuitionYear.academicYear,
      tuitionFee: tuitionYear.projectedFee,
      livingCost: livingYear.projectedCost,
      totalYearlyCost: tuitionYear.projectedFee + livingYear.projectedCost
    };
  });

  return {
    tuition: tuition,
    living: living,
    yearlyBreakdown: yearlyBreakdown,
    totalTuitionFees: tuition.totalTuitionFees,
    totalLivingCosts: living.totalLivingCosts,
    grandTotal: totalCost
  };
}

/**
 * Calculate required monthly savings for different growth rates
 * @param {number} targetAmount - Total amount needed
 * @param {number} yearsToSave - Number of years available to save
 * @returns {Array} Array of growth rate scenarios with monthly savings required
 */
export function calculateRequiredSavings(targetAmount, yearsToSave) {
  return GROWTH_RATE_BENCHMARKS.map(rate => {
    const monthlyPayments = yearsToSave * 12;
    
    // Using the future value of annuity formula, solved for PMT
    // FV = PMT * [((1 + r)^n - 1) / r]
    // PMT = FV * r / ((1 + r)^n - 1)
    
    const monthlyRate = rate / 12;
    let monthlySavings;
    
    if (monthlyRate === 0) {
      monthlySavings = targetAmount / monthlyPayments;
    } else {
      const factor = Math.pow(1 + monthlyRate, monthlyPayments) - 1;
      monthlySavings = (targetAmount * monthlyRate) / factor;
    }

    // Calculate total contributions and growth
    const totalContributions = monthlySavings * monthlyPayments;
    const investmentGrowth = targetAmount - totalContributions;

    return {
      annualRate: rate,
      annualRatePercent: (rate * 100).toFixed(1),
      monthlySavings: monthlySavings,
      totalContributions: totalContributions,
      investmentGrowth: investmentGrowth,
      growthPercentOfTarget: (investmentGrowth / targetAmount) * 100
    };
  });
}

/**
 * Calculate lump sum investment needed for different growth rates
 * @param {number} targetAmount - Total amount needed
 * @param {number} yearsToInvest - Number of years available
 * @returns {Array} Array of growth rate scenarios with lump sum required
 */
export function calculateLumpSumRequired(targetAmount, yearsToInvest) {
  return GROWTH_RATE_BENCHMARKS.map(rate => {
    // PV = FV / (1 + r)^n
    const lumpSum = targetAmount / Math.pow(1 + rate, yearsToInvest);
    const growth = targetAmount - lumpSum;

    return {
      annualRate: rate,
      annualRatePercent: (rate * 100).toFixed(1),
      lumpSumRequired: lumpSum,
      totalGrowth: growth,
      growthPercentOfTarget: (growth / targetAmount) * 100
    };
  });
}

/**
 * Format currency for display
 * @param {number} amount - Amount to format
 * @param {boolean} showPence - Whether to show pence
 * @returns {string} Formatted currency string
 */
export function formatCurrency(amount, showPence = false) {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: showPence ? 2 : 0,
    maximumFractionDigits: showPence ? 2 : 0
  }).format(amount);
}

/**
 * Format a date for display
 * @param {Date} date - Date to format
 * @returns {string} Formatted date string
 */
export function formatDate(date) {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date(date));
}

/**
 * Generate a complete financial projection report
 * @param {Object} params - Report parameters
 * @returns {Object} Complete report data
 */
export function generateReport(params) {
  const { clientName, dateOfBirth, location, includeAccommodation } = params;
  
  const today = new Date();
  const currentAge = calculateCurrentAge(dateOfBirth);
  const yearsUntilUni = calculateYearsUntilUniversity(dateOfBirth);
  
  // Calculate for both 3 and 4 year degrees
  const costs3Year = calculateTotalCosts(dateOfBirth, 3, location, includeAccommodation);
  const costs4Year = calculateTotalCosts(dateOfBirth, 4, location, includeAccommodation);
  
  // Calculate savings scenarios
  const savings3Year = calculateRequiredSavings(costs3Year.grandTotal, yearsUntilUni);
  const savings4Year = calculateRequiredSavings(costs4Year.grandTotal, yearsUntilUni);
  
  // Calculate lump sum scenarios
  const lumpSum3Year = calculateLumpSumRequired(costs3Year.grandTotal, yearsUntilUni);
  const lumpSum4Year = calculateLumpSumRequired(costs4Year.grandTotal, yearsUntilUni);

  return {
    reportMeta: {
      generatedAt: today,
      clientName: clientName,
      referenceNumber: `UNI-${Date.now().toString(36).toUpperCase()}`
    },
    childInfo: {
      dateOfBirth: dateOfBirth,
      currentAge: currentAge,
      yearsUntilUniversity: yearsUntilUni,
      projectedStartYear: calculateUniversityStartYear(dateOfBirth)
    },
    assumptions: {
      inflationRate: INFLATION_RATE,
      currentTuitionFee: CURRENT_TUITION_FEE,
      location: LIVING_COSTS[location].label,
      includeAccommodation: includeAccommodation,
      currentLivingCost: includeAccommodation 
        ? LIVING_COSTS[location].withAccommodation 
        : LIVING_COSTS[location].withoutAccommodation
    },
    projections: {
      threeYear: {
        costs: costs3Year,
        monthlySavings: savings3Year,
        lumpSum: lumpSum3Year
      },
      fourYear: {
        costs: costs4Year,
        monthlySavings: savings4Year,
        lumpSum: lumpSum4Year
      }
    }
  };
}
