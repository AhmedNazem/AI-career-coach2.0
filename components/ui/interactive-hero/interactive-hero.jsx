"use client";

import React, { useRef, useEffect, useMemo } from "react";
import { Vector3, Raycaster, Plane, ACESFilmicToneMapping } from "three";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { X } from "./InteractiveScene";
import { Z, pointer, onPointerMove } from "./InstancedSpheres";


const defaultBallpitConfig = {
  count: 200,
  materialParams: {
    metalness: 0.7,
    roughness: 0.3,
    clearcoat: 1,
    clearcoatRoughness: 0.2,
  },
  minSize: 0.3,
  maxSize: 0.8,
  size0: 1.0,
  gravity: 0.4,
  friction: 0.995,
  wallBounce: 0.2,
  maxVelocity: 0.1,
  maxX: 10,
  maxY: 10,
  maxZ: 10,
  controlSphere0: true,
  followCursor: true,
  lightIntensity: 3,
  ambientIntensity: 1.5,
};

const lightColors = ["#0e7490", "#155e75", "#0891b2"]; // cyan-700, cyan-800, cyan-600
const darkColors = ["#22d3ee", "#06b6d4", "#67e8f9"]; // cyan-400, cyan-500, cyan-300




export const InteractiveHero = ({
  className,
  ballpitConfig = {},
  children,
}) => {
  const canvasRef = useRef(null);
  const { theme } = useTheme();

  const config = useMemo(
    () => ({
      ...defaultBallpitConfig,
      ...ballpitConfig,
      colors: theme === "dark" ? darkColors : lightColors,
    }),
    [ballpitConfig, theme]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const three = new X({ canvas, size: "parent" });
    three.renderer.toneMapping = ACESFilmicToneMapping;
    three.camera.position.set(0, 0, 20);

    const spheres = new Z(three.renderer, config);
    three.scene.add(spheres);

    const raycaster = new Raycaster();
    const plane = new Plane(new Vector3(0, 0, 1), 0);
    const intersectionPoint = new Vector3();

    if (config.followCursor) {
      window.addEventListener("pointermove", onPointerMove);
    }

    three.onBeforeRender = (deltaInfo) => {
      if (config.followCursor) {
        raycaster.setFromCamera(pointer, three.camera);
        if (raycaster.ray.intersectPlane(plane, intersectionPoint)) {
          spheres.physics.center.copy(intersectionPoint);
        }
      }
      spheres.update(deltaInfo);
    };

    three.onAfterResize = (size) => {
      spheres.physics.config.maxX = size.wWidth / 2;
      spheres.physics.config.maxY = size.wHeight / 2;
      spheres.physics.config.maxZ = size.wWidth / 4;
    };

    return () => {
      if (config.followCursor) {
        window.removeEventListener("pointermove", onPointerMove);
      }
      three.dispose();
    };
  }, [config]);

  return (
    <div
      className={cn(
        "relative w-full min-h-[400px] overflow-hidden rounded-lg gradient",
        className
      )}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full z-0 opacity-40 mix-blend-overlay"
      />

      <div className="relative z-10 w-full h-full flex items-center justify-center py-12 md:py-24">
        {children}
      </div>
    </div>
  );
};
