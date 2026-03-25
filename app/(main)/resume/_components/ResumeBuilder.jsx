"use client";

import { Save, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useResumeBuilder } from "./use-resume-builder";
import { ResumeForm } from "./ResumeForm";
import { ResumePreview } from "./ResumePreview";

export default function ResumeBuilder({ initialContent }) {
  const {
    activeTab,
    setActiveTab,
    previewContent,
    setPreviewContent,
    resumeMode,
    setResumeMode,
    isGenerating,
    isSaving,
    control,
    register,
    errors,
    handleSubmit,
    onSubmit,
    generatePDF,
  } = useResumeBuilder(initialContent);

  return (
    <div data-color-mode="light" className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-center gap-2">
        <h1 className="font-bold gradient-title text-5xl md:text-6xl">
          Resume Builder
        </h1>
        <div className="space-x-2">
          <Button
            variant="destructive"
            onClick={handleSubmit(onSubmit)}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save
              </>
            )}
          </Button>
          <Button onClick={generatePDF} disabled={isGenerating}>
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating PDF...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </>
            )}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="edit">Form</TabsTrigger>
          <TabsTrigger value="preview">Markdown</TabsTrigger>
        </TabsList>

        <TabsContent value="edit">
          <form onSubmit={handleSubmit(onSubmit)}>
            <ResumeForm
              register={register}
              control={control}
              errors={errors}
            />
          </form>
        </TabsContent>

        <TabsContent value="preview">
          <ResumePreview
            previewContent={previewContent}
            setPreviewContent={setPreviewContent}
            resumeMode={resumeMode}
            setResumeMode={setResumeMode}
            activeTab={activeTab}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
