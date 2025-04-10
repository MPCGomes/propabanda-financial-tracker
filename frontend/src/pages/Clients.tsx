import Client from "../components/Client";
import FloatingButton from "../components/FloatingButton";
import Header from "../components/Header";

import { IoSearchSharp } from "react-icons/io5";
import { FaPlus } from "react-icons/fa6";

type ClientsProps = {
  title: string;
};

export default function Clients({ title }: ClientsProps) {
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
          <div className="flex gap-5 flex-col lg:flex-row lg:justify-between lg:items-center">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Pesquisar"
                className="w-full pl-4 pr-10 py-2 border text-sm text-[#282828] border-gray-300 rounded-full focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
              <IoSearchSharp className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            </div>
            Filtros aqui
          </div>
          <div className="flex flex-col gap-5 p-5 bg-white rounded-lg">
            <Client client={"Empresa"} rep={"Representante"} link={"#"} />
            <Client client={"Empresa"} rep={"Representante"} link={"#"} />
            <Client client={"Empresa"} rep={"Representante"} link={"#"} />
            <Client client={"Empresa"} rep={"Representante"} link={"#"} />
            <Client client={"Empresa"} rep={"Representante"} link={"#"} />
          </div>
        </div>
      </div>
      <a href="/client-register" className="fixed bottom-25 right-4 lg:bottom-10 lg:right-5">
        <FloatingButton icon={<FaPlus />} background={"#FFA322"} />
      </a>
    </section>
  );
}
