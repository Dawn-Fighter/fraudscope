"use client";

import useSWR from "swr";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Store } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function MerchantChart() {
  const { data, isLoading } = useSWR("/api/merchant", fetcher);

  if (isLoading || !data) {
    return <div className="bg-white rounded-3xl h-[350px] animate-pulse border border-stone-200/50 shadow-soft" />;
  }

  const chartData = data.map((d: any) => ({
    name: d.category,
    rate: d.fraudRate,
    flags: d.flagged
  })).sort((a: any, b: any) => b.rate - a.rate);

  const getBarColor = (rate: number) => {
    if (rate > 3) return "#F97316"; // coral
    if (rate > 1) return "#EC4899"; // pink
    return "#7C3AED"; // primary
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200/50 shadow-soft overflow-hidden h-full">
      {/* Header */}
      <div className="p-5 border-b border-stone-100">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-primary-500 to-pink-500 p-2.5 rounded-2xl">
            <Store className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-base font-bold text-stone-900">Category Risk</h3>
            <p className="text-xs text-stone-500">Fraud rate by merchant type</p>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="p-5">
        <div className="h-[240px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
              <XAxis 
                type="number" 
                stroke="#A8A29E" 
                tickFormatter={(v) => `${v}%`} 
                tick={{ fontSize: 11, fontWeight: 600 }} 
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                dataKey="name" 
                type="category" 
                stroke="#78716C" 
                width={85} 
                tick={{ fontSize: 11, fontWeight: 600 }} 
                axisLine={false} 
                tickLine={false}
              />
              <Tooltip 
                cursor={{ fill: '#FAFAF9', radius: 8 }}
                contentStyle={{ 
                  backgroundColor: '#1C1917', 
                  border: 'none',
                  borderRadius: '12px', 
                  color: '#fff',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
                  padding: '12px 16px'
                }}
                formatter={(value: number) => [`${value}%`, 'Fraud Rate']}
                labelStyle={{ color: '#A8A29E', marginBottom: '4px', fontSize: '11px' }}
              />
              <Bar dataKey="rate" radius={[0, 8, 8, 0]} barSize={28}>
                {chartData.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(entry.rate)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
