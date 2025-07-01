import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/Header";
import UserHeader from "../../components/UserHeader";
import SearchBar from "../../components/SearchBar";
import Filter from "../../components/Filter";
import FilterSelect from "../../components/FilterSelect";
import Modal from "../../components/Modal";
import Client from "../../components/Client";
import FloatingButton from "../../components/FloatingButton";
import { FaPlus } from "react-icons/fa6";
import Button from "../../components/Button";
import useClients from "../../hooks/useClients";
import { ClientStatus, STATUS_OPTIONS } from "../../utils/status";

const orderOptions = [
  { value: "name|asc", label: "A - Z" },
  { value: "name|desc", label: "Z - A" },
  { value: "createdAt|asc", label: "Mais antigos" },
  { value: "createdAt|desc", label: "Mais recentes" },
];

export default function ViewAll() {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "createdAt">("name");
  const [direction, setDirection] = useState<"asc" | "desc">("asc");
  const [modal, setModal] = useState<null | "order">(null);
  const [statusFilter, setStatusFilter] = useState<ClientStatus | "">("");

  const { clients, loading } = useClients(
    search,
    sortBy,
    direction,
    statusFilter
  );

  const applyOrder = (val: string) => {
    const [s, d] = val.split("|") as ["name" | "createdAt", "asc" | "desc"];
    setSortBy(s);
    setDirection(d);
    setModal(null);
  };

  return (
    <section className="bg-[#f6f6f6] lg:flex justify-center items-start min-h-screen">
      {/* Order modal */}
      <Modal
        isOpen={modal === "order"}
        onClose={() => setModal(null)}
        title="Ordenar"
      >
        <div className="flex flex-col gap-2">
          {orderOptions.map((o) => (
            <label key={o.value} className="flex items-center gap-1">
              <input
                type="radio"
                name="order"
                value={o.value}
                defaultChecked={o.value === `${sortBy}|${direction}`}
                onChange={() => applyOrder(o.value)}
              />
              {o.label}
            </label>
          ))}
        </div>
        <Button onClick={() => setModal(null)}>Aplicar Filtro</Button>
      </Modal>

      {/* Header */}
      <div className="fixed bottom-0 w-full lg:pt-4 bg-[#282828] flex justify-center p-1 lg:w-35 lg:flex-col lg:justify-start lg:p-2 lg:top-15 lg:bottom-0 lg:left-0 z-10 border-gray-200 border-r-1">
        <Header clients="active" />
      </div>
      <UserHeader />

      {/* Content */}
      <div className="w-full max-w-[1280px] flex lg:flex-row gap-5 pt-25 lg:pb-22">
        <div className="flex flex-col gap-5 w-full pb-[100px] lg:pl-38 lg:pr-4 p-4 lg:p-0">
          {/* Search & Filters */}
          <div className="flex gap-5 flex-col lg:flex-row lg:justify-between lg:items-center">
            <SearchBar onChange={setSearch} />
            <div className="flex gap-3">
              {/* Desktop order select */}
              <div className="hidden lg:block">
                <FilterSelect
                  options={orderOptions}
                  placeholder="Ordem"
                  value={`${sortBy}|${direction}`}
                  onChange={applyOrder}
                />
              </div>
              {/* Mobile order button */}
              <Filter
                text="Ordem"
                onClick={() => setModal("order")}
                className="lg:hidden"
              />

              {/* Status filter (desktop) */}
              <div className="hidden lg:block">
                <FilterSelect
                  options={STATUS_OPTIONS}
                  placeholder="Status"
                  value={statusFilter}
                  onChange={(val) => setStatusFilter(val as ClientStatus)}
                />
              </div>
            </div>
          </div>

          {/* Clients List */}
          <div className="flex flex-col gap-3 p-2 bg-white rounded-lg">
            {!loading ? (
              clients.map((c) => (
                <Client
                  key={c.id}
                  client={c.name}
                  rep={c.representativeResponseDTO.name}
                  link={`/clients/${c.id}`}
                  status={c.status}
                />
              ))
            ) : (
              <p className="text-center text-sm">Carregando…</p>
            )}
            {!loading && clients.length === 0 && (
              <p className="text-center text-sm text-gray-500 py-6">
                Nenhum cliente encontrado.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Add client button */}
      <Link
        to="/clients/register"
        className="fixed bottom-25 right-4 lg:bottom-10 lg:right-5"
      >
        <FloatingButton background="#FFA322">
          <FaPlus className="text-lg" /> Adicionar Cliente
        </FloatingButton>
      </Link>
    </section>
  );
}
