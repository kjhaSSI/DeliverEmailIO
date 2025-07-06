import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { insertEmailTemplateSchema, insertEmailLogSchema, insertApiKeySchema, insertAiQuerySchema } from "@shared/schema";
import { randomBytes } from "crypto";
import nodemailer from "nodemailer";

// Initialize Stripe if keys are available
let stripe: Stripe | null = null;
if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
}

// Configure nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.ethereal.email",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER || "ethereal.user@ethereal.email",
    pass: process.env.SMTP_PASS || "ethereal.pass",
  },
});

function requireAuth(req: any, res: any, next: any) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Authentication required" });
  }
  next();
}

function requireAdmin(req: any, res: any, next: any) {
  if (!req.isAuthenticated() || req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication
  setupAuth(app);

  // Email Templates
  app.get("/api/templates", requireAuth, async (req, res) => {
    try {
      const templates = await storage.getEmailTemplates(req.user.id);
      res.json(templates);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/templates", requireAuth, async (req, res) => {
    try {
      const validated = insertEmailTemplateSchema.parse(req.body);
      const template = await storage.createEmailTemplate({
        ...validated,
        userId: req.user.id,
      });
      await storage.createSystemLog({
        userId: req.user.id,
        action: "create_template",
        details: { templateId: template.id, name: template.name },
      });
      res.status(201).json(template);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.put("/api/templates/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validated = insertEmailTemplateSchema.partial().parse(req.body);
      const template = await storage.updateEmailTemplate(id, req.user.id, validated);
      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }
      await storage.createSystemLog({
        userId: req.user.id,
        action: "update_template",
        details: { templateId: id },
      });
      res.json(template);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/templates/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteEmailTemplate(id, req.user.id);
      if (!deleted) {
        return res.status(404).json({ message: "Template not found" });
      }
      await storage.createSystemLog({
        userId: req.user.id,
        action: "delete_template",
        details: { templateId: id },
      });
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Send Email
  app.post("/api/send-email", requireAuth, async (req, res) => {
    try {
      const validated = insertEmailLogSchema.parse(req.body);
      
      // Send email via SMTP
      const mailOptions = {
        from: process.env.FROM_EMAIL || "noreply@delivermail.io",
        to: validated.to,
        subject: validated.subject,
        html: validated.body,
      };

      let status = "sent";
      try {
        await transporter.sendMail(mailOptions);
        status = "delivered";
      } catch (emailError) {
        console.error("Email sending failed:", emailError);
        status = "failed";
      }

      const emailLog = await storage.createEmailLog({
        ...validated,
        userId: req.user.id,
        status,
      });

      await storage.createSystemLog({
        userId: req.user.id,
        action: "send_email",
        details: { to: validated.to, status },
      });

      res.status(201).json(emailLog);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Email Logs
  app.get("/api/logs", requireAuth, async (req, res) => {
    try {
      const { status, email, startDate, endDate } = req.query;
      const filters: any = {};
      
      if (status) filters.status = status as string;
      if (email) filters.email = email as string;
      if (startDate) filters.startDate = new Date(startDate as string);
      if (endDate) filters.endDate = new Date(endDate as string);

      const logs = await storage.getEmailLogs(req.user.id, filters);
      res.json(logs);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // API Keys
  app.get("/api/api-keys", requireAuth, async (req, res) => {
    try {
      const apiKeys = await storage.getApiKeys(req.user.id);
      res.json(apiKeys);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/api-keys", requireAuth, async (req, res) => {
    try {
      const validated = insertApiKeySchema.parse(req.body);
      const key = `dk_${randomBytes(32).toString("hex")}`;
      const apiKey = await storage.createApiKey({
        ...validated,
        userId: req.user.id,
        key,
      });
      await storage.createSystemLog({
        userId: req.user.id,
        action: "create_api_key",
        details: { keyId: apiKey.id, name: apiKey.name },
      });
      res.status(201).json(apiKey);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/api-keys/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteApiKey(id, req.user.id);
      if (!deleted) {
        return res.status(404).json({ message: "API key not found" });
      }
      await storage.createSystemLog({
        userId: req.user.id,
        action: "delete_api_key",
        details: { keyId: id },
      });
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Dashboard Stats
  app.get("/api/dashboard/stats", requireAuth, async (req, res) => {
    try {
      const logs = await storage.getEmailLogs(req.user.id);
      const apiKeys = await storage.getApiKeys(req.user.id);
      
      const stats = {
        emailsSent: logs.length,
        deliveryRate: logs.length > 0 ? (logs.filter(l => l.status === "delivered").length / logs.length * 100).toFixed(1) : "0",
        bounceRate: logs.length > 0 ? (logs.filter(l => l.status === "bounced").length / logs.length * 100).toFixed(1) : "0",
        apiCalls: logs.length, // Simplified for now
      };
      
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // AI Assistant
  app.post("/api/ai/query", requireAuth, async (req, res) => {
    try {
      const { query } = req.body;
      
      // Mock AI response for now - in production, integrate with OpenAI API
      let response = "I'm here to help with your email delivery questions. ";
      
      if (query.toLowerCase().includes("api")) {
        response += "You can use our REST API or SMTP to send emails. Check our documentation for integration guides.";
      } else if (query.toLowerCase().includes("template")) {
        response += "You can create email templates in the Templates section. Templates help you reuse common email formats.";
      } else if (query.toLowerCase().includes("bounce")) {
        response += "Bounced emails occur when the recipient's server rejects the message. Check the Email Logs for detailed bounce reasons.";
      } else {
        response += "Could you please provide more details about what you'd like to know?";
      }

      const aiQuery = await storage.createAiQuery({
        query,
        response,
        userId: req.user.id,
      });

      res.json({ response, queryId: aiQuery.id });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/ai/rate/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { rating } = req.body;
      
      const updatedQuery = await storage.updateAiQueryRating(id, rating);
      if (!updatedQuery) {
        return res.status(404).json({ message: "Query not found" });
      }
      
      res.json(updatedQuery);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Mock Stripe Billing Integration (for demonstration)
  app.post("/api/create-subscription", requireAuth, async (req, res) => {
    try {
      const user = req.user!;
      const { planName, billingPeriod = 'yearly' } = req.body;

      // Mock customer creation
      const mockCustomerId = `cus_mock_${user.id}_${Date.now()}`;
      const mockSubscriptionId = `sub_mock_${user.id}_${Date.now()}`;

      // Update user with mock Stripe info
      await storage.updateUserStripeInfo(user.id, mockCustomerId, mockSubscriptionId);

      // Create mock subscription record
      const mockSubscription = await storage.createStripeSubscription({
        userId: user.id,
        stripeSubscriptionId: mockSubscriptionId,
        status: "active",
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        cancelAtPeriodEnd: false,
      });

      // Update user plan
      const planMap: { [key: string]: string } = {
        'pro': 'pro',
        'enterprise': 'enterprise'
      };
      
      if (planMap[planName]) {
        await storage.updateUser(user.id, { plan: planMap[planName] });
      }

      res.json({
        subscriptionId: mockSubscriptionId,
        clientSecret: `pi_mock_${Date.now()}_secret_mock`,
        success: true,
        message: `Successfully subscribed to ${planName} plan (${billingPeriod}) - Mock Integration`,
        billingPeriod
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/billing/subscription", requireAuth, async (req, res) => {
    try {
      const user = req.user!;
      let subscription = await storage.getStripeSubscription(user.id);
      
      // If no subscription exists, create a mock one for free plan users
      if (!subscription && user.plan === 'free') {
        subscription = {
          id: 1,
          userId: user.id,
          stripeSubscriptionId: `sub_free_${user.id}`,
          status: "active",
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          cancelAtPeriodEnd: false,
          createdAt: new Date(),
          updatedAt: new Date()
        };
      }

      res.json(subscription);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/billing/cancel-subscription", requireAuth, async (req, res) => {
    try {
      const user = req.user!;
      const subscription = await storage.getStripeSubscription(user.id);
      
      if (!subscription) {
        return res.status(404).json({ message: "No subscription found" });
      }

      // Mock cancellation - set to cancel at period end
      await storage.updateStripeSubscription(subscription.id, {
        cancelAtPeriodEnd: true,
        status: "canceling"
      });

      res.json({
        success: true,
        message: "Subscription will be canceled at the end of the current billing period"
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/billing/invoices", requireAuth, async (req, res) => {
    try {
      const user = req.user!;
      
      // Mock invoice data
      const mockInvoices = [
        {
          id: "in_mock_001",
          date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          amount: user.plan === 'pro' ? 29 : user.plan === 'enterprise' ? 99 : 0,
          status: "paid",
          planName: user.plan,
          downloadUrl: "#"
        },
        {
          id: "in_mock_002", 
          date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
          amount: user.plan === 'pro' ? 29 : user.plan === 'enterprise' ? 99 : 0,
          status: "paid",
          planName: user.plan,
          downloadUrl: "#"
        }
      ].filter(invoice => invoice.amount > 0); // Only show invoices for paid plans

      res.json(mockInvoices);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Admin Routes
  app.get("/api/admin/users", requireAdmin, async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.put("/api/admin/users/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { isActive, role } = req.body;
      
      const user = await storage.updateUser(id, { isActive, role });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      await storage.createSystemLog({
        userId: req.user.id,
        action: "admin_update_user",
        details: { targetUserId: id, changes: { isActive, role } },
      });
      
      res.json(user);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/admin/system-logs", requireAdmin, async (req, res) => {
    try {
      const { userId, action, startDate, endDate } = req.query;
      const filters: any = {};
      
      if (userId) filters.userId = parseInt(userId as string);
      if (action) filters.action = action as string;
      if (startDate) filters.startDate = new Date(startDate as string);
      if (endDate) filters.endDate = new Date(endDate as string);

      const logs = await storage.getSystemLogs(filters);
      res.json(logs);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/admin/stats", requireAdmin, async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      const systemLogs = await storage.getSystemLogs();
      const emailLogs = await storage.getEmailLogs(0); // Get all logs (admin view)
      
      const stats = {
        totalUsers: users.length,
        activeUsers: users.filter(u => u.isActive).length,
        totalEmails: emailLogs.length,
        successRate: emailLogs.length > 0 ? 
          (emailLogs.filter(l => l.status === "delivered").length / emailLogs.length * 100).toFixed(1) : "0",
        bounceRate: emailLogs.length > 0 ? 
          (emailLogs.filter(l => l.status === "bounced").length / emailLogs.length * 100).toFixed(1) : "0",
      };
      
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Debug endpoint to check users (remove in production)
  app.get("/api/debug/users", async (req, res) => {
    const users = await storage.getAllUsers();
    res.json(users.map(user => ({ 
      id: user.id, 
      email: user.email, 
      username: user.username,
      fullName: user.fullName,
      role: user.role 
    })));
  });

  const httpServer = createServer(app);
  return httpServer;
}
