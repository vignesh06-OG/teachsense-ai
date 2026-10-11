"use client";

import React, { useRef, useState, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Html } from "@react-three/drei";
import * as THREE from "three";

interface NodeData {
  position: [number, number, number];
  color: string;
  label: string;
  type: "standard" | "mastery" | "misconception";
  description: string;
}

const NODES: NodeData[] = [
  {
    position: [0, 0.2, 0],
    color: "#6366f1",
    label: "Core Target: Linear Equations",
    type: "standard",
    description: "CCSS.MATH.8.EE.C.7: Standard Form 2x + 5 = 15",
  },
  {
    position: [-2.2, 1.4, 0.4],
    color: "#10b981",
    label: "Mastery (x = 5)",
    type: "mastery",
    description: "Correct balance deduction & sign preservation",
  },
  {
    position: [2.2, 1.2, -0.2],
    color: "#f59e0b",
    label: "Sign-Flip Error (x = 10)",
    type: "misconception",
    description: "High-frequency inverse operation confusion",
  },
  {
    position: [-1.9, -1.4, 0.6],
    color: "#ec4899",
    label: "Fraction Fallacy (2/7)",
    type: "misconception",
    description: "Numerator & denominator added across independently",
  },
  {
    position: [2.1, -1.2, 0.3],
    color: "#06b6d4",
    label: "Distribution Drop",
    type: "misconception",
    description: "Multiplication applied to first term only",
  },
];

// Ambient background particle field
function EducationalParticleField({ reducedMotion }: { reducedMotion: boolean }) {
  const pointsRef = useRef<THREE.Points>(null!);
  const count = 48;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 6 - 1;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (reducedMotion || !pointsRef.current) return;
    const t = state.clock.getElapsedTime();
    pointsRef.current.rotation.y = t * 0.03;
  });

  return (
    // @ts-ignore
    <points ref={pointsRef}>
      {/* @ts-ignore */}
      <bufferGeometry>
        {/* @ts-ignore */}
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      {/* @ts-ignore */}
      </bufferGeometry>
      {/* @ts-ignore */}
      <pointsMaterial
        size={0.06}
        color="#818cf8"
        transparent
        opacity={0.35}
        sizeAttenuation
      />
    {/* @ts-ignore */}
    </points>
  );
}

// Data connection line between center node and child nodes
function ConnectionLine({
  start,
  end,
  color,
  isHighlighted,
}: {
  start: [number, number, number];
  end: [number, number, number];
  color: string;
  isHighlighted: boolean;
}) {
  const lineGeometry = useMemo(() => {
    const pts = [new THREE.Vector3(...start), new THREE.Vector3(...end)];
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, [start, end]);

  return (
    // @ts-ignore
    <line geometry={lineGeometry}>
      {/* @ts-ignore */}
      <lineBasicMaterial
        color={isHighlighted ? "#ffffff" : color}
        transparent
        opacity={isHighlighted ? 0.85 : 0.28}
        linewidth={isHighlighted ? 2 : 1}
      />
    {/* @ts-ignore */}
    </line>
  );
}

function KnowledgeLattice({ reducedMotion }: { reducedMotion: boolean }) {
  const groupRef = useRef<THREE.Group>(null!);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  useFrame((state) => {
    if (reducedMotion || !groupRef.current) return;
    const t = state.clock.getElapsedTime();
    // Gentle damped parallax responding to pointer movement
    const targetRotY = Math.sin(t * 0.22) * 0.15 + state.pointer.x * 0.25;
    const targetRotX = Math.cos(t * 0.18) * 0.08 - state.pointer.y * 0.18;

    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, 0.05);
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, 0.05);
  });

  const centerPos = NODES[0].position;

  return (
    <group ref={groupRef}>
      <EducationalParticleField reducedMotion={reducedMotion} />

      {/* Dynamic Data Transmission Lines */}
      {NODES.slice(1).map((node, i) => (
        <ConnectionLine
          key={`line-${i}`}
          start={centerPos}
          end={node.position}
          color={node.color}
          isHighlighted={hoveredNode === node.label}
        />
      ))}

      {/* Central Target Standard Node */}
      <Float speed={reducedMotion ? 0 : 2} rotationIntensity={0.4} floatIntensity={0.6}>
        {/* @ts-ignore */}
        <mesh position={centerPos}>
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
        <Html position={[0, -0.75, 0]} center className="pointer-events-none select-none">
          <div className="px-2.5 py-1 rounded-lg bg-indigo-950/90 border border-indigo-500/40 text-[10px] font-mono text-indigo-200 whitespace-nowrap shadow-xl backdrop-blur-md flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping" />
            <span>Target Standard: Linear Eq (CCSS.8.EE.C.7)</span>
          </div>
        </Html>
      </Float>

      {/* Orbiting Conceptual & Misconception Nodes */}
      {NODES.slice(1).map((node, i) => {
        const isHovered = hoveredNode === node.label;
        return (
          <Float key={i} speed={reducedMotion ? 0 : 2.4} rotationIntensity={0.6} floatIntensity={1.0}>
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
                <octahedronGeometry args={[0.42, 0]} />
                {/* @ts-ignore */}
                <meshStandardMaterial
                  color={node.color}
                  roughness={0.25}
                  metalness={0.85}
                  emissive={node.color}
                  emissiveIntensity={isHovered ? 0.95 : 0.4}
                />
              {/* @ts-ignore */}
              </mesh>

              {/* Offline-safe DOM HTML Label (zero troika font network fetch) */}
              <Html position={[0, -0.65, 0]} center className="pointer-events-none select-none">
                <div
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-mono whitespace-nowrap border transition-all duration-200 backdrop-blur-md shadow-xl ${
                    isHovered
                      ? "bg-slate-900/95 text-white border-white/60 scale-105"
                      : "bg-slate-950/80 text-slate-300 border-slate-800"
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: node.color }}
                    />
                    <span className="font-bold">{node.label}</span>
                  </div>
                  {isHovered && (
                    <div className="text-[9px] text-slate-400 mt-0.5 max-w-[180px] truncate">
                      {node.description}
                    </div>
                  )}
                </div>
              </Html>
            </group>
          </Float>
        );
      })}
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
        <div className="absolute top-2 left-4 px-2.5 py-1 rounded bg-emerald-950 border border-emerald-500/40 text-[10px] font-mono text-emerald-300">
          Mastery (x = 5)
        </div>
        <div className="absolute top-4 right-2 px-2.5 py-1 rounded bg-amber-950 border border-amber-500/40 text-[10px] font-mono text-amber-300">
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
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      setReducedMotion(mediaQuery.matches);
      const listener = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
      mediaQuery.addEventListener("change", listener);
      return () => mediaQuery.removeEventListener("change", listener);
    }
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

          <KnowledgeLattice reducedMotion={reducedMotion} />
        </Canvas>
      </SceneErrorBoundary>
    </div>
  );
}
