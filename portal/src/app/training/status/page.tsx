"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";

interface LabResult {
  completed: boolean;
  reason: string;
  course?: string;
}

interface CourseInfo {
  name: string;
  labs: string[];
}

interface LabStatusData {
  pods: Record<string, Record<string, LabResult>>;
  last_run: string | null;
  courses: Record<string, CourseInfo>;
  error?: string;
}

function PodCard({
  podId,
  labs,
  courses,
}: {
  podId: string;
  labs: Record<string, LabResult>;
  courses: Record<string, CourseInfo>;
}) {
  const podNumber = podId.replace("pod", "");
  const completedCount = Object.values(labs).filter((l) => l.completed).length;
  const totalCount = Object.keys(labs).length;
  const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <Link
      href={`/training/status/pod/${podNumber}`}
      className="block bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-blue-500/50 transition-colors"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold text-lg">Pod {podNumber}</h3>
        <span className="text-sm text-gray-400">
          {completedCount}/{totalCount} ({pct}%)
        </span>
      </div>
      <div className="w-full bg-gray-800 rounded-full h-2.5 mb-4">
        <div
          className={`h-2.5 rounded-full transition-all ${
            pct === 100 ? "bg-emerald-500" : pct > 0 ? "bg-blue-500" : "bg-gray-700"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {Object.entries(courses).map(([courseKey, course]) => {
        const courseCompleted = course.labs.filter((l) => labs[l]?.completed).length;
        return (
          <div key={courseKey} className="flex items-center justify-between text-sm mb-1">
            <span className="text-gray-400">{course.name}</span>
            <span className="text-gray-500">
              {courseCompleted}/{course.labs.length}
            </span>
          </div>
        );
      })}
    </Link>
  );
}

export default function TrainingStatusPage() {
  const [labData, setLabData] = useState<LabStatusData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStatus() {
      try {
        const res = await fetch("/api/training-status");
        if (!res.ok) {
          const data = await res.json();
          setError(data.error || "Failed to fetch lab status");
          return;
        }
        const data = await res.json();
        setLabData(data);
        setError(data.error || null);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unknown error";
        setError(message);
      } finally {
        setLoading(false);
      }
    }
    fetchStatus();
    // Auto-refresh every 60 seconds
    const interval = setInterval(fetchStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  const summary = useMemo(() => {
    if (!labData?.pods) return { totalPods: 0, totalLabs: 0, completed: 0 };
    let totalLabs = 0;
    let completed = 0;
    for (const pod of Object.values(labData.pods)) {
      for (const lab of Object.values(pod)) {
        totalLabs++;
        if (lab.completed) completed++;
      }
    }
    return { totalPods: Object.keys(labData.pods).length, totalLabs, completed };
  }, [labData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading training status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <div>
              <h1 className="text-white font-bold text-lg">CRC Training Status</h1>
              <p className="text-gray-500 text-xs">TCecure CyberLab</p>
            </div>
          </div>
          {labData?.last_run && (
            <p className="text-gray-500 text-sm">
              Last verified: {new Date(labData.last_run).toLocaleString()}
            </p>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {error && (
          <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-400 text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <p className="text-gray-400 text-sm">Total Pods</p>
            <p className="text-3xl font-bold text-white mt-1">{summary.totalPods}</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <p className="text-gray-400 text-sm">Labs Completed</p>
            <p className="text-3xl font-bold text-emerald-400 mt-1">{summary.completed}</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <p className="text-gray-400 text-sm">Labs Remaining</p>
            <p className="text-3xl font-bold text-gray-400 mt-1">
              {summary.totalLabs - summary.completed}
            </p>
          </div>
        </div>

        {labData?.pods && labData.courses && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {Object.entries(labData.pods)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([podId, labs]) => (
                <PodCard
                  key={podId}
                  podId={podId}
                  labs={labs}
                  courses={labData.courses}
                />
              ))}
          </div>
        )}
      </main>
    </div>
  );
}
