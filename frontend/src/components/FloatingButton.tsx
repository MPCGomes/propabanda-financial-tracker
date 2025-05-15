type FloatingButtonProps = {
  icon: React.ReactNode;
  background: string;
  onClick?: () => void;
};

export default function FloatingButton({
  icon,
  background,
  onClick,
}: FloatingButtonProps) {
  return (
    <button
      style={{ background }}
      onClick={onClick}
      className="w-10 h-10 text-xl text-white flex items-center justify-center rounded-full cursor-pointer"
    >
      {icon}
    </button>
  );
}
