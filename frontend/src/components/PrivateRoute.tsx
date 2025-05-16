import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { getToken } from "../lib/auth";

export default function PrivateRoute({ children }: { children: ReactNode }) {
  return getToken() ? <>{children}</> : <Navigate to="/login" replace />;
}
