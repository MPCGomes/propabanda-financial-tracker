import { useEffect, useRef, useState } from "react";
import Header from "../components/Header";
import Order from "../components/Order";
import FloatingButton from "../components/FloatingButton";
import Filter from "../components/Filter";
import SearchBar from "../components/SearchBar";
import Modal from "../components/Modal";
import Button from "../components/Button";
import FilterSelect from "../components/FilterSelect";
import { FaPlus } from "react-icons/fa6";
import api from "../lib/api";
import UserHeader from "../components/UserHeader";
import { useShowValues } from "../contexts/ShowValuesContext";

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

  const [orders, setOrders] = useState<OrderDTO[]>([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"emissionDate">("emissionDate");
  const [direction, setDirection] = useState<"asc" | "desc">("desc");
  const [openModal, setOpenModal] = useState<null | "order">(null);

  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchOrders = async () => {
    const payload = {
      sortBy,
      direction,
      ...(search.trim() && { search }),
    };
    const { data } = await api.post("/api/orders/filter", payload);
    setOrders(
      data.map((o: any) => ({
        id: o.id,
        identifier: o.identifier,
        clientName: o.client?.name ?? o.clientName ?? "",
        emissionDate: o.emissionDate,
        discountedValue: +o.discountedValue,
      }))
    );
  };

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(fetchOrders, 300);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [search, sortBy, direction]);

  const applyOrder = (value: string) => {
    const [s, d] = value.split("|") as ["emissionDate", "asc" | "desc"];
    setSortBy(s);
    setDirection(d);
    setOpenModal(null);
  };

  return (
    <section className="bg-[#f6f6f6] lg:flex justify-center items-center min-h-screen lg:p-3 lg:items-start">
      <div className="w-full max-w-[1280px] flex lg:flex-row gap-5 pt-12 lg:pt-20 lg:pb-22">
        <div className="fixed bottom-0 w-full bg-white rounded-lg flex justify-center p-1 lg:w-35 lg:flex-col lg:justify-start lg:p-2 lg:top-23 lg:bottom-25 z-10">
          <Header orders="active" />
        </div>

        <div className="flex flex-col gap-5 w-full p-4 pb-[100px] lg:p-0 lg:pb-0 lg:ml-40">
          <UserHeader />

          <div className="flex gap-5 flex-col lg:flex-row lg:justify-between lg:items-center">
            <SearchBar onChange={setSearch} />

            <div className="flex gap-3">
              <div className="hidden lg:block">
                <FilterSelect
                  options={orderOptions}
                  placeholder="Ordem"
                  value={`${sortBy}|${direction}`}
                  onChange={applyOrder}
                />
              </div>

              <Filter
                text="Ordem"
                onClick={() => setOpenModal("order")}
                className="lg:hidden"
              />
            </div>

            <Modal
              isOpen={openModal === "order"}
              onClose={() => setOpenModal(null)}
              title="Ordenar"
            >
              <div className="flex flex-col gap-2">
                {orderOptions.map((opt) => (
                  <label key={opt.value} className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="order"
                      value={opt.value}
                      onChange={() => applyOrder(opt.value)}
                      defaultChecked={opt.value === `${sortBy}|${direction}`}
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
              <Button onClick={() => setOpenModal(null)}>Aplicar filtro</Button>
            </Modal>
          </div>

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

      <a
        href="/orders/register"
        className="fixed bottom-25 right-4 lg:bottom-10 lg:right-5"
      >
        <FloatingButton background="#FFA322">
          <FaPlus className="text-lg" /> Adicionar Pedido
        </FloatingButton>
      </a>
    </section>
  );
}
