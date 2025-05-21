import { useState, useEffect, useRef } from "react";
import api from "../lib/api";
import useDebounce from "./useDebounce";

export type OrderDTO = {
  id: number;
  identifier: string;
  emissionDate: string;
  discountedValue: string;
  items: { itemName: string }[];
};

export default function useOrders(
  clientId: string | undefined,
  search: string,
  sortBy: "emissionDate" | "itemName",
  direction: "asc" | "desc"
) {
  const [orders, setOrders] = useState<OrderDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const debounced = useDebounce(search, 300);
  const timer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!clientId) return;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      setLoading(true);
      const { data } = await api.post<OrderDTO[]>(
        `/api/orders/client/${clientId}/filter`,
        { search: debounced, sortBy, direction }
      );
      setOrders(data);
      setLoading(false);
    }, 0);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [clientId, debounced, sortBy, direction]);

  return { orders, loading };
}
