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

export const Chat = (props) => {
  const { room } = props;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
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
    <div className="flex items-center flex-col justify-center ">
      <h1 className="font-extrabold text-[1.5rem]">
        Welcome to {room.toUpperCase()}
      </h1>
      <div className=" rounded-4xl h-[80vh] overflow-auto w-[80%] bg-black/50 px-10 pb-5">
        {messages.map((message) => (
          <div key={message.id} className="flex items-center py-1 gap-2">
            <img
              src={message.userAvthr}
              alt="logo"
              className="rounded-full w-10"
            />
            <p className="font-semibold text-black">
              <span className="text-white font-bold ">{message.user} : </span>
              {message.text}
            </p>
            <div ref={bottomRef} />
          </div>
        ))}
      </div>
      <form
        className=" justify-center mt-2 flex w-[80%]"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="bg-green-800/20 h-[5vh] flex w-[80%] rounded-4xl px-5 "
        />
        <button
          type="submit"
          className="flex items-center bg-green-500 px-5 rounded-3xl"
        >
          <SendHorizontalIcon color="white" />
        </button>
      </form>
    </div>
  );
};
