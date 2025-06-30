import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Header from "../../components/Header";
import GoBack from "../../components/GoBack";
import SectionCard from "../../components/SectionCard";
import InfoGroup from "../../components/InfoGroup";
import FloatingButton from "../../components/FloatingButton";
import ErrorModal from "../../components/ErrorModal";
import ConfirmModal from "../../components/ConfirmationModal";
import AlertModal from "../../components/AlertModal";
import { FaRegEye, FaDownload, FaTrash } from "react-icons/fa";
import { RiPencilFill } from "react-icons/ri";
import api from "../../lib/api";
import UserHeader from "../../components/UserHeader";

type OrderDTO = {
  id: number;
  clientName: string;
  contractStartDate: string;
  contractEndDate: string;
  emissionDate: string;
  value: string;
  discountedValue: string;
  installmentCount: number;
  paidValue: string;
  remainingValue: string;
  installmentDay: number;
  items: { name: string }[];
  contractFilePath: string | null;
};

export default function Order() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [order, setOrder] = useState<OrderDTO | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<OrderDTO>(`/orders/${id}`)
      .then(({ data }) => setOrder(data))
      .catch(() => setError("Produto não encontrado."));
  }, [id]);

  const previewContract = async () => {
    try {
      const { data, headers } = await api.get(`/api/orders/${id}/contract`, {
        responseType: "blob",
      });
      if (!headers["content-type"]?.startsWith("application/pdf")) {
        setError("Pré-visualização disponível apenas para PDF.");
        return;
      }
      const url = URL.createObjectURL(data);
      setPreviewUrl(url);
    } catch {
      setError("Não foi possível carregar o contrato.");
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
      setError("Falha no download.");
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/api/orders/${id}`);
      navigate("/orders");
    } catch {
      setError("Erro ao excluir pedido.");
    }
  };

  return (
    <section className="bg-[#f6f6f6] lg:flex justify-center items-start min-h-screen">
      <ErrorModal error={error} onClose={() => setError(null)} />
      <AlertModal
        isOpen={!!successMsg}
        title="Sucesso"
        onClose={() => setSuccessMsg(null)}
      >
        <p className="text-sm text-[#282828]">{successMsg}</p>
      </AlertModal>
      <ConfirmModal
        isOpen={confirmDelete}
        title="Excluir pedido?"
        onCancel={() => setConfirmDelete(false)}
        onConfirm={handleDelete}
      >
        <p className="text-sm text-[#282828]">
          Essa ação removerá o pedido <b>#{order?.id}</b>. Continuar?
        </p>
      </ConfirmModal>
      <div className="fixed bottom-0 w-full lg:pt-4 bg-[#282828] rounded-lg flex justify-center p-1 lg:w-35 lg:flex-col lg:justify-start lg:p-2 lg:top-15 lg:bottom-0 lg:rounded-none lg:left-0 z-10 border-gray-200 border-r-1">
        <Header orders="active" />
      </div>

      <UserHeader />

      <div className="w-full max-w-[1280px] flex lg:flex-row gap-5 pt-25 lg:pb-22">
        <div className="flex flex-col gap-5 w-full p-4 pb-[100px] lg:pl-38 lg:pr-4">
          <GoBack link="/orders" />

          {order && (
            <>
              <SectionCard title="Dados do Produto">
                <InfoGroup
                  items={[
                    { label: "Cliente", value: order.clientName },
                    {
                      label: "Itens",
                      value: order.items.map((i) => i.name).join(", "),
                    },
                    {
                      label: "Período Contratação",
                      value: `${order.contractStartDate} — ${order.contractEndDate}`,
                    },
                    { label: "Emissão", value: order.emissionDate },
                    { label: "Valor Total", value: `R$ ${order.value}` },
                    { label: "Nº Parcelas", value: order.installmentCount },
                    {
                      label: "Valor Pago",
                      value: `R$ ${order.paidValue}`,
                      color: "#32c058",
                    },
                    {
                      label: "Valor Restante",
                      value: `R$ ${order.remainingValue}`,
                      color: "#ee3a4b",
                    },
                    {
                      label: "Vencimento Parcelas",
                      value: `Todo dia ${order.installmentDay}`,
                    },
                  ]}
                />
              </SectionCard>

              <SectionCard title="Contrato">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-[#787878]">
                      {order.contractFilePath
                        ? "Arquivo disponível"
                        : "Nenhum contrato enviado"}
                    </p>
                  </div>

                  {order.contractFilePath && (
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

                {/* visualização em iframe */}
                {previewUrl && (
                  <iframe
                    src={previewUrl}
                    title="Contrato"
                    className="w-full h-[80vh] rounded border mt-4"
                  />
                )}
              </SectionCard>
            </>
          )}
        </div>
      </div>

      <div className="fixed bottom-25 right-4 lg:bottom-10 lg:right-5 flex flex-col gap-2 items-end">
        <FloatingButton
          background="#2696FF"
          onClick={() => navigate(`/orders/${id}/edit`)}
        >
          <RiPencilFill /> Editar
        </FloatingButton>
        <FloatingButton
          background="#EE3A4B"
          onClick={() => setConfirmDelete(true)}
        >
          <FaTrash /> Apagar
        </FloatingButton>
      </div>
    </section>
  );
}
