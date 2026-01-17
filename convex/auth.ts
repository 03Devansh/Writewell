import { v, ConvexError } from "convex/values";
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

function isValidEmailFormat(email: string): boolean {
  // Basic email format validation: must have @ and a domain with at least one dot
  if (!email || typeof email !== 'string') {
    return false;
  }
  const trimmedEmail = email.trim();
  if (!trimmedEmail) {
    return false;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(trimmedEmail);
}

export const signUp = mutation({
  args: {
    email: v.string(),
    password: v.string(),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    // Validate inputs - these should throw ConvexError directly, not be caught
    if (!args.email || !args.email.trim()) {
      throw new ConvexError("Email is required");
    }
    
    // Validate email format
    if (!isValidEmailFormat(args.email)) {
      throw new ConvexError("Please enter a valid email address");
    }
    
    if (!args.password || args.password.length < 6) {
      throw new ConvexError("Password must be at least 6 characters");
    }
    if (!args.name || !args.name.trim()) {
      throw new ConvexError("Name is required");
    }

    // Only wrap database operations in try-catch
    try {
      const existingUser = await ctx.db
        .query("users")
        .withIndex("by_email", (q) => q.eq("email", args.email.trim().toLowerCase()))
        .first();

      if (existingUser) {
        throw new ConvexError("User with this email already exists");
      }

      const userId = await ctx.db.insert("users", {
        email: args.email.trim().toLowerCase(),
        name: args.name.trim(),
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
    } catch (error) {
      console.error("[signUp] Error:", error);
      // If it's already a ConvexError, re-throw it as-is
      if (error instanceof ConvexError) {
        throw error;
      }
      // If it's a regular Error, wrap it in ConvexError
      if (error instanceof Error) {
        throw new ConvexError(error.message);
      }
      // For any other error type
      throw new ConvexError(`Signup failed: ${String(error)}`);
    }
  },
});

export const signIn = mutation({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    // Validate email format
    if (!args.email || !args.email.trim()) {
      throw new ConvexError("Email is required");
    }
    
    if (!isValidEmailFormat(args.email)) {
      throw new ConvexError("Please enter a valid email address");
    }
    
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email.trim().toLowerCase()))
      .first();

    if (!user || user.passwordHash !== simpleHash(args.password)) {
      throw new ConvexError("Invalid email or password");
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
      throw new ConvexError("Invalid or expired session");
    }

    const user = await ctx.db.get(session.userId);
    if (!user) throw new ConvexError("User not found");

    if (args.email !== undefined && args.email !== user.email) {
      const emailToCheck = args.email.trim().toLowerCase();
      
      // Validate email format
      if (!isValidEmailFormat(emailToCheck)) {
        throw new ConvexError("Please enter a valid email address");
      }
    
      const existingUser = await ctx.db
        .query("users")
        .withIndex("by_email", (q) => q.eq("email", emailToCheck))
        .first();
    
      if (existingUser) {
        throw new ConvexError("Email already in use");
      }
    }
    
    const updates: { name?: string; email?: string } = {};
    if (args.name !== undefined) updates.name = args.name;
    if (args.email !== undefined) updates.email = args.email.trim().toLowerCase();

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
      throw new ConvexError("Invalid or expired session");
    }

    const user = await ctx.db.get(session.userId);
    if (!user) throw new ConvexError("User not found");

    const updates: { aiGlobalInstructions?: string } = {};
    if (args.aiGlobalInstructions !== undefined) {
      updates.aiGlobalInstructions = args.aiGlobalInstructions || undefined;
    }

    await ctx.db.patch(user._id, updates);

    return { success: true };
  },
});
