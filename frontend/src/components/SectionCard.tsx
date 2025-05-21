import React from "react";

export default function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="p-5 rounded-lg bg-white text-[#282828] flex flex-col gap-5">
      <p className="text-base font-bold">{title}</p>
      {children}
    </div>
  );
}
