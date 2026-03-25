"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export function EntryCard({ item, index, onDelete }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {item.title} @ {item.organization}
        </CardTitle>
        <Button
          variant="outline"
          size="icon"
          type="button"
          onClick={() => onDelete(index)}
        >
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          {item.current
            ? `${item.startDate} - Present`
            : `${item.startDate} - ${item.endDate}`}
        </p>
        <p className="mt-2 text-sm whitespace-pre-wrap">
          {item.description}
        </p>
      </CardContent>
    </Card>
  );
}
