import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import GoBack from "../components/GoBack";
import Info from "../components/Info";
import Button from "../components/Button";
import InputText from "../components/InputText";
import InputSelect from "../components/InputSelect";
import DialogModal from "../components/DialogModal";
import { FaUpload } from "react-icons/fa";
import api from "../lib/api";
import ClientAutoComplete, {
  ClientOption,
} from "../components/ClientAutoComplete";

type ItemOption = { value: number; label: string; price: number };

const MAX_FILE_MB = 10;

export default function OrderRegister() {
  const navigate = useNavigate();
  const clientIdParam = new URLSearchParams(useLocation().search).get(
    "clientId"
  );

  // Form States
  const [client, setClient] = useState<ClientOption | null>(null);
  const [items, setItems] = useState<ItemOption[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);

  const [startDate, setStartDate] = useState(() =>
    new Date().toISOString().slice(0, 10)
  );
  const [endDate, setEndDate] = useState(() =>
    new Date(new Date().setFullYear(new Date().getFullYear() + 1))
      .toISOString()
      .slice(0, 10)
  );

  const [installmentCount, setInstallmentCount] = useState("");
  const [installmentDay, setInstallmentDay] = useState("");
  const [paidInstallments, setPaidInstallments] = useState("");
  const [discountPct, setDiscountPct] = useState("");

  const [contractFile, setContractFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Values
  const itemPrice = items.find((i) => i.value === selectedItemId)?.price ?? 0;
  const subtotal = itemPrice;
  const discountVal = (subtotal * (+discountPct || 0)) / 100;
  const total = subtotal - discountVal;

  const instCountN = +installmentCount || 0;
  const instValue = instCountN ? total / instCountN : 0;
  const paidValue = instValue * (+paidInstallments || 0);
  const remainValue = total - paidValue;

  // Effects
  useEffect(() => {
    // Items
    api.get("/api/items").then(({ data }) =>
      setItems(
        data.map((it: any) => ({
          value: it.id,
          label: it.name,
          price: parseFloat(it.price),
        }))
      )
    );

    // Pre-Selected Client
    if (clientIdParam) {
      api
        .get(`/api/clients/${clientIdParam}`)
        .then(({ data }) => setClient({ id: data.id, name: data.name }));
    }
  }, [clientIdParam]);

  // Helpers
  const validate = () =>
    client &&
    selectedItemId &&
    instCountN >= 1 &&
    +paidInstallments <= instCountN &&
    (+installmentDay || 0) >= 1 &&
    (+installmentDay || 0) <= 31;

  const handleFile = (file: File) => {
    if (file.size / 1024 / 1024 > MAX_FILE_MB) {
      setErrorMessage(`Arquivo maior que ${MAX_FILE_MB} MB.`);
      return;
    }
    setContractFile(file);
  };

  // Submit
  const handleSubmit = async () => {
    if (!validate()) {
      setErrorMessage("Preencha todos os campos corretamente.");
      return;
    }

    try {
      // Order
      const { data: order } = await api.post("/api/orders", {
        clientId: client!.id,
        contractStartDate: startDate,
        contractEndDate: endDate,
        installmentDay: +installmentDay || 0,
        installmentCount: instCountN,
        discount: +discountPct || 0,
        emissionDate: startDate,
        paidInstallmentsCount: +paidInstallments || 0,
        contractFilePath: null,
        items: [{ itemId: selectedItemId!, quantity: 1 }],
      });

      // Contract
      if (contractFile) {
        const form = new FormData();
        form.append("file", contractFile);
        await api.post(`/api/orders/${order.id}/contract`, form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      navigate(`/orders/${order.id}`);
    } catch (err: any) {
      if (err?.response?.status === 413)
        setErrorMessage("Arquivo excede o limite do servidor.");
      else setErrorMessage(err?.response?.data || "Erro ao salvar pedido.");
    }
  };

  return (
    <section className="bg-[#f6f6f6] lg:flex justify-center items-start min-h-screen lg:p-3">
      {/* Error Modal */}
      <DialogModal
        isOpen={!!errorMessage}
        message={errorMessage ?? ""}
        onClose={() => setErrorMessage(null)}
      />

      <div className="w-full max-w-[1280px] flex lg:flex-row gap-5 pt-12 lg:pt-20 lg:pb-22">
        {/* Menu */}
        <div className="fixed bottom-0 w-full bg-white rounded-lg flex justify-center p-1 lg:w-35 lg:flex-col lg:justify-start lg:p-2 lg:top-23 lg:bottom-25 z-10">
          <Header orders="active" />
        </div>

        {/* Content */}
        <div className="flex flex-col gap-5 w-full p-4 pb-[100px] lg:ml-40">
          <GoBack link="/orders" />

          {/* Forms */}
          <div className="flex flex-col p-5 gap-5 rounded-lg bg-white">
            <p className="text-base font-medium">Cadastrar Pedido</p>

            <div className="flex flex-col gap-5">
              <p className="text-sm font-medium">Empresa</p>

              {clientIdParam ? (
                <InputText
                  label="Cliente"
                  value={client?.name ?? ""}
                  readOnly
                />
              ) : (
                <ClientAutoComplete onSelect={setClient} />
              )}

              <InputSelect
                label="Itens"
                id="item"
                options={items}
                value={selectedItemId ?? undefined}
                onChange={(id) => setSelectedItemId(Number(id))}
              />

              {/* Dates */}
              <div className="flex gap-3">
                <InputText
                  type="date"
                  label="Início"
                  value={startDate}
                  onValueChange={setStartDate}
                />
                <InputText
                  type="date"
                  label="Fim"
                  value={endDate}
                  onValueChange={setEndDate}
                />
              </div>

              {/* números */}
              <div className="flex gap-3">
                <InputText
                  label="Valor Total"
                  value={subtotal.toFixed(2)}
                  readOnly
                  type="number"
                />
                <InputText
                  type="number"
                  min={1}
                  label="Parcelas"
                  value={installmentCount}
                  onValueChange={setInstallmentCount}
                  placeholder="0"
                />
              </div>

              <div className="flex gap-3">
                <InputText
                  type="number"
                  min={1}
                  max={31}
                  label="Venc. parcelas"
                  value={installmentDay}
                  onValueChange={setInstallmentDay}
                  placeholder="Dia"
                />
                <InputText
                  type="number"
                  min={0}
                  label="Parcelas pagas"
                  value={paidInstallments}
                  onValueChange={setPaidInstallments}
                  placeholder="0"
                />
              </div>

              <InputText
                type="number"
                min={0}
                label="Desconto (%)"
                value={discountPct}
                onValueChange={setDiscountPct}
                placeholder="0"
              />
            </div>
          </div>

          {/* Summary */}
          <div className="flex flex-col p-5 gap-3 rounded-lg bg-white">
            <Info label="Sub-Total" value={`R$ ${subtotal.toFixed(2)}`} />
            <Info label="Desconto (%)" value={`${discountPct || 0}%`} />
            <Info
              label="Desconto (R$)"
              value={`R$ ${discountVal.toFixed(2)}`}
            />
            <Info label="Valor Parcelas" value={`R$ ${instValue.toFixed(2)}`} />
            <Info
              label="Valor Pago"
              value={`R$ ${paidValue.toFixed(2)}`}
              color="#32c058"
            />
            <hr className="border-[#F0F0F0]" />
            <Info
              label="Valor Restante"
              value={`R$ ${remainValue.toFixed(2)}`}
              color="#ee3a4b"
            />
            <Info label="Total" value={`R$ ${total.toFixed(2)}`} />
          </div>

          {/* Contract */}
          <div className="flex flex-col p-5 gap-5 rounded-lg bg-white">
            <p className="text-sm font-medium">Contrato</p>

            <label className="flex flex-col items-center gap-2 p-8 border-dashed border border-[#28282833] rounded-lg bg-[#fafafa] cursor-pointer">
              <p className="text-2xl">
                <FaUpload />
              </p>
              <p className="text-base">
                {contractFile ? contractFile.name : "Clique para carregar"}
              </p>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={(e) =>
                  e.target.files && handleFile(e.target.files[0])
                }
              />
            </label>

            <div className="flex gap-3 justify-end">
              <Button variant="outlined" onClick={() => navigate("/orders")}>
                Cancelar
              </Button>
              <Button onClick={handleSubmit} >Cadastrar</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
