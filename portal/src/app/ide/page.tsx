"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import Sidebar from "@/components/Sidebar";

export default function IDEPage() {
  const { data: session } = useSession();
  const role = (session?.user as any)?.role || "student";
  const userName = session?.user?.name || "";
  const [loading, setLoading] = useState(true);

  const openhandsUrl = process.env.NEXT_PUBLIC_OPENHANDS_URL || "";

  return (
    <div className="flex min-h-screen bg-gray-950">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <div className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-white flex items-center gap-2">
              <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              AI IDE
            </h1>
            <p className="text-gray-500 text-sm">
              OpenHands coding environment &mdash; {role === "global_admin" ? "Full access" : "Lab operations"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500">Connected as {userName}</span>
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        </div>

        <div className="flex-1 relative">
          {!openhandsUrl ? (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-950">
              <div className="text-center">
                <svg className="w-12 h-12 text-amber-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <p className="text-white font-medium">OpenHands IDE not configured</p>
                <p className="text-gray-500 text-sm mt-1">Set NEXT_PUBLIC_OPENHANDS_URL in the environment and rebuild.</p>
              </div>
            </div>
          ) : (
            <>
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-950 z-10">
                  <div className="text-center">
                    <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                    <p className="text-gray-400 text-sm">Loading OpenHands IDE...</p>
                  </div>
                </div>
              )}
              <iframe
                src={openhandsUrl}
                className="w-full h-full border-0"
                style={{ minHeight: "calc(100vh - 73px)" }}
                onLoad={() => setLoading(false)}
                allow="clipboard-read; clipboard-write"
                title="OpenHands IDE"
              />
            </>
          )}
        </div>
      </main>
    </div>
  );
}
