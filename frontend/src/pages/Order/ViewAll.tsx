import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../../components/Header";
import UserHeader from "../../components/UserHeader";
import Order from "../../components/Order";
import FloatingButton from "../../components/FloatingButton";
import SearchAndSort from "../../components/SearchAndSort";
import { FaPlus } from "react-icons/fa6";
import api from "../../lib/api";
import { useShowValues } from "../../contexts/ShowValuesContext";

type OrderDTO = {
  id: number;
  identifier: string;
  clientName: string;
  emissionDate: string;
  discountedValue: number;
};

const orderOptions = [
  { value: "emissionDate|desc", label: "Mais recentes" },
  { value: "emissionDate|asc", label: "Mais antigos" },
];

export default function Orders() {
  const { show } = useShowValues();
  const navigate = useNavigate();

  const [orders, setOrders] = useState<OrderDTO[]>([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"emissionDate">("emissionDate");
  const [direction, setDirection] = useState<"asc" | "desc">("desc");

  const timer = useRef<NodeJS.Timeout | null>(null);

  const fetchOrders = async () => {
    const payload = { sortBy, direction, ...(search.trim() && { search }) };
    const { data } = await api.post<OrderDTO[]>("/api/orders/filter", payload);
    setOrders(
      data.map((o) => ({
        id: o.id,
        identifier: o.identifier,
        clientName: o.clientName,
        emissionDate: o.emissionDate,
        discountedValue: +o.discountedValue,
      }))
    );
  };

  useEffect(() => {
    if (timer.current) {
      clearTimeout(timer.current);
    }
    timer.current = setTimeout(fetchOrders, 300);
    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
    };
  }, [search, sortBy, direction]);

  const applyOrder = (value: string) => {
    const [s, d] = value.split("|") as ["emissionDate", "asc" | "desc"];
    setSortBy(s);
    setDirection(d);
  };

  return (
    <section className="bg-[#f6f6f6] lg:flex justify-center items-start min-h-screen">
      <div className="fixed bottom-0 w-full lg:pt-4 bg-[#282828] rounded-lg flex justify-center p-1 lg:w-35 lg:flex-col lg:justify-start lg:p-2 lg:top-15 lg:bottom-0 lg:rounded-none lg:left-0 z-10 border-gray-200 border-r-1">
        <Header orders="active" />
      </div>
      <UserHeader />
      <div className="w-full max-w-[1280px] flex lg:flex-row gap-5 pt-25 lg:pb-22">
        <div className="flex flex-col gap-5 w-full p-4 pb-[100px] lg:pl-38 lg:pr-4">
          <SearchAndSort
            search={search}
            onSearchChange={setSearch}
            sortOptions={orderOptions}
            selectedSort={`${sortBy}|${direction}`}
            onSortChange={applyOrder}
          />

          <div className="flex flex-col gap-3 p-2 bg-white rounded-lg">
            {orders.map((o) => (
              <Order
                key={o.id}
                product={`Pedido Nº ${o.identifier}`}
                date={`${o.clientName} | ${o.emissionDate}`}
                value={
                  show
                    ? new Intl.NumberFormat("pt-BR", {
                        minimumFractionDigits: 2,
                      }).format(o.discountedValue)
                    : "***"
                }
                color="#32c058"
                link={`/orders/${o.id}`}
                icon="+"
              />
            ))}
            {!orders.length && (
              <p className="text-center text-sm text-gray-500 py-6">
                Nenhum pedido encontrado.
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="fixed bottom-25 right-4 lg:bottom-10 lg:right-5">
        <FloatingButton
          background="#FFA322"
          onClick={() => navigate("/orders/register")}
        >
          <FaPlus className="text-lg" /> Adicionar Pedido
        </FloatingButton>
      </div>
    </section>
  );
}
