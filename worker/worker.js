// Cloudflare Worker: notifies the cafe owner on Telegram when a customer orders.
// The Telegram bot token is read from env.TELEGRAM_BOT_TOKEN, set as a Cloudflare
// "Secret" in the dashboard — it never appears in this file or in the website code.

const ALLOWED_ORIGINS = new Set([
  "https://mrpouyah.github.io",
  "http://localhost:3000"
]);

function corsHeaders(origin) {
  return {
    "Access-Control-Allow-Origin": ALLOWED_ORIGINS.has(origin) ? origin : "https://mrpouyah.github.io",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const headers = corsHeaders(origin);

    if (request.method === "OPTIONS") {
      return new Response(null, { headers });
    }

    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405, headers });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return new Response("Invalid JSON", { status: 400, headers });
    }

    const name = String(body.name || "").trim().slice(0, 80);
    const drink = String(body.drink || "").trim().slice(0, 120);

    if (!name || !drink) {
      return new Response("Missing name or drink", { status: 400, headers });
    }

    const text = `☕ سفارش جدید\n\nمشتری: ${name}\nنوشیدنی: ${drink}`;

    const tgResponse = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: env.TELEGRAM_CHAT_ID, text })
    });

    if (!tgResponse.ok) {
      return new Response("Failed to notify", { status: 502, headers });
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...headers, "Content-Type": "application/json" }
    });
  }
};
