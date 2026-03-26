"use client";

import { useTransition } from "react";
import { generateRoadmapStack } from "@/actions/roadmap";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Map } from "lucide-react";

export default function RoadmapForm() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleGenerate = async (formData) => {
    const goal = formData.get("goal");
    if (!goal) return;

    startTransition(async () => {
      try {
        const result = await generateRoadmapStack(goal);
        if (result.success) {
          toast.success("Roadmap generated successfully!");
          router.refresh();
        } else {
          toast.error(result.error);
        }
      } catch (error) {
        toast.error("An unexpected error occurred.");
      }
    });
  };

  return (
    <Card className="border-cyan-500/20 bg-background/50 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Map className="w-6 h-6 text-cyan-500" />
          Where do you want to go?
        </CardTitle>
        <CardDescription>
          Enter your dream job or career goal, and our AI will build a personalized path for you.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={handleGenerate} className="flex flex-col gap-4">
          <Input
            name="goal"
            placeholder="e.g., Senior Fullstack Developer (Next.js & Prisma)"
            className="flex-1 bg-background/50 border-cyan-500/30 focus-visible:ring-cyan-500/50"
            disabled={isPending}
            required
          />
          <Button 
            type="submit" 
            className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:opacity-90 transition-opacity"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Carving your path...
              </>
            ) : (
              "Generate My Roadmap"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
