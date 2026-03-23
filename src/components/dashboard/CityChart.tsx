"use client";

import useSWR from "swr";
import { MapPin, TrendingUp, TrendingDown, Globe, AlertTriangle } from "lucide-react";

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
  { bg: "from-rose-500 to-orange-500", text: "text-rose-600", light: "bg-rose-50", border: "border-rose-200" },
  { bg: "from-orange-500 to-amber-500", text: "text-orange-600", light: "bg-orange-50", border: "border-orange-200" },
  { bg: "from-amber-500 to-yellow-500", text: "text-amber-600", light: "bg-amber-50", border: "border-amber-200" },
  { bg: "from-lime-500 to-green-500", text: "text-lime-600", light: "bg-lime-50", border: "border-lime-200" },
  { bg: "from-teal-500 to-cyan-500", text: "text-teal-600", light: "bg-teal-50", border: "border-teal-200" },
  { bg: "from-sky-500 to-blue-500", text: "text-sky-600", light: "bg-sky-50", border: "border-sky-200" },
];

export function CityChart() {
  const { data, isLoading } = useSWR<CityData[]>("/api/cities", fetcher);

  if (isLoading || !data) {
    return (
      <div className="bg-white rounded-3xl h-[420px] animate-pulse border border-stone-200/50 shadow-soft">
        <div className="p-5 border-b border-stone-100">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-stone-200" />
            <div className="space-y-2">
              <div className="w-32 h-4 bg-stone-200 rounded" />
              <div className="w-24 h-3 bg-stone-100 rounded" />
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
    <div className="bg-white rounded-3xl border border-stone-200/50 shadow-soft overflow-hidden h-full">
      {/* Header */}
      <div className="p-5 border-b border-stone-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-2xl blur-md opacity-40" />
              <div className="relative bg-gradient-to-br from-teal-500 to-cyan-600 p-2.5 rounded-2xl">
                <Globe className="h-5 w-5 text-white" />
              </div>
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900">Geographic Risk Map</h3>
              <p className="text-xs text-stone-500">Fraud exposure by city</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-black text-stone-900">${(totalExposure / 1000).toFixed(0)}K</div>
            <div className="text-[10px] font-semibold text-stone-400 uppercase tracking-wide">Total Exposure</div>
          </div>
        </div>
      </div>

      {/* City Risk Bars */}
      <div className="p-4 space-y-3">
        {sortedData.map((city, index) => {
          const percentage = (city.fraudAmount / maxAmount) * 100;
          const color = riskColors[index % riskColors.length];
          const isRising = city.trend > 0;

          return (
            <div
              key={city.city}
              className={`group relative rounded-2xl border ${color.border} ${color.light} p-3 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg cursor-pointer`}
            >
              {/* Risk Rank Badge */}
              <div className={`absolute -left-1 -top-1 w-6 h-6 rounded-full bg-gradient-to-br ${color.bg} flex items-center justify-center shadow-md`}>
                <span className="text-[10px] font-black text-white">{index + 1}</span>
              </div>

              <div className="flex items-center gap-3 ml-4">
                {/* Flag & City */}
                <div className="flex items-center gap-2 min-w-[100px]">
                  <span className="text-xl">{cityFlags[city.city] || "🌍"}</span>
                  <div>
                    <div className="text-sm font-bold text-stone-800">{city.city}</div>
                    <div className="text-[10px] text-stone-500">{city.flagged} flagged</div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="flex-1">
                  <div className="h-3 bg-white/60 rounded-full overflow-hidden shadow-inner">
                    <div
                      className={`h-full bg-gradient-to-r ${color.bg} rounded-full transition-all duration-700 ease-out relative overflow-hidden`}
                      style={{ width: `${percentage}%` }}
                    >
                      {/* Shimmer effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                    </div>
                  </div>
                </div>

                {/* Amount & Trend */}
                <div className="flex items-center gap-3 min-w-[120px] justify-end">
                  <div className="text-right">
                    <div className="text-sm font-black text-stone-900">
                      ${(city.fraudAmount / 1000).toFixed(0)}K
                    </div>
                    <div className="text-[10px] text-stone-500">{city.rate}% rate</div>
                  </div>

                  {/* Trend indicator */}
                  <div
                    className={`flex items-center gap-0.5 px-2 py-1 rounded-full text-[10px] font-bold ${
                      isRising
                        ? "bg-rose-100 text-rose-600"
                        : "bg-emerald-100 text-emerald-600"
                    }`}
                  >
                    {isRising ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    {Math.abs(city.trend)}%
                  </div>
                </div>
              </div>

              {/* Hover tooltip */}
              <div className="absolute left-1/2 -translate-x-1/2 -bottom-2 opacity-0 group-hover:opacity-100 group-hover:-bottom-8 transition-all duration-300 pointer-events-none z-10">
                <div className="bg-stone-900 text-white text-[10px] px-3 py-1.5 rounded-lg shadow-xl whitespace-nowrap">
                  {city.transactions.toLocaleString()} total transactions
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 bg-stone-50/50 border-t border-stone-100 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[10px] text-stone-500">
          <AlertTriangle className="h-3 w-3 text-amber-500" />
          <span>High-risk regions flagged for review</span>
        </div>
        <div className="flex items-center gap-1">
          {riskColors.slice(0, 3).map((c, i) => (
            <div key={i} className={`w-2 h-2 rounded-full bg-gradient-to-r ${c.bg}`} />
          ))}
        </div>
      </div>
    </div>
  );
}
