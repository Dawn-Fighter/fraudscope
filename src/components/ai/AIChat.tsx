"use client";

import { useState, useEffect, useRef } from "react";
import useSWR from "swr";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, X, FileText, ChevronDown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasNewAlert, setHasNewAlert] = useState(true);
  const { data: insights, isLoading } = useSWR("/api/insight", fetcher, { 
    refreshInterval: 60000,
    errorRetryCount: 3
  });

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (insights && !isOpen) {
      setHasNewAlert(true);
    }
  }, [insights]);

  useEffect(() => {
    if (isOpen && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [isOpen, insights]);

  const handleGeneratePDF = async () => {
    window.open('/api/onepager', '_blank');
  };

  return (
    <>
      <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end">
        {/* Toast Notification */}
        <AnimatePresence>
          {hasNewAlert && !isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              className="mb-4 bg-white text-slate-800 p-4 rounded-xl shadow-xl border border-slate-200 max-w-sm flex items-start gap-3 cursor-pointer ring-1 ring-black/5"
              onClick={() => {
                setIsOpen(true);
                setHasNewAlert(false);
              }}
            >
              <div className="bg-blue-100 p-2 rounded-lg flex-shrink-0">
                <Sparkles className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">New AI Insights Available</p>
                <p className="text-xs text-slate-500 mt-1 font-medium">I've detected a $500 threshold pattern in recent fraud.</p>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); setHasNewAlert(false); }}
                className="text-slate-400 hover:text-slate-600 ml-2"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setIsOpen(!isOpen);
            setHasNewAlert(false);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl p-4 shadow-xl shadow-blue-600/30 flex items-center justify-center relative border border-blue-500 transition-colors"
        >
          {isOpen ? <ChevronDown className="h-7 w-7" /> : <Bot className="h-7 w-7" />}
          {hasNewAlert && !isOpen && (
            <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-rose-500 border-2 border-white" />
          )}
        </motion.button>
      </div>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-28 right-8 w-96 h-[600px] max-h-[calc(100vh-8rem)] bg-white rounded-2xl shadow-2xl border border-slate-200 z-40 flex flex-col overflow-hidden ring-1 ring-black/5"
          >
            {/* Header */}
            <div className="bg-blue-600 p-5 text-white flex items-center gap-4">
              <div className="bg-white/20 p-2.5 rounded-xl backdrop-blur-sm">
                <Bot className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-base">Fraud AI Co-Pilot</h3>
                <p className="text-xs text-blue-100 flex items-center gap-1.5 mt-0.5 font-medium">
                  <span className="h-2 w-2 rounded-full bg-emerald-400"></span> Online & Analyzing
                </p>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 bg-slate-50 space-y-5">
              <div className="flex gap-3">
                <div className="bg-blue-100 p-2 rounded-xl h-9 w-9 flex items-center justify-center flex-shrink-0 shadow-sm border border-blue-200">
                  <Bot className="h-5 w-5 text-blue-700" />
                </div>
                <div className="bg-white p-3.5 rounded-2xl rounded-tl-sm shadow-sm border border-slate-200 text-sm text-slate-700 font-medium leading-relaxed">
                  Hello! I'm actively monitoring the transaction stream. Here are my latest insights based on the real-time data:
                </div>
              </div>

              {isLoading ? (
                <div className="flex gap-3">
                  <div className="bg-blue-100 p-2 rounded-xl h-9 w-9 flex items-center justify-center flex-shrink-0 shadow-sm border border-blue-200">
                    <Bot className="h-5 w-5 text-blue-700" />
                  </div>
                  <div className="bg-white p-4 rounded-2xl rounded-tl-sm shadow-sm border border-slate-200 flex items-center gap-2">
                    <span className="animate-bounce h-2 w-2 bg-blue-400 rounded-full delay-75"></span>
                    <span className="animate-bounce h-2 w-2 bg-blue-400 rounded-full delay-150"></span>
                    <span className="animate-bounce h-2 w-2 bg-blue-400 rounded-full delay-300"></span>
                  </div>
                </div>
              ) : insights?.text ? (
                <div className="flex gap-3">
                  <div className="bg-blue-100 p-2 rounded-xl h-9 w-9 flex items-center justify-center flex-shrink-0 shadow-sm border border-blue-200">
                    <Bot className="h-5 w-5 text-blue-700" />
                  </div>
                  <div className="bg-white p-4 rounded-2xl rounded-tl-sm shadow-sm border border-slate-200 text-sm text-slate-700 whitespace-pre-wrap leading-relaxed font-medium">
                    {insights.text}
                  </div>
                </div>
              ) : (
                <div className="flex gap-3">
                  <div className="bg-blue-100 p-2 rounded-xl h-9 w-9 flex items-center justify-center flex-shrink-0 shadow-sm border border-blue-200">
                    <Bot className="h-5 w-5 text-blue-700" />
                  </div>
                  <div className="bg-rose-50 p-4 rounded-2xl rounded-tl-sm shadow-sm border border-rose-200 text-sm text-rose-700 font-medium">
                    Unable to generate insights at the moment. Please check API configuration.
                  </div>
                </div>
              )}
            </div>

            {/* Actions Footer */}
            <div className="p-4 bg-white border-t border-slate-100 flex flex-col gap-3">
              <p className="text-xs text-slate-500 font-bold px-1 uppercase tracking-wide">Suggested Actions</p>
              <Button onClick={handleGeneratePDF} variant="outline" className="w-full justify-start text-blue-700 border-blue-200 hover:bg-blue-50 font-bold h-11">
                <FileText className="h-4 w-4 mr-2" />
                Generate Business Summary
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}