"use node";

import { v } from "convex/values";
import { action } from "./_generated/server";

/**
 * Verify webhook signature using Node.js crypto (Standard Webhooks spec)
 * This action runs in Node.js runtime to access crypto APIs
 */
export const verifyWebhookSignature = action({
  args: {
    rawBody: v.string(),
    signature: v.string(),
    timestamp: v.string(),
    webhookId: v.string(),
    secret: v.string(),
  },
  handler: async (ctx, args) => {
    const crypto = require("crypto");
    const signedContent = `${args.webhookId}.${args.timestamp}.${args.rawBody}`;
    
    // Try both raw secret and base64-encoded secret
    const secretsToTry = [
      args.secret, // Raw secret
      Buffer.from(args.secret, "utf8").toString("base64"), // Base64-encoded secret
    ];
    
    for (const secretToTry of secretsToTry) {
      try {
        const expectedSignature = crypto
          .createHmac("sha256", secretToTry)
          .update(signedContent)
          .digest("base64");
        
        if (crypto.timingSafeEqual(
          Buffer.from(args.signature),
          Buffer.from(expectedSignature)
        )) {
          return true;
        }
      } catch (error) {
        // Continue to next secret
      }
    }
    
    return false;
  },
});
