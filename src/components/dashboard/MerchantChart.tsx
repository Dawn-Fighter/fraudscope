"use client";

import useSWR from "swr";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Store } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function MerchantChart() {
  const { data, isLoading } = useSWR("/api/merchant", fetcher);

  if (isLoading || !data) {
    return <div className="bg-white rounded-3xl h-[380px] animate-pulse border border-slate-200 shadow-soft" />;
  }

  const chartData = data.map((d: any) => ({
    name: d.name,
    value: d.flagged // Using absolute flagged count for pie slices
  })).sort((a: any, b: any) => b.value - a.value);

  const COLORS = ["#4F46E5", "#6366F1", "#818CF8", "#A5B4FC", "#C7D2FE", "#E0E7FF"];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-soft overflow-hidden h-[380px] flex flex-col">
      {/* Header */}
      <div className="p-5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="bg-slate-100 p-2 rounded-xl text-primary-600">
            <Store className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Category Risk</h3>
            <p className="text-xs text-slate-400 font-medium">Fraud incidents by merchant type</p>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="p-5 flex-1 min-h-0">
        <div className="h-full w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="45%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
                stroke="none"
              >
                {chartData.map((_entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                cursor={{ fill: '#F8FAFC', radius: 4 }}
                contentStyle={{ 
                  backgroundColor: '#0F172A', 
                  border: 'none',
                  borderRadius: '12px', 
                  color: '#fff',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  padding: '12px 16px'
                }}
                formatter={(value: number) => [`${value} incidents`, 'Fraud Count']}
                itemStyle={{ fontSize: '12px', fontWeight: 600, color: '#fff' }}
              />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                iconType="circle"
                iconSize={8}
                formatter={(value) => <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
          {/* Inner Text overlay for Donut */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none -mt-8">
            <div className="text-center">
              <div className="text-2xl font-black text-slate-900 tracking-tighter">
                {chartData.reduce((acc: number, cur: any) => acc + cur.value, 0)}
              </div>
              <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Total Flags</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
