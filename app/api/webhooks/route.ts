import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  console.log("Webhook received:", JSON.stringify(body, null, 2));
  return NextResponse.json({ received: true });
}
