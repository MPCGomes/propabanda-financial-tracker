import Button from "../components/Button";
import Header from "../components/Header";

type ClientRegisterProps = {
  title: string;
};

export default function ClientRegister({ title }: ClientRegisterProps) {
  return (
    <section className="bg-[#f6f6f6] lg:flex justify-center items-center min-h-screen lg:p-3">
      <div className="w-full max-w-[1280px] flex lg:flex-row gap-5">
        {/* Header */}
        <div
          className="fixed bottom-0 w-full bg-white rounded-lg 
            flex justify-center p-1
            lg:static lg:w-40 lg:flex lg:flex-col lg:justify-start lg:p-2"
        >
          <Header clients="active" />
        </div>

        {/* Content */}
        <div className="flex flex-col gap-5 w-full p-4 pb-[100px] lg:p-0 lg:pb-0">
          <div className="flex flex-col p-5 gap-5 rounded-lg bg-white text-[#282828]">
            <p className="text-base font-medium">Cadastar Cliente</p>
            <div className="flex flex-col gap-5">
              <p className="text-sm font-medium">Empresa</p>
              <div className="flex flex-col gap-3">
                <input type="text" placeholder="Placeholder..." />
                <input type="text" placeholder="Placeholder..." />
              </div>
            </div>
          </div>
          <div className="flex flex-col p-5 gap-5 rounded-lg bg-white text-[#282828]">
            <p className="text-sm font-medium">Representante</p>
            <div className="flex flex-col gap-3">
              <input type="text" placeholder="Placeholder..." />
              <input type="text" placeholder="Placeholder..." />
              <input type="text" placeholder="Placeholder..." />
            </div>
          </div>
          <div className="flex flex-col p-5 gap-5 rounded-lg bg-white text-[#282828]">
            <p className="text-sm font-medium">Endereço</p>
            <div className="flex flex-col gap-3">
              <input type="text" placeholder="Placeholder..." />
              <div className="flex gap-3">
                <input type="text" placeholder="Placeholder..." />
                <input type="text" placeholder="Placeholder..." />
              </div>
              <input type="text" placeholder="Placeholder..." />
              <div className="flex gap-3">
                <input type="text" placeholder="Placeholder..." />
                <input type="text" placeholder="Placeholder..." />
              </div>
              <input type="text" placeholder="Placeholder..." />
            </div>

            {/* Botões */}
            <div className="flex gap-3 w-full justify-center lg:justify-end">
              <Button
                text="Cancelar"
                variant="outlined"
                className="w-full lg:w-auto"
              />
              <Button text="Cadastrar" className="w-full lg:w-auto" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
