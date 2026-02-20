import React, { useEffect, useState } from "react";
import robo from "../../assets/robot.gif";

function Welcome() {
  const [Username,setUsername] = useState("")

  useEffect(()=>{
    (async()=>{
      const data = localStorage.getItem("chat-app-user")
      setUsername(JSON.parse(data).username)
    })()
    
  },[])
  
  return (
    <>
      <div className="cointainer flex justify-center items-center flex-col text-[white] font-bold text-[1.5rem]">
        <img className="h-[20rem]" src={robo} alt="robo" />
        <h1>
          Welcome <span className="text-[#4e00ff] ">{Username}!</span>
        </h1>
        <h3>Please Select a chat to Start Message.</h3>
      </div>
    </>
  );
}

export default Welcome;
