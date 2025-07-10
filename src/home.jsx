import { useRef, useState } from "react";

import Cookies from "universal-cookie";

import { signOut } from "firebase/auth";
import { auth } from "/src/firebase-config.js";
import { Auth } from "./component/Auth/Auth";
import { Chat } from "./component/Chat/Chat";
import { EnterRoom } from "./component/Room/enterRoom";

const cookies = new Cookies();
export const Home = () => {
  const [isAuth, setIsAuth] = useState(cookies.get("auth-token"));

  const [room, setRoom] = useState(null);
  const roomInputRef = useRef(null);
  const handleSignOut = async () => {
    await signOut(auth);
    cookies.remove("auth-token");
    setIsAuth(false);
    setRoom(null);
  };

  if (!isAuth) {
    return (
      <>
        <Auth setIsAuth={setIsAuth} />
      </>
    );
  } else
    return (
      <>
        {room ? (
          <Chat
            room={room}
            handleSignOut={handleSignOut}
            setRoom={setRoom}
            setIsAuth={setIsAuth}
          />
        ) : (
          <EnterRoom
            setRoom={setRoom}
            roomInputRef={roomInputRef}
            handleSignOut={handleSignOut}
          />
        )}
      </>
    );
};
