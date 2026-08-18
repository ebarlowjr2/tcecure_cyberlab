/**
 * Normalizes the verifier's raw lab-status output into the pod progress payload
 * consumed by the DigitalRCC portal. One module == one curriculum course.
 */

export type ProgressStatus = "not_started" | "in_progress" | "completed" | "unavailable";

export interface LabResult {
  completed?: boolean;
  reason?: string;
}

export interface CourseInfo {
  name: string;
  labs: string[];
}

export interface LabStatusData {
  pods?: Record<string, Record<string, LabResult>>;
  courses?: Record<string, CourseInfo>;
  last_run?: string | null;
}

export interface ProgressModule {
  id: string;
  title: string;
  status: ProgressStatus;
  percentage: number;
  completedAt: string | null;
}

export interface PodProgress {
  podName: string;
  studentNumber: string;
  checkedAt: string;
  overallPercentage: number;
  completedModules: number;
  totalModules: number;
  currentModule: string | null;
  status: ProgressStatus;
  modules: ProgressModule[];
  trackerUrl: string;
}

export const TRACKER_BASE_URL = "https://training.status.tcecure.com";

export function isValidPodId(pod: string): boolean {
  return /^(0[1-9]|1[0-9]|20)$/.test(pod);
}

export function trackerUrlForPod(pod: string): string {
  return `${TRACKER_BASE_URL}/pod/${pod}`;
}

function percent(completed: number, total: number): number {
  if (total <= 0) return 0;
  return Math.min(100, Math.max(0, Math.round((completed / total) * 100)));
}

function moduleStatus(completed: number, total: number): ProgressStatus {
  if (total > 0 && completed >= total) return "completed";
  return completed > 0 ? "in_progress" : "not_started";
}

export function unavailableProgress(pod: string, checkedAt = new Date().toISOString()): PodProgress {
  return {
    podName: `Pod${pod}`,
    studentNumber: pod,
    checkedAt,
    overallPercentage: 0,
    completedModules: 0,
    totalModules: 0,
    currentModule: null,
    status: "unavailable",
    modules: [],
    trackerUrl: trackerUrlForPod(pod),
  };
}

export function normalizePodProgress(pod: string, data: LabStatusData): PodProgress {
  const labs = data.pods?.[`pod${pod}`];
  const courses = data.courses;

  if (!labs || !courses || Object.keys(courses).length === 0) {
    return unavailableProgress(pod, data.last_run ?? undefined);
  }

  const checkedAt = data.last_run ?? new Date().toISOString();

  const modules: ProgressModule[] = Object.entries(courses).map(([courseId, course]) => {
    const total = course.labs.length;
    const completed = course.labs.filter((lab) => labs[lab]?.completed === true).length;
    const status = moduleStatus(completed, total);

    return {
      id: courseId,
      title: course.name,
      status,
      percentage: percent(completed, total),
      // The verifier reports current state only, so a per-module completion
      // time is not available; the run timestamp is the best it can attest to.
      completedAt: status === "completed" ? checkedAt : null,
    };
  });

  const allLabs = Object.values(courses).flatMap((course) => course.labs);
  const completedLabs = allLabs.filter((lab) => labs[lab]?.completed === true).length;
  const overallPercentage = percent(completedLabs, allLabs.length);
  const completedModules = modules.filter((module) => module.status === "completed").length;
  const currentModule =
    modules.find((module) => module.status === "in_progress")?.id ??
    modules.find((module) => module.status !== "completed")?.id ??
    null;

  return {
    podName: `Pod${pod}`,
    studentNumber: pod,
    checkedAt,
    overallPercentage,
    completedModules,
    totalModules: modules.length,
    currentModule,
    status: moduleStatus(completedLabs, allLabs.length),
    modules,
    trackerUrl: trackerUrlForPod(pod),
  };
}
