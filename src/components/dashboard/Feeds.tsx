"use client";

import useSWR from "swr";
import { Plane, UserX, Clock, ArrowRight, AlertTriangle } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function ImpossibleTravelFeed() {
  const { data, isLoading } = useSWR("/api/travel", fetcher);

  if (isLoading || !data) {
    return <div className="bg-white rounded-3xl h-[400px] animate-pulse border border-stone-200/50 shadow-soft" />;
  }

  return (
    <div className="bg-white rounded-3xl border border-stone-200/50 shadow-soft overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="p-5 border-b border-stone-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-violet-500 to-purple-600 p-2.5 rounded-2xl">
              <Plane className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900">Impossible Travel</h3>
              <p className="text-xs text-stone-500">Velocity anomalies (&lt;60 min between cities)</p>
            </div>
          </div>
          <div className="bg-violet-50 text-violet-700 px-3 py-1.5 rounded-full text-xs font-bold border border-violet-200">
            {data.length} Cases
          </div>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {data.filter((c: any) => c?.tx1 && c?.tx2).slice(0, 10).map((caseData: any, i: number) => (
          <div key={i} className="p-4 border-b border-stone-100 hover:bg-stone-50 transition-colors">
            <div className="flex items-start gap-3">
              <div className="bg-violet-100 p-2 rounded-xl">
                <AlertTriangle className="h-4 w-4 text-violet-600" />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold text-stone-900 text-sm">{caseData.userId}</span>
                  <span className="bg-rose-100 text-rose-700 px-2.5 py-1 rounded-full text-[10px] font-bold">
                    {caseData.timeDiffMinutes} min gap
                  </span>
                </div>

                {/* Journey visualization */}
                <div className="flex items-center gap-2 bg-stone-50 rounded-xl p-3">
                  <div className="flex-1">
                    <div className="text-xs font-bold text-stone-700">{caseData.tx1.city}</div>
                    <div className="text-[10px] text-stone-400 flex items-center gap-1 mt-0.5">
                      <Clock className="h-3 w-3" />
                      {new Date(caseData.tx1.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 text-violet-500">
                    <div className="h-px w-4 bg-violet-300" />
                    <ArrowRight className="h-4 w-4" />
                    <div className="h-px w-4 bg-violet-300" />
                  </div>
                  
                  <div className="flex-1 text-right">
                    <div className="text-xs font-bold text-stone-700">{caseData.tx2.city}</div>
                    <div className="text-[10px] text-stone-400 flex items-center gap-1 mt-0.5 justify-end">
                      <Clock className="h-3 w-3" />
                      {new Date(caseData.tx2.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function RepeatOffendersList() {
  const { data, isLoading } = useSWR("/api/offenders", fetcher);

  if (isLoading || !data) {
    return <div className="bg-white rounded-3xl h-[300px] animate-pulse border border-stone-200/50 shadow-soft" />;
  }

  return (
    <div className="bg-white rounded-3xl border border-stone-200/50 shadow-soft overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-stone-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-rose-500 to-coral-500 p-2.5 rounded-2xl">
              <UserX className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900">Repeat Offenders</h3>
              <p className="text-xs text-stone-500">Users with multiple flags</p>
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="p-5">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {data.slice(0, 12).map((user: any, i: number) => (
            <div 
              key={i} 
              className="bg-gradient-to-br from-stone-50 to-stone-100 rounded-2xl p-4 border border-stone-200/50 hover:shadow-soft transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`
                  h-8 w-8 rounded-full flex items-center justify-center text-sm font-black
                  ${i < 3 ? 'bg-gradient-to-br from-coral-500 to-pink-500 text-white' : 'bg-stone-200 text-stone-600'}
                `}>
                  {i + 1}
                </div>
                <span className="bg-rose-100 text-rose-700 px-2 py-1 rounded-full text-[10px] font-bold">
                  {user.flags} flags
                </span>
              </div>
              <div className="text-sm font-bold text-stone-900 truncate">{user.userId}</div>
              <div className="text-xs text-stone-500 mt-1">
                ${user.totalAmount?.toLocaleString()} at risk
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
