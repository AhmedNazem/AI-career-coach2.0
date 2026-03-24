"use client";

import React from "react";

export default function AudioVisualizer({ isActive }) {
  return (
    <div className={`flex items-center justify-center gap-1.5 h-24 ${isActive ? "opacity-100" : "opacity-30"}`}>
      {[...Array(24)].map((_, i) => (
        <div
          key={i}
          className={`w-1.5 bg-primary rounded-full transition-all duration-300 ${isActive ? "animate-bounce" : "h-2"}`}
          style={{
            height: isActive ? `${30 + Math.random() * 70}%` : '8px',
            animationDelay: `${i * 0.05}s`
          }}
        />
      ))}
    </div>
  );
}
