import { IoPeopleSharp } from "react-icons/io5";
import { FaChartSimple, FaClipboardCheck } from "react-icons/fa6";

type Header = {
  clients?: "active";
  dashboard?: "active";
  orders?: "active";
};

export default function Header({ clients, dashboard, orders }: Header) {
  const baseClasses =
    "text-sm text-[#D9D9D9] font-medium flex flex-col items-center hover:bg-[#fafafa] duration-300 max-w-[130px] w-full py-3 px-6 rounded-lg lg:flex-row lg:gap-3 lg:max-w-[125px] lg:px-3 lg:max-h-[1024px]";

  const variants = {
    active: "bg-[#ffa32233] text-[#FFA322] hover:bg-[#ffa32233]",
  };

  const getVariant = (state?: "active") =>
    state === "active" ? variants.active : "";

  return (
    <div className="flex gap-1 lg:flex-col z-10">
      <a href="/clients" className={`${baseClasses} ${getVariant(clients)}`}>
        <p className="w-5 h-5 text-xl">
          <IoPeopleSharp />
        </p>
        <p>Clientes</p>
      </a>
      <a
        href="/dashboard"
        className={`${baseClasses} ${getVariant(dashboard)}`}
      >
        <p className="w-5 h-5 text-xl">
          <FaChartSimple />
        </p>
        <p>Relatórios</p>
      </a>
      <a href="/orders" className={`${baseClasses} ${getVariant(orders)}`}>
        <p className="w-5 h-5 text-xl">
          <FaClipboardCheck />
        </p>
        <p>Pedidos</p>
      </a>
    </div>
  );
}
