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
          <Chat room={room} setRoom={setRoom} setIsAuth={setIsAuth} />
        ) : (
          <div className="bg-black/30 h-[100vh] flex justify-center items-center ">
            <div className="flex p-10 md:w-[40%] h-[50vh] bg-white justify-center flex-col rounded-3xl ">
              <label>Enter room name:</label>
              <input
                className="h-[5vh] border-2 border-black rounded-2xl  px-2"
                ref={roomInputRef}
              />{" "}
              <div className="flex items-center justify-evenly mt-4">
                <button
                  className=" border-2 border-black w-[150px]  hover:bg-green-400 hover:border-white hover:text-white transition-all duration-600 ease rounded-3xl mt-1 p-2"
                  onClick={() => setRoom(roomInputRef.current.value)}
                >
                  Enter chat
                </button>
                <button
                  onClick={handleSignOut}
                  className=" hover:bg-red-400 hover:border-white hover:text-white transition-all duration-600 ease border-2 border-red-600 w-[150px] mt-1 p-2 rounded-2xl cursor-pointer"
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
}
export default App;
