# Production Setup Guide - Payment Webhook Configuration

This guide will help you configure the Polar payment webhooks for your production deployment.

## Your Production URLs

Based on your `.env.local` file:
- **Convex Deployment**: `necessary-magpie-326`
- **Convex HTTP Endpoint**: `https://necessary-magpie-326.convex.site`
- **Webhook URL**: `https://necessary-magpie-326.convex.site/webhooks/polar`

## Step 1: Configure Convex Environment Variables

1. Go to [Convex Dashboard](https://dashboard.convex.dev)
2. Select your project: `necessary-magpie-326`
3. Navigate to **Settings** → **Environment Variables**
4. Add the following environment variables:

### Required Variables:

```
POLAR_API_KEY=your_polar_organization_access_token
POLAR_WEBHOOK_SECRET=your_polar_webhook_signing_secret
OPENAI_API_KEY=your_openai_api_key
```

**Where to find these:**
- **POLAR_API_KEY**: Polar Dashboard → Settings → API → Organization Access Token
- **POLAR_WEBHOOK_SECRET**: Polar Dashboard → Settings → Webhooks → (after creating webhook) → Signing Secret
- **OPENAI_API_KEY**: [OpenAI Platform](https://platform.openai.com/api-keys)

## Step 2: Configure Polar Webhook

1. Go to your [Polar Dashboard](https://polar.sh)
2. Navigate to **Settings** → **Webhooks** (or **Integrations** → **Webhooks**)
3. Click **Add Webhook** or edit existing webhook
4. Configure:
   - **Webhook URL**: `https://necessary-magpie-326.convex.site/webhooks/polar`
   - **Events to subscribe**:
     - ✅ `checkout.completed`
     - ✅ `subscription.created`
     - ✅ `subscription.updated`
     - ✅ `subscription.canceled`
5. **Save** the webhook
6. **Copy the Signing Secret** and add it to Convex as `POLAR_WEBHOOK_SECRET` (from Step 1)

## Step 3: Verify Webhook Endpoint

Test that your webhook endpoint is accessible:

1. Open in browser: `https://necessary-magpie-326.convex.site/webhooks/polar`
2. You should see a JSON response:
   ```json
   {
     "status": "ok",
     "message": "Polar webhook endpoint is accessible",
     "timestamp": "...",
     "url": "..."
   }
   ```

If you see this, your endpoint is working! ✅

## Step 4: Test the Payment Flow

1. Create a test account in your app
2. Go through the payment flow
3. Complete a test payment in Polar checkout
4. Check Convex logs (Dashboard → Logs) for:
   - `🔔 [Polar Webhook] Request received`
   - `✅ [Polar Webhook] Parsed event: checkout.completed`
   - `[checkout.completed] Updating subscription for user...`

If you see these logs, the webhook is working! ✅

## Troubleshooting

### Issue: Payment confirmation page keeps loading
**Solution**: 
- Verify `POLAR_WEBHOOK_SECRET` is set in Convex and matches Polar
- Check that webhook URL in Polar is correct
- Check Convex logs for webhook errors

### Issue: Webhook endpoint returns 404
**Solution**: 
- Ensure your Convex deployment is active
- Verify the URL format: `https://YOUR_DEPLOYMENT.convex.site/webhooks/polar`
- Note: Use `.convex.site` for HTTP endpoints, not `.convex.cloud`

### Issue: Webhook signature verification fails
**Solution**: 
- Ensure `POLAR_WEBHOOK_SECRET` in Convex exactly matches the signing secret in Polar
- The secret should be copied directly from Polar dashboard (no extra spaces)

### Issue: User subscription not updating
**Solution**: 
- Verify the email used in Polar checkout matches the email in your app
- Check Convex logs for "No user found for email" warnings
- Ensure webhook events are properly subscribed in Polar

## Quick Checklist

- [ ] `POLAR_API_KEY` added to Convex environment variables
- [ ] `POLAR_WEBHOOK_SECRET` added to Convex environment variables (matches Polar)
- [ ] `OPENAI_API_KEY` added to Convex environment variables
- [ ] Polar webhook URL configured: `https://necessary-magpie-326.convex.site/webhooks/polar`
- [ ] All 4 webhook events subscribed in Polar
- [ ] Webhook endpoint test returns success (GET request)
- [ ] Test payment completes and redirects to dashboard

## Need Help?

- **Convex Docs**: https://docs.convex.dev
- **Polar Docs**: https://docs.polar.sh
- **Check Convex Logs**: Dashboard → Logs (filter by "Polar Webhook")
