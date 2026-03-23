"use client";

import useSWR from "swr";
import { TrendingUp, TrendingDown, Globe, AlertTriangle } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface CityData {
  city: string;
  fraudAmount: number;
  transactions: number;
  flagged: number;
  rate: number;
  trend: number;
}

const cityFlags: Record<string, string> = {
  Dubai: "🇦🇪",
  London: "🇬🇧",
  "New York": "🇺🇸",
  Sydney: "🇦🇺",
  Tokyo: "🇯🇵",
  Paris: "🇫🇷",
  Toronto: "🇨🇦",
  Mumbai: "🇮🇳",
};

const riskColors = [
  { bg: "bg-primary-600", text: "text-primary-600", light: "bg-white", border: "border-slate-200" },
  { bg: "bg-primary-500", text: "text-primary-500", light: "bg-white", border: "border-slate-200" },
  { bg: "bg-primary-400", text: "text-primary-400", light: "bg-white", border: "border-slate-200" },
  { bg: "bg-slate-400", text: "text-slate-400", light: "bg-white", border: "border-slate-200" },
  { bg: "bg-slate-300", text: "text-slate-300", light: "bg-white", border: "border-slate-200" },
  { bg: "bg-slate-200", text: "text-slate-200", light: "bg-white", border: "border-slate-200" },
];

export function CityChart() {
  const { data, isLoading } = useSWR<CityData[]>("/api/cities", fetcher);

  if (isLoading || !data) {
    return (
      <div className="bg-white rounded-2xl h-[420px] animate-pulse border border-slate-200 shadow-soft">
        <div className="p-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100" />
            <div className="space-y-2">
              <div className="w-32 h-3 bg-slate-100 rounded" />
              <div className="w-24 h-2 bg-slate-50 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const sortedData = [...data].sort((a, b) => b.fraudAmount - a.fraudAmount);
  const maxAmount = sortedData[0]?.fraudAmount || 1;
  const totalExposure = sortedData.reduce((sum, d) => sum + d.fraudAmount, 0);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-soft overflow-hidden h-full">
      {/* Header */}
      <div className="p-5 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-slate-100 p-2 rounded-xl text-primary-600">
              <Globe className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Geographic Risk</h3>
              <p className="text-xs text-slate-400 font-medium whitespace-nowrap">Exposure index by region</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-slate-900 leading-tight">${(totalExposure / 1000).toFixed(0)}K</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Exposure</div>
          </div>
        </div>
      </div>

      {/* City Risk Rows */}
      <div className="p-4 space-y-2">
        {sortedData.map((city, index) => {
          const percentage = (city.fraudAmount / maxAmount) * 100;
          const color = riskColors[index % riskColors.length];
          const isRising = city.trend > 0;

          return (
            <div
              key={city.city}
              className={`group relative rounded-xl border ${color.border} ${color.light} p-3 transition-all hover:bg-slate-50 cursor-pointer`}
            >
              <div className="flex items-center gap-3">
                {/* City Info */}
                <div className="flex items-center gap-2 min-w-[90px]">
                  <span className="text-lg">{cityFlags[city.city] || "🌍"}</span>
                  <div>
                    <div className="text-xs font-bold text-slate-900">{city.city}</div>
                    <div className="text-[10px] text-slate-400 font-medium">{city.flagged} flagged</div>
                  </div>
                </div>

                {/* Tracking bar */}
                <div className="flex-1 px-2">
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${color.bg} rounded-full transition-all duration-700 ease-out`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 min-w-[100px] justify-end">
                  <div className="text-right">
                    <div className="text-xs font-bold text-slate-900">
                      ${(city.fraudAmount / 1000).toFixed(0)}K
                    </div>
                    <div className="text-[9px] text-slate-400 font-bold">{city.rate}% RATE</div>
                  </div>

                  <div className={`flex items-center gap-0.5 text-[10px] font-bold ${isRising ? "text-error" : "text-success"}`}>
                    {isRising ? <TrendingUp className="h-2.5 w-2.5" /> : <TrendingDown className="h-2.5 w-2.5" />}
                    {Math.abs(city.trend)}%
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
          <AlertTriangle className="h-3 w-3 text-warning" />
          <span>Priority Regions Flagged</span>
        </div>
      </div>
    </div>
  );
}
