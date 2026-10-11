"use client";

import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sphere, Text, Line } from "@react-three/drei";
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

            {/* 3D Label */}
            <Text
              position={[0, -0.6, 0]}
              fontSize={0.2}
              color="#e2e8f0"
              anchorX="center"
              anchorY="middle"
            >
              {node.label}
            </Text>
          </group>
        </Float>
      ))}

      {/* Neural Synapse Connections from Core to Branches */}
      {NODES.slice(1).map((node, idx) => (
        <Line
          key={idx}
          points={[
            [0, 0.2, 0],
            node.position,
          ]}
          color={node.color}
          lineWidth={1.5}
          transparent
          opacity={0.35}
        />
      ))}
    </group>
  );
}

export default function HeroScene() {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
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
      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 42 }}
        className="w-full h-full"
        gl={{ alpha: true, antialias: true }}
      >
        {/* @ts-ignore */}
        <ambientLight intensity={0.8} />
        {/* @ts-ignore */}
        <directionalLight position={[10, 10, 5]} intensity={1.8} color="#a5b4fc" />
        {/* @ts-ignore */}
        <pointLight position={[-8, -8, -4]} intensity={1.2} color="#38bdf8" />

        <KnowledgeLattice />
      </Canvas>
    </div>
  );
}
