import GoBack from "../components/GoBack";
import Header from "../components/Header";
import Info from "../components/Info";
import FloatingButton from "../components/FloatingButton";
import { FaRegEye } from "react-icons/fa";
import { FaDownload } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import { RiPencilFill } from "react-icons/ri";

type ClientDetailsProps = {
  title: string;
};

export default function ClientDetails({ title }: ClientDetailsProps) {
  return (
    <section className="bg-[#f6f6f6] lg:flex justify-center items-center min-h-screen lg:p-3">
      <div className="w-full max-w-[1280px] flex lg:flex-row gap-5">
        {/* Header */}
        <div
          className="fixed bottom-0 w-full bg-white rounded-lg 
            flex justify-center p-1
            lg:static lg:w-40 lg:flex lg:flex-col lg:justify-start lg:p-2"
        >
          <Header orders="active" />
        </div>

        {/* Content */}
        <div className="flex flex-col gap-5 w-full p-4 pb-[100px] lg:p-0 lg:pb-0">
          <GoBack link={"/clients"} />
          {/* Pedido Info */}
          <div className="flex flex-col p-5 gap-5 rounded-lg bg-white text-[#282828]">
            <Info label={"Cliente"} value={"Valor"} />
            <Info label={"Itens"} value={"Valor"} />
            <Info label={"Período Contratação"} value={"Valor"} />
            <Info label={"Emissão"} value={"Valor"} />
            <Info label={"Valor Total"} value={"Valor"} />
            <Info label={"Nº Parcelas"} value={"Valor"} />
            <Info label={"Valor Pago"} value={"Valor"} />
            <Info label={"Valor Restante"} value={"Valor"} />
            <Info label={"Vencimento Parcelas"} value={"Valor"} />
          </div>
          {/* Pedidos */}
          <div className="flex p-5 gap-5 rounded-lg bg-white text-[#282828] justify-between">
            <div className="flex flex-col">
              <p className="text-base font-bold">Contrato</p>
              <p className="text-sm text-[#787878]">Atualizado em </p>
            </div>
            <div className="flex gap-3">
              <button className="flex justify-center items-center w-9 h-9 bg-[#ffa32233] rounded-full text-[#ffa322] text-xl cursor-pointer">
                <FaRegEye />
              </button>
              <button className="flex justify-center items-center w-9 h-9 bg-[#32c05833] rounded-full text-[#32c058] text-xl cursor-pointer">
                <FaDownload />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="fixed bottom-25 right-4 lg:bottom-10 lg:right-5 flex flex-col gap-2">
        <FloatingButton icon={<RiPencilFill />} background={"#2696FF"} />
        <FloatingButton icon={<FaTrash />} background={"#EE3A4B"} />
      </div>
    </section>
  );
}
