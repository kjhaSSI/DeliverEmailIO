import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";
import { useBillingPeriod, PRICING_CONFIG, getPlanPricing } from "@/hooks/use-billing-period";
import BillingPeriodToggle from "@/components/billing-period-toggle";

interface PricingPlansProps {
  showTitle?: boolean;
  className?: string;
}

export default function PricingPlans({ showTitle = true, className = "" }: PricingPlansProps) {
  const { billingPeriod } = useBillingPeriod();

  const planNames = ['free', 'pro', 'enterprise'] as const;
  
  const plans = planNames.map(planName => {
    const config = PRICING_CONFIG[planName];
    const pricing = getPlanPricing(planName, billingPeriod);
    
    return {
      name: planName.charAt(0).toUpperCase() + planName.slice(1),
      planKey: planName,
      price: pricing.displayPrice,
      period: pricing.period,
      emails: config.emails,
      features: config.features,
      popular: planName === 'pro',
      buttonText: planName === 'free' ? 'Get started' : 
                  planName === 'enterprise' ? 'Contact sales' : 'Start free trial',
      buttonVariant: (planName === 'free' || planName === 'enterprise') ? 'outline' as const : 'default' as const,
      pricing,
    };
  });

  return (
    <div className={className}>
      {showTitle && (
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-xl text-gray-600">
            Start free, scale as you grow. No hidden fees or commitments.
          </p>
          <div className="mt-8">
            <BillingPeriodToggle />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, index) => (
          <div
            key={plan.name}
            className={`
              relative border rounded-xl p-8 
              ${plan.popular ? 'border-2 border-primary shadow-lg' : 'border border-gray-200'}
            `}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-primary text-white px-4 py-1">
                  Most Popular
                </Badge>
              </div>
            )}

            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
              <div className="mb-4">
                {billingPeriod === 'yearly' && plan.pricing.savingsPercentage > 0 ? (
                  <div>
                    <div className="flex items-center justify-center space-x-2 mb-1">
                      <span className="text-lg text-gray-500 line-through">${plan.pricing.monthlyEquivalent * 12}</span>
                      <Badge variant="secondary" className="bg-green-100 text-green-700">
                        Save {plan.pricing.savingsPercentage}%
                      </Badge>
                    </div>
                    <div>
                      <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                      <span className="text-gray-600">/{plan.period}</span>
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      ${plan.pricing.price}/month when billed yearly
                    </div>
                  </div>
                ) : (
                  <div>
                    <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                    <span className="text-gray-600">/{plan.period}</span>
                  </div>
                )}
              </div>
              <p className="text-gray-600">
                {plan.name === "Free" && "Perfect for getting started"}
                {plan.name === "Pro" && "For growing businesses"}
                {plan.name === "Enterprise" && "For large-scale operations"}
              </p>
            </div>

            <ul className="space-y-3 mb-8">
              {plan.features.map((feature, featureIndex) => (
                <li key={featureIndex} className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>

            <Link href="/auth">
              <Button
                className="w-full"
                variant={plan.buttonVariant}
              >
                {plan.buttonText}
              </Button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
