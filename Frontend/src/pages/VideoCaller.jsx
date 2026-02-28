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
      <div className="relative w-screen h-screen bg-gradient-to-br from-[#071226] via-[#0b1220] to-[#0f1724]">
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />

        <video
          ref={localVideoRef}
          autoPlay
          playsInline
          muted
          className="absolute bottom-12 right-8 w-64 aspect-video rounded-2xl border-2 border-white shadow-[0_10px_30px_rgba(0,0,0,0.8)] object-cover"
        />
      </div>

      <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2">
        <div className="bg-black/40 backdrop-blur-md rounded-3xl px-12 py-6 border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.6)]">
          <div className="flex items-end justify-center gap-8">
            <div className="flex flex-col items-center gap-3 cursor-pointer group" onClick={handle_Video}>
              <div className="p-4 rounded-2xl bg-gradient-to-br from-gray-700 to-gray-800 group-hover:from-gray-600 group-hover:to-gray-700 transition-all shadow-lg">
                {video ? (
                  <BsCameraVideoOffFill size={28} fill="white" />
                ) : (
                  <BsCameraVideo size={28} fill="white" />
                )}
              </div>
              <span className="text-white text-sm font-medium">{video ? "Camera Off" : "Camera On"}</span>
            </div>

            <div className="flex flex-col items-center gap-3 cursor-pointer group" onClick={handle_mic}>
              <div className="p-4 rounded-2xl bg-gradient-to-br from-gray-700 to-gray-800 group-hover:from-gray-600 group-hover:to-gray-700 transition-all shadow-lg">
                {mic ? (
                  <MdMicOff size={28} fill="white" />
                ) : (
                  <MdMicNone size={28} fill="white" />
                )}
              </div>
              <span className="text-white text-sm font-medium">{mic ? "Mic Off" : "Mic On"}</span>
            </div>

            <div className="flex flex-col items-center gap-3 cursor-pointer group" onClick={handle_end_call}>
              <div className="p-4 rounded-2xl bg-gradient-to-br from-red-600 to-red-700 group-hover:from-red-500 group-hover:to-red-600 transition-all shadow-lg">
                <MdCallEnd size={28} fill="white" />
              </div>
              <span className="text-white text-sm font-medium">End Call</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default VideoCall;