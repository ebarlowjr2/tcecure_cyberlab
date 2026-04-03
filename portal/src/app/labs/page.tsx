"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import Sidebar from "@/components/Sidebar";

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

function StatusBadge({ completed }: { completed: boolean }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
        completed
          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
          : "bg-gray-700/50 text-gray-400 border border-gray-600/30"
      }`}
    >
      {completed ? "C" : "I"}
    </span>
  );
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
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold">Pod {podNumber}</h3>
        <span className="text-sm text-gray-400">
          {completedCount}/{totalCount} ({pct}%)
        </span>
      </div>
      <div className="w-full bg-gray-800 rounded-full h-2 mb-4">
        <div
          className="bg-emerald-500 h-2 rounded-full transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      {Object.entries(courses).map(([courseKey, course]) => (
        <div key={courseKey} className="mb-3 last:mb-0">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1.5">
            {course.name}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {course.labs.map((labId) => {
              const result = labs[labId];
              return (
                <div
                  key={labId}
                  className="group relative"
                  title={result?.reason || "No data"}
                >
                  <div
                    className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${
                      result?.completed
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-gray-800 text-gray-500"
                    }`}
                  >
                    <span>{labId}</span>
                    <StatusBadge completed={result?.completed ?? false} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function LabProgressPage() {
  const { status } = useSession();
  const router = useRouter();
  const [labData, setLabData] = useState<LabStatusData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [courseFilter, setCourseFilter] = useState<string>("all");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    async function fetchStatus() {
      try {
        const res = await fetch("/api/lab-status");
        if (!res.ok) {
          const data = await res.json();
          setError(data.error || "Failed to fetch lab status");
          return;
        }
        const data = await res.json();
        setLabData(data);
        if (data.error) setError(data.error);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unknown error";
        setError(message);
      } finally {
        setLoading(false);
      }
    }
    if (status === "authenticated") fetchStatus();
  }, [status]);

  const summary = useMemo(() => {
    if (!labData?.pods) return { total: 0, completed: 0, incomplete: 0 };
    let total = 0;
    let completed = 0;
    for (const pod of Object.values(labData.pods)) {
      for (const lab of Object.values(pod)) {
        if (courseFilter !== "all" && lab.course !== courseFilter) continue;
        total++;
        if (lab.completed) completed++;
      }
    }
    return { total, completed, incomplete: total - completed };
  }, [labData, courseFilter]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <p className="text-gray-400">Loading lab progress...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-950">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-white">Lab Progress</h1>
              <p className="text-gray-400 mt-1">
                Completed/Incomplete status across all pods
                {labData?.last_run && (
                  <span className="text-gray-500 text-sm ml-2">
                    Last verified: {new Date(labData.last_run).toLocaleString()}
                  </span>
                )}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={courseFilter}
                onChange={(e) => setCourseFilter(e.target.value)}
                className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm"
              >
                <option value="all">All Courses</option>
                {labData?.courses &&
                  Object.entries(labData.courses).map(([key, course]) => (
                    <option key={key} value={key}>
                      {course.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-400 text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <p className="text-gray-400 text-sm">Total Labs</p>
              <p className="text-3xl font-bold text-white mt-1">{summary.total}</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <p className="text-gray-400 text-sm">Completed</p>
              <p className="text-3xl font-bold text-emerald-400 mt-1">{summary.completed}</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <p className="text-gray-400 text-sm">Incomplete</p>
              <p className="text-3xl font-bold text-gray-400 mt-1">{summary.incomplete}</p>
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
        </div>
      </main>
    </div>
  );
}
