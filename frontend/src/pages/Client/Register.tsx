import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import UserHeader from "../../components/UserHeader";
import Modal from "../../components/Modal";
import Button from "../../components/Button";
import GoBack from "../../components/GoBack";
import api from "../../lib/api";
import ClientForm, { ClientFormPayload } from "../../components/ClientForm";
import { useState } from "react";

export default function Register() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async (payload: ClientFormPayload) => {
    try {
      await api.post("/api/clients", payload);
      navigate("/clients");
    } catch {
      setError("Erro ao criar cliente.");
    }
  };

  return (
    <section className="bg-[#f6f6f6] lg:flex justify-center items-start min-h-screen">
      <Modal isOpen={!!error} onClose={() => setError(null)} title="Aviso">
        <p className="text-sm mb-4">{error}</p>
        <Button onClick={() => setError(null)}>OK</Button>
      </Modal>

      <div className="fixed bottom-0 w-full lg:pt-4 bg-[#282828] flex justify-center p-1 lg:w-35 lg:flex-col lg:justify-start lg:p-2 lg:top-15 lg:bottom-0 lg:left-0 z-10 border-gray-200 border-r-1">
        <Header clients="active" />
      </div>
      <UserHeader />

      <div className="w-full max-w-[1280px] flex gap-5 pt-25">
        <div className="flex flex-col gap-5 px-4 w-full pb-[100px] lg:pl-38 lg:pr-4">
          <GoBack link="/clients" />
          <ClientForm onSubmit={handleCreate} />
        </div>
      </div>
    </section>
  );
}
