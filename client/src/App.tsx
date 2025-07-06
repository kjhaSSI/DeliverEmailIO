import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import PricingPage from "@/pages/pricing";
import DocsPage from "@/pages/docs";
import Dashboard from "@/pages/dashboard/dashboard";
import SendEmail from "@/pages/dashboard/send-email";
import Templates from "@/pages/dashboard/templates";
import EmailLogs from "@/pages/dashboard/email-logs";
import ApiKeys from "@/pages/dashboard/api-keys";
import Billing from "@/pages/dashboard/billing";
import Settings from "@/pages/dashboard/settings";
import AdminDashboard from "@/pages/admin/admin-dashboard";
import AdminUsers from "@/pages/admin/users";
import AdminSystemLogs from "@/pages/admin/system-logs";
import AdminPlans from "@/pages/admin/plans";
import Checkout from "@/pages/checkout";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/pricing" component={PricingPage} />
      <Route path="/docs" component={DocsPage} />
      
      {/* Protected User Routes */}
      <ProtectedRoute path="/dashboard" component={Dashboard} />
      <ProtectedRoute path="/dashboard/send" component={SendEmail} />
      <ProtectedRoute path="/dashboard/templates" component={Templates} />
      <ProtectedRoute path="/dashboard/logs" component={EmailLogs} />
      <ProtectedRoute path="/dashboard/api-keys" component={ApiKeys} />
      <ProtectedRoute path="/dashboard/billing" component={Billing} />
      <ProtectedRoute path="/dashboard/settings" component={Settings} />
      <ProtectedRoute path="/checkout/:plan" component={Checkout} />
      
      {/* Protected Admin Routes */}
      <ProtectedRoute path="/admin" component={AdminDashboard} />
      <ProtectedRoute path="/admin/users" component={AdminUsers} />
      <ProtectedRoute path="/admin/logs" component={AdminSystemLogs} />
      <ProtectedRoute path="/admin/plans" component={AdminPlans} />
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
