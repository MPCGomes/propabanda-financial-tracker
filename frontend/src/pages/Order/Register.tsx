import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import GoBack from "../../components/GoBack";
import ErrorModal from "../../components/ErrorModal";
import AlertModal from "../../components/AlertModal";
import UserHeader from "../../components/UserHeader";
import SectionCard from "../../components/SectionCard";
import api from "../../lib/api";
import OrderForm, { OrderFormPayload } from "../../components/OrderForm";
import ContractSection from "../../components/ContractSection";
import Button from "../../components/Button";

type ClientOption = { id: number; name: string };
type ItemRaw = { id: number; name: string };
type ItemOption = { value: number; label: string };

export default function OrderRegister() {
  const navigate = useNavigate();

  // form + lookup state
  const [clients, setClients] = useState<ClientOption[]>([]);
  const [items, setItems] = useState<ItemOption[]>([]);
  const [payload, setPayload] = useState<OrderFormPayload | null>(null);

  // contract state
  const [file, setFile] = useState<File | null>(null);
  const [existingPath, setExistingPath] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // UI state
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // load clients + items
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
  }, []);

  // preview stub (won’t show until you upload and save once)
  const previewContract = async () => {
    if (!previewUrl) return;
  };

  const downloadContract = async () => {
    if (!previewUrl) return;
  };

  // final save: create order, then upload contract if one was selected
  const handleSaveAll = async () => {
    if (!payload) {
      setError("Formulário não preenchido corretamente.");
      return;
    }
    try {
      const { data } = await api.post("/api/orders", payload);
      const newId = data.id as number;

      if (file) {
        const form = new FormData();
        form.append("file", file);
        await api.post(`/api/orders/${newId}/contract`, form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      setSuccess(true);
    } catch {
      setError("Falha ao criar pedido.");
    }
  };

  if (!clients.length || !items.length) return null;

  return (
    <section className="bg-[#f6f6f6] lg:flex justify-center items-start min-h-screen">
      {/* error + success modals */}
      <ErrorModal error={error} onClose={() => setError(null)} />
      <AlertModal
        isOpen={success}
        title="Sucesso"
        onClose={() => navigate("/orders")}
      >
        <p className="text-sm">Pedido criado com sucesso!</p>
      </AlertModal>

      {/* sidebar */}
      <div
        className="fixed bottom-0 w-full lg:pt-4 bg-[#282828] flex justify-center p-1 
                      lg:w-35 lg:flex-col lg:justify-start lg:p-2 lg:top-15 lg:left-0 
                      z-10 border-gray-200 border-r-1"
      >
        <Header orders="active" />
      </div>

      {/* user header */}
      <UserHeader />

      {/* main content */}
      <div className="w-full max-w-[1280px] flex gap-5 pt-25">
        <div className="flex flex-col gap-5 px-4 w-full pb-[100px] lg:pl-38 lg:pr-4">
          <GoBack link="/orders" />

          {/* 1) Dados do Pedido */}
          <SectionCard title="Dados do Pedido">
            <OrderForm clients={clients} items={items} onChange={setPayload} />
          </SectionCard>

          {/* 2) Contrato */}
          <ContractSection
            contractFile={file}
            existingPath={existingPath}
            previewUrl={previewUrl}
            onFileChange={setFile}
            onPreview={previewContract}
            onDownload={downloadContract}
            onCancel={() => navigate("/orders")}
            onSave={handleSaveAll}
          />

          {/* 3) Ações */}
          <div className="flex justify-end gap-3">
            <Button variant="outlined" onClick={() => navigate("/orders")}>
              Cancelar
            </Button>
            <Button onClick={handleSaveAll}>Salvar</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
