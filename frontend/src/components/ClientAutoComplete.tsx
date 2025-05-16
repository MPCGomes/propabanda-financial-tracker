import { useEffect, useRef, useState } from "react";
import InputText from "./InputText";
import api from "../lib/api";

export interface ClientOption {
  id: number;
  name: string;
}

interface ClientAutoCompleteProps {
  onSelect: (client: ClientOption) => void;
  defaultClient?: ClientOption | null;
}

export default function ClientAutoComplete({
  onSelect,
  defaultClient = null,
}: ClientAutoCompleteProps) {
  const [query, setQuery] = useState(defaultClient?.name ?? "");
  const [options, setOptions] = useState<ClientOption[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!query.trim()) {
      setOptions([]);
      return;
    }

    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      const { data } = await api.post("/api/clients/filter", {
        search: query,
        sortBy: "name",
        direction: "asc",
      });
      setOptions(data.map((c: any) => ({ id: c.id, name: c.name })));
      setIsOpen(true);
    }, 300);

    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [query]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handlePick = (client: ClientOption) => {
    setQuery(client.name);
    setIsOpen(false);
    onSelect(client);
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      <InputText
        label="Cliente"
        placeholder="Pesquisar Cliente"
        value={query}
        onValueChange={setQuery}
      />

      {isOpen && options.length > 0 && (
        <ul className="absolute z-20 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-56 overflow-y-auto">
          {options.map((opt) => (
            <li
              key={opt.id}
              className="px-3 py-2 hover:bg-[#F5F5F5] cursor-pointer text-sm text-[#282828]"
              onClick={() => handlePick(opt)}
            >
              {opt.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
