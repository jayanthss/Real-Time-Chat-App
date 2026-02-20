import React from "react";
import Logo from "../../assets/logo.svg"

function Brandinfo({Brand_name}) {
  return (
    <>
      <div className="brand flex items-center gap-[1rem] justify-center">
        <img className="h-[4rem] " src={Logo} alt="logo" />
        <h1 className="text-white uppercase text-[30px]">{Brand_name}</h1>
      </div>
    </>
  );
}

export default Brandinfo;
