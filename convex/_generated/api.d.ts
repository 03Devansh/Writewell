/* eslint-disable */
/**
 * Generated API types (stub for development)
 * These will be replaced when running `npx convex dev`
 */

import type { Id } from "./dataModel";

type FunctionReference<T extends "query" | "mutation" | "action", _Args, _Returns> = {
  _type: T;
};

export declare const api: {
  auth: {
    signIn: FunctionReference<"mutation", { email: string; password: string }, { userId: Id<"users">; token: string }>;
    signUp: FunctionReference<"mutation", { email: string; password: string; name: string }, { userId: Id<"users">; token: string }>;
    signOut: FunctionReference<"mutation", { token: string }, { success: boolean }>;
    validateSession: FunctionReference<"query", { token: string }, { userId: Id<"users">; email: string; name: string } | null>;
    getCurrentUser: FunctionReference<"query", { token: string }, { _id: Id<"users">; email: string; name: string; createdAt: number } | null>;
  };
  documents: {
    create: FunctionReference<"mutation", { token: string; title?: string }, Id<"documents">>;
    list: FunctionReference<"query", { token: string }, Array<{ _id: Id<"documents">; userId: Id<"users">; title: string; content: string; createdAt: number; updatedAt: number }>>;
    get: FunctionReference<"query", { token: string; documentId: Id<"documents"> }, { _id: Id<"documents">; userId: Id<"users">; title: string; content: string; createdAt: number; updatedAt: number } | null>;
    update: FunctionReference<"mutation", { token: string; documentId: Id<"documents">; title?: string; content?: string }, { success: boolean }>;
    remove: FunctionReference<"mutation", { token: string; documentId: Id<"documents"> }, { success: boolean }>;
  };
  knowledge: {
    add: FunctionReference<"mutation", { token: string; documentId: Id<"documents">; title: string; content: string }, Id<"knowledge">>;
    list: FunctionReference<"query", { token: string; documentId: Id<"documents"> }, Array<{ _id: Id<"knowledge">; documentId: Id<"documents">; title: string; content: string; createdAt: number }>>;
    remove: FunctionReference<"mutation", { token: string; knowledgeId: Id<"knowledge"> }, { success: boolean }>;
    update: FunctionReference<"mutation", { token: string; knowledgeId: Id<"knowledge">; title?: string; content?: string }, { success: boolean }>;
  };
  ai: {
    chat: FunctionReference<"action", { message: string; documentContent: string; knowledgeContext: Array<{ title: string; content: string }>; chatHistory: Array<{ role: "user" | "assistant"; content: string }> }, { content: string; success: boolean }>;
    generateText: FunctionReference<"action", { prompt: string; documentContent: string; knowledgeContext: Array<{ title: string; content: string }>; insertionPoint?: string }, { content: string; success: boolean; error?: string }>;
  };
};
