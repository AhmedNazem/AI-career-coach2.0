"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function IndustryTrends({ insights }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Key Industry Trends</CardTitle>
          <CardDescription>Current trends shaping the industry</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {insights.keyTrends.map((trend, index) => (
              <li key={index} className="flex items-start space-x-2">
                <div className="h-2 w-2 mt-2 rounded-full bg-primary" />
                <span>{trend}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recommended Skills</CardTitle>
          <CardDescription>Skills to consider developing</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {insights.recommendedSkills.map((skill) => (
              <Badge key={skill} variant="outline">{skill}</Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
