"use client";

import useSWR from "swr";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Plane, AlertOctagon, UserX, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function ImpossibleTravelFeed() {
  const { data, isLoading } = useSWR("/api/travel", fetcher);

  if (isLoading || !data) return <Card className="h-[500px] animate-pulse bg-white border-slate-200" />;

  return (
    <Card className="h-full flex flex-col border-slate-200 bg-white shadow-sm overflow-hidden">
      <CardHeader className="pb-4 border-b border-slate-100 bg-slate-50/50">
        <CardTitle className="flex items-center gap-2 text-slate-800 text-lg font-bold">
          <Plane className="h-5 w-5 text-indigo-500" />
          Impossible Travel Velocity
        </CardTitle>
        <CardDescription className="text-slate-500 font-medium">Physical impossibility: &lt; 60 min between cities</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto p-0">
        <div className="divide-y divide-slate-100">
          {data.slice(0, 15).map((caseData: any, i: number) => (
            <div key={i} className="p-5 hover:bg-slate-50 transition-colors group flex gap-4 items-start">
              <div className="bg-indigo-50 p-2.5 rounded-full border border-indigo-100">
                <AlertOctagon className="h-5 w-5 text-indigo-500" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-slate-900">{caseData.userId}</span>
                  <Badge variant="outline" className="text-xs bg-red-50 text-red-600 border-red-200 font-bold">
                    {caseData.timeDiffMinutes} min gap
                  </Badge>
                </div>
                
                <div className="flex flex-col gap-2 relative">
                  <div className="absolute left-2.5 top-5 bottom-3 w-0.5 bg-slate-200"></div>
                  
                  <div className="flex items-center gap-3 relative z-10">
                    <div className="h-5 w-5 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center flex-shrink-0">
                      <div className="h-2 w-2 rounded-full bg-slate-400"></div>
                    </div>
                    <div className="flex-1 flex justify-between">
                      <span className="text-sm font-semibold text-slate-700">{caseData.tx1.city}</span>
                      <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(caseData.tx1.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 relative z-10">
                    <div className="h-5 w-5 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center flex-shrink-0">
                      <div className="h-2 w-2 rounded-full bg-indigo-500"></div>
                    </div>
                    <div className="flex-1 flex justify-between">
                      <span className="text-sm font-semibold text-slate-700">{caseData.tx2.city}</span>
                      <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(caseData.tx2.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function RepeatOffendersList() {
  const { data, isLoading } = useSWR("/api/offenders", fetcher);

  if (isLoading || !data) return <Card className="h-[500px] animate-pulse bg-white border-slate-200" />;

  return (
    <Card className="h-full flex flex-col border-slate-200 bg-white shadow-sm overflow-hidden">
      <CardHeader className="pb-4 border-b border-slate-100 bg-slate-50/50">
        <CardTitle className="flex items-center gap-2 text-slate-800 text-lg font-bold">
          <UserX className="h-5 w-5 text-rose-500" />
          Repeat Offender Entities
        </CardTitle>
        <CardDescription className="text-slate-500 font-medium">Identities with multiple high-risk flags</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto p-0">
        <div className="divide-y divide-slate-100">
          {data.map((user: any, i: number) => (
            <div key={i} className="p-5 hover:bg-slate-50 transition-colors flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 font-black">
                  {i + 1}
                </div>
                <div>
                  <div className="font-bold text-slate-900">{user.userId}</div>
                  <div className="text-xs font-medium text-slate-500 mt-0.5">
                    Total At Risk: <span className="text-slate-700 font-semibold">${user.totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-200 border-none font-bold">
                  {user.flags} Flags
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
