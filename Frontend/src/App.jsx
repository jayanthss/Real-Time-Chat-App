import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/register";
import Login from "./pages/login";
import Chat from "./pages/chat";
import SetAvatar from "./pages/setAvatar";
import VideoCall from "./pages/VideoCaller";
import PageNotFound from "./Error_Components/PageNotFound";
import ServerDownPage from "./Error_Components/serverDown";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/setAvatar" element={<SetAvatar />} />
        <Route path="/" element={<Chat />} />
        <Route path="/VideoCall/:chatchatId" element={<VideoCall />} />
        <Route path="/server-down" element={<ServerDownPage/>} />
        <Route path="*" element={<PageNotFound/>} />
      </Routes>
    </BrowserRouter>
  );
}
