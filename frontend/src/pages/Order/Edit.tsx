import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Header from "../../components/Header";
import GoBack from "../../components/GoBack";
import InputText from "../../components/InputText";
import InputSelect from "../../components/InputSelect";
import Button from "../../components/Button";
import ErrorModal from "../../components/ErrorModal";
import AlertModal from "../../components/AlertModal";
import SectionCard from "../../components/SectionCard";
import InfoGroup from "../../components/InfoGroup";
import { useModal } from "../../hooks/useModal";
import { FaUpload, FaRegEye, FaDownload } from "react-icons/fa";
import api from "../../lib/api";

type ClientOption = { id: number; name: string };
type ItemOption = { value: number; label: string };

const formatCurrency = (n: number) =>
  `R$ ${n.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;

export default function OrderEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const errorModal = useModal(false);
  const successModal = useModal(false);

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
  const [existingContractPath, setExistingContractPath] = useState<
    string | null
  >(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
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
      )
      .catch(() => {
        setErrorMessage("Falha ao carregar itens.");
        errorModal.open();
      });
  }, []);

  useEffect(() => {
    if (!items.length) return;
    api
      .get(`/api/orders/${id}`)
      .then(({ data: order }) => {
        setClient({ id: order.clientId, name: order.clientName });
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
        setExistingContractPath(order.contractFilePath);
      })
      .catch(() => {
        setErrorMessage("Pedido não encontrado.");
        errorModal.open();
      });
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

  const previewContract = async () => {
    try {
      const { data, headers } = await api.get(`/api/orders/${id}/contract`, {
        responseType: "blob",
      });
      if (!headers["content-type"]?.startsWith("application/pdf")) {
        setErrorMessage("Pré-visualização disponível apenas para PDF.");
        errorModal.open();
        return;
      }
      const url = URL.createObjectURL(data);
      setPreviewUrl(url);
    } catch {
      setErrorMessage("Não foi possível carregar o contrato.");
      errorModal.open();
    }
  };

  const downloadContract = async () => {
    try {
      const { data, headers } = await api.get(`/api/orders/${id}/contract`, {
        responseType: "blob",
      });
      const disposition = headers["content-disposition"] || "";
      const fileName =
        disposition.split("filename=")[1]?.replace(/\"/g, "").trim() ||
        `contrato_${id}.pdf`;
      const blob = new Blob([data], { type: headers["content-type"] });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setErrorMessage("Falha no download.");
      errorModal.open();
    }
  };

  const handleSubmit = async () => {
    if (!validate()) {
      setErrorMessage("Preencha todos os campos corretamente.");
      errorModal.open();
      return;
    }
    try {
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
        contractFilePath: existingContractPath,
        items: [selectedItemId!],
      });
      if (contractFile) {
        const form = new FormData();
        form.append("file", contractFile);
        await api.post(`/api/orders/${id}/contract`, form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      successModal.open();
    } catch (e: any) {
      setErrorMessage(e.message || "Falha ao salvar.");
      errorModal.open();
    }
  };

  return (
    <section className="bg-[#f6f6f6] lg:flex justify-center items-start min-h-screen lg:p-3">
      <ErrorModal
        error={errorMessage}
        onClose={() => {
          setErrorMessage(null);
          errorModal.close();
        }}
      />
      <AlertModal
        isOpen={successModal.isOpen}
        title="Sucesso"
        onClose={() => {
          successModal.close();
          navigate(`/orders/${id}`);
        }}
      >
        <p className="text-sm text-[#282828]">Pedido atualizado com sucesso.</p>
      </AlertModal>

      <div className="w-full max-w-[1280px] flex lg:flex-row gap-5 pt-12 lg:pt-20 lg:pb-22">
        <div className="fixed bottom-0 w-full bg-white rounded-lg flex justify-center p-1 lg:w-35 lg:flex-col lg:justify-start lg:p-2 lg:top-23 lg:bottom-25 z-10">
          <Header orders="active" />
        </div>
        <div className="flex flex-col gap-5 w-full p-4 pb-[100px] lg:ml-40">
          <GoBack link={`/orders/${id}`} />

          <SectionCard title="Editar Pedido">
            {client && (
              <>
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
          </SectionCard>

          <SectionCard title="Resumo">
            <InfoGroup
              items={[
                { label: "Sub-Total", value: formatCurrency(subtotal) },
                { label: "Desconto (%)", value: `${discountPct || 0}%` },
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
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-[#787878]">
                  {existingContractPath
                    ? "Arquivo disponível"
                    : "Nenhum contrato enviado"}
                </p>
              </div>
              {existingContractPath && (
                <div className="flex gap-3">
                  <button
                    className="w-9 h-9 bg-[#ffa32233] rounded-full flex items-center justify-center text-[#ffa322]"
                    onClick={previewContract}
                  >
                    <FaRegEye />
                  </button>
                  <button
                    className="w-9 h-9 bg-[#32c05833] rounded-full flex items-center justify-center text-[#32c058]"
                    onClick={downloadContract}
                  >
                    <FaDownload />
                  </button>
                </div>
              )}
            </div>
            {previewUrl && (
              <iframe
                src={previewUrl}
                title="Contrato"
                className="w-full h-[80vh] rounded border mt-4"
              />
            )}

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
          </SectionCard>
        </div>
      </div>
    </section>
  );
}
