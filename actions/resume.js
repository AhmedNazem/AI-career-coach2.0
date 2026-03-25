"use server";
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { revalidatePath } from "next/cache";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

export async function saveResume(content) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized: No user ID found");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });
    if (!user) throw new Error("User not found in the database");

    const resume = await db.resume.upsert({
      where: { userId: user.id },
      update: { content },
      create: { userId: user.id, content },
    });

    revalidatePath("/resume");
    return { success: true, data: resume };
  } catch (error) {
    console.error("Error saving resume:", error);
    return { success: false, error: error.message };
  }
}

export async function getResume() {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: {
        clerkUserId: userId,
      },
    });
    if (!user) throw new Error("User not found");

    const resume = await db.resume.findUnique({
      where: {
        userId: user.id,
      },
    });

    return { success: true, data: resume };
  } catch (error) {
    console.error("Error fetching resume:", error);
    return { success: false, error: error.message };
  }
}

export async function improveWithAI({ current, type }) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: {
      clerkUserId: userId,
    },
  });
  if (!user) throw new Error("User not found");

  const prompt = `
  As an expert resume writer, improve the following ${type} description for a ${user.industry} professional.
  Make it more impactful, quantifiable, and aligned with industry standards.
  Current content: "${current}"

  Requirements:
  1. Use action verbs
  2. Include metrics and results where possible
  3. Highlight relevant technical skills
  4. Keep it concise but detailed
  5. Focus on achievements over responsibilities
  6. Use industry-specific keywords
  
  Format the response as a single paragraph without any additional text or explanations.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const improvedContent = response.text().trim();
    return { success: true, data: improvedContent };
  } catch (error) {
    console.error("Error improving the content:", error.message);
    return { success: false, error: "Failed to improve content" };
  }
}
