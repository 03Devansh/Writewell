import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    email: v.string(),
    name: v.string(),
    passwordHash: v.string(),
    createdAt: v.number(),
    hasActiveSubscription: v.optional(v.boolean()),
    subscriptionId: v.optional(v.string()),
    subscriptionStatus: v.optional(v.string()),
    subscriptionUpdatedAt: v.optional(v.number()),
    aiGlobalInstructions: v.optional(v.string()),
  }).index("by_email", ["email"]),

  documents: defineTable({
    userId: v.id("users"),
    title: v.string(),
    content: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
    aiInstructions: v.optional(v.string()),
  }).index("by_user", ["userId"]),

  knowledge: defineTable({
    documentId: v.id("documents"),
    title: v.string(),
    content: v.string(),
    createdAt: v.number(),
  }).index("by_document", ["documentId"]),

  sessions: defineTable({
    userId: v.id("users"),
    token: v.string(),
    expiresAt: v.number(),
    createdAt: v.number(),
  }).index("by_token", ["token"]),
});
