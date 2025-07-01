import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/Header";
import UserHeader from "../../components/UserHeader";
import Modal from "../../components/Modal";
import Button from "../../components/Button";
import GoBack from "../../components/GoBack";
import api from "../../lib/api";
import useClient from "../../hooks/useClient";
import ClientForm, { ClientFormPayload } from "../../components/ClientForm";
import { useState } from "react";

export default function Edit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { client, error, setError } = useClient(id);
  const [savingError, setSavingError] = useState<string | null>(null);

  const handleUpdate = async (payload: ClientFormPayload) => {
    try {
      await api.put(`/api/clients/${id}`, payload);
      navigate(`/clients/${id}`);
    } catch {
      setSavingError("Erro ao salvar cliente.");
    }
  };

  if (!client) return null;

  return (
    <section className="bg-[#f6f6f6] lg:flex justify-center items-start min-h-screen">
      <Modal
        isOpen={!!error || !!savingError}
        onClose={() => {
          setError(null);
          setSavingError(null);
        }}
        title="Aviso"
      >
        <p className="text-sm mb-4">{error || savingError}</p>
        <Button
          onClick={() => {
            setError(null);
            setSavingError(null);
          }}
        >
          OK
        </Button>
      </Modal>

      <div className="fixed bottom-0 w-full lg:pt-4 bg-[#282828] flex justify-center p-1 lg:w-35 lg:flex-col lg:justify-start lg:p-2 lg:top-15 lg:bottom-0 lg:left-0 z-10 border-gray-200 border-r-1">
        <Header clients="active" />
      </div>
      <UserHeader />

      <div className="w-full max-w-[1280px] flex gap-5 pt-25">
        <div className="flex flex-col gap-5 px-4 w-full pb-[100px] lg:pl-38 lg:pr-4">
          <GoBack link={`/clients/${id}`} />
          <ClientForm initial={client} onSubmit={handleUpdate} />
        </div>
      </div>
    </section>
  );
}
