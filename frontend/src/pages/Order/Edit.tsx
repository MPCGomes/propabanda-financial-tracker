import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/Header";
import GoBack from "../../components/GoBack";
import ErrorModal from "../../components/ErrorModal";
import AlertModal from "../../components/AlertModal";
import UserHeader from "../../components/UserHeader";
import Button from "../../components/Button";
import api from "../../lib/api";
import OrderForm, { OrderFormPayload } from "../../components/OrderForm";
import ContractSection from "../../components/ContractSection";

type ClientOption = { id: number; name: string };
type ItemRaw = { id: number; name: string };
type ItemOption = { value: number; label: string };

interface OrderData {
  clientId: number;
  items: { id: number }[];
  value: number;
  contractStartDate: string;
  contractEndDate: string;
  installmentCount: number;
  installmentDay: number;
  paidInstallmentsCount: number;
  discount: number;
  contractFilePath: string | null;
}

export default function OrderEdit() {
  const { id } = useParams<{ id: string }>();
  const nav = useNavigate();

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [clients, setClients] = useState<ClientOption[]>([]);
  const [items, setItems] = useState<ItemOption[]>([]);
  const [initial, setInitial] = useState<Omit<
    OrderFormPayload,
    "emissionDate"
  > | null>(null);
  const [latest, setLatest] = useState<OrderFormPayload | null>(null);

  // contract
  const [file, setFile] = useState<File | null>(null);
  const [existingPath, setExistingPath] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<ClientOption[]>("/api/clients")
      .then((r) => setClients(r.data))
      .catch(() => setError("Falha ao carregar clientes."));
    api
      .get<ItemRaw[]>("/api/items")
      .then((r) =>
        setItems(r.data.map((i) => ({ value: i.id, label: i.name })))
      )
      .catch(() => setError("Falha ao carregar itens."));
    api
      .get<OrderData>(`/api/orders/${id}`)
      .then((r) => {
        const o = r.data;
        setInitial({
          clientId: o.clientId,
          items: o.items.map((i) => i.id),
          value: o.value,
          contractStartDate: o.contractStartDate,
          contractEndDate: o.contractEndDate,
          installmentCount: o.installmentCount,
          installmentDay: o.installmentDay,
          paidInstallmentsCount: o.paidInstallmentsCount,
          discount: o.discount,
        });
        setExistingPath(o.contractFilePath);
      })
      .catch(() => setError("Falha ao carregar pedido."));
  }, [id]);

  const previewContract = async () => {
    try {
      const { data, headers } = await api.get(`/api/orders/${id}/contract`, {
        responseType: "blob",
      });
      if (!headers["content-type"]?.startsWith("application/pdf")) {
        setError("Só PDF pode ser pré-visualizado.");
        return;
      }
      setPreviewUrl(URL.createObjectURL(data));
    } catch {
      setError("Erro ao carregar o contrato.");
    }
  };

  const downloadContract = async () => {
    try {
      const { data, headers } = await api.get(`/api/orders/${id}/contract`, {
        responseType: "blob",
      });
      const cd = headers["content-disposition"] || "";
      const fn =
        cd.split("filename=")[1]?.replace(/"/g, "").trim() ||
        `contrato_${id}.pdf`;
      const blob = new Blob([data], { type: headers["content-type"] });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fn;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setError("Erro no download do contrato.");
    }
  };

  const deleteContract = async () => {
    try {
      await api.delete(`/api/orders/${id}/contract`);
      setExistingPath(null);
      setPreviewUrl(null);
    } catch {
      setError("Falha ao excluir o contrato.");
    }
  };

  const handleSaveAll = async () => {
    if (!initial) {
      setError("Dados iniciais faltando.");
      return;
    }
    // merge latest values or fall back
    const payload: OrderFormPayload = latest
      ? latest
      : { ...initial, emissionDate: initial.contractStartDate };

    // preserve existing contractFilePath in payload
    (payload as any).contractFilePath = existingPath;

    try {
      // update order
      await api.put(`/api/orders/${id}`, payload);

      // upload new file if provided
      if (file) {
        const form = new FormData();
        form.append("file", file);
        await api.post(`/api/orders/${id}/contract`, form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setExistingPath(file.name);
        setFile(null);
      }

      setSuccess(true);
    } catch {
      setError("Falha ao salvar pedido ou contrato.");
    }
  };

  if (!initial || !clients.length || !items.length) return null;

  return (
    <section className="bg-[#f6f6f6] lg:flex justify-center items-start min-h-screen">
      <ErrorModal error={error} onClose={() => setError(null)} />
      <AlertModal
        isOpen={success}
        title="Sucesso"
        onClose={() => nav(`/orders/${id}`)}
      >
        <p className="text-sm">Pedido atualizado com sucesso!</p>
      </AlertModal>

      {/* Sidebar */}
      <div
        className="fixed bottom-0 w-full lg:pt-4 bg-[#282828] flex justify-center p-1 
                      lg:w-35 lg:flex-col lg:justify-start lg:p-2 lg:top-15 lg:left-0 
                      z-10 border-gray-200 border-r-1"
      >
        <Header orders="active" />
      </div>

      {/* User header */}
      <UserHeader />

      {/* Main */}
      <div className="w-full max-w-[1280px] flex gap-5 pt-25">
        <div className="flex flex-col gap-5 px-4 w-full pb-[100px] lg:pl-38 lg:pr-4">
          <GoBack link={`/orders/${id}`} />

          {/* 1) Dados do Pedido + Resumo */}
          <OrderForm
            clients={clients}
            items={items}
            initial={initial}
            onChange={setLatest}
          />

          {/* 2) Contrato */}
          <ContractSection
            contractFile={file}
            existingPath={existingPath}
            previewUrl={previewUrl}
            onFileChange={setFile}
            onPreview={previewContract}
            onDownload={downloadContract}
            onDelete={deleteContract}
            onSave={handleSaveAll}
          />

          {/* 3) Ações */}
          <div className="flex justify-end gap-3">
            <Button variant="outlined" onClick={() => history.back()}>
              Cancelar
            </Button>
            <Button onClick={handleSaveAll}>Salvar</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
