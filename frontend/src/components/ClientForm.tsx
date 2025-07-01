import { useState, useEffect, FormEvent } from "react";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "./Button";
import { digitsOnly } from "../utils/validators";
import type { FullClientDTO } from "../hooks/useClient";
import { STATUS_OPTIONS, ClientStatus } from "../utils/status";

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

interface ClientFormProps {
  initial?: FullClientDTO;
  onSubmit: (payload: ClientFormPayload) => Promise<void>;
}

const BRAZIL_STATES = [
  "AC",
  "AL",
  "AM",
  "AP",
  "BA",
  "CE",
  "DF",
  "ES",
  "GO",
  "MA",
  "MG",
  "MS",
  "MT",
  "PA",
  "PB",
  "PE",
  "PI",
  "PR",
  "RJ",
  "RN",
  "RO",
  "RR",
  "RS",
  "SC",
  "SE",
  "SP",
  "TO",
];

export default function ClientForm({ initial, onSubmit }: ClientFormProps) {
  const [status, setStatus] = useState<ClientStatus>("ATIVO");
  const [name, setName] = useState("");
  const [documentNumber, setDocumentNumber] = useState("");
  const [repName, setRepName] = useState("");
  const [repPhone, setRepPhone] = useState("");
  const [repEmail, setRepEmail] = useState("");
  const [stateUf, setStateUf] = useState("");
  const [city, setCity] = useState("");
  const [neighbourhood, setNeighbourhood] = useState("");
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [complement, setComplement] = useState("");
  const [reference, setReference] = useState("");
  const [zip, setZip] = useState("");

  // hydrate from initial
  useEffect(() => {
    if (!initial) return;
    setStatus(initial.status);
    setName(initial.name);
    setDocumentNumber(initial.documentNumber);
    setRepName(initial.representativeResponseDTO.name);
    setRepPhone(initial.representativeResponseDTO.phone);
    setRepEmail(initial.representativeResponseDTO.email);
    setStateUf(initial.addressResponseDTO.state);
    setCity(initial.addressResponseDTO.city);
    setNeighbourhood(initial.addressResponseDTO.neighbourhood);
    setStreet(initial.addressResponseDTO.street);
    setNumber(initial.addressResponseDTO.number);
    setComplement(initial.addressResponseDTO.complement);
    setReference(initial.addressResponseDTO.reference);
    setZip(initial.addressResponseDTO.zipCode);
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
        state: stateUf,
        city,
        neighbourhood,
        street,
        number,
        complement,
        reference,
        zipCode: digitsOnly(zip),
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Cliente */}
      <div className="p-5 bg-white rounded-lg flex flex-col gap-3">
        <p className="text-base font-medium">Cliente</p>
        <TextField
          label="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex: Fulano de Tal"
          fullWidth
          required
        />
        <TextField
          label="CPF/CNPJ"
          value={documentNumber}
          onChange={(e) => setDocumentNumber(e.target.value)}
          placeholder="Ex: 12345678901"
          fullWidth
          required
        />
        <TextField
          label="Status"
          select
          value={status}
          onChange={(e) => setStatus(e.target.value as ClientStatus)}
          fullWidth
        >
          {STATUS_OPTIONS.map((o) => (
            <MenuItem key={o.value} value={o.value}>
              {o.label}
            </MenuItem>
          ))}
        </TextField>
      </div>

      {/* Representante */}
      <div className="p-5 bg-white rounded-lg flex flex-col gap-3">
        <p className="text-base font-medium">Representante</p>
        <TextField
          label="Nome"
          value={repName}
          onChange={(e) => setRepName(e.target.value)}
          placeholder="Ex: Ciclano de Tal"
          fullWidth
          required
        />
        <TextField
          label="Telefone"
          value={repPhone}
          onChange={(e) => setRepPhone(e.target.value)}
          placeholder="Ex: 12345678901"
          fullWidth
          required
        />
        <TextField
          label="E-mail"
          value={repEmail}
          onChange={(e) => setRepEmail(e.target.value)}
          placeholder="Ex: email@email.com"
          fullWidth
          required
        />
      </div>

      {/* Endereço */}
      <div className="p-5 bg-white rounded-lg flex flex-col gap-3">
        <p className="text-base font-medium">Endereço</p>
        <TextField
          label="Estado (UF)"
          select
          value={stateUf}
          onChange={(e) => setStateUf(e.target.value)}
          fullWidth
          required
          SelectProps={{
            MenuProps: {
              PaperProps: {
                style: {
                  maxHeight: 300,
                  width: 200,
                },
              },
            },
          }}
        >
          {BRAZIL_STATES.map((uf) => (
            <MenuItem key={uf} value={uf}>
              {uf}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Cidade"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Ex: Caraguatatuba"
          fullWidth
          required
        />
        <TextField
          label="Bairro"
          value={neighbourhood}
          onChange={(e) => setNeighbourhood(e.target.value)}
          placeholder="Ex: Centro"
          fullWidth
          required
        />
        <TextField
          label="Rua/Avenida"
          value={street}
          onChange={(e) => setStreet(e.target.value)}
          placeholder="Ex: Av. Avenida"
          fullWidth
          required
        />
        <TextField
          label="Número"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          placeholder="Ex: 123"
          fullWidth
          required
        />
        <TextField
          label="Complemento"
          value={complement}
          onChange={(e) => setComplement(e.target.value)}
          placeholder="Ex: Casa"
          fullWidth
        />
        <TextField
          label="Referência"
          value={reference}
          onChange={(e) => setReference(e.target.value)}
          placeholder="Ex: Próximo à praça"
          fullWidth
        />
        <TextField
          label="CEP"
          value={zip}
          onChange={(e) => setZip(e.target.value)}
          placeholder="Ex: 12345678"
          fullWidth
          required
        />
      </div>

      {/* Ações */}
      <div className="flex justify-end gap-3">
        <Button variant="outlined" onClick={() => history.back()}>
          Cancelar
        </Button>
        <Button type="submit">Salvar</Button>
      </div>
    </form>
  );
}
