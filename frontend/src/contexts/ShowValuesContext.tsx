import { createContext, useContext, useState, ReactNode } from "react";

const Ctx = createContext<{ show: boolean; toggle(): void }>({
  show: true,
  toggle() {},
});

export function ShowValuesProvider({ children }: { children: ReactNode }) {
  const [show, setShow] = useState(true);
  return (
    <Ctx.Provider value={{ show, toggle: () => setShow((v) => !v) }}>
      {children}
    </Ctx.Provider>
  );
}

export const useShowValues = () => useContext(Ctx);
