import { IoSearchSharp } from "react-icons/io5";
import Header from "../components/Header";
import Order from "../components/Order";
import { FaPlus } from "react-icons/fa6";
import FloatingButton from "../components/FloatingButton";
import Filter from "../components/Filter";
import SearchBar from "../components/SearchBar";
import Modal from "../components/Modal";
import { useState } from "react";
import Button from "../components/Button";
import FilterSelect from "../components/FilterSelect";

type PlaceholderPageProps = {
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

export default function PlaceholderPage({ title }: PlaceholderPageProps) {
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
          <Header orders="active" />
        </div>

        {/* Content */}
        <div className="flex flex-col gap-5 w-full p-4 pb-[100px] lg:p-0 lg:pb-0 lg:ml-40">
          <div className="flex gap-5 flex-col lg:flex-row lg:justify-between lg:items-center">
            <SearchBar />

            {/* Filters */}
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
              <Filter text={"Item"} onClick={() => setOpenModal("item")} />
            </div>
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

          {/* Modal: Status */}
          <Modal
            isOpen={openModal === "status"}
            onClose={() => setOpenModal(null)}
            title="Status"
          >
            {/* Modal Content */}
            <div className="flex flex-col gap-2">
              <label htmlFor="paid">
                <input type="radio" id="paid" name="order" /> Pago
              </label>
              <label htmlFor="pending">
                <input type="radio" id="pending" name="order" /> Pendente
              </label>
              <label htmlFor="unpaid">
                <input type="radio" id="unpaid" name="order" /> Não pago
              </label>
            </div>
            <Button text={"Aplicar filtro"} />
          </Modal>

          {/* Modal: Item */}
          <Modal
            isOpen={openModal === "item"}
            onClose={() => setOpenModal(null)}
            title="Item"
          >
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

          {/* Orders */}
          <div className="flex flex-col gap-3 p-2 bg-white rounded-lg">
            <Order
              product={"Produto"}
              date={"01/01/01"}
              value={"100,00"}
              color={"#32c058"}
              link={"#"}
              icon={"+"}
            />
            <Order
              product={"Produto"}
              date={"01/01/01"}
              value={"100,00"}
              color={"#32c058"}
              link={"#"}
              icon={"+"}
            />
            <Order
              product={"Produto"}
              date={"01/01/01"}
              value={"100,00"}
              color={"#32c058"}
              link={"#"}
              icon={"+"}
            />
            <Order
              product={"Produto"}
              date={"01/01/01"}
              value={"100,00"}
              color={"#32c058"}
              link={"#"}
              icon={"+"}
            />
            <Order
              product={"Produto"}
              date={"01/01/01"}
              value={"100,00"}
              color={"#32c058"}
              link={"#"}
              icon={"+"}
            />
            <Order
              product={"Produto"}
              date={"01/01/01"}
              value={"100,00"}
              color={"#32c058"}
              link={"#"}
              icon={"+"}
            />
            <Order
              product={"Produto"}
              date={"01/01/01"}
              value={"100,00"}
              color={"#32c058"}
              link={"#"}
              icon={"+"}
            />
          </div>
        </div>
      </div>

      {/* Floating Button */}
      <a
        href="/order/register"
        className="fixed bottom-25 right-4 lg:bottom-10 lg:right-5"
      >
        <FloatingButton icon={<FaPlus />} background={"#FFA322"} />
      </a>
    </section>
  );
}
