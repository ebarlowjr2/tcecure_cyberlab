"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import Sidebar from "@/components/Sidebar";

interface Student {
  id: string;
  email: string;
  fullName: string;
  isActive: boolean;
  pods: string[];
  createdAt: string;
}

const POD_OPTIONS = Array.from({ length: 10 }, (_, i) => `pod${String(i + 1).padStart(2, "0")}`);

export default function EnrollmentPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const role = (session?.user as any)?.role;

  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Enroll form state
  const [showForm, setShowForm] = useState(false);
  const [formEmail, setFormEmail] = useState("");
  const [formName, setFormName] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [formPod, setFormPod] = useState("");
  const [enrolling, setEnrolling] = useState(false);
  const [enrollError, setEnrollError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "authenticated" && role !== "global_admin") {
      router.push("/dashboard");
    }
  }, [status, role, router]);

  const fetchStudents = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/enrollment");
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to fetch students");
        return;
      }
      const data = await res.json();
      setStudents(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === "authenticated" && role === "global_admin") {
      fetchStudents();
    }
  }, [status, role, fetchStudents]);

  async function handleEnroll(e: React.FormEvent) {
    e.preventDefault();
    setEnrolling(true);
    setEnrollError(null);

    try {
      const res = await fetch("/api/admin/enrollment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formEmail,
          fullName: formName,
          password: formPassword,
          podId: formPod || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setEnrollError(data.error || "Enrollment failed");
      } else {
        setFormEmail("");
        setFormName("");
        setFormPassword("");
        setFormPod("");
        setShowForm(false);
        fetchStudents();
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setEnrollError(message);
    } finally {
      setEnrolling(false);
    }
  }

  async function handlePodAssign(userId: string, podId: string) {
    try {
      await fetch("/api/admin/enrollment", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, podId, action: "assign" }),
      });
      fetchStudents();
    } catch {
      // silently retry on next action
    }
  }

  async function handlePodRemove(userId: string, podId: string) {
    try {
      await fetch("/api/admin/enrollment", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, podId, action: "remove" }),
      });
      fetchStudents();
    } catch {
      // silently retry on next action
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-950">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-white">Student Enrollment</h1>
              <p className="text-gray-400 mt-1">
                Manage student accounts and pod assignments
              </p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-lg transition-colors"
            >
              {showForm ? "Cancel" : "Enroll Student"}
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          {showForm && (
            <div className="mb-8 bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Enroll New Student</h3>
              <form onSubmit={handleEnroll} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm"
                      placeholder="Jane Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Email</label>
                    <input
                      type="email"
                      required
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm"
                      placeholder="jane@tcecure.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Password</label>
                    <input
                      type="password"
                      required
                      value={formPassword}
                      onChange={(e) => setFormPassword(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm"
                      placeholder="Initial password"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Assign to Pod (optional)</label>
                    <select
                      value={formPod}
                      onChange={(e) => setFormPod(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm"
                    >
                      <option value="">No pod assigned</option>
                      {POD_OPTIONS.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                </div>
                {enrollError && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                    {enrollError}
                  </div>
                )}
                <button
                  type="submit"
                  disabled={enrolling}
                  className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  {enrolling ? "Enrolling..." : "Enroll Student"}
                </button>
              </form>
            </div>
          )}

          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-gray-800">
              <h3 className="text-white font-semibold">{students.length} Students Enrolled</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left text-xs text-gray-500 uppercase tracking-wider px-6 py-3">Name</th>
                    <th className="text-left text-xs text-gray-500 uppercase tracking-wider px-6 py-3">Email</th>
                    <th className="text-left text-xs text-gray-500 uppercase tracking-wider px-6 py-3">Status</th>
                    <th className="text-left text-xs text-gray-500 uppercase tracking-wider px-6 py-3">Pod(s)</th>
                    <th className="text-left text-xs text-gray-500 uppercase tracking-wider px-6 py-3">Enrolled</th>
                    <th className="text-left text-xs text-gray-500 uppercase tracking-wider px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((s) => (
                    <tr key={s.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                      <td className="px-6 py-4 text-sm text-white">{s.fullName}</td>
                      <td className="px-6 py-4 text-sm text-gray-400">{s.email}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          s.isActive
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-red-500/10 text-red-400"
                        }`}>
                          {s.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {s.pods.length > 0 ? s.pods.map((p) => (
                            <span key={p} className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-blue-500/10 text-blue-400">
                              {p}
                              <button
                                onClick={() => handlePodRemove(s.id, p)}
                                className="hover:text-red-400 transition-colors"
                                title="Remove pod"
                              >
                                &times;
                              </button>
                            </span>
                          )) : (
                            <span className="text-xs text-gray-600">Unassigned</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(s.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <select
                          className="px-2 py-1 bg-gray-800 border border-gray-700 rounded text-xs text-gray-300"
                          defaultValue=""
                          onChange={(e) => {
                            if (e.target.value) {
                              handlePodAssign(s.id, e.target.value);
                              e.target.value = "";
                            }
                          }}
                        >
                          <option value="" disabled>Assign pod...</option>
                          {POD_OPTIONS.filter((p) => !s.pods.includes(p)).map((p) => (
                            <option key={p} value={p}>{p}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                  {students.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                        No students enrolled yet. Click &quot;Enroll Student&quot; to get started.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
