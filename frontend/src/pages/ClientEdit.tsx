import Button from "../components/Button";
import GoBack from "../components/GoBack";
import Header from "../components/Header";
import InputText from "../components/InputText";

type ClientEditProps = {
  title: string;
};

export default function ClientEdit({ title }: ClientEditProps) {
  return (
    <section className="bg-[#f6f6f6] lg:flex justify-center items-center min-h-screen lg:p-3 lg:items-start">
      <div className="w-full max-w-[1280px] flex lg:flex-row gap-5 pt-12 lg:pt-20 lg:pb-22">
        {/* Header */}
        <div
          className="fixed bottom-0 w-full bg-white rounded-lg 
                flex justify-center p-1
                lg:w-35 lg:flex lg:flex-col lg:justify-start lg:p-2 lg:top-23 lg:bottom-25 z-10"
        >
          <Header clients="active" />
        </div>

        {/* Content */}
        <div className="flex flex-col gap-5 w-full p-4 pb-[100px] lg:p-0 lg:pb-0 lg:ml-40">
          {/* Adicionar o ID do cliente */}
          <GoBack link={"/clients"} />
          <div className="flex flex-col p-5 gap-5 rounded-lg bg-white text-[#282828]">
            <p className="text-base font-medium">Cadastar Cliente</p>
            <div className="flex flex-col gap-5">
              <p className="text-sm font-medium">Empresa</p>
              <div className="flex flex-col gap-3">
                <InputText label={"Nome"} placeholder={"Nome da empresa"} />
                <InputText label={"CNPJ"} placeholder={"CNPJ"} />
              </div>
            </div>
          </div>
          <div className="flex flex-col p-5 gap-5 rounded-lg bg-white text-[#282828]">
            <p className="text-sm font-medium">Representante</p>
            <div className="flex flex-col gap-3">
              <InputText label={"Nome"} placeholder={"Nome do representante"} />
              <InputText
                label={"Telefone"}
                placeholder={"Telefone do representante"}
              />
              <InputText
                label={"E-mail"}
                placeholder={"E-mail do representante"}
              />
            </div>
          </div>
          <div className="flex flex-col p-5 gap-5 rounded-lg bg-white text-[#282828]">
            <p className="text-sm font-medium">Endereço</p>
            <div className="flex flex-col gap-3">
              <InputText label={"CEP"} placeholder={"CEP"} />
              <div className="flex gap-3">
                <InputText label={"CNPJ"} placeholder={"CNPJ"} />
                <InputText label={"CNPJ"} placeholder={"CNPJ"} />
              </div>
              <InputText label={"Rua/Avenida"} placeholder={"Rua/Avenida"} />
              <div className="flex gap-3">
                <InputText label={"Número"} placeholder={"Número"} />
                <InputText label={"Complemento"} placeholder={"Complemento"} />
              </div>
              <InputText label={"Referência"} placeholder={"Referência"} />
            </div>

            {/* Botões */}
            <div className="flex gap-3 w-full justify-center lg:justify-end">
              <Button
                text="Cancelar"
                variant="outlined"
                className="w-full lg:w-auto"
              />
              <Button text="Salvar" className="w-full lg:w-auto" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
