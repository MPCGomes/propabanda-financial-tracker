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
    <div className="flex justify-between items-center bg-white rounded-lg p-3">
      <p className="text-[#282828] text-sm">
        Olá, <span className="text-base font-bold">{name}!</span>
      </p>

      <div className="flex gap-4">
        {/* show/hide values */}
        <button
          onClick={toggle}
          className="text-[#ffa322] w-8 h-8 bg-[#ffa32233] text-xl flex items-center justify-center rounded-full"
          title={show ? "Ocultar valores" : "Mostrar valores"}
        >
          {show ? <FaRegEye /> : <FaRegEyeSlash />}
        </button>

        {/* logout */}
        <button
          onClick={logout}
          className="text-[#ffa322] w-8 h-8 bg-[#ffa32233] text-xl flex items-center justify-center rounded-full"
          title="Sair"
        >
          <MdLogout />
        </button>
      </div>
    </div>
  );
}
