"use client";

import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sphere, Box, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

function FloatingNeuralCore() {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.x = t * 0.15;
      meshRef.current.rotation.y = t * 0.25;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1.2} floatIntensity={1.5}>
      <Sphere ref={meshRef} args={[1.5, 64, 64]} position={[0, 0, 0]}>
        <MeshDistortMaterial
          color="#6366f1"
          attach="material"
          distort={0.4}
          speed={2}
          roughness={0.2}
          metalness={0.8}
          wireframe={false}
        />
      </Sphere>
    </Float>
  );
}

function OrbitingNode({ position, color }: { position: [number, number, number]; color: string }) {
  const nodeRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (nodeRef.current) {
      nodeRef.current.rotation.y = t * 0.5;
    }
  });

  return (
    <Float speed={3} rotationIntensity={2} floatIntensity={2}>
      {/* @ts-ignore */}
      <mesh ref={nodeRef} position={position}>
        {/* @ts-ignore */}
        <octahedronGeometry args={[0.35, 0]} />
        {/* @ts-ignore */}
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.9} emissive={color} emissiveIntensity={0.4} />
      {/* @ts-ignore */}
      </mesh>
    </Float>
  );
}

export default function HeroScene() {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-full min-h-[420px] md:min-h-[560px] flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[420px] md:min-h-[560px] relative pointer-events-auto">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        className="w-full h-full"
        gl={{ alpha: true, antialias: true }}
      >
        {/* @ts-ignore */}
        <ambientLight intensity={0.7} />
        {/* @ts-ignore */}
        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#818cf8" />
        {/* @ts-ignore */}
        <pointLight position={[-10, -10, -5]} intensity={1} color="#c084fc" />

        <FloatingNeuralCore />

        {/* Constellation Nodes */}
        <OrbitingNode position={[-2.4, 1.4, -0.5]} color="#38bdf8" />
        <OrbitingNode position={[2.3, -1.2, 0.2]} color="#a855f7" />
        <OrbitingNode position={[-1.8, -1.5, 0.8]} color="#06b6d4" />
        <OrbitingNode position={[2.0, 1.6, -0.8]} color="#ec4899" />
      </Canvas>
    </div>
  );
}
