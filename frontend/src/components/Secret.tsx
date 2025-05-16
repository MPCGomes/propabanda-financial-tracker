import { ReactNode } from "react";
import { useBalanceVisible } from "../contexts/BalanceContext";

export default function Secret({ children }: { children: ReactNode }) {
  const visible = useBalanceVisible();
  return <>{visible ? children : "***"}</>;
}
