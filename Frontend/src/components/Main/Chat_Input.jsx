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
      <div className="container  flex justify-center items-center px-8  overflow-visible w-[70vw] resize-y border-[#1E293B] border-t">
        <div className="Input_field flex items-center justify-center w-[60vw] p-2 rounded-[2rem] gap-[0.5rem] bg-[#21212a]  resize-y absolute bottom-10">
          <div className="button_container flex items-center justify-center text-white">
            <div className="emoji relative">
              <BsEmojiSmileFill
                onClick={click_emoji}
                className="text-2xl text-[#ffff00c8] cursor-pointer"
              />

              {isclickemoji && (
                <div className="absolute bottom-full mb-3 left-0 z-50">
                  <EmojiPicker
                    className=""
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
            className="input_container w-[50vw]  flex items-center gap-5"
            onSubmit={(e) => {
              sendChat(e);
            }}
          >
            <textarea
              ref={textareaRef}
              className="w-full custom-scrollbar bg-transparent resize-none max-h-[7rem] overflow-y-scroll text-white border-none pl-4  text-lg focus:outline-none"
              rows={1}
              placeholder="Type Message"
              value={userInput}
              onChange={Input_change}
            />
            

            {hideSend && (
              <Buttonfactory variant="icon" className="p-3 rounded-full flex justify-center items-center " Icon= {IoMdSend} Icon_Style = "text-white text-[1.1rem]" user_input={userInput} iconName = "Send"/>
            )}
          </form>

          {!hideSend ? (
            <div className="previewBtn flex gap-3 text-[white]">
              <div className="generate_Btn p-3 rounded-full flex justify-center items-center bg-[#6d4beb]">
                {!loading ? (
                  <Buttonfactory variant="icon" className="" Icon= {FaArrowsRotate} Icon_Style = "text-white text-[1.1rem]" onClick={() => handlePreviewBtn("user_regenerate")}/>

                ) : (
                  <div className=" bg-[#6b4beb] p-1 rounded-full flex items-center justify-center">
                    <SyncLoader loading={true} color="#ffff" size={7} />
                  </div>
                )}
              </div>
              
              {<Buttonfactory variant="icon" className="p-3 rounded-full flex justify-center items-center bg-[#6d4beb]" Icon= {SlClose} Icon_Style = "text-white text-[1.1rem]" onClick={() => handlePreviewBtn("user_not_Accpted")}/>}

              {<Buttonfactory variant="icon" className="p-3 rounded-full flex justify-center items-center bg-[#6d4beb]" Icon= {FaCheck} Icon_Style = "text-white text-[1.1rem]" onClick={() => handlePreviewBtn("user_accepted")}/>}
              

            
            </div>
          ) : (
            <>
              {loading ? (
                <div className=" bg-[#6b4beb] p-[0.7rem] rounded-full flex items-center justify-center">
                  <SyncLoader loading={true} color="#ffff" size={7} />
                </div>
              ) : (
                <Buttonfactory variant="icon" className="text-[white] p-[0.7rem] rounded-full flex justify-center items-center cursor-pointer " Icon= {FaMagic} Icon_Style = "text-white text-[1.1rem]" user_input={userInput} onClick={handleRewrite}/>

              )}
            </>
          )}
        </div>

        <div className="text-gray-500 text-[0.8rem] absolute bottom-3">Disclaimer : Ai Makes Mistake Review Carefully</div>
      </div>
    </>
  );
}
