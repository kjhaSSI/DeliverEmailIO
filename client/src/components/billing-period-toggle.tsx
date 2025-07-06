import { useBillingPeriod } from "@/hooks/use-billing-period";
import { Badge } from "@/components/ui/badge";

interface BillingPeriodToggleProps {
  className?: string;
}

export default function BillingPeriodToggle({ className = "" }: BillingPeriodToggleProps) {
  const { billingPeriod, setBillingPeriod, isYearly } = useBillingPeriod();

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="relative bg-gray-100 rounded-lg p-1 flex items-center">
        <button
          onClick={() => setBillingPeriod("monthly")}
          className={`
            px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 relative
            ${!isYearly 
              ? "bg-white text-gray-900 shadow-sm" 
              : "text-gray-600 hover:text-gray-900"
            }
          `}
        >
          Monthly
        </button>
        <button
          onClick={() => setBillingPeriod("yearly")}
          className={`
            px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 relative flex items-center space-x-2
            ${isYearly 
              ? "bg-white text-gray-900 shadow-sm" 
              : "text-gray-600 hover:text-gray-900"
            }
          `}
        >
          <span>Yearly</span>
          <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
            Save 17%
          </Badge>
        </button>
      </div>
    </div>
  );
}