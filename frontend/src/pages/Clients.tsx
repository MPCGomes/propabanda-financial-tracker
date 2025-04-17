import Client from "../components/Client";
import FloatingButton from "../components/FloatingButton";
import Header from "../components/Header";
import { FaPlus } from "react-icons/fa6";
import Filter from "../components/Filter";
import SearchBar from "../components/SearchBar";
import Button from "../components/Button";
import Modal from "../components/Modal";
import { useState } from "react";

type ClientsProps = {
  title: string;
};

export default function Clients({ title }: ClientsProps) {
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
          <div className="flex gap-5 flex-col lg:flex-row lg:justify-between lg:items-center">
            <SearchBar />
            {/* Filter */}
            <div className="flex gap-3">
              <Filter text={"Ordem"} onClick={() => setOpenModal("order")} />
              <Filter text={"Data"} onClick={() => setOpenModal("date")} />
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
          </div>
          <div className="flex flex-col gap-3 p-2 bg-white rounded-lg">
            <Client client={"Empresa"} rep={"Representante"} link={"#"} />
            <Client client={"Empresa"} rep={"Representante"} link={"#"} />
            <Client client={"Empresa"} rep={"Representante"} link={"#"} />
            <Client client={"Empresa"} rep={"Representante"} link={"#"} />
            <Client client={"Empresa"} rep={"Representante"} link={"#"} />
          </div>
        </div>
      </div>
      <a
        href="/client/register"
        className="fixed bottom-25 right-4 lg:bottom-10 lg:right-5"
      >
        <FloatingButton icon={<FaPlus />} background={"#FFA322"} />
      </a>
    </section>
  );
}
