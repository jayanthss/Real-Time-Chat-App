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
        <div className=" cointainer flex flex-col justify-center items-center h-[100vh] gap-[3rem] w-[100vw] bg-[#131324] text-white">
          <img src={Loader} alt="" />{" "}
        </div>
      ) : (
        <div className="cointainer flex flex-col justify-center items-center h-[100vh] gap-[3rem] w-[100vw] bg-[#131324] text-white">
          <div className="title_cointainer">
            <h1 className="text-[30px] font-bold">
              Pick an avatar as your profile picture
            </h1>
          </div>
          <div className="avatar flex gap-[0.5rem] border-transparent border-[0.4rem] border-solid rounded-[5rem] justify-center items-center transition-all ease-in-out duration-500">
            {avatars.map((avatar, index) => {
              return (
                <div
                  key={index}
                  onClick={() => {
                    setSelectedAvatar(index);
                  }}
                  className={`avatar cursor-pointer transition-all duration-300 rounded-[5rem] p-2 ${
                    selectedAvatar === index
                      ? "border-8 border-[#4c0bfd] "
                      : "border-8 border-transparent"
                  }`}
                >
                  <img
                    src={avatar}
                    alt={`avatar-${index}`}
                    className=" h-[6rem] cursor-pointer"
                  />
                </div>
              );
            })}
          </div>

          <button
            className="bg-[#4e0eff] text-[white] py-[0.5rem] px-[2rem] border-none font-bold cursor-pointer rounded-[0.4rem] text-[1rem] uppercase hover:bg-[#4e0eff]"
            onClick={selectProfilePicture}
          >
            Set Profile Picture
          </button>
        </div>
      )}
      <ToastContainer />
    </>
  );
}
