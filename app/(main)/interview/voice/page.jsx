import { checkUser } from "@/lib/checkUser";
import Link from "next/link";
import VoiceInterface from "./_components/voice-interface";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default async function VoiceInterviewPage() {
  const user = await checkUser();

  return (
    <div className="container mx-auto py-12 px-4 max-w-5xl">
      <div className="mb-8">
        <Button variant="ghost" asChild className="gap-2">
            <Link href="/interview">
                <ArrowLeft className="size-4" />
                Back to Interviews
            </Link>
        </Button>
      </div>

      <div className="flex flex-col items-center mb-12 text-center space-y-4">
          <h1 className="text-5xl font-black gradient-title">AI Mock Interview</h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
              Experience a real-time, voice-based interview simulation. Practice your responses and get instant AI feedback.
          </p>
      </div>

      <VoiceInterface user={user} />

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 pb-12">
          <div className="bg-card/50 p-6 rounded-2xl border border-primary/10">
              <h4 className="font-bold mb-2">Real-time Voice</h4>
              <p className="text-sm text-muted-foreground">Natural conversation using advanced Speech-to-Text and Text-to-Speech models.</p>
          </div>
          <div className="bg-card/50 p-6 rounded-2xl border border-primary/10">
              <h4 className="font-bold mb-2">Industry Specific</h4>
              <p className="text-sm text-muted-foreground">Questions tailored to your industry, skills, and experience level.</p>
          </div>
          <div className="bg-card/50 p-6 rounded-2xl border border-primary/10">
              <h4 className="font-bold mb-2">Instant Feedback</h4>
              <p className="text-sm text-muted-foreground">Receive a detailed analysis of your performance immediately after the session.</p>
          </div>
      </div>
    </div>
  );
}
