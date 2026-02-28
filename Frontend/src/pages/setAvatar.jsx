import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../assets/loader.gif";
import "./../css/input.css";
import { ToastContainer, toast } from "react-toastify";
import { SetAvatarRoute, tokenCheckRoute } from "../utils/ApiRoutes";
import multiavatar from "@multiavatar/multiavatar/esm";
import { api } from "../api/axios";

export default function SetAvatar() {
  const toast_options = {
    position: "bottom-right",
    theme: "dark",
    pauseOnHover: true,
    draggable: true,
    autoClose: 4000,
  };

  const navigate = useNavigate();

  const [avatars, setavatar] = useState([]);
  const [isloading, setloading] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState(undefined);

  const selectProfilePicture = async () => {
    try {
      if (selectedAvatar === undefined) {
        toast.error("Select Avatar", toast_options);
      } else {
        const token = localStorage.getItem("Token");
        const verify_token = await api.post(
          tokenCheckRoute,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const SetAavatarInfo = await api.post(
          `${SetAvatarRoute}/${verify_token.data.username}`,
          {
            image: avatars[selectedAvatar],
          }
        );

        if (!SetAavatarInfo.data.isset) {
          toast.error("error in set avatar try again", toast_options); 
          return
        }
        
        const user = {
            username: verify_token.data.username,
            isAvatarImageSet: SetAavatarInfo.data.isset,
            avatarImage: SetAavatarInfo.data.image,
            _id: SetAavatarInfo.data._id,
          };
        localStorage.setItem("chat-app-user", JSON.stringify(user));
        navigate("/");
      }
    return 
    } catch (ex) {
      if (ex.status === 0) {
        navigate("/server-down");
        return;
      }
      toast.error(ex.message, toast_options);
      
    }
  };

  useEffect(() => {
    // generate avatars
    const data = [];
    for (let i = 0; i < 4; i++) {
      const svg = multiavatar(Math.random().toString());
      const svgurl = `data:image/svg+xml;base64,${btoa(svg)}`;
      data.push(svgurl);
    }

    setavatar(data);

    // stop loading after 3 seconds
    const timer = setTimeout(() => {
      setloading(false);
    }, 3000);

    // cleanup
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {isloading ? (
        <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-[#071226] via-[#0b1220] to-[#0f1724] text-white">
          <img src={Loader} alt=""  />
        </div>
      ) : (
        <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-[#071226] via-[#0b1220] to-[#0f1724] text-white">
          <div className="relative w-[520px] flex flex-col gap-8 p-10 glass-card">
            <h1 className="text-2xl font-bold text-center">
              Pick an avatar as your profile picture
            </h1>
            <div className="flex flex-wrap justify-center gap-4 transition-all duration-500">
              {avatars.map((avatar, index) => {
                return (
                  <div
                    key={index}
                    onClick={() => {
                      setSelectedAvatar(index);
                    }}
                    className={`rounded-full p-2 transition-all duration-300 cursor-pointer ${
                      selectedAvatar === index
                        ? "border-4 border-[#4c0bfd]"
                        : "border-4 border-transparent"
                    }`}
                  >
                    <img
                      src={avatar}
                      alt={`avatar-${index}`}
                      className="h-16 w-16 rounded-full"
                    />
                  </div>
                );
              })}
            </div>

            <button
              className="bg-gradient-to-r from-[#6c4dff] to-[#4e0eff] text-white w-full py-3 rounded-lg uppercase font-bold hover:opacity-95"
              onClick={selectProfilePicture}
            >
              Set Profile Picture
            </button>
          </div>
        </div>
      )}
      <ToastContainer />
    </>
  );
}
