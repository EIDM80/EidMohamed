// AED is pegged to USD at a fixed rate (unchanged since 1997), so this
// conversion is exact, not an approximation.
export const AED_PER_USD = 3.6725;

export type Currency = "usd" | "aed";

// Certificates are sold as a recurring subscription — a customer either
// renews every year, or commits to a 3-year cycle for a discount. Each
// standard's basePrice (in constants.tsx) is its annual rate.
export type RenewalTerm = "1y" | "3y";

export const TERM_YEARS: Record<RenewalTerm, number> = { "1y": 1, "3y": 3 };
// Discount for committing to the longer, less-frequently-billed cycle.
export const TERM_DISCOUNT: Record<RenewalTerm, number> = { "1y": 0, "3y": 0.1 };

export interface PricedStandard {
  code: string;
  basePrice: number; // USD, per year
}

export interface OrderPricing {
  annualUsd: number; // one year, after the multi-standard bundle discount
  termSubtotalUsd: number; // annualUsd * years, before the term discount
  termDiscountUsd: number;
  totalUsd: number; // amount actually charged per billing cycle
  currency: Currency;
  term: RenewalTerm;
  intervalCount: number; // years per Stripe billing cycle
  totalInSmallestUnit: number; // cents (usd) or fils (aed)
}

// Recomputes the order total server-side from the standards' known USD
// prices — the client only sends which standards and term were selected,
// never an amount, so there's nothing to tamper with.
export const priceOrder = (
  standards: PricedStandard[],
  type: "single" | "multi",
  currency: Currency,
  term: RenewalTerm
): OrderPricing => {
  const subtotalUsd = standards.reduce((sum, s) => sum + s.basePrice, 0);
  const bundleDiscountUsd = type === "multi" && standards.length > 1 ? subtotalUsd * 0.15 : 0;
  const annualUsd = subtotalUsd - bundleDiscountUsd;

  const years = TERM_YEARS[term];
  const termSubtotalUsd = annualUsd * years;
  const termDiscountUsd = termSubtotalUsd * TERM_DISCOUNT[term];
  const totalUsd = termSubtotalUsd - termDiscountUsd;

  const totalInCurrency = currency === "aed" ? totalUsd * AED_PER_USD : totalUsd;

  return {
    annualUsd,
    termSubtotalUsd,
    termDiscountUsd,
    totalUsd,
    currency,
    term,
    intervalCount: years,
    totalInSmallestUnit: Math.round(totalInCurrency * 100),
  };
};

// Converts a request's stored amount (already in its own currency) to USD,
// so amounts from different currencies can be safely summed together.
export const toUsd = (amount: number, currency: Currency): number =>
  currency === "aed" ? amount / AED_PER_USD : amount;

export const formatMoney = (amount: number, currency: Currency): string =>
  currency === "aed" ? `AED ${amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}` : `$${amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
