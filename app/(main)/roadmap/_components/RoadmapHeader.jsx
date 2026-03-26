import { Button } from "@/components/ui/button";
import { Map, RefreshCw } from "lucide-react";
import RoadmapForm from "./RoadmapForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function RoadmapHeader({ roadmap }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
          Personalized Career Roadmap
        </h1>
        {roadmap && (
          <p className="text-muted-foreground mt-1">
            Path to becoming a <span className="font-semibold text-cyan-500">{roadmap.goal}</span>
          </p>
        )}
      </div>

      {roadmap && (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="border-cyan-500/30 hover:bg-cyan-500/10 gap-2">
              <RefreshCw className="w-4 h-4" />
              Regenerate Roadmap
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Regenerate Career Roadmap</DialogTitle>
              <DialogDescription>
                Update your career goal to generate a new personalized learning path.
              </DialogDescription>
            </DialogHeader>
            <RoadmapForm />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
