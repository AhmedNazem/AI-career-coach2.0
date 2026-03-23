"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { generateAiInsights } from "./dashboard";
import { checkUser } from "@/lib/checkUser";

export async function updateUser(data) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });
  if (!user) throw new Error("User not found");

  try {
    // 1. Check if the industry insight exists
    let industryInsight = await db.industryInsight.findUnique({
      where: { industry: data.industry },
    });

    // 2. If it doesn't exist, generate insights outside the transaction
    if (!industryInsight) {
      const insights = await generateAiInsights(data.industry);
      industryInsight = insights; // Just a placeholder for the next step data
    }

    const result = await db.$transaction(
      async (tx) => {
        // Find if the industry exists (re-check inside tx to handle concurrent creation)
        let currentInsight = await tx.industryInsight.findUnique({
          where: { industry: data.industry },
        });

        // If industry still doesn't exist, create it
        if (!currentInsight && industryInsight) {
          currentInsight = await tx.industryInsight.create({
            data: {
              industry: data.industry,
              ...industryInsight,
              nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
          });
        }

        // Update the user
        const updatedUser = await tx.user.update({
          where: { id: user.id },
          data: {
            industry: data.industry,
            experience: data.experience,
            bio: data.bio,
            skills: data.skills,
          },
        });

        return { updatedUser, industryInsight: currentInsight };
      },
      { timeout: 15000 }, // Extended timeout for safety
    );

    return { success: true, ...result };
  } catch (error) {
    console.error("Error updating user and industry:", error.message);
    throw new Error("Failed to update profile");
  }
}

export async function getUserOnboardingStatus() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  let user = await db.user.findUnique({
    where: { clerkUserId: userId },
    select: { industry: true },
  });

  if (!user) {
    user = await checkUser();
  }

  if (!user) throw new Error("User not found");

  return { isOnboarded: !!user.industry };
}
