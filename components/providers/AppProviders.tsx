"use client";

import React from "react";
import { WorkflowProvider } from "@/lib/context/WorkflowContext";
import { SenseiCompanion } from "@/components/mascot/SenseiCompanion";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <WorkflowProvider>
      {children}
      <SenseiCompanion />
    </WorkflowProvider>
  );
}
