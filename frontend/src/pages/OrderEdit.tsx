import { FaTrash } from "react-icons/fa6";
import Button from "../components/Button";
import GoBack from "../components/GoBack";
import Header from "../components/Header";

import { FaDownload, FaRegEye, FaUpload } from "react-icons/fa";
import InputSelect from "../components/InputSelect";
import InputText from "../components/InputText";

type OrderEditProps = {
  title: string;
};

const opcoes = [
  { value: "valor1", label: "01" },
  { value: "valor2", label: "02" },
];

export default function OrderEdit({ title }: OrderEditProps) {
  return (
    <section className="bg-[#f6f6f6] lg:flex justify-center items-center min-h-screen lg:p-3 lg:items-start">
      <div className="w-full max-w-[1280px] flex lg:flex-row gap-5 pt-12 lg:pt-20  lg:pb-22">
        {/* Header */}
        <div
          className="fixed bottom-0 w-full bg-white rounded-lg 
                flex justify-center p-1
                lg:w-35 lg:flex lg:flex-col lg:justify-start lg:p-2 lg:top-23 lg:bottom-25 z-10"
        >
          <Header orders="active" />
        </div>

        {/* Content */}
        <div className="flex flex-col gap-5 w-full p-4 pb-[100px] lg:p-0 lg:pb-0 lg:ml-40">
          {/* Voltar para o Pedido ID */}
          <GoBack link={"/"} />
          <div className="flex flex-col p-5 gap-5 rounded-lg bg-white text-[#282828]">
            <p className="text-base font-medium">Editar Pedido</p>
            <div className="flex flex-col gap-5">
              <p className="text-sm font-medium">Empresa</p>
              <div className="flex flex-col gap-3">
                <InputText label={"Cliente"} placeholder={"Nome da empresa"} />
                <InputSelect label={"Itens"} id={""} options={opcoes} />
                <div className="flex gap-3">
                  <InputSelect label={"Início"} id={""} options={opcoes} />
                  <InputSelect label={"Fim"} id={""} options={opcoes} />
                </div>
                <div className="flex gap-3">
                  <InputText label={"Valor Total"} placeholder={"Valor"} />
                  <InputSelect label={"Parcelas"} id={""} options={opcoes} />
                </div>
                <div className="flex gap-3">
                  <InputSelect
                    label={"Venc. parcelas"}
                    id={""}
                    options={opcoes}
                  />
                  <InputSelect
                    label={"Parcelas pagas"}
                    id={""}
                    options={opcoes}
                  />
                </div>
                <InputText
                  label={"Desconto"}
                  placeholder={"Valor do Desconto"}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col p-5 gap-5 rounded-lg bg-white text-[#282828]">
            <div className="flex justify-between items-center">
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
                <button className="flex justify-center items-center w-9 h-9 bg-[#EE3A4B33] rounded-full text-[#EE3A4B] text-xl cursor-pointer">
                  <FaTrash />
                </button>
              </div>
            </div>

            <button className="flex flex-col items-center gap-2 p-8 border-dashed border border-[#28282833] rounded-lg bg-[#fafafa] cursor-pointer">
              <p className="text-2xl">
                <FaUpload />
              </p>
              <p className="text-base">Clique para carregar o arquivo</p>
            </button>
            {/* Botões */}
            <div className="flex gap-3 w-full justify-center lg:justify-end">
              <Button
                text="Cancelar"
                variant="outlined"
                className="w-full lg:w-auto"
              />
              <Button text="Cadastrar" className="w-full lg:w-auto" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
