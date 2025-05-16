import { ReactNode } from "react";
import { IoClose } from "react-icons/io5";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
};

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-[#00000028] bg-opacity-50 flex items-end lg:items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-t-2xl lg:rounded-xl shadow-lg w-full lg:max-w-md lg:mb-0"
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-base font-medium text-[#282828]">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-[#282828] text-xl cursor-pointer"
            >
              <IoClose />
            </button>
          </div>
        )}

        <div className="flex flex-col gap-5">{children}</div>
      </div>
    </div>
  );
}
