/* eslint-disable */
/**
 * Generated API (stub for development)
 * These will be replaced when running `npx convex dev`
 */

import { makeFunctionReference } from "convex/server";

export const api = {
  auth: {
    signIn: makeFunctionReference("auth:signIn"),
    signUp: makeFunctionReference("auth:signUp"),
    signOut: makeFunctionReference("auth:signOut"),
    validateSession: makeFunctionReference("auth:validateSession"),
    getCurrentUser: makeFunctionReference("auth:getCurrentUser"),
  },
  documents: {
    create: makeFunctionReference("documents:create"),
    list: makeFunctionReference("documents:list"),
    get: makeFunctionReference("documents:get"),
    update: makeFunctionReference("documents:update"),
    remove: makeFunctionReference("documents:remove"),
  },
  knowledge: {
    add: makeFunctionReference("knowledge:add"),
    list: makeFunctionReference("knowledge:list"),
    remove: makeFunctionReference("knowledge:remove"),
    update: makeFunctionReference("knowledge:update"),
  },
  ai: {
    chat: makeFunctionReference("ai:chat"),
    generateText: makeFunctionReference("ai:generateText"),
  },
};
