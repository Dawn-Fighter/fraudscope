"use client";

import useSWR from "swr";
import { ScatterChart, Scatter, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, ZAxis } from "recharts";
import { DollarSign, AlertTriangle } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function ThresholdChart() {
  const { data, isLoading } = useSWR("/api/feed", fetcher);

  if (isLoading || !data) {
    return <div className="bg-white rounded-3xl h-[400px] animate-pulse border border-stone-200/50 shadow-soft" />;
  }

  const scatterData = data.slice(0, 50).map((tx: any, i: number) => ({
    x: i,
    y: tx.amount,
    id: tx.transactionId,
    user: tx.userId,
    city: tx.city,
  }));

  return (
    <div className="bg-white rounded-3xl border border-stone-200/50 shadow-soft overflow-hidden h-full">
      {/* Header */}
      <div className="p-5 border-b border-stone-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-coral-500 to-rose-500 p-2.5 rounded-2xl">
              <DollarSign className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900">$500 Threshold Analysis</h3>
              <p className="text-xs text-stone-500">All fraud occurs above this amount</p>
            </div>
          </div>
          
          {/* Alert Badge */}
          <div className="flex items-center gap-2 bg-coral-50 text-coral-700 px-4 py-2 rounded-full border border-coral-200">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-xs font-bold">100% &gt; $500</span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="p-5">
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <XAxis 
                type="number" 
                dataKey="x" 
                name="Index" 
                tick={{ fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                hide
              />
              <YAxis 
                type="number" 
                dataKey="y" 
                name="Amount" 
                stroke="#A8A29E"
                tick={{ fontSize: 11, fontWeight: 600 }}
                tickFormatter={(v) => `$${v}`}
                domain={[0, 'auto']}
                axisLine={false}
                tickLine={false}
              />
              <ZAxis range={[60, 60]} />
              <Tooltip 
                cursor={{ strokeDasharray: '3 3', stroke: '#D6D3D1' }}
                contentStyle={{ 
                  backgroundColor: '#1C1917', 
                  border: 'none',
                  borderRadius: '12px', 
                  color: '#fff',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
                  padding: '12px 16px'
                }}
                formatter={(value: number) => [`$${value.toLocaleString()}`, 'Amount']}
                labelFormatter={() => ''}
              />
              {/* $500 Threshold Line */}
              <ReferenceLine 
                y={500} 
                stroke="#F97316"
                strokeWidth={2}
                strokeDasharray="8 4"
                label={{ 
                  value: '$500 THRESHOLD', 
                  position: 'right',
                  fill: '#F97316',
                  fontSize: 10,
                  fontWeight: 700,
                }}
              />
              <Scatter 
                name="Transactions" 
                data={scatterData} 
                fill="#EC4899"
                fillOpacity={0.7}
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
