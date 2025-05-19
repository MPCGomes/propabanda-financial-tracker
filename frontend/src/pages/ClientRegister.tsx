import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import GoBack from "../components/GoBack";
import InputText from "../components/InputText";
import Button from "../components/Button";
import DialogModal from "../components/DialogModal";
import api from "../lib/api";

/* -------------------------------------------------- */
/* helpers */
const digitsOnly = (t: string) => t.replace(/\D/g, "");
const isBlank = (t: string) => !t.trim();

/* -------------------------------------------------- */
export default function ClientRegister() {
  const navigate = useNavigate();

  /* ---------- estado ---------- */
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  /* empresa */
  const [name, setName] = useState("");
  const [cnpj, setCnpj] = useState("");

  /* representante */
  const [repName, setRepName] = useState("");
  const [repPhone, setRepPhone] = useState("");
  const [repEmail, setRepEmail] = useState("");

  /* endereço */
  const [zip, setZip] = useState("");
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [complement, setComplement] = useState("");
  const [reference, setReference] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [neighbourhood, setNeighbourhood] = useState("");

  /* ---------- CEP ---------- */
  const fetchCep = async (cepRaw: string) => {
    const cep = digitsOnly(cepRaw);
    if (cep.length !== 8) return;

    try {
      const { data } = await api.get(`https://viacep.com.br/ws/${cep}/json/`);
      if (data.erro) throw new Error();
      setCity(data.localidade);
      setState(data.uf);
      setNeighbourhood(data.bairro);
      setStreet(data.logradouro);
    } catch {
      setErrorMessage("CEP inválido ou não encontrado.");
    }
  };

  /* ---------- validação simples ---------- */
  const isValid = () => {
    if (
      [name, repName, repPhone, repEmail, street, number, city, state].some(
        isBlank
      )
    )
      return false;
    const cnpjDigits = digitsOnly(cnpj);
    const cepDigits = digitsOnly(zip);
    return cnpjDigits.length === 14 && cepDigits.length === 8;
  };

  /* ---------- submit ---------- */
  const submit = async () => {
    if (!isValid()) {
      setErrorMessage("Preencha todos os campos obrigatórios corretamente.");
      return;
    }

    try {
      await api.post("/api/clients", {
        name,
        documentNumber: digitsOnly(cnpj),
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
      setErrorMessage(msg);
    }
  };

  /* ---------- componente ---------- */
  return (
    <section className="bg-[#f6f6f6] lg:flex justify-center items-start min-h-screen lg:p-3">
      {/* modal erro */}
      <DialogModal
        isOpen={!!errorMessage}
        message={errorMessage ?? ""}
        onClose={() => setErrorMessage(null)}
      />

      <div className="w-full max-w-[1280px] flex gap-5 pt-12 lg:pt-20">
        {/* menu lateral */}
        <div className="fixed bottom-0 w-full bg-white rounded-lg flex justify-center p-1 lg:w-35 lg:flex-col lg:justify-start lg:p-2 lg:top-23 lg:bottom-25 z-10">
          <Header clients="active" />
        </div>

        {/* conteúdo */}
        <div className="flex flex-col gap-5 w-full p-4 pb-[100px] lg:ml-40">
          <GoBack link="/clients" />

          {/* empresa */}
          <div className="p-5 rounded-lg bg-white flex flex-col gap-3">
            <p className="text-base font-medium">Empresa</p>
            <InputText label="Nome" value={name} onValueChange={setName} />
            <InputText
              label="CNPJ"
              value={cnpj}
              onValueChange={setCnpj}
              placeholder="somente números"
            />
          </div>

          {/* representante */}
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

          {/* endereço */}
          <div className="p-5 rounded-lg bg-white flex flex-col gap-3">
            <p className="text-base font-medium">Endereço</p>

            <InputText
              label="CEP"
              value={zip}
              onValueChange={(v) => {
                setZip(v);
                fetchCep(v);
              }}
            />

            <InputText label="Cidade" value={city} readOnly />
            <InputText label="Estado" value={state} readOnly />
            <InputText label="Bairro" value={neighbourhood} readOnly />

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

          {/* ações */}
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
