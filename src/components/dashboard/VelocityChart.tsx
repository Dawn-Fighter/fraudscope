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
      <div className="bg-white rounded-2xl h-[400px] animate-pulse border border-slate-200 shadow-soft" />
    );
  }

  // To make the chart look visually interesting (since actual spikes are low vs total volume),
  // we map volume to 'legitimate' and spikes to 'fraudulent'.
  // However, because spikes are ~30 and volume is ~8000, we might want to scale up fraudulent
  // for visibility ONLY if the user wants it, but the instruction is to use real data.
  // We'll plot them on the same axis but keep it accurate.
  const chartData = data.map((d: { time: string, volume: number, spikes: number }) => ({
    time: d.time,
    legitimate: d.volume - d.spikes,
    fraudulent: d.spikes,
  }));

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-soft overflow-hidden h-[300px] flex flex-col">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Zap className="h-5 w-5 text-indigo-500 fill-indigo-500" />
          <h3 className="text-lg font-bold text-slate-900 tracking-tight">Transaction Velocity</h3>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-slate-300" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Legitimate</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-indigo-500" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Fraudulent</span>
          </div>
        </div>
      </div>

      <div className="flex-1 p-6">
        <ResponsiveContainer width="100%" height="100%" minHeight={150}>
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorLegit" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#94A3B8" stopOpacity={0.1} />
                <stop offset="95%" stopColor="#94A3B8" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorFraud" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366F1" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#CBD5E1" />
            <XAxis 
              dataKey="time" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 500 }}
              dy={10}
            />
            <YAxis 
              yAxisId="left"
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 500 }}
              tickFormatter={(val) => `${val}`}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#6366F1', fontSize: 10, fontWeight: 600 }}
              tickFormatter={(val) => `${val}`}
            />
            <Tooltip 
              cursor={{ stroke: '#E2E8F0', strokeWidth: 1 }}
              contentStyle={{ 
                backgroundColor: '#0F172A', 
                border: 'none',
                borderRadius: '12px', 
                color: '#fff',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                padding: '12px 16px'
              }}
            />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="legitimate"
              stroke="#CBD5E1"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorLegit)"
            />
            <Area
              yAxisId="right"
              type="monotone"
              dataKey="fraudulent"
              stroke="#6366F1"
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
