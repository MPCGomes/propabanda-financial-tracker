import { FaShop } from "react-icons/fa6";
import { IoIosArrowForward } from "react-icons/io";
import type { ClientStatus } from "../utils/status";

type ClientProps = {
  client: string;
  rep: string;
  link: string;
  status: ClientStatus;
};

export default function Client({ client, rep, link, status }: ClientProps) {
  const isActive = status === "ATIVO";
  const bgColor = isActive ? "#FFA32233" : "#78787833";
  const fgColor = isActive ? "#FFA322" : "#787878";

  return (
    <a
      href={link}
      className="flex items-center justify-between hover:bg-[#fafafa] p-3 duration-300 rounded-lg"
    >
      <div className="flex items-center gap-5">
        <div
          className="text-3xl w-12 h-12 flex items-center justify-center rounded-full"
          style={{ background: bgColor, color: fgColor }}
        >
          <FaShop />
        </div>
        <div>
          <p className="text-base text-[#282828] font-medium">{client}</p>
          <p className="text-xs text-[#787878]">{rep}</p>
        </div>
      </div>
      <p className="text-base text-[#282828]">
        <IoIosArrowForward />
      </p>
    </a>
  );
}
