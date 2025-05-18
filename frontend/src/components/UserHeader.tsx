import { useNavigate } from "react-router-dom";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { MdLogout } from "react-icons/md";
import { useShowValues } from "../contexts/ShowValuesContext";

type Props = { user?: string | null };

export default function UserHeader({ user }: Props) {
  const { show, toggle } = useShowValues();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  return (
    <div className="flex justify-between items-center bg-white rounded-lg p-3">
      <p className="text-[#282828] text-sm">
        Olá, <span className="text-base font-bold">{user ?? "usuário"}!</span>
      </p>

      <div className="flex gap-4">
        {/* hide/show values */}
        <button
          onClick={toggle}
          className="text-[#ffa322] w-8 h-8 bg-[#ffa32233] text-xl flex items-center justify-center rounded-full"
          title={show ? "Ocultar valores" : "Mostrar valores"}
        >
          {show ? <FaRegEye /> : <FaRegEyeSlash />}
        </button>

        {/* logout */}
        <button
          onClick={handleLogout}
          className="text-[#ffa322] w-8 h-8 bg-[#ffa32233] text-xl flex items-center justify-center rounded-full"
          title="Sair"
        >
          <MdLogout />
        </button>
      </div>
    </div>
  );
}
