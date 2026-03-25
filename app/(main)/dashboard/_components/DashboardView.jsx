"use client";

import React from "react";
import {
  TrendingUp,
  LineChart,
  TrendingDown,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { MarketOverview } from "./MarketOverview";
import { SalaryChart } from "./SalaryChart";
import { IndustryTrends } from "./IndustryTrends";

const DashboardView = ({ insights }) => {
  // Transform salary data for the chart
  const salaryData = insights.salaryRanges.map((range) => ({
    name: range.role,
    min: range.min / 1000,
    max: range.max / 1000,
    median: range.median / 1000,
  }));

  const getMarketOutlookInfo = (outlook) => {
    switch (outlook?.toLowerCase()) {
      case "positive":
        return { icon: TrendingUp, color: "text-green-500" };
      case "neutral":
        return { icon: LineChart, color: "text-yellow-500" };
      case "negative":
        return { icon: TrendingDown, color: "text-red-500" };
      default:
        return { icon: LineChart, color: "text-gray-500" };
    }
  };

  const outlookInfo = getMarketOutlookInfo(insights.marketOutlook);

  // Format dates using date-fns
  const lastUpdatedDate = format(new Date(insights.lastUpdated), "dd/MM/yyyy");
  const nextUpdateDistance = formatDistanceToNow(
    new Date(insights.nextUpdate),
    { addSuffix: true }
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Badge variant="outline">Last updated: {lastUpdatedDate}</Badge>
      </div>

      <MarketOverview
        insights={insights}
        outlookInfo={outlookInfo}
        nextUpdateDistance={nextUpdateDistance}
      />

      <SalaryChart salaryData={salaryData} />

      <IndustryTrends insights={insights} />
    </div>
  );
};

export default DashboardView;
