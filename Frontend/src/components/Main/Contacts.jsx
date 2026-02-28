import { useState, useEffect, useRef } from "react";
import Logo from "../../assets/logo.svg";
import { api } from "../../api/axios";
import { allUsers } from "../../utils/ApiRoutes";
// import { FiSearch } from "react-icons/fi";
import { IoSearchSharp } from "react-icons/io5";

function Contacts({ contacts, curruser, currchat, onlineUser, setcontact }) {
  const [currUsername, setcurrUsername] = useState(undefined);
  const [currUserImage, setcurrUserImage] = useState(undefined);
  const [currSelected, setcurrSelected] = useState(0);
  const countRef = useRef(false);
  const [searchuser, setSearchUser] = useState("");
  const [nofriends, setNoFriends] = useState(false);

  useEffect(() => {
    if (curruser) {
      setcurrUserImage(curruser.avatarImage);
      setcurrUsername(curruser.username);
    }
  }, [curruser]);

  useEffect(() => {
    if (!countRef.current && contacts.length > 0) {
      currchat(contacts[0]);
      countRef.current = true;
    }
  }, [contacts, currchat]);

  const changeCurrChat = (index, contact) => {
    setcurrSelected(index);
    currchat(contact);
  };

  const searchFriends = async (event) => {
    const values = event.target.value;
    setSearchUser(event.target.value);
    const friends = await api.post("/api/auth/searchUser", {
      name: values,
      currentUserId: curruser._id,
    });

    if (friends.data && values !== "") {
      setNoFriends(false);
      setcontact(friends.data);
    } else if (values === "") {
      setNoFriends(false);

      const data = await api.get(`${allUsers}/${curruser._id}`);
      setcontact(data.data);
    } else {
      setcontact(false)
      setNoFriends(true);
    }
  };

  return (
    <>
      {currUserImage && currUsername && (
        <div className="cointainer grid grid-rows-[10%_8%_72%_10%] overflow-hidden bg-black/20 backdrop-blur-sm">
          <div className="Brand flex items-center ml-8 gap-3 py-4">
            <img className="h-10 w-10" src={Logo} alt="logo" />
            <h3 className="text-white uppercase font-extrabold text-2xl tracking-wide">
              SuperChat
            </h3>
          </div>

          <div className="search flex justify-center items-center border-t border-[#1E293B] p-3">
            <div className="serachbar flex items-center gap-3 bg-[hsl(218,15%,14%)] backdrop-blur-sm rounded-full px-4 py-2 w-[90%]">
              <IoSearchSharp size={20} className="text-white" />
              <input
                className="flex-1 bg-transparent placeholder-gray-400 text-white focus:outline-none"
                type="text"
                value={searchuser}
                onChange={searchFriends}
                placeholder="Search Conversations.."
              />
            </div>
          </div>

          <div className="contacts flex flex-col items-center overflow-auto gap-3 custom-scrollbar pt-4">
            {contacts && contacts.map((contact, index) => {
              const onlineusers = new Set(onlineUser);
              let isOnline = onlineusers.has(contact._id);

              return (
                <div
                  className={`flex items-center justify-between w-[90%] p-2 rounded-xl transition-colors duration-100 cursor-pointer ${
                    index === currSelected
                      ? "bg-gradient-to-r from-[#4e0eff]/40 to-[#6c4dff]/40"
                      : "hover:bg-[hsl(222,15%,13%)]"
                  }`}
                  key={index}
                  onClick={() => {
                    changeCurrChat(index, contact);
                  }}
                >
                  <div className="avatar_username flex items-center gap-3">
                    <img
                      className="h-14 w-14 rounded-full"
                      src={contact.avatarImage}
                      alt="avatar"
                    />
                    <h3 className="text-white text-lg font-medium">
                      {contact.username}
                    </h3>
                  </div>

                  <div
                    className={`online w-3 h-3 rounded-full ${
                      isOnline ? "bg-green-400" : ""
                    }`}
                  ></div>
                </div>
              );
            })}
          </div>

          {nofriends && (
            <div className="absolute left-[8rem] top-[4rem] w-[39%] h-[51%] flex justify-center items-center  text-gray-400 ">
              --- No Conversation ---
            </div>
          )}

          <div className="current-user bg-[hsl(218,14%,11%)] backdrop-blur-sm w-[100%] flex items-center gap-4 px-6 py-4 rounded-2xl">
            <img
              className="h-14 w-14 rounded-full"
              src={currUserImage}
              alt="avatar"
            />
            <div className="username">
              <h2 className="text-white text-lg font-semibold">
                {currUsername}
              </h2>
              <h2 className="text-green-400 text-sm">🟢 Online</h2>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Contacts;
