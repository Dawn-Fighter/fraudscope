"use client";

import useSWR from "swr";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { ValueType, NameType } from "recharts/types/component/DefaultTooltipContent";
import { Store } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function MerchantChart() {
  const { data, isLoading } = useSWR("/api/merchant", fetcher);

  if (isLoading || !data) {
    return <div className="bg-white rounded-3xl h-[350px] animate-pulse border border-stone-200/50 shadow-soft" />;
  }

  const chartData = data.map((d: any) => ({
    name: d.name,
    rate: d.fraudRate,
    flags: d.flagged
  })).sort((a: any, b: any) => b.rate - a.rate);

  const getBarColor = (rate: number) => {
    if (rate > 3) return "#6366F1"; // Indigo primay
    return "#94A3B8"; // Slate muted
  };

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
            <p className="text-xs text-slate-400 font-medium">Fraud rate by merchant type</p>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="p-5 flex-1 min-h-0">
        <div className="h-full w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 30, left: 10, bottom: 0 }}>
              <XAxis 
                type="number" 
                stroke="#94A3B8" 
                tickFormatter={(v) => `${v}%`} 
                tick={{ fontSize: 10, fontWeight: 700 }} 
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                dataKey="name" 
                type="category" 
                stroke="#64748B" 
                width={85} 
                tick={{ fontSize: 10, fontWeight: 700 }} 
                axisLine={false} 
                tickLine={false}
              />
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
                formatter={(value: ValueType) => [`${value}%`, 'Fraud Rate']}
                labelStyle={{ color: '#94A3B8', marginBottom: '4px', fontSize: '10px', fontWeight: 700 }}
              />
              <Bar dataKey="rate" radius={[0, 4, 4, 0]} barSize={24}>
                {chartData.map((_entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(chartData[index].rate)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
