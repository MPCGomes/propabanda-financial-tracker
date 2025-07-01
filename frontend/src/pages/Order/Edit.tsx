import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/Header";
import GoBack from "../../components/GoBack";
import ErrorModal from "../../components/ErrorModal";
import AlertModal from "../../components/AlertModal";
import UserHeader from "../../components/UserHeader";
import SectionCard from "../../components/SectionCard";
import api from "../../lib/api";
import OrderForm, { OrderFormPayload } from "../../components/OrderForm";

type ClientOption = { id: number; name: string };
type ItemOption = { value: number; label: string };

export default function OrderEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [clients, setClients] = useState<ClientOption[]>([]);
  const [items, setItems] = useState<ItemOption[]>([]);
  const [initial, setInitial] = useState<{
    clientId: number;
    items: number[];
    value: number;
    contractStartDate: string;
    contractEndDate: string;
    installmentCount: number;
    installmentDay: number;
    paidInstallmentsCount: number;
    discount: number;
  } | null>(null);

  useEffect(() => {
    api
      .get<ClientOption[]>("/api/clients")
      .then(({ data }) => setClients(data));
    api
      .get<ItemOption[]>("/api/items")
      .then(({ data }) =>
        setItems(data.map((it: any) => ({ value: it.id, label: it.name })))
      );
    api.get(`/api/orders/${id}`).then(({ data: o }) => {
      setInitial({
        clientId: o.clientId,
        items: o.items.map((i: any) => i.id),
        value: o.value,
        contractStartDate: o.contractStartDate,
        contractEndDate: o.contractEndDate,
        installmentCount: o.installmentCount,
        installmentDay: o.installmentDay,
        paidInstallmentsCount: o.paidInstallmentsCount,
        discount: o.discount,
      });
    });
  }, [id]);

  const handleUpdate = async (p: OrderFormPayload) => {
    try {
      await api.put(`/api/orders/${id}`, p);
      setSuccess(true);
    } catch {
      setError("Falha ao salvar pedido.");
    }
  };

  if (!initial || clients.length === 0 || items.length === 0) return null;

  return (
    <section className="bg-[#f6f6f6] lg:flex justify-center items-start min-h-screen">
      <ErrorModal error={error} onClose={() => setError(null)} />
      <AlertModal
        isOpen={success}
        title="Sucesso"
        onClose={() => navigate(`/orders/${id}`)}
      >
        <p className="text-sm text-[#282828]">Pedido atualizado com sucesso!</p>
      </AlertModal>
      <div className="fixed bottom-0 w-full lg:pt-4 bg-[#282828] flex justify-center p-1 lg:w-35 lg:flex-col lg:justify-start lg:p-2 lg:top-15 lg:left-0 z-10 border-gray-200 border-r-1">
        <Header orders="active" />
      </div>
      <UserHeader />
      <div className="w-full max-w-[1280px] flex gap-5 pt-25">
        <div className="flex flex-col gap-5 px-4 w-full pb-[100px] lg:pl-38 lg:pr-4">
          <GoBack link={`/orders/${id}`} />
          <SectionCard title="Editar Pedido">
            <OrderForm
              initial={initial}
              clients={clients}
              items={items}
              onSubmit={handleUpdate}
            />
          </SectionCard>
        </div>
      </div>
    </section>
  );
}
