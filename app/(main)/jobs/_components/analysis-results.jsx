"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle2, ChevronRight } from "lucide-react";

export function AnalysisResults({ matchData, setMatchData }) {
  return (
    <div className="space-y-6 pt-4">
      <div className="flex items-center gap-6 p-4 bg-primary/5 rounded-xl border border-primary/10">
        <div className="relative h-24 w-24 flex items-center justify-center">
          <svg className="h-24 w-24 transform -rotate-90">
            <circle
              cx="48"
              cy="48"
              r="42"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-secondary"
            />
            <circle
              cx="48"
              cy="48"
              r="42"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={2 * Math.PI * 42}
              strokeDashoffset={2 * Math.PI * 42 * (1 - matchData.score / 100)}
              className="text-primary transition-all duration-1000"
            />
          </svg>
          <span className="absolute text-2xl font-bold">{matchData.score}%</span>
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h4 className="font-bold text-xl">Job Match Rating</h4>
            <Button
              variant="outline"
              size="sm"
              className="text-xs h-7"
              onClick={() => setMatchData(null)}
            >
              Try different CV
            </Button>
          </div>
          <p className="text-muted-foreground">
            This score reflects how well your experience aligns with the job
            requirements.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <h4 className="font-bold flex items-center gap-2 text-green-600 bg-green-50 p-2 rounded-lg">
            <CheckCircle2 className="h-5 w-5" /> Key Strengths
          </h4>
          <ul className="text-sm space-y-2">
            {matchData.strengths.map((s, i) => (
              <li key={i} className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-green-500 flex-shrink-0" />
                {s}
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-3">
          <h4 className="font-bold flex items-center gap-2 text-amber-600 bg-amber-50 p-2 rounded-lg">
            <ChevronRight className="h-5 w-5" /> Potential Gaps
          </h4>
          <ul className="text-sm space-y-2">
            {matchData.gaps.map((g, i) => (
              <li key={i} className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                {g}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
