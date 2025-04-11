import { IoSearchSharp } from "react-icons/io5";
import Button from "../components/Button";
import GoBack from "../components/GoBack";
import Header from "../components/Header";
import Order from "../components/Order";
import Info from "../components/Info";
import FloatingButton from "../components/FloatingButton";

import { FaTrash } from "react-icons/fa";
import { RiPencilFill } from "react-icons/ri";

type ClientDetailsProps = {
  title: string;
};

export default function ClientDetails({ title }: ClientDetailsProps) {
  return (
    <section className="bg-[#f6f6f6] lg:flex justify-center items-center min-h-screen lg:p-3 lg:items-start">
      <div className="w-full max-w-[1280px] flex lg:flex-row gap-5 pt-12 lg:pt-20 lg:pb-22">
        {/* Header */}
        <div
          className="fixed bottom-0 w-full bg-white rounded-lg 
                flex justify-center p-1
                lg:w-35 lg:flex lg:flex-col lg:justify-start lg:p-2 lg:top-23 lg:bottom-25 z-10"
        >
          <Header clients="active" />
        </div>

        {/* Content */}
        <div className="flex flex-col gap-5 w-full p-4 pb-[100px] lg:p-0 lg:pb-0 lg:ml-40">
          <GoBack link={"/clients"} />
          {/* Cliente Info */}
          <div className="flex flex-col p-5 gap-5 rounded-lg bg-white text-[#282828]">
            <div className="flex flex-col gap-1 text-center">
              <p className="text-base font-bold">Empresa</p>
              <p className="text-sm text-[#787878]">00.000.000/0000-00</p>
            </div>
            <hr className="border-[#F0F0F0] " />
            {/* Representante */}
            <div className="flex gap-5 flex-col">
              <p className="text-sm font-medium ">Representante</p>
              <div className="w-full flex flex-col gap-5">
                <Info label={"Nome"} value={"Valor"} />
                <Info label={"E-mail"} value={"Valor"} />
                <Info label={"Telefone"} value={"Valor"} />
              </div>
            </div>
            {/* Endereço */}
            <div className="flex gap-5 flex-col">
              <p className="text-sm font-medium ">Endereço</p>
              <div className="w-full flex flex-col gap-5">
                <Info label={"CEP"} value={"Valor"} />
                <Info label={"Rua"} value={"Valor"} />
                <Info label={"Número"} value={"Valor"} />
                <Info label={"Complemento"} value={"Valor"} />
                <Info label={"Referência"} value={"Valor"} />
                <Info label={"Cidade"} value={"Valor"} />
                <Info label={"Estado"} value={"Valor"} />

                <div className="text-center">
                  <Button text="Adicionar Pedido" />
                </div>
              </div>
            </div>
          </div>
          {/* Pedidos */}
          <div className="flex flex-col p-5 gap-5 rounded-lg bg-white text-[#282828]">
            <p className="text-base font-bold">Pedidos</p>
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Pesquisar"
                className="w-full pl-4 pr-10 py-2 border text-sm text-[#282828] border-gray-300 rounded-full focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
              <IoSearchSharp className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            </div>
            Filtro aqui
            <div className="flex flex-col gap-3">
              <Order
                product={"Site"}
                date={"Hoje, 12:00h"}
                value={"100,00"}
                color={"#32c058"}
                link={"#"}
                icon={"+"}
              />
              <Order
                product={"Site"}
                date={"Hoje, 12:00h"}
                value={"100,00"}
                color={"#EE3a4b"}
                link={"#"}
                icon={"+"}
              />
              <Order
                product={"Site"}
                date={"Hoje, 12:00h"}
                value={"100,00"}
                color={"#ffa322"}
                link={"#"}
                icon={"+"}
              />
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
