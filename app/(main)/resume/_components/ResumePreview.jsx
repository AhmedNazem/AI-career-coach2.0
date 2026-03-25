"use client";

import MDEditor from "@uiw/react-md-editor";
import { Button } from "@/components/ui/button";
import { Edit, Monitor, AlertTriangle } from "lucide-react";

export function ResumePreview({
  previewContent,
  setPreviewContent,
  resumeMode,
  setResumeMode,
  activeTab,
}) {
  return (
    <>
      <Button
        variant="link"
        type="button"
        className="mb-2"
        onClick={() =>
          setResumeMode(resumeMode === "preview" ? "edit" : "preview")
        }
      >
        {resumeMode === "preview" ? (
          <>
            <Edit className="h-4 w-4 mr-2" />
            Edit Resume
          </>
        ) : (
          <>
            <Monitor className="h-4 w-4 mr-2" />
            Show Preview
          </>
        )}
      </Button>

      {resumeMode !== "preview" && (
        <div className="flex p-3 gap-2 items-center border-2 border-yellow-600 text-yellow-600 rounded mb-2">
          <AlertTriangle className="h-5 w-5" />
          <span className="text-sm">
            You will lose edited markdown if you update the form data.
          </span>
        </div>
      )}

      <div className="border rounded-lg">
        <MDEditor
          value={previewContent}
          onChange={setPreviewContent}
          height={800}
          preview={resumeMode}
        />
      </div>

      <div className="hidden">
        <div id="resume-pdf">
          <MDEditor.Markdown
            source={previewContent}
            style={{
              background: "white",
              color: "black",
            }}
          />
        </div>
      </div>
    </>
  );
}
