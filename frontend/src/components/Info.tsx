type Info = {
  label: string;
  value: string;
};

export default function Info({ label, value }: Info) {
  return (
    <div className="flex items-center">
      <p className="text-sm text-[#28282833] w-[100px] lg:w-[160px]">{label}</p>
      <p className="text-base">{value}</p>
    </div>
  );
}
