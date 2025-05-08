import { useEffect, useState } from "react";
import Client from "../components/Client";
import FloatingButton from "../components/FloatingButton";
import Header from "../components/Header";
import { FaPlus } from "react-icons/fa6";
import Filter from "../components/Filter";
import SearchBar from "../components/SearchBar";
import Button from "../components/Button";
import Modal from "../components/Modal";
import FilterSelect from "../components/FilterSelect";
import api from "../lib/api";

type ClientDTO = {
  id: number;
  name: string;
  documentNumber: string;
  representantResponseDTO: { name: string };
};

const orderOptions = [
  { value: "name|asc", label: "A - Z" },
  { value: "name|desc", label: "Z - A" },
  { value: "createdAt|asc", label: "Mais antigos" },
  { value: "createdAt|desc", label: "Mais recentes" },
];

export default function Clients() {
  const [clients, setClients] = useState<ClientDTO[]>([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "createdAt">("name");
  const [direction, setDirection] = useState<"asc" | "desc">("asc");

  const [openModal, setOpenModal] = useState<null | "order">(null);

  /* --- buscar clientes --- */
  const fetchClients = async () => {
    const { data } = await api.post("/api/clients/filter", {
      search,
      sortBy,
      direction,
    });
    setClients(data);
  };

  useEffect(() => {
    fetchClients();
  }, []);

  /* --- handlers --- */
  const handleApplyOrder = (value: string) => {
    const [s, d] = value.split("|") as ["name" | "createdAt", "asc" | "desc"];
    setSortBy(s);
    setDirection(d);
    setOpenModal(null);
  };

  const handleSearch = (term: string) => {
    setSearch(term);
  };

  const applyFilters = () => fetchClients();

  /* UI */
  return (
    <section className="bg-[#f6f6f6] lg:flex justify-center items-center min-h-screen lg:p-3 lg:items-start">
      <div className="w-full max-w-[1280px] flex lg:flex-row gap-5 pt-12 lg:pt-20 lg:pb-22">
        {/* Header fixo */}
        <div className="fixed bottom-0 w-full bg-white rounded-lg flex justify-center p-1 lg:w-35 lg:flex-col lg:justify-start lg:p-2 lg:top-23 lg:bottom-25 z-10">
          <Header clients="active" />
        </div>

        {/* Conteúdo */}
        <div className="flex flex-col gap-5 w-full p-4 pb-[100px] lg:p-0 lg:pb-0 lg:ml-40">
          <div className="flex gap-5 flex-col lg:flex-row lg:justify-between lg:items-center">
            <SearchBar onChange={handleSearch} onSearch={applyFilters} />

            {/* filtros */}
            <div className="flex gap-3">
              <div className="hidden lg:block">
                <FilterSelect
                  options={orderOptions}
                  placeholder="Ordem"
                  onChange={(v) => handleApplyOrder(v as string)}
                />
              </div>
              <Filter
                text="Ordem"
                onClick={() => setOpenModal("order")}
                className="lg:hidden"
              />
            </div>

            {/* Modal ordem (mobile) */}
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
                      onChange={() => handleApplyOrder(opt.value)}
                      defaultChecked={opt.value === `${sortBy}|${direction}`}
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
              <Button text="Aplicar filtro" onClick={applyFilters} />
            </Modal>
          </div>

          {/* lista */}
          <div className="flex flex-col gap-3 p-2 bg-white rounded-lg">
            {clients.map((c) => (
              <Client
                key={c.id}
                client={c.name}
                rep={c.representantResponseDTO.name}
                link={`/clients/${c.id}`}
              />
            ))}
            {clients.length === 0 && (
              <p className="text-center text-sm text-gray-500 py-6">
                Nenhum cliente encontrado.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* botão flutuante */}
      <a
        href="/clients/register"
        className="fixed bottom-25 right-4 lg:bottom-10 lg:right-5"
      >
        <FloatingButton icon={<FaPlus />} background="#FFA322" />
      </a>
    </section>
  );
}
