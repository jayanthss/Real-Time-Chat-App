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
      <div className="h-[100vh] w-[100vw] flex flex-col justify-center gap-[1rem] items-center bg-[#131324]">

        <AuthFormFactory
          from_style="flex flex-col gap-[2rem] p-[2rem_3rem] rounded-[2rem] bg-[#00000076]"
          from_submit={handlesubmit}
          schma={loginSchma}
          inputChange={handlechange}
          error={error}
          variant="primary"
          className="bg-[#4e0eff] text-[white] hover:bg-[#4e0eff]"
          children="Login"
          Auth_redirect_route="register"
          Auth_redirect_name="Register"
        />

      </div>
      <ToastContainer />
    </>
  );
}

export default login;
