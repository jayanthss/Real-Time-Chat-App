import React from "react";
import InputFactory from "./InputFactory";
import Buttonfactory from "./ButtonFactory";
import Brandinfo from "./../components/Auth Forms/Brandinfo";
import Authredirect from "./../components/Auth Forms/Authredirect";

function AuthFormFactory({ schma,Auth_redirect_route,Auth_redirect_name, from_style, from_submit,inputChange,error,...props }) {
  return (
    <>
      <form className={from_style} onSubmit={(event)=>from_submit(event)}>
        <Brandinfo Brand_name="Super Chat"/>
        {schma.map((item, idx) => (
          <div className="flex flex-col gap-1">
            {}
            {error && item.name in error ? 
            <span className="text-[12px] font-bold text-red-600 text-end px-2">{error[item.name]}</span> :<span className=" h-4 text-[11px] font-bold  text-end px-2"></span>
            }
            <InputFactory
              key={idx}
              type={item.type}
              placeholder={item.placeholder}
              className="input"
              name={item.name}
              onChange={(e) => inputChange(e)}
            />

          </div>
        ))}

        <Buttonfactory {...props} />

        <Authredirect redirect_route={Auth_redirect_route} redirect_name={Auth_redirect_name}/>
      </form>
    </>
  );
}

export default AuthFormFactory;
