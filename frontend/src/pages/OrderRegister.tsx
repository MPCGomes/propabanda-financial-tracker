import Button from "../components/Button";
import GoBack from "../components/GoBack";
import Header from "../components/Header";
import Info from "../components/Info";

import { FaUpload } from "react-icons/fa";
import InputText from "../components/InputText";
import InputSelect from "../components/InputSelect";

type OrderRegisterProps = {
  title: string;
};

const opcoes = [
  { value: "valor1", label: "01" },
  { value: "valor2", label: "02" },
];

export default function OrderRegister({ title }: OrderRegisterProps) {
  return (
    <section className="bg-[#f6f6f6] lg:flex justify-center items-center min-h-screen lg:p-3 lg:items-start">
      <div className="w-full max-w-[1280px] flex lg:flex-row gap-5 pt-12 lg:pt-20 lg:pb-22">
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
          <GoBack link={"/orders"} />
          {/* Inputs */}
          <div className="flex flex-col p-5 gap-5 rounded-lg bg-white text-[#282828]">
            <p className="text-base font-medium">Cadastrar Pedido</p>
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

          <div className="flex flex-col p-5 gap-3 rounded-lg bg-white text-[#282828]">
            <Info label={"Sub-Total"} value={"R$ 1.200,00"} />
            <Info label={"Desconto (%)"} value={"10%"} />
            <Info label={"Desconto (R$)"} value={"R$ 120,00"} />
            <Info label={"Valor Parcelas"} value={"R$ 108,00"} />
            <hr className="border-[#F0F0F0] " />
            <Info label={"Total"} value={"R$ 1.080,00"} />
          </div>

          <div className="flex flex-col p-5 gap-5 rounded-lg bg-white text-[#282828]">
            <p className="text-sm font-medium">Contrato</p>
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
