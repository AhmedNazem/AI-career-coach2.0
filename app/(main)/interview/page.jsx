import { getAssessments } from "@/actions/interview";
import React from "react";
import StatsCards from "./_components/StatsCards";
import PerformanceChart from "./_components/PerformanceChart";
import QuizList from "./_components/QuizList";
import MockInterviewOptions from "./_components/MockInterviewOptions";
import { checkUser } from "@/lib/checkUser";

const Interview = async () => {
  const assessments = await getAssessments();
  const user = await checkUser();

  return (
    <div>
      <h1 className="text-6xl font-bold gradient-title mb-5">
        Interview Preparation
      </h1>
      
      <MockInterviewOptions user={user} />

      <div className="space-y-6">
        <StatsCards assessments={assessments} />
        <PerformanceChart assessments={assessments} />
        <QuizList assessments={assessments} />
      </div>
    </div>
  );
};

export default Interview;
