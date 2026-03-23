"use client";

import useSWR from "swr";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Store } from "lucide-react";


interface MerchantData {
  name: string;
  value: number;
}

export function MerchantChart() {
  const { data, isLoading } = useSWR("/api/merchant");

  if (isLoading || !data) {
    return <div className="bg-white rounded-2xl h-full min-h-[420px] animate-pulse border border-slate-200 shadow-soft" />;
  }

  const chartData: MerchantData[] = data.map((d: any) => {
    return {
      name: d.name,
      value: d.value // Graph total transactions, so we can use all actual categories naturally!
    };
  })
  .filter((d: MerchantData) => d.value > 0)
  .sort((a: MerchantData, b: MerchantData) => b.value - a.value);

  // Distinct, professional color palette for categories
  const COLORS = [
    "#6366F1", // Indigo
    "#EC4899", // Rose
    "#14B8A6", // Teal
    "#F59E0B", // Amber
    "#8B5CF6", // Violet
    "#10B981", // Emerald
    "#F43F5E", // Red
    "#3B82F6", // Blue
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-soft overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="p-5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="bg-slate-100 p-2 rounded-xl text-primary-600">
            <Store className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Transaction Volume</h3>
            <p className="text-xs text-slate-400 font-medium">Total transactions by category</p>
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
                innerRadius={80}
                outerRadius={120}
                paddingAngle={3}
                dataKey="value"
                stroke="none"
              >
                {chartData.map((_entry: MerchantData, index: number) => (
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
                formatter={(value: any) => [value.toLocaleString(), 'Transactions']}
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
                {chartData.reduce((acc: number, cur: MerchantData) => acc + cur.value, 0).toLocaleString()}
              </div>
              <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Total Txns</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
