import {
  InputHTMLAttributes,
  DetailedHTMLProps,
  FC,
  ReactElement,
  ChangeEvent,
} from "react";

type NativeInputProps = DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

export interface InputTextProps extends NativeInputProps {
  label: string;
  placeholder?: string;
  value?: string | number;
  onValueChange?: (value: string) => void;
}

const InputText: FC<InputTextProps> = ({
  label,
  placeholder,
  value,
  onValueChange,
  onChange,
  readOnly = false,
  type = "text",
  id,
  ...rest
}): ReactElement => {
  const inputId = id ?? `input-${label.replace(/\s+/g, "-").toLowerCase()}`;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onValueChange?.(e.target.value);
    onChange?.(e);
  };

  return (
    <div className="relative w-full">
      <input
        id={inputId}
        type={type}
        placeholder={placeholder ?? ""}
        value={value !== undefined ? value : undefined}
        readOnly={readOnly}
        onChange={handleChange}
        className="peer w-full border border-gray-300 rounded-md p-2 pt-7 text-sm
                   focus:outline-none focus:border-blue-500 text-[#282828]"
        {...rest}
      />
      <label
        htmlFor={inputId}
        className="absolute left-2 top-2 text-[#282828] text-xs transition-all
                   peer-placeholder-shown:top-2 peer-placeholder-shown:text-xs
                   peer-focus:top-2 peer-focus:text-xs peer-focus:text-blue-500"
      >
        {label}
      </label>
    </div>
  );
};

export default InputText;
