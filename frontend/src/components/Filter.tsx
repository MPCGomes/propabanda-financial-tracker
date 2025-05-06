import { MdKeyboardArrowDown } from "react-icons/md";

type Filter = {
  text: string;
  variant?: "default" | "filtered";
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Filter({
  text,
  variant = "default",
  className = "",
  ...props
}: Filter) {
  const baseClasses =
    "text-base px-4 py-2 rounded-full cursor-pointer flex items-center gap-3";

  const variants = {
    default: "bg-[#d9d9d9] text-white",
    filtered: "bg-[#ffa32233] text-[#FFA322]",
  };
  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${className}`}
      {...props}
    >
      {text}
      <MdKeyboardArrowDown className="text-2xl" />
    </button>
  );
}
