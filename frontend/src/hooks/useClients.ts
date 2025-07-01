import { useState, useEffect, useRef } from "react";
import api from "../lib/api";
import useDebounce from "./useDebounce";
import { ClientStatus } from "../utils/status";

export type ClientDTO = {
  id: number;
  name: string;
  status: ClientStatus;
  representativeResponseDTO: { name: string };
};

export default function useClients(
  search: string,
  sortBy: "name" | "createdAt",
  direction: "asc" | "desc",
  statusFilter: ClientStatus | ""
) {
  const [clients, setClients] = useState<ClientDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const debounced = useDebounce(search, 300);
  const timer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      setLoading(true);
      const body: Record<string, any> = { sortBy, direction };
      if (debounced.trim()) body.search = debounced.trim();
      if (statusFilter) body.status = statusFilter;

      try {
        const { data } = await api.post<ClientDTO[]>(
          "/api/clients/filter",
          body
        );
        setClients(data);
      } finally {
        setLoading(false);
      }
    }, 0);

    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [debounced, sortBy, direction, statusFilter]);

  return { clients, loading };
}
