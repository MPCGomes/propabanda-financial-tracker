import Select from "react-select";

export type Option = { value: string; label: string };

interface FilterSelectProps {
  options: readonly Option[];
  placeholder?: React.ReactNode;
  value?: string;
  onChange?: (value: string) => void;
}

export default function FilterSelect({
  options,
  placeholder,
  value,
  onChange,
}: FilterSelectProps) {
  const customStyles = {
    control: (base: any, state: any) => {
      const hasValue = state.hasValue;
      const isFocused = state.isFocused;
      return {
        ...base,
        backgroundColor: hasValue ? "#ffa32233" : "#d9d9d9",
        color: hasValue ? "#ffa322" : "#fff",
        fontSize: "1rem",
        border: "none",
        minWidth: "115px",
        width: "100%",
        padding: "2px 7px",
        cursor: "pointer",
        borderRadius: "50px",
        outline: "none",
        "&:hover": { border: "none" },
        ...(isFocused && { boxShadow: "none" }),
      };
    },
    singleValue: (base: any) => ({ ...base, color: "#ffa322" }),
    menu: (base: any) => ({
      ...base,
      backgroundColor: "#fff",
      color: "#282828",
    }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isSelected || state.isFocused ? "#fafafa" : "#fff",
      color: "#282828",
      cursor: "pointer",
    }),
    placeholder: (base: any) => ({ ...base, color: "#fff" }),
    dropdownIndicator: (base: any, state: any) => {
      const hasValue = state.selectProps.value;
      return {
        ...base,
        color: hasValue ? "#ffa322" : "#fff",
        "&:hover": { color: hasValue ? "#ffa322" : "#fff" },
      };
    },
    indicatorSeparator: () => ({ display: "none" }),
  };

  return (
    <div className="w-full">
      <Select
        options={options}
        styles={customStyles}
        placeholder={placeholder}
        classNamePrefix="custom"
        value={options.find((o) => o.value === value) || null}
        onChange={(opt) => onChange?.(opt?.value as string)}
        isSearchable={false}
      />
    </div>
  );
}
