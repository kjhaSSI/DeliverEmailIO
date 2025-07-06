import { 
  users, emailTemplates, emailLogs, apiKeys, systemLogs, aiQueries, stripeSubscriptions,
  type User, type InsertUser, type EmailTemplate, type InsertEmailTemplate,
  type EmailLog, type InsertEmailLog, type ApiKey, type InsertApiKey,
  type SystemLog, type AiQuery, type InsertAiQuery, type StripeSubscription
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq, and, gte, lte, desc } from "drizzle-orm";
import connectPg from "connect-pg-simple";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  sessionStore: session.SessionStore;
  
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;
  updateUserStripeInfo(id: number, stripeCustomerId: string, stripeSubscriptionId?: string): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  
  // Email Templates
  getEmailTemplates(userId: number): Promise<EmailTemplate[]>;
  getEmailTemplate(id: number, userId: number): Promise<EmailTemplate | undefined>;
  createEmailTemplate(template: InsertEmailTemplate & { userId: number }): Promise<EmailTemplate>;
  updateEmailTemplate(id: number, userId: number, updates: Partial<EmailTemplate>): Promise<EmailTemplate | undefined>;
  deleteEmailTemplate(id: number, userId: number): Promise<boolean>;
  
  // Email Logs
  getEmailLogs(userId: number, filters?: { status?: string; email?: string; startDate?: Date; endDate?: Date }): Promise<EmailLog[]>;
  createEmailLog(log: InsertEmailLog & { userId: number; status: string; apiKeyId?: number }): Promise<EmailLog>;
  
  // API Keys
  getApiKeys(userId: number): Promise<ApiKey[]>;
  getApiKey(id: number, userId: number): Promise<ApiKey | undefined>;
  getApiKeyByKey(key: string): Promise<ApiKey | undefined>;
  createApiKey(apiKey: InsertApiKey & { userId: number; key: string }): Promise<ApiKey>;
  updateApiKey(id: number, userId: number, updates: Partial<ApiKey>): Promise<ApiKey | undefined>;
  deleteApiKey(id: number, userId: number): Promise<boolean>;
  
  // System Logs
  createSystemLog(log: { userId?: number; action: string; endpoint?: string; details?: any }): Promise<SystemLog>;
  getSystemLogs(filters?: { userId?: number; action?: string; startDate?: Date; endDate?: Date }): Promise<SystemLog[]>;
  
  // AI Queries
  createAiQuery(query: InsertAiQuery & { userId?: number }): Promise<AiQuery>;
  getAiQueries(userId?: number): Promise<AiQuery[]>;
  updateAiQueryRating(id: number, rating: number): Promise<AiQuery | undefined>;
  
  // Stripe Subscriptions
  getStripeSubscription(userId: number): Promise<StripeSubscription | undefined>;
  createStripeSubscription(subscription: Omit<StripeSubscription, 'id' | 'createdAt' | 'updatedAt'>): Promise<StripeSubscription>;
  updateStripeSubscription(id: number, updates: Partial<StripeSubscription>): Promise<StripeSubscription | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private emailTemplates: Map<number, EmailTemplate>;
  private emailLogs: Map<number, EmailLog>;
  private apiKeys: Map<number, ApiKey>;
  private systemLogs: Map<number, SystemLog>;
  private aiQueries: Map<number, AiQuery>;
  private stripeSubscriptions: Map<number, StripeSubscription>;
  private currentId: number;
  public sessionStore: session.SessionStore;

  constructor() {
    this.users = new Map();
    this.emailTemplates = new Map();
    this.emailLogs = new Map();
    this.apiKeys = new Map();
    this.systemLogs = new Map();
    this.aiQueries = new Map();
    this.stripeSubscriptions = new Map();
    this.currentId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
    
    // Initialize demo users
    this.initializeDemoUsers();
  }

  private initializeDemoUsers() {
    // Create demo user account
    const demoUser: User = {
      id: 1,
      username: "demo",
      email: "demo@example.com",
      password: "3ca3b85b387a493748ae7556520ee8cc39f80cfd24253735cd6ac20c1c5c55d3a33490bc734ecb8d56634a66346cde73fd4b2ab89e7b3b4ef149864c4554bb29.993fd2ed8b6e352b80eb1d8efc2c089e", // password: "password"
      fullName: "Demo User",
      role: "user",
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      plan: "free",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    // Create demo admin user
    const adminUser: User = {
      id: 2,
      username: "admin",
      email: "admin@example.com", 
      password: "3ca3b85b387a493748ae7556520ee8cc39f80cfd24253735cd6ac20c1c5c55d3a33490bc734ecb8d56634a66346cde73fd4b2ab89e7b3b4ef149864c4554bb29.993fd2ed8b6e352b80eb1d8efc2c089e", // password: "password"
      fullName: "Admin User",
      role: "admin",
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      plan: "pro",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    this.users.set(1, demoUser);
    this.users.set(2, adminUser);
    this.currentId = 3;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = {
      ...insertUser,
      id,
      role: "user",
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      plan: "free",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates, updatedAt: new Date() };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async updateUserStripeInfo(id: number, stripeCustomerId: string, stripeSubscriptionId?: string): Promise<User | undefined> {
    return this.updateUser(id, { 
      stripeCustomerId, 
      stripeSubscriptionId: stripeSubscriptionId || null 
    });
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async getEmailTemplates(userId: number): Promise<EmailTemplate[]> {
    return Array.from(this.emailTemplates.values()).filter(t => t.userId === userId);
  }

  async getEmailTemplate(id: number, userId: number): Promise<EmailTemplate | undefined> {
    const template = this.emailTemplates.get(id);
    return template?.userId === userId ? template : undefined;
  }

  async createEmailTemplate(template: InsertEmailTemplate & { userId: number }): Promise<EmailTemplate> {
    const id = this.currentId++;
    const newTemplate: EmailTemplate = {
      ...template,
      id,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.emailTemplates.set(id, newTemplate);
    return newTemplate;
  }

  async updateEmailTemplate(id: number, userId: number, updates: Partial<EmailTemplate>): Promise<EmailTemplate | undefined> {
    const template = this.emailTemplates.get(id);
    if (!template || template.userId !== userId) return undefined;
    
    const updatedTemplate = { ...template, ...updates, updatedAt: new Date() };
    this.emailTemplates.set(id, updatedTemplate);
    return updatedTemplate;
  }

  async deleteEmailTemplate(id: number, userId: number): Promise<boolean> {
    const template = this.emailTemplates.get(id);
    if (!template || template.userId !== userId) return false;
    
    return this.emailTemplates.delete(id);
  }

  async getEmailLogs(userId: number, filters?: { status?: string; email?: string; startDate?: Date; endDate?: Date }): Promise<EmailLog[]> {
    let logs = Array.from(this.emailLogs.values()).filter(log => log.userId === userId);
    
    if (filters) {
      if (filters.status) {
        logs = logs.filter(log => log.status === filters.status);
      }
      if (filters.email) {
        logs = logs.filter(log => log.to.includes(filters.email!));
      }
      if (filters.startDate) {
        logs = logs.filter(log => log.sentAt >= filters.startDate!);
      }
      if (filters.endDate) {
        logs = logs.filter(log => log.sentAt <= filters.endDate!);
      }
    }
    
    return logs.sort((a, b) => b.sentAt.getTime() - a.sentAt.getTime());
  }

  async createEmailLog(log: InsertEmailLog & { userId: number; status: string; apiKeyId?: number }): Promise<EmailLog> {
    const id = this.currentId++;
    const newLog: EmailLog = {
      ...log,
      id,
      sentAt: new Date(),
    };
    this.emailLogs.set(id, newLog);
    return newLog;
  }

  async getApiKeys(userId: number): Promise<ApiKey[]> {
    return Array.from(this.apiKeys.values()).filter(key => key.userId === userId);
  }

  async getApiKey(id: number, userId: number): Promise<ApiKey | undefined> {
    const apiKey = this.apiKeys.get(id);
    return apiKey?.userId === userId ? apiKey : undefined;
  }

  async getApiKeyByKey(key: string): Promise<ApiKey | undefined> {
    return Array.from(this.apiKeys.values()).find(apiKey => apiKey.key === key);
  }

  async createApiKey(apiKey: InsertApiKey & { userId: number; key: string }): Promise<ApiKey> {
    const id = this.currentId++;
    const newApiKey: ApiKey = {
      ...apiKey,
      id,
      isActive: true,
      lastUsed: null,
      createdAt: new Date(),
    };
    this.apiKeys.set(id, newApiKey);
    return newApiKey;
  }

  async updateApiKey(id: number, userId: number, updates: Partial<ApiKey>): Promise<ApiKey | undefined> {
    const apiKey = this.apiKeys.get(id);
    if (!apiKey || apiKey.userId !== userId) return undefined;
    
    const updatedApiKey = { ...apiKey, ...updates };
    this.apiKeys.set(id, updatedApiKey);
    return updatedApiKey;
  }

  async deleteApiKey(id: number, userId: number): Promise<boolean> {
    const apiKey = this.apiKeys.get(id);
    if (!apiKey || apiKey.userId !== userId) return false;
    
    return this.apiKeys.delete(id);
  }

  async createSystemLog(log: { userId?: number; action: string; endpoint?: string; details?: any }): Promise<SystemLog> {
    const id = this.currentId++;
    const newLog: SystemLog = {
      ...log,
      id,
      userId: log.userId || null,
      endpoint: log.endpoint || null,
      details: log.details || null,
      createdAt: new Date(),
    };
    this.systemLogs.set(id, newLog);
    return newLog;
  }

  async getSystemLogs(filters?: { userId?: number; action?: string; startDate?: Date; endDate?: Date }): Promise<SystemLog[]> {
    let logs = Array.from(this.systemLogs.values());
    
    if (filters) {
      if (filters.userId) {
        logs = logs.filter(log => log.userId === filters.userId);
      }
      if (filters.action) {
        logs = logs.filter(log => log.action.includes(filters.action!));
      }
      if (filters.startDate) {
        logs = logs.filter(log => log.createdAt >= filters.startDate!);
      }
      if (filters.endDate) {
        logs = logs.filter(log => log.createdAt <= filters.endDate!);
      }
    }
    
    return logs.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createAiQuery(query: InsertAiQuery & { userId?: number }): Promise<AiQuery> {
    const id = this.currentId++;
    const newQuery: AiQuery = {
      ...query,
      id,
      userId: query.userId || null,
      rating: null,
      createdAt: new Date(),
    };
    this.aiQueries.set(id, newQuery);
    return newQuery;
  }

  async getAiQueries(userId?: number): Promise<AiQuery[]> {
    let queries = Array.from(this.aiQueries.values());
    
    if (userId) {
      queries = queries.filter(query => query.userId === userId);
    }
    
    return queries.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async updateAiQueryRating(id: number, rating: number): Promise<AiQuery | undefined> {
    const query = this.aiQueries.get(id);
    if (!query) return undefined;
    
    const updatedQuery = { ...query, rating };
    this.aiQueries.set(id, updatedQuery);
    return updatedQuery;
  }

  async getStripeSubscription(userId: number): Promise<StripeSubscription | undefined> {
    return Array.from(this.stripeSubscriptions.values()).find(sub => sub.userId === userId);
  }

  async createStripeSubscription(subscription: Omit<StripeSubscription, 'id' | 'createdAt' | 'updatedAt'>): Promise<StripeSubscription> {
    const id = this.currentId++;
    const newSubscription: StripeSubscription = {
      ...subscription,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.stripeSubscriptions.set(id, newSubscription);
    return newSubscription;
  }

  async updateStripeSubscription(id: number, updates: Partial<StripeSubscription>): Promise<StripeSubscription | undefined> {
    const subscription = this.stripeSubscriptions.get(id);
    if (!subscription) return undefined;
    
    const updatedSubscription = { ...subscription, ...updates, updatedAt: new Date() };
    this.stripeSubscriptions.set(id, updatedSubscription);
    return updatedSubscription;
  }
}

// Database Storage Implementation
export class DatabaseStorage implements IStorage {
  private db: any;
  public sessionStore: session.SessionStore;

  constructor() {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is required for database storage");
    }
    
    const sql = neon(process.env.DATABASE_URL);
    this.db = drizzle(sql);
    
    // Setup PostgreSQL session store
    const PostgresSessionStore = connectPg(session);
    this.sessionStore = new PostgresSessionStore({
      conString: process.env.DATABASE_URL,
      createTableIfMissing: true,
    });
    
    // Initialize demo users if they don't exist
    this.initializeDemoUsers();
  }

  private async initializeDemoUsers() {
    try {
      // Check if demo user already exists
      const existingDemo = await this.getUserByEmail("demo@example.com");
      if (!existingDemo) {
        await this.createUser({
          username: "demo",
          email: "demo@example.com",
          password: "3ca3b85b387a493748ae7556520ee8cc39f80cfd24253735cd6ac20c1c5c55d3a33490bc734ecb8d56634a66346cde73fd4b2ab89e7b3b4ef149864c4554bb29.993fd2ed8b6e352b80eb1d8efc2c089e", // password: "password"
          fullName: "Demo User",
          role: "user",
          plan: "free",
          isActive: true,
        });
      }

      // Check if admin user already exists
      const existingAdmin = await this.getUserByEmail("admin@example.com");
      if (!existingAdmin) {
        await this.createUser({
          username: "admin",
          email: "admin@example.com",
          password: "3ca3b85b387a493748ae7556520ee8cc39f80cfd24253735cd6ac20c1c5c55d3a33490bc734ecb8d56634a66346cde73fd4b2ab89e7b3b4ef149864c4554bb29.993fd2ed8b6e352b80eb1d8efc2c089e", // password: "password"
          fullName: "Admin User",
          role: "admin",
          plan: "premium",
          isActive: true,
        });
      }
    } catch (error) {
      console.log("Demo users initialization:", error);
    }
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.email, email));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await this.db.insert(users).values(insertUser).returning();
    return result[0];
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const result = await this.db.update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return result[0];
  }

  async updateUserStripeInfo(id: number, stripeCustomerId: string, stripeSubscriptionId?: string): Promise<User | undefined> {
    const updates: any = { stripeCustomerId, updatedAt: new Date() };
    if (stripeSubscriptionId) {
      updates.stripeSubscriptionId = stripeSubscriptionId;
    }
    const result = await this.db.update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning();
    return result[0];
  }

  async getAllUsers(): Promise<User[]> {
    return await this.db.select().from(users).orderBy(desc(users.createdAt));
  }

  // Email Templates
  async getEmailTemplates(userId: number): Promise<EmailTemplate[]> {
    return await this.db.select().from(emailTemplates)
      .where(eq(emailTemplates.userId, userId))
      .orderBy(desc(emailTemplates.createdAt));
  }

  async getEmailTemplate(id: number, userId: number): Promise<EmailTemplate | undefined> {
    const result = await this.db.select().from(emailTemplates)
      .where(and(eq(emailTemplates.id, id), eq(emailTemplates.userId, userId)));
    return result[0];
  }

  async createEmailTemplate(template: InsertEmailTemplate & { userId: number }): Promise<EmailTemplate> {
    const result = await this.db.insert(emailTemplates).values(template).returning();
    return result[0];
  }

  async updateEmailTemplate(id: number, userId: number, updates: Partial<EmailTemplate>): Promise<EmailTemplate | undefined> {
    const result = await this.db.update(emailTemplates)
      .set({ ...updates, updatedAt: new Date() })
      .where(and(eq(emailTemplates.id, id), eq(emailTemplates.userId, userId)))
      .returning();
    return result[0];
  }

  async deleteEmailTemplate(id: number, userId: number): Promise<boolean> {
    const result = await this.db.delete(emailTemplates)
      .where(and(eq(emailTemplates.id, id), eq(emailTemplates.userId, userId)));
    return result.rowCount > 0;
  }

  // Email Logs
  async getEmailLogs(userId: number, filters?: { status?: string; email?: string; startDate?: Date; endDate?: Date }): Promise<EmailLog[]> {
    let query = this.db.select().from(emailLogs).where(eq(emailLogs.userId, userId));
    
    if (filters?.status) {
      query = query.where(eq(emailLogs.status, filters.status));
    }
    if (filters?.email) {
      query = query.where(eq(emailLogs.to, filters.email));
    }
    if (filters?.startDate) {
      query = query.where(gte(emailLogs.sentAt, filters.startDate));
    }
    if (filters?.endDate) {
      query = query.where(lte(emailLogs.sentAt, filters.endDate));
    }
    
    return await query.orderBy(desc(emailLogs.sentAt));
  }

  async createEmailLog(log: InsertEmailLog & { userId: number; status: string; apiKeyId?: number }): Promise<EmailLog> {
    const result = await this.db.insert(emailLogs).values(log).returning();
    return result[0];
  }

  // API Keys
  async getApiKeys(userId: number): Promise<ApiKey[]> {
    return await this.db.select().from(apiKeys)
      .where(eq(apiKeys.userId, userId))
      .orderBy(desc(apiKeys.createdAt));
  }

  async getApiKey(id: number, userId: number): Promise<ApiKey | undefined> {
    const result = await this.db.select().from(apiKeys)
      .where(and(eq(apiKeys.id, id), eq(apiKeys.userId, userId)));
    return result[0];
  }

  async getApiKeyByKey(key: string): Promise<ApiKey | undefined> {
    const result = await this.db.select().from(apiKeys).where(eq(apiKeys.key, key));
    return result[0];
  }

  async createApiKey(apiKey: InsertApiKey & { userId: number; key: string }): Promise<ApiKey> {
    const result = await this.db.insert(apiKeys).values(apiKey).returning();
    return result[0];
  }

  async updateApiKey(id: number, userId: number, updates: Partial<ApiKey>): Promise<ApiKey | undefined> {
    const result = await this.db.update(apiKeys)
      .set(updates)
      .where(and(eq(apiKeys.id, id), eq(apiKeys.userId, userId)))
      .returning();
    return result[0];
  }

  async deleteApiKey(id: number, userId: number): Promise<boolean> {
    const result = await this.db.delete(apiKeys)
      .where(and(eq(apiKeys.id, id), eq(apiKeys.userId, userId)));
    return result.rowCount > 0;
  }

  // System Logs
  async createSystemLog(log: { userId?: number; action: string; endpoint?: string; details?: any }): Promise<SystemLog> {
    const result = await this.db.insert(systemLogs).values(log).returning();
    return result[0];
  }

  async getSystemLogs(filters?: { userId?: number; action?: string; startDate?: Date; endDate?: Date }): Promise<SystemLog[]> {
    let query = this.db.select().from(systemLogs);
    
    if (filters?.userId) {
      query = query.where(eq(systemLogs.userId, filters.userId));
    }
    if (filters?.action) {
      query = query.where(eq(systemLogs.action, filters.action));
    }
    if (filters?.startDate) {
      query = query.where(gte(systemLogs.createdAt, filters.startDate));
    }
    if (filters?.endDate) {
      query = query.where(lte(systemLogs.createdAt, filters.endDate));
    }
    
    return await query.orderBy(desc(systemLogs.createdAt));
  }

  // AI Queries
  async createAiQuery(query: InsertAiQuery & { userId?: number }): Promise<AiQuery> {
    const result = await this.db.insert(aiQueries).values(query).returning();
    return result[0];
  }

  async getAiQueries(userId?: number): Promise<AiQuery[]> {
    let query = this.db.select().from(aiQueries);
    if (userId) {
      query = query.where(eq(aiQueries.userId, userId));
    }
    return await query.orderBy(desc(aiQueries.createdAt));
  }

  async updateAiQueryRating(id: number, rating: number): Promise<AiQuery | undefined> {
    const result = await this.db.update(aiQueries)
      .set({ rating })
      .where(eq(aiQueries.id, id))
      .returning();
    return result[0];
  }

  // Stripe Subscriptions
  async getStripeSubscription(userId: number): Promise<StripeSubscription | undefined> {
    const result = await this.db.select().from(stripeSubscriptions)
      .where(eq(stripeSubscriptions.userId, userId));
    return result[0];
  }

  async createStripeSubscription(subscription: Omit<StripeSubscription, 'id' | 'createdAt' | 'updatedAt'>): Promise<StripeSubscription> {
    const result = await this.db.insert(stripeSubscriptions).values(subscription).returning();
    return result[0];
  }

  async updateStripeSubscription(id: number, updates: Partial<StripeSubscription>): Promise<StripeSubscription | undefined> {
    const result = await this.db.update(stripeSubscriptions)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(stripeSubscriptions.id, id))
      .returning();
    return result[0];
  }
}

// Choose storage implementation based on environment
export const storage = process.env.DATABASE_URL ? new DatabaseStorage() : new MemStorage();
