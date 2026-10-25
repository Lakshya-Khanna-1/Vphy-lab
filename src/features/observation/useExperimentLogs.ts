import { useCallback, useEffect, useState } from "react";
import { getRecentLogs, type ExperimentLog } from "@/lib/firebase/experiments";

export function useExperimentLogs(count: number) {
  const [logs, setLogs] = useState<ExperimentLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [revision, setRevision] = useState(0);
  const refresh = useCallback(() => {
    setLoading(true);
    setError(false);
    setRevision((value) => value + 1);
  }, []);

  useEffect(() => {
    let active = true;
    getRecentLogs(count)
      .then((data) => {
        if (active) setLogs(data);
      })
      .catch(() => {
        if (active) setError(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [count, revision]);

  return { logs, loading, error, refresh };
}
