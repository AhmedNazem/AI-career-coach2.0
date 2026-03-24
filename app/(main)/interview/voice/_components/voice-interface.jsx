"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic, MicOff, Play, Square, Loader2, Zap, PhoneOff } from "lucide-react";
import { deductToken } from "@/actions/payment";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import AudioVisualizer from "./audio-visualizer";
import StatusCard from "./status-card";
import VoiceStart from "./voice-start";

export default function VoiceInterface({ user }) {
  const [isStarted, setIsStarted] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("Ready to start your interview");
  const [transcript, setTranscript] = useState("");
  const [lastAiResponse, setLastAiResponse] = useState("");
  
  const router = useRouter();
  const recognitionRef = useRef(null);
  const audioRef = useRef(null);

  const handleEndCall = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      URL.revokeObjectURL(audioRef.current.src);
    }
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    
    setIsStarted(false);
    setIsRecording(false);
    setIsSpeaking(false);
    setTranscript("");
    setLastAiResponse("");
    setStatus("Interview session ended.");
    toast.success("Interview finished!");
  };

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.lang = "en-US";
      recognitionRef.current.onresult = (event) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
        processResponse(text);
      };
      recognitionRef.current.onerror = (e) => {
        setIsRecording(false);
        if (e.error !== "no-speech") toast.error("Speech error: " + e.error);
        setStatus("Ready for next answer. Click to speak.");
      };
      recognitionRef.current.onend = () => setIsRecording(false);
    }
  }, []);

  const handleStart = async () => {
    setLoading(true);
    try {
      const greeting = `Hello! I'm your AI career coach. Let's start the interview. Can you tell me about your background and your current role as a ${user?.industry || "professional"}?`;
      const ttsResponse = await fetch("/api/interview/tts", { method: "POST", body: JSON.stringify({ text: greeting }) });
      if (!ttsResponse.ok) throw new Error("Failed to initialize AI voice.");

      const result = await deductToken();
      if (result.success) {
        setIsStarted(true);
        setStatus("Interviewer is speaking...");
        toast.success("Interview started! 1 token deducted.");
        const audioBlob = await ttsResponse.blob();
        playAudio(URL.createObjectURL(audioBlob));
      } else {
        toast.error(result.error);
        if (result.error === "Insufficient tokens") router.push("/billing");
      }
    } catch (error) { toast.error(error.message); } finally { setLoading(false); }
  };

  const playAudio = async (url) => {
    if (audioRef.current) { audioRef.current.pause(); URL.revokeObjectURL(audioRef.current.src); }
    audioRef.current = new Audio(url);
    setIsSpeaking(true);
    try { await audioRef.current.play(); } catch (e) { toast.info("Audio auto-blocked. Click Replay."); }
    audioRef.current.onended = () => { setIsSpeaking(false); setStatus("Ready for next answer. Click to speak."); };
  };

  const processResponse = async (text) => {
    setLoading(true); setStatus("AI is thinking...");
    try {
      const response = await fetch("/api/interview/ai-response", {
        method: "POST",
        body: JSON.stringify({ transcript: text, userProfile: { industry: user?.industry, skills: user?.skills, experience: user?.experience } }),
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setLastAiResponse(data.answer); setStatus("AI is speaking...");
      const tts = await fetch("/api/interview/tts", { method: "POST", body: JSON.stringify({ text: data.answer }) });
      if (tts.ok) playAudio(URL.createObjectURL(await tts.blob()));
    } catch (e) { toast.error("AI Error: " + e.message); setStatus("Error processing voice."); } finally { setLoading(false); }
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
          <VoiceStart loading={loading} tokens={user?.tokens} onStart={handleStart} />
        ) : (
          <div className="w-full space-y-8 flex flex-col items-center text-center">
            <AudioVisualizer isActive={isRecording || isSpeaking} />
            <StatusCard status={status} lastAiResponse={lastAiResponse} onReplay={() => audioRef.current?.play()} />
            {transcript && (
                <div className="bg-muted/30 p-4 rounded-xl text-left border border-border/50 animate-in slide-in-from-bottom-2 duration-500 w-full max-w-md">
                    <p className="text-[10px] font-black uppercase text-muted-foreground mb-1 tracking-tighter">You said:</p>
                    <p className="text-sm text-foreground italic">"{transcript}"</p>
                </div>
            )}
            <div className="flex justify-center items-center gap-12 w-full">
                 <button 
                   onClick={handleEndCall}
                   className="size-20 rounded-full bg-red-600/10 hover:bg-red-600/20 border-2 border-red-600/20 flex items-center justify-center transition-all group shrink-0"
                   title="End Call"
                 >
                    <PhoneOff className="size-8 text-red-600 group-hover:scale-110 transition-transform" />
                 </button>

                 <button onClick={() => {
                   if (isRecording) {
                     recognitionRef.current.stop();
                   } else {
                     setTranscript("");
                     recognitionRef.current.start();
                     setIsRecording(true);
                   }
                 }}
                    disabled={loading} className={`size-24 rounded-full shadow-2xl transition-all flex items-center justify-center cursor-pointer select-none ring-offset-4 ring-offset-background shrink-0 ${isRecording ? "bg-red-500 ring-4 ring-red-500/20 scale-110" : "bg-primary hover:bg-primary/90 shadow-primary/20 hover:scale-105"} ${loading ? "opacity-50 cursor-not-allowed" : ""}`}>
                    {isRecording ? <MicOff className="size-10 text-white" /> : <Mic className="size-10 text-white" />}
                 </button>

                 <div className="size-20 opacity-0 pointer-events-none hidden md:block" /> {/* Symmetry spacer */}
            </div>
            <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">{isRecording ? "Recording..." : "Click microphone to answer"}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="justify-center border-t py-6 bg-muted/20">
        <p className="text-[10px] text-muted-foreground uppercase tracking-[0.3em] font-black opacity-40">Powered by Browser STT + Gemini 1.5 + ElevenLabs</p>
      </CardFooter>
    </Card>
  );
}
