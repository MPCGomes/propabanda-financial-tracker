import { FaRegEye, FaDownload, FaUpload, FaTrash } from "react-icons/fa";
import SectionCard from "./SectionCard";

type Props = {
  contractFile: File | null;
  existingPath: string | null;
  previewUrl: string | null;
  onFileChange: (file: File) => void;
  onPreview: () => Promise<void>;
  onDownload: () => Promise<void>;
  onSave: () => Promise<void>;
  onCancel?: () => void;
  onDelete?: () => Promise<void>;
};

export default function ContractSection({
  contractFile,
  existingPath,
  previewUrl,
  onFileChange,
  onPreview,
  onDownload,
  onSave,
  onCancel,
  onDelete,
}: Props) {
  return (
    <SectionCard title="Contrato">
      <div className="flex justify-between items-center">
        <p className="text-sm text-[#787878]">
          {existingPath ? "Arquivo disponível" : "Nenhum contrato enviado"}
        </p>
        {existingPath && (
          <div className="flex gap-3">
            <button
              type="button"
              className="w-9 h-9 bg-[#ffa32233] rounded-full flex items-center justify-center text-[#ffa322]"
              onClick={onPreview}
            >
              <FaRegEye />
            </button>
            <button
              type="button"
              className="w-9 h-9 bg-[#32c05833] rounded-full flex items-center justify-center text-[#32c058]"
              onClick={onDownload}
            >
              <FaDownload />
            </button>
            {onDelete && (
              <button
                type="button"
                className="w-9 h-9 bg-[#EE3A4B33] rounded-full flex items-center justify-center text-[#EE3A4B]"
                onClick={onDelete}
              >
                <FaTrash />
              </button>
            )}
          </div>
        )}
      </div>

      {previewUrl && (
        <iframe
          src={previewUrl}
          title="Contrato"
          className="w-full h-[80vh] rounded border mt-4"
        />
      )}

      <label className="flex flex-col items-center gap-2 p-8 border-dashed border border-[#28282833] rounded-lg bg-[#fafafa] cursor-pointer">
        <p className="text-2xl">
          <FaUpload />
        </p>
        <p className="text-base">
          {contractFile ? contractFile.name : "Clique para carregar"}
        </p>
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          className="hidden"
          onChange={(e) => e.target.files && onFileChange(e.target.files[0])}
        />
      </label>
    </SectionCard>
  );
}
