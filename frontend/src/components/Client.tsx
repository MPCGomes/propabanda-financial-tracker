import { FaShop } from "react-icons/fa6";
import { IoIosArrowForward } from "react-icons/io";

type Client = {
  client: string;
  rep: string;
  link: string;
};

export default function Client({
  client,
  rep,
  link,
}: Client) {
  return (
    <a href={link} className="flex items-center justify-between">
      <div className="flex items-center gap-5">
        <p className="bg-[#ffa32233] text-[#FFA322] text-3xl w-12 h-12 flex items-center justify-center rounded-full">
          <FaShop />
        </p>
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
