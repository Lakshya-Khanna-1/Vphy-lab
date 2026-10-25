import { db, firebaseConfigured } from "./config";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit as limitResults,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import {
  isRecord,
  observationsToCSV,
  type ObservationRow,
} from "@/lib/observations";

export interface ExperimentLog {
  id: string;
  experimentType: string;
  experimentName: string;
  sessionId: string;
  data: ObservationRow[];
  status: "COMPLETED" | "IN_PROGRESS";
  createdAt: Timestamp | null;
  storage: "cloud" | "local";
}

const COLLECTION = "experiment_logs";
const BACKUP_PREFIX = "vpl_backup_";

function generateSessionId(): string {
  return `VPL-S-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
}

function parseLog(
  id: string,
  value: unknown,
  storage: ExperimentLog["storage"],
): ExperimentLog | null {
  if (
    !isRecord(value) ||
    typeof value.experimentType !== "string" ||
    typeof value.experimentName !== "string" ||
    !Array.isArray(value.data) ||
    !value.data.every(isRecord)
  )
    return null;
  const savedAt =
    typeof value.savedAt === "string" ? new Date(value.savedAt) : null;
  const createdAt =
    value.createdAt instanceof Timestamp
      ? value.createdAt
      : savedAt && Number.isFinite(savedAt.getTime())
        ? Timestamp.fromDate(savedAt)
        : null;
  return {
    id,
    experimentType: value.experimentType,
    experimentName: value.experimentName,
    sessionId: typeof value.sessionId === "string" ? value.sessionId : id,
    data: value.data,
    status: value.status === "IN_PROGRESS" ? "IN_PROGRESS" : "COMPLETED",
    createdAt,
    storage,
  };
}

function localLogs(): ExperimentLog[] {
  if (typeof window === "undefined") return [];
  const logs: ExperimentLog[] = [];
  for (let index = 0; index < localStorage.length; index++) {
    const key = localStorage.key(index);
    if (!key?.startsWith(BACKUP_PREFIX)) continue;
    try {
      const log = parseLog(
        key,
        JSON.parse(localStorage.getItem(key) ?? "null"),
        "local",
      );
      if (log) logs.push(log);
    } catch {
      /* A damaged backup must not hide the remaining sessions. */
    }
  }
  return logs;
}

export async function saveExperimentData(
  experimentType: string,
  experimentName: string,
  data: readonly object[],
): Promise<string> {
  const payload = {
    experimentType,
    experimentName,
    sessionId: generateSessionId(),
    data: data.map((row) => Object.fromEntries(Object.entries(row))),
    status: "COMPLETED",
  };
  const saveOnDevice = () => {
    const key = `${BACKUP_PREFIX}${crypto.randomUUID()}`;
    localStorage.setItem(key, JSON.stringify({ ...payload, savedAt: new Date().toISOString() }));
    return key;
  };
  if (!firebaseConfigured || (typeof navigator !== 'undefined' && !navigator.onLine)) return saveOnDevice();
  try {
    const result = await addDoc(collection(db, COLLECTION), {
      ...payload,
      createdAt: serverTimestamp(),
    });
    return result.id;
  } catch {
    return saveOnDevice();
  }
}

export async function getRecentLogs(count = 20): Promise<ExperimentLog[]> {
  const maximum = Math.min(500, Math.max(1, Math.floor(count)));
  let backups: ExperimentLog[] = [];
  try {
    backups = localLogs();
  } catch {
    /* Cloud reading remains available if device storage is blocked. */
  }
  if (!firebaseConfigured) return backups.sort((a,b) => (b.createdAt?.toMillis() ?? 0) - (a.createdAt?.toMillis() ?? 0)).slice(0, maximum);
  try {
    const snapshot = await getDocs(
      query(
        collection(db, COLLECTION),
        orderBy("createdAt", "desc"),
        limitResults(maximum),
      ),
    );
    const cloud = snapshot.docs.flatMap((document) => {
      const log = parseLog(document.id, document.data(), "cloud");
      return log ? [log] : [];
    });
    return [...cloud, ...backups]
      .sort(
        (a, b) =>
          (b.createdAt?.toMillis() ?? 0) - (a.createdAt?.toMillis() ?? 0),
      )
      .slice(0, maximum);
  } catch (error) {
    if (backups.length > 0)
      return backups
        .sort(
          (a, b) =>
            (b.createdAt?.toMillis() ?? 0) - (a.createdAt?.toMillis() ?? 0),
        )
        .slice(0, maximum);
    throw error;
  }
}

export function exportToCSV(
  experimentName: string,
  data: readonly object[],
): void {
  if (data.length === 0) return;
  const rows = data.map((row) => Object.fromEntries(Object.entries(row)));
  const blob = new Blob([observationsToCSV(rows)], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${experimentName.replace(/[^a-zA-Z0-9_-]/g, "_")}_${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}
