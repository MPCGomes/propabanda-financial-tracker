type ButtonProps = {
  text: string;
  variant?: "filled" | "outlined";
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>; // <- isso permite passar onClick, type, etc.

export default function Button({
  text,
  variant = "filled",
  className = "",
  ...props
}: ButtonProps) {
  const baseClasses =
    "text-base px-8 py-2 rounded-full cursor-pointer font-semibold transition-all";

  const variants = {
    filled: "bg-[#FFA322] text-white",
    outlined: "bg-transparent border border-[#FFA322] text-[#FFA322]",
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${className}`}
      {...props}
    >
      {text}
    </button>
  );
}
