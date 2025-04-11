type InputText = {
  label: string;
  placeholder: string;
};

export default function InputText({ label, placeholder }: InputText) {
  return (
    <div className="relative w-full">
      <input
        type="text"
        id="meuInput"
        placeholder={placeholder}
        className="peer w-full border tex-base border-gray-300 rounded-md p-2 pt-7 text-sm focus:outline-none focus:border-blue-500 text-[#282828]"
      />
      <label
        htmlFor="meuInput"
        className="absolute left-2 top-2 text-[#282828] text-xs transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-sm peer-placeholder-shown:text-[#282828] peer-focus:top-2 peer-focus:text-xs peer-focus:text-blue-500"
      >
        {label}
      </label>
    </div>
  );
}
