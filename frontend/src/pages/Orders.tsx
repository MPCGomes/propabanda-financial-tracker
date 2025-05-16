import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
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

type OrderDTO = {
  id: number;
  clientName: string;
  emissionDate: string;
  discountedValue: string;
  items: { itemName: string }[];
};

// Filters
const orderOptions = [
  { value: "emissionDate|desc", label: "Mais recentes" },
  { value: "emissionDate|asc", label: "Mais antigos" },
  { value: "name|asc", label: "A - Z" },
  { value: "name|desc", label: "Z - A" },
];

export default function Orders() {
  const navigate = useNavigate();

  //States
  const [orders, setOrders] = useState<OrderDTO[]>([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"emissionDate" | "name">("emissionDate");
  const [direction, setDirection] = useState<"asc" | "desc">("desc");
  const [openModal, setOpenModal] = useState<null | "order">(null);

  // Debounce
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Endpoints
  const fetchOrders = async () => {
    const payload = {
      sortBy,
      direction,
      ...(search.trim() && { search }),
    };
    const { data } = await api.post("/api/orders/filter", payload);
    setOrders(data);
  };

  // Effects
  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(fetchOrders, 300);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [search, sortBy, direction]);

  // Handlers
  const applyOrder = (value: string) => {
    const [s, d] = value.split("|") as [
      "emissionDate" | "name",
      "asc" | "desc",
    ];
    setSortBy(s);
    setDirection(d);
    setOpenModal(null);
  };

  return (
    <section className="bg-[#f6f6f6] lg:flex justify-center items-center min-h-screen lg:p-3 lg:items-start">
      <div className="w-full max-w-[1280px] flex lg:flex-row gap-5 pt-12 lg:pt-20 lg:pb-22">
        {/* Menu */}
        <div className="fixed bottom-0 w-full bg-white rounded-lg flex justify-center p-1 lg:w-35 lg:flex-col lg:justify-start lg:p-2 lg:top-23 lg:bottom-25 z-10">
          <Header orders="active" />
        </div>

        {/* Content */}
        <div className="flex flex-col gap-5 w-full p-4 pb-[100px] lg:p-0 lg:pb-0 lg:ml-40">
          {/* Search Bar + Filters */}
          <div className="flex gap-5 flex-col lg:flex-row lg:justify-between lg:items-center">
            <SearchBar onChange={setSearch} />

            <div className="flex gap-3">
              {/* Desktop */}
              <div className="hidden lg:block">
                <FilterSelect
                  options={orderOptions}
                  placeholder="Ordem"
                  value={`${sortBy}|${direction}`}
                  onChange={applyOrder}
                />
              </div>
              {/* Mobile */}
              <Filter
                text="Ordem"
                onClick={() => setOpenModal("order")}
                className="lg:hidden"
              />
            </div>

            {/* Order Modal - Mobile */}
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
              <Button text="Aplicar filtro" />
            </Modal>
          </div>

          {/* Orders */}
          <div className="flex flex-col gap-3 p-2 bg-white rounded-lg">
            {orders.map((o) => (
              <Order
                key={o.id}
                product={o.items[0]?.itemName ?? "—"}
                date={o.emissionDate}
                value={o.discountedValue}
                color="#32c058"
                link={`/orders/${o.id}`}
                icon="+"
              />
            ))}
            {orders.length === 0 && (
              <p className="text-center text-sm text-gray-500 py-6">
                Nenhum pedido encontrado.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Floating Buttons */}
      <a
        href="/orders/register"
        className="fixed bottom-25 right-4 lg:bottom-10 lg:right-5"
      >
        <FloatingButton icon={<FaPlus />} background="#FFA322" />
      </a>
    </section>
  );
}
