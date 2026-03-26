import { getUserRoadmap } from "@/actions/roadmap";
import RoadmapView from "./_components/RoadmapView";
import RoadmapForm from "./_components/RoadmapForm";
import RoadmapHeader from "./_components/RoadmapHeader";
import { toast } from "sonner";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default async function RoadmapPage() {
  const result = await getUserRoadmap();

  if (!result.success) {
    throw new Error(result.error || "Failed to load roadmap");
  }

  const roadmap = result.data;

  return (
    <div className="container mx-auto py-10 space-y-8 px-4 md:px-6">
      <RoadmapHeader roadmap={roadmap} />
      
      {!roadmap ? (
        <div className="max-w-2xl mx-auto">
          <RoadmapForm />
        </div>
      ) : (
        <Suspense fallback={<Skeleton className="h-[600px] w-full rounded-xl" />}>
          <RoadmapView milestones={roadmap.milestones} />
        </Suspense>
      )}
    </div>
  );
}
