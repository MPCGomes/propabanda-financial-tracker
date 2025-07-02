import { useState, useMemo } from "react";
import TextField from "@mui/material/TextField";
import Button from "./Button";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { MdLogout } from "react-icons/md";
import { FaGear } from "react-icons/fa6";
import Modal from "./Modal";
import { useShowValues } from "../contexts/ShowValuesContext";
import { logout, getToken } from "../lib/auth";
import api from "../lib/api";

type Props = { user?: string | null };

function parseJwtPayload(): any | null {
  const raw = getToken();
  if (!raw) return null;
  try {
    const [, payload] = raw.split(".");
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

function extractNameFromToken(): string | null {
  const data = parseJwtPayload();
  return data?.name ?? data?.sub ?? null;
}

export default function UserHeader({ user }: Props) {
  const { show, toggle } = useShowValues();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const name = useMemo(
    () => user ?? extractNameFromToken() ?? "usuário",
    [user]
  );

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
    setPasswordError(null);
    setLoading(false);
  };

  const handleChangePassword = async () => {
    setPasswordError(null);
    if (!currentPassword) {
      setPasswordError("Senha atual é obrigatória.");
      return;
    }
    if (!newPassword) {
      setPasswordError("Nova senha é obrigatória.");
      return;
    }
    if (confirmNewPassword !== newPassword) {
      setPasswordError("A confirmação da nova senha não corresponde.");
      return;
    }

    setLoading(true);
    try {
      await api.put("/api/users/password", {
        currentPassword,
        newPassword,
      });
      closeModal();
      alert("Senha alterada com sucesso!");
    } catch (err: any) {
      const status = err.response?.status;
      const data = err.response?.data;
      if (status === 401) {
        setPasswordError(data?.error || "Não autorizado.");
      } else if (status === 400) {
        setPasswordError(
          typeof data?.error === "string"
            ? data.error
            : Object.values(data.errors || {}).join("; ")
        );
      } else {
        setPasswordError(
          "Falha ao alterar senha. Veja o console para detalhes."
        );
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bg-[#E69017] py-3 px-5 lg:px-20 w-full lg:flex justify-between fixed border-b border-[#fff6] z-12">
        <img
          className="hidden lg:block"
          src="/propabanda-financa.svg"
          alt="logo"
        />
        <div className="flex w-full items-center justify-between lg:justify-end lg:gap-10">
          <p className="text-white text-sm">
            Olá, <span className="text-base font-bold">{name}!</span>
          </p>
          <div className="flex gap-4">
            <button
              onClick={toggle}
              className="text-white w-8 h-8 bg-[#fff4] text-xl flex items-center justify-center rounded-full"
              title={show ? "Ocultar valores" : "Mostrar valores"}
            >
              {show ? <FaRegEye /> : <FaRegEyeSlash />}
            </button>
            <button
              onClick={logout}
              className="text-white w-8 h-8 bg-[#fff4] text-xl flex items-center justify-center rounded-full"
              title="Sair"
            >
              <MdLogout />
            </button>
            <button
              onClick={openModal}
              className="text-white w-8 h-8 bg-[#fff4] text-xl flex items-center justify-center rounded-full"
              title="Configurações"
            >
              <FaGear />
            </button>
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} title="Alterar Senha">
        <div className="flex flex-col gap-4">
          <TextField
            label="Senha Atual"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Nova Senha"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Confirmar Nova Senha"
            type="password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            fullWidth
            required
          />
          {passwordError && (
            <p className="text-sm text-red-500">{passwordError}</p>
          )}
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outlined" onClick={closeModal} disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={handleChangePassword} disabled={loading}>
            {loading ? "Alterando..." : "Confirmar"}
          </Button>
        </div>
      </Modal>
    </>
  );
}
