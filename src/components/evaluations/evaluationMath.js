export const num = (value) => Number(value) || 0;

export function calcMortgage(principal, annualRate, years) {
  const p = num(principal);
  const y = num(years);
  const annual = num(annualRate);
  if (!p || !y) return 0;
  if (!annual) return p / (y * 12);
  const r = annual / 100 / 12;
  const n = y * 12;
  return p * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
}

export function computeEvaluation(f = {}) {
  const sqm = num(f.sqm);
  const purchasePrice = num(f.purchase_price);
  const marketLow = sqm * num(f.market_price_sqm_low);
  const marketBase = sqm * num(f.market_price_sqm_base);
  const marketHigh = sqm * num(f.market_price_sqm_high);

  const totalInvestment = purchasePrice
    + num(f.agency_costs)
    + num(f.notary_costs)
    + num(f.purchase_taxes)
    + num(f.renovation_costs)
    + num(f.furniture_costs)
    + num(f.other_initial_costs);

  const mortgageAmount = num(f.mortgage_amount);
  const equityRequired = Math.max(totalInvestment - mortgageAmount, 0);
  const mortgageMonthly = calcMortgage(mortgageAmount, f.mortgage_rate, f.mortgage_years);
  const annualDebtService = mortgageMonthly * 12;

  const grossAnnualRent = num(f.monthly_rent) * 12;
  const vacancyRate = Math.min(Math.max(num(f.vacancy_rate), 0), 100);
  const effectiveAnnualRent = grossAnnualRent * (1 - vacancyRate / 100);
  const annualOperatingCosts = num(f.condo_fee) * 12
    + num(f.other_costs) * 12
    + num(f.annual_imu)
    + num(f.annual_maintenance);
  const annualTax = effectiveAnnualRent * num(f.tax_rate) / 100;
  const annualOperatingNet = effectiveAnnualRent - annualOperatingCosts;
  const annualCashFlow = effectiveAnnualRent - annualOperatingCosts - annualTax - annualDebtService;
  const monthlyCashFlow = annualCashFlow / 12;

  const grossYield = totalInvestment ? grossAnnualRent / totalInvestment * 100 : 0;
  const netYield = totalInvestment ? annualOperatingNet / totalInvestment * 100 : 0;
  const afterTaxYield = totalInvestment ? (annualOperatingNet - annualTax) / totalInvestment * 100 : 0;
  const cashOnCash = equityRequired ? annualCashFlow / equityRequired * 100 : 0;
  const dscr = annualDebtService ? annualOperatingNet / annualDebtService : 0;
  const ltvBase = (marketBase || purchasePrice) ? mortgageAmount / (marketBase || purchasePrice) * 100 : 0;
  const discountVsMarket = marketBase ? (marketBase - purchasePrice) / marketBase * 100 : 0;
  const purchasePriceSqm = sqm ? purchasePrice / sqm : 0;

  const salePrice = num(f.sale_price);
  const saleAgencyCost = salePrice * num(f.sale_agency_rate) / 100;
  const netSaleBeforeMortgage = salePrice - saleAgencyCost - num(f.sale_taxes) - num(f.sale_other_costs);
  const netSaleAfterMortgage = netSaleBeforeMortgage - num(f.remaining_mortgage);
  const capitalGain = netSaleBeforeMortgage - totalInvestment;
  const saleRoi = totalInvestment ? capitalGain / totalInvestment * 100 : 0;
  const yearsHeld = num(f.years_held);
  const annualizedSaleReturn = yearsHeld > 0 && totalInvestment > 0 && netSaleBeforeMortgage > 0
    ? (Math.pow(netSaleBeforeMortgage / totalInvestment, 1 / yearsHeld) - 1) * 100
    : 0;

  let score = 0;
  if (discountVsMarket >= 10) score += 2; else if (discountVsMarket >= 0) score += 1; else if (marketBase) score -= 1;
  if (netYield >= 5) score += 2; else if (netYield >= 3) score += 1; else if (grossAnnualRent) score -= 1;
  if (monthlyCashFlow > 0) score += 1; else if (mortgageAmount) score -= 1;
  if (cashOnCash >= 5) score += 1;

  const dealRating = score >= 5 ? 'Molto interessante' : score >= 3 ? 'Interessante' : score >= 1 ? 'Da approfondire' : 'Debole';

  return {
    marketLow,
    marketBase,
    marketHigh,
    totalInvestment,
    mortgageMonthly,
    annualDebtService,
    equityRequired,
    grossAnnualRent,
    effectiveAnnualRent,
    annualOperatingCosts,
    annualTax,
    annualOperatingNet,
    annualCashFlow,
    monthlyCashFlow,
    grossYield,
    netYield,
    afterTaxYield,
    cashOnCash,
    dscr,
    ltvBase,
    discountVsMarket,
    purchasePriceSqm,
    saleAgencyCost,
    netSaleBeforeMortgage,
    netSaleAfterMortgage,
    capitalGain,
    saleRoi,
    annualizedSaleReturn,
    dealRating,
    score,
  };
}

export const euro = (value, decimals = 0) => `€ ${num(value).toLocaleString('it-IT', {
  minimumFractionDigits: decimals,
  maximumFractionDigits: decimals,
})}`;

export const pct = (value, decimals = 1) => `${num(value).toLocaleString('it-IT', {
  minimumFractionDigits: decimals,
  maximumFractionDigits: decimals,
})}%`;