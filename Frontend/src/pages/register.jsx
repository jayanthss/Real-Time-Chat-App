import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./../css/input.css";
import { ToastContainer, toast } from "react-toastify";
import { registerRoute } from "../utils/ApiRoutes";
import AuthFormFactory from "../factories/AuthFromFactory";
import { api } from "../api/axios";
import { ValidationSingup } from "../Validations/ValidateSignup";

function register() {
  const navigate = useNavigate();
  let registerSchma = [
    { name: "username", type: "text", placeholder: "Username" },
    { name: "email", type: "email", placeholder: "email" },
    { name: "password", type: "text", placeholder: "password" },
    {
      name: "confirmPassword",
      type: "password",
      placeholder: "confrim password",
    },
  ];

  let inital = {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  };
  const [formData, setformData] = useState(inital);
  const [error,setError] = useState({})

  const toast_options = {
    position: "bottom-right",
    theme: "dark",
    pauseOnHover: true,
    draggable: true,
    autoClose: 4000,
  };

  const handlechange = (event) => {
    const { name, value } = event.target;
    setformData((prev) => {
      return { ...prev, [name]: value };
    });
  };

  
  useEffect(() => {
    const user_login = JSON.parse(localStorage.getItem("chat-app-user"));
    if (user_login) {
      navigate("/");
    }
  }, []);

  const handlesubmit = async (event) => {
    event.preventDefault();
    try {

      const errors = ValidationSingup(formData)

      if(Object.keys(errors).length === 0){
        const { username, email, password } = formData;
        const { data } = await api.post(registerRoute, {
          username,
          email,
          password,
        });

        if (data.status === false) {
          toast.error(data.msg, toast_options);
        }

        if (data.status === true) {
          navigate("/login");
          return
        }
      }else{
        setError(errors)

      }

    } catch (ex) {
      if(ex.status === 0){
        navigate("/server-down")
        return
      }
      toast.error(ex.message,toast_options)
    }
  };

  return (
    <>
      <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-[#071226] via-[#0b1220] to-[#0f1724]">
        <div className="absolute left-0 top-0 w-1/3 h-full bg-[radial-gradient(ellipse_at_top_left,_#2b1963_0%,_transparent_40%)] pointer-events-none"></div>

        <AuthFormFactory
          from_style={`w-[400px] flex flex-col gap-4 p-10 rounded-2xl bg-black/40 backdrop-blur-md border border-transparent shadow-[0_10px_30px_rgba(2,6,23,0.6)]`}
          from_submit={handlesubmit}
          schma={registerSchma}
          inputChange={handlechange}
          error={error}
          variant="primary"
          className="bg-gradient-to-r from-[#6c4dff] to-[#4e0eff] text-white hover:opacity-95 w-full py-3 rounded-lg"
          children="Create"
          Auth_redirect_route="login" Auth_redirect_name="Login"
        />
        
      <ToastContainer />
      </div>
    </>
  );
}

export default register;
