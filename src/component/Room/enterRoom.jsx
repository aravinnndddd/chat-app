import { Clipboard, CopyIcon } from "lucide-react";
import { useState } from "react";

export const EnterRoom = (props) => {
  const { roomInputRef, handleSignOut, setRoom } = props;
  const [password, setPassword] = useState("");

  // generate password

  const generateSecurePassword = (length = 12) => {
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
    const values = new Uint32Array(length);
    window.crypto.getRandomValues(values);
    return Array.from(values)
      .map((val) => charset[val % charset.length])
      .join("");
  };

  const handleGenerate = () => {
    setPassword(generateSecurePassword(14));
  };

  // Copytext

  const CopySwitch = ({ textToCopy }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
      navigator.clipboard
        .writeText(textToCopy)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000); // Reset after 2s
        })
        .catch((err) => console.error("Failed to copy:", err));
    };

    return (
      <>
        <div title={copied ? "Copied!" : "Click to copy"}>
          <CopyIcon
            onClick={handleCopy}
            className={`transition-all duration-300 cursor-pointer ${
              copied ? " text-[#FFD5A1]" : " text-white"
            }`}
          />
        </div>
      </>
    );
  };
  return (
    <div className="bg-[#323232] h-[100vh] flex justify-center items-center ">
      <div className="flex py-20 px-10 md:w-[60%] bg-[#1b1b1b] justify-center flex-col rounded-3xl">
        <label className="text-white flex">Create room:</label>

        <div className="flex items-center">
          <input
            className="h-[5vh] border-2 mr-2 border-[#FFE7D0] text-white rounded-2xl  px-2"
            ref={roomInputRef}
            value={password}
            readOnly
          />
          <CopySwitch textToCopy={password} />
        </div>
        <button
          className="bg-[#FFE7D0] flex  hover:bg-[#FFD5A1] mt-2 transition-all duration-300 ease w-fit rounded-2xl px-2 py-1"
          onClick={handleGenerate}
        >
          Generate code
        </button>

        <div className="mt-2">
          <label className="text-white">Join room</label>
          <div className="flex items-center ">
            <input
              ref={roomInputRef}
              className="h-[5vh] border-2 mr-2 border-[#FFE7D0] text-white rounded-2xl  px-2"
            />

            <button
              className="  w-[150px]  bg-[#323232]  text-[#ffe7d0] transition-all duration-600 ease rounded-3xl mt-1 p-2"
              onClick={() => setRoom(roomInputRef.current.value)}
            >
              Enter chat
            </button>
          </div>
        </div>

        <div className="flex items-end  justify-end mt-4">
          <button
            onClick={handleSignOut}
            className="   bg-[#323232]  text-[#fc6e20] transition-all duration-600 ease   w-[150px] mt-1 p-2 rounded-2xl cursor-pointer"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
};
