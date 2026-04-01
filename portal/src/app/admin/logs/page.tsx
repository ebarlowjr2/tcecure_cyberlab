"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";

interface LogEntry {
  id: string;
  userId: string | null;
  roleName: string | null;
  actionType: string;
  promptText: string | null;
  toolName: string | null;
  toolPayload: string | null;
  resultStatus: string | null;
  resultSummary: string | null;
  awxJobId: string | null;
  createdAt: string;
  user: { email: string; fullName: string } | null;
}

export default function LogsPage() {
  const { } = useSession();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/logs")
      .then((r) => r.json())
      .then(setLogs)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-950">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white">Audit Logs</h1>
            <p className="text-gray-400 mt-1">System activity and tool usage history</p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">Time</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">User</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">Role</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">Action</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">Tool</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">Status</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">AWX Job</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">Summary</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={8} className="px-4 py-8 text-center text-gray-500">Loading...</td></tr>
                  ) : logs.length === 0 ? (
                    <tr><td colSpan={8} className="px-4 py-8 text-center text-gray-500">No logs yet</td></tr>
                  ) : logs.map((log) => (
                    <tr key={log.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                      <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{new Date(log.createdAt).toLocaleString()}</td>
                      <td className="px-4 py-3 text-xs text-gray-300">{log.user?.email || "system"}</td>
                      <td className="px-4 py-3 text-xs text-gray-400">{log.roleName || "-"}</td>
                      <td className="px-4 py-3 text-xs"><span className={`px-2 py-0.5 rounded text-xs font-medium ${log.actionType === "tool_denied" ? "bg-red-500/10 text-red-400" : log.actionType === "tool_call" ? "bg-blue-500/10 text-blue-400" : "bg-gray-500/10 text-gray-400"}`}>{log.actionType}</span></td>
                      <td className="px-4 py-3 text-xs text-gray-300">{log.toolName || "-"}</td>
                      <td className="px-4 py-3 text-xs"><span className={`px-2 py-0.5 rounded text-xs font-medium ${log.resultStatus === "success" ? "bg-emerald-500/10 text-emerald-400" : log.resultStatus === "denied" ? "bg-red-500/10 text-red-400" : "bg-gray-500/10 text-gray-400"}`}>{log.resultStatus || "-"}</span></td>
                      <td className="px-4 py-3 text-xs text-gray-400">{log.awxJobId || "-"}</td>
                      <td className="px-4 py-3 text-xs text-gray-500 max-w-xs truncate">{log.resultSummary || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
