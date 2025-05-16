import { ReactNode } from "react";
import Modal from "./Modal";
import Button from "./Button";

export interface DialogModalProps {
  isOpen: boolean;
  message?: string;
  onClose: () => void;
  title?: string;
  children?: ReactNode;
}

export default function DialogModal({
  isOpen,
  message,
  onClose,
  title,
  children,
}: DialogModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} {...(title ? { title } : {})}>
      {message && <p className="mb-4">{message}</p>}
      {children ?? <Button text="OK" onClick={onClose} className="w-full" />}
    </Modal>
  );
}
