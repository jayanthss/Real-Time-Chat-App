import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { allUsers, host, tokenCheckRoute } from "../utils/ApiRoutes";
import Contacts from "../components/Main/Contacts";
import Welcome from "../components/Main/Welcome";
import ChatCointainer from "../components/Main/ChatCointainer";
import { io } from "socket.io-client";
import { api } from "../api/axios";

function chat() {
  const socket = useRef();

  const navigate = useNavigate();
  const [contact, setcontact] = useState([]);
  const [curruser, setcurruser] = useState(undefined);
  const [currChat, setcurrChat] = useState(undefined);
  const [isloaded, setisloaded] = useState(undefined);
  const [onlineUser, setOnlineuser] = useState("");
  const [disUser, setDisuser] = useState("");

  const toast_options = {
    position: "bottom-right",
    theme: "dark",
    pauseOnHover: true,
    draggable: true,
    autoClose: 4000,
  };
  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("Token");
        if (!token) navigate("/login");
        const verify = await api.post(tokenCheckRoute)


        if (!verify) {
          navigate("/login");
        } else {
          setcurruser(JSON.parse(localStorage.getItem("chat-app-user")));
          setisloaded(true);
        }
      } catch (ex) {
        if(ex.status === 0){
          navigate("/server-down")
          return
        }
        toast.error(ex.message,toast_options)
      }
    })();
  }, []);

  useEffect(() => {
    socket.current = io(host);
    if (!socket.current) return;

    socket.current.emit("get-online-users");

    socket.current.on("online-users", (users) => {
      setOnlineuser(users);
    });

    socket.current.on("disconnect", (users) => {
      setDisuser(users);
    });
    return () => {
      socket.current.off("online-users");
    };
  }, []);

  useEffect(() => {
    if (curruser) {
      socket.current = io(host);
      socket.current.emit("add-user", curruser._id);
    }
  }, [curruser]);

  useEffect(() => {
    (async function () {
      try {
        if (curruser) {
          if (curruser.isAvatarImageSet) {
            const data = await api.get(`${allUsers}/${curruser._id}`);
            setcontact(data.data);
          } else {
            navigate("/setAvatar");
          }
        }
      } catch (ex) {
        if(ex.status === 0){
          navigate("/server-down")
          return
        }
        toast.error(ex.message)
      }
    })();
  }, [curruser]);

  const handleChatchange = (chat) => {
    setcurrChat(chat);
  };

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-[#071226] via-[#0b1220] to-[#0f1724] flex items-center justify-center">
      <div className="relative w-full h-full  grid grid-cols-[30%_70%] gap-1 bg-black/40 backdrop-blur-md rounded-2xl shadow-lg overflow-hidden">
        <Contacts
          contacts={contact}
          curruser={curruser}
          currchat={handleChatchange}
          onlineUser={onlineUser}
          setcontact={setcontact}
        />
        {isloaded && currChat === undefined ? (
          <Welcome />
        ) : (
          <ChatCointainer
            currchat={currChat}
            curruser={curruser}
            socket={socket}
          />
        )}
      </div>
    </div>
  );
}

export default chat;
