"use client";

import useSWR from "swr";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, AlertTriangle, DollarSign, Clock, CalendarDays, TrendingUp } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function KPICards() {
  const { data, isLoading } = useSWR("/api/stats", fetcher);

  if (isLoading || !data) return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-6 animate-pulse">
      {[...Array(6)].map((_, i) => (
        <Card key={i} className="bg-white border-slate-200 shadow-sm h-[120px]" />
      ))}
    </div>
  );

  const kpis = [
    {
      title: "Total Transactions",
      value: data.totalTransactions?.toLocaleString() || "0",
      icon: Activity,
      trend: "+12.5% vs yesterday",
      color: "text-blue-600",
      bg: "bg-blue-50"
    },
    {
      title: "Flagged (Fraud)",
      value: data.flaggedCount?.toLocaleString() || "0",
      icon: AlertTriangle,
      trend: `${data.fraudRate || 0}% rate`,
      color: "text-rose-600",
      bg: "bg-rose-50"
    },
    {
      title: "Impossible Travel",
      value: data.impossibleTravelCount?.toLocaleString() || "0",
      icon: DollarSign,
      trend: "Velocity alerts",
      color: "text-amber-600",
      bg: "bg-amber-50"
    },
    {
      title: "Highest Risk Node",
      value: data.topRiskCategory?.name || "N/A",
      icon: TrendingUp,
      trend: "By volume",
      color: "text-violet-600",
      bg: "bg-violet-50"
    },
    {
      title: "Peak Fraud Time",
      value: `${data.peakFraudHour || 0}:00 AM`,
      icon: Clock,
      trend: "UTC Standard",
      color: "text-emerald-600",
      bg: "bg-emerald-50"
    },
    {
      title: "Weekend Risk",
      value: `${data.weekendFraudPercent || 0}%`,
      icon: CalendarDays,
      trend: "Of all fraud",
      color: "text-cyan-600",
      bg: "bg-cyan-50"
    }
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-6">
      {kpis.map((kpi, i) => (
        <Card key={i} className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wide">{kpi.title}</CardTitle>
            <div className={`p-2 rounded-lg ${kpi.bg}`}>
              <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-black ${i === 1 ? 'text-rose-600' : 'text-slate-800'}`}>
              {kpi.value}
            </div>
            <p className="text-xs text-slate-500 mt-1 font-medium font-mono">
              {kpi.trend}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
