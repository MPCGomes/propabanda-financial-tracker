import Button from "../components/Button";
import GoBack from "../components/GoBack";
import Header from "../components/Header";
import Info from "../components/Info";

import { FaUpload } from "react-icons/fa";

type OrderRegisterProps = {
  title: string;
};

export default function OrderRegister({ title }: OrderRegisterProps) {
  return (
    <section className="bg-[#f6f6f6] lg:flex justify-center items-center min-h-screen lg:p-3">
      <div className="w-full max-w-[1280px] flex lg:flex-row gap-5">
        {/* Header */}
        <div
          className="fixed bottom-0 w-full bg-white rounded-lg 
            flex justify-center p-1
            lg:static lg:w-40 lg:flex lg:flex-col lg:justify-start lg:p-2"
        >
          <Header clients="active" />
        </div>

        {/* Content */}
        <div className="flex flex-col gap-5 w-full p-4 pb-[100px] lg:p-0 lg:pb-0">
          <GoBack link={"/clients"} />
          <div className="flex flex-col p-5 gap-5 rounded-lg bg-white text-[#282828]">
            <p className="text-base font-medium">Cadastar Pedido</p>
            <div className="flex flex-col gap-5">
              <p className="text-sm font-medium">Empresa</p>
              <div className="flex flex-col gap-3">
                <input type="text" placeholder="Placeholder..." />
                <input type="text" placeholder="Placeholder..." />
                <div className="flex gap-3">
                  <input type="text" placeholder="Placeholder..." />
                  <input type="text" placeholder="Placeholder..." />
                </div>
                <div className="flex gap-3">
                  <input type="text" placeholder="Placeholder..." />
                  <input type="text" placeholder="Placeholder..." />
                </div>
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
