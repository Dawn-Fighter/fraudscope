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

          {/* Main Charts Grid */}
          <section className="grid grid-cols-12 gap-4 mb-4">
            {/* Velocity */}
            <div className="col-span-12 xl:col-span-8">
              <VelocityChart />
            </div>

            {/* Live Feed - Extended Sidebar */}
            <div className="col-span-12 xl:col-span-4 xl:row-span-4 self-start sticky top-[70px]">
              <LiveFeed />
            </div>

            {/* Heatmap - Lifted directly below Velocity */}
            <div className="col-span-12 xl:col-span-8 -mt-2">
              <HeatmapChart />
            </div>
            
            {/* Risk Factors Row - Lifted below Heatmap */}
            <div className="col-span-12 lg:col-span-4 xl:col-span-4 -mt-2">
              <MerchantChart />
            </div>
            <div className="col-span-12 lg:col-span-4 xl:col-span-4 -mt-2">
              <CityChart />
            </div>
          </section>

          {/* Risk Section */}
          <section className="mb-4">
            <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">Risk Intelligence</h2>
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 lg:col-span-6">
                <FalsePositiveChart />
              </div>
              <div className="col-span-12 lg:col-span-6">
                <ImpossibleTravelFeed />
              </div>
            </div>
          </section>

          {/* Flagged Categories Section */}
          <section>
            <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Fraud Distribution</h2>
            <FlaggedCategoryChart />
          </section>
        </main>
      </div>

      {/* Floating AI Chat */}
      <AIChat />
    </div>
  );
}
