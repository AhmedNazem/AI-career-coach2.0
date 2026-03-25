import { getJobApplications } from "@/actions/jobs";
import { TrackerBoard } from "./_components/tracker-board";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import Link from "next/link";

export default async function TrackerPage() {
  const result = await getJobApplications();
  const applications = result.success ? result.data : [];

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold gradient-title">Application Tracker</h1>
            <p className="text-muted-foreground text-lg">
              Manage and track your job applications in one place.
            </p>
          </div>
          
          <Button asChild>
            <Link href="/jobs" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Find More Jobs
            </Link>
          </Button>
        </div>

        {applications.length === 0 ? (
          <div className="text-center py-20 bg-muted/30 rounded-2xl border-2 border-dashed">
            <div className="max-w-md mx-auto space-y-4">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                <Plus className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold">No Applications Yet</h3>
              <p className="text-muted-foreground">
                You haven't tracked any jobs yet. Start by exploring the job board and clicking "Track Job."
              </p>
              <Button asChild>
                <Link href="/jobs">Browse Job Board</Link>
              </Button>
            </div>
          </div>
        ) : (
          <TrackerBoard initialApplications={applications} />
        )}
      </div>
    </div>
  );
}
