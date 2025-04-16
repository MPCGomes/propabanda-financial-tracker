import { IoSearchSharp } from "react-icons/io5";

export default function SearchBar() {
  return (
    <div className="relative w-full">
      <input
        type="text"
        placeholder="Pesquisar"
        className="w-full pl-4 pr-10 py-2 border text-sm text-[#282828] border-gray-300 rounded-full focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
      />
      <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer">
        <IoSearchSharp />
      </button>
    </div>
  );
}
