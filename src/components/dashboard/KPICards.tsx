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
      accent: "bg-primary-500",
      bgClass: "bg-white hover:bg-slate-50",
      iconBg: "bg-primary-50 text-primary-600 border-primary-100",
    },
    {
      title: "Flagged Fraud",
      value: data.flaggedTransactions?.toLocaleString() || "0",
      icon: AlertTriangle,
      subtitle: `${data.fraudRate || 0}% rate`,
      accent: "bg-rose-500",
      bgClass: "bg-white hover:bg-slate-50",
      iconBg: "bg-rose-50 text-rose-600 border-rose-100",
      highlight: true,
    },
    {
      title: "Impossible Travel",
      value: data.impossibleTravel?.toLocaleString() || "0",
      icon: Plane,
      subtitle: "Velocity alerts",
      accent: "bg-rose-500",
      bgClass: "bg-white hover:bg-slate-50",
      iconBg: "bg-rose-50 text-rose-600 border-rose-100",
      highlight: true,
    },
    {
      title: "Top Risk Category",
      value: data.highestRiskCategory || "N/A",
      icon: TrendingUp,
      subtitle: `${data.topRiskCategory?.rate || 0}% rate`,
      accent: "bg-primary-500",
      bgClass: "bg-white hover:bg-slate-50",
      iconBg: "bg-primary-50 text-primary-600 border-primary-100",
    },
    {
      title: "Velocity Spike Users",
      value: data.velocitySpikeUsers?.toLocaleString() || "0",
      icon: Clock,
      subtitle: "UTC window",
      accent: "bg-rose-500",
      bgClass: "bg-white hover:bg-slate-50",
      iconBg: "bg-rose-50 text-rose-600 border-rose-100",
      highlight: true,
    },
    {
      title: "Fraud Rate",
      value: `${data.fraudRate || 0}%`,
      icon: CalendarDays,
      subtitle: "Weekly incidents",
      accent: "bg-primary-500",
      bgClass: "bg-white hover:bg-slate-50 text-slate-900",
      iconBg: "bg-primary-50 text-primary-600 border-primary-100",
      darkTheme: false,
    }
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 text-slate-900">
      {kpis.map((kpi, i) => (
        <div 
          key={i} 
          className={`relative rounded-2xl p-5 border shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group overflow-hidden ${kpi.bgClass || 'bg-white border-slate-200'}`}
        >
          {/* Subtle Accent Glow */}
          {!kpi.darkTheme && (
            <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-10 ${kpi.accent} pointer-events-none`} />
          )}
          
          <div className="flex items-center gap-3 mb-4">
            <div className={`${kpi.iconBg} p-2.5 rounded-xl border group-hover:scale-110 transition-transform duration-300`}>
              <kpi.icon className="h-4 w-4" />
            </div>
            <p className={`text-[10px] font-bold uppercase tracking-widest ${kpi.darkTheme ? 'text-primary-200' : 'text-slate-500'} leading-tight`}>
              {kpi.title}
            </p>
          </div>
          
          <div className="space-y-1 relative z-10">
            <p className={`text-3xl font-black tracking-tight ${kpi.highlight ? 'text-rose-600' : kpi.darkTheme ? 'text-white' : 'text-slate-900'}`}>
              {kpi.value}
            </p>
            <p className={`text-[11px] font-bold uppercase tracking-wider ${kpi.darkTheme ? 'text-primary-300' : 'text-slate-400'}`}>
              {kpi.subtitle}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
