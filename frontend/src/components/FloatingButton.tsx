import { ReactNode } from "react";

type FloatingButtonProps = {
  children: ReactNode;
  background: string;
  onClick?: () => void;
};

export default function FloatingButton({
  children,
  background,
  onClick,
}: FloatingButtonProps) {
  return (
    <button
      style={{ background }}
      onClick={onClick}
      className=" px-3 py-2 text-sm text-white flex items-center justify-center rounded-full cursor-pointer gap-2"
    >
      {children}
    </button>
  );
}
