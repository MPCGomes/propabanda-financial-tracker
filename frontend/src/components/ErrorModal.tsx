import Modal from "./Modal";
import Button from "./Button";

export default function ErrorModal({
  error,
  onClose,
}: {
  error: string | null;
  onClose: () => void;
}) {
  return (
    <Modal isOpen={!!error} onClose={onClose} title="Erro">
      <p className="text-sm text-[#282828]">{error}</p>
      <div className="text-center mt-4">
        <Button onClick={onClose}>Fechar</Button>
      </div>
    </Modal>
  );
}
