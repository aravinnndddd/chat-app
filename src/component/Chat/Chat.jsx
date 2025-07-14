import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  where,
} from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { auth, db } from "../../firebase-config";
import { CopyIcon, SendHorizontalIcon } from "lucide-react";
export const Chat = (props) => {
  const { room, setRoom, handleSignOut } = props;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const messagesRef = collection(db, "messages");

  useEffect(() => {
    const queryMessages = query(
      messagesRef,
      where("room", "==", room),
      orderBy("createdAt")
    );
    const unsuscribe = onSnapshot(queryMessages, (snapshot) => {
      let messages = [];
      snapshot.forEach((doc) => {
        messages.push({ ...doc.data(), id: doc.id });
      });

      setMessages(messages);
    });

    return () => unsuscribe();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (newMessage === "") return;
    await addDoc(messagesRef, {
      text: newMessage,
  
      createdAt: Timestamp.now(),
      user: auth.currentUser.displayName,
      userAvthr: auth.currentUser.photoURL,

      room,
    });

    setNewMessage("");
  };
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  const CopySwitch = ({ textToCopy }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
      navigator.clipboard.writeText(textToCopy).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Reset after 2s
      });
    };
    return (
      <CopyIcon
        onClick={handleCopy}
        className={`transition-all duration-300 cursor-pointer ${
          copied ? " text-[#FFD5A1]" : " text-white"
        }`}
      />
    );
  };

  return (
    <>
      <div>
        <div className="flex justify-between items-end fixed top-0 h-[10vh] py-2 px-10 bg-black/50 w-full backdrop-blur-md">
          <h1 className="font-extrabold flex items-center text-[1.2rem] md:text-[1.5rem] md:px-10 text-white">
            Copy your secret Key{" "}
            <span className="ml-2">
              {" "}
              <CopySwitch textToCopy={room} />
            </span>
          </h1>
          <img
            onClick={() => setShowProfile(!showProfile)}
            src={auth.currentUser.photoURL}
            className="w-[50px] rounded-full cursor-pointer"
            alt="profile"
          />
          {showProfile && (
            <div className="absolute top-[100%] mt-[5px] p-5 flex flex-col right-[20px] backdrop-blur-md bg-black/35 justify-center w-[200px]  rounded-3xl items-center">
              <button
                onClick={() => setRoom(null)}
                className=" hover:bg-black/50 hover:border-white text-white transition-all duration-600 ease border-2  w-[150px] mt-1 p-2  h-fit rounded-2xl cursor-pointer"
              >
                Exit room
              </button>
              <button
                onClick={handleSignOut}
                className=" hover:bg-black/50 hover:border-white text-white transition-all duration-600 ease border-2  w-[150px] mt-1 p-2  h-fit rounded-2xl cursor-pointer"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center flex-col bg-[#131313] overflow-x-hidden justify-start pt-[10vh] pb-[15vh] min-h-screen">
        <div className="w-full overflow-auto ">
          {messages.map((message) => (
            <div
              key={message.id}
              className=" mt-5 flex items-center py-1 px-5 gap-2"
            >
              <div className="font-semibold flex flex-col">
                <div className="flex items-center gap-1.5">
                  <img
                    src={message.userAvthr}
                    alt="logo"
                    className="rounded-full flex w-10"
                  />
                  <span className="text-[#fc6e20] flex font-bold">
                    {message.user} :
                    <span className=" ml-3 text-[#323232] font-normal">
                      {" "}
                      {message.createdAt.toDate().toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </span>
                </div>
                <span className="bg-[#323232] mx-[50px] px-[15px] py-[15px] text-[#dddddd]  rounded-3xl  w-[280px] mt-1 break-words md:w-[500px] ">
                  {message.text}
                </span>
              </div>

              <div ref={bottomRef} />
            </div>
          ))}
        </div>
        <form
          className=" justify-center mt-50 mb-[30px] w-full fixed bottom-0 flex "
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="bg-[#323232]/50 backdrop-blur-md h-[6vh] border-2 px-10 text-white border-[#ffe7d0] flex w-[80%] md:w-[50%] rounded-3xl md:justify-end"
          />
          <button
            type="submit"
            className="flex items-center bg-[#fc6e20] px-7 border-2 border-[#ffe7d0] rounded-3xl"
          >
            <SendHorizontalIcon color="white" />
          </button>
        </form>
      </div>
    </>
  );
};
