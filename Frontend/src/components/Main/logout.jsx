import React from "react";
import { useNavigate } from "react-router-dom";
import { BiPowerOff } from "react-icons/bi";
import { FiLogOut } from "react-icons/fi";
import { api } from "../../api/axios";

function Logout() {
  const navigate = useNavigate();
  const logout = async () => {
    const mesage = await api.post("/api/auth/logout");
    localStorage.clear();
    navigate("/login");
  };
  return (
    <>
      <button
        className="flex items-center justify-center p-[0.5rem] rounded-[0.5rem] hover:bg-gray-800 border-none cursor-pointer"
        onClick={logout}
      >
        <FiLogOut className="text-[1.5rem] text-[#ebe7ff]" />
      </button>
    </>
  );
}

export default Logout;
