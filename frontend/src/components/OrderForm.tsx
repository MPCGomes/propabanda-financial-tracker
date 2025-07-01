import { useState, useEffect, FormEvent } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "./Button";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { ptBR } from "date-fns/locale";

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

type OrderFormProps = {
  clients: ClientOption[];
  items: ItemOption[];
  initial?: {
    clientId: number;
    items: number[];
    value: number;
    contractStartDate: string;
    contractEndDate: string;
    installmentCount: number;
    installmentDay: number;
    paidInstallmentsCount: number;
    discount: number;
  };
  onSubmit: (payload: OrderFormPayload) => Promise<void>;
};

export default function OrderForm({
  clients,
  items,
  initial,
  onSubmit,
}: OrderFormProps) {
  const [client, setClient] = useState<ClientOption | null>(null);
  const [selectedItems, setSelectedItems] = useState<ItemOption[]>([]);
  const [valueStr, setValueStr] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [installmentCount, setInstallmentCount] = useState("");
  const [installmentDay, setInstallmentDay] = useState("");
  const [paidInstallments, setPaidInstallments] = useState("");
  const [discountPct, setDiscountPct] = useState("");

  useEffect(() => {
    if (!initial) return;
    setClient(clients.find((c) => c.id === initial.clientId) ?? null);
    setSelectedItems(items.filter((i) => initial.items.includes(i.value)));
    setValueStr(
      initial.value
        .toLocaleString("pt-BR", { minimumFractionDigits: 2 })
        .replace(".", ",")
    );
    setStartDate(
      initial.contractStartDate ? new Date(initial.contractStartDate) : null
    );
    setEndDate(
      initial.contractEndDate ? new Date(initial.contractEndDate) : null
    );
    setInstallmentCount(String(initial.installmentCount));
    setInstallmentDay(String(initial.installmentDay));
    setPaidInstallments(String(initial.paidInstallmentsCount));
    setDiscountPct(String(initial.discount));
  }, [initial, clients, items]);

  const handleValueChange = (v: string) => {
    const digits = v.replace(/\D/g, "");
    const num = parseFloat(digits || "0") / 100;
    setValueStr(
      num.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    );
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!client || !startDate || !endDate) return;
    const raw = parseFloat(valueStr.replace(/\./g, "").replace(",", ".")) || 0;
    onSubmit({
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
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* client autocomplete */}
        <div className="p-5 bg-white rounded-lg flex flex-col gap-3">
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
              />
            )}
          />
        </div>

        {/* items multi-select */}
        <div className="p-5 bg-white rounded-lg flex flex-col gap-3">
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
              />
            )}
          />
        </div>

        {/* dates and values */}
        <div className="p-5 bg-white rounded-lg flex flex-col gap-3">
          <TextField
            label="Valor Total (R$)"
            value={valueStr}
            onChange={(e) => handleValueChange(e.target.value)}
            placeholder="Ex: 1.234,56"
            fullWidth
            required
          />
          <div className="flex gap-3">
            <DatePicker
              label="Início Contratação"
              value={startDate}
              onChange={(newValue) => setStartDate(newValue)}
              slotProps={{ textField: { fullWidth: true, required: true } }}
            />
            <DatePicker
              label="Término Contratação"
              value={endDate}
              onChange={(newValue) => setEndDate(newValue)}
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

        {/* actions */}
        <div className="flex justify-end gap-3">
          <Button variant="outlined" onClick={() => history.back()}>
            Cancelar
          </Button>
          <Button type="submit">Salvar</Button>
        </div>
      </form>
    </LocalizationProvider>
  );
}
