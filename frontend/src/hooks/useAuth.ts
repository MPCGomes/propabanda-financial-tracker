import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getToken } from "../lib/auth";

export const useAuth = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if (!getToken()) navigate("/login", { replace: true });
  }, [navigate]);
};
