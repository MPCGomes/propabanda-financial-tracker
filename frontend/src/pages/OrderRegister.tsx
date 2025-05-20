import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import GoBack from "../components/GoBack";
import Info from "../components/Info";
import Button from "../components/Button";
import InputText from "../components/InputText";
import InputSelect from "../components/InputSelect";
import { FaUpload } from "react-icons/fa";
import api from "../lib/api";
import ClientAutoComplete, {
  ClientOption,
} from "../components/ClientAutoComplete";
import Modal from "../components/Modal";

type ItemOption = { value: number; label: string };

const MAX_FILE_MB = 10;
const formatCurrency = (n: number) =>
  `R$ ${n.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;

export default function OrderRegister() {
  const navigate = useNavigate();
  const clientIdParam = new URLSearchParams(useLocation().search).get(
    "clientId"
  );

  /* ---------- estados ---------- */
  const [client, setClient] = useState<ClientOption | null>(null);
  const [items, setItems] = useState<ItemOption[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);

  // valores iniciais fixos
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

  /* ---------- cálculos ---------- */
  const subtotal =
    parseFloat(orderValue.replace(/\./g, "").replace(",", ".")) || 0;
  const discountVal = (subtotal * (+discountPct || 0)) / 100;
  const total = subtotal - discountVal;

  const instCountN = +installmentCount || 0;
  const instValue = instCountN ? total / instCountN : 0;
  const paidValue = instValue * (+paidInstallments || 0);
  const remainValue = total - paidValue;

  /* ---------- efeitos ---------- */
  useEffect(() => {
    api
      .get("/api/items")
      .then(({ data }) =>
        setItems(data.map((it: any) => ({ value: it.id, label: it.name })))
      );
    if (clientIdParam) {
      api
        .get(`/api/clients/${clientIdParam}`)
        .then(({ data }) => setClient({ id: data.id, name: data.name }));
    }
  }, [clientIdParam]);

  /* ---------- helpers ---------- */
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

  /* ---------- submit ---------- */
  const handleSubmit = async () => {
    if (!validate()) {
      setErrorMessage("Preencha todos os campos corretamente.");
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
    }
  };

  /* ---------- UI ---------- */
  return (
    <section className="bg-[#f6f6f6] lg:flex justify-center items-start min-h-screen lg:p-3">
      <Modal
        isOpen={!!errorMessage}
        onClose={() => setErrorMessage(null)}
        title="Atenção"
      >
        <p className="text-sm mb-4">{errorMessage}</p>
        <Button onClick={() => setErrorMessage(null)}>Fechar</Button>
      </Modal>

      <div className="w-full max-w-[1280px] flex lg:flex-row gap-5 pt-12 lg:pt-20 lg:pb-22">
        <div className="fixed bottom-0 w-full bg-white rounded-lg flex justify-center p-1 lg:w-35 lg:flex-col lg:justify-start lg:p-2 lg:top-23 lg:bottom-25 z-10">
          <Header orders="active" />
        </div>

        <div className="flex flex-col gap-5 w-full p-4 pb-[100px] lg:ml-40">
          <GoBack link="/orders" />

          {/* ---- formulário principal ---- */}
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

              <InputText
                type="text"
                label="Valor Total (R$)"
                value={orderValue}
                onValueChange={handleValueChange}
              />

              {/* datas */}
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

              {/* parcelas etc. */}
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
            </div>
          </div>

          {/* ---- resumo ---- */}
          <div className="flex flex-col p-5 gap-3 rounded-lg bg-white">
            <Info label="Sub-Total" value={formatCurrency(subtotal)} />
            <Info label="Desconto (%)" value={`${discountPct}%`} />
            <Info label="Desconto (R$)" value={formatCurrency(discountVal)} />
            <Info label="Valor Parcelas" value={formatCurrency(instValue)} />
            <Info
              label="Valor Pago"
              value={formatCurrency(paidValue)}
              color="#32c058"
            />
            <hr className="border-[#F0F0F0]" />
            <Info
              label="Valor Restante"
              value={formatCurrency(remainValue)}
              color="#ee3a4b"
            />
            <Info label="Total" value={formatCurrency(total)} />
          </div>

          {/* ---- contrato ---- */}
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
              <Button onClick={handleSubmit}>Cadastrar</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
