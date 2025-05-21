import { useState } from "react";
import SearchBar from "./SearchBar";
import Filter from "./Filter";
import FilterSelect from "./FilterSelect";
import Modal from "./Modal";
import Button from "./Button";

export default function SearchAndSort({
  onSearchChange,
  sortOptions,
  selectedSort,
  onSortChange,
}: {
  search: string;
  onSearchChange: (v: string) => void;
  sortOptions: { value: string; label: string }[];
  selectedSort: string;
  onSortChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col gap-5 lg:flex-row">
      <SearchBar onChange={onSearchChange} />
      <div className="flex gap-3 flex-wrap lg:flex-nowrap">
        <div className="hidden lg:block">
          <FilterSelect
            options={sortOptions}
            placeholder="Ordem"
            value={selectedSort}
            onChange={onSortChange}
          />
        </div>
        <Filter
          text="Ordem"
          onClick={() => setOpen(true)}
          className="lg:hidden"
        />
      </div>

      <Modal isOpen={open} onClose={() => setOpen(false)} title="Ordenar">
        <div className="flex flex-col gap-2">
          {sortOptions.map((opt) => (
            <label key={opt.value} className="flex items-center gap-1">
              <input
                type="radio"
                name="order"
                value={opt.value}
                onChange={() => {
                  onSortChange(opt.value);
                  setOpen(false);
                }}
                checked={opt.value === selectedSort}
              />
              {opt.label}
            </label>
          ))}
        </div>
        <Button onClick={() => setOpen(false)}>Aplicar Filtro</Button>
      </Modal>
    </div>
  );
}
