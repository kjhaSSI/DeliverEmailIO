import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";

interface PricingPlan {
  name: string;
  price: number;
  period: string;
  emails: string;
  features: string[];
  popular?: boolean;
  buttonText: string;
  buttonVariant?: "default" | "outline";
}

interface PricingPlansProps {
  showTitle?: boolean;
  className?: string;
}

export default function PricingPlans({ showTitle = true, className = "" }: PricingPlansProps) {
  const plans: PricingPlan[] = [
    {
      name: "Free",
      price: 0,
      period: "month",
      emails: "1,000",
      features: [
        "1,000 emails/month",
        "Basic analytics",
        "Email support",
        "API access",
      ],
      buttonText: "Get started",
      buttonVariant: "outline",
    },
    {
      name: "Pro",
      price: 29,
      period: "month",
      emails: "50,000",
      features: [
        "50,000 emails/month",
        "Advanced analytics",
        "Priority support",
        "Template editor",
        "Custom domains",
      ],
      popular: true,
      buttonText: "Start free trial",
      buttonVariant: "default",
    },
    {
      name: "Enterprise",
      price: 99,
      period: "month",
      emails: "500,000",
      features: [
        "500,000 emails/month",
        "Custom analytics",
        "24/7 phone support",
        "Dedicated IP",
        "Custom integrations",
        "SLA guarantee",
      ],
      buttonText: "Contact sales",
      buttonVariant: "outline",
    },
  ];

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
                <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                <span className="text-gray-600">/{plan.period}</span>
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
