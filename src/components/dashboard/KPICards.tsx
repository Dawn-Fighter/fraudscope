"use client";

import useSWR from "swr";
import { Activity, AlertTriangle, Plane, TrendingUp, Clock, CalendarDays } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function KPICards() {
  const { data, isLoading } = useSWR("/api/stats", fetcher);

  if (isLoading || !data) return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-white/60 backdrop-blur rounded-3xl h-[140px] animate-pulse border border-stone-200/50" />
      ))}
    </div>
  );

  const kpis = [
    {
      title: "Total Transactions",
      value: data.totalTransactions?.toLocaleString() || "0",
      icon: Activity,
      subtitle: "All processed",
      gradient: "from-primary-500 to-primary-600",
      iconBg: "bg-primary-100",
      iconColor: "text-primary-600",
      glow: "shadow-glow-primary",
    },
    {
      title: "Flagged Fraud",
      value: data.flaggedCount?.toLocaleString() || "0",
      icon: AlertTriangle,
      subtitle: `${data.fraudRate || 0}% rate`,
      gradient: "from-coral-500 to-pink-500",
      iconBg: "bg-coral-100",
      iconColor: "text-coral-600",
      glow: "shadow-glow-coral",
      highlight: true,
    },
    {
      title: "Impossible Travel",
      value: data.impossibleTravelCount?.toLocaleString() || "0",
      icon: Plane,
      subtitle: "Velocity alerts",
      gradient: "from-teal-500 to-teal-600",
      iconBg: "bg-teal-100",
      iconColor: "text-teal-600",
      glow: "shadow-glow-teal",
    },
    {
      title: "Top Risk Category",
      value: data.topRiskCategory?.name || "N/A",
      icon: TrendingUp,
      subtitle: `${data.topRiskCategory?.rate || 0}% fraud rate`,
      gradient: "from-pink-500 to-rose-500",
      iconBg: "bg-pink-100",
      iconColor: "text-pink-600",
    },
    {
      title: "Peak Fraud Hour",
      value: `${data.peakFraudHour || 0}:00`,
      icon: Clock,
      subtitle: "UTC timezone",
      gradient: "from-violet-500 to-purple-600",
      iconBg: "bg-violet-100",
      iconColor: "text-violet-600",
    },
    {
      title: "Weekend Fraud",
      value: `${data.weekendFraudPercent || 0}%`,
      icon: CalendarDays,
      subtitle: "Sat-Sun incidents",
      gradient: "from-amber-500 to-orange-500",
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
      {kpis.map((kpi, i) => (
        <div 
          key={i} 
          className={`
            relative overflow-hidden bg-white rounded-3xl p-5 border border-stone-200/50 
            shadow-soft card-hover group
            ${kpi.highlight ? kpi.glow : ''}
          `}
        >
          {/* Gradient accent bar */}
          <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${kpi.gradient}`} />
          
          {/* Content */}
          <div className="flex items-start justify-between mb-3">
            <div className={`${kpi.iconBg} p-2.5 rounded-2xl group-hover:scale-110 transition-transform`}>
              <kpi.icon className={`h-5 w-5 ${kpi.iconColor}`} />
            </div>
          </div>
          
          <div className="space-y-1">
            <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide">{kpi.title}</p>
            <p className={`text-2xl font-extrabold tracking-tight ${kpi.highlight ? 'gradient-text' : 'text-stone-900'}`}>
              {kpi.value}
            </p>
            <p className="text-xs font-medium text-stone-400">{kpi.subtitle}</p>
          </div>

          {/* Decorative gradient blob */}
          <div className={`absolute -bottom-8 -right-8 w-24 h-24 rounded-full bg-gradient-to-br ${kpi.gradient} opacity-10 blur-xl group-hover:opacity-20 transition-opacity`} />
        </div>
      ))}
    </div>
  );
}
