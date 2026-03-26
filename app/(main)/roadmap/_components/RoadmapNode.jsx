"use client";

import { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, CheckCircle2, Circle } from "lucide-react";

const RoadmapNode = ({ data }) => {
  return (
    <div className="px-4 py-2 shadow-lg rounded-xl bg-background/50 backdrop-blur-md border border-cyan-500/30 w-[240px]">
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-cyan-500 border-none" />
      
      <div className="flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold text-wrap leading-tight text-white">
            {data.title}
          </h3>
          <Circle className="w-4 h-4 text-cyan-500/50 mt-1 flex-shrink-0" />
        </div>
        
        <p className="text-[10px] text-muted-foreground line-clamp-2 leading-tight">
          {data.description}
        </p>

        {data.resources && data.resources.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {data.resources.slice(0, 2).map((link, i) => (
              <a 
                key={i} 
                href={link} 
                target="_blank" 
                rel="noreferrer"
                className="text-[9px] bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 px-1.5 py-0.5 rounded flex items-center gap-0.5 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                Link {i + 1}
                <ExternalLink className="w-2 h-2" />
              </a>
            ))}
          </div>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-cyan-500 border-none" />
    </div>
  );
};

export default memo(RoadmapNode);
