"use client";

import useSWR from "swr";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from "recharts";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function CityChart() {
  const { data, isLoading } = useSWR("/api/cities", fetcher);

  if (isLoading || !data) return <Card className="h-[350px] animate-pulse bg-white border-slate-200" />;

  const chartData = data.map((d: any) => ({
    name: d.city,
    amount: Math.round(d.fraudAmount),
  })).sort((a: any, b: any) => b.amount - a.amount);

  return (
    <Card className="border-slate-200 bg-white shadow-sm overflow-hidden">
      <CardHeader className="pb-2 border-b border-slate-100 bg-slate-50/50">
        <CardTitle className="text-slate-800 text-base font-bold">Risk Exposure by City</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 30, left: 40, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={true} stroke="#f1f5f9" />
              <XAxis type="number" stroke="#64748b" tickFormatter={(v) => `$${v/1000}k`} tick={{ fontSize: 12, fontWeight: 600 }} axisLine={{ stroke: '#e2e8f0' }} tickLine={false} />
              <YAxis dataKey="name" type="category" stroke="#475569" width={60} tick={{ fontSize: 11, fontWeight: 600 }} axisLine={false} tickLine={false} />
              <Tooltip 
                cursor={{fill: '#f8fafc'}}
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
                formatter={(value: number) => [`$${value.toLocaleString()}`, 'Exposure']}
              />
              <Bar dataKey="amount" radius={[0, 4, 4, 0]} barSize={24}>
                {chartData.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={index < 2 ? '#ef4444' : '#64748b'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}