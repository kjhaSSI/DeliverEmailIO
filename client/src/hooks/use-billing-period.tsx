import { createContext, ReactNode, useContext, useState } from "react";

type BillingPeriod = "monthly" | "yearly";

interface BillingPeriodContextType {
  billingPeriod: BillingPeriod;
  setBillingPeriod: (period: BillingPeriod) => void;
  isYearly: boolean;
  isMonthly: boolean;
}

const BillingPeriodContext = createContext<BillingPeriodContextType | null>(null);

export function BillingPeriodProvider({ children }: { children: ReactNode }) {
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>("yearly");

  return (
    <BillingPeriodContext.Provider
      value={{
        billingPeriod,
        setBillingPeriod,
        isYearly: billingPeriod === "yearly",
        isMonthly: billingPeriod === "monthly",
      }}
    >
      {children}
    </BillingPeriodContext.Provider>
  );
}

export function useBillingPeriod() {
  const context = useContext(BillingPeriodContext);
  if (!context) {
    throw new Error("useBillingPeriod must be used within a BillingPeriodProvider");
  }
  return context;
}

// Pricing configuration
export const PRICING_CONFIG = {
  free: {
    monthly: { price: 0, yearlyPrice: 0 },
    yearly: { price: 0, yearlyPrice: 0 },
    emails: "1,000",
    features: [
      "1,000 emails/month",
      "Basic analytics",
      "Email support",
      "API access",
    ],
  },
  pro: {
    monthly: { price: 29, yearlyPrice: 29 * 12 },
    yearly: { price: 24, yearlyPrice: 24 * 12 }, // ~17% discount
    emails: "50,000",
    features: [
      "50,000 emails/month",
      "Advanced analytics",
      "Priority support",
      "Template editor",
      "Custom domains",
    ],
  },
  enterprise: {
    monthly: { price: 99, yearlyPrice: 99 * 12 },
    yearly: { price: 82, yearlyPrice: 82 * 12 }, // ~17% discount
    emails: "500,000",
    features: [
      "500,000 emails/month",
      "Custom analytics",
      "24/7 phone support",
      "Dedicated IP",
      "Custom integrations",
      "SLA guarantee",
    ],
  },
};

export function getPlanPricing(planName: keyof typeof PRICING_CONFIG, billingPeriod: BillingPeriod) {
  const plan = PRICING_CONFIG[planName];
  const pricing = plan[billingPeriod];
  
  const monthlyEquivalent = billingPeriod === "yearly" ? pricing.price : pricing.price;
  const yearlyTotal = billingPeriod === "yearly" ? pricing.yearlyPrice : pricing.price * 12;
  const monthlySavings = billingPeriod === "yearly" ? plan.monthly.price - pricing.price : 0;
  const yearlySavings = billingPeriod === "yearly" ? plan.monthly.yearlyPrice - pricing.yearlyPrice : 0;
  const savingsPercentage = billingPeriod === "yearly" ? Math.round((yearlySavings / plan.monthly.yearlyPrice) * 100) : 0;

  return {
    price: pricing.price,
    yearlyPrice: pricing.yearlyPrice,
    monthlyEquivalent,
    yearlyTotal,
    monthlySavings,
    yearlySavings,
    savingsPercentage,
    displayPrice: billingPeriod === "yearly" ? pricing.yearlyPrice : pricing.price,
    period: billingPeriod === "yearly" ? "year" : "month",
    billingPeriod,
  };
}