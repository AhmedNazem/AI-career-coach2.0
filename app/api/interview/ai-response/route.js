import { GoogleGenerativeAI } from "@google/generative-ai";
import { auth } from "@clerk/nextjs/server";

export async function POST(req) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const { transcript, userProfile } = await req.json();

    if (!transcript) {
      return new Response(JSON.stringify({ error: "No transcript provided" }), {
        status: 400,
      });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // Using the exact model name found in the rest of your project (dashboard.js)
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      You are an expert technical interviewer. 
      Candidate Profile:
      - Industry: ${userProfile.industry}
      - Skills: ${userProfile.skills?.join(", ")}
      - Experience: ${userProfile.experience} years
      
      Candidate said: "${transcript}"
      
      Respond as the interviewer. Ask a short, focused follow-up question or the next technical question.
      Keep it brief and conversational (1-2 sentences max).
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const answer = response.text().trim();

    return new Response(JSON.stringify({ answer }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to generate AI response" }),
      { status: 500 },
    );
  }
}
