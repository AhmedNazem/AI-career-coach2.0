"use client";

import Cal, { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function BookCoachPage() {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi();
      cal("ui", {
        theme: "dark",
        styles: { branding: { brandColor: "#000000" } },
        hideEventTypeDetails: false,
        layout: "month_view"
      });
    })();
  }, []);

  return (
    <div className="container mx-auto py-10">
      <Link href="/interview">
        <Button variant="ghost" className="mb-6 gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Interview Center
        </Button>
      </Link>

      <div className="max-w-5xl mx-auto mb-8">
        <h1 className="text-5xl font-bold gradient-title">Book a Coaching Session</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Select an available time slot below to schedule your 1-on-1 mock interview with Ahmed.
        </p>
      </div>

      <Card className="max-w-5xl mx-auto border-primary/20 bg-background overflow-hidden relative min-h-[600px]">
        <Cal 
          calLink="ahmed-nadhim-3nj9d0"
          style={{ width: "100%", height: "100%", overflow: "scroll" }}
          config={{ layout: 'month_view' }}
        />
      </Card>
    </div>
  );
}
