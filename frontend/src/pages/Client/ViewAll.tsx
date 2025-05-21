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

  const { clients, loading } = useClients(search, sortBy, direction);

  const applyOrder = (val: string) => {
    const [s, d] = val.split("|") as ["name" | "createdAt", "asc" | "desc"];
    setSortBy(s);
    setDirection(d);
    setModal(null);
  };

  return (
    <section className="bg-[#f6f6f6] lg:flex justify-center items-start min-h-screen lg:p-3">
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
        <Button>Aplicar Filtro</Button>
      </Modal>

      <div className="w-full max-w-[1280px] flex lg:flex-row gap-5 pt-12 lg:pt-20 lg:pb-22">
        <div className="fixed bottom-0 w-full bg-white rounded-lg flex justify-center p-1 lg:w-35 lg:flex-col lg:justify-start lg:p-2 lg:top-23 lg:bottom-25 z-10">
          <Header clients="active" />
        </div>

        <div className="flex flex-col gap-5 w-full p-4 pb-[100px] lg:ml-40">
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
                onClick={() => setModal("order")}
                className="lg:hidden"
              />
            </div>
          </div>

          <div className="flex flex-col gap-3 p-2 bg-white rounded-lg">
            {!loading ? (
              clients.map((c) => (
                <Client
                  key={c.id}
                  client={c.name}
                  rep={c.representativeResponseDTO.name}
                  link={`/clients/${c.id}`}
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
