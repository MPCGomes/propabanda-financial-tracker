import Modal from "./Modal";
import { ReactNode } from "react";

export default function ConfirmModal({
  isOpen,
  title,
  children,
  onCancel,
  onConfirm,
}: {
  isOpen: boolean;
  title: string;
  children: ReactNode;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <Modal isOpen={isOpen} onClose={onCancel} title={title}>
      {children}
      <div className="flex gap-3 mt-4">
        <button
          className="flex-1 py-2 rounded-full bg-gray-100 text-[#282828]"
          onClick={onCancel}
        >
          Cancelar
        </button>
        <button
          className="flex-1 py-2 rounded-full bg-[#EE3A4B] text-white"
          onClick={onConfirm}
        >
          Excluir
        </button>
      </div>
    </Modal>
  );
}
