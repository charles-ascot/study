import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { formatCurrency, formatDate } from './calculations';
import { DISCLAIMER_TEXT, INFLATION_RATE } from '../constants/universityData';

/**
 * Generate a professional PDF report
 * @param {Object} reportData - The complete report data from generateReport()
 * @returns {jsPDF} The generated PDF document
 */
export function generatePDF(reportData) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);
  let yPos = margin;

  // Colors
  const primaryColor = [99, 102, 241]; // Indigo
  const secondaryColor = [168, 85, 247]; // Purple
  const textColor = [51, 51, 51];
  const lightGray = [128, 128, 128];

  // Helper function to add new page if needed
  const checkPageBreak = (requiredSpace) => {
    if (yPos + requiredSpace > doc.internal.pageSize.getHeight() - margin) {
      doc.addPage();
      yPos = margin;
      return true;
    }
    return false;
  };

  // Header
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 45, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('University Cost Projection Report', margin, 25);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated: ${formatDate(reportData.reportMeta.generatedAt)}`, margin, 35);
  doc.text(`Reference: ${reportData.reportMeta.referenceNumber}`, pageWidth - margin - 60, 35);

  yPos = 60;

  // Client Information Section
  doc.setTextColor(...textColor);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Client Information', margin, yPos);
  yPos += 10;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  const clientInfo = [
    ['Client Name', reportData.reportMeta.clientName],
    ['Child\'s Date of Birth', formatDate(reportData.childInfo.dateOfBirth)],
    ['Child\'s Current Age', `${Math.floor(reportData.childInfo.currentAge)} years ${Math.floor((reportData.childInfo.currentAge % 1) * 12)} months`],
    ['Years Until University', `${Math.floor(reportData.childInfo.yearsUntilUniversity)} years`],
    ['Projected University Start', `September ${reportData.childInfo.projectedStartYear}`]
  ];

  doc.autoTable({
    startY: yPos,
    head: [],
    body: clientInfo,
    theme: 'plain',
    margin: { left: margin, right: margin },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 50 },
      1: { cellWidth: contentWidth - 50 }
    },
    styles: {
      fontSize: 10,
      cellPadding: 3
    }
  });

  yPos = doc.lastAutoTable.finalY + 15;

  // Assumptions Section
  checkPageBreak(40);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...textColor);
  doc.text('Calculation Assumptions', margin, yPos);
  yPos += 10;

  const assumptions = [
    ['Current Tuition Fee (2024/25)', formatCurrency(reportData.assumptions.currentTuitionFee)],
    ['Inflation Rate Applied', `${(INFLATION_RATE * 100).toFixed(1)}% per annum`],
    ['Location for Living Costs', reportData.assumptions.location],
    ['Accommodation Included', reportData.assumptions.includeAccommodation ? 'Yes' : 'No'],
    ['Current Annual Living Cost', formatCurrency(reportData.assumptions.currentLivingCost)]
  ];

  doc.autoTable({
    startY: yPos,
    head: [],
    body: assumptions,
    theme: 'plain',
    margin: { left: margin, right: margin },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 55 },
      1: { cellWidth: contentWidth - 55 }
    },
    styles: {
      fontSize: 10,
      cellPadding: 3
    }
  });

  yPos = doc.lastAutoTable.finalY + 20;

  // Function to add cost projections for a degree duration
  const addCostProjections = (degreeData, title) => {
    checkPageBreak(80);
    
    // Section header with gradient-like bar
    doc.setFillColor(...secondaryColor);
    doc.rect(margin, yPos - 5, contentWidth, 12, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(title, margin + 5, yPos + 3);
    yPos += 15;

    // Summary box
    doc.setFillColor(245, 245, 250);
    doc.roundedRect(margin, yPos, contentWidth, 25, 3, 3, 'F');
    
    doc.setTextColor(...primaryColor);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Total Projected Cost:', margin + 5, yPos + 10);
    doc.setFontSize(16);
    doc.text(formatCurrency(degreeData.costs.grandTotal), margin + 5, yPos + 20);
    
    doc.setTextColor(...lightGray);
    doc.setFontSize(9);
    doc.text(`Tuition: ${formatCurrency(degreeData.costs.totalTuitionFees)} | Living: ${formatCurrency(degreeData.costs.totalLivingCosts)}`, margin + 80, yPos + 15);
    
    yPos += 35;

    // Year-by-year breakdown
    checkPageBreak(50);
    doc.setTextColor(...textColor);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Year-by-Year Cost Breakdown', margin, yPos);
    yPos += 8;

    const yearlyData = degreeData.costs.yearlyBreakdown.map(year => [
      `Year ${year.year} (${year.academicYear})`,
      formatCurrency(year.tuitionFee),
      formatCurrency(year.livingCost),
      formatCurrency(year.totalYearlyCost)
    ]);

    // Add totals row
    yearlyData.push([
      'TOTAL',
      formatCurrency(degreeData.costs.totalTuitionFees),
      formatCurrency(degreeData.costs.totalLivingCosts),
      formatCurrency(degreeData.costs.grandTotal)
    ]);

    doc.autoTable({
      startY: yPos,
      head: [['Academic Year', 'Tuition Fee', 'Living Costs', 'Total']],
      body: yearlyData,
      theme: 'striped',
      margin: { left: margin, right: margin },
      headStyles: {
        fillColor: primaryColor,
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 9
      },
      bodyStyles: {
        fontSize: 9
      },
      footStyles: {
        fillColor: [230, 230, 240],
        fontStyle: 'bold'
      },
      columnStyles: {
        0: { cellWidth: 55 },
        1: { cellWidth: 35, halign: 'right' },
        2: { cellWidth: 35, halign: 'right' },
        3: { cellWidth: 35, halign: 'right' }
      }
    });

    yPos = doc.lastAutoTable.finalY + 15;

    // Monthly savings scenarios
    checkPageBreak(60);
    doc.setTextColor(...textColor);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Monthly Savings Required by Growth Rate', margin, yPos);
    yPos += 8;

    const savingsData = degreeData.monthlySavings.map(scenario => [
      `${scenario.annualRatePercent}%`,
      formatCurrency(scenario.monthlySavings, true),
      formatCurrency(scenario.totalContributions),
      formatCurrency(scenario.investmentGrowth)
    ]);

    doc.autoTable({
      startY: yPos,
      head: [['Annual Return', 'Monthly Saving', 'Total Contributions', 'Investment Growth']],
      body: savingsData,
      theme: 'striped',
      margin: { left: margin, right: margin },
      headStyles: {
        fillColor: secondaryColor,
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 9
      },
      bodyStyles: {
        fontSize: 9
      },
      columnStyles: {
        0: { cellWidth: 30, halign: 'center' },
        1: { cellWidth: 40, halign: 'right' },
        2: { cellWidth: 45, halign: 'right' },
        3: { cellWidth: 45, halign: 'right' }
      }
    });

    yPos = doc.lastAutoTable.finalY + 15;

    // Lump sum scenarios
    checkPageBreak(50);
    doc.setTextColor(...textColor);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Lump Sum Investment Required by Growth Rate', margin, yPos);
    yPos += 8;

    const lumpSumData = degreeData.lumpSum.map(scenario => [
      `${scenario.annualRatePercent}%`,
      formatCurrency(scenario.lumpSumRequired),
      formatCurrency(scenario.totalGrowth),
      `${scenario.growthPercentOfTarget.toFixed(1)}%`
    ]);

    doc.autoTable({
      startY: yPos,
      head: [['Annual Return', 'Lump Sum Required', 'Projected Growth', '% of Target']],
      body: lumpSumData,
      theme: 'striped',
      margin: { left: margin, right: margin },
      headStyles: {
        fillColor: [34, 211, 153], // Green
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 9
      },
      bodyStyles: {
        fontSize: 9
      },
      columnStyles: {
        0: { cellWidth: 30, halign: 'center' },
        1: { cellWidth: 45, halign: 'right' },
        2: { cellWidth: 45, halign: 'right' },
        3: { cellWidth: 40, halign: 'center' }
      }
    });

    yPos = doc.lastAutoTable.finalY + 25;
  };

  // Add 3-year projections
  addCostProjections(reportData.projections.threeYear, '3-Year Degree Programme');
  
  // Add 4-year projections
  addCostProjections(reportData.projections.fourYear, '4-Year Degree Programme (with Placement)');

  // Disclaimer Section
  checkPageBreak(80);
  
  doc.setFillColor(255, 251, 235); // Amber light
  doc.roundedRect(margin, yPos, contentWidth, 70, 3, 3, 'F');
  doc.setDrawColor(245, 158, 11); // Amber
  doc.roundedRect(margin, yPos, contentWidth, 70, 3, 3, 'S');
  
  doc.setTextColor(180, 83, 9); // Amber dark
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('IMPORTANT DISCLAIMER', margin + 5, yPos + 10);
  
  doc.setTextColor(120, 53, 15);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  
  const disclaimerLines = doc.splitTextToSize(DISCLAIMER_TEXT, contentWidth - 10);
  doc.text(disclaimerLines, margin + 5, yPos + 18);

  // Footer on all pages
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(...lightGray);
    doc.text(
      `Page ${i} of ${totalPages} | University Cost Projection Report | ${reportData.reportMeta.referenceNumber}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }

  return doc;
}

/**
 * Download the PDF report
 * @param {Object} reportData - The complete report data
 * @param {string} filename - Optional filename
 */
export function downloadPDF(reportData, filename) {
  const doc = generatePDF(reportData);
  const defaultFilename = `University_Cost_Report_${reportData.reportMeta.clientName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(filename || defaultFilename);
}
