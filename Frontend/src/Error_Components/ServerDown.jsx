import serverDownImg from "../assets/Server-down.jpg";
import { useNavigate } from "react-router-dom";

function ServerDownPage() {

  const navigate = useNavigate();

  const retry = () => {
    navigate("/")
  };

  return (
    <div className="h-screen w-screen bg-[#131324] flex flex-col items-center justify-center text-white px-6">

      <img
        src={serverDownImg}
        alt="Server Down"
        className="w-[240px] mb-10 rounded-2xl"
      />

      <h1 className="text-4xl font-bold text-[#4e0eff] mb-4">
        Server Unavailable
      </h1>

      <p className="text-gray-300 text-center max-w-lg mb-8">
        We are unable to connect to the backend server.
        The service may be restarting or temporarily offline.
      </p>

      <button
        onClick={retry}
        className="bg-[#4e0eff] px-6 py-3 rounded-lg hover:bg-[#3b0bd6] transition"
      >
        Try Again
      </button>

    </div>
  );
}

export default ServerDownPage;
