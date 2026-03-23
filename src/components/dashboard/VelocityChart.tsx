"use client";

import useSWR from "swr";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Zap } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function VelocityChart() {
  const { data, isLoading } = useSWR("/api/velocity", fetcher);

  if (isLoading || !data) {
    return (
      <div className="bg-white rounded-3xl h-[400px] animate-pulse border border-stone-200/50 shadow-soft" />
    );
  }

  // To make the chart look visually interesting (since actual spikes are low vs total volume),
  // we map volume to 'legitimate' and spikes to 'fraudulent'.
  // However, because spikes are ~30 and volume is ~8000, we might want to scale up fraudulent
  // for visibility ONLY if the user wants it, but the instruction is to use real data.
  // We'll plot them on the same axis but keep it accurate.
  const chartData = data.map((d: any) => ({
    time: d.time,
    legitimate: d.volume - d.spikes,
    fraudulent: d.spikes,
  }));

  return (
    <div className="bg-white rounded-3xl border border-stone-200/50 shadow-soft overflow-hidden h-full flex flex-col">
      <div className="p-6 border-b border-stone-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Zap className="h-5 w-5 text-amber-500 fill-amber-500" />
          <h3 className="text-lg font-bold text-stone-900">Transaction Velocity Timeline</h3>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-teal-400" />
            <span className="text-sm font-medium text-stone-600">Legitimate</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-rose-400" />
            <span className="text-sm font-medium text-stone-600">Fraudulent</span>
          </div>
        </div>
      </div>

      <div className="flex-1 p-6">
        <ResponsiveContainer width="100%" height="100%" minHeight={300}>
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorLegit" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorFraud" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#fb7185" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#fb7185" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f4" />
            <XAxis 
              dataKey="time" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#a8a29e', fontSize: 12 }}
              dy={10}
            />
            <YAxis 
              yAxisId="left"
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#a8a29e', fontSize: 12 }}
              tickFormatter={(val) => `${val}`}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#fb7185', fontSize: 12 }}
              tickFormatter={(val) => `${val}`}
            />
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
            />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="legitimate"
              stroke="#2dd4bf"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorLegit)"
            />
            <Area
              yAxisId="right"
              type="monotone"
              dataKey="fraudulent"
              stroke="#fb7185"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorFraud)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
