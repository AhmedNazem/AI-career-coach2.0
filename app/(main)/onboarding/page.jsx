import { industries } from "@/data/industries";
import React from "react";
import OnboardingForm from "./_components/OnboardingForm";
import { getUserOnboardingStatus } from "@/actions/user";
import { redirect } from "next/navigation";

const OnBoarding = async () => {
  const result = await getUserOnboardingStatus();
  if (!result.success) throw new Error(result.error || "Failed to check onboarding status");
  const data = result.data;

  if (data?.isOnboarded) {
    redirect("/dashboard");
  }
  return (
    <main>
      <OnboardingForm industries={industries} />
    </main>
  );
};

export default OnBoarding;
