import { NextResponse } from "next/server";

export async function GET() {
  const base = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

  let webhookStatus: "ok" | "unreachable" = "unreachable";
  try {
    const res = await fetch(`${base}/api/webhooks`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-github-event": "ping" },
      body: JSON.stringify({ zen: "heartbeat probe" }),
    });
    webhookStatus = res.ok ? "ok" : "unreachable";
  } catch {
    webhookStatus = "unreachable";
  }

  const payload = {
    status: webhookStatus === "ok" ? "ok" : "degraded",
    timestamp: new Date().toISOString(),
    checks: { webhookEndpoint: webhookStatus },
  };

  console.log("[heartbeat]", JSON.stringify(payload));
  return NextResponse.json(payload);
}
