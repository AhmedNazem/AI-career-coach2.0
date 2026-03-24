"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Mic, Play, Loader2 } from "lucide-react";

export default function VoiceStart({ loading, tokens, onStart }) {
  return (
    <div className="text-center space-y-6">
      <div className="size-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto animate-pulse">
        <Mic className="size-10 text-primary" />
      </div>
      <p className="text-muted-foreground max-w-sm mx-auto font-medium">
        Ready to start your professional interview simulation? 
      </p>
      <Button 
        onClick={onStart} 
        disabled={loading || tokens < 1} 
        size="lg" 
        className="rounded-full px-12 h-14 text-lg font-bold shadow-xl flex items-center justify-center gap-2 w-full max-w-sm mx-auto"
      >
        {loading ? <Loader2 className="animate-spin" /> : <Play className="size-5 fill-current" />}
        {loading ? "Preparing AI..." : "Begin Professional Session"}
      </Button>
    </div>
  );
}
