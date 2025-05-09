import { useState } from "react";
import DashboardHeader from "../components/DashboardHeader";
import UserHeader from "../components/UserHeader";
import { FaArrowUp } from "react-icons/fa6";
import { MdKeyboardArrowUp, MdKeyboardArrowDown } from "react-icons/md";
import Header from "../components/Header";
import Filter from "../components/Filter";
import Modal from "../components/Modal";
import Button from "../components/Button";

type DashboardProps = {
  title: string;
};

export default function Dashboard({ title }: DashboardProps) {
  const [showEntryList, setShowEntryList] = useState(false);
  const [openModal, setOpenModal] = useState<null | "period" | "item">(null);

  const toggleEntryList = () => {
    setShowEntryList((prev) => !prev);
  };

  return (
    <section className="bg-[#f6f6f6] lg:flex justify-center items-center min-h-screen lg:p-3 lg:items-start">
      <div className="w-full max-w-[1280px] flex lg:flex-row gap-5 pt-12 lg:pt-20 lg:pb-22 ">
        {/* Header */}
        <div
          className="fixed bottom-0 w-full bg-white rounded-lg 
        flex justify-center p-1
        lg:w-35 lg:flex lg:flex-col lg:justify-start lg:p-2 lg:top-23 lg:bottom-25 z-10"
        >
          <Header dashboard="active" />
        </div>

        {/* Content */}
        <div className="flex flex-col gap-5 w-full p-4 pb-[100px] lg:p-0 lg:pb-0 lg:ml-40">
          <UserHeader user="Johnny" />

          {/* Dashboard Header and Filters */}
          <div className="flex flex-col gap-5 lg:flex-row lg:justify-between">
            <div className="flex justify-center">
              <DashboardHeader evolution="Dash" />
            </div>
            <div className="flex gap-3">
              <Filter text={"Período"} onClick={() => setOpenModal("period")} />
              <Filter text={"Item"} onClick={() => setOpenModal("item")} />
            </div>
          </div>

          {/* Modal: Date */}
          <Modal
            isOpen={openModal === "period"}
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

          {/* Modal: Items */}
          <Modal
            isOpen={openModal === "item"}
            onClose={() => setOpenModal(null)}
            title="Itens"
          >
            {/* Modal Content */}
            <div className="flex flex-col gap-2">
              <label>
                <input type="checkbox" /> OUTDOOR 1
              </label>
              <label>
                <input type="checkbox" /> OUTDOOR 2
              </label>
              <label>
                <input type="checkbox" /> PAINEL
              </label>
              <label>
                <input type="checkbox" /> REDES SOCIAIS
              </label>
              <label>
                <input type="checkbox" /> SITES
              </label>
            </div>
            <Button text={"Aplicar filtro"} />
          </Modal>

          {/* Balance */}
          <div className="flex flex-col gap-5 p-5 bg-white rounded-lg">
            <div className="text-[#282828]">
              <p className="text-xs">Saldo no período</p>
              <p className="text-xl font-bold">R$ 2.000,00</p>
              <p className="flex gap-1 text-xs">
                <span className="flex items-center gap-1 text-[#32c058]">
                  <FaArrowUp /> R$ 1.000,00
                </span>{" "}
                de entradas no período
              </p>
            </div>
            {/* Dashboard */}
            Dashboard aqui
          </div>

          {/* Last Transactions */}
          <div className="flex flex-col gap-5 p-5 bg-white rounded-lg">
            <p className="text-base font-medium text-[#282828]">Histórico</p>
            <div>
              <div className="flex items-center justify-between p-2 bg-[#fafafa] rounded-md">
                <p className="text-xs font-medium text-[#28282833]">
                  Saldo Inicial
                </p>
                <p className="text-[#282828] text-base">R$ 1.000,00</p>
              </div>
              <div className="flex items-center justify-between p-2 rounded-md">
                <p className="text-xs font-medium text-[#28282833]">
                  Nº de Pedidos
                </p>
                <p className="text-[#282828] text-base">5</p>
              </div>
              <div className="flex flex-col bg-[#fafafa] rounded-md">
                <div className="flex items-center justify-between p-2">
                  <p className="text-xs font-medium text-[#28282833]">
                    Entradas
                  </p>
                  <button
                    className="text-[#282828] text-base flex items-center gap-1 cursor-pointer"
                    onClick={toggleEntryList}
                  >
                    + R$ 1.000,00{" "}
                    {showEntryList ? (
                      <MdKeyboardArrowUp />
                    ) : (
                      <MdKeyboardArrowDown />
                    )}
                  </button>
                </div>
                {showEntryList && (
                  <ul className="text-sm text-[#282828] px-2 pb-2 space-y-2">
                    <li className="flex justify-between items-center">
                      <p className="text-xs font-medium text-[#28282833]">
                        Outdoor 1
                      </p>
                      <p>R$ 1.000,00</p>
                    </li>
                    <li className="flex justify-between items-center">
                      <p className="text-xs font-medium text-[#28282833]">
                        Painel 1
                      </p>
                      <p>R$ 0</p>
                    </li>
                    <li className="flex justify-between items-center">
                      <p className="text-xs font-medium text-[#28282833]">
                        Sites 1
                      </p>
                      <p>R$ 0</p>
                    </li>
                  </ul>
                )}
              </div>
              <div className="flex items-center justify-between p-2 rounded-md">
                <p className="text-xs font-medium text-[#28282833]">
                  Variação em %
                </p>
                <p className="text-[#32C058] text-base">+ 100.00%</p>
              </div>
              <div className="flex items-center justify-between p-2 bg-[#fafafa] rounded-md">
                <p className="text-xs font-medium text-[#28282833]">
                  Saldo Final
                </p>
                <p className="text-[#32C058] text-base">+ R$ 2.000,00</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
