import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { io } from "socket.io-client";
import { host } from "../utils/ApiRoutes";
import { MdCallEnd } from "react-icons/md";
import { BsCameraVideo } from "react-icons/bs";
import { BsCameraVideoOffFill } from "react-icons/bs";
import { MdMicNone } from "react-icons/md";
import { MdMicOff } from "react-icons/md";

function VideoCall() {
  const navigate = useNavigate();
  const [userStatus, setuserStatus] = useState(false);
  const socketRef = useRef(null);
  const loaction = useLocation();
  const roomId = 10;
  const role = loaction.state.roles;

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const config = useRef({
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  });
  let peerConnectionRef = useRef(null);
  let localStreamRef = useRef(null);
  const currchat = useParams();

  // useref for mic
  let [mic, setmic] = useState(false);
  let [video, setVideo] = useState(false);

  useEffect(() => {
    // console.log(`Roles = ${role}`);

    const socket = io(host);
    socketRef.current = socket;

    const handleReject = () => {
      // console.log("inside the request reject");

      peerConnectionRef.current?.close();
      peerConnectionRef.current = null;

      if (localStreamRef) {
        localStreamRef.current?.getTracks().forEach((t) => t.stop());
        // console.log(`getting video ${localStreamRef.current.getVideoTracks()}`);
      }
      // console.log(localStreamRef.current.getTracks().map((t) => t.readyState));
      localStreamRef.current = null;

      socket.emit("call-reject-msg", socket.id);

      socket.disconnect();

      navigate(-1);
    };

    socket.on("request_Reject", handleReject);

    const curruser = JSON.parse(localStorage.getItem("chat-app-user"));
    socket.emit("video-call", {
      caller: curruser._id,
      reciver: currchat.chatchatId,
    });

    return () => {
      socket.off("request_Reject", handleReject);
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!role && !socketRef.current) return;

    const socket = socketRef.current;

    socket.emit("join-room", roomId);

    socketRef.current.on("request_Reject", (msg) => {
      // console.log("inside the request reject");
      navigate("/");
    });

    const startCall = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 60 },
          facingMode: "user",
        },
        audio: true,
      });
      // console.log("local streams : ", stream);

      localVideoRef.current.srcObject = stream;
      localStreamRef.current = stream;

      peerConnectionRef.current = new RTCPeerConnection(config.current);

      stream.getTracks().forEach((track) => {
        peerConnectionRef.current.addTrack(track, stream);
      });

      peerConnectionRef.current.ontrack = (e) => {
        remoteVideoRef.current.srcObject = e.streams[0];
        remoteVideoRef.current.play().catch(() => {});


        remoteVideoRef.current.onloadedmetadata = () => {
          remoteVideoRef.current.play();
          remoteVideoRef.current.play().catch(() => {});
        };
      };

      peerConnectionRef.current.onicecandidate = (e) => {
        if (e.candidate) {
          socket.emit("ice-candidate", roomId, e.candidate);
        }
      };

      if (role === "receiver") {
        socket.emit("ready-to-get-offer", roomId);
      }
    };
    startCall();

    socket.on("reciver-ready", async (msg) => {
      if (role === "caller") {
        const offer = await peerConnectionRef.current.createOffer();
        await peerConnectionRef.current.setLocalDescription(offer);
        socket.emit("offer", roomId, offer);
      } else {
        return;
      }
    });

    socket.on("offer", async (offer) => {
      if (role === "receiver") {
        await peerConnectionRef.current.setRemoteDescription(offer);

        const answer = await peerConnectionRef.current.createAnswer();
        await peerConnectionRef.current.setLocalDescription(answer);
        socket.emit("answer", roomId, answer);
      } else {
        return;
      }
    });

    socket.on("answer", async (answer) => {
      if (role === "caller") {
        await peerConnectionRef.current.setRemoteDescription(answer);
      }
    });

    socket.on("candiate", async (candidate) => {
      try {
        if (!peerConnectionRef.current) return;
        await peerConnectionRef.current.addIceCandidate(candidate);
      } catch (er) {}
    });

    return () => {
      socket.off("offer");
      socket.off("answer");
      socket.off("ice-candidate");

      peerConnectionRef.current?.close();
      peerConnectionRef.current = null;

      localStreamRef.current?.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    };
  }, []);

  const handle_mic = () => {
    setmic(!mic);
    const AudioTrack = localStreamRef.current?.getAudioTracks()[0];
    if (!AudioTrack) return;

    AudioTrack.enabled = !AudioTrack.enabled;
  };
  const handle_Video = () => {
    setVideo(!video);
    const videoTrack = localStreamRef.current?.getVideoTracks()[0];
    if (!videoTrack) return;

    videoTrack.enabled = !videoTrack.enabled;
  };
  const handle_end_call = () => {
    peerConnectionRef.current?.close();
    peerConnectionRef.current = null;

    if (localStreamRef) {
      localStreamRef.current?.getTracks().forEach((t) => t.stop());
    }

    navigate(-1);
  };

  return (
    <>
      {/* <h1 className={userStatus ? "bg-red-600" : "bg-green-900"}>Welcome to Video--Call ✅✅✅</h1> */}

      <div className="relative w-screen h-screen bg-black">
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-full h-full object-fill bg-black"
        />

        <video
          ref={localVideoRef}
          autoPlay
          playsInline
          muted
          className="
    absolute bottom-6 right-6
    w-[18rem] aspect-video
    rounded-xl
    border border-gray-400
    object-fill
    bg-black
  "
        />
      </div>

      <div className="absolute bottom-[3rem] bg-transparent buttons w-[100vw] h-[10vh] flex justify-center ">
        <div className="icons bg-gray-700 bg-opacity-[80%] rounded-2xl w-[45vw] h-[12vh] flex justify-center gap-6 items-center">
          <div
            className="muteVideo  flex flex-col gap-0.3 items-center"
            onClick={handle_Video}
          >
            <div className="video-mute p-[1rem] cursor-pointer rounded-2xl w-[3.9rem] h-[2.6rem] flex justify-center items-center">
              {video ? (
                <BsCameraVideoOffFill size={"2.9rem"} fill="white" />
              ) : (
                <BsCameraVideo size={"2.9rem"} fill="white" />
              )}
            </div>
            <div className="video-mute  text-white text-[13px]">Video Mute</div>
          </div>

          <div
            className="muteAduio flex flex-col gap-1 items-center"
            onClick={handle_mic}
          >
            <div className="mute-audio p-[1rem] cursor-pointer rounded-2xl w-[3.9rem] h-[2.6rem] flex justify-center items-center  ">
              {mic ? (
                <MdMicOff size={"2.9rem"} fill="white" />
              ) : (
                <MdMicNone size={"2.9rem"} fill="white" />
              )}
            </div>
            <div className="text-mute text-white text-[13px]">Mute</div>
          </div>

          <div className="endcall flex flex-col gap-1 items-center">
            <div
              className="end-call  cursor-pointer rounded-2xl w-[3.8rem] h-[2.6rem] flex justify-center items-center bg-red-500"
              onClick={handle_end_call}
            >
              <MdCallEnd size={"1.8rem"} fill="white" />
            </div>
            <div className="text-end text-white text-[13px]">End Call</div>
          </div>
        </div>
      </div>
    </>
  );
}

export default VideoCall;