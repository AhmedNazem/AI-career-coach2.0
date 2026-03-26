import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import React from "react";
import CoverLetterList from "./_components/CoverLetterList";
import { getCoverLetters } from "@/actions/coverLetter";

export const dynamic = "force-dynamic";

const AiCoverLetter = async () => {
  const { data: coverLetters = [] } = await getCoverLetters();

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-2 items-center justify-between mb-5">
        <h1 className="text-6xl font-bold gradient-title">My Cover Letters</h1>
        <Link href={"/aiCoverLetter/new"}>
          <Button>
            <Plus className="size-4 mr-2" />
            Create New
          </Button>
        </Link>
      </div>
      <CoverLetterList coverLetters={coverLetters} />
    </div>
  );
};

export default AiCoverLetter;
