import { useState } from "react";
import api from "../lib/api";

export default function useFetchCep() {
  const [address, setAddress] = useState({
    city: "",
    state: "",
    neighbourhood: "",
    street: "",
  });
  const [error, setError] = useState<string | null>(null);

  const fetchCep = async (cepRaw: string) => {
    const cep = cepRaw.replace(/\D/g, "");
    if (cep.length !== 8) return;
    try {
      const { data } = await api.get(`https://viacep.com.br/ws/${cep}/json/`);
      if (data.erro) throw new Error();
      setAddress({
        city: data.localidade,
        state: data.uf,
        neighbourhood: data.bairro,
        street: data.logradouro,
      });
    } catch {
      setError("CEP inválido ou não encontrado.");
    }
  };

  return { address, error, fetchCep, setError };
}
