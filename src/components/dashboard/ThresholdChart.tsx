"use client";

import useSWR from "swr";
import { ScatterChart, Scatter, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, ZAxis } from "recharts";
import { DollarSign, AlertTriangle } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface Transaction {
  transactionId: string;
  userId: string;
  amount: number;
  city: string;
}

export function ThresholdChart() {
  const { data, isLoading } = useSWR<Transaction[]>("/api/feed", fetcher);

  if (isLoading || !data) {
    return <div className="bg-white rounded-2xl h-[400px] animate-pulse border border-slate-200 shadow-soft" />;
  }

  const scatterData = data.slice(0, 50).map((tx, i) => ({
    x: i,
    y: tx.amount,
    id: tx.transactionId,
    user: tx.userId,
    city: tx.city,
  }));

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-soft overflow-hidden h-full">
      {/* Header */}
      <div className="p-5 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-slate-100 p-2 rounded-xl text-primary-600">
              <DollarSign className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">$500 Threshold</h3>
              <p className="text-xs text-slate-400 font-medium whitespace-nowrap">Fraud distribution analysis</p>
            </div>
          </div>
          
          {/* Alert Badge */}
          <div className="flex items-center gap-2 bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg border border-slate-200">
            <AlertTriangle className="h-3.5 w-3.5 text-warning" />
            <span className="text-[10px] font-bold uppercase tracking-widest leading-none">High Risk Window</span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="p-5">
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 10 }}>
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
                stroke="#94A3B8"
                tick={{ fontSize: 10, fontWeight: 700 }}
                tickFormatter={(v) => `$${v}`}
                domain={[0, 'auto']}
                axisLine={false}
                tickLine={false}
              />
              <ZAxis range={[40, 40]} />
              <Tooltip 
                cursor={{ strokeDasharray: '3 3', stroke: '#E2E8F0' }}
                contentStyle={{ 
                  backgroundColor: '#0F172A', 
                  border: 'none',
                  borderRadius: '12px', 
                  color: '#fff',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  padding: '12px 16px'
                }}
                formatter={(value: any) => [`$${value.toLocaleString()}`, 'Amount']}
                labelFormatter={() => ''}
              />
              {/* $500 Threshold Line */}
              <ReferenceLine 
                y={500} 
                stroke="#64748B"
                strokeWidth={2}
                strokeDasharray="4 4"
                label={{ 
                  value: '$500 LIMIT', 
                  position: 'right',
                  fill: '#64748B',
                  fontSize: 9,
                  fontWeight: 800,
                  letterSpacing: '0.1em'
                }}
              />
              <Scatter 
                name="Transactions" 
                data={scatterData} 
                fill="#6366F1"
                fillOpacity={0.8}
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
