import { MdKeyboardArrowDown } from "react-icons/md";

export type Option = { value: string | number; label: string };

type SelectInputProps = {
  label: string;
  id: string;
  options: Option[];
  value?: string | number;
  onChange?: (value: string | number) => void;
};

export default function InputSelect({
  label,
  id,
  options,
  value,
  onChange,
}: SelectInputProps) {
  return (
    <div className="relative w-full">
      <select
        id={id}
        value={value !== undefined ? value : ""}
        onChange={(e) => onChange?.(e.target.value)}
        className="peer w-full border border-gray-300 rounded-md p-2 pt-7 pr-8 text-sm text-gray-700 bg-white appearance-none focus:outline-none focus:border-blue-500"
      >
        <option value="" disabled hidden></option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <label
        htmlFor={id}
        className="absolute left-2 top-2 text-[#282828] text-xs transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-xs peer-placeholder-shown:text-[#282828] peer-focus:top-2 peer-focus:text-xs peer-focus:text-blue-500"
      >
        {label}
      </label>
      <MdKeyboardArrowDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 text-xl" />
    </div>
  );
}
