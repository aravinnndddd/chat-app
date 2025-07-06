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
      <p className="flex mb-5"> Sign In With Google To Continue </p>
      <button
        className="flex items-center justify-center p-2 cursor-pointer bg-green-600 w-20 rounded-3xl"
        onClick={signInWithGoogle}
      >
        Sign In
      </button>
    </div>
  );
};
