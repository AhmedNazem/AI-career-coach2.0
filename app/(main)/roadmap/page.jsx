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
    return (
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent mb-8">
          Personalized Career Roadmap
        </h1>
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg">
          {result.error}
        </div>
      </div>
    );
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
