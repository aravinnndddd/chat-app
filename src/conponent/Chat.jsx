import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { auth, db } from "../firebase-config";
import { SendHorizontalIcon } from "lucide-react";
import { signOut } from "firebase/auth";
import Cookies from "universal-cookie";
const cookies = new Cookies();
export const Chat = (props) => {
  const { room, setIsAuth, setRoom } = props;
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
      console.log(messages);
      setMessages(messages);
    });

    return () => unsuscribe();
  }, []);
  const handleSignOut = async () => {
    await signOut(auth);
    cookies.remove("auth-token");
    setIsAuth(false);

    setRoom(null);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (newMessage === "") return;
    await addDoc(messagesRef, {
      text: newMessage,
      createdAt: serverTimestamp(),
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

  return (
    <>
      <div>
        <div className="flex justify-between items-end fixed top-0 h-[10vh] py-2 px-10 bg-black/50 w-full backdrop-blur-md">
          <h1 className="font-extrabold text-[1.5rem] px-10 text-white">
            You are in {room}
          </h1>
          <img
            onClick={() => setShowProfile(!showProfile)}
            src={auth.currentUser.photoURL}
            className="w-[50px] rounded-full cursor-pointer"
            alt="profile"
          />
          {showProfile && (
            <div className="absolute top-[100%] mt-[5px] flex right-[20px] backdrop-blur-md bg-black/35 justify-center w-[200px] h-[10vh] rounded-3xl items-center">
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
      <div className="flex items-center flex-col bg-black/50 justify-start pt-[10vh] pb-[15vh] min-h-screen">
        <div className="w-full overflow-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className=" mt-5 flex items-center py-1 px-10 gap-2"
            >
              <img
                src={message.userAvthr}
                alt="logo"
                className="rounded-full w-10"
              />
              <div className="font-semibold text-black flex flex-col">
                <span className="text-white font-bold">{message.user} :</span>
                <span className="bg-black/20 mx-[10px] px-4 py-[5px] rounded-3xl w-fit mt-1 break-words max-w-[300px]">
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
            className="bg-white/50 backdrop-blur-md h-[8vh] border-2 border-black flex w-[80%] rounded-l-4xl "
          />
          <button
            type="submit"
            className="flex items-center bg-green-500 px-7 border-2 border-black rounded-r-3xl"
          >
            <SendHorizontalIcon color="white" />
          </button>
        </form>
      </div>
    </>
  );
};
