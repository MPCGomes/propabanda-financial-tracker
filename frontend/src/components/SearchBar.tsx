import { IoSearchSharp } from "react-icons/io5";
import { useState, KeyboardEvent } from "react";

interface SearchBarProps {
  defaultValue?: string;
  onChange?: (value: string) => void;
  onSearch?: () => void;
}

export default function SearchBar({
  defaultValue = "",
  onChange,
  onSearch,
}: SearchBarProps) {
  const [value, setValue] = useState(defaultValue);

  const handleChange = (val: string) => {
    setValue(val);
    onChange?.(val);
  };

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") onSearch?.();
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        placeholder="Pesquisar"
        className="w-full pl-4 pr-10 py-2 border text-sm text-[#282828] border-gray-300 rounded-full focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={handleKey}
      />
      <button
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
        onClick={onSearch}
      >
        <IoSearchSharp />
      </button>
    </div>
  );
}
