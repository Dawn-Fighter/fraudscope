"use client";

import useSWR from "swr";
import { RadialBarChart, RadialBar, Legend, ResponsiveContainer, Tooltip } from "recharts";
import { ShieldAlert } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface MerchantData {
  name: string;
  value: number;
}

export function FlaggedCategoryChart() {
  const { data, isLoading } = useSWR("/api/merchant", fetcher);

  if (isLoading || !data) {
    return <div className="bg-white rounded-3xl h-[400px] animate-pulse border border-slate-200/50 shadow-soft" />;
  }

  // Define unique colors for the different categories
  const colorMap: Record<string, string> = {
    'Crypto Exchange': '#F43F5E', // Rose
    'Electronics': '#F59E0B',     // Amber
    'Groceries': '#14B8A6',       // Teal
    'Dining': '#6366F1',          // Indigo
    'Retail': '#8B5CF6',          // Violet
    'Travel': '#EC4899',          // Pink
  };

  // Only map the actual flagged transactions and assign colors
  const chartData = data
    .map((d: any) => ({
      name: d.name,
      value: d.flagged,
      fill: colorMap[d.name] || '#94A3B8'
    }))
    .filter((d: MerchantData) => d.value > 0)
    .sort((a: MerchantData, b: MerchantData) => a.value - b.value); // Sort ascending for RadialBar so largest is outermost

  return (
    <div className="bg-white rounded-3xl border border-rose-100 shadow-soft overflow-hidden h-[400px] flex flex-col relative">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="p-5 border-b border-rose-50 bg-gradient-to-r from-white to-rose-50/30 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-rose-500 to-pink-600 p-2.5 rounded-2xl text-white shadow-sm shadow-rose-200">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Risk Vectors</h3>
              <p className="text-xs text-slate-500 font-medium">Categories highly targeted by fraud</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Area */}
      <div className="p-5 flex-1 min-h-0 relative z-10 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart 
            cx="50%" 
            cy="50%" 
            innerRadius="50%" 
            outerRadius="100%" 
            barSize={24} 
            data={chartData}
            startAngle={180}
            endAngle={-180}
          >
            <RadialBar
              background={{ fill: '#f1f5f9' }}
              dataKey="value"
              cornerRadius={12}
            />
            <Tooltip 
              cursor={{ fill: 'transparent' }}
              contentStyle={{ 
                backgroundColor: '#0F172A', 
                border: 'none',
                borderRadius: '12px', 
                color: '#fff',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                padding: '12px 16px'
              }}
              formatter={(value: any, name: any, props: any) => [`${value.toLocaleString()} flags`, props.payload.name]}
              itemStyle={{ fontSize: '12px', fontWeight: 600, color: '#fff' }}
              labelStyle={{ display: 'none' }}
            />
            <Legend 
              iconSize={10} 
              layout="vertical" 
              verticalAlign="middle" 
              align="right"
              wrapperStyle={{
                fontSize: '12px',
                fontWeight: 600,
                color: '#475569'
              }}
              formatter={(value, entry: any) => <span className="text-slate-700">{value}</span>}
            />
          </RadialBarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}