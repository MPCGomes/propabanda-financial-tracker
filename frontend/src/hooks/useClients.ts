import { useState, useEffect, useRef } from "react";
import api from "../lib/api";
import useDebounce from "./useDebounce";

export type ClientDTO = {
  id: number;
  name: string;
  representativeResponseDTO: { name: string };
};

export default function useClients(
  search: string,
  sortBy: "name" | "createdAt",
  direction: "asc" | "desc"
) {
  const [clients, setClients] = useState<ClientDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const debounced = useDebounce(search, 300);
  const timer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      setLoading(true);
      const body = debounced.trim()
        ? { search: debounced, sortBy, direction }
        : { sortBy, direction };
      const { data } = await api.post<ClientDTO[]>("/api/clients/filter", body);
      setClients(data);
      setLoading(false);
    }, 0);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [debounced, sortBy, direction]);

  return { clients, loading };
}
