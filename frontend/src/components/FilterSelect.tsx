import Select from "react-select";

type Option = {
  value: string;
  label: string;
};

type FilterSelectProps = {
  options: Option[];
  placeholder: React.ReactNode;
};

const FilterSelect = ({ options, placeholder }: FilterSelectProps) => {
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
        minWidth: '115px',
        width: "100%",
        padding: "2px 7px",
        cursor: "pointer",
        borderRadius: "50px",
        outline: "none",
        "&:hover": {
          border: "none",
        },
        ...(isFocused && {
          border: "none",
          boxShadow: "none",
        }),
      };
    },
    singleValue: (base: any) => ({
      ...base,
      color: "#ffa322",
    }),
    menu: (base: any) => ({
      ...base,
      backgroundColor: "#fff",
      color: "#282828",
    }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "#fafafa"
        : state.isFocused
          ? "#fafafa"
          : "#fff",
      color: "#282828",
      cursor: "pointer",
    }),
    placeholder: (base: any) => ({
      ...base,
      color: "#fff",
    }),
    dropdownIndicator: (base: any, state: any) => {
      const hasValue = state.selectProps.value;
      return {
        ...base,
        color: hasValue ? "#ffa322" : "#fff",
        "&:hover": {
          color: hasValue ? "#ffa322" : "#fff",
        },
      };
    },
    indicatorSeparator: () => ({
      display: "none",
    }),
  };

  return (
    <div className="w-full">
      <Select
        options={options}
        styles={customStyles}
        placeholder={placeholder}
        classNamePrefix="custom"
      />
    </div>
  );
};

export default FilterSelect;
