"use node";

import { v } from "convex/values";
import { action } from "./_generated/server";
import { api } from "./_generated/api";

// Type definitions for Polar API responses
interface PolarSubscription {
  customer?: {
    id: string;
  };
}

interface PolarSessionResponse {
  customer_portal_url?: string;
}

/**
 * Get the Polar customer portal URL for the authenticated user.
 * Uses customerSessions.create for pre-authenticated portal access.
 * This action identifies the user, fetches their subscription info,
 * and creates a customer session link from Polar.
 */
export const getCustomerPortalUrl = action({
  args: {
    token: v.string(),
  },
  handler: async (ctx, args): Promise<{ url: string | null; error?: string }> => {
    try {
      // Get the current user from the token
      const user: {
        _id: string;
        email: string;
        name: string;
        createdAt: number;
        hasActiveSubscription: boolean;
        subscriptionId?: string;
        subscriptionStatus?: string;
        aiGlobalInstructions?: string;
      } | null = await ctx.runQuery(api.auth.getCurrentUser, {
        token: args.token,
      });

      if (!user) {
        return { url: null, error: "User not found or session expired" };
      }

      // If user doesn't have a subscription, return null
      if (!user.subscriptionId) {
        return { url: null, error: "No active subscription found" };
      }

      // Get Polar API key from environment
      const POLAR_API_KEY: string | undefined = process.env.POLAR_API_KEY;
      if (!POLAR_API_KEY) {
        console.error("POLAR_API_KEY is not set");
        return { url: null, error: "Polar API key is not configured. Please contact support." };
      }

      // Polar API base URL
      const POLAR_API_BASE: string = process.env.POLAR_API_BASE || "https://api.polar.sh";

      // Log API key presence (but not the actual key for security)
      console.log(`[Polar] API key present: ${POLAR_API_KEY ? 'Yes' : 'No'}, length: ${POLAR_API_KEY?.length || 0}`);
      console.log(`[Polar] API base URL: ${POLAR_API_BASE}`);
      console.log(`[Polar] Fetching subscription ${user.subscriptionId} for user ${user.email}`);

      // First, get the subscription to find the customer ID
      const subscriptionUrl = `${POLAR_API_BASE}/api/v1/subscriptions/${user.subscriptionId}`;
      console.log(`[Polar] Request URL: ${subscriptionUrl}`);
      
      const subscriptionResponse: Response = await fetch(
        subscriptionUrl,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${POLAR_API_KEY}`,
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
        }
      );

      if (!subscriptionResponse.ok) {
        const errorText: string = await subscriptionResponse.text();
        console.error(`[Polar] Failed to fetch subscription ${user.subscriptionId}:`, {
          status: subscriptionResponse.status,
          statusText: subscriptionResponse.statusText,
          error: errorText,
          url: subscriptionUrl,
        });
        
        if (subscriptionResponse.status === 401) {
          // 401 means authentication failed - API key is likely invalid or wrong format
          return { 
            url: null, 
            error: "Authentication failed. Please verify that POLAR_API_KEY is set correctly in your Convex environment variables. The API key should be your Polar Organization Access Token." 
          };
        }
        
        if (subscriptionResponse.status === 404) {
          return { url: null, error: "Subscription not found. Please contact support." };
        }
        
        return { 
          url: null, 
          error: `Failed to fetch subscription: ${subscriptionResponse.status}. ${errorText || 'Please try again later.'}` 
        };
      }

      const subscription: PolarSubscription = await subscriptionResponse.json();
      console.log(`[Polar] Subscription data:`, JSON.stringify(subscription, null, 2));
      
      const customerId: string | undefined = subscription.customer?.id;

      if (!customerId) {
        console.error(`[Polar] Customer ID not found in subscription:`, JSON.stringify(subscription, null, 2));
        return { url: null, error: "Customer information not found. Please contact support." };
      }

      console.log(`[Polar] Creating customer session for customer ${customerId}`);

      // Create a customer session using the correct endpoint (RECOMMENDED APPROACH)
      const sessionResponse: Response = await fetch(
        `${POLAR_API_BASE}/api/v1/customer-sessions`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${POLAR_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customer_id: customerId,
            // Optional: Add return_url to redirect back to your app after portal
            // return_url: "https://yourapp.com/profile",
          }),
        }
      );

      if (!sessionResponse.ok) {
        const errorText: string = await sessionResponse.text();
        console.error(`[Polar] Failed to create customer session:`, {
          status: sessionResponse.status,
          statusText: sessionResponse.statusText,
          error: errorText,
        });
        
        return { 
          url: null, 
          error: `Failed to create customer portal session: ${sessionResponse.status}. Please try again later.` 
        };
      }

      const sessionData: PolarSessionResponse = await sessionResponse.json();
      console.log(`[Polar] Session response:`, JSON.stringify(sessionData, null, 2));
      
      // The response uses 'customer_portal_url' field
      const portalUrl: string | undefined = sessionData.customer_portal_url;

      if (!portalUrl) {
        console.error("[Polar] Portal URL not found in session response:", JSON.stringify(sessionData, null, 2));
        return { url: null, error: "Portal URL not returned from Polar API. Please contact support." };
      }

      console.log(`[Polar] Successfully generated portal URL for user ${user.email}`);
      return { url: portalUrl };
    } catch (error) {
      console.error("[Polar] Unexpected error getting customer portal URL:", error);
      return { 
        url: null, 
        error: error instanceof Error 
          ? `An error occurred: ${error.message}` 
          : "An unexpected error occurred. Please try again later." 
      };
    }
  },
});
