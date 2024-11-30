import React from "react"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MemoryStick } from "lucide-react";

interface DataPoint {
  timestamp: number;
  memory: number;
}

export default function MemoryGraph({ memoryHistory }: { memoryHistory: number[] }) {
  const data: DataPoint[] = memoryHistory.map((val, idx) => ({
    timestamp: idx * 50, // Multiply by 50 to show actual milliseconds
    memory: val / 1024 / 1024 // Convert to MB
  }));

  return (
    <Card className="w-full overflow-x-auto max-w-screen">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <MemoryStick className="w-4 h-4" />
          Memory Usage Over Time
        </CardTitle>
        <CardDescription>Memory usage in megabytes (MB)</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]"> {/* Fixed height container */}
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 20, right: 30, left: 10, bottom: 40 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
              />
              <XAxis
                dataKey="timestamp"
                tickLine={false}
                axisLine={false}
                dy={10}
                tick={{
                  fill: "#FFFFFF",
                  angle: -45,
                  textAnchor: 'end',
                  dy: 10,
                  dx: -10
                }}
                interval={Math.ceil(data.length / 10)}
                tickFormatter={(value) => `${value}ms`}
                label={{
                  value: 'Time (ms)',
                  position: 'insideBottomRight',
                  offset: -20,
                  fill: "#9CA3AF"
                }}
                height={60}
              />
              <YAxis
                stroke="#9CA3AF"
                tickLine={false}
                axisLine={false}
                dx={-10}
                tick={{ fill: "#FFFFFF" }}
                label={{
                  value: 'Memory (MB)',
                  angle: -90,
                  offset: -5,
                  position: 'insideLeft',
                  fill: "#9CA3AF"
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1a1a1a',
                  border: 'none',
                  borderRadius: '6px',
                  color: 'white'
                }}
                itemStyle={{ color: 'white' }}
                labelStyle={{ color: 'white' }}
                formatter={(value) => [`${value.toFixed(2)} MB`, 'Memory Usage']}
                labelFormatter={(value) => `${value}ms elapsed`}
                cursor={{ stroke: "rgba(255,255,255,0.2)" }}
              />
              <Line
                type="monotone"
                dataKey="memory"
                stroke="#FFFFFF"
                strokeWidth={2}
                dot={false}
                name="Memory Usage"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}