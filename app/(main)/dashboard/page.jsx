import { getIndustryInsights } from "@/actions/dashboard";
import { getUserOnboardingStatus } from "@/actions/user";
import { redirect } from "next/navigation";
import React from "react";
import DashboardView from "./_components/DashboardView";

const IndustryInsights = async () => {
  const { data: onboardingStatus } = await getUserOnboardingStatus();

  if (!onboardingStatus?.isOnboarded) {
    redirect("/onboarding");
  }

  const { data: insights } = await getIndustryInsights();

  return (
    <div className="container mx-auto">
      <DashboardView insights={insights} />
    </div>
  );
};

export default IndustryInsights;
