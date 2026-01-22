import { useState } from 'react';
import Calculator from './components/Calculator';
import Report from './components/Report';
import { generateReport } from './utils/calculations';

function App() {
  const [reportData, setReportData] = useState(null);
  const [showReport, setShowReport] = useState(false);

  const handleCalculate = (formData) => {
    const report = generateReport(formData);
    setReportData(report);
    setShowReport(true);
  };

  const handleBack = () => {
    setShowReport(false);
  };

  const handleNewCalculation = () => {
    setReportData(null);
    setShowReport(false);
  };

  return (
    <div className="min-h-screen relative">
      {/* Animated background */}
      <div className="animated-bg" />
      
      {/* Floating orbs */}
      <div className="floating-orbs">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <div className="orb orb-4" />
      </div>

      {/* Main content */}
      <div className="relative z-10 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <header className="text-center mb-8">
            <h1 className="font-lexend text-2xl sm:text-3xl font-semibold text-white mb-2">
              University Cost Calculator
            </h1>
            <p className="font-nunito text-sm text-white/60">
              Professional financial planning tool for education costs
            </p>
          </header>

          {/* Main content area */}
          {!showReport ? (
            <Calculator onCalculate={handleCalculate} />
          ) : (
            <Report 
              data={reportData} 
              onBack={handleBack}
              onNewCalculation={handleNewCalculation}
            />
          )}

          {/* Footer */}
          <footer className="mt-12 text-center">
            <p className="font-nunito text-xs text-white/40">
              © {new Date().getFullYear()} University Cost Calculator. For illustrative purposes only.
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default App;
