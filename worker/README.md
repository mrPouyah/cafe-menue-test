# Order notification worker

Sends a Telegram message to the cafe owner whenever a customer places an order
on the menu site. Deployed separately from the Next.js site, on Cloudflare
Workers (free tier).

## Deploy (Cloudflare dashboard, no CLI needed)

1. Go to https://dash.cloudflare.com → **Workers & Pages** → **Create** → **Create Worker**.
2. Give it a name (e.g. `cafe-order-notify`) → **Deploy** (deploys a placeholder first).
3. Click **Edit code**, delete the placeholder, paste the contents of `worker.js` → **Deploy**.
4. Go to the Worker's **Settings → Variables and Secrets** → **Add** two secrets:
   - Name: `TELEGRAM_BOT_TOKEN` — the token from @BotFather
   - Name: `TELEGRAM_CHAT_ID` — your personal Telegram chat ID (get it from @userinfobot)
   - Save each (they will never be shown again — that's expected).
5. Copy the Worker's URL shown at the top of the dashboard
   (looks like `https://cafe-order-notify.<your-subdomain>.workers.dev`).

## Wire it into the site

In the GitHub repo: **Settings → Secrets and variables → Actions → Variables tab**
→ **New repository variable**:
- Name: `ORDER_WEBHOOK_URL`
- Value: the Worker URL from step 5 above

Push to `main` (or re-run the Pages workflow) — the site will rebuild with the
webhook URL baked in and start sending real order notifications.
