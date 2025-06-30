import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import GoBack from "../../components/GoBack";
import InputText from "../../components/InputText";
import Button from "../../components/Button";
import Modal from "../../components/Modal";
import api from "../../lib/api";
import { digitsOnly, isBlank } from "../../utils/validators";
import UserHeader from "../../components/UserHeader";
import { STATUS_OPTIONS, ClientStatus } from "../../utils/status";

export default function Register() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  // form state
  const [status, setStatus] = useState<ClientStatus>("ATIVO");
  const [name, setName] = useState("");
  const [documentNumber, setDocumentNumber] = useState("");
  const [repName, setRepName] = useState("");
  const [repPhone, setRepPhone] = useState("");
  const [repEmail, setRepEmail] = useState("");
  const [zip, setZip] = useState("");
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [complement, setComplement] = useState("");
  const [reference, setReference] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [neighbourhood, setNeighbourhood] = useState("");

  // validation: required fields + document (11 or 14) + zip (8)
  const isValid = () => {
    if (
      [name, repName, repPhone, repEmail, street, number, city, state].some(
        isBlank
      )
    ) {
      return false;
    }
    const len = digitsOnly(documentNumber).length;
    return (len === 11 || len === 14) && digitsOnly(zip).length === 8;
  };

  const submit = async () => {
    if (!isValid()) {
      setError("Preencha todos os campos obrigatórios corretamente.");
      return;
    }
    try {
      await api.post("/api/clients", {
        status,
        name,
        documentNumber: digitsOnly(documentNumber),
        representativeRequestDTO: {
          name: repName,
          phone: digitsOnly(repPhone),
          email: repEmail,
        },
        addressRequestDTO: {
          zipCode: digitsOnly(zip),
          street,
          number,
          complement,
          reference,
          city,
          state,
          neighbourhood,
        },
      });
      navigate("/clients");
    } catch (err: any) {
      const msg =
        typeof err?.response?.data === "string"
          ? err.response.data
          : err?.response?.data?.error || "Erro interno.";
      setError(msg);
    }
  };

  return (
    <section className="bg-[#f6f6f6] lg:flex justify-center items-start min-h-screen">
      <Modal isOpen={!!error} onClose={() => setError(null)} title="Erro">
        <p className="text-sm mb-4">{error}</p>
        <Button onClick={() => setError(null)}>OK</Button>
      </Modal>

      <div className="fixed bottom-0 w-full lg:pt-4 bg-[#282828] rounded-lg flex justify-center p-1 lg:w-35 lg:flex-col lg:justify-start lg:p-2 lg:top-15 lg:bottom-0 lg:rounded-none lg:left-0 z-10 border-gray-200 border-r-1">
        <Header clients="active" />
      </div>

      <UserHeader />

      <div className="w-full max-w-[1280px] flex gap-5 pt-25">
        <div className="flex flex-col gap-5 w-full p-4 pb-[100px] lg:pl-38 lg:pr-4">
          <GoBack link="/clients" />

          {/* Empresa */}
          <div className="p-5 rounded-lg bg-white flex flex-col gap-3">
            <p className="text-base font-medium">Empresa</p>

            {/* Status dropdown */}
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ClientStatus)}
              className="border rounded p-2"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            <InputText label="Nome" value={name} onValueChange={setName} />

            <InputText
              label="CPF/CNPJ"
              value={documentNumber}
              onValueChange={setDocumentNumber}
              placeholder="somente números"
            />
          </div>

          {/* Representante */}
          <div className="p-5 rounded-lg bg-white flex flex-col gap-3">
            <p className="text-base font-medium">Representante</p>
            <InputText
              label="Nome"
              value={repName}
              onValueChange={setRepName}
            />
            <InputText
              label="Telefone"
              value={repPhone}
              onValueChange={setRepPhone}
            />
            <InputText
              label="E-mail"
              value={repEmail}
              onValueChange={setRepEmail}
            />
          </div>

          {/* Endereço */}
          <div className="p-5 rounded-lg bg-white flex flex-col gap-3">
            <p className="text-base font-medium">Endereço</p>
            <InputText
              label="CEP"
              value={zip}
              onValueChange={setZip}
              placeholder="somente números"
            />
            <InputText label="Cidade" value={city} onValueChange={setCity} />
            <InputText label="Estado" value={state} onValueChange={setState} />
            <InputText
              label="Bairro"
              value={neighbourhood}
              onValueChange={setNeighbourhood}
            />
            <InputText
              label="Rua/Avenida"
              value={street}
              onValueChange={setStreet}
            />
            <InputText
              label="Número"
              value={number}
              onValueChange={setNumber}
            />
            <InputText
              label="Complemento"
              value={complement}
              onValueChange={setComplement}
            />
            <InputText
              label="Referência"
              value={reference}
              onValueChange={setReference}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <Button variant="outlined" onClick={() => navigate("/clients")}>
              Cancelar
            </Button>
            <Button onClick={submit}>Cadastrar</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
