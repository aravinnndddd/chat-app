import { useRef, useState } from "react";
import { Auth } from "./conponent/Auth";
import Cookies from "universal-cookie";
import { Chat } from "./conponent/Chat";
import { signOut } from "firebase/auth";
import { auth } from "./firebase-config";
const cookies = new Cookies();
function App() {
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
          <Chat room={room} />
        ) : (
          <div className="bg-black/30 h-50vh] items-center ">
            <div className="flex p-10  flex-col items-center">
              <label>Enter room name:</label>
              <input
                className="h-[5vh] rounded-2xl bg-green-500 w-[30%] px-2"
                ref={roomInputRef}
              />{" "}
              <button
                className="bg-green-700 rounded-3xl mt-1 p-2"
                onClick={() => setRoom(roomInputRef.current.value)}
              >
                Enter chat
              </button>
            </div>
          </div>
        )}
        <div className="relative top-1 left-50 translate-x-1/2  justify-center">
          <button
            onClick={handleSignOut}
            className="bg-red-400 p-2 mt-4 rounded-2xl text-white cursor-pointer"
          >
            Sign out
          </button>
        </div>
      </>
    );
}
export default App;
