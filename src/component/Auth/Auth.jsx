import { auth, provider } from "../../firebase-config.js";
import { signInWithPopup } from "firebase/auth";
import Cookies from "universal-cookie";
import SvgComponent from "./svgComp.jsx";

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
    <div className="h-[100vh] bg-[#FFE7D0]">
      <div className="bg-[#323232] text-[#FC6E20]  flex items-center justify-between px-20 h-[10vh]">
        <div className="flex font-extrabold">TalkRoom</div>{" "}
        <ul className="flex gap-5 font-bold">
          <li className="p-2">Developer</li>
          <li className="p-2">Feedbacks</li>
          <li className="p-2">Donate</li>

          <button
            className="text-[#FFE7D0] bg-[#FC6E20] rounded-2xl px-2 cursor-pointer"
            onClick={signInWithGoogle}
          >
            Sign In
          </button>
        </ul>
      </div>
      <div className="flex flex-row w-full h-[90vh]">
        <div className="w-[50%] flex   items-center px-20">
          <div className="text-[#1B1B1B]">
            <span className="text-[#323232] text-[2rem] font-extrabold">
              TalkRoom — Just Vibes, No Limits
            </span>{" "}
            <br />
            Group chat that’s all fun & flow. TalkRoom is the perfect spot to
            laugh, vent, plan, or go full chaos with your crew. Create your own
            room, bring your people, and keep the convo rolling.
            <button
              onClick={signInWithGoogle}
              className="flex px-4 py-2 mt-4 rounded-2xl cursor-pointer bg-[#FC6E20] text-[#FFE7D0]"
            >
              Get started
            </button>
          </div>
        </div>

        <div className="w-[50%] flex">
          <SvgComponent />
        </div>
      </div>
    </div>
  );
};
