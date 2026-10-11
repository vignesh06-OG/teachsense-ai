"use client";

import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

interface FreqProps {
  frequencies: Record<string, number>;
}

export function MisconceptionDistributionChart({ frequencies }: FreqProps) {
  const data = Object.entries(frequencies).map(([tag, count]) => {
    let cleanName = tag.replace(/_/g, " ");
    if (cleanName.length > 18) {
      cleanName = cleanName.slice(0, 16) + "...";
    }
    return { name: cleanName, count };
  });

  return (
    <div className="w-full h-64 sm:h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical"
          data={data}
          margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis type="number" stroke="#94a3b8" fontSize={11} allowDecimals={false} />
          <YAxis
            type="category"
            dataKey="name"
            stroke="#94a3b8"
            fontSize={10}
            width={120}
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
          <Bar dataKey="count" fill="#818cf8" radius={[0, 6, 6, 0]} name="Students Affected" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
