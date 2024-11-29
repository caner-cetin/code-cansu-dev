import React, { useState } from "react"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"


interface MemoryData {
  [key: number]: {
    timestamp: number;
    memory: number;
  };
}
export default function MemoryGraph({ memoryHistory }: { memoryHistory: number[] }) {
  const data: MemoryData = memoryHistory?.reduce((acc: MemoryData, val: number, idx: number) => {
    const memoryInMB = val / 1024 / 1024;
    acc[memoryInMB] = { timestamp: idx, memory: memoryInMB };
    return acc;
  }, {}) || {};

  return (
    <Card className="w-full overflow-x-auto max-x-screen bg-white">
      <CardHeader>
        <CardTitle className="text-black">Memory Usage Over Time</CardTitle>
        <CardDescription className="text-black">Memory usage in megabytes (MB)</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            memory: {
              label: "Memory Usage",
              color: "hsl(210, 100%, 59%)", // Bright blue color

            },
          }}
          className="h-full [&_text]:text-gray-400 [&_.recharts-cartesian-grid-horizontal_line]:opacity-20 [&_.recharts-cartesian-grid-vertical_line]:opacity-20"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={Object.values(data)}
              margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.1)"
              />
              <XAxis
                dataKey="timestamp"
                stroke="#9CA3AF"
                tickLine={false}
                axisLine={false}
                dy={10}
                tick={{ fill: "#9CA3AF" }}
                interval={Math.ceil(Object.values(data).length / 20)}
                tickFormatter={(value) => `${value}ms`}
                label={{
                  value: 'Time (ms/50)',
                  position: 'insideBottomRight',
                  offset: -10,
                  fill: "#9CA3AF"
                }}
              />
              <YAxis
                stroke="#9CA3AF"
                tickLine={false}
                axisLine={false}
                dx={-10}
                tick={{ fill: "#9CA3AF" }}
                label={{
                  value: 'MB',
                  angle: -90,
                  position: 'insideLeft',
                  fill: "#9CA3AF"
                }}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    style={{
                      background: "white",
                      border: "none",
                      borderRadius: "4px",
                      padding: "8px 12px",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    }}
                    className="!bg-white !text-gray-900"
                    formatter={(value, name, item, index) => {
                      return `${value.toFixed(4)} MB at ${data[item.value].timestamp * 50} ms`
                    }}
                  />
                }
                cursor={{ stroke: "rgba(255,255,255,0.2)" }}
              />
              <Line
                type="monotone"
                dataKey="memory"
                stroke="#3B82F6"
                strokeWidth={2}
                dot={false}
                name="Memory Usage"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
