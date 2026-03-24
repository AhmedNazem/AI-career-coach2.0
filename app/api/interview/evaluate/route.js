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

    const { messages, userProfile } = await req.json();

    if (!messages || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: "No conversation history provided" }),
        { status: 400 },
      );
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Format the conversation for the prompt
    const conversationText = messages
      .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
      .join("\n");

    const prompt = `
      You are an expert technical interviewer and career coach.
      Analyze the following interview conversation for a ${userProfile.industry} role.
      Candidate Profile: Skills: ${userProfile.skills?.join(", ")}, Experience: ${userProfile.experience} years.

      CONVERSATION:
      ${conversationText}

      Based on this conversation, provide a professional evaluation.
      Return the response in this JSON format ONLY:
      {
        "strengths": ["3-4 specific strengths based on their answers"],
        "weaknesses": ["2-3 areas for improvement"],
        "suggestions": ["3-4 actionable steps to improve for a real interview"],
        "score": 0-100
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();

    // Clean up potential markdown formatting in Gemini's response
    const cleanJson = text.replace(/```(?:json)?\n?/g, "").trim();
    const evaluation = JSON.parse(cleanJson);
    
    // Ensure score is a number
    if (evaluation.score) {
      evaluation.score = Number(evaluation.score);
    }

    return new Response(JSON.stringify(evaluation), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to evaluate interview" }),
      { status: 500 },
    );
  }
}
