import { FaArrowLeft } from "react-icons/fa6";

type GoBack = {
    link: string;
  };
  
  export default function GoBack({ link }: GoBack) {
    return (
      <a href={link} className="flex gap-2 text-[#282828] items-center text-base font-medium">
        <p><FaArrowLeft /></p>
        <p>Voltar</p>
      </a>
    );
  }
  