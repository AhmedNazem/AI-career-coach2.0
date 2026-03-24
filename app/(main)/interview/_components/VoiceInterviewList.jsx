"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { ChevronRight, MessageSquare, Star, TrendingUp } from "lucide-react";
import Link from "next/link";

import { useState } from "react";
import InterviewResult from "../voice/_components/interview-result";

export default function VoiceInterviewList({ interviews }) {
  const [selectedInterview, setSelectedInterview] = useState(null);

  if (selectedInterview) {
    return (
      <div className="fixed inset-0 z-50 bg-background overflow-y-auto p-4 md:p-8 animate-in fade-in duration-300">
        <div className="max-w-5xl mx-auto relative pt-12">
           <button 
             onClick={() => setSelectedInterview(null)}
             className="absolute top-4 right-0 p-2 text-muted-foreground hover:text-foreground font-black text-sm flex items-center gap-2"
           >
             Close Report ✕
           </button>
           <InterviewResult result={selectedInterview} onReset={() => setSelectedInterview(null)} />
        </div>
      </div>
    );
  }

  if (!interviews || interviews.length === 0) {
    return (
      <Card className="border-dashed border-2 py-8 text-center text-muted-foreground">
        <p>No voice interviews completed yet. Start your first session to see results!</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <MessageSquare className="size-5 text-primary" />
        <h3 className="text-xl font-bold">Recent Voice Interviews</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {interviews.map((interview) => (
          <Card key={interview.id} className="hover:border-primary/30 transition-all group relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <CardTitle className="text-lg">Voice Session</CardTitle>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(interview.createdAt), { addSuffix: true })}
                  </p>
                </div>
                <Badge variant="secondary" className="flex gap-1 font-bold">
                  <TrendingUp className="size-3" />
                  {interview.score}%
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                {interview.strengths.slice(0, 2).map((s, i) => (
                  <Badge key={i} variant="outline" className="text-[10px] bg-green-500/5 text-green-600 border-green-500/20">
                    {s}
                  </Badge>
                ))}
              </div>
              <button 
                onClick={() => setSelectedInterview(interview)}
                className="w-full text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 py-2 bg-muted rounded-lg group-hover:bg-primary group-hover:text-white transition-all"
              >
                View Deep Report
                <ChevronRight className="size-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
