import { ReactNode } from "react";

type InfoProps = {
  label: string;
  value: ReactNode;
  color?: string;
};

export default function Info({ label, value, color }: InfoProps) {
  return (
    <div className="flex items-center">
      <p className="text-sm text-[#28282833] w-[100px] lg:w-[160px]">{label}</p>

      <p className="text-base break-all" style={color ? { color } : undefined}>
        {value}
      </p>
    </div>
  );
}
