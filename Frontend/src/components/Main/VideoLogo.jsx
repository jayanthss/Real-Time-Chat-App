import { LuVideo } from "react-icons/lu";
import { ToastContainer, toast } from "react-toastify";

import { useState } from "react";
import {  useNavigate } from "react-router-dom";

function VideoLogo({ currchat,handle_camera_mic_permission }) {
  const navigate = useNavigate()


  const [click, setclick] = useState(false);
  const toast_options = {
    position: "bottom-right",
    theme: "dark",
    pauseOnHover: true,
    draggable: true,
    autoClose: 4000,
  };

  // edited
  const btnClicked = async() => {
    try{
      const setLocalStream = await navigator.mediaDevices.getUserMedia({'video':true,'audio':true})
      navigate(`/VideoCall/${currchat._id}`,{
        state :{roles:"caller"}
      })
    }catch(err){
      handle_camera_mic_permission("Camera and Mic access needed....")
    }
  };

  return (
    <>
      <button
        className="flex items-center justify-center p-[0.5rem] rounded-[0.5rem] ] border-none cursor-pointer hover:bg-gray-800"
        onClick={btnClicked}
      >
        <LuVideo className="text-[1.5rem] text-[#ebe7ff]" />
      </button>


    </>
  );
}

export default VideoLogo;
