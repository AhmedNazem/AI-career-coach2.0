"use client";

import { useState, useEffect } from "react";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { TrackerCard } from "./tracker-card";
import { updateJobApplicationStatus } from "@/actions/jobs";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

const COLUMNS = [
  { id: "WISHLIST", title: "Wishlist", color: "bg-slate-100 dark:bg-slate-900/50" },
  { id: "APPLIED", title: "Applied", color: "bg-blue-50 dark:bg-blue-950/50" },
  { id: "INTERVIEWING", title: "Interviewing", color: "bg-amber-50 dark:bg-amber-950/50" },
  { id: "OFFER", title: "Offer", color: "bg-green-50 dark:bg-green-950/50" },
  { id: "REJECTED", title: "Rejected", color: "bg-red-50 dark:bg-red-950/50" },
];

export function TrackerBoard({ initialApplications }) {
  const [applications, setApplications] = useState(initialApplications);
  const [enabled, setEnabled] = useState(false);

  // Handle Hydration issues with DnD
  useEffect(() => {
    setEnabled(true);
  }, []);

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const newApplications = [...applications];
    const draggedApp = newApplications.find((app) => app.id === draggableId);
    
    if (draggedApp) {
      const oldStatus = draggedApp.status;
      const newStatus = destination.droppableId;
      
      // Update local state
      draggedApp.status = newStatus;
      draggedApp.updatedAt = new Date().toISOString();
      setApplications(newApplications);

      // Update backend
      try {
        const res = await updateJobApplicationStatus(draggableId, newStatus);
        if (!res.success) {
          throw new Error(res.error);
        }
      } catch (error) {
        // Revert local state
        draggedApp.status = oldStatus;
        setApplications([...applications]);
        toast.error("Failed to update status");
      }
    }
  };

  const handleDelete = (id) => {
    setApplications(applications.filter((app) => app.id !== id));
  };

  if (!enabled) return null;

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 min-h-[600px] overflow-x-auto pb-4">
        {COLUMNS.map((column) => (
          <div
            key={column.id}
            className={`flex flex-col min-w-[250px] rounded-xl border p-4 ${column.color}`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
                {column.title}
              </h3>
              <Badge variant="outline" className="rounded-full bg-background">
                {applications.filter((app) => app.status === column.id).length}
              </Badge>
            </div>

            <Droppable droppableId={column.id}>
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={`flex-1 min-h-[200px] transition-colors rounded-lg ${
                    snapshot.isDraggingOver ? "bg-black/5 dark:bg-white/5" : ""
                  }`}
                >
                  {applications
                    .filter((app) => app.status === column.id)
                    .map((app, index) => (
                      <TrackerCard
                        key={app.id}
                        application={app}
                        index={index}
                        onDelete={handleDelete}
                      />
                    ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
}
