import React, { useEffect, useRef, useState } from "react";
import Logout from "./logout";
import Chat_Input from "./Chat_Input";

import {
  GetMessageRoute,
  sendMessageRoute,
  getUserRoute,
  host,
} from "../../utils/ApiRoutes";
import { ToastContainer, toast } from "react-toastify";

import VideoLogo from "./VideoLogo";

import { IoMdCall } from "react-icons/io";
import { MdCallEnd } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/axios";

function ChatCointainer({ currchat, curruser, socket }) {
  // const socket = io(host);
  const naviagte = useNavigate();
  const [message, setmessages] = useState([]);
  const [arrivalmessage, setarrivalmessage] = useState(null);
  const scrollref = useRef(); // ref will point to last message for scrolling
  const [incomingVideoCall, setincomingVideoCall] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const VideoCaller = useRef(null);
  let now = new Date();
  let time = now.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const toast_options = {
    position: "bottom-right",
    theme: "dark",
    pauseOnHover: true,
    draggable: true,
    autoClose: 4000,
    closeOnClick: true,
  };

  const handle_camera_mic_permission = (msg) => {
    // console.log("entered to camera_mic() ", msg);
    toast.error(msg, toast_options);
  };

  useEffect(() => {
    (async () => {
      if (currchat) {
        const response = await api.post(GetMessageRoute, {
          from: curruser._id,
          to: currchat._id,
        });
        setmessages(response.data);
      }
    })();
  }, [currchat]);

  const handleSendMessage = async (msg) => {
    const response = await api.post(sendMessageRoute, {
      from: curruser._id,
      to: currchat._id,
      message: msg,
    });

    socket.current.emit("send-msg", {
      from: curruser._id,
      to: currchat._id,
      message: msg,
    });

    const msgs = [...message];
    msgs.push({ fromSelf: true, message: msg });
    setmessages(msgs);
  };

  //edited
  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-recieve", (msg) => {
        setarrivalmessage({ fromSelf: false, message: msg });
      });

      socket.current.on("video-call-by-someone", async (from) => {
        VideoCaller.current = from;
        // console.log("i'm in video-call-by -someone", from);

        if (from) {
          const getUser = await api.post(getUserRoute, {
            from: from.from,
          });

          if (getUser.data) {
            setUserInfo({
              username: getUser.data.username,
              userimage: getUser.data.avatarImage,
            });
            setincomingVideoCall(true);
          }
        } else {
          // console.log("from is not defined");
        }
      });

      socket.current.on("call-reject-msg", (msg) => {
        // console.log("entered to call-reject");
        toast.error(`User Is Busy Try again later`, toast_options);
      });
    }
  }, []);

  useEffect(() => {
    arrivalmessage && setmessages((prev) => [...prev, arrivalmessage]);
  }, [arrivalmessage]);

  useEffect(() => {
    scrollref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  const handleAnswer = () => {
    if (currchat) {
      naviagte(`/VideoCall/${currchat._id}`, {
        state: { roles: "receiver" },
      });
    } else {
      toast.error("Select the chat is Continue...", toast_options);
    }
  };
  const handleEnd = () => {
    socket.current.emit("call-reject", VideoCaller);
    setincomingVideoCall(false);
  };

  return (
    <>
      {currchat && (
        <div className="relative cointainer grid grid-rows-[10%_75%] gap-1 overflow-hidden bg-black/20 backdrop-blur-sm z-0 border-l border-[#1E293B]">
          <div className="chat-header flex items-center justify-between px-8 py-4 border-b border-[#1E293B]">
            <div className="user-details flex items-center gap-4">
              <img
                className="h-12 w-12 rounded-full"
                src={currchat.avatarImage}
                alt="selected user"
              />
              <h3 className="text-white font-semibold text-lg">
                {currchat.username}
              </h3>
            </div>

            <div className="flex items-center gap-6">
              <VideoLogo
                currchat={currchat}
                handle_camera_mic_permission={handle_camera_mic_permission}
              />
              <Logout />
            </div>
          </div>

          {incomingVideoCall && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm">
              <div className="bg-black/60 backdrop-blur-md rounded-3xl px-12 py-8 border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.8)] w-[420px]">
                <div className="text-center mb-8">
                  <p className="text-gray-400 text-sm tracking-wide">INCOMING VIDEO CALL</p>
                </div>

                <div className="flex flex-col items-center gap-6 mb-8">
                  <div className="relative">
                    <img
                      src={userInfo?.userimage}
                      alt="caller"
                      className="w-24 h-24 rounded-full border-4 border-[#6c4dff] shadow-lg object-cover"
                    />
                    <div className="absolute inset-0 rounded-full border-4 border-[#6c4dff] animate-pulse opacity-30"></div>
                  </div>
                  <div className="text-center">
                    <h2 className="text-white text-2xl font-bold">{userInfo?.username}</h2>
                    <p className="text-gray-400 text-sm mt-2">is calling you...</p>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-8">
                  <button
                    onClick={handleEnd}
                    className="w-16 h-16 rounded-full bg-gradient-to-br from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 flex items-center justify-center shadow-lg transition-all transform hover:scale-110 active:scale-95"
                  >
                    <MdCallEnd size={28} fill="white" />
                  </button>

                  <button
                    onClick={handleAnswer}
                    className="w-16 h-16 rounded-full bg-gradient-to-br from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 flex items-center justify-center shadow-lg transition-all transform hover:scale-110 active:scale-95"
                  >
                    <IoMdCall size={28} fill="white" />
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="messagesContainer flex flex-col gap-4 overflow-auto custom-scrollbar bg-black/10 px-20 mt-1 flex-1">
            {message.map((message, idx) => (
              <div
              ref={scrollref}
              key={idx}

              >
                <div
                  className={`message flex items-center ${
                    message.fromSelf ? "justify-end" : "justify-start"
                  }`}
                  >
                  <div
                    className={`content min-w-[4rem] max-w-[50%] break-words p-2 text-[16px] ${
                      message.fromSelf
                      ? "bg-gradient-to-r from-[#422592] to-[#3a316a] text-white rounded-2xl"
                      : "bg-gray-800 text-gray-200 rounded-2xl"
                    }`}
                    >
                    <p>{message.message}</p>
                    <p className="text-[10px] text-end text-gray-400 mt-1">
                      {message.date_time
                        ? message.date_time
                        : time.split(" ")[0]}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        <Chat_Input
          handleSendMessage={handleSendMessage}
          currchat={currchat}
          />

        
        <ToastContainer className="absolute bottom-0" />

      </div>
      )}
    </>
  );
}

export default ChatCointainer;
