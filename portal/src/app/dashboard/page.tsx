"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";

function LabActionPanel() {
  const [podId, setPodId] = useState("pod01");
  const [lab, setLab] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function callTool(action: string) {
    setLoading(true);
    setResult(null);
    try {
      const payload: Record<string, string> = { pod_id: podId };
      if (action === "reseed_lab" && lab) payload.lab = lab;
      const res = await fetch("/api/mcp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, payload }),
      });
      const data = await res.json();
      setResult(res.ok ? `Success: ${JSON.stringify(data)}` : `Error: ${data.error || JSON.stringify(data)}`);
    } catch (err: any) {
      setResult(`Error: ${err.message}`);
    }
    setLoading(false);
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Lab Actions</h3>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Pod ID</label>
            <select value={podId} onChange={(e) => setPodId(e.target.value)} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm">
              {Array.from({ length: 10 }, (_, i) => `pod${String(i + 1).padStart(2, "0")}`).map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Lab (for reseed)</label>
            <input value={lab} onChange={(e) => setLab(e.target.value)} placeholder="e.g. IA" className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500" />
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={() => callTool("reset_pod")} disabled={loading} className="flex-1 py-2 px-4 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors">
            Reset Pod
          </button>
          <button onClick={() => callTool("reseed_lab")} disabled={loading || !lab} className="flex-1 py-2 px-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors">
            Reseed Lab
          </button>
        </div>
        {result && (
          <div className={`p-3 rounded-lg text-sm ${result.startsWith("Success") ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"}`}>
            {result}
          </div>
        )}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const role = (session?.user as any)?.role;

  useEffect(() => {
    if (status === "authenticated" && role === "student") {
      router.push("/student");
    }
  }, [status, role, router]);

  if (status === "loading") return <div className="min-h-screen bg-gray-950 flex items-center justify-center"><p className="text-gray-400">Loading...</p></div>;

  return (
    <div className="flex min-h-screen bg-gray-950">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white">Dashboard</h1>
            <p className="text-gray-400 mt-1">Welcome back, {session?.user?.name}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" /></svg>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Role</p>
                  <p className="text-white font-semibold capitalize">{role?.replace("_", " ")}</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">MCP Server</p>
                  <p className="text-white font-semibold">Connected</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">AWX Integration</p>
                  <p className="text-white font-semibold">Active</p>
                </div>
              </div>
            </div>
          </div>

          <LabActionPanel />

          {role === "global_admin" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <a href="/admin/users" className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors block">
                <h3 className="text-lg font-semibold text-white mb-2">User Management</h3>
                <p className="text-gray-400 text-sm">Manage portal users and role assignments</p>
              </a>
              <a href="/admin/logs" className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors block">
                <h3 className="text-lg font-semibold text-white mb-2">Audit Logs</h3>
                <p className="text-gray-400 text-sm">View system activity and tool usage logs</p>
              </a>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
