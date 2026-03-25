"use client";

import { Mic, MicOff, PhoneOff } from "lucide-react";
import AudioVisualizer from "./audio-visualizer";
import StatusCard from "./status-card";

export function ActiveInterview({
  isRecording,
  isSpeaking,
  status,
  lastAiResponse,
  transcript,
  handleEndCall,
  toggleRecording,
  loading,
  audioRef
}) {
  return (
    <div className="w-full space-y-8 flex flex-col items-center text-center">
      <AudioVisualizer isActive={isRecording || isSpeaking} />
      <StatusCard 
        status={status} 
        lastAiResponse={lastAiResponse} 
        onReplay={() => audioRef.current?.play()} 
      />
      
      {transcript && (
        <div className="bg-muted/30 p-4 rounded-xl text-left border border-border/50 animate-in slide-in-from-bottom-2 duration-500 w-full max-w-md">
          <p className="text-[10px] font-black uppercase text-muted-foreground mb-1 tracking-tighter">You said:</p>
          <p className="text-sm text-foreground italic">"{transcript}"</p>
        </div>
      )}
      
      <div className="flex justify-center items-center gap-12 w-full max-w-sm mx-auto">
        <button 
          onClick={handleEndCall}
          className="size-16 rounded-full bg-red-600/10 hover:bg-red-600/20 border-2 border-red-600/20 flex items-center justify-center transition-all group shrink-0"
          title="End Call"
        >
          <PhoneOff className="size-6 text-red-600 group-hover:scale-110 transition-transform" />
        </button>

        <button 
          onClick={toggleRecording}
          disabled={loading} 
          className={`size-24 rounded-full shadow-2xl transition-all flex items-center justify-center cursor-pointer select-none ring-offset-4 ring-offset-background shrink-0 ${
            isRecording ? "bg-red-500 ring-4 ring-red-500/20 scale-110" : "bg-primary hover:bg-primary/90 shadow-primary/20 hover:scale-105"
          } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {isRecording ? <MicOff className="size-10 text-white" /> : <Mic className="size-10 text-white" />}
        </button>
      </div>
      <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">
        {isRecording ? "Recording..." : "Click microphone to answer"}
      </p>
    </div>
  );
}
