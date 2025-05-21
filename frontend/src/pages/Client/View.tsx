import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Header from "../../components/Header";
import GoBack from "../../components/GoBack";
import Info from "../../components/Info";
import Button from "../../components/Button";
import SearchBar from "../../components/SearchBar";
import Filter from "../../components/Filter";
import FilterSelect from "../../components/FilterSelect";
import Modal from "../../components/Modal";
import Order from "../../components/Order";
import FloatingButton from "../../components/FloatingButton";
import { FaTrash } from "react-icons/fa";
import { RiPencilFill } from "react-icons/ri";
import api from "../../lib/api";
import useOrders from "../../hooks/useOrders";

const orderOptions = [
  { value: "emissionDate|desc", label: "Mais recentes" },
  { value: "emissionDate|asc", label: "Mais antigos" },
];

export default function View() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [client, setClient] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"emissionDate" | "itemName">(
    "emissionDate"
  );
  const [direction, setDirection] = useState<"asc" | "desc">("desc");
  const [modal, setModal] = useState<null | "order" | "delete" | "error">(null);
  const [error, setError] = useState("");

  const { orders, loading } = useOrders(id, search, sortBy, direction);

  useEffect(() => {
    api.get(`/api/clients/${id}`).then(({ data }) => setClient(data));
  }, [id]);

  const applyOrder = (val: string) => {
    const [s, d] = val.split("|") as [
      "emissionDate" | "itemName",
      "asc" | "desc",
    ];
    setSortBy(s);
    setDirection(d);
    setModal(null);
  };

  const deleteClient = async () => {
    try {
      await api.delete(`/api/clients/${id}`);
      navigate("/clients");
    } catch (e: any) {
      setError(
        e.response?.status === 409
          ? "Não é possível excluir: cliente possui pedidos vinculados."
          : "Erro ao excluir cliente."
      );
      setModal("error");
    }
  };

  return (
    <section className="bg-[#f6f6f6] lg:flex justify-center items-start min-h-screen lg:p-3">
      <Modal
        isOpen={modal === "error"}
        onClose={() => setModal(null)}
        title="Erro"
      >
        <p className="text-sm">{error}</p>
        <Button onClick={() => setModal(null)}>Fechar</Button>
      </Modal>
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
      <Modal
        isOpen={modal === "delete"}
        onClose={() => setModal(null)}
        title="Excluir cliente?"
      >
        <p className="text-sm">
          Essa ação removerá o cliente <b>{client?.name}</b>. Continuar?
        </p>
        <div className="flex gap-3">
          <button
            className="flex-1 py-2 bg-gray-100 rounded-full"
            onClick={() => setModal(null)}
          >
            Cancelar
          </button>
          <button
            className="flex-1 py-2 bg-[#EE3A4B] text-white rounded-full"
            onClick={deleteClient}
          >
            Excluir
          </button>
        </div>
      </Modal>

      <div className="w-full max-w-[1280px] flex lg:flex-row gap-5 pt-12 lg:pt-20 lg:pb-22">
        <div className="fixed bottom-0 w-full bg-white rounded-lg flex justify-center p-1 lg:w-35 lg:flex-col lg:justify-start lg:p-2 lg:top-23 lg:bottom-25 z-10">
          <Header clients="active" />
        </div>
        <div className="flex flex-col gap-5 w-full p-4 pb-[100px] lg:ml-40">
          <GoBack link="/clients" />
          {client && (
            <div className="flex flex-col p-5 gap-5 bg-white rounded-lg">
              <div className="text-center">
                <p className="text-base font-bold">{client.name}</p>
                <p className="text-sm text-[#787878]">
                  {client.documentNumber}
                </p>
              </div>
              <hr className="border-[#F0F0F0]" />
              <div>
                <p className="text-sm font-medium">Representante</p>
                <Info
                  label="Nome"
                  value={client.representativeResponseDTO.name}
                />
                <Info
                  label="E-mail"
                  value={client.representativeResponseDTO.email}
                />
                <Info
                  label="Telefone"
                  value={client.representativeResponseDTO.phone}
                />
              </div>
              <div>
                <p className="text-sm font-medium">Endereço</p>
                <Info label="CEP" value={client.addressResponseDTO.zipCode} />
                <Info label="Rua" value={client.addressResponseDTO.street} />
                <Info label="Número" value={client.addressResponseDTO.number} />
                <Info
                  label="Complemento"
                  value={client.addressResponseDTO.complement}
                />
                <Info
                  label="Referência"
                  value={client.addressResponseDTO.reference}
                />
                <Info label="Cidade" value={client.addressResponseDTO.city} />
                <Info label="Estado" value={client.addressResponseDTO.state} />
                <div className="text-center mt-2">
                  <Button
                    onClick={() => navigate(`/orders/register?clientId=${id}`)}
                  >
                    Adicionar Pedido
                  </Button>
                </div>
              </div>
            </div>
          )}
          <div className="flex flex-col p-5 gap-5 bg-white rounded-lg">
            <p className="text-base font-bold">Pedidos</p>
            <div className="flex flex-col gap-5 lg:flex-row">
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
            {!loading ? (
              orders.map((o) => (
                <Order
                  key={o.id}
                  product={`Pedido Nº ${o.identifier}`}
                  date={o.emissionDate}
                  value={o.discountedValue}
                  color="#32c058"
                  link={`/orders/${o.id}`}
                  icon="+"
                />
              ))
            ) : (
              <p className="text-center text-sm">Carregando…</p>
            )}
            {!loading && orders.length === 0 && (
              <p className="text-center text-sm text-gray-500 py-6">
                Nenhum pedido encontrado.
              </p>
            )}
          </div>
        </div>
      </div>
      <div className="fixed bottom-25 right-4 lg:bottom-10 lg:right-5 flex flex-col gap-2 items-end">
        <Link to={`/clients/${id}/edit`}>
          <FloatingButton background="#2696FF">
            <RiPencilFill className="text-lg" /> Editar
          </FloatingButton>
        </Link>
        <FloatingButton background="#EE3A4B" onClick={() => setModal("delete")}>
          <FaTrash className="text-lg" /> Apagar
        </FloatingButton>
      </div>
    </section>
  );
}
