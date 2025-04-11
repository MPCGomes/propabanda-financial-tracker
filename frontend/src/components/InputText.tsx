type PlaceholderComponent = {
  label: string;
  placeholder: string;
};

export default function PlaceholderComponent({
  label,
  placeholder,
}: PlaceholderComponent) {
  return (
    <div className="relative w-full">
      <input
        type="text"
        id="meuInput"
        placeholder={placeholder}
        className="peer w-full border border-gray-300 rounded-md p-2 pt-5 text-sm placeholder-transparent focus:outline-none focus:border-blue-500"
      />
      <label
        htmlFor="meuInput"
        className="absolute left-2 top-2 text-gray-500 text-xs transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-xs peer-focus:text-blue-500"
      >
        {label}
      </label>
    </div>
  );
}
