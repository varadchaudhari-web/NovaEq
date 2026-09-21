import jsPDF from 'jspdf';
import type { User, Holding } from '@/types';
import { formatCurrency, formatPercent, formatDate } from './utils';

const COLORS = {
  primary: [29, 78, 216] as [number, number, number],
  accent: [16, 185, 129] as [number, number, number],
  dark: [15, 23, 42] as [number, number, number],
  gray: [100, 116, 139] as [number, number, number],
  light: [248, 250, 252] as [number, number, number],
  red: [239, 68, 68] as [number, number, number],
  green: [16, 185, 129] as [number, number, number],
};

function addHeader(doc: jsPDF, title: string, subtitle: string) {
  // Dark header background
  doc.setFillColor(...COLORS.dark);
  doc.rect(0, 0, 210, 45, 'F');

  // Accent bar
  doc.setFillColor(...COLORS.primary);
  doc.rect(0, 0, 8, 45, 'F');

  // Logo area
  doc.setFillColor(...COLORS.accent);
  doc.roundedRect(14, 8, 28, 28, 3, 3, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('N', 28, 26, { align: 'center' });

  // Brand name
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('NovaEq', 48, 20);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...COLORS.accent);
  doc.text('AI-Powered Investment Platform', 48, 28);

  // Report title
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text(title, 14, 62);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...COLORS.gray);
  doc.text(subtitle, 14, 70);

  // Divider
  doc.setDrawColor(...COLORS.primary);
  doc.setLineWidth(0.5);
  doc.line(14, 75, 196, 75);
}

function addFooter(doc: jsPDF, pageNumber: number) {
  const pageHeight = doc.internal.pageSize.height;
  doc.setDrawColor(...COLORS.primary);
  doc.setLineWidth(0.3);
  doc.line(14, pageHeight - 20, 196, pageHeight - 20);

  doc.setFontSize(8);
  doc.setTextColor(...COLORS.gray);
  doc.setFont('helvetica', 'normal');
  doc.text('NovaEq Platform | ai-powered investment & trading | novaeq.onspace.app', 14, pageHeight - 12);
  doc.text(`Page ${pageNumber} | Generated: ${new Date().toLocaleString()}`, 196, pageHeight - 12, { align: 'right' });
  doc.text('CONFIDENTIAL — For authorized users only', 14, pageHeight - 6);
}

function addSectionTitle(doc: jsPDF, title: string, y: number): number {
  doc.setFillColor(30, 41, 59);
  doc.rect(14, y - 5, 182, 12, 'F');
  doc.setFillColor(...COLORS.primary);
  doc.rect(14, y - 5, 3, 12, 'F');

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(248, 250, 252);
  doc.text(title, 21, y + 2);
  return y + 14;
}

function addMetricBox(doc: jsPDF, x: number, y: number, w: number, h: number, label: string, value: string, positive?: boolean) {
  doc.setFillColor(30, 41, 59);
  doc.roundedRect(x, y, w, h, 2, 2, 'F');
  doc.setFillColor(...COLORS.primary);
  doc.roundedRect(x, y, w, 1.5, 1, 1, 'F');

  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...COLORS.gray);
  doc.text(label.toUpperCase(), x + w / 2, y + 8, { align: 'center' });

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  if (positive === true) doc.setTextColor(...COLORS.green);
  else if (positive === false) doc.setTextColor(...COLORS.red);
  else doc.setTextColor(248, 250, 252);
  doc.text(value, x + w / 2, y + 18, { align: 'center' });
}

export function generatePortfolioReport(user: User, holdings: Holding[], walletBalance: number) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });

  addHeader(doc, 'Portfolio Report', `Prepared for: ${user.name} | ${formatDate(new Date().toISOString())}`);

  let y = 85;

  // User info
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...COLORS.gray);
  const infoLeft = [
    `Account: ${user.name}`,
    `Email: ${user.email}`,
    `KYC Status: ${user.kycStatus.toUpperCase()}`,
  ];
  const infoRight = [
    `Risk Profile: ${user.riskProfile.charAt(0).toUpperCase() + user.riskProfile.slice(1)}`,
    `Subscription: ${user.subscription.toUpperCase()}`,
    `Member Since: ${formatDate(user.joinDate)}`,
  ];
  infoLeft.forEach((line, i) => {
    doc.setTextColor(248, 250, 252);
    doc.text(line, 14, y + i * 6);
  });
  infoRight.forEach((line, i) => {
    doc.setTextColor(248, 250, 252);
    doc.text(line, 130, y + i * 6);
  });

  y += 26;

  // Metric boxes
  const totalValue = holdings.reduce((s, h) => s + h.value, 0);
  const totalPnL = holdings.reduce((s, h) => s + h.pnl, 0);
  const totalCost = totalValue - totalPnL;
  const totalPnLPct = totalCost > 0 ? (totalPnL / totalCost) * 100 : 0;

  addMetricBox(doc, 14, y, 40, 26, 'Portfolio Value', formatCurrency(totalValue));
  addMetricBox(doc, 59, y, 40, 26, 'Cash Balance', formatCurrency(walletBalance));
  addMetricBox(doc, 104, y, 40, 26, 'Total P&L', formatCurrency(totalPnL), totalPnL >= 0);
  addMetricBox(doc, 149, y, 43, 26, 'P&L %', formatPercent(totalPnLPct), totalPnL >= 0);

  y += 34;
  y = addSectionTitle(doc, 'Holdings', y);

  // Table header
  doc.setFillColor(15, 23, 42);
  doc.rect(14, y, 182, 8, 'F');
  const cols = ['Symbol', 'Company', 'Qty', 'Avg Price', 'Curr Price', 'Value', 'P&L', 'P&L %'];
  const colX = [16, 34, 82, 100, 120, 140, 160, 177];
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.gray);
  cols.forEach((col, i) => doc.text(col, colX[i], y + 5.5));
  y += 9;

  holdings.forEach((h, idx) => {
    if (idx % 2 === 0) {
      doc.setFillColor(20, 30, 48);
      doc.rect(14, y - 1, 182, 8, 'F');
    }
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(248, 250, 252);
    doc.text(h.symbol, colX[0], y + 4.5);
    doc.text(h.name.substring(0, 18), colX[1], y + 4.5);
    doc.text(String(h.quantity), colX[2], y + 4.5);
    doc.text(`$${h.avgPrice.toFixed(2)}`, colX[3], y + 4.5);
    doc.text(`$${h.currentPrice.toFixed(2)}`, colX[4], y + 4.5);
    doc.text(`$${(h.value / 1000).toFixed(1)}K`, colX[5], y + 4.5);
    if (h.pnl >= 0) doc.setTextColor(...COLORS.green); else doc.setTextColor(...COLORS.red);
    doc.text(`$${h.pnl.toFixed(0)}`, colX[6], y + 4.5);
    doc.text(`${h.pnlPercent >= 0 ? '+' : ''}${h.pnlPercent.toFixed(1)}%`, colX[7], y + 4.5);
    y += 8;
  });

  y += 6;
  y = addSectionTitle(doc, 'Sector Allocation', y);
  const sectors: Record<string, number> = {};
  holdings.forEach(h => { sectors[h.sector] = (sectors[h.sector] || 0) + h.value; });
  let sx = 14;
  Object.entries(sectors).forEach(([sector, value]) => {
    const pct = (value / totalValue) * 100;
    doc.setFillColor(30, 41, 59);
    doc.roundedRect(sx, y, 42, 18, 2, 2, 'F');
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COLORS.gray);
    doc.text(sector, sx + 21, y + 6, { align: 'center' });
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.accent);
    doc.text(`${pct.toFixed(1)}%`, sx + 21, y + 14, { align: 'center' });
    sx += 46;
  });

  addFooter(doc, 1);
  doc.save(`NovaEq_Portfolio_Report_${user.name.replace(' ', '_')}.pdf`);
}

export function generateTaxReport(user: User) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  addHeader(doc, 'Tax Report — FY 2023-24', `Prepared for: ${user.name} | ${formatDate(new Date().toISOString())}`);

  let y = 85;

  addMetricBox(doc, 14, y, 55, 26, 'Short-term Gains', formatCurrency(12840.50), true);
  addMetricBox(doc, 74, y, 55, 26, 'Long-term Gains', formatCurrency(21910.00), true);
  addMetricBox(doc, 134, y, 62, 26, 'Total Tax Liability', formatCurrency(6127.80), false);

  y += 36;
  y = addSectionTitle(doc, 'Capital Gains Summary', y);

  const gains = [
    { symbol: 'AAPL', type: 'Long-term', saleDate: 'Jan 08, 2024', gain: 1131.60, tax: 169.74 },
    { symbol: 'JPM', type: 'Long-term', saleDate: 'Jan 05, 2024', gain: 3798.00, tax: 569.70 },
    { symbol: 'NVDA', type: 'Short-term', saleDate: 'Dec 15, 2023', gain: 6777.60, tax: 2033.28 },
    { symbol: 'TSLA', type: 'Short-term', saleDate: 'Dec 10, 2023', gain: -1481.40, tax: 0 },
    { symbol: 'GOOGL', type: 'Long-term', saleDate: 'Nov 20, 2023', gain: 960.00, tax: 144.00 },
  ];

  doc.setFillColor(15, 23, 42);
  doc.rect(14, y, 182, 8, 'F');
  const cols2 = ['Symbol', 'Gain Type', 'Sale Date', 'Gain/Loss', 'Tax Rate', 'Tax'];
  const colX2 = [16, 46, 88, 120, 150, 170];
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.gray);
  cols2.forEach((col, i) => doc.text(col, colX2[i], y + 5.5));
  y += 9;

  gains.forEach((g, idx) => {
    if (idx % 2 === 0) { doc.setFillColor(20, 30, 48); doc.rect(14, y - 1, 182, 8, 'F'); }
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(248, 250, 252);
    doc.text(g.symbol, colX2[0], y + 4.5);
    doc.text(g.type, colX2[1], y + 4.5);
    doc.text(g.saleDate, colX2[2], y + 4.5);
    if (g.gain >= 0) doc.setTextColor(...COLORS.green); else doc.setTextColor(...COLORS.red);
    doc.text(formatCurrency(g.gain), colX2[3], y + 4.5);
    doc.setTextColor(...COLORS.gray);
    doc.text(g.type === 'Short-term' ? '30%' : '15%', colX2[4], y + 4.5);
    doc.setTextColor(248, 250, 252);
    doc.text(formatCurrency(g.tax), colX2[5], y + 4.5);
    y += 8;
  });

  y += 12;
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.gray);
  doc.text('* This report is for informational purposes only. Consult a tax professional for filing.', 14, y);
  doc.text('* Short-term capital gains taxed at applicable income tax slab rate.', 14, y + 6);
  doc.text('* Long-term capital gains (>1 year) taxed at 15% flat rate.', 14, y + 12);

  addFooter(doc, 1);
  doc.save(`NovaEq_Tax_Report_${user.name.replace(' ', '_')}.pdf`);
}

export function generatePerformanceReport(user: User, holdings: Holding[]) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  addHeader(doc, 'Performance Benchmark Report', `${formatDate(new Date().toISOString())} | ${user.name}`);

  let y = 85;

  addMetricBox(doc, 14, y, 42, 26, 'Portfolio Return', '+13.89%', true);
  addMetricBox(doc, 61, y, 42, 26, 'S&P 500 Return', '+10.21%', true);
  addMetricBox(doc, 108, y, 42, 26, 'Alpha', '+3.68%', true);
  addMetricBox(doc, 155, y, 45, 26, 'Sharpe Ratio', '1.42');

  y += 36;
  y = addSectionTitle(doc, 'Performance vs Benchmark', y);

  doc.setFontSize(9);
  doc.setTextColor(...COLORS.gray);
  doc.text('Monthly returns comparison vs S&P 500 Index', 14, y + 4);
  y += 10;

  const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'];
  const portfolio = [2.1, -1.3, 3.8, 4.2, 2.9, 5.1, 1.8];
  const benchmark = [1.5, -0.8, 2.9, 3.1, 2.2, 3.8, 1.2];

  const chartX = 14; const chartY = y; const chartW = 182; const chartH = 50;
  doc.setFillColor(20, 30, 48);
  doc.rect(chartX, chartY, chartW, chartH, 'F');

  const barW = 10; const gap = (chartW - months.length * barW * 2 - months.length * 4) / (months.length + 1);
  months.forEach((month, i) => {
    const x = chartX + gap + i * (barW * 2 + gap + 4);
    const pRet = portfolio[i]; const bRet = benchmark[i];
    const maxVal = 6; const scale = (chartH - 15) / (maxVal * 2);
    const baseY = chartY + chartH / 2;

    doc.setFillColor(...COLORS.primary);
    if (pRet >= 0) {
      doc.rect(x, baseY - pRet * scale, barW, pRet * scale, 'F');
    } else {
      doc.setFillColor(...COLORS.red);
      doc.rect(x, baseY, barW, Math.abs(pRet) * scale, 'F');
    }

    doc.setFillColor(...COLORS.accent);
    if (bRet >= 0) {
      doc.rect(x + barW + 2, baseY - bRet * scale, barW, bRet * scale, 'F');
    } else {
      doc.setFillColor(...COLORS.gray);
      doc.rect(x + barW + 2, baseY, barW, Math.abs(bRet) * scale, 'F');
    }

    doc.setFontSize(7);
    doc.setTextColor(...COLORS.gray);
    doc.text(month, x + barW, chartY + chartH - 2, { align: 'center' });
  });

  y += chartH + 12;
  y = addSectionTitle(doc, 'Top Performers', y);

  const topStocks = [...holdings].sort((a, b) => b.pnlPercent - a.pnlPercent).slice(0, 5);
  topStocks.forEach((h, i) => {
    doc.setFillColor(i % 2 === 0 ? 20 : 15, i % 2 === 0 ? 30 : 23, i % 2 === 0 ? 48 : 42);
    doc.rect(14, y, 182, 9, 'F');
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(248, 250, 252);
    doc.text(`${i + 1}. ${h.symbol} — ${h.name}`, 18, y + 6);
    if (h.pnlPercent >= 0) doc.setTextColor(...COLORS.green); else doc.setTextColor(...COLORS.red);
    doc.text(`${h.pnlPercent >= 0 ? '+' : ''}${h.pnlPercent.toFixed(2)}%`, 184, y + 6, { align: 'right' });
    y += 9;
  });

  addFooter(doc, 1);
  doc.save(`NovaEq_Performance_Report_${user.name.replace(' ', '_')}.pdf`);
}

export function generateRiskReport(user: User, holdings: Holding[]) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  addHeader(doc, 'Risk Analysis Report', `${formatDate(new Date().toISOString())} | Risk Profile: ${user.riskProfile.toUpperCase()}`);

  let y = 85;

  addMetricBox(doc, 14, y, 42, 26, 'Portfolio Beta', '1.24');
  addMetricBox(doc, 61, y, 42, 26, 'Value at Risk (95%)', '-$8,240', false);
  addMetricBox(doc, 108, y, 42, 26, 'Max Drawdown', '-14.8%', false);
  addMetricBox(doc, 155, y, 45, 26, 'Volatility (Ann.)', '18.3%');

  y += 36;
  y = addSectionTitle(doc, 'Concentration Risk', y);

  const totalValue = holdings.reduce((s, h) => s + h.value, 0);
  holdings.slice(0, 6).forEach((h, i) => {
    const pct = (h.value / totalValue) * 100;
    const barW = (pct / 100) * 140;
    doc.setFillColor(20, 30, 48);
    doc.rect(14, y, 182, 10, 'F');
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(248, 250, 252);
    doc.text(h.symbol, 18, y + 6.5);
    doc.text(h.name, 38, y + 6.5);
    doc.setFillColor(pct > 20 ? 239 : 29, pct > 20 ? 68 : 78, pct > 20 ? 68 : 216);
    doc.rect(100, y + 3, barW, 4, 'F');
    doc.setTextColor(...COLORS.gray);
    doc.text(`${pct.toFixed(1)}%`, 185, y + 6.5, { align: 'right' });
    y += 10;
    if (i === 5) y += 2;
  });

  y += 8;
  y = addSectionTitle(doc, 'Risk Recommendations', y);

  const recs = [
    'Reduce Technology sector concentration from 62% to below 50% for better diversification.',
    'Consider adding defensive sectors (Utilities, Consumer Staples) to reduce portfolio beta.',
    'TSLA position shows highest single-stock risk. Consider position sizing reduction.',
    'Current VaR of $8,240 exceeds conservative threshold. Review stop-loss settings.',
    'Portfolio beta of 1.24 indicates higher market sensitivity than benchmark.',
  ];

  recs.forEach((rec, i) => {
    doc.setFillColor(i % 2 === 0 ? 20 : 15, i % 2 === 0 ? 30 : 23, i % 2 === 0 ? 48 : 42);
    doc.rect(14, y, 182, 11, 'F');
    doc.setFillColor(...COLORS.primary);
    doc.circle(20, y + 5.5, 1.5, 'F');
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(248, 250, 252);
    const lines = doc.splitTextToSize(rec, 158);
    doc.text(lines[0], 25, y + 6.5);
    y += 11;
  });

  addFooter(doc, 1);
  doc.save(`NovaEq_Risk_Analysis_${user.name.replace(' ', '_')}.pdf`);
}
