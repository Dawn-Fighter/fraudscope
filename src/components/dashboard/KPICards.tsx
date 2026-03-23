"use client";

import useSWR from "swr";
import { Activity, AlertTriangle, Plane, TrendingUp, Clock, CalendarDays } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function KPICards() {
  const { data, isLoading } = useSWR("/api/stats", fetcher);

  if (isLoading || !data) return (
    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-white/60 backdrop-blur rounded-2xl h-[120px] animate-pulse border border-stone-200/50" />
      ))}
    </div>
  );

  const kpis = [
    {
      title: "Total Transactions",
      value: data.totalTransactions?.toLocaleString() || "0",
      icon: Activity,
      subtitle: "All processed",
      accent: "bg-primary-600",
      iconBg: "bg-slate-50",
      iconColor: "text-slate-600",
    },
    {
      title: "Flagged Fraud",
      value: data.flaggedTransactions?.toLocaleString() || "0",
      icon: AlertTriangle,
      subtitle: `${data.fraudRate || 0}% rate`,
      accent: "bg-error",
      iconBg: "bg-red-50",
      iconColor: "text-red-600",
      highlight: true,
    },
    {
      title: "Impossible Travel",
      value: data.impossibleTravel?.toLocaleString() || "0",
      icon: Plane,
      subtitle: "Velocity alerts",
      accent: "bg-indigo-600",
      iconBg: "bg-indigo-50",
      iconColor: "text-indigo-600",
    },
    {
      title: "Top Risk Category",
      value: data.highestRiskCategory || "N/A",
      icon: TrendingUp,
      subtitle: `${data.topRiskCategory?.rate || 0}% rate`,
      accent: "bg-slate-400",
      iconBg: "bg-slate-50",
      iconColor: "text-slate-600",
    },
    {
      title: "Velocity Spike Users",
      value: data.velocitySpikeUsers?.toLocaleString() || "0",
      icon: Clock,
      subtitle: "UTC window",
      accent: "bg-slate-400",
      iconBg: "bg-slate-50",
      iconColor: "text-slate-600",
    },
    {
      title: "Fraud Rate",
      value: `${data.fraudRate || 0}%`,
      icon: CalendarDays,
      subtitle: "Weekly incidents",
      accent: "bg-slate-400",
      iconBg: "bg-slate-50",
      iconColor: "text-slate-600",
    }
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 text-slate-900">
      {kpis.map((kpi, i) => (
        <div 
          key={i} 
          className="relative bg-white rounded-xl p-3 border border-slate-200 shadow-soft hover:shadow-soft-lg transition-all group"
        >
          {/* Accent bar */}
          <div className={`absolute top-0 left-0 right-0 h-1 ${kpi.accent} rounded-t-2xl`} />
          
          <div className="flex items-center gap-2 mb-2">
            <div className={`${kpi.iconBg} p-2 rounded-lg border border-slate-100 group-hover:bg-white group-hover:scale-105 transition-all`}>
              <kpi.icon className={`h-4 w-4 ${kpi.iconColor}`} />
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{kpi.title}</p>
          </div>
          
          <div className="space-y-0.5">
            <p className={`text-xl font-bold tracking-tight ${kpi.highlight ? 'text-error' : 'text-slate-900'}`}>
              {kpi.value}
            </p>
            <p className="text-[10px] font-medium text-slate-400">{kpi.subtitle}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
