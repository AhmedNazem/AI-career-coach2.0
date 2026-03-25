// Importing the required components
import { getCoverLetter } from "@/actions/coverLetter";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React from "react";
import CoverLetterPreview from "../_components/CoverLetterPreview";

// Fetch cover letter content based on the provided id
const CoverLetter = async ({ params }) => {
  const { id } = await params;
  const { data: coverLetter } = await getCoverLetter(id);

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col space-y-2">
        <Link href={"/aiCoverLetter"}>
          <Button variant="link" className="gap-2 pl-0">
            <ArrowLeft className="size-4" />
            Back to Cover Letters
          </Button>
        </Link>
        <h1 className="text-6xl font-bold gradient-title mb-6">
          {coverLetter?.jobTitle} at {coverLetter?.companyName}
        </h1>
      </div>
      {/* Check if content is available */}
      {coverLetter?.content ? (
        <CoverLetterPreview content={coverLetter.content} />
      ) : (
        <div>No content available for this cover letter.</div>
      )}
    </div>
  );
};

export default CoverLetter;
