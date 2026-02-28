import { useRef, useState, useEffect } from "react";
import EmojiPicker, { Theme } from "emoji-picker-react";
import { IoMdSend } from "react-icons/io";
import { BsEmojiSmileFill } from "react-icons/bs";
import { socket } from "../../socket.js";
import { getRewriteByAi, host } from "../../utils/ApiRoutes.js";

import { SyncLoader } from "react-spinners";
import { FaMagic } from "react-icons/fa";
import { FaArrowsRotate } from "react-icons/fa6";
import { SlClose } from "react-icons/sl";
import { FaCheck } from "react-icons/fa";
import IconButton from "../Button/IconButton.jsx";
import { api } from "../../api/axios.js";
import Buttonfactory from "../../factories/ButtonFactory.jsx";

export default function Chat_Input({ handleSendMessage, currchat }) {
  const [isclickemoji, setisclickemoji] = useState(false);
  const [useremoji, setuseremoji] = useState(null);
  const [userInput, setuserInput] = useState("");
  const [send_enable, set_send_enable] = useState(false);
  const textareaRef = useRef(null);

  // const [previewText,setpreviewText] = useRef(null)
  let [hideSend, sethideSend] = useState(true);
  let [loading, setLoading] = useState(false);
  let preview_msg = useRef(null);

  const click_emoji = () => {
    setisclickemoji(!isclickemoji);
  };

  const choosen_emoji = (emojidata) => {
    setuserInput(userInput + emojidata.emoji);
  };

  const Input_change = (event) => {
    setuserInput(event.target.value);
    if(event.target.value != ""){
      set_send_enable(true)
    }else{
      set_send_enable(false)
    }
    const textarea = textareaRef.current;

    // reset height first
    textarea.style.height = "auto";

    // set new height based on content
    textarea.style.height = textarea.scrollHeight + "px";
  };

  const sendChat = (event) => {
    event.preventDefault();
    if (userInput.length > 0) {
      handleSendMessage(userInput);
      setuserInput("");
    }
  };

  const handleRewrite = async () => {
    try {
      if (userInput) {
        preview_msg.data = userInput;
        setLoading(true);

        const response = await api.post(getRewriteByAi, {
          user_message: userInput,
        });

        setLoading(false);

        sethideSend(false);
        if (response.data.status) {
          setuserInput(response.data.aiRewriteMsg);
        } 
      }
    } catch (ex) {
      console.log(`Error in handle rewrite ${ex}}`);
    }
  };

  const handlePreviewBtn = async (click_btn) => {
    // console.log(event.target.textContent , event.target)
    if (click_btn === "user_not_Accpted") {
      setuserInput(preview_msg.data);
      sethideSend(true);
    } else if (click_btn === "user_regenerate") {
      setLoading(true);
      await handleRewrite();
      setLoading(false);
    } else {
      setuserInput(userInput);
      sethideSend(true);
    }
  };

  return (
    <>
      <div className="container flex justify-center items-center px-6 overflow-visible  border-t border-[#1E293B]">
        <div className="Input_field  flex items-center justify-between w-[60vw] max-w-[72vw]  p-3 rounded-2xl gap-4 bg-[#21212a]  backdrop-blur-sm border border-white/5 shadow-[0_8px_30px_rgba(2,6,23,0.6)] absolute bottom-8">
          <div className="button_container flex items-center justify-center text-white">
            <div className="emoji relative">
              <BsEmojiSmileFill
                onClick={click_emoji}
                className="text-2xl text-yellow-400 cursor-pointer"
                aria-label="Emoji picker"
              />

              {isclickemoji && (
                <div className="absolute bottom-full mb-5 left-1 z-50">
                  <EmojiPicker
                    searchDisabled
                    theme={Theme.DARK}
                    onEmojiClick={choosen_emoji}
                    width={300}
                    height={300}
                    previewConfig={{ showPreview: false }}
                  />
                </div>
              )}
            </div>
          </div>

          <form
            className="input_container flex items-center gap-4 w-full"
            onSubmit={sendChat}
          >
            <textarea
              ref={textareaRef}
              className="w-full custom-scrollbar bg-transparent resize-none max-h-[8rem] overflow-y-auto text-white border-none pl-4 text-lg focus:outline-none placeholder-gray-400"
              rows={1}
              placeholder="Type your message..."
              value={userInput}
              onChange={Input_change}
            />
            {send_enable && hideSend && (
              <Buttonfactory
                variant="icon"
                className="p-2 rounded-full flex justify-center items-center bg-gradient-to-r from-[#6c4dff] to-[#4e0eff] shadow-md"
                Icon={IoMdSend}
                Icon_Style="text-white text-[1.4rem]"
                user_input={userInput}
                iconName="Send"
              />
            )}
          </form>

          {!hideSend ? (
            <div className="previewBtn flex gap-3 text-white">
              <div className="generate_Btn p-3 rounded-full flex justify-center items-center bg-gradient-to-r from-[#6c4dff] to-[#4e0eff]">
                {!loading ? (
                  <Buttonfactory
                    variant="icon"
                    className=""
                    Icon={FaArrowsRotate}
                    Icon_Style="text-white text-[1.1rem]"
                    onClick={() => handlePreviewBtn("user_regenerate")}
                  />
                ) : (
                  <div className="p-1 rounded-full flex items-center justify-center bg-[#6b4beb]">
                    <SyncLoader loading={true} color="#fff" size={7} />
                  </div>
                )}
              </div>

              <Buttonfactory
                variant="icon"
                className="p-3 rounded-full flex justify-center items-center bg-[#2b2546]"
                Icon={SlClose}
                Icon_Style="text-white text-[1.1rem]"
                onClick={() => handlePreviewBtn("user_not_Accpted")}
              />

              <Buttonfactory
                variant="icon"
                className="p-3 rounded-full flex justify-center items-center bg-[#2b2546]"
                Icon={FaCheck}
                Icon_Style="text-white text-[1.1rem]"
                onClick={() => handlePreviewBtn("user_accepted")}
              />
            </div>
          ) : (
            <>
              {loading ? (
                <div className="p-[0.7rem] rounded-full flex items-center justify-center bg-gradient-to-r from-[#6c4dff] to-[#4e0eff]">
                  <SyncLoader loading={true} color="#fff" size={7} />
                </div>
              ) : (
                send_enable && <Buttonfactory
                  variant="icon"
                  className="text-white p-[0.6rem] rounded-full flex justify-center items-center cursor-pointer bg-gradient-to-r from-[#6c4dff] to-[#4e0eff]"
                  Icon={FaMagic}
                  Icon_Style="text-white text-[1.1rem]"
                  user_input={userInput}
                  onClick={handleRewrite}
                />
              )}
            </>
          )}
        </div>

        <div className="text-gray-400 text-xs absolute bottom-3">
          Disclaimer: AI may make mistakes, review carefully.
        </div>
      </div>
    </>
  );
}
