import { useState } from "react";
import DashboardHeader from "../components/DashboardHeader";
import UserHeader from "../components/UserHeader";
import { FaArrowUp } from "react-icons/fa6";
import { MdKeyboardArrowUp, MdKeyboardArrowDown } from "react-icons/md";
import Header from "../components/Header";

type DashboardPerformanceProps = {
  title: string;
};

export default function DashboardPerformance({
  title,
}: DashboardPerformanceProps) {
  const [showEntryList, setShowEntryList] = useState(false);

  const toggleEntryList = () => {
    setShowEntryList((prev) => !prev);
  };

  return (
    <section className="bg-[#f6f6f6] lg:flex justify-center items-center min-h-screen lg:p-3 lg:items-start">
      <div className="w-full max-w-[1280px] flex lg:flex-row gap-5 pt-12 lg:pt-20 lg:pb-22">
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

          <div className="flex flex-col gap-5 lg:flex-row lg:justify-between">
            <div className="flex justify-center">
              <DashboardHeader performance="Dash" />
            </div>
            Filtro aqui
          </div>

          <div className="flex flex-col gap-5 p-5 bg-white rounded-lg">
            Dashboard aqui
          </div>

          <div className="flex flex-col gap-5 p-5 bg-white rounded-lg">
            <p className="text-base font-medium text-[#282828]">Histórico</p>
            <div>
              <div className="flex justify-between p-2 bg-[#fafafa] rounded-md">
                <p className="text-xs font-medium text-[#28282833]">
                  Outdoor 1
                </p>
                <div>
                  <p className="text-base text-[#282828]">R$ 500,00</p>
                  <p className="text-xs text-end text-[#32c058]">+25%</p>
                </div>
              </div>

              <div className="flex justify-between p-2 rounded-md">
                <p className="text-xs font-medium  text-[#28282833]">
                  Painel 1
                </p>
                <div>
                  <p className="text-base text-[#282828]">R$ 250,00</p>
                  <p className="text-xs text-end text-[#32c058]">+15%</p>
                </div>
              </div>
              <div className="flex justify-between p-2 bg-[#fafafa] rounded-md">
                <p className="text-xs font-medium  text-[#28282833]">Sites</p>
                <div>
                  <p className="text-base  text-[#282828]">R$ 250,00</p>
                  <p className="text-xs text-end text-[#ee3a4b]">-12,75%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
