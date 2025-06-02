import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Header from "../../components/Header";
import GoBack from "../../components/GoBack";
import ClientAutoComplete, {
  ClientOption,
} from "../../components/ClientAutoComplete";
import InputText from "../../components/InputText";
import InputSelect from "../../components/InputSelect";
import Button from "../../components/Button";
import SectionCard from "../../components/SectionCard";
import InfoGroup from "../../components/InfoGroup";
import ErrorModal from "../../components/ErrorModal";
import { useModal } from "../../hooks/useModal";
import { FaUpload } from "react-icons/fa";
import api from "../../lib/api";
import UserHeader from "../../components/UserHeader";

const MAX_FILE_MB = 10;
const formatCurrency = (n: number) =>
  `R$ ${n.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;

type ItemOption = { value: number; label: string };

export default function OrderRegister() {
  const navigate = useNavigate();
  const clientIdParam = new URLSearchParams(useLocation().search).get(
    "clientId"
  );

  const errorModal = useModal(false);

  const [client, setClient] = useState<ClientOption | null>(null);
  const [items, setItems] = useState<ItemOption[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);

  const [orderValue, setOrderValue] = useState("0,00");
  const [installmentCount, setInstallmentCount] = useState("1");
  const [installmentDay, setInstallmentDay] = useState("10");
  const [paidInstallments, setPaidInstallments] = useState("0");
  const [discountPct, setDiscountPct] = useState("0");

  const [startDate, setStartDate] = useState(() =>
    new Date().toISOString().slice(0, 10)
  );
  const [endDate, setEndDate] = useState(() =>
    new Date(new Date().setFullYear(new Date().getFullYear() + 1))
      .toISOString()
      .slice(0, 10)
  );

  const [contractFile, setContractFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // cálculos
  const subtotal =
    parseFloat(orderValue.replace(/\./g, "").replace(",", ".")) || 0;
  const discountVal = (subtotal * (+discountPct || 0)) / 100;
  const total = subtotal - discountVal;

  const instCountN = +installmentCount || 0;
  const instValue = instCountN ? total / instCountN : 0;
  const paidValue = instValue * (+paidInstallments || 0);
  const remainValue = total - paidValue;

  useEffect(() => {
    api
      .get<ItemOption[]>("/api/items")
      .then(({ data }) =>
        setItems(data.map((it: any) => ({ value: it.id, label: it.name })))
      );
    if (clientIdParam) {
      api
        .get(`/api/clients/${clientIdParam}`)
        .then(({ data }) => setClient({ id: data.id, name: data.name }));
    }
  }, [clientIdParam]);

  const validate = () =>
    client &&
    selectedItemId !== null &&
    subtotal > 0 &&
    instCountN >= 1 &&
    +paidInstallments <= instCountN &&
    (+installmentDay || 0) >= 1 &&
    (+installmentDay || 0) <= 31;

  const handleFile = (file: File) => {
    if (file.size / 1024 / 1024 > MAX_FILE_MB) {
      setErrorMessage(`Arquivo maior que ${MAX_FILE_MB} MB.`);
      errorModal.open();
      return;
    }
    setContractFile(file);
  };

  const handleValueChange = (v: string) => {
    const digits = v.replace(/\D/g, "");
    const num = parseFloat(digits || "0") / 100;
    const formatted = num.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    setOrderValue(formatted);
  };

  const handleSubmit = async () => {
    if (!validate()) {
      setErrorMessage("Preencha todos os campos corretamente.");
      errorModal.open();
      return;
    }

    try {
      const { data: order } = await api.post("/api/orders", {
        clientId: client!.id,
        value: subtotal,
        contractStartDate: startDate,
        contractEndDate: endDate,
        installmentDay: +installmentDay || 0,
        installmentCount: instCountN,
        discount: +discountPct || 0,
        emissionDate: startDate,
        paidInstallmentsCount: +paidInstallments || 0,
        contractFilePath: null,
        items: [selectedItemId!],
      });

      if (contractFile) {
        const form = new FormData();
        form.append("file", contractFile);
        await api.post(`/api/orders/${order.id}/contract`, form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      navigate(`/orders/${order.id}`);
    } catch (err: any) {
      const msg =
        typeof err?.response?.data === "string"
          ? err.response.data
          : err?.response?.data?.error || "Erro interno.";
      setErrorMessage(msg);
      errorModal.open();
    }
  };

  return (
    <section className="bg-[#f6f6f6] lg:flex justify-center items-start min-h-screen">
      <ErrorModal
        error={errorMessage}
        onClose={() => {
          setErrorMessage(null);
          errorModal.close();
        }}
      />
      <div className="fixed bottom-0 w-full lg:pt-4 bg-[#282828] rounded-lg flex justify-center p-1 lg:w-35 lg:flex-col lg:justify-start lg:p-2 lg:top-15 lg:bottom-0 lg:rounded-none lg:left-0 z-10 border-gray-200 border-r-1">
        <Header orders="active" />
      </div>

      <UserHeader />

      <div className="w-full max-w-[1280px] flex lg:flex-row gap-5 pt-25 lg:pb-22">
        <div className="flex flex-col gap-5 w-full p-4 pb-[100px] lg:pl-38 lg:pr-4">
          <GoBack link="/orders" />

          <SectionCard title="Cadastrar Pedido">
            {/* Cliente */}
            {clientIdParam ? (
              <InputText label="Cliente" value={client?.name || ""} disabled />
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

            <InputText
              type="text"
              label="Valor Total (R$)"
              value={orderValue}
              onValueChange={handleValueChange}
            />

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

            <div className="flex gap-3">
              <InputText
                type="number"
                label="Parcelas"
                min={1}
                value={installmentCount}
                onValueChange={(v) => setInstallmentCount(String(Number(v)))}
              />
              <InputText
                type="number"
                label="Venc. parcelas"
                min={1}
                max={31}
                value={installmentDay}
                onValueChange={(v) => setInstallmentDay(String(Number(v)))}
              />
            </div>

            <div className="flex gap-3">
              <InputText
                type="number"
                label="Parcelas pagas"
                min={0}
                value={paidInstallments}
                onValueChange={(v) => setPaidInstallments(String(Number(v)))}
              />
              <InputText
                type="number"
                label="Desconto (%)"
                min={0}
                value={discountPct}
                onValueChange={(v) => setDiscountPct(String(Number(v)))}
              />
            </div>
          </SectionCard>

          <SectionCard title="Resumo">
            <InfoGroup
              items={[
                { label: "Sub-Total", value: formatCurrency(subtotal) },
                { label: "Desconto (%)", value: `${discountPct}%` },
                { label: "Desconto (R$)", value: formatCurrency(discountVal) },
                { label: "Valor Parcelas", value: formatCurrency(instValue) },
                {
                  label: "Valor Pago",
                  value: formatCurrency(paidValue),
                  color: "#32c058",
                },
                {
                  label: "Valor Restante",
                  value: formatCurrency(remainValue),
                  color: "#ee3a4b",
                },
                { label: "Total", value: formatCurrency(total) },
              ]}
            />
          </SectionCard>

          <SectionCard title="Contrato">
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
              <Button onClick={handleSubmit}>Cadastrar</Button>
            </div>
          </SectionCard>
        </div>
      </div>
    </section>
  );
}
