import { FaPlus } from "react-icons/fa6";

export default function FloatingButton() {
  return (
    <button className="w-10 h-10 text-xl text-white bg-[#FFA322] flex items-center justify-center rounded-full cursor-pointer absolute bottom-5 right-5">
      <FaPlus />
    </button>
  );
}
