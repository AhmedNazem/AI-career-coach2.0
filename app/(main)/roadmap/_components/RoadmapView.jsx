"use client";

import React, { useMemo } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import RoadmapNode from "./RoadmapNode";

const nodeTypes = {
  roadmapNode: RoadmapNode,
};

export default function RoadmapView({ milestones }) {
  // Simple layout logic: Stack nodes vertically based on dependencies
  const { initialNodes, initialEdges } = useMemo(() => {
    const nodes = [];
    const edges = [];
    const nodeWidth = 240;
    const nodeHeight = 120;
    const paddingX = 40;
    const paddingY = 80;

    // Map to track depth/level of each milestone
    const levelMap = new Map();
    const milestoneMap = new Map(milestones.map((m) => [m.id, m]));

    const getLevel = (id) => {
      if (levelMap.has(id)) return levelMap.get(id);
      const m = milestoneMap.get(id);
      if (!m || !m.prerequisites || m.prerequisites.length === 0) {
        levelMap.set(id, 0);
        return 0;
      }
      const maxPrereqLevel = Math.max(
        ...m.prerequisites.map((pId) => getLevel(pId))
      );
      levelMap.set(id, maxPrereqLevel + 1);
      return maxPrereqLevel + 1;
    };

    milestones.forEach((m) => getLevel(m.id));

    // Group milestones by level
    const levels = [];
    milestones.forEach((m) => {
      const level = levelMap.get(m.id);
      if (!levels[level]) levels[level] = [];
      levels[level].push(m);
    });

    // Create nodes and edges
    levels.forEach((levelMilestones, levelIndex) => {
      levelMilestones.forEach((m, index) => {
        nodes.push({
          id: m.id,
          type: "roadmapNode",
          position: {
            x: index * (nodeWidth + paddingX),
            y: levelIndex * (nodeHeight + paddingY),
          },
          data: { ...m },
        });

        if (m.prerequisites) {
          m.prerequisites.forEach((pId) => {
            edges.push({
              id: `e-${pId}-${m.id}`,
              source: pId,
              target: m.id,
              animated: true,
              style: { stroke: "#06b6d4", strokeWidth: 2 },
            });
          });
        }
      });
    });

    return { initialNodes: nodes, initialEdges: edges };
  }, [milestones]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  return (
    <div className="h-[600px] w-full border border-cyan-500/20 rounded-xl overflow-hidden bg-background/30 backdrop-blur-sm">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background color="#164e63" variant="dots" gap={20} size={1} />
        <Controls className="bg-background/80 border-cyan-500/30 text-white fill-white" />
        <MiniMap 
            nodeColor="#06b6d4" 
            maskColor="rgba(0, 0, 0, 0.5)" 
            className="bg-background/80 border-cyan-500/30"
        />
      </ReactFlow>
    </div>
  );
}
