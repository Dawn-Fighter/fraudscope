"use client";

import useSWR from "swr";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, ShieldAlert, Crosshair, MapPin, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function LiveFeed() {
  const { data, isLoading } = useSWR("/api/feed", fetcher);
  const [frozenUsers, setFrozenUsers] = useState<Set<string>>(new Set());

  if (isLoading || !data) return <Card className="h-[600px] animate-pulse bg-white border-slate-200" />;

  const handleFreeze = (userId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFrozenUsers(prev => {
      const next = new Set(prev);
      next.add(userId);
      return next;
    });
  };

  const handleUnfreeze = (userId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFrozenUsers(prev => {
      const next = new Set(prev);
      next.delete(userId);
      return next;
    });
  };

  return (
    <Card className="h-full flex flex-col border-slate-200 bg-white shadow-sm overflow-hidden">
      <CardHeader className="pb-4 border-b border-slate-100 bg-slate-50/50">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2 text-slate-800 text-lg font-bold">
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
            </div>
            Live Intercept Feed
          </CardTitle>
          <Badge variant="outline" className="text-xs bg-white text-slate-600 border-slate-200 font-bold px-3 py-1">
            {data.length} Flagged
          </Badge>
        </div>
        <CardDescription className="text-slate-500 font-medium">Real-time anomalous transaction monitor</CardDescription>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-y-auto p-0">
        <div className="divide-y divide-slate-100">
          {data.slice(0, 20).map((tx: any, i: number) => {
            const isFrozen = frozenUsers.has(tx.userId);
            
            return (
              <div 
                key={i} 
                className={`p-5 transition-all duration-300 relative group flex gap-4
                  ${isFrozen 
                    ? 'bg-blue-50/50 grayscale-[50%]' 
                    : 'hover:bg-slate-50 bg-white'
                  }
                `}
              >
                {/* Status indicator line */}
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${isFrozen ? 'bg-blue-500' : 'bg-rose-500'}`}></div>
                
                <div className={`mt-1 p-2.5 rounded-full flex-shrink-0 ${
                  isFrozen ? 'bg-blue-100 border border-blue-200' : 'bg-rose-50 border border-rose-100'
                }`}>
                  <ShieldAlert className={`h-5 w-5 ${isFrozen ? 'text-blue-500' : 'text-rose-500'}`} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 truncate max-w-[120px]">{tx.userId}</span>
                        {isFrozen && (
                          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-none text-[10px] uppercase font-black px-1.5 py-0">
                            FROZEN
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 font-mono mt-0.5">ID: {tx.transactionId}</div>
                    </div>
                    <div className="text-right">
                      <div className={`font-black text-lg tracking-tight ${isFrozen ? 'text-slate-400' : 'text-rose-600'}`}>
                        ${tx.amount.toLocaleString()}
                      </div>
                      <div className="flex items-center justify-end gap-1 text-xs text-slate-400 font-medium">
                        <Clock className="h-3 w-3" />
                        {new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 mt-3">
                    <Badge variant="secondary" className="bg-slate-100 text-slate-600 hover:bg-slate-200 border-none font-semibold px-2.5 py-0.5">
                      <Search className="h-3 w-3 mr-1 inline" />
                      {tx.category}
                    </Badge>
                    <Badge variant="secondary" className="bg-slate-100 text-slate-600 hover:bg-slate-200 border-none font-semibold px-2.5 py-0.5">
                      <MapPin className="h-3 w-3 mr-1 inline" />
                      {tx.city}
                    </Badge>
                  </div>
                </div>

                {/* Quick Action Overlay (shows on hover) */}
                <div className="absolute right-5 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2 bg-white/90 backdrop-blur-sm p-2 rounded-lg border border-slate-200 shadow-sm">
                  {isFrozen ? (
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="bg-white text-blue-600 border-blue-200 hover:bg-blue-50 font-bold h-8 text-xs"
                      onClick={(e) => handleUnfreeze(tx.userId, e)}
                    >
                      Unfreeze
                    </Button>
                  ) : (
                    <Button 
                      size="sm" 
                      variant="default"
                      className="bg-rose-500 hover:bg-rose-600 text-white font-bold h-8 text-xs"
                      onClick={(e) => handleFreeze(tx.userId, e)}
                    >
                      <Crosshair className="h-3 w-3 mr-1.5" />
                      Freeze Entity
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
