import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ArrowLeft, Menu, X } from "lucide-react";
import { useState } from "react";
import AiAssistant from "@/components/ai-assistant";

export default function PricingPage() {
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Redirect authenticated users to dashboard
  if (user) {
    return <Link href="/dashboard">Redirecting to dashboard...</Link>;
  }

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
        "SMTP & REST API",
      ],
      buttonText: "Get started",
      buttonVariant: "outline" as const,
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
        "Webhook support",
        "Dedicated IP pool",
      ],
      popular: true,
      buttonText: "Start free trial",
      buttonVariant: "default" as const,
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
        "Advanced security features",
        "Priority delivery",
      ],
      buttonText: "Contact sales",
      buttonVariant: "outline" as const,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <div className="flex-shrink-0">
                <Link href="/">
                  <h1 className="text-2xl font-bold text-primary cursor-pointer">DeliverMail.io</h1>
                </Link>
              </div>
              <div className="hidden md:block">
                <div className="flex items-baseline space-x-8">
                  <Link href="/" className="text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium transition-colors">Home</Link>
                  <a href="#" className="text-primary px-3 py-2 text-sm font-medium transition-colors">Pricing</a>
                  <Link href="/docs" className="text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium transition-colors">Docs</Link>
                  <a href="/#features" className="text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium transition-colors">Features</a>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/auth">
                <Button variant="ghost" className="text-gray-700 hover:text-primary">
                  Log in
                </Button>
              </Link>
              <Link href="/auth">
                <Button className="bg-primary hover:bg-primary-700">
                  Sign up
                </Button>
              </Link>
              <button 
                className="md:hidden text-gray-700 hover:text-primary"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
          
          {/* Mobile menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-4">
              <div className="flex flex-col space-y-2">
                <Link href="/" className="text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium">Home</Link>
                <a href="#" className="text-primary px-3 py-2 text-sm font-medium">Pricing</a>
                <Link href="/docs" className="text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium">Docs</Link>
                <a href="/#features" className="text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium">Features</a>
              </div>
            </div>
          )}
        </nav>
      </header>

      <main>
        {/* Hero Section */}
        <section className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <Link href="/" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-8">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to home
              </Link>
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
                Choose the perfect plan for your needs
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
                Start free and scale as you grow. All plans include our reliable email delivery infrastructure, 
                comprehensive analytics, and world-class support.
              </p>
            </div>
          </div>
        </section>

        {/* Pricing Plans */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {plans.map((plan, index) => (
                <div
                  key={plan.name}
                  className={`
                    relative border rounded-xl p-8 bg-white
                    ${plan.popular ? 'border-2 border-primary shadow-lg scale-105' : 'border border-gray-200'}
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

                  <ul className="space-y-4 mb-8">
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
                      size="lg"
                    >
                      {plan.buttonText}
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-gray-600">
                Everything you need to know about our pricing and plans
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Can I change plans anytime?
                </h3>
                <p className="text-gray-600">
                  Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately 
                  and we'll prorate the billing accordingly.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  What happens if I exceed my email limit?
                </h3>
                <p className="text-gray-600">
                  We'll notify you when you approach your limit. You can upgrade your plan or 
                  purchase additional email credits to continue sending.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Do you offer refunds?
                </h3>
                <p className="text-gray-600">
                  We offer a 30-day money-back guarantee for all paid plans. If you're not satisfied, 
                  contact our support team for a full refund.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Is there a setup fee?
                </h3>
                <p className="text-gray-600">
                  No setup fees, ever. You only pay for what you use. Start with our free plan 
                  and upgrade when you're ready.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  What payment methods do you accept?
                </h3>
                <p className="text-gray-600">
                  We accept all major credit cards, PayPal, and bank transfers for Enterprise plans. 
                  All payments are processed securely through Stripe.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Do you offer volume discounts?
                </h3>
                <p className="text-gray-600">
                  Yes! Contact our sales team for custom pricing if you need to send more than 
                  500,000 emails per month.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to get started?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of developers and businesses who trust DeliverMail.io 
              for their email delivery needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth">
                <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
                  Start free trial
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                Contact sales
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-2xl font-bold mb-4">DeliverMail.io</h3>
              <p className="text-gray-400 mb-6 max-w-md">
                Professional email delivery platform trusted by developers and businesses worldwide.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><Link href="/docs" className="hover:text-white transition-colors">Documentation</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 DeliverMail.io. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <AiAssistant />
    </div>
  );
}
