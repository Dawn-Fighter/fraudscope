"use client";

import useSWR from "swr";
import { KPICards } from "@/components/dashboard/KPICards";
import { HeatmapChart } from "@/components/dashboard/HeatmapChart";
import { VelocityChart } from "@/components/dashboard/VelocityChart";
import { MerchantChart } from "@/components/dashboard/MerchantChart";
import { CityChart } from "@/components/dashboard/CityChart";
import { FalsePositiveChart } from "@/components/dashboard/FalsePositiveChart";
import { LiveFeed } from "@/components/dashboard/LiveFeed";
import { ImpossibleTravelFeed } from "@/components/dashboard/Feeds";
import { FlaggedCategoryChart } from "@/components/dashboard/FlaggedCategoryChart";
import { ThreatRadarChart } from "@/components/dashboard/ThreatRadarChart";
import { AIChat } from "@/components/ai/AIChat";
import { Shield, Sparkles, TrendingUp, Zap } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Dashboard() {
  const { data: stats } = useSWR("/api/stats", fetcher);

  return (
    <div className="min-h-screen bg-slate-50 relative pb-20">
      {/* Subtle Grid Pattern */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#00000004_1px,transparent_1px),linear-gradient(to_bottom,#00000004_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      {/* Main Content */}
      <div className="relative z-10 font-outfit">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200">
          <div className="mx-auto px-4 py-3 items-center">
            <div className="flex items-center justify-between">
              {/* Logo & Brand */}
              <div className="flex items-center gap-3">
                <div className="bg-primary-600 p-2 rounded-xl shadow-sm">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                    Fraud<span className="text-primary-600">Shield</span>
                  </h1>
                </div>
              </div>

              {/* Quick Stats Pills */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                  <Zap className="h-3.5 w-3.5 text-slate-500" />
                  <span className="text-xs font-bold text-slate-700">
                    {stats?.totalTransactions?.toLocaleString() || '---'} Txns
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                  <TrendingUp className="h-3.5 w-3.5 text-primary-600" />
                  <span className="text-xs font-bold text-slate-700">
                    {stats?.fraudRate || '---'}% Fraud
                  </span>
                </div>
                <a 
                  href="/api/onepager" 
                  target="_blank"
                  className="flex items-center gap-2 bg-slate-900 px-4 py-2 rounded-lg text-white font-semibold text-xs hover:bg-slate-800 transition-colors"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Export Data
                </a>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Grid */}
        <main className="mx-auto px-4 py-4">
          {/* Hero KPI Section */}
          <section className="mb-4">
            <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">Core Analytics</h2>
            <KPICards />
          </section>

          {/* Dashboard Layout */}
          <div className="flex flex-col xl:flex-row gap-4">
            {/* Left Column (Main Content) */}
            <div className="flex-1 flex flex-col gap-4 min-w-0">
              <VelocityChart />
              <HeatmapChart />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <MerchantChart />
                <CityChart />
              </div>

              {/* Risk Section */}
              <section className="mt-2">
                <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">Risk Intelligence</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FalsePositiveChart />
                  <ImpossibleTravelFeed />
                </div>
              </section>

              {/* Threat Intelligence Section */}
              <section className="mt-2">
                <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">Threat Intelligence</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ThreatRadarChart />
                  <FlaggedCategoryChart />
                </div>
              </section>
            </div>

            {/* Right Column (Sidebar) */}
            <div className="w-full xl:w-[380px] shrink-0">
              <div className="sticky top-[80px] h-[calc(100vh-100px)]">
                <LiveFeed />
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Floating AI Chat */}
      <AIChat />
    </div>
  );
}
