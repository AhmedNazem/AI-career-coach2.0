"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { deductToken } from "@/actions/payment";
import { saveVoiceInterviewResult } from "@/actions/interview";

export function useVoiceInterview(user) {
  const [isStarted, setIsStarted] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("Ready to start your interview");
  const [transcript, setTranscript] = useState("");
  const [lastAiResponse, setLastAiResponse] = useState("");
  const [conversation, setConversation] = useState([]);
  const [result, setResult] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const router = useRouter();
  const recognitionRef = useRef(null);
  const audioRef = useRef(null);

  const playAudio = useCallback(async (url) => {
    if (audioRef.current) { audioRef.current.pause(); URL.revokeObjectURL(audioRef.current.src); }
    audioRef.current = new Audio(url);
    setIsSpeaking(true);
    try { await audioRef.current.play(); } catch (e) { toast.info("Audio auto-blocked. Click Replay."); }
    audioRef.current.onended = () => { setIsSpeaking(false); setStatus("Ready for next answer. Click to speak."); };
  }, []);

  const processResponse = useCallback(async (text) => {
    setLoading(true);
    setStatus("AI is thinking...");
    setConversation(prev => [...prev, { role: "user", content: text }]);

    try {
      const response = await fetch("/api/interview/ai-response", {
        method: "POST",
        body: JSON.stringify({ transcript: text, userProfile: { industry: user?.industry, skills: user?.skills, experience: user?.experience } }),
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setLastAiResponse(data.answer);
      setStatus("AI is speaking...");
      setConversation(prev => [...prev, { role: "ai", content: data.answer }]);

      const tts = await fetch("/api/interview/tts", { method: "POST", body: JSON.stringify({ text: data.answer }) });
      if (tts.ok) playAudio(URL.createObjectURL(await tts.blob()));
    } catch (e) { toast.error("AI Error: " + e.message); setStatus("Error processing voice."); } finally { setLoading(false); }
  }, [user, playAudio]);

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
        setConversation([{ role: "ai", content: greeting }]);
        toast.success("Interview started! 1 token deducted.");
        const audioBlob = await ttsResponse.blob();
        playAudio(URL.createObjectURL(audioBlob));
      } else {
        toast.error(result.error);
        if (result.error === "Insufficient tokens") router.push("/billing");
      }
    } catch (error) { toast.error(error.message); } finally { setLoading(false); }
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
  }, [processResponse]);

  const handleEndCall = () => {
    if (audioRef.current) { audioRef.current.pause(); URL.revokeObjectURL(audioRef.current.src); }
    if (recognitionRef.current) recognitionRef.current.stop();

    setIsStarted(false);
    setIsRecording(false);
    setIsSpeaking(false);
    setStatus("Analyzing your interview...");
    evaluateInterview();
  };

  const evaluateInterview = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/interview/evaluate", {
        method: "POST",
        body: JSON.stringify({
          messages: conversation,
          userProfile: { industry: user?.industry, skills: user?.skills, experience: user?.experience }
        }),
      });
      const evalData = await response.json();
      if (evalData.error) throw new Error(evalData.error);

      const cleanData = {
        transcript: conversation || [],
        strengths: evalData.strengths || [],
        weaknesses: evalData.weaknesses || [],
        suggestions: evalData.suggestions || [],
        score: Number(evalData.score) || 0,
      };

      const saveResult = await saveVoiceInterviewResult(cleanData);
      if (saveResult.success) {
        setResult(evalData);
        setShowResult(true);
        toast.success("Analysis complete! Review your results below.");
      } else {
        throw new Error(saveResult.error);
      }
    } catch (e) {
      toast.error("Evaluation failed: " + e.message);
      setStatus("Error generating report.");
    } finally {
      setLoading(false);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      setTranscript("");
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  return {
    isStarted,
    isRecording,
    isSpeaking,
    loading,
    status,
    transcript,
    lastAiResponse,
    conversation,
    result,
    showResult,
    setShowResult,
    setConversation,
    setTranscript,
    setLastAiResponse,
    setStatus,
    handleStart,
    handleEndCall,
    toggleRecording,
    audioRef,
  };
}
