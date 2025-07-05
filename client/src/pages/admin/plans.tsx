import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { CreditCard, Edit, Plus, AlertTriangle, DollarSign, Users, Zap } from "lucide-react";

export default function AdminPlans() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState<string | null>(null);

  const plans = [
    {
      id: "free",
      name: "Free",
      price: 0,
      period: "month",
      emails: 1000,
      features: [
        "1,000 emails/month",
        "Basic analytics",
        "Email support",
        "API access",
      ],
      users: 45,
      active: true,
    },
    {
      id: "pro",
      name: "Pro",
      price: 29,
      period: "month",
      emails: 50000,
      features: [
        "50,000 emails/month",
        "Advanced analytics",
        "Priority support",
        "Template editor",
        "Custom domains",
      ],
      users: 12,
      active: true,
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: 99,
      period: "month",
      emails: 500000,
      features: [
        "500,000 emails/month",
        "Custom analytics",
        "24/7 phone support",
        "Dedicated IP",
        "Custom integrations",
        "SLA guarantee",
      ],
      users: 3,
      active: true,
    },
  ];

  if (user?.role !== "admin") {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to manage plans.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Plan Management</h1>
            <p className="text-gray-600 mt-2">Manage subscription plans and pricing</p>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Plan
          </Button>
        </div>

        {/* Plan Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Plans</p>
                  <p className="text-2xl font-bold text-gray-900">{plans.length}</p>
                </div>
                <CreditCard className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Subscribers</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {plans.reduce((sum, plan) => sum + plan.users, 0)}
                  </p>
                </div>
                <Users className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Monthly Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${plans.reduce((sum, plan) => sum + (plan.price * plan.users), 0)}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Active Plans</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {plans.filter(plan => plan.active).length}
                  </p>
                </div>
                <Zap className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Plans List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card key={plan.id} className="relative">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Badge variant={plan.active ? "default" : "secondary"}>
                      {plan.active ? "Active" : "Inactive"}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsEditing(isEditing === plan.id ? null : plan.id)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="text-3xl font-bold">
                  ${plan.price}
                  <span className="text-lg font-normal text-gray-600">/{plan.period}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Users:</span>
                    <span className="ml-2 text-gray-900">{plan.users}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Emails:</span>
                    <span className="ml-2 text-gray-900">{plan.emails.toLocaleString()}</span>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Features</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2 flex-shrink-0"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {isEditing === plan.id && (
                  <>
                    <Separator />
                    <div className="space-y-4 pt-4">
                      <h4 className="font-medium text-gray-900">Edit Plan</h4>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`name-${plan.id}`}>Name</Label>
                          <Input id={`name-${plan.id}`} defaultValue={plan.name} />
                        </div>
                        <div>
                          <Label htmlFor={`price-${plan.id}`}>Price</Label>
                          <Input id={`price-${plan.id}`} type="number" defaultValue={plan.price} />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor={`emails-${plan.id}`}>Email Limit</Label>
                        <Input 
                          id={`emails-${plan.id}`} 
                          type="number" 
                          defaultValue={plan.emails} 
                        />
                      </div>

                      <div>
                        <Label htmlFor={`features-${plan.id}`}>Features (one per line)</Label>
                        <Textarea 
                          id={`features-${plan.id}`}
                          rows={5}
                          defaultValue={plan.features.join('\n')}
                        />
                      </div>

                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setIsEditing(null)}
                        >
                          Cancel
                        </Button>
                        <Button size="sm">Save Changes</Button>
                      </div>
                    </div>
                  </>
                )}

                <div className="flex justify-between items-center pt-4">
                  <span className="text-sm text-gray-600">
                    Revenue: ${plan.price * plan.users}/month
                  </span>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stripe Integration Info */}
        <Card>
          <CardHeader>
            <CardTitle>Stripe Integration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-800 mb-2">Stripe Configuration</h4>
              <div className="text-sm text-blue-700 space-y-1">
                <p>• Plans are automatically synced with Stripe Products</p>
                <p>• Price changes require updating both here and in Stripe Dashboard</p>
                <p>• Webhook events handle subscription status updates</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Webhook Endpoint:</span>
                <code className="block bg-gray-100 p-2 rounded mt-1 text-xs">
                  https://api.delivermail.io/webhooks/stripe
                </code>
              </div>
              <div>
                <span className="font-medium text-gray-700">Events:</span>
                <div className="mt-1 text-gray-600">
                  <p>• customer.subscription.created</p>
                  <p>• customer.subscription.updated</p>
                  <p>• customer.subscription.deleted</p>
                  <p>• invoice.payment_succeeded</p>
                  <p>• invoice.payment_failed</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
