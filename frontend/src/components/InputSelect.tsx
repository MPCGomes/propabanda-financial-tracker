import { MdKeyboardArrowDown } from "react-icons/md";

type Option = {
  value: string;
  label: string;
};

type SelectInputProps = {
  label: string;
  id: string;
  options: Option[];
};

export default function SelectInput({ label, id, options }: SelectInputProps) {
  return (
    <div className="relative w-full">
      <select
        id={id}
        defaultValue=""
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
      <MdKeyboardArrowDown className="pointer-events-none absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl" />
    </div>
  );
}
