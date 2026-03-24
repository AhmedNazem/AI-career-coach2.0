"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

export default function StatusCard({ status, lastAiResponse, onReplay }) {
  return (
    <div className="min-h-[100px] flex flex-col items-center justify-center px-6 bg-primary/5 rounded-2xl py-6 border border-primary/10 transition-all w-full">
      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-black mb-3">Interviewer Status</p>
      <div className="space-y-4">
        <p className="text-lg font-bold text-foreground leading-relaxed italic">
          {lastAiResponse || status}
        </p>
        {lastAiResponse && (
          <Button variant="outline" size="sm" onClick={onReplay} className="rounded-full flex gap-2 mx-auto">
            <Play className="size-3 fill-current" />
            Replay AI Voice
          </Button>
        )}
      </div>
    </div>
  );
}
