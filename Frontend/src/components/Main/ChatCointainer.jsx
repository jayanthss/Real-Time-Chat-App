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
  const scrollref = useRef();
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
    scrollref.current?.scrollIntoView({ behaviour: "smooth" });
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
        <div className="relative cointainer grid grid-rows-[10%_75%] gap-[0.1rem] overflow-hidden bg-[#121212] z-0 border-l-[1px] border-solid border-[#1E293B] ">
          <div
            className="
 chat-header flex justify-between items-center px-[2.2rem] h-18 border-b border-[#1E293B]
"
          >
            <div className="user-details flex items-center gap-[1.1rem]  ">
              <div className="avatar ">
                <img
                  className="h-[2.7rem]"
                  src={currchat.avatarImage}
                  alt="selected user image"
                />
              </div>

              <div className="username">
                <h3 className="text-[white] font-bold text-[18px] ">
                  {currchat.username}
                </h3>
              </div>
            </div>

            <div className="flex gap-[1.9rem]">
              <VideoLogo
                currchat={currchat}
                handle_camera_mic_permission={handle_camera_mic_permission}
              />

              <Logout />
            </div>

            {incomingVideoCall && (
              <div className="bg-transparent h-20 w-full absolute top-[4.3rem] right-[.1px] text-white flex justify-center items-center ">
                <div className="flex justify-between items-center pl-2 pr-2  w-[28rem] h-20 rounded-[1rem] bg-[#232D36]">
                  <div className="user_avatar flex items-center gap-3 ">
                    <div className="avatar w-14 h-14 rounded-2xl bg-white object-cover">
                      <img src={userInfo.userimage} />
                    </div>

                    <div className="username font-bold text-[18px]">
                      {userInfo.username}
                    </div>
                  </div>

                  <div className="buttons flex items-center gap-5">
                    <div
                      className="recive w-10 h-10 rounded-2xl  flex items-center hover:bg-gray-700 hover:cursor-pointer justify-center"
                      onClick={handleAnswer}
                    >
                      <IoMdCall fill="green" size={"1.7rem"} />
                    </div>

                    <div
                      className="end w-10 h-10 rounded-2xl  flex items-center  hover:bg-gray-700 hover:cursor-pointer justify-center"
                      onClick={handleEnd}
                    >
                      <MdCallEnd fill="red" size={"1.7rem"} />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="messagesCoinatiner  flex flex-col gap-[1rem] overflow-auto  custom-scrollbar bg-[#121216] p-[0_5.5rem_0] mt-1">
            {message.map((message, idx) => {
              return (
                <div ref={scrollref} key={idx}>
                  <div
                    className={`message ${
                      message.fromSelf
                        ? "sender justify-end "
                        : "reciver justify-start "
                    } flex items-center`}
                  >
                    <div
                      className={`content min-w-[12%] max-w-[50%] break-words p-[0.5rem] text-[16px]  text-[] ${
                        message.fromSelf
                          ? "bg-[#1f4daf] text-[#FFFFFF] rounded-[1rem]"
                          : "bg-[#1F2937] text-[#E5E7EB] rounded-[1rem]"
                      } `}
                    >
                      <p>{message.message}</p>
                      <p className="text-[10px] text-end text-[#94A3B8]">
                        {message.date_time
                          ? message.date_time
                          : time.split(" ")[0]}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          
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
