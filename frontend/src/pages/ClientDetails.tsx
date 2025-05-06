import { IoSearchSharp } from "react-icons/io5";
import Button from "../components/Button";
import GoBack from "../components/GoBack";
import Header from "../components/Header";
import Order from "../components/Order";
import Info from "../components/Info";
import FloatingButton from "../components/FloatingButton";

import { FaTrash } from "react-icons/fa";
import { RiPencilFill } from "react-icons/ri";
import Filter from "../components/Filter";
import FilterSelect from "../components/FilterSelect";
import Modal from "../components/Modal";
import { useState } from "react";
import SearchBar from "../components/SearchBar";

type ClientDetailsProps = {
  title: string;
};

const orderOptions = [
  { value: "order", label: "A - Z" },
  { value: "order", label: "Z - A" },
];

const statusOptions = [
  { value: "status", label: "Pago" },
  { value: "status", label: "Pendente" },
  { value: "status", label: "Não pago" },
];

export default function ClientDetails({ title }: ClientDetailsProps) {
  const [openModal, setOpenModal] = useState<
    null | "order" | "date" | "status" | "item"
  >(null);
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
          {/* Client purchase list */}
          <div className="flex flex-col p-5 gap-5 rounded-lg bg-white text-[#282828]">
            <p className="text-base font-bold">Pedidos</p>
            <SearchBar />
            <div className="flex gap-3 flex-wrap lg:flex-nowrap">
              <div className="hidden lg:block">
                <FilterSelect options={orderOptions} placeholder={`Ordem`} />
              </div>
              <Filter
                text={"Ordem"}
                onClick={() => setOpenModal("order")}
                className="lg:hidden"
              />
              <Filter text={"Data"} onClick={() => setOpenModal("date")} />
              <div className="hidden lg:block">
                <FilterSelect options={statusOptions} placeholder={`Status`} />
              </div>
              <Filter
                text={"Status"}
                onClick={() => setOpenModal("status")}
                className="lg:hidden"
              />
            </div>

            {/* Modal: Alphabetical Order */}
            <Modal
              isOpen={openModal === "order"}
              onClose={() => setOpenModal(null)}
              title="Ordem Alfabética"
            >
              <div className="flex flex-col gap-2">
                <label htmlFor="a-z">
                  <input type="radio" id="a-z" name="order" /> Ascendente (A-Z)
                </label>
                <label htmlFor="z-a">
                  <input type="radio" id="z-a" name="order" /> Descentente (Z-A)
                </label>
              </div>
              <Button text={"Aplicar filtro"} />
            </Modal>

            {/* Modal: Date */}
            <Modal
              isOpen={openModal === "date"}
              onClose={() => setOpenModal(null)}
              title="Período"
            >
              {/* Modal Content */}
              <div className="flex gap-2">
                <div className="relative w-full">
                  <input
                    type="date"
                    id="start-date"
                    className="peer w-full border border-gray-300 rounded-md p-2 pt-7 text-sm text-gray-700 bg-white appearance-none focus:outline-none focus:border-blue-500s"
                    placeholder=" "
                  />
                  <label
                    htmlFor="start-date"
                    className="absolute left-2 top-2 text-[#282828] text-xs transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-xs peer-placeholder-shown:text-[#282828] peer-focus:top-2 peer-focus:text-xs peer-focus:text-blue-500"
                  >
                    Início
                  </label>
                </div>
                <div className="relative w-full">
                  <input
                    type="date"
                    id="start-date"
                    className="peer w-full border border-gray-300 rounded-md p-2 pt-7 text-sm text-gray-700 bg-white appearance-none focus:outline-none focus:border-blue-500s"
                    placeholder=" "
                  />
                  <label
                    htmlFor="start-date"
                    className="absolute left-2 top-2 text-[#282828] text-xs transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-xs peer-placeholder-shown:text-[#282828] peer-focus:top-2 peer-focus:text-xs peer-focus:text-blue-500"
                  >
                    Início
                  </label>
                </div>
              </div>

              <Button text={"Aplicar filtro"} />
            </Modal>
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
      {/* Floating Buttons */}
      <div className="fixed bottom-25 right-4 lg:bottom-10 lg:right-5 flex flex-col gap-2">
        <FloatingButton icon={<RiPencilFill />} background={"#2696FF"} />
        <FloatingButton icon={<FaTrash />} background={"#EE3A4B"} />
      </div>
    </section>
  );
}
