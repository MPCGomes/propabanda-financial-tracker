import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { MdLogout } from "react-icons/md";
import { useShowValues } from "../contexts/ShowValuesContext";
import { logout, getToken } from "../lib/auth";
import { useMemo } from "react";

type Props = { user?: string | null };

function extractNameFromToken() {
  const raw = getToken();
  if (!raw) return null;
  try {
    const [, payload] = raw.split(".");
    const data = JSON.parse(atob(payload));
    return data.name ?? data.sub ?? null;
  } catch {
    return null;
  }
}

export default function UserHeader({ user }: Props) {
  const { show, toggle } = useShowValues();

  const name = useMemo(
    () => user ?? extractNameFromToken() ?? "usuário",
    [user]
  );

  return (
    <div className="bg-[#E69017] py-3 px-20 w-full lg:w-screen lg:flex lg: justify-between fixed border-b-1 border-[#fff6] z-12">
      <img className="hidden lg:block" src="/propabanda-financa.svg" alt="logo" />

      <div className="flex w-full items-center justify-between lg:justify-end lg:gap-10">
        <p className="text-white text-sm">
          Olá, <span className="text-base font-bold">{name}!</span>
        </p>

        <div className="flex gap-4">
          {/* show/hide values */}
          <button
            onClick={toggle}
            className="text-white w-8 h-8 bg-[#fff4] text-xl flex items-center justify-center rounded-full cursor-pointer"
            title={show ? "Ocultar valores" : "Mostrar valores"}
          >
            {show ? <FaRegEye /> : <FaRegEyeSlash />}
          </button>

          {/* logout */}
          <button
            onClick={logout}
            className="text-white w-8 h-8 bg-[#fff4] text-xl flex items-center justify-center rounded-full cursor-pointer"
            title="Sair"
          >
            <MdLogout />
          </button>
        </div>
      </div>
    </div>
  );
}
