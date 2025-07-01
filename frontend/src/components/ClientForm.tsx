import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import InputText from "./InputText";
import Button from "./Button";
import { digitsOnly } from "../utils/validators";
import { STATUS_OPTIONS, ClientStatus } from "../utils/status";
import type { FullClientDTO } from "../hooks/useClient";

type ClientFormProps = {
  initial?: FullClientDTO;
  onSubmit: (payload: {
    status: ClientStatus;
    name: string;
    documentNumber: string;
    representativeRequestDTO: {
      name: string;
      phone: string;
      email: string;
    };
    addressRequestDTO: {
      zipCode: string;
      street: string;
      number: string;
      complement: string;
      reference: string;
      city: string;
      state: string;
      neighbourhood: string;
    };
  }) => Promise<void>;
};

export type ClientFormPayload = {
  status: ClientStatus;
  name: string;
  documentNumber: string;
  representativeRequestDTO: {
    name: string;
    phone: string;
    email: string;
  };
  addressRequestDTO: {
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

export default function ClientForm({ initial, onSubmit }: ClientFormProps) {
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

  useEffect(() => {
    if (!initial) return;
    setStatus(initial.status);
    setName(initial.name);
    setDocumentNumber(initial.documentNumber);
    setRepName(initial.representativeResponseDTO.name);
    setRepPhone(initial.representativeResponseDTO.phone);
    setRepEmail(initial.representativeResponseDTO.email);
    setZip(initial.addressResponseDTO.zipCode);
    setStreet(initial.addressResponseDTO.street);
    setNumber(initial.addressResponseDTO.number);
    setComplement(initial.addressResponseDTO.complement);
    setReference(initial.addressResponseDTO.reference);
    setCity(initial.addressResponseDTO.city);
    setState(initial.addressResponseDTO.state);
    setNeighbourhood(initial.addressResponseDTO.neighbourhood);
  }, [initial]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    return onSubmit({
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
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* client */}
      <fieldset className="p-5 bg-white rounded-lg flex flex-col gap-3">
        <legend className="text-base font-medium">Cliente</legend>
        <InputText
          label="Nome"
          value={name}
          onValueChange={setName}
          placeholder="Ex: Fulano de Tal"
        />
        <InputText
          label="CPF/CNPJ"
          value={documentNumber}
          onValueChange={setDocumentNumber}
          placeholder="Ex: 12345678901"
        />
        <label className="flex flex-col">
          Status
          <select
            value={status}
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              setStatus(e.target.value as ClientStatus)
            }
            className="border rounded p-2"
          >
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
      </fieldset>

      {/* representative */}
      <fieldset className="p-5 bg-white rounded-lg flex flex-col gap-3">
        <legend className="text-base font-medium">Representante</legend>
        <InputText
          label="Nome"
          value={repName}
          onValueChange={setRepName}
          placeholder="Ex: Ciclano de Tal"
        />
        <InputText
          label="Telefone"
          value={repPhone}
          onValueChange={setRepPhone}
          placeholder="Ex: 12345678901"
        />
        <InputText
          label="E-mail"
          value={repEmail}
          onValueChange={setRepEmail}
          placeholder="Ex: email@email.com"
        />
      </fieldset>

      {/* address */}
      <fieldset className="p-5 bg-white rounded-lg flex flex-col gap-3">
        <legend className="text-base font-medium">Endereço</legend>
        <InputText
          label="CEP"
          value={zip}
          onValueChange={setZip}
          placeholder="Ex: 12345678"
        />
        <InputText
          label="Cidade"
          value={city}
          onValueChange={setCity}
          placeholder="Ex: Caraguatatuba"
        />
        <InputText
          label="Estado"
          value={state}
          onValueChange={setState}
          placeholder="Ex: SP"
        />
        <InputText
          label="Bairro"
          value={neighbourhood}
          onValueChange={setNeighbourhood}
          placeholder="Ex: Centro"
        />
        <InputText
          label="Rua/Avenida"
          value={street}
          onValueChange={setStreet}
          placeholder="Ex: Av. Avenida"
        />
        <InputText
          label="Número"
          value={number}
          onValueChange={setNumber}
          placeholder="Ex: 123"
        />
        <InputText
          label="Complemento"
          value={complement}
          onValueChange={setComplement}
          placeholder="Ex: Casa"
        />
        <InputText
          label="Referência"
          value={reference}
          onValueChange={setReference}
          placeholder="Ex: Próximo a praça"
        />
      </fieldset>

      <div className="flex justify-end gap-3">
        <Button variant="outlined" onClick={() => history.back()}>
          Cancelar
        </Button>
        <Button type="submit">Salvar</Button>
      </div>
    </form>
  );
}
