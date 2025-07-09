import { auth, provider } from "../firebase-config.js";
import { signInWithPopup } from "firebase/auth";

import Cookies from "universal-cookie";

const cookies = new Cookies();

export const Auth = ({ setIsAuth }) => {
  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      cookies.set("auth-token", result.user.refreshToken);
      setIsAuth(true);
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div className="flex items-center flex-col justify-center h-[100vh]  bg-black/30 w-full">
      <div className="w-[60%] flex  items-center flex-col justify-center bg-white h-[40vh] p-10 rounded-2xl">
        <button
          className="flex items-center justify-center p-2 cursor-pointer bg-white border-2 border-black w-[120px] px-5 gap-[5px] rounded-3xl  hover:bg-black hover:text-white transition-all duration-600 ease"
          onClick={signInWithGoogle}
        >
          <img
            className="w-5 h-5"
            src="../src/assets/google-icon.svg"
            alt="Google Logo"
          />
          Sign In
        </button>
      </div>
    </div>
  );
};
