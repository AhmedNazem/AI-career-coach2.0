"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Briefcase, FileText, Upload, Loader2 } from "lucide-react";
import { AnalysisResults } from "./analysis-results";

export function JobMatchAnalysis({
  job,
  matchData,
  isAnalyzing,
  uploadingFile,
  handleAnalyze,
  handleFileUpload,
  manualResume,
  setManualResume,
  setMatchData,
}) {
  return (
    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="text-2xl">AI Match Analysis</DialogTitle>
        <DialogDescription>
          Choose a resume source to compare with <b>{job.job_title}</b> at{" "}
          <b>{job.employer_name}</b>
        </DialogDescription>
      </DialogHeader>

      {!matchData && !isAnalyzing && !uploadingFile ? (
        <div className="space-y-6 pt-4">
          <div className="grid grid-cols-1 gap-4">
            <Button
              variant="default"
              className="h-16 text-lg justify-start px-6 gap-4"
              onClick={() => handleAnalyze(null, "profile")}
            >
              <Briefcase className="h-6 w-6" />
              <div className="text-left">
                <div className="font-bold">Use Profile Resume</div>
                <div className="text-xs opacity-80 font-normal">
                  Use the resume saved in your account
                </div>
              </div>
            </Button>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or use a custom CV
                </span>
              </div>
            </div>

            <Tabs defaultValue="upload" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upload" className="flex items-center gap-2">
                  <Upload className="h-4 w-4" /> Upload PDF
                </TabsTrigger>
                <TabsTrigger value="paste" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" /> Paste Text
                </TabsTrigger>
              </TabsList>

              <TabsContent value="upload" className="space-y-4 py-4">
                <div className="border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-4 bg-muted/30">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <Upload className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-sm">Select your PDF resume</p>
                    <p className="text-xs text-muted-foreground">Max 2MB</p>
                  </div>
                  <Input
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    id={`pdf-upload-${job.job_id}`}
                    onChange={handleFileUpload}
                    disabled={uploadingFile}
                  />
                  <Button asChild size="sm" disabled={uploadingFile}>
                    <label
                      htmlFor={`pdf-upload-${job.job_id}`}
                      className="cursor-pointer"
                    >
                      {uploadingFile ? "Processing..." : "Select PDF File"}
                    </label>
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="paste" className="space-y-4 py-4">
                <Textarea
                  placeholder="Paste your professional experience here..."
                  className="min-h-[200px]"
                  value={manualResume}
                  onChange={(e) => setManualResume(e.target.value)}
                />
                <Button
                  onClick={() => handleAnalyze(null, "manual")}
                  className="w-full"
                  disabled={isAnalyzing}
                >
                  Analyze Pasted Text
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      ) : matchData && !isAnalyzing && !uploadingFile ? (
        <AnalysisResults matchData={matchData} setMatchData={setMatchData} />
      ) : (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <div className="text-center">
            <p className="font-bold text-lg">AI is analyzing your match...</p>
            <p className="text-sm text-muted-foreground">
              This may take a few seconds.
            </p>
          </div>
        </div>
      )}
    </DialogContent>
  );
}
