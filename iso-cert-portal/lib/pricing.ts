// AED is pegged to USD at a fixed rate (unchanged since 1997), so this
// conversion is exact, not an approximation.
export const AED_PER_USD = 3.6725;

export type Currency = "usd" | "aed";

export interface PricedStandard {
  code: string;
  basePrice: number; // USD
}

export interface OrderPricing {
  subtotalUsd: number;
  discountUsd: number;
  totalUsd: number;
  currency: Currency;
  totalInSmallestUnit: number; // cents (usd) or fils (aed)
}

// Recomputes the order total server-side from the standards' known USD
// prices — the client only sends which standards were selected, never an
// amount, so there's nothing to tamper with.
export const priceOrder = (
  standards: PricedStandard[],
  type: "single" | "multi",
  currency: Currency
): OrderPricing => {
  const subtotalUsd = standards.reduce((sum, s) => sum + s.basePrice, 0);
  const discountUsd = type === "multi" && standards.length > 1 ? subtotalUsd * 0.15 : 0;
  const totalUsd = subtotalUsd - discountUsd;
  const totalInCurrency = currency === "aed" ? totalUsd * AED_PER_USD : totalUsd;
  return {
    subtotalUsd,
    discountUsd,
    totalUsd,
    currency,
    totalInSmallestUnit: Math.round(totalInCurrency * 100),
  };
};
