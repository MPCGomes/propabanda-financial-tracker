import Button from "../components/Button";
import PlaceholderBox from "../components/PlaceholderComponent";

type Login = {
  title: string;
};

export default function Login({ title }: Login) {
  return (
    <section className="bg-[#ffa322] h-screen flex items-center justify-center px-5">
      <div className="bg-white flex flex-col items-center p-10 rounded-lg gap-12 max-w-sm w-full">
        <p className="text-[#282828] font-medium text-xl">Entrar</p>
        <div className="flex flex-col w-full gap-3">
          <input
            type="text"
            placeholder="Digite seu CPF"
            className="border border-gray-500 rounded-lg p-4 text-[#282828]"
          />
          <input
            type="password"
            placeholder="Digite sua Senha"
            className="border border-gray-500 rounded-lg p-4 text-[#282828]"
          />
        </div>
        <div className="flex flex-col gap-3 w-full">
          <Button text="Enviar" />
          <a
            href=""
            className="text-xs font-semibold text-[#ffa322] text-center"
          >
            Esqueci minha senha
          </a>
        </div>
      </div>
    </section>
  );
}
