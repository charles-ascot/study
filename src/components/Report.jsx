import { useState } from 'react';
import { 
  ArrowLeft, 
  Download, 
  FileText, 
  GraduationCap, 
  TrendingUp, 
  PiggyBank,
  Calculator,
  Calendar,
  MapPin,
  Home,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  RefreshCw
} from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/calculations';
import { downloadPDF } from '../utils/pdfGenerator';
import { SHORT_DISCLAIMER, INFLATION_RATE } from '../constants/universityData';

function Report({ data, onBack, onNewCalculation }) {
  const [expandedSection, setExpandedSection] = useState('3year');
  const [downloading, setDownloading] = useState(false);

  const handleDownloadPDF = async () => {
    setDownloading(true);
    try {
      // Small delay for UX
      await new Promise(resolve => setTimeout(resolve, 500));
      downloadPDF(data);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setDownloading(false);
    }
  };

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="space-y-6 fade-in">
      {/* Header Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button 
          onClick={onBack}
          className="glass-button-secondary text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Calculator
        </button>
        
        <div className="flex gap-3">
          <button 
            onClick={onNewCalculation}
            className="glass-button-secondary text-sm"
          >
            <RefreshCw className="w-4 h-4" />
            New Calculation
          </button>
          <button 
            onClick={handleDownloadPDF}
            disabled={downloading}
            className="glass-button text-sm"
          >
            {downloading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Download PDF
              </>
            )}
          </button>
        </div>
      </div>

      {/* Report Header */}
      <div className="glass-panel-strong p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500/30 to-purple-500/30 border border-white/10">
              <FileText className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <h2 className="font-lexend text-xl font-semibold text-white">
                University Cost Projection Report
              </h2>
              <p className="font-nunito text-sm text-white/50 mt-1">
                Prepared for {data.reportMeta.clientName}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-white/40 font-nunito">Reference</p>
            <p className="text-sm text-white/80 font-mono">{data.reportMeta.referenceNumber}</p>
            <p className="text-xs text-white/40 font-nunito mt-1">
              {formatDate(data.reportMeta.generatedAt)}
            </p>
          </div>
        </div>
      </div>

      {/* Client & Child Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-5">
          <h3 className="font-lexend text-sm font-semibold text-white/80 mb-4 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-purple-400" />
            Child Information
          </h3>
          <div className="space-y-3">
            <InfoRow 
              label="Date of Birth" 
              value={formatDate(data.childInfo.dateOfBirth)} 
            />
            <InfoRow 
              label="Current Age" 
              value={`${Math.floor(data.childInfo.currentAge)} years, ${Math.floor((data.childInfo.currentAge % 1) * 12)} months`} 
            />
            <InfoRow 
              label="Years Until University" 
              value={`${Math.floor(data.childInfo.yearsUntilUniversity)} years`} 
            />
            <InfoRow 
              label="Projected Start" 
              value={`September ${data.childInfo.projectedStartYear}`} 
            />
          </div>
        </div>

        <div className="glass-panel p-5">
          <h3 className="font-lexend text-sm font-semibold text-white/80 mb-4 flex items-center gap-2">
            <Calculator className="w-4 h-4 text-cyan-400" />
            Calculation Assumptions
          </h3>
          <div className="space-y-3">
            <InfoRow 
              label="Current Tuition Fee" 
              value={formatCurrency(data.assumptions.currentTuitionFee)} 
            />
            <InfoRow 
              label="Inflation Rate" 
              value={`${(INFLATION_RATE * 100).toFixed(1)}% p.a.`} 
            />
            <InfoRow 
              label="Location" 
              value={data.assumptions.location}
              icon={<MapPin className="w-3 h-3" />}
            />
            <InfoRow 
              label="Accommodation" 
              value={data.assumptions.includeAccommodation ? 'Included' : 'Excluded'}
              icon={<Home className="w-3 h-3" />}
            />
          </div>
        </div>
      </div>

      {/* Cost Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SummaryCard
          title="3-Year Degree"
          subtitle="Standard Programme"
          amount={data.projections.threeYear.costs.grandTotal}
          tuition={data.projections.threeYear.costs.totalTuitionFees}
          living={data.projections.threeYear.costs.totalLivingCosts}
          color="indigo"
        />
        <SummaryCard
          title="4-Year Degree"
          subtitle="With Placement Year"
          amount={data.projections.fourYear.costs.grandTotal}
          tuition={data.projections.fourYear.costs.totalTuitionFees}
          living={data.projections.fourYear.costs.totalLivingCosts}
          color="purple"
        />
      </div>

      {/* Detailed Projections - 3 Year */}
      <CollapsibleSection
        title="3-Year Degree Detailed Projections"
        subtitle="Standard undergraduate programme"
        icon={<GraduationCap className="w-5 h-5 text-indigo-400" />}
        isExpanded={expandedSection === '3year'}
        onToggle={() => toggleSection('3year')}
      >
        <ProjectionDetails 
          data={data.projections.threeYear} 
          yearsUntilUni={data.childInfo.yearsUntilUniversity}
        />
      </CollapsibleSection>

      {/* Detailed Projections - 4 Year */}
      <CollapsibleSection
        title="4-Year Degree Detailed Projections"
        subtitle="Programme with placement or sandwich year"
        icon={<GraduationCap className="w-5 h-5 text-purple-400" />}
        isExpanded={expandedSection === '4year'}
        onToggle={() => toggleSection('4year')}
      >
        <ProjectionDetails 
          data={data.projections.fourYear} 
          yearsUntilUni={data.childInfo.yearsUntilUniversity}
        />
      </CollapsibleSection>

      {/* Disclaimer */}
      <div className="disclaimer">
        <div className="disclaimer-title">
          <AlertTriangle className="w-4 h-4" />
          Important Disclaimer
        </div>
        <p className="font-nunito">{SHORT_DISCLAIMER}</p>
      </div>
    </div>
  );
}

// Helper Components

function InfoRow({ label, value, icon }) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-white/50 font-nunito flex items-center gap-1.5">
        {icon}
        {label}
      </span>
      <span className="text-white font-nunito font-medium">{value}</span>
    </div>
  );
}

function SummaryCard({ title, subtitle, amount, tuition, living, color }) {
  const colorClasses = {
    indigo: 'from-indigo-500/20 to-indigo-600/10 border-indigo-500/20',
    purple: 'from-purple-500/20 to-purple-600/10 border-purple-500/20'
  };

  return (
    <div className={`glass-panel p-5 bg-gradient-to-br ${colorClasses[color]}`}>
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 rounded-lg bg-white/5">
          <GraduationCap className={`w-4 h-4 ${color === 'indigo' ? 'text-indigo-400' : 'text-purple-400'}`} />
        </div>
        <div>
          <h4 className="font-lexend text-sm font-semibold text-white">{title}</h4>
          <p className="text-xs text-white/40 font-nunito">{subtitle}</p>
        </div>
      </div>
      <div className="mt-4">
        <p className="font-lexend text-2xl font-bold text-gradient">
          {formatCurrency(amount)}
        </p>
        <div className="flex gap-4 mt-2 text-xs text-white/50 font-nunito">
          <span>Tuition: {formatCurrency(tuition)}</span>
          <span>Living: {formatCurrency(living)}</span>
        </div>
      </div>
    </div>
  );
}

function CollapsibleSection({ title, subtitle, icon, isExpanded, onToggle, children }) {
  return (
    <div className="glass-panel overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full p-5 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          {icon}
          <div>
            <h3 className="font-lexend text-sm font-semibold text-white">{title}</h3>
            <p className="text-xs text-white/40 font-nunito">{subtitle}</p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-white/40" />
        ) : (
          <ChevronDown className="w-5 h-5 text-white/40" />
        )}
      </button>
      {isExpanded && (
        <div className="border-t border-white/5 p-5">
          {children}
        </div>
      )}
    </div>
  );
}

function ProjectionDetails({ data, yearsUntilUni }) {
  return (
    <div className="space-y-6">
      {/* Year-by-Year Breakdown */}
      <div>
        <h4 className="font-lexend text-xs font-semibold text-white/70 uppercase tracking-wide mb-3 flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          Year-by-Year Cost Breakdown
        </h4>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Academic Year</th>
                <th className="text-right">Tuition Fee</th>
                <th className="text-right">Living Costs</th>
                <th className="text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {data.costs.yearlyBreakdown.map((year) => (
                <tr key={year.year}>
                  <td className="font-medium">Year {year.year} ({year.academicYear})</td>
                  <td className="text-right">{formatCurrency(year.tuitionFee)}</td>
                  <td className="text-right">{formatCurrency(year.livingCost)}</td>
                  <td className="text-right font-semibold">{formatCurrency(year.totalYearlyCost)}</td>
                </tr>
              ))}
              <tr className="bg-white/5">
                <td className="font-bold">Total</td>
                <td className="text-right font-bold">{formatCurrency(data.costs.totalTuitionFees)}</td>
                <td className="text-right font-bold">{formatCurrency(data.costs.totalLivingCosts)}</td>
                <td className="text-right font-bold text-gradient">{formatCurrency(data.costs.grandTotal)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Monthly Savings Required */}
      <div>
        <h4 className="font-lexend text-xs font-semibold text-white/70 uppercase tracking-wide mb-3 flex items-center gap-2">
          <PiggyBank className="w-4 h-4" />
          Monthly Savings Required
          <span className="text-white/40 font-normal normal-case">
            (over {Math.floor(yearsUntilUni)} years)
          </span>
        </h4>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Annual Return</th>
                <th className="text-right">Monthly Saving</th>
                <th className="text-right">Total Contributions</th>
                <th className="text-right">Investment Growth</th>
              </tr>
            </thead>
            <tbody>
              {data.monthlySavings.map((scenario) => (
                <tr key={scenario.annualRate}>
                  <td className="font-medium">{scenario.annualRatePercent}%</td>
                  <td className="text-right text-emerald-400 font-semibold">
                    {formatCurrency(scenario.monthlySavings, true)}
                  </td>
                  <td className="text-right">{formatCurrency(scenario.totalContributions)}</td>
                  <td className="text-right text-cyan-400">{formatCurrency(scenario.investmentGrowth)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lump Sum Investment */}
      <div>
        <h4 className="font-lexend text-xs font-semibold text-white/70 uppercase tracking-wide mb-3 flex items-center gap-2">
          <TrendingUp className="w-4 h-4" />
          Lump Sum Investment Required
          <span className="text-white/40 font-normal normal-case">
            (one-time investment today)
          </span>
        </h4>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Annual Return</th>
                <th className="text-right">Lump Sum Required</th>
                <th className="text-right">Projected Growth</th>
                <th className="text-right">Growth %</th>
              </tr>
            </thead>
            <tbody>
              {data.lumpSum.map((scenario) => (
                <tr key={scenario.annualRate}>
                  <td className="font-medium">{scenario.annualRatePercent}%</td>
                  <td className="text-right text-amber-400 font-semibold">
                    {formatCurrency(scenario.lumpSumRequired)}
                  </td>
                  <td className="text-right text-cyan-400">{formatCurrency(scenario.totalGrowth)}</td>
                  <td className="text-right">{scenario.growthPercentOfTarget.toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Report;
