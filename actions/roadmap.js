"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel(
  { model: "gemini-2.5-flash" },
  { apiVersion: "v1beta" }
);

export async function generateRoadmapStack(goal) {
  const { userId: clerkId } = await auth();
  if (!clerkId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: clerkId },
    include: {
        industryInsight: true
    }
  });

  if (!user) throw new Error("User not found");

  try {
    const prompt = `
      Generate a detailed 6-month career roadmap for a user whose goal is to become a "${goal}".
      
      User's Current Profile:
      - Industry: ${user.industry}
      - Current Skills: ${user.skills.join(", ")}
      - Experience: ${user.experience} years
      
      Industry Context:
      - Top Skills in Industry: ${user.industryInsight?.topSkills.join(", ")}
      
      Requirement:
      - Create a sequence of 8-12 milestones.
      - Each milestone must have a unique ID, title, description, and list of learning resource links (YouTube, MDN, official docs).
      - Include dependencies (prerequisites) using the milestone IDs to create a logical learning path.
      - The roadmap should be realistic and tailored to their current skill level.
      - Return ONLY a JSON object in the following format:
      {
        "milestones": [
          {
            "id": "1",
            "title": "Milestone Title",
            "description": "What to learn and why",
            "resources": ["https://link1", "https://link2"],
            "prerequisites": []
          },
          {
            "id": "2",
            "title": "Next Milestone",
            "description": "...",
            "resources": ["..."],
            "prerequisites": ["1"]
          }
        ]
      }
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const cleanText = text.replace(/```(?:json)?\n?/g, "").trim();
    const roadmapData = JSON.parse(cleanText);

    const roadmap = await db.roadmap.upsert({
      where: { userId: user.id },
      update: {
        goal,
        milestones: roadmapData.milestones,
      },
      create: {
        userId: user.id,
        goal,
        milestones: roadmapData.milestones,
      },
    });

    return { success: true, data: roadmap };
  } catch (error) {
    console.error("Error generating roadmap:", error);
    return { success: false, error: "Failed to generate roadmap. Please try again." };
  }
}

export async function getUserRoadmap() {
  const { userId: clerkId } = await auth();
  if (!clerkId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: clerkId },
  });

  if (!user) throw new Error("User not found");

  try {
    const roadmap = await db.roadmap.findUnique({
      where: { userId: user.id },
    });

    return { success: true, data: roadmap };
  } catch (error) {
    console.error("Error fetching roadmap:", error);
    return { success: false, error: "Failed to fetch roadmap" };
  }
}
