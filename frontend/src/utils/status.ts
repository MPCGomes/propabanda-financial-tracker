export const STATUS_OPTIONS = [
  { value: "", label: "Todos" },
  { value: "ATIVO", label: "Ativo" },
  { value: "INATIVO", label: "Inativo" },
] as const;

export type ClientStatus = (typeof STATUS_OPTIONS)[number]["value"];
