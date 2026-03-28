"use client";
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ParticleWaves = () => {
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const animationRef = useRef(null);
  
  const mouseRef = useRef({ x: 0, y: 0 });
  const windowHalfRef = useRef({ x: 0, y: 0 });
  const countRef = useRef(0);

  const DENSITY = 50;
  const SPEED = 0.1;
  const AMPLITUDE = 50;
  const SEPARATION = 100;
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    windowHalfRef.current.x = window.innerWidth / 2;
    windowHalfRef.current.y = window.innerHeight / 2;

    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 1000;
    camera.position.y = 800;

    const scene = new THREE.Scene();

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(new THREE.Color('#000000'), 1);
    rendererRef.current = renderer;

    containerRef.current.appendChild(renderer.domElement);

    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, 32, 32);
    context.fillStyle = '#ffffff';
    context.beginPath();
    context.arc(16, 16, 12, 0, Math.PI * 2, true);
    context.fill();
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    
    const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const particles = [];

    for (let ix = 0; ix < DENSITY; ix++) {
      for (let iy = 0; iy < DENSITY; iy++) {
        const particle = new THREE.Sprite(material);
        particle.position.x = ix * SEPARATION - ((DENSITY * SEPARATION) / 2);
        particle.position.z = iy * SEPARATION - ((DENSITY * SEPARATION) / 2);
        particle.position.y = -400;
        particle.scale.setScalar(10);
        particles.push(particle);
        scene.add(particle);
      }
    }

    const handleMouseMove = (e) => {
      mouseRef.current.x = e.clientX - windowHalfRef.current.x;
      mouseRef.current.y = e.clientY - windowHalfRef.current.y;
    };

    const handleTouchMove = (e) => {
      if (e.touches.length === 1) {
        mouseRef.current.x = e.touches[0].pageX - windowHalfRef.current.x;
        mouseRef.current.y = e.touches[0].pageY - windowHalfRef.current.y;
      }
    };

    const handleResize = () => {
      windowHalfRef.current.x = window.innerWidth / 2;
      windowHalfRef.current.y = window.innerHeight / 2;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      camera.position.x += (mouseRef.current.x - camera.position.x) * 0.05;
      camera.position.y += (-mouseRef.current.y - camera.position.y) * 0.05;
      camera.lookAt(scene.position);
      
      let i = 0;
      for (let ix = 0; ix < DENSITY; ix++) {
        for (let iy = 0; iy < DENSITY; iy++) {
          const particle = particles[i++];
          if (!particle) continue;
          particle.position.y = -400 + 
            (Math.sin((ix + countRef.current) * 0.3) * AMPLITUDE) + 
            (Math.sin((iy + countRef.current) * 0.5) * AMPLITUDE);
          const scale = (Math.sin((ix + countRef.current) * 0.3) + 1) * 2 + 
                       (Math.sin((iy + countRef.current) * 0.5) + 1) * 2;
          particle.scale.setScalar(scale * 2);
        }
      }
      renderer.render(scene, camera);
      countRef.current += SPEED;
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('resize', handleResize);
    animate();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('resize', handleResize);
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-full min-h-screen bg-black overflow-hidden flex items-center justify-center">
      <div ref={containerRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
};

export default ParticleWaves;
