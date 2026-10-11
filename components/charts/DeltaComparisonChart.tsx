"use client";

import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import { StudentDelta } from "@/lib/validators/assessment-schema";

interface DeltaChartProps {
  deltas: StudentDelta[];
}

export function DeltaComparisonChart({ deltas }: DeltaChartProps) {
  const chartData = deltas.map((d) => ({
    name: d.studentName.split(" ")[0], // First name for clean display
    Pre: d.preScore,
    Post: d.postScore,
    Gain: d.rawGain,
  }));

  return (
    <div className="w-full h-72 sm:h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis
            dataKey="name"
            stroke="#94a3b8"
            fontSize={11}
            tickLine={false}
          />
          <YAxis
            domain={[0, 100]}
            stroke="#94a3b8"
            fontSize={11}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#0f172a",
              borderColor: "#334155",
              borderRadius: "0.75rem",
              color: "#f8fafc",
              fontSize: "12px",
            }}
          />
          <Legend
            wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }}
          />
          <Bar dataKey="Pre" fill="#64748b" radius={[4, 4, 0, 0]} name="Pre-Intervention Score" />
          <Bar dataKey="Post" fill="#6366f1" radius={[4, 4, 0, 0]} name="Post-Intervention Score" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
