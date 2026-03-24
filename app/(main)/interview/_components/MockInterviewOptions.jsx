import React from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bot, CalendarDays, Zap } from "lucide-react";

const MockInterviewOptions = ({ user }) => {
  const hasTokens = user?.tokens > 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
      {/* AI Interview Option */}
      <Card className="border-primary/20 bg-primary/5 hover:border-primary/40 transition-colors">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Bot className="h-6 w-6 text-primary" />
                AI Voice Interview
              </CardTitle>
              <CardDescription className="mt-2 text-base">
                Real-time conversational voice interview with our advanced AI.
              </CardDescription>
            </div>
            <Badge
              variant="secondary"
              className="bg-primary/10 text-primary hover:bg-primary/20"
            >
              <Zap className="h-3 w-3 mr-1" />
              Premium
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground mb-6">
            <li className="flex items-center gap-2">
              ✓ 15-minute live voice session
            </li>
            <li className="flex items-center gap-2">
              ✓ Instant actionable feedback
            </li>
            <li className="flex items-center gap-2">
              ✓ Cost: 1 Interview Token
            </li>
            {!hasTokens && (
              <li className="text-destructive font-bold flex items-center gap-2">
                ⚠️ Zero tokens remaining
              </li>
            )}
          </ul>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full gap-2"
            disabled={!hasTokens}
            asChild={hasTokens}
          >
            {hasTokens ? (
              <Link href="/interview/voice">
                <Zap className="h-4 w-4" />
                Start AI Interview (1 Token)
              </Link>
            ) : (
              <Link href="/billing">Get More Tokens</Link>
            )}
          </Button>
        </CardFooter>
      </Card>

      {/* Human Coach Option */}
      <Card className="border-blue-500/20 bg-blue-500/5 hover:border-blue-500/40 transition-colors">
        <CardHeader>
          <div>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <CalendarDays className="h-6 w-6 text-blue-500" />
              Human Coach
            </CardTitle>
            <CardDescription className="mt-2 text-base">
              Schedule a 1-on-1 mock interview with an expert human coach.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground mb-6">
            <li className="flex items-center gap-2">
              ✓ 30-minute Google Meet link
            </li>
            <li className="flex items-center gap-2">
              ✓ Personalized industry advice
            </li>
            <li className="flex items-center gap-2">
              ✓ Subject to coach availability
            </li>
          </ul>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full" asChild>
            <Link
              href="/interview/book"
              className="flex items-center justify-center gap-2"
            >
              <CalendarDays className="h-4 w-4" />
              Book a Session
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default MockInterviewOptions;
