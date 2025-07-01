import { useState, useEffect, useCallback } from "react";
import api from "../lib/api";
import type { AxiosRequestConfig } from "axios";

export function useFetch<T = unknown>(
  url: string,
  config?: AxiosRequestConfig,
  deps: any[] = [],
  initialData: T | null = null
) {
  const [data, setData] = useState<T | null>(initialData);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await api.request<T>({ url, ...config });
      setData(resp.data);
    } catch (err: any) {
      setError(
        typeof err.response?.data === "string" ? err.response.data : err.message
      );
    } finally {
      setLoading(false);
    }
  }, [url, JSON.stringify(config), ...deps]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
