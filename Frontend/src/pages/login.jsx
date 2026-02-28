import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./../css/input.css";
import { ToastContainer, toast } from "react-toastify";
import { loginRoute, tokenCheckRoute } from "../utils/ApiRoutes";
import { api } from "../api/axios";
import AuthFormFactory from "../factories/AuthFromFactory";
import { ValidateLogin } from "../Validations/ValidateSignup";

function login() {
  const navigate = useNavigate();
  const loginSchma = [
    { name: "username", type: "text", placeholder: "Username" },
    { name: "password", type: "password", placeholder: "* * * * * * *" },
  ];
  const [loginForm, setLoginForm] = useState({
    username: "",
    password: "",
  });
  const [error,setError] = useState({})

  const toast_options = {
    position: "bottom-right",
    theme: "dark",
    pauseOnHover: true,
    draggable: true,
    autoClose: 4000,
  };

  const handlechange = (event) => {
    setLoginForm((prev) => {
      return { ...prev, [event.target.name]: event.target.value };
    });
  };

  const handleValidation = () => {
    const { username, password } = loginForm;

    if (username.length === "") {
      toast.error("Email and Password is Required", toast_options);
      return false;
    } else if (password === "") {
      toast.error("Email and Password is Required", toast_options);
      return false;
    }
    // toast.success("User Created",toast_options)
    return true;
  };

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("Token");
        if (token) {
          const res_ser = await api.post(tokenCheckRoute);

          if (!res_ser.data.status) {
            toast.error(res_ser.data.message, toast_options);
            return;
          }

          navigate("/");
        }
      } catch (ex) {
        if (ex.status === 0) {
          navigate("/server-down");
          return;
        }
        toast.error(ex.message);
      }
    })();
  }, []);

  const handlesubmit = async (event) => {
    event.preventDefault();
    try {
      const loginErrors = ValidateLogin(loginForm)
      if(Object.keys(loginErrors).length === 0){
        const { username, password } = loginForm;
        const { data } = await api.post(loginRoute, {
          username,
          password,
        });

        if (data.status === false) {
          toast.error(data.msg, toast_options);
        }

        if (data.status === true) {
          const chat_app = {
            username: username,
            isAvatarImageSet: data.isset,
            avatarImage: data.image,
            _id: data._id,
          };

          localStorage.setItem("Token", data.Token);
          if (data.isset) {
            localStorage.setItem("chat-app-user", JSON.stringify(chat_app));
            navigate("/");
            return;
          }
          navigate("/setAvatar");
        }
      }else{
        setError(loginErrors)
      }
      
    } catch (ex) {
      if (ex.status === 0) {
        navigate("/server-down");
        return;
      }
      toast.error(ex.message,toast_options);
    }
  };

  return (
    <>
      <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-[#071226] via-[#0b1220] to-[#0f1724]">
        <div className="absolute left-0 top-0 w-1/3 h-full bg-[radial-gradient(ellipse_at_top_left,_#2b1963_0%,_transparent_40%)] pointer-events-none"></div>

        <AuthFormFactory
          from_style={`w-[400px] flex flex-col gap-6 p-10 rounded-2xl bg-black/40 backdrop-blur-md border border-transparent shadow-[0_10px_30px_rgba(2,6,23,0.6)]`}
          from_submit={handlesubmit}
          schma={loginSchma}
          inputChange={handlechange}
          error={error}
          variant="primary"
          className="bg-gradient-to-r from-[#6c4dff] to-[#4e0eff] text-white hover:opacity-95 w-full py-3 rounded-lg"
          children="Login"
          Auth_redirect_route="register"
          Auth_redirect_name="Register"
        />

      <ToastContainer />
      </div>
    </>
  );
}

export default login;
