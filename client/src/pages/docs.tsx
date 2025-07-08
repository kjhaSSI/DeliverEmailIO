import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, Menu, X, Code, Send, Key, FileText, 
  Book, ExternalLink, Copy, CheckCircle 
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import AiAssistant from "@/components/ai-assistant";

export default function DocsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    toast({
      title: "Copied to clipboard",
      description: "Code snippet has been copied to your clipboard.",
    });
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const quickStartSteps = [
    {
      title: "Sign up for an account",
      description: "Create your free DeliverMail.io account to get started.",
      action: "Sign up",
      href: "/auth",
    },
    {
      title: "Create an API key",
      description: "Generate an API key from your dashboard for authentication.",
      action: "Go to Dashboard",
      href: user ? "/dashboard/api-keys" : "/auth",
    },
    {
      title: "Send your first email",
      description: "Use our API or SMTP to send your first email.",
      action: "View Examples",
      href: "#examples",
    },
  ];

  const apiEndpoints = [
    {
      method: "POST",
      endpoint: "/api/send-email",
      description: "Send a single email",
      auth: "Required",
    },
    {
      method: "GET",
      endpoint: "/api/templates",
      description: "List email templates",
      auth: "Required",
    },
    {
      method: "POST",
      endpoint: "/api/templates",
      description: "Create a new template",
      auth: "Required",
    },
    {
      method: "GET",
      endpoint: "/api/logs",
      description: "Get email delivery logs",
      auth: "Required",
    },
    {
      method: "GET",
      endpoint: "/api/api-keys",
      description: "List API keys",
      auth: "Required",
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
                  <Link href="/pricing" className="text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium transition-colors">Pricing</Link>
                  <a href="#" className="text-primary px-3 py-2 text-sm font-medium transition-colors">Docs</a>
                  <a href="/#features" className="text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium transition-colors">Features</a>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <Link href="/dashboard">
                  <Button className="bg-primary hover:bg-primary-700">
                    Dashboard
                  </Button>
                </Link>
              ) : (
                <>
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
                </>
              )}
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
                <Link href="/pricing" className="text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium">Pricing</Link>
                <a href="#" className="text-primary px-3 py-2 text-sm font-medium">Docs</a>
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
                Developer Documentation
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
                Everything you need to integrate DeliverMail.io into your application. 
                Get started with our comprehensive guides, API reference, and code examples.
              </p>
            </div>
          </div>
        </section>

        {/* Quick Start */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Quick Start</h2>
              <p className="text-lg text-gray-600">Get up and running in minutes</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {quickStartSteps.map((step, index) => (
                <Card key={index} className="text-center">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                      <span className="text-white text-xl font-bold">{index + 1}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                    <p className="text-gray-600 mb-4">{step.description}</p>
                    <Link href={step.href}>
                      <Button size="sm">{step.action}</Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* API Reference */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">API Reference</h2>
              <p className="text-lg text-gray-600">Complete API endpoints and authentication</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Authentication */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Key className="w-5 h-5" />
                    <span>Authentication</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600">
                    All API requests require authentication using your API key in the Authorization header.
                  </p>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Header</span>
                      <button
                        onClick={() => copyToClipboard("Authorization: Bearer YOUR_API_KEY", "auth-header")}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        {copiedCode === "auth-header" ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                    <code className="text-sm">Authorization: Bearer YOUR_API_KEY</code>
                  </div>
                </CardContent>
              </Card>

              {/* Base URL */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Code className="w-5 h-5" />
                    <span>Base URL</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600">
                    All API endpoints are relative to the base URL below.
                  </p>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Production</span>
                      <button
                        onClick={() => copyToClipboard("https://api.delivermail.io/v1", "base-url")}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        {copiedCode === "base-url" ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                    <code className="text-sm">https://api.delivermail.io/v1</code>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* API Endpoints */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>API Endpoints</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Method</th>
                        <th className="text-left py-2">Endpoint</th>
                        <th className="text-left py-2">Description</th>
                        <th className="text-left py-2">Auth</th>
                      </tr>
                    </thead>
                    <tbody>
                      {apiEndpoints.map((endpoint, index) => (
                        <tr key={index} className="border-b">
                          <td className="py-3">
                            <Badge 
                              variant={endpoint.method === "GET" ? "secondary" : "default"}
                              className={
                                endpoint.method === "GET" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
                              }
                            >
                              {endpoint.method}
                            </Badge>
                          </td>
                          <td className="py-3">
                            <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                              {endpoint.endpoint}
                            </code>
                          </td>
                          <td className="py-3 text-gray-600">{endpoint.description}</td>
                          <td className="py-3">
                            <Badge variant="outline">{endpoint.auth}</Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Code Examples */}
        <section id="examples" className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Code Examples</h2>
              <p className="text-lg text-gray-600">Ready-to-use code snippets for common tasks</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Send Email Example */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Send className="w-5 h-5" />
                    <span>Send Email</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-gray-600">Send a single email via our REST API.</p>
                    <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-400 text-sm">cURL</span>
                        <button
                          onClick={() => copyToClipboard(`curl -X POST https://api.delivermail.io/v1/send \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "to": "recipient@example.com",
    "subject": "Hello World",
    "body": "<h1>Hello from DeliverMail.io!</h1>"
  }'`, "send-email-curl")}
                          className="text-gray-400 hover:text-white"
                        >
                          {copiedCode === "send-email-curl" ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                      <pre className="text-green-400 text-sm">
{`curl -X POST https://api.delivermail.io/v1/send \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "to": "recipient@example.com",
    "subject": "Hello World", 
    "body": "<h1>Hello from DeliverMail.io!</h1>"
  }'`}
                      </pre>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* SMTP Example */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Code className="w-5 h-5" />
                    <span>SMTP Configuration</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-gray-600">Configure your application to use our SMTP service.</p>
                    <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-400 text-sm">Node.js</span>
                        <button
                          onClick={() => copyToClipboard(`const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransporter({
  host: 'smtp.delivermail.io',
  port: 587,
  secure: false,
  auth: {
    user: 'apikey',
    pass: 'YOUR_API_KEY'
  }
});

transporter.sendMail({
  from: 'sender@yourdomain.com',
  to: 'recipient@example.com',
  subject: 'Hello World',
  html: '<h1>Hello from DeliverMail.io!</h1>'
});`, "smtp-nodejs")}
                          className="text-gray-400 hover:text-white"
                        >
                          {copiedCode === "smtp-nodejs" ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                      <pre className="text-blue-400 text-sm">
{`const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransporter({
  host: 'smtp.delivermail.io',
  port: 587,
  secure: false,
  auth: {
    user: 'apikey',
    pass: 'YOUR_API_KEY'
  }
});

transporter.sendMail({
  from: 'sender@yourdomain.com',
  to: 'recipient@example.com',
  subject: 'Hello World',
  html: '<h1>Hello from DeliverMail.io!</h1>'
});`}
                      </pre>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Template Example */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="w-5 h-5" />
                    <span>Create Template</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-gray-600">Create a reusable email template.</p>
                    <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-400 text-sm">JavaScript</span>
                        <button
                          onClick={() => copyToClipboard(`fetch('https://api.delivermail.io/v1/templates', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'Welcome Email',
    subject: 'Welcome to {{company}}!',
    body: '<h1>Welcome {{name}}!</h1><p>Thanks for joining {{company}}.</p>'
  })
});`, "create-template")}
                          className="text-gray-400 hover:text-white"
                        >
                          {copiedCode === "create-template" ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                      <pre className="text-yellow-400 text-sm">
{`fetch('https://api.delivermail.io/v1/templates', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'Welcome Email',
    subject: 'Welcome to {{company}}!',
    body: '<h1>Welcome {{name}}!</h1><p>Thanks for joining {{company}}.</p>'
  })
});`}
                      </pre>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Get Logs Example */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Book className="w-5 h-5" />
                    <span>Get Email Logs</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-gray-600">Retrieve email delivery logs with filtering.</p>
                    <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-400 text-sm">Python</span>
                        <button
                          onClick={() => copyToClipboard(`import requests

response = requests.get(
    'https://api.delivermail.io/v1/logs',
    headers={'Authorization': 'Bearer YOUR_API_KEY'},
    params={
        'status': 'delivered',
        'startDate': '2024-01-01',
        'endDate': '2024-01-31'
    }
)

logs = response.json()
print(f"Found {len(logs)} email logs")`, "get-logs-python")}
                          className="text-gray-400 hover:text-white"
                        >
                          {copiedCode === "get-logs-python" ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                      <pre className="text-purple-400 text-sm">
{`import requests

response = requests.get(
    'https://api.delivermail.io/v1/logs',
    headers={'Authorization': 'Bearer YOUR_API_KEY'},
    params={
        'status': 'delivered',
        'startDate': '2024-01-01',
        'endDate': '2024-01-31'
    }
)

logs = response.json()
print(f"Found {len(logs)} email logs")`}
                      </pre>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Support Section */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Need help getting started?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Our support team is here to help you integrate DeliverMail.io successfully.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg">
                Contact Support
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
              <Button size="lg" variant="outline">
                Join Community
                <ExternalLink className="w-4 h-4 ml-2" />
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
                <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
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
