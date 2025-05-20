import { FaRegEye, FaDownload, FaTrash } from "react-icons/fa";
import { RiPencilFill } from "react-icons/ri";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import GoBack from "../components/GoBack";
import Info from "../components/Info";
import FloatingButton from "../components/FloatingButton";
import Modal from "../components/Modal";
import Button from "../components/Button";
import api from "../lib/api";

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
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState<OrderDTO | null>(null);
  const [errMsg, setErrMsg] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Load Data
  useEffect(() => {
    api
      .get(`/api/orders/${id}`)
      .then(({ data }) => setOrder(data))
      .catch(() => setErrMsg("Pedido não encontrado."));
  }, [id]);

  // Helpers
  const previewContract = async () => {
    try {
      const { data, headers } = await api.get(`/api/orders/${id}/contract`, {
        responseType: "blob",
      });

      if (!headers["content-type"]?.startsWith("application/pdf")) {
        setErrMsg("Pré-visualização disponível apenas para PDF.");
        return;
      }
      const url = URL.createObjectURL(data);
      setPreviewUrl(url);
    } catch {
      setErrMsg("Não foi possível carregar o contrato.");
    }
  };

  const downloadContract = async () => {
    try {
      const { data, headers } = await api.get(`/api/orders/${id}/contract`, {
        responseType: "blob",
      });
      const fileName =
        headers["content-disposition"]
          ?.split("filename=")[1]
          ?.replaceAll('"', "") || `contrato_${id}`;
      const blob = new Blob([data], { type: headers["content-type"] });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setErrMsg("Falha no download.");
    }
  };

  const deleteOrder = async () => {
    try {
      await api.delete(`/api/orders/${id}`);
      navigate("/orders");
    } catch {
      setErrMsg("Erro ao excluir pedido.");
    }
  };

  return (
    <section className="bg-[#f6f6f6] lg:flex justify-center items-start min-h-screen lg:p-3">
      {/* Erro */}
      <Modal isOpen={!!errMsg} onClose={() => setErrMsg(null)} title="Aviso">
        <p className="text-sm mb-4">{errMsg}</p>
        <Button onClick={() => setErrMsg(null)}>OK</Button>
      </Modal>

      {/* Pré-visualização PDF */}
      <Modal
        isOpen={!!previewUrl}
        onClose={() => {
          if (previewUrl) URL.revokeObjectURL(previewUrl);
          setPreviewUrl(null);
        }}
        title="Contrato"
      >
        {previewUrl && (
          <iframe
            src={previewUrl}
            title="Contrato"
            className="w-full h-[80vh] rounded border"
          />
        )}
      </Modal>

      {/* Confirmação de exclusão */}
      <Modal
        isOpen={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        title="Excluir pedido?"
      >
        <p className="text-sm text-[#282828]">
          Essa ação removerá o pedido <b>#{order?.id}</b>. Continuar?
        </p>
        <div className="flex gap-3">
          <button
            className="flex-1 py-2 rounded-full bg-gray-100 text-[#282828] cursor-pointer"
            onClick={() => setConfirmDelete(false)}
          >
            Cancelar
          </button>
          <button
            className="flex-1 py-2 rounded-full bg-[#EE3A4B] text-white cursor-pointer"
            onClick={deleteOrder}
          >
            Excluir
          </button>
        </div>
      </Modal>

      <div className="w-full max-w-[1280px] flex lg:flex-row gap-5 pt-12 lg:pt-20 lg:pb-22">
        {/* Menu lateral / inferior */}
        <div className="fixed bottom-0 w-full bg-white rounded-lg flex justify-center p-1 lg:w-35 lg:flex-col lg:justify-start lg:p-2 lg:top-23 lg:bottom-25 z-10">
          <Header orders="active" />
        </div>

        {/* Conteúdo */}
        <div className="flex flex-col gap-5 w-full p-4 pb-[100px] lg:ml-40">
          <GoBack link="/orders" />

          {order && (
            <>
              {/* Dados do pedido */}
              <div className="flex flex-col p-5 gap-5 rounded-lg bg-white">
                <Info label="Cliente" value={order.clientName} />
                <Info
                  label="Itens"
                  value={order.items.map((i) => i.name).join(", ")}
                />
                <Info
                  label="Período Contratação"
                  value={`${order.contractStartDate} — ${order.contractEndDate}`}
                />
                <Info label="Emissão" value={order.emissionDate} />
                <Info label="Valor Total" value={`R$ ${order.value}`} />
                <Info
                  label="Nº Parcelas"
                  value={order.installmentCount.toString()}
                />
                <Info
                  label="Valor Pago"
                  value={`R$ ${order.paidValue}`}
                  color="#32c058"
                />
                <Info
                  label="Valor Restante"
                  value={`R$ ${order.remainingValue}`}
                  color="#ee3a4b"
                />
                <Info
                  label="Vencimento Parcelas"
                  value={`Todo dia ${order.installmentDay}`}
                />
              </div>

              {/* Contrato */}
              <div className="flex p-5 gap-5 rounded-lg bg-white justify-between items-center">
                <div>
                  <p className="text-base font-bold">Contrato</p>
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
            </>
          )}
        </div>
      </div>

      {/* Botões flutuantes */}
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
