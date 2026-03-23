"use client";

import { KPICards } from "@/components/dashboard/KPICards";
import { HeatmapChart } from "@/components/dashboard/HeatmapChart";
import { VelocityChart } from "@/components/dashboard/VelocityChart";
import { MerchantChart } from "@/components/dashboard/MerchantChart";
import { CityChart } from "@/components/dashboard/CityChart";
import { ThresholdChart } from "@/components/dashboard/ThresholdChart";
import { LiveFeed } from "@/components/dashboard/LiveFeed";
import { ImpossibleTravelFeed, RepeatOffendersList } from "@/components/dashboard/Feeds";
import { AIChat } from "@/components/ai/AIChat";
import { Shield, Sparkles, TrendingUp, Zap } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-stone-50 relative overflow-hidden">
      {/* Decorative Background Blobs */}
      <div className="blob w-[600px] h-[600px] bg-primary-200 top-[-200px] right-[-100px] fixed" />
      <div className="blob w-[500px] h-[500px] bg-coral-200 bottom-[-150px] left-[-100px] fixed" />
      <div className="blob w-[400px] h-[400px] bg-teal-200 top-[40%] left-[30%] fixed" />
      
      {/* Subtle Grid Pattern */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />

      {/* Main Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="sticky top-0 z-40 glass border-b border-stone-200/50">
          <div className="max-w-[1800px] mx-auto px-8 py-5">
            <div className="flex items-center justify-between">
              {/* Logo & Brand */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-coral-500 rounded-2xl blur-lg opacity-40" />
                  <div className="relative gradient-bg p-3 rounded-2xl">
                    <Shield className="h-7 w-7 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight">
                    Fraud<span className="gradient-text">Scope</span>
                  </h1>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
                    </span>
                    <span className="text-xs font-semibold text-teal-600">Live Monitoring</span>
                  </div>
                </div>
              </div>

              {/* Quick Stats Pills */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-white/80 backdrop-blur px-4 py-2 rounded-full border border-stone-200 shadow-soft">
                  <Zap className="h-4 w-4 text-coral-500" />
                  <span className="text-sm font-bold text-stone-700">199,619</span>
                  <span className="text-xs text-stone-500">txns</span>
                </div>
                <div className="flex items-center gap-2 bg-white/80 backdrop-blur px-4 py-2 rounded-full border border-stone-200 shadow-soft">
                  <TrendingUp className="h-4 w-4 text-primary-500" />
                  <span className="text-sm font-bold text-stone-700">0.33%</span>
                  <span className="text-xs text-stone-500">fraud rate</span>
                </div>
                <a 
                  href="/api/onepager" 
                  target="_blank"
                  className="flex items-center gap-2 gradient-bg px-5 py-2.5 rounded-full text-white font-semibold text-sm shadow-glow-primary hover:scale-105 transition-transform"
                >
                  <Sparkles className="h-4 w-4" />
                  Export Report
                </a>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Grid */}
        <main className="max-w-[1800px] mx-auto px-8 py-8">
          {/* Hero KPI Section */}
          <section className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-1 w-8 rounded-full gradient-bg" />
              <h2 className="text-lg font-bold text-stone-700">Key Metrics</h2>
            </div>
            <KPICards />
          </section>

          {/* Main Charts Grid */}
          <section className="grid grid-cols-12 gap-6 mb-8">
            {/* Velocity - Full Width */}
            <div className="col-span-12 xl:col-span-8">
              <VelocityChart />
            </div>

            {/* Live Feed */}
            <div className="col-span-12 xl:col-span-4 xl:row-span-3">
              <LiveFeed />
            </div>

            {/* Heatmap - Full Width */}
            <div className="col-span-12 xl:col-span-8">
              <HeatmapChart />
            </div>
            
            {/* Charts Row */}
            <div className="col-span-12 xl:col-span-4">
              <MerchantChart />
            </div>
            <div className="col-span-12 xl:col-span-4">
              <CityChart />
            </div>
          </section>

          {/* Investigation Section */}
          <section className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-1 w-8 rounded-full bg-gradient-to-r from-coral-500 to-pink-500" />
              <h2 className="text-lg font-bold text-stone-700">Risk Investigation</h2>
            </div>
            
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-12 lg:col-span-6">
                <ThresholdChart />
              </div>
              <div className="col-span-12 lg:col-span-6">
                <ImpossibleTravelFeed />
              </div>
            </div>
          </section>

          {/* Offenders Section */}
          <section className="pb-24">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-1 w-8 rounded-full bg-gradient-to-r from-teal-500 to-primary-500" />
              <h2 className="text-lg font-bold text-stone-700">Entity Analysis</h2>
            </div>
            <RepeatOffendersList />
          </section>
        </main>
      </div>

      {/* Floating AI Chat */}
      <AIChat />
    </div>
  );
}
