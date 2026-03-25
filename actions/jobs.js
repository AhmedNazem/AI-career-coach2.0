"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel(
  { model: "gemini-2.5-flash" },
  { apiVersion: "v1beta" }
);

export async function getJobs({ query, location = "world", page = "1" }) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const JSEARCH_API_KEY = process.env.JSEARCH_API_KEY;

  if (!JSEARCH_API_KEY) {
    return {
      success: false,
      error:
        "RapidAPI Key missing. Please add JSEARCH_API_KEY to your .env.local with JSearch API access.",
    };
  }

  // Detect if it's an OpenWeb Ninja key or RapidAPI key
  const isOpenWebNinja = JSEARCH_API_KEY.startsWith("ak_");

  const url = isOpenWebNinja
    ? `https://api.openwebninja.com/jsearch/search?query=${encodeURIComponent(query)}%20in%20${encodeURIComponent(location)}&page=${page}`
    : `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(query)}%20in%20${encodeURIComponent(location)}&page=${page}`;

  const headers = isOpenWebNinja
    ? { "x-api-key": JSEARCH_API_KEY }
    : {
        "X-RapidAPI-Key": JSEARCH_API_KEY,
        "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
      };

  let retries = 3;
  while (retries > 0) {
    try {
      console.log(`Fetching jobs (Attempt ${4 - retries}): ${query} in ${location}`);
      const response = await fetch(url, {
        method: "GET",
        headers,
        signal: AbortSignal.timeout(10000), // 10s timeout
      });

      if (!response.ok) {
        if (response.status === 403) {
           throw new Error("Access Denied (403). Please check your API key subscription.");
        }
        throw new Error(`API responded with status: ${response.status}`);
      }

      const data = await response.json();
      console.log(`Found ${data.data?.length || 0} jobs`);
      return { success: true, data: data.data };
    } catch (error) {
      console.error(`Attempt ${4 - retries} failed:`, error.message);
      retries--;
      if (retries === 0) {
        return {
          success: false,
          error: `Failed to fetch jobs. ${error.message || "Please check your network or API limits."}`,
        };
      }
      // Brief delay before retry
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
}


export async function saveJobApplication(data) {
  const { userId: clerkId } = await auth();
  if (!clerkId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: clerkId },
  });

  if (!user) throw new Error("User not found");

  try {
    if (!db.jobApplication) {
      console.error("CRITICAL: Prisma model 'jobApplication' NOT FOUND on db object!");
      console.log("Available models:", Object.keys(db).filter(k => !k.startsWith('_')));
      return { success: false, error: "Database sync error. Please try restarting the server once more." };
    }

    const application = await db.jobApplication.create({
      data: {
        userId: user.id,
        jobId: data.jobId,
        title: data.title,
        company: data.company,
        location: data.location,
        status: data.status || "WISHLIST",
        description: data.description,
        url: data.url,
        matchScore: data.matchScore,
      },
    });

    return { success: true, data: application };
  } catch (error) {
    console.error("Save Application Error:", error);
    return { success: false, error: `Save failed: ${error.message}` };
  }
}

export async function getJobApplications() {
  const { userId: clerkId } = await auth();
  if (!clerkId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: clerkId },
  });

  if (!user) throw new Error("User not found");

  try {
    const applications = await db.jobApplication.findMany({
      where: { userId: user.id },
      orderBy: { updatedAt: "desc" },
    });

    return { success: true, data: applications };
  } catch (error) {
    console.error("Fetch Applications Error:", error);
    return { success: false, error: error.message };
  }
}

export async function updateJobApplicationStatus(id, status) {
  const { userId: clerkId } = await auth();
  if (!clerkId) throw new Error("Unauthorized");

  try {
    const application = await db.jobApplication.update({
      where: { id },
      data: {
        status,
        appliedAt: status === "APPLIED" ? new Date() : undefined,
      },
    });

    return { success: true, data: application };
  } catch (error) {
    console.error("Update Status Error:", error);
    return { success: false, error: error.message };
  }
}

export async function getJobMatchScore(jobDescription, manualResume = null, pdfData = null) {
  const { userId: clerkId } = await auth();
  if (!clerkId) throw new Error("Unauthorized");

  let resumePart = null;

  if (pdfData) {
    resumePart = {
      inlineData: {
        data: pdfData.base64,
        mimeType: pdfData.mimeType,
      },
    };
  } else {
    let resumeContent = manualResume;

    if (!resumeContent) {
      const user = await db.user.findUnique({
        where: { clerkUserId: clerkId },
        include: { resume: true },
      });

      if (!user?.resume) {
        return {
          success: false,
          error: "Please upload a resume first or paste your CV text to analyze matches.",
        };
      }
      resumeContent = user.resume.content;
    }
    resumePart = resumeContent;
  }

  try {
    const isPDF = !!pdfData;
    console.log(`Analyzing Match: ${isPDF ? "PDF Mode" : "Text Mode"}`);
    if (!isPDF) console.log("Resume Length:", resumePart?.length || 0);

    const prompt = `
      Analyze the following job description against the provided resume/CV.
      
      Job Description:
      ${jobDescription}
      
      Provide:
      1. A match score (0-100) reflecting how well the candidate's skills and experience align with the requirements.
      2. 3-5 bullet points for strengths (what matches well).
      3. 3-5 bullet points for gaps (what is missing or needs improvement).
      
      Return the response in this JSON format only, no additional text or markdown formatting:
      {
        "score": number,
        "strengths": [string],
        "gaps": [string]
      }
    `;

    const contentParts = [
      { text: prompt },
    ];

    if (typeof resumePart === "string") {
      contentParts.push({ text: `CANDIDATE RESUME/CV:\n${resumePart}` });
    } else {
      contentParts.push(resumePart);
    }

    const result = await model.generateContent(contentParts);
    const response = await result.response;
    const text = response.text();
    console.log("Gemini Raw Response:", text);
    
    // Improved JSON cleaning to handle all types of markdown blocks
    const cleanText = text.replace(/```(?:json)?|```/g, "").trim();

    return { success: true, data: JSON.parse(cleanText) };
  } catch (error) {
    console.error("AI Match Score Error:", error);
    return {
      success: false,
      error: "Failed to analyze job match. Please try again later.",
    };
  }
}

export async function deleteJobApplication(id) {
  const { userId: clerkId } = await auth();
  if (!clerkId) throw new Error("Unauthorized");

  try {
    await db.jobApplication.delete({
      where: { id },
    });

    return { success: true };
  } catch (error) {
    console.error("Delete Application Error:", error);
    return { success: false, error: error.message };
  }
}
