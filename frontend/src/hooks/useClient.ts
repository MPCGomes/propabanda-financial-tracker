import { useState, useEffect } from "react";
import api from "../lib/api";
import { ClientStatus } from "../utils/status";

export type FullClientDTO = {
  id: number;
  name: string;
  documentNumber: string;
  status: ClientStatus;
  representativeResponseDTO: {
    name: string;
    email: string;
    phone: string;
  };
  addressResponseDTO: {
    zipCode: string;
    street: string;
    number: string;
    complement: string;
    reference: string;
    city: string;
    state: string;
    neighbourhood: string;
  };
};

export default function useClient(id?: string) {
  const [client, setClient] = useState<FullClientDTO | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    api
      .get<FullClientDTO>(`/api/clients/${id}`)
      .then(({ data }) => setClient(data))
      .catch(() => setError("Cliente não encontrado."));
  }, [id]);

  return { client, error, setError };
}
