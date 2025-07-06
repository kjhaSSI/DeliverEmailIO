import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { CheckCircle, CreditCard, Calendar, DollarSign, Zap, Download, AlertTriangle } from "lucide-react";

export default function Billing() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();

  const { data: subscription, isLoading: isSubscriptionLoading } = useQuery({
    queryKey: ["/api/billing/subscription"],
    enabled: !!user,
  });

  const { data: invoices, isLoading: isInvoicesLoading } = useQuery({
    queryKey: ["/api/billing/invoices"],
    enabled: !!user,
  });

  const upgradeMutation = useMutation({
    mutationFn: async (planName: string) => {
      const res = await apiRequest("POST", "/api/create-subscription", { planName });
      return await res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Plan upgraded successfully!",
        description: data.message,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/billing/subscription"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Upgrade failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const cancelMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/billing/cancel-subscription");
      return await res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Subscription canceled",
        description: data.message,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/billing/subscription"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Cancellation failed",
        description: error.message,
        variant: "destructive",
      });
    },
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

        {/* Mock Billing Notice */}
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                <CreditCard className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">Demo Billing Integration</h3>
                <p className="text-blue-700 text-sm">
                  This is a mock Stripe integration with dummy data for demonstration purposes. 
                  All transactions are simulated and no real charges will be made.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subscription Details */}
        {subscription && subscription.status && (
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
                    {subscription.status || 'Active'}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Next Billing Date</p>
                  <p className="text-sm text-gray-900 mt-1">
                    {subscription.currentPeriodEnd ? 
                      new Date(subscription.currentPeriodEnd).toLocaleDateString() : 
                      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()
                    }
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
                    onClick={() => {
                      if (!plan.current && plan.name !== "Free") {
                        navigate(`/checkout/${plan.name.toLowerCase()}`);
                      }
                    }}
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
            <CardTitle className="flex items-center space-x-2">
              <CreditCard className="w-5 h-5" />
              <span>Billing History</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isInvoicesLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
                <p className="text-gray-600">Loading invoices...</p>
              </div>
            ) : invoices && invoices.length > 0 ? (
              <div className="space-y-4">
                {invoices.map((invoice: any) => (
                  <div key={invoice.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {invoice.planName.charAt(0).toUpperCase() + invoice.planName.slice(1)} Plan
                        </p>
                        <p className="text-sm text-gray-600">
                          {new Date(invoice.date).toLocaleDateString()} • {invoice.status}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="font-semibold text-gray-900">${invoice.amount}</span>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No billing history</h3>
                <p className="text-gray-600">
                  Your billing history will appear here once you upgrade to a paid plan.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Subscription Management */}
        {subscription && subscription.status !== 'free' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
                <span>Subscription Management</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-600">
                  Need to cancel your subscription? You can cancel at any time. 
                  Your plan will remain active until the end of your current billing period.
                </p>
                <Button 
                  variant="destructive" 
                  onClick={() => cancelMutation.mutate()}
                  disabled={cancelMutation.isPending || subscription.cancelAtPeriodEnd}
                >
                  {cancelMutation.isPending ? "Processing..." : 
                   subscription.cancelAtPeriodEnd ? "Cancellation Scheduled" : 
                   "Cancel Subscription"}
                </Button>
                {subscription.cancelAtPeriodEnd && (
                  <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                    <p className="text-sm text-orange-800">
                      Your subscription will be canceled at the end of your current billing period on{' '}
                      {new Date(subscription.currentPeriodEnd).toLocaleDateString()}.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
