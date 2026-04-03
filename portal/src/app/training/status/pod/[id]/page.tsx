"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
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

export default function PodStatusPage() {
  const params = useParams();
  const podNumber = String(params.id).padStart(2, "0");
  const podKey = `pod${podNumber}`;

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
        if (data.error) setError(data.error);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unknown error";
        setError(message);
      } finally {
        setLoading(false);
      }
    }
    fetchStatus();
    const interval = setInterval(fetchStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  const podLabs = labData?.pods?.[podKey];
  const courses = labData?.courses;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading pod {podNumber} status...</p>
        </div>
      </div>
    );
  }

  if (!podLabs) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 text-lg mb-4">Pod {podNumber} not found</p>
          <Link href="/training/status" className="text-blue-400 hover:text-blue-300 underline">
            Back to all pods
          </Link>
        </div>
      </div>
    );
  }

  const completedCount = Object.values(podLabs).filter((l) => l.completed).length;
  const totalCount = Object.keys(podLabs).length;
  const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-950">
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/training/status"
              className="text-gray-400 hover:text-white transition-colors"
              title="Back to all pods"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <span className="text-blue-400 font-bold text-sm">{podNumber}</span>
              </div>
              <div>
                <h1 className="text-white font-bold text-lg">Pod {podNumber} Progress</h1>
                <p className="text-gray-500 text-xs">
                  {completedCount} of {totalCount} labs completed ({pct}%)
                </p>
              </div>
            </div>
          </div>
          {labData?.last_run && (
            <p className="text-gray-500 text-sm hidden md:block">
              Last verified: {new Date(labData.last_run).toLocaleString()}
            </p>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {error && (
          <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-400 text-sm">
            {error}
          </div>
        )}

        {/* Overall progress bar */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-white font-semibold">Overall Progress</span>
            <span className="text-gray-400 text-sm">{pct}%</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all ${
                pct === 100 ? "bg-emerald-500" : pct > 0 ? "bg-blue-500" : "bg-gray-700"
              }`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {/* Lab details by course */}
        {courses &&
          Object.entries(courses).map(([courseKey, course]) => {
            const courseLabs = course.labs;
            const courseCompleted = courseLabs.filter((l) => podLabs[l]?.completed).length;
            const coursePct = courseLabs.length > 0 ? Math.round((courseCompleted / courseLabs.length) * 100) : 0;

            return (
              <div key={courseKey} className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-white font-semibold text-lg">{course.name}</h2>
                  <span className="text-gray-400 text-sm">
                    {courseCompleted}/{courseLabs.length} ({coursePct}%)
                  </span>
                </div>
                <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                  {courseLabs.map((labId, idx) => {
                    const result = podLabs[labId];
                    const isCompleted = result?.completed ?? false;
                    return (
                      <div
                        key={labId}
                        className={`flex items-center justify-between px-6 py-4 ${
                          idx < courseLabs.length - 1 ? "border-b border-gray-800/50" : ""
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              isCompleted
                                ? "bg-emerald-500/10 text-emerald-400"
                                : "bg-gray-800 text-gray-500"
                            }`}
                          >
                            {isCompleted ? (
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            ) : (
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01" />
                              </svg>
                            )}
                          </div>
                          <div>
                            <p className="text-white text-sm font-medium">{labId}</p>
                            {result?.reason && (
                              <p className="text-gray-500 text-xs mt-0.5">{result.reason}</p>
                            )}
                          </div>
                        </div>
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            isCompleted
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : "bg-gray-800 text-gray-500 border border-gray-700"
                          }`}
                        >
                          {isCompleted ? "Completed" : "Incomplete"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
      </main>
    </div>
  );
}
