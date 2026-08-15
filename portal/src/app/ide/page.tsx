"use client";

import Sidebar from "@/components/Sidebar";

export default function IDEPage() {
  return (
    <div className="flex min-h-screen bg-gray-950">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <div className="border-b border-gray-800 px-6 py-4">
          <h1 className="text-lg font-semibold text-white flex items-center gap-2">
            <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            AI IDE
          </h1>
          <p className="text-gray-500 text-sm">OpenHands coding environment</p>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md px-6">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 flex items-center justify-center">
              <svg className="w-10 h-10 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Coming Soon</h2>
            <p className="text-gray-400 leading-relaxed">
              The AI-powered IDE integration is currently being configured. This feature will provide an embedded OpenHands coding environment for lab operations and automation tasks.
            </p>
            <div className="mt-8 inline-flex items-center gap-2 text-sm text-gray-500 bg-gray-900 border border-gray-800 rounded-lg px-4 py-2">
              <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              Under Development
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
