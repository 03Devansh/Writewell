import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Simple hash function for demo purposes
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(36) + str.length.toString(36);
}

function generateToken(): string {
  return (
    Math.random().toString(36).substring(2) +
    Math.random().toString(36).substring(2) +
    Date.now().toString(36)
  );
}

export const signUp = mutation({
  args: {
    email: v.string(),
    password: v.string(),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    const userId = await ctx.db.insert("users", {
      email: args.email,
      name: args.name,
      passwordHash: simpleHash(args.password),
      createdAt: Date.now(),
      hasActiveSubscription: false,
    });

    const token = generateToken();
    const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000;

    await ctx.db.insert("sessions", {
      userId,
      token,
      expiresAt,
      createdAt: Date.now(),
    });

    return { userId, token };
  },
});

export const signIn = mutation({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (!user || user.passwordHash !== simpleHash(args.password)) {
      throw new Error("Invalid email or password");
    }

    const token = generateToken();
    const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000;

    await ctx.db.insert("sessions", {
      userId: user._id,
      token,
      expiresAt,
      createdAt: Date.now(),
    });

    return { userId: user._id, token };
  },
});

export const signOut = mutation({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (session) {
      await ctx.db.delete(session._id);
    }

    return { success: true };
  },
});

export const validateSession = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (!session || session.expiresAt < Date.now()) {
      return null;
    }

    const user = await ctx.db.get(session.userId);
    if (!user) return null;

    return {
      userId: user._id,
      email: user.email,
      name: user.name,
    };
  },
});

export const getCurrentUser = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (!session || session.expiresAt < Date.now()) {
      return null;
    }

    const user = await ctx.db.get(session.userId);
    if (!user) return null;

    return {
      _id: user._id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
      hasActiveSubscription: user.hasActiveSubscription ?? false,
      subscriptionId: user.subscriptionId,
      subscriptionStatus: user.subscriptionStatus,
      aiGlobalInstructions: user.aiGlobalInstructions,
    };
  },
});

export const getSubscriptionStatus = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (!session || session.expiresAt < Date.now()) {
      return { hasActiveSubscription: false };
    }

    const user = await ctx.db.get(session.userId);
    if (!user) {
      return { hasActiveSubscription: false };
    }

    return {
      hasActiveSubscription: user.hasActiveSubscription ?? false,
      subscriptionId: user.subscriptionId,
      subscriptionStatus: user.subscriptionStatus,
    };
  },
});

export const getUserByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
  },
});

export const updateSubscription = mutation({
  args: {
    userId: v.id("users"),
    hasActiveSubscription: v.boolean(),
    subscriptionId: v.optional(v.string()),
    subscriptionStatus: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const patchData: {
      hasActiveSubscription: boolean;
      subscriptionId?: string;
      subscriptionStatus?: string;
      subscriptionUpdatedAt: number;
    } = {
      hasActiveSubscription: args.hasActiveSubscription,
      subscriptionUpdatedAt: Date.now(),
    };

    if (args.subscriptionId !== undefined) {
      patchData.subscriptionId = args.subscriptionId;
    }
    if (args.subscriptionStatus !== undefined) {
      patchData.subscriptionStatus = args.subscriptionStatus;
    }

    await ctx.db.patch(args.userId, patchData);
  },
});

export const updateProfile = mutation({
  args: {
    token: v.string(),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (!session || session.expiresAt < Date.now()) {
      throw new Error("Invalid or expired session");
    }

    const user = await ctx.db.get(session.userId);
    if (!user) throw new Error("User not found");

    if (args.email !== undefined && args.email !== user.email) {
      const emailToCheck = args.email;
    
      const existingUser = await ctx.db
        .query("users")
        .withIndex("by_email", (q) => q.eq("email", emailToCheck))
        .first();
    
      if (existingUser) {
        throw new Error("Email already in use");
      }
    }
    
    const updates: { name?: string; email?: string } = {};
    if (args.name !== undefined) updates.name = args.name;
    if (args.email !== undefined) updates.email = args.email;

    await ctx.db.patch(user._id, updates);

    return { success: true };
  },
});

export const updateGlobalInstructions = mutation({
  args: {
    token: v.string(),
    aiGlobalInstructions: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (!session || session.expiresAt < Date.now()) {
      throw new Error("Invalid or expired session");
    }

    const user = await ctx.db.get(session.userId);
    if (!user) throw new Error("User not found");

    const updates: { aiGlobalInstructions?: string } = {};
    if (args.aiGlobalInstructions !== undefined) {
      updates.aiGlobalInstructions = args.aiGlobalInstructions || undefined;
    }

    await ctx.db.patch(user._id, updates);

    return { success: true };
  },
});
