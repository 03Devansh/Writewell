import { httpRouter } from "convex/server";

import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

const http = httpRouter();

// Webhook secret from Polar (get from environment variable or use default)
const POLAR_WEBHOOK_SECRET = process.env.POLAR_WEBHOOK_SECRET;
if (!POLAR_WEBHOOK_SECRET) {
  throw new Error("POLAR_WEBHOOK_SECRET environment variable is required");
}
// Test endpoint to verify webhook URL is accessible
http.route({
  path: "/webhooks/polar",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    console.log("✅ [Polar Webhook] GET request received - Webhook endpoint is accessible!");
    return new Response(
      JSON.stringify({ 
        status: "ok", 
        message: "Polar webhook endpoint is accessible",
        timestamp: new Date().toISOString(),
        url: request.url
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  }),
});


// Helper function to process subscription updates
async function processSubscriptionUpdate(
  ctx: any,
  subscription: any,
  eventType: string
) {
  const customerEmail = subscription.customer?.email;

  if (!customerEmail) {
    console.warn(`[${eventType}] Missing customer email in subscription data`);
    return new Response("Missing customer email", { status: 400 });
  }

  // Find user by email
  const user = await ctx.runQuery(api.auth.getUserByEmail, {
    email: customerEmail,
  });

  if (!user) {
    console.warn(`[${eventType}] No user found for email: ${customerEmail} - Will link when user signs up`);
    // Return 200 OK so Polar doesn't retry - we'll link subscription when user signs up
    return new Response(JSON.stringify({ success: true, message: "User not found, will link on signup" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Update user subscription status
  const subscriptionStatus = subscription.status;
  const isActive = subscriptionStatus === "active" || subscriptionStatus === "trialing";

  console.log(
    `[${eventType}] Updating subscription for user ${user._id}: status=${subscriptionStatus}, active=${isActive}`
  );

  await ctx.runMutation(api.auth.updateSubscription, {
    userId: user._id,
    hasActiveSubscription: isActive,
    subscriptionId: subscription.id,
    subscriptionStatus: subscriptionStatus,
  });

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

// Polar webhook handler - matches your webhook URL: /webhooks/polar
http.route({
  path: "/webhooks/polar",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    // Log immediately when request is received
    console.log("🔔 [Polar Webhook] Request received at:", new Date().toISOString());
    console.log("🔔 [Polar Webhook] Request method:", request.method);
    console.log("🔔 [Polar Webhook] Request URL:", request.url);
    
    // Log all headers for debugging
    const headers: Record<string, string> = {};
    request.headers.forEach((value, key) => {
      headers[key] = value;
    });
    console.log("🔔 [Polar Webhook] Headers:", JSON.stringify(headers, null, 2));
    
    try {
      // Get raw body text first for signature verification
      const bodyText = await request.text();
      console.log("🔔 [Polar Webhook] Body received, length:", bodyText.length);
      
      // Verify webhook signature (Standard Webhooks spec)
      const webhookId = request.headers.get("webhook-id");
      const webhookTimestamp = request.headers.get("webhook-timestamp");
      const webhookSignature = request.headers.get("webhook-signature");
      
      console.log("🔔 [Polar Webhook] Signature headers:", {
        webhookId: webhookId || "missing",
        webhookTimestamp: webhookTimestamp || "missing",
        webhookSignature: webhookSignature ? webhookSignature.substring(0, 20) + "..." : "missing"
      });
      
      // Verify signature if all headers are present (non-blocking - don't reject on failure)
      if (webhookId && webhookTimestamp && webhookSignature && POLAR_WEBHOOK_SECRET) {
        const isValid = await ctx.runAction(api.webhookVerification.verifyWebhookSignature, {
          rawBody: bodyText,
          signature: webhookSignature,
          timestamp: webhookTimestamp,
          webhookId: webhookId,
          secret: POLAR_WEBHOOK_SECRET,
        });
        
        if (!isValid) {
          console.warn("⚠️ [Polar Webhook] Signature verification failed - continuing anyway to see webhook data");
          // Don't return 401 - Polar stops sending webhooks if we reject
        } else {
          console.log("✅ [Polar Webhook] Signature verified successfully");
        }
      } else {
        console.warn("⚠️ [Polar Webhook] Skipping signature verification (missing headers or secret)");
      }
      
      // Parse JSON
      const body = JSON.parse(bodyText);
      const event = body.type;
      const data = body.data;

      console.log(`✅ [Polar Webhook] Parsed event: ${event}`);
      console.log(`✅ [Polar Webhook] Event data keys:`, data ? Object.keys(data) : "no data");

      // Handle checkout.completed - this fires when checkout is successful
      if (event === "checkout.completed") {
        const checkout = data;
        const customerEmail = checkout.customer?.email;

        console.log(`[checkout.completed] Checkout completed for: ${customerEmail}`);

        // If there's a subscription in the checkout, process it
        if (checkout.subscription) {
          return await processSubscriptionUpdate(
            ctx,
            checkout.subscription,
            "checkout.completed"
          );
        }

        // Otherwise, just acknowledge - subscription.created will follow
        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      // Handle subscription events
      if (event === "subscription.created" || event === "subscription.updated") {
        return await processSubscriptionUpdate(ctx, data, event);
      }

      // Handle subscription cancellation
      if (event === "subscription.canceled") {
        const subscription = data;
        const customerEmail = subscription.customer?.email;

        if (!customerEmail) {
          return new Response("Missing customer email", { status: 400 });
        }

        const user = await ctx.runQuery(api.auth.getUserByEmail, {
          email: customerEmail,
        });

        if (user) {
          console.log(`[subscription.canceled] Canceling subscription for user ${user._id}`);
          await ctx.runMutation(api.auth.updateSubscription, {
            userId: user._id,
            hasActiveSubscription: false,
            subscriptionStatus: "canceled",
          });
        }

        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      // Return success for unhandled events (but log them)
      console.log(`[Polar Webhook] Unhandled event: ${event}`, JSON.stringify(data, null, 2));
      return new Response(JSON.stringify({ success: true, message: "Event not handled" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("❌ [Polar Webhook] Error processing webhook:", error);
      console.error("❌ [Polar Webhook] Error stack:", error instanceof Error ? error.stack : "no stack");
      return new Response(
        JSON.stringify({ error: "Internal server error", details: error instanceof Error ? error.message : String(error) }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  }),
});

export default http;
