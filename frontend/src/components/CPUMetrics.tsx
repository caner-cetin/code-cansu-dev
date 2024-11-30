import React, { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Cpu, Zap } from 'lucide-react';

const processCpuHistory = (base64Data: string) => {
  try {
    const jsonString = atob(base64Data);
    const cpuHistory = JSON.parse(jsonString);

    return cpuHistory.map((entry: { usage: number, timestamp: number }, index: number) => {
      return {
        usage: Number(entry.usage),
        timePoint: index,
        relativeTime: index * 100,
        cpuTimeUsed: (Number(entry.usage) / 100) * 1000,
      };
    });
  } catch (error) {
    console.error('Error processing CPU history:', error);
    return [];
  }
};

const calculateStats = (data: [{ cpuTimeUsed: number }]) => {
  if (!data.length) return { average: 0, peak: 0, powerUtilization: 0 };

  const sum = data.reduce((acc, val) => acc + val.cpuTimeUsed, 0);
  const average = sum / data.length;
  const peak = Math.max(...data.map(d => d.cpuTimeUsed));
  const powerUtilization = (average / 1000) * 100; // relative to 1000ms limit

  return {
    average,
    peak,
    powerUtilization
  };
};


const CPUMetrics = ({ cpuHistoryBase64 = "", period = 100000, quota = 1000000 }) => {
  const cpuData = useMemo(() => processCpuHistory(cpuHistoryBase64), [cpuHistoryBase64]);
  const stats = useMemo(() => calculateStats(cpuData), [cpuData]);

  const periodMs = period / 1000; // convert to ms
  const quotaMs = quota / 1000;   // convert to ms
  const powerMultiplier = quotaMs / periodMs;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              CPU Power Limits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-300">Time Window:</span>
                <span className="font-medium">{periodMs}ms</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Max CPU Time per Window:</span>
                <span className="font-medium">{quotaMs}ms</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Power Multiplier:</span>
                <span className="font-medium">{powerMultiplier}x</span>
              </div>
              <div className="mt-4 text-sm text-gray-500">
                Your process can use up to {quotaMs}ms of CPU time in each {periodMs}ms window,
                effectively giving you {powerMultiplier}x the power of a single CPU for short bursts.
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cpu className="h-5 w-5" />
              Usage Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-300">Avg:</span>
                <span className="font-medium">{stats.average.toFixed(1)}ms/{periodMs}ms</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Peak:</span>
                <span className="font-medium">{stats.peak.toFixed(1)}ms/{periodMs}ms</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">{stats.powerUtilization.toFixed(1)}% of limit is utilized.</span>
              </div>
              <div className="mt-4 text-sm text-gray-500">
                Values show how much CPU time your process used in each {periodMs}ms window.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Cpu className="h-5 w-5" />
            CPU Power Usage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={cpuData} margin={{ top: 20, right: 50, left: 5, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="relativeTime"
                  label={{ value: 'Time (ms)', position: 'bottom', offset: 30 }}
                  tickFormatter={(value) => `${value}ms`}
                  tick={{
                    fill: "#FFFFFF",
                    angle: -45,
                    textAnchor: 'end',
                    dy: 10,
                    dx: -10
                  }}
                />
                <YAxis
                  label={{
                    value: 'CPU Time Used',
                    angle: -90,
                    position: 'insideLeft'
                  }}
                  domain={[0, quotaMs]}
                  tick={{ fill: '#FFFFFF' }}
                />
                <ReferenceLine
                  y={quotaMs}
                  stroke="#ef4444"
                  strokeDasharray="3 3"
                  label={{ value: 'Max', position: 'right' }}
                />
                <Tooltip
                  formatter={(value) => [`${value.toFixed(1)}ms`, 'CPU Time Used']}
                  labelFormatter={(value) => `${value}ms elapsed`}
                  contentStyle={{
                    backgroundColor: '#1a1a1a',
                    border: 'none',
                    borderRadius: '6px',
                    color: 'white'
                  }}
                  itemStyle={{ color: 'white' }}
                  labelStyle={{ color: 'white' }}
                />
                <Line
                  type="monotone"
                  dataKey="cpuTimeUsed"
                  stroke="#ffffff"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

    </div>
  );
};

export default CPUMetrics;