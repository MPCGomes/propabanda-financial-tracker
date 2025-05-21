import Info from "./Info";

export default function InfoGroup({
  items,
}: {
  items: { label: string; value: string | number; color?: string }[];
}) {
  return (
    <>
      {items.map(({ label, value, color }) => (
        <Info key={label} label={label} value={String(value)} color={color} />
      ))}
    </>
  );
}
