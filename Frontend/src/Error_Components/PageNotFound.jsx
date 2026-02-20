import { useNavigate } from "react-router-dom";

function PageNotFound() {

  const navigate = useNavigate();

  return (
    <div className="h-screen w-screen bg-[#131324] flex flex-col justify-center items-center text-white gap-6">

      <h1 className="text-7xl font-bold text-[#4e0eff]">404</h1>

      <p className="text-xl text-gray-300">
        Page you are looking for does not exist.
      </p>

      <button
        onClick={() => navigate("/")}
        className="bg-[#4e0eff] px-6 py-3 rounded-lg hover:bg-[#3b0bd6] transition"
      >
        Go Back Home
      </button>

    </div>
  );
}

export default PageNotFound;
