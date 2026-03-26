import { getResume } from "@/actions/resume";
import React from "react";
import ResumeBuilder from "./_components/ResumeBuilder";

const ResumePage = async () => {
  const result = await getResume();
  if (!result.success) throw new Error(result.error || "Failed to load resume");
  const resume = result.data;
  return (
    <div className="container mx-auto py-6">
      <ResumeBuilder initialContent={resume?.content} />
    </div>
  );
};

export default ResumePage;
