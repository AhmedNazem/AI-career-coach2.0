"use client";

import { useJobAnalysis } from "./use-job-analysis";
import { JobMatchAnalysis } from "./job-match-analysis";
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
import { Progress } from "@/components/ui/progress";
import {
  MapPin,
  Briefcase,
  ExternalLink,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

export function JobCard({ job }) {
  const {
    isAnalyzing,
    matchData,
    isSaving,
    isSaved,
    manualResume,
    setManualResume,
    uploadingFile,
    handleAnalyze,
    handleFileUpload,
    handleSave,
    setMatchData,
  } = useJobAnalysis(job);

  return (
    <Card className="hover:shadow-lg transition-shadow flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1">
            <CardTitle className="text-xl line-clamp-1">
              {job.job_title}
            </CardTitle>
            <CardDescription className="flex items-center gap-1 mt-1 font-medium">
              <Briefcase className="h-4 w-4" /> {job.employer_name}
            </CardDescription>
          </div>
          {job.employer_logo && (
            <img
              src={job.employer_logo}
              alt={job.employer_name}
              className="h-10 w-10 object-contain rounded bg-white p-1 border"
            />
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="secondary" className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />{" "}
            {job.job_city || job.job_country || "Remote"}
          </Badge>
          <Badge variant="outline">{job.job_employment_type}</Badge>
        </div>

        {matchData && (
          <div className="space-y-2 mb-4 p-3 bg-primary/5 rounded-lg border border-primary/10">
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium">AI Match Score</span>
              <span className="font-bold text-primary">{matchData.score}%</span>
            </div>
            <Progress value={matchData.score} className="h-2" />
          </div>
        )}

        <p className="text-sm text-muted-foreground line-clamp-3">
          {job.job_description}
        </p>
      </CardContent>
      <CardFooter className="flex flex-col gap-3 pt-4 border-t">
        <div className="flex w-full gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="flex-1"
                disabled={isAnalyzing || uploadingFile}
              >
                {isAnalyzing || uploadingFile ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : matchData ? (
                  "View Analysis"
                ) : (
                  "AI Match Score"
                )}
              </Button>
            </DialogTrigger>

            <JobMatchAnalysis
              job={job}
              matchData={matchData}
              isAnalyzing={isAnalyzing}
              uploadingFile={uploadingFile}
              handleAnalyze={handleAnalyze}
              handleFileUpload={handleFileUpload}
              manualResume={manualResume}
              setManualResume={setManualResume}
              setMatchData={setMatchData}
            />
          </Dialog>

          <Button
            variant={isSaved ? "secondary" : "default"}
            className="flex-1"
            onClick={handleSave}
            disabled={isSaving || isSaved}
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : isSaved ? (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Tracked
              </>
            ) : (
              "Track Job"
            )}
          </Button>
        </div>

        <Button
          asChild
          variant="ghost"
          className="w-full text-primary hover:text-primary hover:bg-primary/5"
        >
          <a
            href={job.job_apply_link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2"
          >
            Apply on Company Site <ExternalLink className="h-4 w-4" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}
