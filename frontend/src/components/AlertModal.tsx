import Button from "./Button";
import Modal from "./Modal";
import { ReactNode } from "react";

export default function AlertModal({
  isOpen,
  title,
  children,
  onClose,
}: {
  isOpen: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      {children}
      <div className="text-center mt-4">
        <Button onClick={onClose}>OK</Button>
      </div>
    </Modal>
  );
}
