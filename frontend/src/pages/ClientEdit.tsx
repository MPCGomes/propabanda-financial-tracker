import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import GoBack from "../components/GoBack";
import InputText from "../components/InputText";
import Button from "../components/Button";
import DialogModal from "../components/DialogModal";
import api from "../lib/api";

export default function ClientEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [cnpj, setCnpj] = useState("");
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
    api
      .get(`/api/clients/${id}`)
      .then(({ data }) => {
        setName(data.name);
        setCnpj(data.documentNumber);
        setRepName(data.representativeResponseDTO.name);
        setRepPhone(data.representativeResponseDTO.phone);
        setRepEmail(data.representativeResponseDTO.email);
        setZip(data.addressResponseDTO.zipCode);
        setStreet(data.addressResponseDTO.street);
        setNumber(data.addressResponseDTO.number);
        setComplement(data.addressResponseDTO.complement);
        setReference(data.addressResponseDTO.reference);
        setCity(data.addressResponseDTO.city);
        setState(data.addressResponseDTO.state);
        setNeighbourhood(data.addressResponseDTO.neighbourhood);
      })
      .catch(() => setErrorMsg("Cliente não encontrado."));
  }, [id]);

  const fetchCep = async (cep: string) => {
    try {
      const { data } = await api.get(`https://viacep.com.br/ws/${cep}/json/`);
      if (data.erro) throw new Error();
      setCity(data.localidade);
      setState(data.uf);
      setNeighbourhood(data.bairro);
      setStreet(data.logradouro);
    } catch {
      setErrorMsg("CEP inválido ou não encontrado.");
    }
  };

  const save = async () => {
    try {
      await api.put(`/api/clients/${id}`, {
        name,
        documentNumber: cnpj,
        representativeRequestDTO: {
          name: repName,
          phone: repPhone,
          email: repEmail,
        },
        addressRequestDTO: {
          zipCode: zip,
          street,
          number,
          complement,
          reference,
          city,
          state,
          neighbourhood,
        },
      });
      navigate(`/clients/${id}`);
    } catch {
      setErrorMsg("Erro ao salvar cliente.");
    }
  };

  return (
    <section className="bg-[#f6f6f6] lg:flex justify-center items-start min-h-screen lg:p-3">
      <DialogModal
        isOpen={!!errorMsg}
        message={errorMsg ?? ""}
        onClose={() => setErrorMsg(null)}
      />

      <div className="w-full max-w-[1280px] flex gap-5 pt-12 lg:pt-20">
        <div className="fixed bottom-0 w-full bg-white rounded-lg flex justify-center p-1 lg:w-35 lg:flex-col lg:justify-start lg:p-2 lg:top-23 lg:bottom-25 z-10">
          <Header clients="active" />
        </div>

        <div className="flex flex-col gap-5 w-full p-4 pb-[100px] lg:ml-40">
          <GoBack link={`/clients/${id}`} />

          {/* Company */}
          <div className="p-5 rounded-lg bg-white flex flex-col gap-3">
            <p className="text-base font-medium">Empresa</p>
            <InputText label="Nome" value={name} onValueChange={setName} />
            <InputText label="CNPJ" value={cnpj} onValueChange={setCnpj} />
          </div>

          {/* Representative */}
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

          {/* Address */}
          <div className="p-5 rounded-lg bg-white flex flex-col gap-3">
            <p className="text-base font-medium">Endereço</p>

            <InputText
              label="CEP"
              value={zip}
              onValueChange={(v) => {
                setZip(v);
                if (v.replace(/\D/g, "").length === 8) fetchCep(v);
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

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <Button
              variant="outlined"
              onClick={() => navigate(`/clients/${id}`)}
            >
              Cancelar
            </Button>
            <Button onClick={save}>Salvar</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
