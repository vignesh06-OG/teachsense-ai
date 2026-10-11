"use client";

import React from "react";
import { Navbar } from "@/components/ui/Navbar";
import { WorkflowProvider } from "@/lib/context/WorkflowContext";
import { WorkflowStepper } from "@/components/workflow/WorkflowStepper";
import { WorkflowActionBar } from "@/components/workflow/WorkflowActionBar";
import { SenseiCompanion } from "@/components/mascot/SenseiCompanion";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <WorkflowProvider>
      <div className="min-h-screen bg-[#070a12] text-slate-100 flex flex-col relative selection:bg-indigo-500 selection:text-white">
        {/* Navigation */}
        <Navbar />

        {/* Dashboard Container */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          {/* Persistent 6-Stage Workflow Stepper */}
          <WorkflowStepper />

          {/* Active Stage View */}
          <div className="pb-16">{children}</div>
        </main>

        {/* Sticky Contextual Workflow Action Bar */}
        <WorkflowActionBar />

        {/* Sensei AI Companion */}
        <SenseiCompanion />
      </div>
    </WorkflowProvider>
  );
}
