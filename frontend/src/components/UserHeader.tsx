import { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { MdLogout } from "react-icons/md";

type UserHeaderProps = {
  user: string;
};

export default function UserHeader({ user }: UserHeaderProps) {
  const [showBalance, setShowBalance] = useState(false);

  const toggleBalance = () => {
    setShowBalance((prev) => !prev);
  };

  return (
    <div className="flex justify-between items-center bg-white rounded-lg p-3">
      <p className="text-[#282828] text-sm">
        Olá, <span className="text-base font-bold">{user}!</span>
      </p>
      <div className="flex gap-4">
        <button
          onClick={toggleBalance}
          className="text-[#ffa322] w-8 h-8 bg-[#ffa32233] text-xl flex items-center justify-center rounded-full cursor-pointer"
        >
          {showBalance ? <FaRegEyeSlash /> : <FaRegEye />}
        </button>
        <button className="text-[#ffa322] w-8 h-8 bg-[#ffa32233] text-xl flex items-center justify-center rounded-full cursor-pointer">
          <MdLogout />
        </button>
      </div>
    </div>
  );
}
