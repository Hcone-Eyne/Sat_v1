"use client";

import { CheckCircle2, AlertCircle, Clock } from "lucide-react";

interface ModelEntry {
  name: string;
  type: string;
  duration: string;
  status: "success" | "partial";
}

interface ExecutionSummaryProps {
  models: ModelEntry[];
  totalDuration: string;
}

export default function ExecutionSummary({
  models,
  totalDuration,
}: ExecutionSummaryProps) {
  return (
    <div className="rounded-xl border border-card-border bg-card-bg p-4 space-y-3">
      <h3 className="text-sm font-semibold text-foreground">Execution Summary</h3>

      <div className="divide-y divide-card-border">
        {models.map((m, i) => (
          <div key={i} className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{m.name}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="px-1.5 py-0.5 text-[10px] font-medium bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded">
                  {m.type}
                </span>
                <span className="flex items-center gap-1 text-[11px] text-muted">
                  <Clock className="w-3 h-3" />
                  {m.duration}
                </span>
              </div>
            </div>
            <div className="shrink-0">
              {m.status === "success" ? (
                <CheckCircle2 className="w-4 h-4 text-green-500" />
              ) : (
                <AlertCircle className="w-4 h-4 text-yellow-500" />
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="pt-2 border-t border-card-border flex items-center justify-between">
        <span className="text-xs text-muted">Total Duration</span>
        <span className="text-sm font-semibold text-foreground">{totalDuration}</span>
      </div>
    </div>
  );
}
