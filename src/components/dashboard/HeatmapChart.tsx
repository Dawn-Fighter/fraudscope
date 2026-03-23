"use client";

import useSWR from "swr";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Activity } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function HeatmapChart() {
  const { data, isLoading } = useSWR("/api/heatmap", fetcher);

  // Added Array.isArray check to prevent forEach error
  if (isLoading || !data || !Array.isArray(data)) return <Card className="h-[400px] animate-pulse bg-white border-slate-200" />;

  // Normalize data to find max for color scaling
  let maxVal = 0;
  data.forEach((dayRow: number[]) => {
    if (Array.isArray(dayRow)) {
      dayRow.forEach((val: number) => {
        if (val > maxVal) maxVal = val;
      });
    }
  });

  const getColor = (val: number) => {
    if (val === 0) return "bg-slate-50 border-slate-100";
    const intensity = val / maxVal;
    if (intensity < 0.2) return "bg-rose-100 border-rose-200";
    if (intensity < 0.4) return "bg-rose-200 border-rose-300";
    if (intensity < 0.6) return "bg-rose-300 border-rose-400";
    if (intensity < 0.8) return "bg-rose-400 border-rose-500";
    return "bg-rose-500 border-rose-600 shadow-[0_0_10px_rgba(244,63,94,0.3)]";
  };

  return (
    <Card className="border-slate-200 bg-white shadow-sm">
      <CardHeader className="pb-4 border-b border-slate-100 bg-slate-50/50">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2 text-slate-800 text-lg font-bold">
              <Activity className="h-5 w-5 text-rose-500" />
              Fraud Temporal Distribution Map
            </CardTitle>
            <CardDescription className="text-slate-500 font-medium mt-1">7-Day × 24-Hour incident concentration</CardDescription>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 bg-white px-3 py-1.5 rounded-md border border-slate-200 shadow-sm">
            <span>Low</span>
            <div className="flex gap-1">
              <div className="w-3 h-3 rounded-sm bg-slate-50 border border-slate-100"></div>
              <div className="w-3 h-3 rounded-sm bg-rose-200 border border-rose-300"></div>
              <div className="w-3 h-3 rounded-sm bg-rose-400 border border-rose-500"></div>
              <div className="w-3 h-3 rounded-sm bg-rose-500 border border-rose-600"></div>
            </div>
            <span>High Risk</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6 overflow-x-auto">
        <div className="min-w-[800px]">
          <div className="flex mb-2">
            <div className="w-12"></div>
            <div className="flex-1 flex justify-between text-xs font-bold text-slate-400">
              <span>12 AM</span>
              <span>6 AM</span>
              <span>12 PM</span>
              <span>6 PM</span>
              <span>11 PM</span>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            {DAYS.map((day, dIdx) => (
              <div key={day} className="flex items-center gap-1.5">
                <div className="w-12 text-xs font-bold text-slate-500 text-right pr-3">{day}</div>
                <div className="flex-1 flex gap-1.5">
                  {Array.isArray(data[dIdx]) && data[dIdx].map((val: number, hIdx: number) => (
                    <div
                      key={hIdx}
                      title={`${day} ${hIdx}:00 - ${val} flagged txns`}
                      className={`flex-1 aspect-square rounded-sm border transition-all hover:scale-[1.15] hover:z-10 cursor-crosshair ${getColor(val)}`}
                    ></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
