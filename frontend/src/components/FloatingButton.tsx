type FloatingButton = {
  icon: React.ReactNode;
  background: string;
};

export default function FloatingButton({ icon, background }: FloatingButton) {
  return (
    <button
      style={{background}}
      className="w-10 h-10 text-xl text-white flex items-center justify-center rounded-full cursor-pointer"
    >
      {icon}
    </button>
  );
}
