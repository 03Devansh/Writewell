import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

const http = httpRouter();

// Polar webhook handler
http.route({
  path: "/polar-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const body = await request.json();
      const event = body.type;
      const data = body.data;

      // Handle subscription events
      if (event === "subscription.created" || event === "subscription.updated") {
        const subscription = data;
        const customerEmail = subscription.customer?.email;

        if (!customerEmail) {
          return new Response("Missing customer email", { status: 400 });
        }

        // Find user by email
        const user = await ctx.runQuery(api.auth.getUserByEmail, {
          email: customerEmail,
        });

        if (!user) {
          console.warn(`No user found for email: ${customerEmail}`);
          return new Response("User not found", { status: 404 });
        }

        // Update user subscription status
        const subscriptionStatus = subscription.status;
        const isActive = subscriptionStatus === "active" || subscriptionStatus === "trialing";

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
      console.log(`Unhandled Polar event: ${event}`);
      return new Response(JSON.stringify({ success: true, message: "Event not handled" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Error processing Polar webhook:", error);
      return new Response(
        JSON.stringify({ error: "Internal server error" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  }),
});

export default http;
