"use client";

import { useState } from "react";
import { KPICards } from "@/components/dashboard/KPICards";
import { HeatmapChart } from "@/components/dashboard/HeatmapChart";
import { MerchantChart } from "@/components/dashboard/MerchantChart";
import { CityChart } from "@/components/dashboard/CityChart";
import { ThresholdChart } from "@/components/dashboard/ThresholdChart";
import { LiveFeed } from "@/components/dashboard/LiveFeed";
import { ImpossibleTravelFeed, RepeatOffendersList } from "@/components/dashboard/Feeds";
import { AIChat } from "@/components/ai/AIChat";
import { Shield, Download, Radar, LayoutDashboard, Crosshair, Users, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

type Tab = "command" | "live" | "risk" | "investigation";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("command");

  const NavItem = ({ id, label, icon: Icon }: { id: Tab; label: string; icon: any }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all",
        activeTab === id 
          ? "bg-blue-600 text-white shadow-md shadow-blue-600/20" 
          : "text-slate-600 hover:text-blue-600 hover:bg-blue-50 border border-transparent"
      )}
    >
      <Icon className={cn("h-5 w-5", activeTab === id ? "text-white" : "text-slate-400")} />
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-500/30 font-sans relative flex">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"></div>

      {/* Sidebar Navigation */}
      <aside className="w-[280px] fixed top-0 bottom-0 left-0 bg-white border-r border-slate-200 z-40 flex flex-col shadow-sm">
        <div className="p-6 flex items-center gap-3 border-b border-slate-100">
          <div className="bg-blue-600 p-2.5 rounded-xl shadow-md shadow-blue-600/20">
            <Radar className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight leading-none">FraudScope</h1>
            <div className="flex items-center gap-1.5 mt-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Live System</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 flex flex-col gap-2">
          <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 mt-2">Dashboards</p>
          <NavItem id="command" label="Command Center" icon={LayoutDashboard} />
          <NavItem id="live" label="Live Intercepts" icon={Activity} />
          <NavItem id="risk" label="Risk Intelligence" icon={Shield} />
          <NavItem id="investigation" label="Entity Investigation" icon={Users} />
        </nav>

        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <Button variant="outline" className="w-full justify-start text-slate-700 border-slate-200 hover:bg-white hover:text-blue-600 shadow-sm bg-white" asChild>
            <a href="/api/onepager" target="_blank">
              <Download className="h-4 w-4 mr-3 text-blue-500" />
              Export Brief
            </a>
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-[280px] min-h-screen relative z-10 flex flex-col">
        {/* Dynamic Header */}
        <header className="h-20 border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-30 px-8 flex items-center shadow-sm">
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
            {activeTab === "command" && "Command Center Overview"}
            {activeTab === "live" && "Real-Time Transaction Intercepts"}
            {activeTab === "risk" && "Macro Risk Intelligence"}
            {activeTab === "investigation" && "Entity & Velocity Investigations"}
          </h2>
        </header>

        <div className="p-8 space-y-8 flex-1 max-w-[1600px] w-full mx-auto pb-24">
          
          {/* VIEW: Command Center (Everything) */}
          {activeTab === "command" && (
            <>
              <KPICards />
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                <div className="xl:col-span-8 flex flex-col gap-8">
                  <HeatmapChart />
                  <div className="grid grid-cols-2 gap-8">
                    <MerchantChart />
                    <CityChart />
                  </div>
                </div>
                <div className="xl:col-span-4 h-full">
                  <LiveFeed />
                </div>
              </div>
            </>
          )}

          {/* VIEW: Live Intercepts */}
          {activeTab === "live" && (
            <>
              <div className="grid gap-6 md:grid-cols-3 mb-8">
                <KPICards />
              </div>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 h-[800px]">
                <div className="h-full">
                  <LiveFeed />
                </div>
                <div className="h-full flex flex-col gap-8">
                  <div className="flex-1">
                    <ThresholdChart />
                  </div>
                  <Card className="bg-amber-50 border-amber-200 p-6 flex-shrink-0 shadow-sm">
                    <h3 className="text-amber-800 font-bold mb-2 flex items-center gap-2">
                      <Crosshair className="h-5 w-5" /> Active Defense Rule
                    </h3>
                    <p className="text-amber-900/80 text-sm leading-relaxed">
                      System is currently isolating transactions matching: <code className="bg-amber-100 px-1.5 py-0.5 rounded text-amber-900 font-bold">$AMOUNT &gt; 500.00</code>. 
                      Any incoming transaction matching this pattern triggers a manual review freeze. Hover over live feed items to execute account freeze.
                    </p>
                  </Card>
                </div>
              </div>
            </>
          )}

          {/* VIEW: Risk Intelligence */}
          {activeTab === "risk" && (
            <>
              <HeatmapChart />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <MerchantChart />
                <CityChart />
              </div>
              <ThresholdChart />
            </>
          )}

          {/* VIEW: Entity Investigation */}
          {activeTab === "investigation" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <RepeatOffendersList />
              <ImpossibleTravelFeed />
            </div>
          )}

        </div>
      </main>

      {/* Floating AI Co-Pilot */}
      <AIChat />
    </div>
  );
}