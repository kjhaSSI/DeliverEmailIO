import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { CheckCircle, CreditCard, Calendar, DollarSign, Zap } from "lucide-react";

export default function Billing() {
  const { user } = useAuth();

  const { data: subscription, isLoading: isSubscriptionLoading } = useQuery({
    queryKey: ["/api/billing/subscription"],
    enabled: !!user,
  });

  const plans = [
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
      current: user?.plan === "free",
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
      current: user?.plan === "pro",
      popular: true,
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
      current: user?.plan === "enterprise",
    },
  ];

  const currentPlan = plans.find(plan => plan.current);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Billing & Subscription</h1>
          <p className="text-gray-600 mt-2">Manage your subscription and billing information</p>
        </div>

        {/* Current Plan */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Current Plan</p>
                  <p className="text-2xl font-bold text-gray-900 capitalize">{user?.plan || "Free"}</p>
                </div>
                <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
              </div>
              <p className="text-sm text-green-600 mt-2">Active</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Monthly Emails</p>
                  <p className="text-2xl font-bold text-gray-900">{currentPlan?.emails || "1,000"}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <p className="text-sm text-blue-600 mt-2">Included in plan</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Monthly Cost</p>
                  <p className="text-2xl font-bold text-gray-900">${currentPlan?.price || 0}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <p className="text-sm text-green-600 mt-2">Per month</p>
            </CardContent>
          </Card>
        </div>

        {/* Subscription Details */}
        {subscription && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="w-5 h-5" />
                <span>Subscription Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-gray-700">Status</p>
                  <Badge variant="default" className="mt-1">
                    {subscription.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Next Billing Date</p>
                  <p className="text-sm text-gray-900 mt-1">
                    {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Auto Renewal</p>
                  <p className="text-sm text-gray-900 mt-1">
                    {subscription.cancelAtPeriodEnd ? "Disabled" : "Enabled"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Billing Period</p>
                  <p className="text-sm text-gray-900 mt-1">Monthly</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Available Plans */}
        <Card>
          <CardHeader>
            <CardTitle>Available Plans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className={`
                    relative border rounded-xl p-6 
                    ${plan.current ? 'border-primary bg-primary bg-opacity-5' : 'border-gray-200'}
                    ${plan.popular ? 'ring-2 ring-primary' : ''}
                  `}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-primary text-white px-4 py-1 rounded-full text-sm font-medium">
                        Most Popular
                      </span>
                    </div>
                  )}
                  
                  {plan.current && (
                    <div className="absolute top-4 right-4">
                      <Badge variant="default">Current Plan</Badge>
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <div className="mb-4">
                      <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                      <span className="text-gray-600">/{plan.period}</span>
                    </div>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className="w-full"
                    variant={plan.current ? "outline" : "default"}
                    disabled={plan.current}
                  >
                    {plan.current ? "Current Plan" : `Upgrade to ${plan.name}`}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Usage Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>Usage This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Emails Sent</span>
                <span className="text-sm text-gray-900">0 / {currentPlan?.emails || "1,000"}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: "0%" }}></div>
              </div>
              <p className="text-xs text-gray-500">
                Resets on the 1st of each month
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Billing History */}
        <Card>
          <CardHeader>
            <CardTitle>Billing History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No billing history</h3>
              <p className="text-gray-600">
                Your billing history will appear here once you have active subscriptions.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
