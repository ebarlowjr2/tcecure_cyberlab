"use client";

import { useSession } from "next-auth/react";
import Sidebar from "@/components/Sidebar";

export default function StudentPage() {
  const { data: session } = useSession();

  return (
    <div className="flex min-h-screen bg-gray-950">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white">Student Dashboard</h1>
            <p className="text-gray-400 mt-1">Welcome, {session?.user?.name}</p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-500/10 mb-6">
              <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-white mb-3">Student Tools Coming Soon</h2>
            <p className="text-gray-400 max-w-md mx-auto">
              Your lab environment and interactive tools are being prepared. Check back soon for access to hands-on cyber range exercises.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
