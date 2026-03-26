import { getAssessments } from "@/actions/interview";
import React from "react";
import StatsCards from "./_components/StatsCards";
import PerformanceChart from "./_components/PerformanceChart";
import QuizList from "./_components/QuizList";
import MockInterviewOptions from "./_components/MockInterviewOptions";
import VoiceInterviewList from "./_components/VoiceInterviewList";
import { checkUser } from "@/lib/checkUser";
import { getVoiceInterviews } from "@/actions/interview";

const Interview = async () => {
  const assessmentsResult = await getAssessments();
  if (!assessmentsResult.success) throw new Error(assessmentsResult.error || "Failed to load assessments");
  const assessments = assessmentsResult.data || [];

  const voiceInterviewsResult = await getVoiceInterviews();
  if (!voiceInterviewsResult.success) throw new Error(voiceInterviewsResult.error || "Failed to load voice interviews");
  const voiceInterviews = voiceInterviewsResult.data || [];
  const user = await checkUser();

  return (
    <div>
      <h1 className="text-6xl font-bold gradient-title mb-5">
        Interview Preparation
      </h1>
      
      <MockInterviewOptions user={user} />

      <div className="space-y-6">
        <StatsCards assessments={assessments} voiceInterviews={voiceInterviews} />
        <PerformanceChart assessments={assessments} />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <QuizList assessments={assessments} />
            <VoiceInterviewList interviews={voiceInterviews} />
        </div>
      </div>
    </div>
  );
};

export default Interview;
