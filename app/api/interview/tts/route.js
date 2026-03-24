export async function POST(req) {
  try {
    const { text } = await req.json();

    if (!process.env.ELEVENLABS_API_KEY) {
      // Fallback for local testing without keys
      return new Response(
        JSON.stringify({ error: "Missing ElevenLabs API Key" }),
        { status: 400 },
      );
    }

    // 1. Fetch available voices to ensure we use one that the user has access to
    const voicesResponse = await fetch("https://api.elevenlabs.io/v1/voices", {
      headers: { "xi-api-key": process.env.ELEVENLABS_API_KEY },
    });
    
    if (!voicesResponse.ok) {
        throw new Error("Failed to fetch voices. Check your API key.");
    }

    const { voices } = await voicesResponse.json();
    if (!voices || voices.length === 0) {
        throw new Error("No voices found in your ElevenLabs account.");
    }

    // Try to find a good one (Rachel or Adam) or just take the first one
    const preferredVoice = voices.find(v => v.name === "Rachel" || v.name === "Adam") || voices[0];
    const voiceId = preferredVoice.voice_id;

    console.log(`Using ElevenLabs Voice: ${preferredVoice.name} (${voiceId})`);

    // 2. Perform TTS
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": process.env.ELEVENLABS_API_KEY,
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_flash_v2_5",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          },
        }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("ElevenLabs Error Details:", errorText);
      throw new Error(
        `ElevenLabs API failure: ${response.status} ${errorText}`,
      );
    }

    const audioBuffer = await response.arrayBuffer();

    return new Response(audioBuffer, {
      headers: { "Content-Type": "audio/mpeg" },
    });
  } catch (error) {
    console.error("TTS Route Error:", error);
    return new Response(JSON.stringify({ error: "TTS Failed" }), {
      status: 500,
    });
  }
}
