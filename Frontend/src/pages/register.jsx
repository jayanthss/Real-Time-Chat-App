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
      <div className="h-[100vh] w-[100vw] flex flex-col justify-center gap-[1rem] items-center bg-[#131324]">
        <AuthFormFactory
          from_style="flex flex-col gap-[0.8rem] p-[2rem_3rem] rounded-[2rem] bg-[#00000076]"
          from_submit={handlesubmit}
          schma={registerSchma}
          inputChange={handlechange}
          error= {error}
          variant="primary"
          className="bg-[#4e0eff] text-[white] hover:bg-[#4e0eff]"
          children="Create"
          Auth_redirect_route="login" Auth_redirect_name="Login"
        />
        
      </div>
      <ToastContainer />
    </>
  );
}

export default register;
