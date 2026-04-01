"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import Sidebar from "@/components/Sidebar";

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

export default function AIPage() {
  const { data: session } = useSession();
  const role = (session?.user as any)?.role || "student";
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "system",
      content: role === "global_admin"
        ? "CyberLab AI Assistant — Global Admin mode. You have access to all operational tools: reset_pod, reseed_lab, and system management."
        : "CyberLab AI Assistant — Lab Admin mode. You can use reset_pod and reseed_lab tools for lab management.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.response || data.error || "No response" }]);
    } catch (err: any) {
      setMessages((prev) => [...prev, { role: "assistant", content: `Error: ${err.message}` }]);
    }
    setLoading(false);
  }

  return (
    <div className="flex min-h-screen bg-gray-950">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <div className="border-b border-gray-800 px-6 py-4">
          <h1 className="text-lg font-semibold text-white">AI Assistant</h1>
          <p className="text-gray-500 text-sm">
            {role === "global_admin" ? "Full operational access" : "Lab reset/reseed operations only"}
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.filter((m) => m.role !== "system").map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-2xl px-4 py-3 rounded-xl text-sm ${
                msg.role === "user"
                  ? "bg-emerald-600 text-white"
                  : "bg-gray-800 text-gray-200 border border-gray-700"
              }`}>
                <pre className="whitespace-pre-wrap font-sans">{msg.content}</pre>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-gray-800 p-4">
          <form onSubmit={handleSubmit} className="flex gap-3 max-w-4xl mx-auto">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask the AI to reset a pod, reseed a lab..."
              className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-medium rounded-xl transition-colors"
            >
              Send
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
