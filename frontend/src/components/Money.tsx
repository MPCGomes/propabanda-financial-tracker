import { useShowValues } from "../contexts/ShowValuesContext";

export default function Money({
  value,
  precision = 2,
}: {
  value: number;
  precision?: number;
}) {
  const { show } = useShowValues();
  if (!show) return <>***</>;

  return (
    <>
      {value.toLocaleString("pt-BR", {
        minimumFractionDigits: precision,
        maximumFractionDigits: precision,
      })}
    </>
  );
}
