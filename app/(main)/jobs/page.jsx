import { Suspense } from "react";
import { getJobs } from "@/actions/jobs";
import { JobCard } from "./_components/job-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Briefcase } from "lucide-react";
import { checkUser } from "@/lib/checkUser";

async function JobResults({ query, location }) {
  if (!query) {
    return (
      <div className="text-center py-20 bg-muted/30 rounded-2xl border-2 border-dashed">
        <div className="max-w-md mx-auto space-y-4">
          <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
            <Search className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-xl font-bold">Find Your Next Opportunity</h3>
          <p className="text-muted-foreground">
            Enter a job title and location above to start searching for
            real-time opportunities tailored to your career.
          </p>
        </div>
      </div>
    );
  }

  const result = await getJobs({ query, location });

  if (!result.success) {
    return (
      <div className="p-8 bg-destructive/5 text-destructive border border-destructive/20 rounded-xl text-center">
        <p className="font-medium">{result.error}</p>
        {result.error.includes("RapidAPI Key") && (
          <p className="text-sm mt-2 opacity-80">
            Please make sure you've added your <code>JSEARCH_API_KEY</code> to{" "}
            <code>.env.local</code>.
          </p>
        )}
      </div>
    );
  }

  const jobs = result.data || [];

  if (jobs.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-xl font-medium">
          No jobs found for "{query}" in {location || "world"}.
        </p>
        <p className="text-muted-foreground mt-2">
          Try adjusting your search terms or location.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {jobs.map((job) => (
        <JobCard key={job.job_id} job={job} />
      ))}
    </div>
  );
}

export default async function JobsPage({ searchParams }) {
  const { q, l } = await searchParams;
  const user = await checkUser();

  const defaultQuery = user?.industry ? `${user.industry} jobs` : "";

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold gradient-title">Job Board</h1>
            <p className="text-muted-foreground text-lg">
              Explore real jobs and get AI-powered match insights.
            </p>
          </div>

          <Button variant="outline" asChild>
            <a href="/tracker" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              My Application Tracker
            </a>
          </Button>
        </div>

        {!process.env.JSEARCH_API_KEY && (
          <div className="bg-amber-50 border-amber-200 border text-amber-800 p-4 rounded-xl flex items-start gap-3">
            <div className="mt-0.5">⚠️</div>
            <div>
              <p className="font-bold">RapidAPI Key Missing</p>
              <p className="text-sm">
                To fetch real-time jobs, please add <code>JSEARCH_API_KEY</code>{" "}
                to your <code>.env.local</code> file. You can get a free key
                from the{" "}
                <a
                  href="https://rapidapi.com/letscrape-6bR4n96eb9u/api/jsearch"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline font-medium"
                >
                  JSearch API on RapidAPI
                </a>
                .
              </p>
            </div>
          </div>
        )}

        {/* Search Bar */}
        <form className="max-w-4xl">
          <div className="flex flex-col md:flex-row gap-4 p-4 bg-card rounded-2xl shadow-sm border border-border">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                name="q"
                placeholder="Job title, keywords, or company"
                defaultValue={q}
                className="pl-10 h-12"
              />
            </div>
            <div className="flex-1 relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                name="l"
                placeholder="City, state, or remote"
                defaultValue={l}
                className="pl-10 h-12"
              />
            </div>
            <Button type="submit" className="h-12 px-8">
              Search Jobs
            </Button>
          </div>
        </form>

        {/* Results Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b pb-4">
            <h2 className="text-2xl font-bold">
              {q ? `Results for "${q}"` : "Featured Opportunities"}
            </h2>
            {q && (
              <p className="text-sm text-muted-foreground">
                Showing jobs in {l || "worldwide"}
              </p>
            )}
          </div>

          <Suspense
            fallback={
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="h-64 bg-muted animate-pulse rounded-xl"
                  />
                ))}
              </div>
            }
          >
            <JobResults query={q || defaultQuery} location={l} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
