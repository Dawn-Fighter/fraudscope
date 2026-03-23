"use client";

import useSWR from "swr";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScatterChart, Scatter, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, CartesianGrid } from "recharts";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function ThresholdChart() {
  const { data, isLoading } = useSWR("/api/feed", fetcher);

  if (isLoading || !data) return <Card className="h-[400px] animate-pulse bg-white border-slate-200" />;

  // We'll use the feed data for scatter, formatting timestamp for X axis
  const scatterData = data.slice(0, 100).map((d: any) => ({
    time: new Date(d.timestamp).getTime(),
    amount: d.amount,
    id: d.transactionId,
    city: d.city
  }));

  const minTime = Math.min(...scatterData.map((d: any) => d.time));
  const maxTime = Math.max(...scatterData.map((d: any) => d.time));

  return (
    <Card className="h-full border-slate-200 bg-white shadow-sm overflow-hidden">
      <CardHeader className="pb-2 border-b border-slate-100 bg-slate-50/50">
        <CardTitle className="text-slate-800 text-base font-bold">$500 Rule Detection Matrix</CardTitle>
        <CardDescription className="text-slate-500 font-medium">All flagged items bypass the $500 threshold</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis 
                type="number" 
                dataKey="time" 
                domain={[minTime, maxTime]} 
                name="Time" 
                tickFormatter={(time) => new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                stroke="#64748b"
                tick={{ fontSize: 11, fontWeight: 600 }}
                axisLine={{ stroke: '#e2e8f0' }}
                tickLine={false}
              />
              <YAxis 
                type="number" 
                dataKey="amount" 
                name="Amount" 
                domain={[0, 3000]} 
                tickFormatter={(v) => `$${v}`}
                stroke="#64748b"
                tick={{ fontSize: 11, fontWeight: 600 }}
                axisLine={{ stroke: '#e2e8f0' }}
                tickLine={false}
              />
              <Tooltip 
                cursor={{ strokeDasharray: '3 3', stroke: '#cbd5e1' }}
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
                formatter={(value: number, name: string) => {
                  if (name === "Amount") return [`$${value.toFixed(2)}`, "Amount"];
                  if (name === "Time") return [new Date(value).toLocaleTimeString(), "Time"];
                  return [value, name];
                }}
              />
              <ReferenceLine y={500} stroke="#ef4444" strokeDasharray="3 3" label={{ position: 'top', value: '$500 Risk Threshold', fill: '#ef4444', fontSize: 12, fontWeight: 'bold' }} />
              <Scatter data={scatterData} fill="#ef4444" shape="circle" line={{ stroke: '#fca5a5', strokeWidth: 1 }} />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
