import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const create = mutation({
  args: {
    token: v.string(),
    title: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Validate session
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (!session || session.expiresAt < Date.now()) {
      throw new Error("Unauthorized");
    }

    const now = Date.now();
    const documentId = await ctx.db.insert("documents", {
      userId: session.userId,
      title: args.title || "Untitled Document",
      content: "",
      createdAt: now,
      updatedAt: now,
    });

    return documentId;
  },
});

export const list = query({
  args: {
    token: v.string(),
  },
  handler: async (ctx, args) => {
    // Validate session
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (!session || session.expiresAt < Date.now()) {
      return [];
    }

    const documents = await ctx.db
      .query("documents")
      .withIndex("by_user", (q) => q.eq("userId", session.userId))
      .order("desc")
      .collect();

    return documents;
  },
});

export const get = query({
  args: {
    token: v.string(),
    documentId: v.id("documents"),
  },
  handler: async (ctx, args) => {
    // Validate session
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (!session || session.expiresAt < Date.now()) {
      return null;
    }

    const document = await ctx.db.get(args.documentId);
    
    if (!document || document.userId !== session.userId) {
      return null;
    }

    return document;
  },
});

export const update = mutation({
  args: {
    token: v.string(),
    documentId: v.id("documents"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Validate session
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (!session || session.expiresAt < Date.now()) {
      throw new Error("Unauthorized");
    }

    const document = await ctx.db.get(args.documentId);
    
    if (!document || document.userId !== session.userId) {
      throw new Error("Document not found");
    }

    const updates: { title?: string; content?: string; updatedAt: number } = {
      updatedAt: Date.now(),
    };

    if (args.title !== undefined) {
      updates.title = args.title;
    }

    if (args.content !== undefined) {
      updates.content = args.content;
    }

    await ctx.db.patch(args.documentId, updates);

    return { success: true };
  },
});

export const remove = mutation({
  args: {
    token: v.string(),
    documentId: v.id("documents"),
  },
  handler: async (ctx, args) => {
    // Validate session
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (!session || session.expiresAt < Date.now()) {
      throw new Error("Unauthorized");
    }

    const document = await ctx.db.get(args.documentId);
    
    if (!document || document.userId !== session.userId) {
      throw new Error("Document not found");
    }

    // Delete associated knowledge
    const knowledge = await ctx.db
      .query("knowledge")
      .withIndex("by_document", (q) => q.eq("documentId", args.documentId))
      .collect();

    for (const k of knowledge) {
      await ctx.db.delete(k._id);
    }

    // Delete document
    await ctx.db.delete(args.documentId);

    return { success: true };
  },
});
