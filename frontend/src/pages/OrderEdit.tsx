import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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

type ItemOption = { value: number; label: string };

const formatCurrency = (n: number) =>
  `R$ ${n.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;

export default function OrderEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [client, setClient] = useState<ClientOption | null>(null);
  const [items, setItems] = useState<ItemOption[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [orderValue, setOrderValue] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [installmentCount, setInstallmentCount] = useState("");
  const [installmentDay, setInstallmentDay] = useState("");
  const [paidInstallments, setPaidInstallments] = useState("");
  const [discountPct, setDiscountPct] = useState("");
  const [contractFile, setContractFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
      .get("/api/items")
      .then(({ data }) =>
        setItems(
          data.map((it: any) => ({
            value: it.id,
            label: it.name,
          }))
        )
      )
      .catch(() => setErrorMessage("Falha ao carregar itens."));
  }, []);

  useEffect(() => {
    if (items.length === 0) return;
    api
      .get(`/api/orders/${id}`)
      .then(({ data: order }) => {
        setClient({ id: order.clientId, name: order.clientName });
        // aqui usamos order.items[0].id, pois a API retorna id + name
        setSelectedItemId(order.items[0]?.id ?? null);
        setOrderValue(
          order.value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })
        );
        setStartDate(order.contractStartDate);
        setEndDate(order.contractEndDate);
        setInstallmentCount(String(order.installmentCount));
        setInstallmentDay(String(order.installmentDay));
        setPaidInstallments(String(order.paidInstallmentsCount));
        setDiscountPct(String(order.discount));
      })
      .catch(() => setErrorMessage("Pedido não encontrado."));
  }, [id, items]);

  const validate = () =>
    client &&
    selectedItemId !== null &&
    subtotal > 0 &&
    instCountN >= 1 &&
    +paidInstallments <= instCountN &&
    +installmentDay >= 1 &&
    +installmentDay <= 31;

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
      return;
    }
    await api.put(`/api/orders/${id}`, {
      clientId: client!.id,
      value: subtotal,
      contractStartDate: startDate,
      contractEndDate: endDate,
      installmentDay: +installmentDay,
      installmentCount: instCountN,
      discount: +discountPct,
      emissionDate: startDate,
      paidInstallmentsCount: +paidInstallments,
      contractFilePath: null,
      items: [selectedItemId!],
    });
    if (contractFile) {
      const form = new FormData();
      form.append("file", contractFile);
      await api.post(`/api/orders/${id}/contract`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    }
    navigate(`/orders/${id}`);
  };

  return (
    <section className="bg-[#f6f6f6] lg:flex justify-center items-start min-h-screen lg:p-3">
      <DialogModal
        isOpen={!!errorMessage}
        message={errorMessage ?? ""}
        onClose={() => setErrorMessage(null)}
      />
      <div className="w-full max-w-[1280px] flex lg:flex-row gap-5 pt-12 lg:pt-20 lg:pb-22">
        <div className="fixed bottom-0 w-full bg-white rounded-lg flex justify-center p-1 lg:w-35 lg:flex-col lg:justify-start lg:p-2 lg:top-23 lg:bottom-25 z-10">
          <Header orders="active" />
        </div>
        <div className="flex flex-col gap-5 w-full p-4 pb-[100px] lg:ml-40">
          <GoBack link={`/orders/${id}`} />
          <div className="flex flex-col p-5 gap-5 rounded-lg bg-white">
            <p className="text-base font-medium">Editar Pedido</p>
            {client && (
              <>
                <p className="text-sm font-medium">Empresa</p>
                <InputText
                  type="text"
                  label="Empresa"
                  value={client.name}
                  disabled
                />
                <InputSelect
                  label="Itens"
                  id="item"
                  options={items}
                  value={selectedItemId ?? undefined}
                  onChange={(v) => setSelectedItemId(Number(v))}
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
                    onValueChange={(v) =>
                      setInstallmentCount(String(Number(v)))
                    }
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
                    onValueChange={(v) =>
                      setPaidInstallments(String(Number(v)))
                    }
                  />
                  <InputText
                    type="number"
                    label="Desconto (%)"
                    min={0}
                    value={discountPct}
                    onValueChange={(v) => setDiscountPct(String(Number(v)))}
                  />
                </div>
              </>
            )}
          </div>
          <div className="flex flex-col p-5 gap-3 rounded-lg bg-white">
            <Info label="Sub-Total" value={formatCurrency(subtotal)} />
            <Info label="Desconto (%)" value={`${discountPct || 0}%`} />
            <Info label="Desconto (R$)" value={formatCurrency(discountVal)} />
            <Info label="Valor Parcelas" value={formatCurrency(instValue)} />
            <Info
              label="Valor Pago"
              value={formatCurrency(paidValue)}
              color="#32c058"
            />
            <Info
              label="Valor Restante"
              value={formatCurrency(remainValue)}
              color="#ee3a4b"
            />
            <Info label="Total" value={formatCurrency(total)} />
          </div>
          <div className="flex flex-col p-5 gap-5 rounded-lg bg-white">
            <p className="text-base font-bold">Contrato</p>
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
                  e.target.files && setContractFile(e.target.files[0])
                }
              />
            </label>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outlined"
                onClick={() => navigate(`/orders/${id}`)}
              >
                Cancelar
              </Button>
              <Button onClick={handleSubmit}>Salvar</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
