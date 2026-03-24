"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic, MicOff, Play, Square, Loader2, Zap } from "lucide-react";
import { deductToken } from "@/actions/payment";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function VoiceInterface({ user }) {
  const [isStarted, setIsStarted] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("Ready to start your interview");
  const [transcript, setTranscript] = useState("");
  
  const router = useRouter();
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onresult = (event) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
        processResponse(text);
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech Recognition Error:", event.error);
        setIsRecording(false);
        if (event.error !== "no-speech") {
            toast.error("Speech recognition error: " + event.error);
        }
        setStatus("Ready for next answer. Click to speak.");
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    }
  }, []);

  const handleStart = async () => {
    setLoading(true);
    try {
      const greeting = "Hello! I'm your AI career coach. Let's start the interview. Can you tell me about your background and your current role as a " + (user?.industry || "professional") + "?";
      
      const ttsResponse = await fetch("/api/interview/tts", {
        method: "POST",
        body: JSON.stringify({ text: greeting }),
      });

      if (!ttsResponse.ok) {
        const errorData = await ttsResponse.json();
        throw new Error(errorData.error || "Failed to initialize AI voice.");
      }

      const result = await deductToken();
      if (result.success) {
        setIsStarted(true);
        setStatus("Interviewer is speaking...");
        toast.success("Interview started! 1 token deducted.");
        
        const audioBlob = await ttsResponse.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        await audio.play();
        
        audio.onended = () => {
          setStatus("Click to speak...");
        };
      } else {
        toast.error(result.error);
        if (result.error === "Insufficient tokens") router.push("/billing");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const startRecording = () => {
    if (!recognitionRef.current) {
      toast.error("Speech recognition not supported in this browser.");
      return;
    }
    try {
      setTranscript("");
      recognitionRef.current.start();
      setIsRecording(true);
      setStatus("Listening...");
    } catch (err) {
      console.error(err);
    }
  };

  const processResponse = async (text) => {
    setLoading(true);
    setStatus("AI is thinking...");
    try {
      const response = await fetch("/api/interview/ai-response", {
        method: "POST",
        body: JSON.stringify({ 
          transcript: text,
          userProfile: {
            industry: user?.industry,
            skills: user?.skills,
            experience: user?.experience
          }
        }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      await speak(data.answer);
    } catch (error) {
      toast.error("AI Error: " + error.message);
      setStatus("Error processing voice.");
    } finally {
      setLoading(false);
    }
  };

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastAiResponse, setLastAiResponse] = useState("");
  const audioRef = useRef(null);

  const speak = async (text) => {
    if (!text) return;
    setLastAiResponse(text);
    setStatus("AI is speaking...");
    setIsSpeaking(true);
    
    try {
      const response = await fetch("/api/interview/tts", {
        method: "POST",
        body: JSON.stringify({ text }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Voice generation failed.");
      }
      
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      if (audioRef.current) {
        audioRef.current.pause();
        URL.revokeObjectURL(audioRef.current.src);
      }
      
      audioRef.current = new Audio(audioUrl);
      
      // Attempt to play
      try {
        await audioRef.current.play();
      } catch (playError) {
        console.error("Autoplay blocked:", playError);
        toast.info("Audio was blocked. Please click 'Replay Voice'.");
      }
      
      audioRef.current.onended = () => {
        setIsSpeaking(false);
        setStatus("Ready for next answer. Click to speak.");
      };
    } catch (error) {
      console.error(error);
      setIsSpeaking(false);
      setStatus("Voice generation failed. You can still read the AI's transcription below.");
      toast.error(error.message);
    }
  };

  const replayVoice = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      setIsSpeaking(true);
      setStatus("AI is speaking...");
    } else if (lastAiResponse) {
      speak(lastAiResponse);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto border-primary/20 bg-card/50 backdrop-blur-xl shadow-2xl relative overflow-hidden">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-black gradient-title">Smart AI Interviewer</CardTitle>
        <div className="flex justify-center items-center gap-2 text-sm text-muted-foreground mt-2">
            <Zap className="size-4 text-primary" />
            <span>Tokens: {user?.tokens || 0}</span>
        </div>
      </CardHeader>
      
      <CardContent className="flex flex-col items-center py-12">
        {!isStarted ? (
          <div className="text-center space-y-6">
            <div className="size-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto animate-pulse">
                <Mic className="size-10 text-primary" />
            </div>
            <p className="text-muted-foreground max-w-sm mx-auto font-medium">
              Ready to start your professional interview simulation? 
            </p>
            <Button onClick={handleStart} disabled={loading || user?.tokens < 1} size="lg" className="rounded-full px-12 h-14 text-lg font-bold shadow-xl flex gap-2">
              {loading ? <Loader2 className="animate-spin" /> : <Play className="size-5 fill-current" />}
              {loading ? "Preparing AI..." : "Begin Professional Session"}
            </Button>
          </div>
        ) : (
          <div className="w-full space-y-8 text-center">
            {/* Visualizer */}
            <div className={`flex items-center justify-center gap-1.5 h-24 ${(isRecording || isSpeaking) ? "opacity-100" : "opacity-30"}`}>
                {[...Array(24)].map((_, i) => (
                    <div key={i} className={`w-1.5 bg-primary rounded-full transition-all duration-300 ${(isRecording || isSpeaking) ? "animate-bounce" : "h-2"}`}
                        style={{ height: (isRecording || isSpeaking) ? `${30 + Math.random() * 70}%` : '8px', animationDelay: `${i * 0.05}s` }}
                    />
                ))}
            </div>
            
            <div className="min-h-[100px] flex flex-col items-center justify-center px-6 bg-primary/5 rounded-2xl py-6 border border-primary/10 transition-all">
                 <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-black mb-3">Interviewer Status</p>
                 <div className="space-y-4">
                    <p className="text-lg font-bold text-foreground leading-relaxed italic">
                        {lastAiResponse || status}
                    </p>
                    {lastAiResponse && (
                        <Button variant="outline" size="sm" onClick={replayVoice} className="rounded-full flex gap-2 mx-auto">
                            <Play className="size-3 fill-current" />
                            Replay AI Voice
                        </Button>
                    )}
                 </div>
            </div>

            {transcript && (
                <div className="bg-muted/30 p-4 rounded-xl text-left border border-border/50 animate-in slide-in-from-bottom-2 duration-500">
                    <p className="text-[10px] font-black uppercase text-muted-foreground mb-1 tracking-tighter">You said:</p>
                    <p className="text-sm text-foreground italic">"{transcript}"</p>
                </div>
            )}

            <div className="flex justify-center gap-8">
                 <button 
                    onClick={isRecording ? () => recognitionRef.current.stop() : startRecording}
                    disabled={loading}
                    className={`size-24 rounded-full shadow-2xl transition-all flex items-center justify-center cursor-pointer select-none ring-offset-4 ring-offset-background ${
                        isRecording ? "bg-red-500 ring-4 ring-red-500/20 scale-110" : "bg-primary hover:bg-primary/90 shadow-primary/20 hover:scale-105"
                    } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                 >
                    {isRecording ? <MicOff className="size-10 text-white" /> : <Mic className="size-10 text-white" />}
                 </button>
            </div>
            <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">
                {isRecording ? "Recording... Click to finish" : "Click microphone to answer"}
            </p>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="justify-center border-t py-6 bg-muted/20">
        <p className="text-[10px] text-muted-foreground uppercase tracking-[0.3em] font-black opacity-40">
            Powered by Browser STT + Gemini 1.5 + ElevenLabs
        </p>
      </CardFooter>
    </Card>
  );
}
