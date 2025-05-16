import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import GoBack from "../components/GoBack";
import Info from "../components/Info";
import Button from "../components/Button";
import SearchBar from "../components/SearchBar";
import Filter from "../components/Filter";
import FilterSelect from "../components/FilterSelect";
import Modal from "../components/Modal";
import Order from "../components/Order";
import FloatingButton from "../components/FloatingButton";
import { FaTrash } from "react-icons/fa";
import { RiPencilFill } from "react-icons/ri";
import api from "../lib/api";

type ClientDTO = {
  id: number;
  name: string;
  documentNumber: string;
  representantResponseDTO: { name: string; email: string; phone: string };
  addressResponseDTO: {
    zipCode: string;
    street: string;
    number: string;
    complement: string;
    reference: string;
    city: string;
    state: string;
  };
};

type OrderDTO = {
  id: number;
  emissionDate: string;
  discountedValue: string;
  items: { itemName: string }[];
};

const orderOptions = [
  { value: "emissionDate|desc", label: "Mais recentes" },
  { value: "emissionDate|asc", label: "Mais antigos" },
  { value: "itemName|asc", label: "A - Z" },
  { value: "itemName|desc", label: "Z - A" },
];

export default function ClientDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [client, setClient] = useState<ClientDTO | null>(null);

  // Orders
  const [orders, setOrders] = useState<OrderDTO[]>([]);
  const [itemSearch, setItemSearch] = useState("");
  const [sortBy, setSortBy] = useState<"emissionDate" | "itemName">(
    "emissionDate"
  );
  const [direction, setDirection] = useState<"asc" | "desc">("desc");

  // Modals
  const [openModal, setOpenModal] = useState<
    null | "order" | "delete" | "error"
  >(null);
  const [errorMsg, setErrorMsg] = useState("");

  // Debounce
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Endpoints
  const fetchClient = async () => {
    const { data } = await api.get(`/api/clients/${id}`);
    setClient(data);
  };

  const fetchOrders = async () => {
    const { data } = await api.post(`/api/orders/client/${id}/filter`, {
      itemSearch,
      sortBy,
      direction,
    });
    setOrders(data);
  };

  useEffect(() => {
    if (id) fetchClient();
  }, [id]);

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(fetchOrders, 300);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [itemSearch, sortBy, direction, id]);

  // Handlers
  const applyOrder = (value: string) => {
    const [s, d] = value.split("|") as [
      "emissionDate" | "itemName",
      "asc" | "desc",
    ];
    setSortBy(s);
    setDirection(d);
    setOpenModal(null);
  };

  const deleteClient = async () => {
    try {
      await api.delete(`/api/clients/${id}`);
      navigate("/clients");
    } catch (err: any) {
      const msg =
        err.response?.status === 409
          ? "Não é possível excluir: cliente possui pedidos vinculados."
          : "Erro ao excluir cliente.";
      setErrorMsg(msg);
      setOpenModal("error");
    }
  };

  // UI
  return (
    <section className="bg-[#f6f6f6] lg:flex justify-center items-center min-h-screen lg:p-3 lg:items-start">
      <div className="w-full max-w-[1280px] flex lg:flex-row gap-5 pt-12 lg:pt-20 lg:pb-22">
        {/* Header */}
        <div className="fixed bottom-0 w-full bg-white rounded-lg flex justify-center p-1 lg:w-35 lg:flex-col lg:justify-start lg:p-2 lg:top-23 lg:bottom-25 z-10">
          <Header clients="active" />
        </div>

        {/* Content */}
        <div className="flex flex-col gap-5 w-full p-4 pb-[100px] lg:p-0 lg:pb-0 lg:ml-40">
          <GoBack link="/clients" />

          {/* Client Data */}
          {client && (
            <div className="flex flex-col p-5 gap-5 rounded-lg bg-white text-[#282828]">
              <div className="flex flex-col gap-1 text-center">
                <p className="text-base font-bold">{client.name}</p>
                <p className="text-sm text-[#787878]">
                  {client.documentNumber}
                </p>
              </div>
              <hr className="border-[#F0F0F0]" />

              {/* Representant */}
              <div className="flex gap-5 flex-col">
                <p className="text-sm font-medium">Representante</p>
                <div className="w-full flex flex-col gap-5">
                  <Info
                    label="Nome"
                    value={client.representantResponseDTO.name}
                  />
                  <Info
                    label="E-mail"
                    value={client.representantResponseDTO.email}
                  />
                  <Info
                    label="Telefone"
                    value={client.representantResponseDTO.phone}
                  />
                </div>
              </div>

              {/* Address */}
              <div className="flex gap-5 flex-col">
                <p className="text-sm font-medium">Endereço</p>
                <div className="w-full flex flex-col gap-5">
                  <Info label="CEP" value={client.addressResponseDTO.zipCode} />
                  <Info label="Rua" value={client.addressResponseDTO.street} />
                  <Info
                    label="Número"
                    value={client.addressResponseDTO.number}
                  />
                  <Info
                    label="Complemento"
                    value={client.addressResponseDTO.complement}
                  />
                  <Info
                    label="Referência"
                    value={client.addressResponseDTO.reference}
                  />
                  <Info label="Cidade" value={client.addressResponseDTO.city} />
                  <Info
                    label="Estado"
                    value={client.addressResponseDTO.state}
                  />

                  <div className="text-center">
                    <Button
                      text="Adicionar Pedido"
                      onClick={() =>
                        navigate(`/orders/register?clientId=${id}`)
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Orders */}
          <div className="flex flex-col p-5 gap-5 rounded-lg bg-white text-[#282828]">
            <p className="text-base font-bold">Pedidos</p>

            <SearchBar onChange={setItemSearch} />

            <div className="flex gap-3 flex-wrap lg:flex-nowrap">
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

            {/* Modal - Mobile */}
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

            <div className="flex flex-col gap-3">
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
      </div>

      {/* Floating Button */}
      <div className="fixed bottom-25 right-4 lg:bottom-10 lg:right-5 flex flex-col gap-2">
        <Link to={`/clients/${id}/edit?clientId=${id}`}>
          <FloatingButton icon={<RiPencilFill />} background="#2696FF" />
        </Link>
        <FloatingButton
          icon={<FaTrash />}
          background="#EE3A4B"
          onClick={() => setOpenModal("delete")}
        />
      </div>

      {/* Action Confirmation Modal */}
      <Modal
        isOpen={openModal === "delete"}
        onClose={() => setOpenModal(null)}
        title="Excluir cliente?"
      >
        <p className="text-sm text-[#282828]">
          Essa ação removerá o cliente <b>{client?.name}</b>. Continuar?
        </p>
        <div className="flex gap-3 mt-4">
          <Button text="Cancelar" onClick={() => setOpenModal(null)} />
          <Button text="Excluir" onClick={deleteClient} />
        </div>
      </Modal>

      {/* Modal Error */}
      <Modal
        isOpen={openModal === "error"}
        onClose={() => setOpenModal(null)}
        title="Erro"
      >
        <p className="text-sm text-[#282828]">{errorMsg}</p>
        <div className="text-center mt-4">
          <Button text="Fechar" onClick={() => setOpenModal(null)} />
        </div>
      </Modal>
    </section>
  );
}
