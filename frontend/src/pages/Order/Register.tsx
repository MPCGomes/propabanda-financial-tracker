import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import GoBack from "../../components/GoBack";
import ErrorModal from "../../components/ErrorModal";
import AlertModal from "../../components/AlertModal";
import UserHeader from "../../components/UserHeader";
import SectionCard from "../../components/SectionCard";
import api from "../../lib/api";
import OrderForm, { OrderFormPayload } from "../../components/OrderForm";
import { useState, useEffect } from "react";

type ClientOption = { id: number; name: string };
type ItemOption = { value: number; label: string };

export default function OrderRegister() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [clients, setClients] = useState<ClientOption[]>([]);
  const [items, setItems] = useState<ItemOption[]>([]);

  useEffect(() => {
    api
      .get<ClientOption[]>("/api/clients")
      .then(({ data }) => setClients(data));
    api
      .get<ItemOption[]>("/api/items")
      .then(({ data }) =>
        setItems(data.map((it: any) => ({ value: it.id, label: it.name })))
      );
  }, []);

  const handleCreate = async (p: OrderFormPayload) => {
    try {
      console.log("Enviando pedido:", p);
      await api.post("/api/orders", p);
      setSuccess(true);
    } catch {
      setError("Falha ao criar pedido.");
    }
  };

  return (
    <section className="bg-[#f6f6f6] lg:flex justify-center items-start min-h-screen">
      <ErrorModal error={error} onClose={() => setError(null)} />
      <AlertModal
        isOpen={success}
        title="Sucesso"
        onClose={() => navigate("/orders")}
      >
        <p className="text-sm text-[#282828]">Pedido criado com sucesso!</p>
      </AlertModal>
      <div className="fixed bottom-0 w-full lg:pt-4 bg-[#282828] flex justify-center p-1 lg:w-35 lg:flex-col lg:justify-start lg:p-2 lg:top-15 lg:left-0 z-10 border-gray-200 border-r-1">
        <Header orders="active" />
      </div>
      <UserHeader />
      <div className="w-full max-w-[1280px] flex gap-5 pt-25">
        <div className="flex flex-col gap-5 px-4 w-full pb-[100px] lg:pl-38 lg:pr-4">
          <GoBack link="/orders" />
          <SectionCard title="Novo Pedido">
            {clients.length > 0 && items.length > 0 && (
              <OrderForm
                initial={undefined}
                clients={clients}
                items={items}
                onSubmit={handleCreate}
              />
            )}
          </SectionCard>
        </div>
      </div>
    </section>
  );
}
