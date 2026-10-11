"use client";

import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Html } from "@react-three/drei";
import * as THREE from "three";

interface NodeData {
  position: [number, number, number];
  color: string;
  label: string;
  type: "standard" | "mastery" | "misconception";
}

const NODES: NodeData[] = [
  { position: [0, 0.2, 0], color: "#6366f1", label: "Target Standard (Linear Eq)", type: "standard" },
  { position: [-2.2, 1.4, 0.4], color: "#10b981", label: "Mastery (x = 5)", type: "mastery" },
  { position: [2.2, 1.2, -0.2], color: "#f59e0b", label: "Sign-Flip Error (x = 10)", type: "misconception" },
  { position: [-1.8, -1.4, 0.6], color: "#ec4899", label: "Fraction Fallacy (2/7)", type: "misconception" },
  { position: [2.0, -1.2, 0.3], color: "#06b6d4", label: "Distribution Drop", type: "misconception" },
];

function KnowledgeLattice() {
  const groupRef = useRef<THREE.Group>(null!);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      // Gentle parallax & breathing rotation
      groupRef.current.rotation.y = Math.sin(t * 0.25) * 0.2 + state.pointer.x * 0.3;
      groupRef.current.rotation.x = Math.cos(t * 0.2) * 0.1 - state.pointer.y * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Central Knowledge Node */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.8}>
        {/* @ts-ignore */}
        <mesh position={[0, 0.2, 0]}>
          {/* @ts-ignore */}
          <sphereGeometry args={[0.7, 32, 32]} />
          {/* @ts-ignore */}
          <meshStandardMaterial
            color="#6366f1"
            roughness={0.2}
            metalness={0.8}
            emissive="#4338ca"
            emissiveIntensity={0.6}
            wireframe={false}
          />
        {/* @ts-ignore */}
        </mesh>
        <Html position={[0, -0.7, 0]} center className="pointer-events-none select-none">
          <div className="px-2 py-0.5 rounded bg-indigo-950/80 border border-indigo-500/40 text-[10px] font-mono text-indigo-200 whitespace-nowrap shadow-lg">
            Core Target: Linear Equations
          </div>
        </Html>
      </Float>

      {/* Orbiting Conceptual Branches */}
      {NODES.slice(1).map((node, i) => (
        <Float key={i} speed={2.5} rotationIntensity={0.8} floatIntensity={1.2}>
          <group position={node.position}>
            {/* @ts-ignore */}
            <mesh
              onPointerOver={(e) => {
                e.stopPropagation();
                setHoveredNode(node.label);
              }}
              onPointerOut={() => setHoveredNode(null)}
            >
              {/* @ts-ignore */}
              <octahedronGeometry args={[0.4, 0]} />
              {/* @ts-ignore */}
              <meshStandardMaterial
                color={node.color}
                roughness={0.2}
                metalness={0.9}
                emissive={node.color}
                emissiveIntensity={hoveredNode === node.label ? 0.9 : 0.4}
              />
            {/* @ts-ignore */}
            </mesh>

            {/* Offline-safe DOM HTML Label (zero troika font network fetch) */}
            <Html position={[0, -0.6, 0]} center className="pointer-events-none select-none">
              <div
                className={`px-2 py-0.5 rounded text-[10px] font-mono whitespace-nowrap border transition-all ${
                  hoveredNode === node.label
                    ? "bg-slate-900 text-white border-white/60 scale-105 shadow-lg"
                    : "bg-slate-950/70 text-slate-300 border-slate-800"
                }`}
              >
                {node.label}
              </div>
            </Html>
          </group>
        </Float>
      ))}
    </group>
  );
}

// 2D SVG Offline Fallback
function KnowledgeLatticeFallback() {
  return (
    <div className="w-full h-full min-h-[440px] flex flex-col items-center justify-center relative p-6">
      <div className="w-64 h-64 rounded-full border border-indigo-500/20 relative flex items-center justify-center animate-pulse">
        <div className="w-24 h-24 rounded-full bg-indigo-600/30 border border-indigo-400 flex items-center justify-center text-center p-2 text-xs font-bold text-white shadow-xl shadow-indigo-600/40">
          Linear Eq Core
        </div>
        <div className="absolute top-2 left-6 px-2.5 py-1 rounded bg-emerald-950 border border-emerald-500/40 text-[10px] font-mono text-emerald-300">
          Mastery (x = 5)
        </div>
        <div className="absolute top-4 right-4 px-2.5 py-1 rounded bg-amber-950 border border-amber-500/40 text-[10px] font-mono text-amber-300">
          Sign-Flip Error
        </div>
        <div className="absolute bottom-6 left-2 px-2.5 py-1 rounded bg-pink-950 border border-pink-500/40 text-[10px] font-mono text-pink-300">
          Fraction Fallacy
        </div>
        <div className="absolute bottom-4 right-4 px-2.5 py-1 rounded bg-cyan-950 border border-cyan-500/40 text-[10px] font-mono text-cyan-300">
          Distribution Drop
        </div>
      </div>
      <p className="text-xs text-slate-500 mt-4 font-mono">Curricular Misconception Lattice</p>
    </div>
  );
}

class SceneErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: any) {
    console.warn("HeroScene WebGL fallback rendered:", error);
  }
  render() {
    if (this.state.hasError) {
      return <KnowledgeLatticeFallback />;
    }
    return this.props.children;
  }
}

export default function HeroScene() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-full min-h-[440px] md:min-h-[560px] flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[440px] md:min-h-[560px] relative pointer-events-auto">
      <SceneErrorBoundary>
        <Canvas
          camera={{ position: [0, 0, 5.5], fov: 42 }}
          className="w-full h-full"
          gl={{ alpha: true, antialias: true, failIfMajorPerformanceCaveat: false }}
        >
          {/* @ts-ignore */}
          <ambientLight intensity={0.8} />
          {/* @ts-ignore */}
          <directionalLight position={[10, 10, 5]} intensity={1.8} color="#a5b4fc" />
          {/* @ts-ignore */}
          <pointLight position={[-8, -8, -4]} intensity={1.2} color="#38bdf8" />

          <KnowledgeLattice />
        </Canvas>
      </SceneErrorBoundary>
    </div>
  );
}
