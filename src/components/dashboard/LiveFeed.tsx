"use client";

import useSWR from "swr";
import { useState } from "react";
import { Clock, ShieldAlert, MapPin, Store, UserX, CheckCircle } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function LiveFeed() {
  const { data, isLoading } = useSWR("/api/feed", fetcher, { refreshInterval: 5000 });
  const [frozenUsers, setFrozenUsers] = useState<Set<string>>(new Set());
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  if (isLoading || !data) {
    return <div className="bg-white rounded-3xl h-full min-h-[600px] animate-pulse border border-stone-200/50 shadow-soft" />;
  }

  const handleFreeze = (userId: string) => {
    setFrozenUsers(prev => new Set(prev).add(userId));
  };

  const handleDismiss = (txId: string) => {
    setDismissed(prev => new Set(prev).add(txId));
  };

  const visibleData = data.filter((tx: any) => !dismissed.has(tx.transactionId));

  return (
    <div className="bg-white rounded-3xl border border-stone-200/50 shadow-soft overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="p-5 border-b border-stone-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="bg-gradient-to-br from-rose-500 to-pink-500 p-2.5 rounded-2xl">
                <ShieldAlert className="h-5 w-5 text-white" />
              </div>
              {/* Pulse indicator */}
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
              </span>
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900">Live Alerts</h3>
              <p className="text-xs text-stone-500">Real-time flagged transactions</p>
            </div>
          </div>
          
          <div className="bg-rose-50 text-rose-700 px-3 py-1.5 rounded-full text-xs font-bold border border-rose-200">
            {visibleData.length} Active
          </div>
        </div>
      </div>

      {/* Feed List */}
      <div className="flex-1 overflow-y-auto">
        {visibleData.slice(0, 15).map((tx: any, i: number) => {
          const isFrozen = frozenUsers.has(tx.userId);
          
          return (
            <div 
              key={tx.transactionId || i}
              className={`
                p-4 border-b border-stone-100 transition-all duration-300 group
                ${isFrozen ? 'bg-primary-50/50' : 'hover:bg-stone-50'}
              `}
            >
              <div className="flex items-start gap-3">
                {/* Status Icon */}
                <div className={`
                  p-2 rounded-xl flex-shrink-0 mt-0.5
                  ${isFrozen ? 'bg-primary-100' : 'bg-coral-100'}
                `}>
                  {isFrozen ? (
                    <CheckCircle className="h-4 w-4 text-primary-600" />
                  ) : (
                    <ShieldAlert className="h-4 w-4 text-coral-600" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-stone-900 text-sm">{tx.userId}</span>
                        {isFrozen && (
                          <span className="bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase">
                            Frozen
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-stone-400 font-mono mt-0.5">{tx.transactionId}</div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className={`font-extrabold text-lg ${isFrozen ? 'text-stone-400' : 'text-coral-600'}`}>
                        ${tx.amount?.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap items-center gap-1.5 mb-3">
                    <span className="inline-flex items-center gap-1 bg-stone-100 text-stone-600 px-2 py-1 rounded-lg text-[10px] font-semibold">
                      <Store className="h-3 w-3" />
                      {tx.category}
                    </span>
                    <span className="inline-flex items-center gap-1 bg-stone-100 text-stone-600 px-2 py-1 rounded-lg text-[10px] font-semibold">
                      <MapPin className="h-3 w-3" />
                      {tx.city}
                    </span>
                    <span className="inline-flex items-center gap-1 bg-stone-100 text-stone-600 px-2 py-1 rounded-lg text-[10px] font-semibold">
                      <Clock className="h-3 w-3" />
                      {new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {!isFrozen && (
                      <button
                        onClick={() => handleFreeze(tx.userId)}
                        className="flex items-center gap-1.5 bg-coral-500 hover:bg-coral-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
                      >
                        <UserX className="h-3 w-3" />
                        Freeze User
                      </button>
                    )}
                    <button
                      onClick={() => handleDismiss(tx.transactionId)}
                      className="flex items-center gap-1.5 bg-stone-200 hover:bg-stone-300 text-stone-700 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
                    >
                      Mark Safe
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
