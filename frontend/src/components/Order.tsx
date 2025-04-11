type Order = {
  product: string;
  date: string;
  value: string;
  color: string;
  link: string;
  icon: React.ReactNode;
};

export default function Order({
  product,
  date,
  value,
  color,
  link,
  icon,
}: Order) {
  return (
    <a
      href={link}
      className="flex items-center justify-between hover:bg-[#fafafa] p-3 duration-300 rounded-lg"
    >
      <div className="flex items-center gap-5">
        <p className="bg-[#ffa32233] text-[#FFA322] text-3xl w-12 h-12 flex items-center justify-center rounded-full">
          {icon}
        </p>
        <div>
          <p className="text-base text-[#282828] font-medium">{product}</p>
          <p className="text-xs text-[#787878]">{date}</p>
        </div>
      </div>
      <p style={{ color }} className="text-xs font-medium">
        R$ {value} •
      </p>
    </a>
  );
}
