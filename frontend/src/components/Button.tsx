type ButtonProps = {
  text: string;
  icon?: React.ReactNode;
  variant?: "filled" | "outlined";
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({
  text,
  icon,
  variant = "filled",
  className = "",
  ...props
}: ButtonProps) {
  const baseClasses =
    "text-base px-4 py-2 rounded-full cursor-pointer font-semibold transition-all";

  const variants = {
    filled: "bg-[#FFA322] text-white",
    outlined: "bg-transparent border border-[#FFA322] text-[#FFA322]",
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${className} flex items-center gap-2`}
      {...props}
    >
      {icon}
      {text}
    </button>
  );
}
