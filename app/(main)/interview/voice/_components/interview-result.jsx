"use client";

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertCircle, Lightbulb, Trophy, ArrowRight, RefreshCw } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export default function InterviewResult({ result, user, onReset }) {
  const { strengths, weaknesses, suggestions, score } = result;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in zoom-in duration-500">
      {/* Header Summary */}
      <Card className="border-primary/20 bg-card/50 backdrop-blur-xl shadow-2xl overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-blue-500 to-purple-600" />
        <CardHeader className="text-center pb-2">
          <Badge className="w-fit mx-auto mb-4 bg-primary/20 text-primary border-primary/20 hover:bg-primary/30">
            Interview Report Complete
          </Badge>
          <CardTitle className="text-4xl font-black gradient-title">Performance Analysis</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center py-8">
          <div className="relative size-48 flex items-center justify-center mb-6">
            <svg className="size-full -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="88"
                fill="transparent"
                stroke="currentColor"
                strokeWidth="12"
                className="text-muted/20"
              />
              <circle
                cx="96"
                cy="96"
                r="88"
                fill="transparent"
                stroke="currentColor"
                strokeWidth="12"
                strokeDasharray={552.92}
                strokeDashoffset={552.92 * (1 - score / 100)}
                strokeLinecap="round"
                className="text-primary transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-5xl font-black">{score}</span>
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Overall Score</span>
            </div>
          </div>
          <p className="text-muted-foreground text-center max-w-md italic">
            "You demonstrated solid domain knowledge. Focusing on the technical details of your architecture will push your score even higher."
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Strengths */}
        <Card className="border-green-500/20 bg-green-500/5 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center gap-2 pb-2">
            <Trophy className="size-5 text-green-500" />
            <CardTitle className="text-lg font-bold text-green-500">Key Strengths</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {strengths.map((s, i) => (
              <div key={i} className="flex gap-2 text-sm">
                <CheckCircle2 className="size-4 text-green-500 shrink-0 mt-0.5" />
                <span>{s}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Weaknesses */}
        <Card className="border-yellow-500/20 bg-yellow-500/5 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center gap-2 pb-2">
            <AlertCircle className="size-5 text-yellow-500" />
            <CardTitle className="text-lg font-bold text-yellow-500">Areas for Growth</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {weaknesses.map((w, i) => (
              <div key={i} className="flex gap-2 text-sm">
                <div className="size-1.5 rounded-full bg-yellow-500 shrink-0 mt-2" />
                <span>{w}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Suggestions */}
        <Card className="border-blue-500/20 bg-blue-500/5 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center gap-2 pb-2">
            <Lightbulb className="size-5 text-blue-500" />
            <CardTitle className="text-lg font-bold text-blue-500">AI Suggestions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {suggestions.map((s, i) => (
              <div key={i} className="flex gap-2 text-sm">
                <ArrowRight className="size-4 text-blue-500 shrink-0 mt-0.5" />
                <span>{s}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center gap-4 py-8">
        <Button onClick={onReset} variant="outline" className="gap-2 h-12 px-8 font-bold rounded-full group">
          <RefreshCw className="size-4 group-hover:rotate-180 transition-transform duration-500" />
          Retake Interview
        </Button>
        <Button asChild className="gap-2 h-12 px-8 font-bold rounded-full shadow-lg shadow-primary/20">
          <a href="/dashboard">
            Go to Dashboard
            <ArrowRight className="size-4" />
          </a>
        </Button>
      </div>
    </div>
  );
}
