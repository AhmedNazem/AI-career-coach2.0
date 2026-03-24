import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { db } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  const body = await req.text();
  const signature = (await headers()).get("Stripe-Signature");

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  const session = event.data.object;

  if (event.type === "checkout.session.completed") {
    const { userId, type, targetId } = session.metadata;

    if (type === "SUBSCRIPTION") {
      let tokensToAdd = 0;
      if (targetId === "STARTER") tokensToAdd = 5;
      if (targetId === "PRO") tokensToAdd = 15;

      await db.user.update({
        where: { id: userId },
        data: {
          subscription: targetId,
          tokens: { increment: tokensToAdd },
          stripeCustomerId: session.customer,
        },
      });
    } else if (type === "TOKENS") {
      await db.user.update({
        where: { id: userId },
        data: {
          tokens: { increment: parseInt(targetId) },
        },
      });
    }
  }

  return new NextResponse(null, { status: 200 });
}
