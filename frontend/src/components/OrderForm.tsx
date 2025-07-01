import { useState, useEffect, FormEvent } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { ptBR } from "date-fns/locale";
import InfoGroup from "./InfoGroup";

export type OrderFormPayload = {
  clientId: number;
  items: number[];
  value: number;
  contractStartDate: string;
  contractEndDate: string;
  installmentCount: number;
  installmentDay: number;
  paidInstallmentsCount: number;
  discount: number;
  emissionDate: string;
};

type ClientOption = { id: number; name: string };
type ItemOption = { value: number; label: string };

interface Props {
  clients: ClientOption[];
  items: ItemOption[];
  initial?: Omit<OrderFormPayload, "emissionDate">;
  onChange: (payload: OrderFormPayload) => void;
}

export default function OrderForm({
  clients,
  items,
  initial,
  onChange,
}: Props) {
  const [client, setClient] = useState<ClientOption | null>(null);
  const [selectedItems, setSelectedItems] = useState<ItemOption[]>([]);
  const [valueStr, setValueStr] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [installmentCount, setInstallmentCount] = useState("");
  const [installmentDay, setInstallmentDay] = useState("");
  const [paidInstallments, setPaidInstallments] = useState("");
  const [discountPct, setDiscountPct] = useState("");

  // hydrate from initial
  useEffect(() => {
    if (!initial) return;
    setClient(clients.find((c) => c.id === initial.clientId) ?? null);
    setSelectedItems(items.filter((i) => initial.items.includes(i.value)));
    setValueStr(
      initial.value
        .toLocaleString("pt-BR", { minimumFractionDigits: 2 })
        .replace(".", ",")
    );
    setStartDate(new Date(initial.contractStartDate));
    setEndDate(new Date(initial.contractEndDate));
    setInstallmentCount(String(initial.installmentCount));
    setInstallmentDay(String(initial.installmentDay));
    setPaidInstallments(String(initial.paidInstallmentsCount));
    setDiscountPct(String(initial.discount));
  }, [initial, clients, items]);

  // bubble up every change
  useEffect(() => {
    if (!client || !startDate || !endDate) return;
    const raw = parseFloat(valueStr.replace(/\./g, "").replace(",", ".")) || 0;
    onChange({
      clientId: client.id,
      items: selectedItems.map((i) => i.value),
      value: raw,
      contractStartDate: startDate.toISOString().split("T")[0],
      contractEndDate: endDate.toISOString().split("T")[0],
      installmentCount: Number(installmentCount),
      installmentDay: Number(installmentDay),
      paidInstallmentsCount: Number(paidInstallments),
      discount: Number(discountPct),
      emissionDate: startDate.toISOString().split("T")[0],
    });
  }, [
    client,
    selectedItems,
    valueStr,
    startDate,
    endDate,
    installmentCount,
    installmentDay,
    paidInstallments,
    discountPct,
    onChange,
  ]);

  // summary calculations
  const subtotal =
    parseFloat(valueStr.replace(/\./g, "").replace(",", ".")) || 0;
  const discountVal = (subtotal * (Number(discountPct) || 0)) / 100;
  const total = subtotal - discountVal;
  const instN = Number(installmentCount) || 0;
  const instValue = instN ? total / instN : 0;
  const paidValue = instValue * (Number(paidInstallments) || 0);
  const remainValue = total - paidValue;
  const fmt = (n: number) =>
    `R$ ${n.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;

  // helper to format currency input
  const formatInput = (v: string) => {
    const digits = v.replace(/\D/g, "");
    const num = parseFloat(digits || "0") / 100;
    setValueStr(
      num.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    );
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
      <form className="space-y-6">
        {/* Dados do Pedido */}
        <div className="p-5 bg-white rounded-lg flex flex-col gap-3">
          <p className="text-base font-medium">Dados do Pedido</p>
          <Autocomplete
            options={clients}
            getOptionLabel={(opt) => opt.name}
            value={client}
            onChange={(_, v) => setClient(v)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Cliente"
                placeholder="Selecione cliente"
                required
                fullWidth
              />
            )}
          />
          <Autocomplete
            multiple
            options={items}
            getOptionLabel={(opt) => opt.label}
            value={selectedItems}
            onChange={(_, v) => setSelectedItems(v)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Itens"
                placeholder="Selecione itens"
                fullWidth
                required
              />
            )}
          />
          <TextField
            label="Valor Total (R$)"
            value={valueStr}
            onChange={(e) => formatInput(e.target.value)}
            placeholder="Ex: 1.234,56"
            fullWidth
            required
          />
          <div className="flex gap-3">
            <DatePicker
              label="Início Contratação"
              value={startDate}
              onChange={(nv) => setStartDate(nv)}
              slotProps={{ textField: { fullWidth: true, required: true } }}
            />
            <DatePicker
              label="Término Contratação"
              value={endDate}
              onChange={(nv) => setEndDate(nv)}
              slotProps={{ textField: { fullWidth: true, required: true } }}
            />
          </div>
          <div className="flex gap-3">
            <TextField
              type="number"
              label="Nº Parcelas"
              value={installmentCount}
              onChange={(e) => setInstallmentCount(e.target.value)}
              fullWidth
              required
            />
            <TextField
              type="number"
              label="Venc. Parcelas"
              value={installmentDay}
              onChange={(e) => setInstallmentDay(e.target.value)}
              fullWidth
              required
            />
          </div>
          <div className="flex gap-3">
            <TextField
              type="number"
              label="Parcelas Pagas"
              value={paidInstallments}
              onChange={(e) => setPaidInstallments(e.target.value)}
              fullWidth
              required
            />
            <TextField
              type="number"
              label="Desconto (%)"
              value={discountPct}
              onChange={(e) => setDiscountPct(e.target.value)}
              fullWidth
            />
          </div>
        </div>

        {/* Resumo */}
        <div className="p-5 bg-white rounded-lg flex flex-col gap-3">
          <p className="text-base font-medium">Resumo</p>
          <InfoGroup
            items={[
              { label: "Sub-Total", value: fmt(subtotal) },
              { label: "Desconto (%)", value: `${discountPct || 0}%` },
              { label: "Desconto (R$)", value: fmt(discountVal) },
              { label: "Valor Parcela", value: fmt(instValue) },
              { label: "Valor Pago", value: fmt(paidValue), color: "#32c058" },
              {
                label: "Valor Restante",
                value: fmt(remainValue),
                color: "#ee3a4b",
              },
              { label: "Total", value: fmt(total) },
            ]}
          />
        </div>
      </form>
    </LocalizationProvider>
  );
}
