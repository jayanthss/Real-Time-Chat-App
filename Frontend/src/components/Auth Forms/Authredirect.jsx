import React from "react";
import { Link } from "react-router-dom";

function Authredirect({redirect_route,redirect_name}) {
  return (
    <>
    <span className="text-[white] uppercase ">
      Dont't have account{" "}
      <Link to={`/${redirect_route}`} className="text-[#4e0eff] underline font-bold">
        {`${redirect_name}`}
      </Link>
    </span>
    </>
  );
}

export default Authredirect;
