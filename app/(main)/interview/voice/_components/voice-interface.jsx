"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap } from "lucide-react";
import VoiceStart from "./voice-start";
import InterviewResult from "./interview-result";
import { useVoiceInterview } from "./use-voice-interview";
import { ActiveInterview } from "./ActiveInterview";

export default function VoiceInterface({ user }) {
  const {
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
    audioRef
  } = useVoiceInterview(user);

  if (showResult && result) {
    return (
      <InterviewResult
        result={result}
        user={user}
        onReset={() => {
          setShowResult(false);
          setConversation([]);
          setTranscript("");
          setLastAiResponse("");
          setStatus("Ready to start your interview");
        }}
      />
    );
  }

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
          <ActiveInterview
            isRecording={isRecording}
            isSpeaking={isSpeaking}
            status={status}
            lastAiResponse={lastAiResponse}
            transcript={transcript}
            handleEndCall={handleEndCall}
            toggleRecording={toggleRecording}
            loading={loading}
            audioRef={audioRef}
          />
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
