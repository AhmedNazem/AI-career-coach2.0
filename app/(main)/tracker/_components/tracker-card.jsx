"use client";

import { Draggable } from "@hello-pangea/dnd";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  ExternalLink,
  Trash2,
  Calendar,
  MoreVertical,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDistanceToNow } from "date-fns";
import { deleteJobApplication } from "@/actions/jobs";
import { toast } from "sonner";

export function TrackerCard({ application, index, onDelete }) {
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this application?")) {
      const result = await deleteJobApplication(application.id);
      if (result.success) {
        toast.success("Application deleted");
        onDelete(application.id);
      } else {
        toast.error(result.error);
      }
    }
  };

  return (
    <Draggable draggableId={application.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`mb-4 ${snapshot.isDragging ? "opacity-50" : ""}`}
        >
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="p-4 pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-base line-clamp-1">
                  {application.title}
                </CardTitle>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={handleDelete}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <p className="text-sm font-medium text-muted-foreground">
                {application.company}
              </p>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-3">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" />
                {application.location || "Remote"}
              </div>
              
              {application.matchScore && (
                <Badge variant="outline" className="text-[10px] bg-primary/5">
                  AI Match: {application.matchScore}%
                </Badge>
              )}
            </CardContent>
            <CardFooter className="p-4 pt-0 border-t flex justify-between items-center text-[10px] text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDistanceToNow(new Date(application.updatedAt), {
                  addSuffix: true,
                })}
              </div>
              {application.url && (
                <a
                  href={application.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary"
                >
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </CardFooter>
          </Card>
        </div>
      )}
    </Draggable>
  );
}
