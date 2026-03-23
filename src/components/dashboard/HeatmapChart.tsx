"use client";

import useSWR from "swr";
import { Activity } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function HeatmapChart() {
  const { data, isLoading } = useSWR("/api/heatmap", fetcher);

  if (isLoading || !data || !Array.isArray(data)) {
    return (
      <div className="bg-white rounded-3xl h-[380px] animate-pulse border border-stone-200/50 shadow-soft" />
    );
  }

  let maxVal = 0;
  
  // Transform the flat array of objects into the 2D array format expected by the component
  // API returns: [{day: "Mon", hour: 0, count: 5}, ...]
  // We need: [[day0hour0, day0hour1...], [day1hour0, day1hour1...]]
  const heatmapData = Array(7).fill(0).map(() => Array(24).fill(0));
  
  if (data && Array.isArray(data) && data.length > 0) {
    if (typeof data[0] === 'object' && data[0].day !== undefined) {
      data.forEach(item => {
        const dayIdx = DAYS.indexOf(item.day);
        if (dayIdx !== -1 && item.hour >= 0 && item.hour < 24) {
          heatmapData[dayIdx][item.hour] = item.count;
          if (item.count > maxVal) maxVal = item.count;
        }
      });
    } else {
      // Fallback for old format
      data.forEach((dayRow: number[]) => {
        if (Array.isArray(dayRow)) {
          dayRow.forEach((val: number) => {
            if (val > maxVal) maxVal = val;
          });
        }
      });
    }
  }

  const getColor = (val: number) => {
    if (val === 0) return "bg-stone-100";
    const intensity = val / maxVal;
    if (intensity < 0.2) return "bg-coral-100";
    if (intensity < 0.4) return "bg-coral-200";
    if (intensity < 0.6) return "bg-coral-300";
    if (intensity < 0.8) return "bg-coral-400";
    return "bg-coral-500 shadow-glow-coral";
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200/50 shadow-soft overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-stone-100">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-coral-500 to-pink-500 p-2.5 rounded-2xl">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-stone-900">Fraud Heatmap</h3>
              <p className="text-sm text-stone-500">7-day × 24-hour pattern analysis</p>
            </div>
          </div>
          
          {/* Legend */}
          <div className="flex items-center gap-2 bg-stone-50 px-4 py-2 rounded-full">
            <span className="text-xs font-semibold text-stone-500">Low</span>
            <div className="flex gap-1">
              <div className="w-4 h-4 rounded-md bg-stone-100" />
              <div className="w-4 h-4 rounded-md bg-coral-200" />
              <div className="w-4 h-4 rounded-md bg-coral-400" />
              <div className="w-4 h-4 rounded-md bg-coral-500" />
            </div>
            <span className="text-xs font-semibold text-stone-500">High</span>
          </div>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="p-6 overflow-x-auto">
        <div className="min-w-[700px]">
          {/* Hour Labels */}
          <div className="flex mb-3 pl-14">
            <div className="flex-1 flex justify-between text-[10px] font-bold text-stone-400 uppercase tracking-wider">
              <span>12am</span>
              <span>6am</span>
              <span>12pm</span>
              <span>6pm</span>
              <span>11pm</span>
            </div>
          </div>

          {/* Grid Rows */}
          <div className="flex flex-col gap-2">
            {DAYS.map((day, dIdx) => (
              <div key={day} className="flex items-center gap-3">
                <div className="w-10 text-xs font-bold text-stone-500 text-right">{day}</div>
                <div className="flex-1 flex gap-1.5">
                  {heatmapData[dIdx].map((val: number, hIdx: number) => (
                    <div
                      key={hIdx}
                      title={`${day} ${hIdx}:00 — ${val} flagged`}
                      className={`
                        flex-1 aspect-[1.5/1] rounded-lg transition-all duration-200
                        hover:scale-125 hover:z-10 cursor-pointer
                        ${getColor(val)}
                      `}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
