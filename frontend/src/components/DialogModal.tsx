import Button from "./Button";

interface DialogModalProps {
  isOpen: boolean;
  message: string;
  onClose: () => void;
}

export default function DialogModal({
  isOpen,
  message,
  onClose,
}: DialogModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <p className="text-base mb-6">{message}</p>
        <div className="flex justify-end">
          <Button onClick={onClose}>Fechar</Button>
        </div>
      </div>
    </div>
  );
}
