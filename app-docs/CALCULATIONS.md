# Calculations Guide

Comprehensive documentation of all formulas and calculation logic used in the University Cost Calculator.

All calculation functions are located in `src/utils/calculations.js`.

## Age and Timeline Calculations

### Calculate Current Age

```javascript
calculateCurrentAge(dateOfBirth)
```

Calculates the child's current age in decimal years.

**Formula:**
```
currentAge = (today - dateOfBirth) / millisecondsPerYear
millisecondsPerYear = 1000 × 60 × 60 × 24 × 365.25
```

**Example:**
- Date of Birth: January 1, 2014
- Today: January 23, 2026
- Current Age: ~12.06 years

### Calculate Years Until University

```javascript
calculateYearsUntilUniversity(dateOfBirth)
```

Calculates years remaining until the child reaches university age (18).

**Formula:**
```
yearsUntilUniversity = max(0, UNIVERSITY_START_AGE - currentAge)
yearsUntilUniversity = max(0, 18 - currentAge)
```

**Example:**
- Current Age: 12.06 years
- Years Until University: 18 - 12.06 = 5.94 years

### Calculate University Start Year

```javascript
calculateUniversityStartYear(dateOfBirth)
```

Determines the year the child will begin university.

**Formula:**
```
startYear = dateOfBirth.year + UNIVERSITY_START_AGE
startYear = dateOfBirth.year + 18
```

**Example:**
- Date of Birth: 2014
- Start Year: 2014 + 18 = 2032

## Inflation Calculations

### Apply Inflation

```javascript
applyInflation(currentValue, years, rate = INFLATION_RATE)
```

Applies compound inflation to project future values.

**Formula:**
```
futureValue = currentValue × (1 + rate)^years
```

**Default Rate:** 2.5% (0.025)

**Example:**
- Current Tuition: £9,250
- Years: 6
- Rate: 2.5%
- Projected: £9,250 × (1.025)^6 = £10,723.89

## Cost Projection Calculations

### Calculate Projected Tuition Fees

```javascript
calculateProjectedTuitionFees(dateOfBirth, degreeYears)
```

Projects tuition fees for each year of the degree program.

**Process:**
1. Calculate years until university start
2. For each year of the degree (0 to degreeYears-1):
   - Calculate years from now: `yearsUntilStart + yearIndex`
   - Calculate academic year: `startYear + yearIndex`
   - Apply inflation: `CURRENT_TUITION_FEE × (1.025)^yearsFromNow`
3. Sum all yearly projections

**Example (3-year degree, 6 years until start):**

| Year | Years From Now | Academic Year | Projected Fee |
|------|----------------|---------------|---------------|
| 1 | 6 | 2032 | £9,250 × 1.025^6 = £10,724 |
| 2 | 7 | 2033 | £9,250 × 1.025^7 = £10,992 |
| 3 | 8 | 2034 | £9,250 × 1.025^8 = £11,267 |
| **Total** | | | **£32,983** |

### Calculate Projected Living Costs

```javascript
calculateProjectedLivingCosts(dateOfBirth, degreeYears, location, includeAccommodation)
```

Projects living costs for each year of the degree program.

**Process:**
1. Select base living cost based on location and accommodation choice:
   - With accommodation: `LIVING_COSTS[location].withAccommodation`
   - Without: `LIVING_COSTS[location].withoutAccommodation`
2. For each year, apply inflation same as tuition
3. Sum all yearly projections

**Example (London with accommodation, 3-year degree, 6 years until start):**

| Year | Years From Now | Projected Cost |
|------|----------------|----------------|
| 1 | 6 | £15,180 × 1.025^6 = £17,600 |
| 2 | 7 | £15,180 × 1.025^7 = £18,040 |
| 3 | 8 | £15,180 × 1.025^8 = £18,491 |
| **Total** | | **£54,131** |

### Calculate Total Costs

```javascript
calculateTotalCosts(dateOfBirth, degreeYears, location, includeAccommodation)
```

Combines tuition and living costs into comprehensive breakdown.

**Output:**
```
grandTotal = totalTuitionFees + totalLivingCosts
```

**Example:**
- Total Tuition (3-year): £32,983
- Total Living (London): £54,131
- **Grand Total: £87,114**

## Savings Scenario Calculations

### Calculate Required Monthly Savings

```javascript
calculateRequiredSavings(targetAmount, yearsToSave)
```

Calculates the monthly savings required to reach the target amount, using the Future Value of Annuity formula solved for payment.

**Formula (Future Value of Annuity):**
```
FV = PMT × [(1 + r)^n - 1] / r

Solved for PMT (monthly payment):
PMT = FV × r / [(1 + r)^n - 1]

Where:
- FV = Target amount (total university cost)
- PMT = Monthly payment required
- r = Monthly interest rate (annual rate / 12)
- n = Total number of months (years × 12)
```

**Special Case (0% growth):**
```
PMT = targetAmount / totalMonths
```

**Additional Calculations:**
```
totalContributions = monthlySavings × totalMonths
investmentGrowth = targetAmount - totalContributions
growthPercentOfTarget = (investmentGrowth / targetAmount) × 100
```

**Example (Target: £87,114, Years: 6, Rate: 5%):**

1. Convert to monthly: `r = 0.05 / 12 = 0.004167`
2. Total months: `n = 6 × 12 = 72`
3. Factor: `(1 + 0.004167)^72 - 1 = 0.3489`
4. Monthly payment: `PMT = £87,114 × 0.004167 / 0.3489 = £1,041`
5. Total contributions: `£1,041 × 72 = £74,952`
6. Investment growth: `£87,114 - £74,952 = £12,162`
7. Growth %: `(£12,162 / £87,114) × 100 = 14.0%`

### Savings Scenarios Output

The function returns an array of 6 scenarios (3%, 4%, 5%, 6%, 7%, 8%):

| Growth Rate | Monthly Savings | Total Contributions | Investment Growth | Growth % |
|-------------|-----------------|---------------------|-------------------|----------|
| 3.0% | £1,107 | £79,704 | £7,410 | 8.5% |
| 4.0% | £1,073 | £77,256 | £9,858 | 11.3% |
| 5.0% | £1,041 | £74,952 | £12,162 | 14.0% |
| 6.0% | £1,010 | £72,720 | £14,394 | 16.5% |
| 7.0% | £980 | £70,560 | £16,554 | 19.0% |
| 8.0% | £951 | £68,472 | £18,642 | 21.4% |

### Calculate Lump Sum Required

```javascript
calculateLumpSumRequired(targetAmount, yearsToInvest)
```

Calculates the one-time investment needed today to reach the target amount.

**Formula (Present Value):**
```
PV = FV / (1 + r)^n

Where:
- PV = Present Value (lump sum needed)
- FV = Future Value (target amount)
- r = Annual interest rate
- n = Number of years
```

**Additional Calculations:**
```
totalGrowth = targetAmount - lumpSumRequired
growthPercentOfTarget = (totalGrowth / targetAmount) × 100
```

**Example (Target: £87,114, Years: 6, Rate: 5%):**

1. Lump sum: `PV = £87,114 / (1.05)^6 = £65,009`
2. Total growth: `£87,114 - £65,009 = £22,105`
3. Growth %: `(£22,105 / £87,114) × 100 = 25.4%`

### Lump Sum Scenarios Output

| Growth Rate | Lump Sum Required | Total Growth | Growth % |
|-------------|-------------------|--------------|----------|
| 3.0% | £72,972 | £14,142 | 16.2% |
| 4.0% | £68,842 | £18,272 | 21.0% |
| 5.0% | £65,009 | £22,105 | 25.4% |
| 6.0% | £61,444 | £25,670 | 29.5% |
| 7.0% | £58,122 | £28,992 | 33.3% |
| 8.0% | £55,022 | £32,092 | 36.8% |

## Formatting Functions

### Format Currency

```javascript
formatCurrency(amount, showPence = false)
```

Formats a number as GBP currency.

**Implementation:**
```javascript
new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: showPence ? 2 : 0,
  maximumFractionDigits: showPence ? 2 : 0
}).format(amount)
```

**Examples:**
- `formatCurrency(35250)` → `"£35,250"`
- `formatCurrency(1234.56, true)` → `"£1,234.56"`

### Format Date

```javascript
formatDate(date)
```

Formats a date in UK format.

**Implementation:**
```javascript
new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'long',
  year: 'numeric'
}).format(date)
```

**Example:**
- `formatDate(new Date(2026, 0, 23))` → `"23 January 2026"`

## Report Generation

### Generate Report

```javascript
generateReport({ clientName, dateOfBirth, location, includeAccommodation })
```

Main aggregation function that orchestrates all calculations.

**Process:**
1. Calculate child info (age, years until uni, start year)
2. Calculate 3-year degree costs and scenarios
3. Calculate 4-year degree costs and scenarios
4. Generate reference number
5. Compile all data into report structure

**Reference Number Format:**
```javascript
referenceNumber = 'UNI-' + Date.now().toString(36).toUpperCase()
// Example: "UNI-LM5X9K2A"
```

## Formula Summary Table

| Calculation | Formula |
|-------------|---------|
| Current Age | `(today - DOB) / (365.25 × 24 × 60 × 60 × 1000)` |
| Years Until Uni | `max(0, 18 - currentAge)` |
| Compound Inflation | `value × (1 + 0.025)^years` |
| Monthly Savings (FVA) | `target × (r/12) / [(1 + r/12)^(years×12) - 1]` |
| Lump Sum (PV) | `target / (1 + rate)^years` |
| Investment Growth | `target - contributions` |
| Growth Percentage | `(growth / target) × 100` |

## Accuracy Notes

- All monetary calculations use JavaScript's native floating-point arithmetic
- Currency formatting rounds to whole pounds by default
- Age calculations account for leap years (365.25 days/year)
- Compound interest uses standard financial formulas
