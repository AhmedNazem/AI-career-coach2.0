import { getIndustryInsights } from "@/actions/dashboard";
import { getUserOnboardingStatus } from "@/actions/user";
import { redirect } from "next/navigation";
import React from "react";
import DashboardView from "./_components/DashboardView";

const IndustryInsights = async () => {
  const onboardingResponse = await getUserOnboardingStatus();
  if (!onboardingResponse.success)
    throw new Error(
      onboardingResponse.error || "Failed to get onboarding status",
    );
  const onboardingStatus = onboardingResponse.data;

  if (!onboardingStatus?.isOnboarded) {
    redirect("/onboarding");
  }

  const result = await getIndustryInsights();
  if (!result.success)
    throw new Error(result.error || "Failed to load industry insights");
  const insights = result.data;

  return (
    <div className="container mx-auto">
      <DashboardView insights={insights} />
    </div>
  );
};

export default IndustryInsights;
