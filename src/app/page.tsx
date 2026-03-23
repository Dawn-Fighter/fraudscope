"use client";

import { useEffect, useState } from "react";
import { KPIGrid } from "@/components/KPIGrid";
import { MerchantRiskTreemap, VelocityTimeline, CityFraudBar } from "@/components/Charts";
import { ImpossibleTravelFeed, OffenderLeaderboard, FlaggedTransactionFeed } from "@/components/Feeds";
import { FraudTimeHeatmap, ThresholdIndicator, FalsePositiveDonut, AIInsightPanel } from "@/components/MoreCharts";
import { CityNetworkGraph } from "@/components/NetworkGraph";
import { Card } from "@/components/ui/card";
import { ShieldAlert, Activity, Menu, X, LayoutDashboard, Radio, PieChart, Globe } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState('Overview');

  const fetchAll = async () => {
    const endpoints = ['stats', 'merchant', 'velocity', 'travel', 'cities', 'heatmap', 'threshold', 'offenders', 'feed', 'citypairs', 'insight'];
    try {
      const results = await Promise.all(endpoints.map(e => fetch(`/api/${e}`).then(r => r.json())));
      const loadedData = endpoints.reduce((acc, curr, i) => {
        acc[curr] = results[i];
        return acc;
      }, {} as any);
      setData(loadedData);
      setLastUpdate(Date.now());
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchAll();

    const interval = setInterval(() => {
      setData((prev: any) => {
        if (!prev) return prev;
        
        // Realtime simulation
        const addedTx = Math.floor(Math.random() * 5);
        const shouldFlag = Math.random() > 0.8;
        
        const newStats = {
          ...prev.stats,
          totalTransactions: prev.stats.totalTransactions + addedTx,
          flaggedTransactions: prev.stats.flaggedTransactions + (shouldFlag ? 1 : 0),
        };

        const newTravel = [...prev.travel];
        if (Math.random() > 0.85) { // Add impossible travel event
          const users = ["USR-14397", "USR-09211", "USR-55102", "USR-33019", "USR-11942"];
          const cities = ["Dubai", "Singapore", "London", "Tokyo", "NY", "Paris"];
          const user = users[Math.floor(Math.random() * users.length)];
          const c1 = cities[Math.floor(Math.random() * cities.length)];
          const c2 = cities[Math.floor(Math.random() * cities.length)];
          
          if (c1 !== c2) {
            newTravel.unshift({
              id: user,
              transition: `${c1} → ${c2}`,
              gap: `${Math.floor(Math.random() * 10 + 1)} min`,
              amount: Math.floor(Math.random() * 5000 + 500),
              risk: Math.random() > 0.5 ? "CRITICAL" : "HIGH"
            });
            if (newTravel.length > 5) newTravel.pop();
          }
        }

        const newFeed = [...prev.feed];
        if (shouldFlag) {
          const merchants = ["Crypto", "Electronics", "Dining", "Travel", "Clothing"];
          const cities = ["Dubai", "London", "New York", "Sydney", "Tokyo", "Paris"];
          newFeed.unshift({
            id: `TX-${Math.floor(Math.random() * 10000)}`,
            user: `USR-${Math.floor(Math.random() * 100000)}`,
            amount: Math.floor(Math.random() * 10000),
            city: cities[Math.floor(Math.random() * cities.length)],
            merchant: merchants[Math.floor(Math.random() * merchants.length)],
            timestamp: "Just now"
          });
          if (newFeed.length > 5) newFeed.pop();
        }

        return {
          ...prev,
          stats: newStats,
          travel: newTravel,
          feed: newFeed,
        };
      });
      setLastUpdate(Date.now());
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-100 text-slate-900">
        <div className="flex flex-col items-center">
          <Activity className="w-12 h-12 text-rose-500 animate-pulse mb-4" />
          <h1 className="text-xl tracking-widest uppercase font-bold text-slate-500" style={{ fontFamily: 'var(--font-jetbrains-mono)' }}>Loading FRAUDSCOPE Engine...</h1>
        </div>
      </div>
    );
  }

  const menuItems = [
    { name: 'Overview', icon: <LayoutDashboard size={18} /> },
    { name: 'Live Feeds', icon: <Radio size={18} /> },
    { name: 'Analytics', icon: <PieChart size={18} /> },
    { name: 'Network', icon: <Globe size={18} /> }
  ];

  return (
    <div className="flex bg-slate-100 min-h-screen relative overflow-hidden">
      
      {/* SLIDE-IN SIDEBAR */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
              className="absolute lg:relative w-64 h-screen bg-white border-r border-slate-200 z-50 flex flex-col pt-4 shadow-2xl lg:shadow-none"
            >
              <div className="flex items-center justify-between px-4 mb-8">
                <div className="flex items-center gap-2 text-rose-600 font-bold uppercase tracking-widest text-sm" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
                  <ShieldAlert size={20} /> FraudScope
                </div>
                <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-slate-500 hover:text-slate-900 transition-colors">
                  <X size={20} />
                </button>
              </div>
              <nav className="flex-1 px-4 space-y-2">
                {menuItems.map(item => (
                  <button
                    key={item.name}
                    onClick={() => {
                      setActiveView(item.name);
                      setIsSidebarOpen(false);
                    }}
                    className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      activeView === item.name 
                        ? 'bg-rose-50 text-rose-600 border border-rose-200 shadow-sm' 
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                    style={{ fontFamily: 'var(--font-jetbrains-mono)' }}
                  >
                    {item.icon}
                    {item.name}
                  </button>
                ))}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 h-screen overflow-y-auto w-full p-4 md:p-6 mx-auto grid gap-4 grid-cols-12 auto-rows-min max-w-[1920px]">
        
        {/* HEADER */}
        <div className="col-span-12 flex justify-between items-end mb-2 border-b border-slate-200 pb-4">
          <div className="flex items-center gap-3">
            {!isSidebarOpen && (
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 -ml-2 rounded-lg text-slate-500 hover:bg-slate-200 hover:text-slate-900 transition-colors mr-2"
              >
                <Menu size={24} />
              </button>
            )}
            <div>
              <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-slate-900 flex items-center gap-4 uppercase" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
                {activeView}
                <span className="bg-rose-950 text-rose-500 px-2 flex items-center gap-1 rounded tracking-widest uppercase text-xs">
                  <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" /> Live
                </span>
              </h1>
              <p className="text-slate-500 tracking-widest text-xs uppercase mt-0.5" style={{ fontFamily: 'var(--font-jetbrains-mono)' }}>Real-Time Fintech Fraud Intelligence Dashboard</p>
            </div>
          </div>
          <div className="hidden md:flex flex-col items-end text-xs text-slate-500" style={{ fontFamily: 'var(--font-jetbrains-mono)' }}>
            <div>Ping: 14ms | Servers: OK</div>
            <div>Last Updated: {new Date(lastUpdate).toISOString().split('T')[1].slice(0,-1)}</div>
          </div>
        </div>

        {/* CONDITIONALLY RENDER VIEWS */}
        
        {activeView === 'Overview' && (
          <>
            <div className="col-span-12 mb-2">
              <KPIGrid stats={data.stats} />
            </div>
            <div className="col-span-12 md:col-span-6 lg:col-span-4">
              <MerchantRiskTreemap data={data.merchant} />
            </div>
            <div className="col-span-12 md:col-span-6 lg:col-span-8">
              <VelocityTimeline data={data.velocity} />
            </div>
            <div className="col-span-12">
              <AIInsightPanel data={data.insight} />
            </div>
          </>
        )}

        {activeView === 'Live Feeds' && (
          <>
            <div className="col-span-12 lg:col-span-6">
              <FlaggedTransactionFeed data={data.feed} />
            </div>
            <div className="col-span-12 lg:col-span-6">
              <ImpossibleTravelFeed data={data.travel} />
            </div>
            <div className="col-span-12">
              <OffenderLeaderboard data={data.offenders} />
            </div>
          </>
        )}

        {activeView === 'Analytics' && (
          <>
            <div className="col-span-12">
              <FraudTimeHeatmap data={data.heatmap} />
            </div>
            <div className="col-span-12 lg:col-span-6">
              <CityFraudBar data={data.cities} />
            </div>
            <div className="col-span-12 lg:col-span-6">
              <ThresholdIndicator />
            </div>
            <div className="col-span-12 lg:col-span-6">
              <FalsePositiveDonut />
            </div>
          </>
        )}

        {activeView === 'Network' && (
          <>
            <div className="col-span-12 lg:col-span-8">
              {data.citypairs && <CityNetworkGraph data={data.citypairs} />}
            </div>
            <div className="col-span-12 lg:col-span-4 flex flex-col">
              <Card className="flex-1 bg-slate-50 border-indigo-200">
                <h3 className="text-sm font-bold text-indigo-600 uppercase tracking-widest mb-4 border-b border-indigo-100 pb-2" style={{ fontFamily: 'var(--font-jetbrains-mono)' }}>
                  Syndicate Analysis
                </h3>
                <p className="text-sm text-slate-600" style={{ fontFamily: 'var(--font-inter)' }}>
                  Our real-time D3 engine mapping connections between compromised merchants, duplicate logins, and anomalous geospatial behaviors. Wait for AI nodes to surface matching IPs.
                </p>
              </Card>
            </div>
          </>
        )}
        
      </div>
    </div>
  );
}
