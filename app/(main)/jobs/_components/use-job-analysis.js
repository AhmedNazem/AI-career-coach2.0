"use client";

import { useState } from "react";
import { toast } from "sonner";
import { saveJobApplication, getJobMatchScore } from "@/actions/jobs";

export function useJobAnalysis(job) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [matchData, setMatchData] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [manualResume, setManualResume] = useState("");
  const [uploadingFile, setUploadingFile] = useState(false);

  const handleAnalyze = async (data = null, type = "profile") => {
    setIsAnalyzing(true);
    try {
      let result;
      if (type === "manual") {
        if (!manualResume.trim()) {
          toast.error("Please paste your CV text first");
          setIsAnalyzing(false);
          return;
        }
        result = await getJobMatchScore(job.job_description, manualResume);
      } else if (type === "pdf") {
        result = await getJobMatchScore(job.job_description, null, data);
      } else {
        result = await getJobMatchScore(job.job_description);
      }

      if (result.success) {
        setMatchData(result.data);
        toast.success("Analysis complete!");
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("Failed to analyze job match");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Please upload a PDF file");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("File size must be less than 2MB");
      return;
    }

    setUploadingFile(true);
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result.split(",")[1];
      await handleAnalyze({ base64, mimeType: file.type }, "pdf");
      setUploadingFile(false);
    };
    reader.onerror = () => {
      toast.error("Failed to read file");
      setUploadingFile(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const result = await saveJobApplication({
        jobId: job.job_id,
        title: job.job_title,
        company: job.employer_name,
        location: job.job_city || job.job_country || "Remote",
        description: job.job_description,
        url: job.job_apply_link,
        matchScore: matchData?.score,
      });

      if (result.success) {
        setIsSaved(true);
        toast.success("Job added to tracker!");
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("Failed to save job");
    } finally {
      setIsSaving(false);
    }
  };

  return {
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
  };
}
