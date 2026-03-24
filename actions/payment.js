"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import Stripe from "stripe";

// Only initialize Stripe if the key is available
const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

export async function createCheckoutSession(type, id) {
  if (!stripe) {
    throw new Error(
      "Stripe is not configured. Please add STRIPE_SECRET_KEY to your .env.local file.",
    );
  }

  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  let line_items = [];
  let metadata = {
    userId: user.id,
    type,
    targetId: id,
  };

  if (type === "SUBSCRIPTION") {
    // In a real app, these IDs would come from your Stripe Dashboard
    // For now, these are placeholders. User must replace them.
    const priceIds = {
      STARTER: "price_1TEInlL3MBb4rYooe1ZHltok",
      PRO: "price_1TEIw1L3MBb4rYoo9gkjSGjq",
    };

    line_items = [
      {
        price: priceIds[id] || "price_pro_id",
        quantity: 1,
      },
    ];
  } else if (type === "TOKENS") {
    // For token packs
    const tokenPrices = {
      1: "price_1TEIx9L3MBb4rYooVktstVTI",
      5: "price_1TEIxrL3MBb4rYooFUuHSDmV",
      15: "price_1TEIyZL3MBb4rYoouulWEezc",
    };

    line_items = [
      {
        price: tokenPrices[id] || "price_1TEIx9L3MBb4rYooVktstVTI",
        quantity: 1,
      },
    ];
  }

  try {
    // Determine mode based on whether the price is recurring or one-time
    // For now we use the type, but we could also fetch the price object from Stripe
    // Use subscription mode if this is a recurring price
    // Since we know the user created these as 'Monthly' for now
    const isSubscription =
      type === "SUBSCRIPTION" || ["1", "5", "15"].includes(id);
    const mode = isSubscription ? "subscription" : "payment";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode,
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing?canceled=true`,
      metadata,
      customer_email: user.email,
    });

    return { url: session.url };
  } catch (error) {
    console.error("Stripe Session Error:", error);
    throw new Error("Failed to create payment session");
  }
}

export async function deductToken() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");
  if (user.tokens < 1) return { success: false, error: "Insufficient tokens" };

  try {
    const updatedUser = await db.user.update({
      where: { id: user.id },
      data: {
        tokens: {
          decrement: 1,
        },
      },
    });

    revalidatePath("/interview");
    revalidatePath("/billing");

    return { success: true, remainingTokens: updatedUser.tokens };
  } catch (error) {
    console.error("Error deducting token:", error.message);
    return { success: false, error: "Failed to start interview" };
  }
}
