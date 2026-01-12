import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const add = mutation({
  args: {
    token: v.string(),
    documentId: v.id("documents"),
    title: v.string(),
    content: v.string(),
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

    // Verify document belongs to user
    const document = await ctx.db.get(args.documentId);
    if (!document || document.userId !== session.userId) {
      throw new Error("Document not found");
    }

    const knowledgeId = await ctx.db.insert("knowledge", {
      documentId: args.documentId,
      title: args.title,
      content: args.content,
      createdAt: Date.now(),
    });

    return knowledgeId;
  },
});

export const list = query({
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
      return [];
    }

    // Verify document belongs to user
    const document = await ctx.db.get(args.documentId);
    if (!document || document.userId !== session.userId) {
      return [];
    }

    const knowledge = await ctx.db
      .query("knowledge")
      .withIndex("by_document", (q) => q.eq("documentId", args.documentId))
      .order("desc")
      .collect();

    return knowledge;
  },
});

export const remove = mutation({
  args: {
    token: v.string(),
    knowledgeId: v.id("knowledge"),
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

    const knowledge = await ctx.db.get(args.knowledgeId);
    if (!knowledge) {
      throw new Error("Knowledge not found");
    }

    // Verify document belongs to user
    const document = await ctx.db.get(knowledge.documentId);
    if (!document || document.userId !== session.userId) {
      throw new Error("Unauthorized");
    }

    await ctx.db.delete(args.knowledgeId);

    return { success: true };
  },
});

export const update = mutation({
  args: {
    token: v.string(),
    knowledgeId: v.id("knowledge"),
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

    const knowledge = await ctx.db.get(args.knowledgeId);
    if (!knowledge) {
      throw new Error("Knowledge not found");
    }

    // Verify document belongs to user
    const document = await ctx.db.get(knowledge.documentId);
    if (!document || document.userId !== session.userId) {
      throw new Error("Unauthorized");
    }

    const updates: { title?: string; content?: string } = {};
    if (args.title !== undefined) updates.title = args.title;
    if (args.content !== undefined) updates.content = args.content;

    await ctx.db.patch(args.knowledgeId, updates);

    return { success: true };
  },
});
