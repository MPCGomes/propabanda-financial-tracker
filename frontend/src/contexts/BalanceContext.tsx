import { createContext, useContext, useState, ReactNode } from "react";

const Ctx = createContext<{
  visible: boolean;
  toggle(): void;
}>({ visible: true, toggle() {} });

export function BalanceProvider({ children }: { children: ReactNode }) {
  const [visible, setVisible] = useState(true);
  return (
    <Ctx.Provider value={{ visible, toggle: () => setVisible((v) => !v) }}>
      {children}
    </Ctx.Provider>
  );
}

export const useBalanceVisible = () => useContext(Ctx).visible;
export const useToggleBalance = () => useContext(Ctx).toggle;
