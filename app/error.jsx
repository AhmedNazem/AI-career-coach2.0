"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global Error Caught:", error);
  }, [error]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-background px-4 text-center">
      <div className="flex max-w-md flex-col items-center space-y-6">
        <div className="rounded-full bg-destructive/10 p-6">
          <AlertCircle className="h-12 w-12 text-destructive" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl text-foreground">
            Something went wrong
          </h1>
          <p className="text-muted-foreground">
            We apologize, but an unexpected error occurred. This could be due to a temporary network issue or a problem on our end.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row w-full sm:justify-center">
          <Button 
            className="w-full sm:w-auto" 
            onClick={() => reset()}
            variant="default"
          >
            Try again
          </Button>
          <Button 
            className="w-full sm:w-auto" 
            variant="outline" 
            asChild
          >
            <Link href="/">
              Return Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
