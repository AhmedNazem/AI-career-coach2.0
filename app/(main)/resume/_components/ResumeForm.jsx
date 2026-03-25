"use client";

import { Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { EntryForm } from "./EntryForm";

export function ResumeForm({ register, control, errors }) {
  return (
    <div className="space-y-8">
      {/* Contact Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Contact Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg bg-muted/50">
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input
              {...register("contactInfo.email")}
              type="email"
              placeholder="your@email.com"
            />
            {errors.contactInfo?.email && (
              <p className="text-sm text-red-500">
                {errors.contactInfo.email.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Mobile Number</label>
            <Input
              {...register("contactInfo.mobile")}
              type="tel"
              placeholder="+1 234 567 8900"
            />
            {errors.contactInfo?.mobile && (
              <p className="text-sm text-red-500">
                {errors.contactInfo.mobile.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">LinkedIn URL</label>
            <Input
              {...register("contactInfo.linkedin")}
              type="url"
              placeholder="https://linkedin.com/in/your-profile"
            />
            {errors.contactInfo?.linkedin && (
              <p className="text-sm text-red-500">
                {errors.contactInfo.linkedin.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Twitter/X Profile</label>
            <Input
              {...register("contactInfo.twitter")}
              type="url"
              placeholder="https://twitter.com/your-handle"
            />
            {errors.contactInfo?.twitter && (
              <p className="text-sm text-red-500">
                {errors.contactInfo.twitter.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Professional Summary</h3>
        <Controller
          name="summary"
          control={control}
          render={({ field }) => (
            <Textarea
              {...field}
              className="h-32"
              placeholder="Write a compelling professional summary..."
            />
          )}
        />
        {errors.summary && (
          <p className="text-sm text-red-500">{errors.summary.message}</p>
        )}
      </div>

      {/* Skills */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Skills</h3>
        <Controller
          name="skills"
          control={control}
          render={({ field }) => (
            <Textarea
              {...field}
              className="h-32"
              placeholder="List your key skills..."
            />
          )}
        />
        {errors.skills && (
          <p className="text-sm text-red-500">{errors.skills.message}</p>
        )}
      </div>

      {/* Experience */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Work Experience</h3>
        <Controller
          name="experience"
          control={control}
          render={({ field }) => (
            <EntryForm
              type="Experience"
              entries={field.value}
              onChange={field.onChange}
            />
          )}
        />
        {errors.experience && (
          <p className="text-sm text-red-500">{errors.experience.message}</p>
        )}
      </div>

      {/* Education */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Education</h3>
        <Controller
          name="education"
          control={control}
          render={({ field }) => (
            <EntryForm
              type="Education"
              entries={field.value}
              onChange={field.onChange}
            />
          )}
        />
        {errors.education && (
          <p className="text-sm text-red-500">{errors.education.message}</p>
        )}
      </div>

      {/* Projects */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Projects</h3>
        <Controller
          name="projects"
          control={control}
          render={({ field }) => (
            <EntryForm
              type="Project"
              entries={field.value}
              onChange={field.onChange}
            />
          )}
        />
        {errors.projects && (
          <p className="text-sm text-red-500">{errors.projects.message}</p>
        )}
      </div>
    </div>
  );
}
