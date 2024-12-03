import { avataaars } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";
import { useMemo, useState } from "react";
import { useSession } from "../contexts/SessionContext";
import { saveAvatar } from "../supabase/userCustomizationOwnershipService";
import { useNavigate } from "react-router-dom";

const seedList = [
  "Jocelyn",
  "Andrea",
  "Katherine",
  "Aiden",
  "Jameson",
  "Sophia",
  "Mason",
  "Jade",
  "Alexander",
  "Oliver",
  "Kingston",
  "Maria",
  "Leo",
  "Brian",
  "Aidan",
];

function CharacterCreation() {
  const navigate = useNavigate();
  const { session } = useSession();
  const [seed, setSeed] = useState(() => {
    return Math.floor(Math.random() * seedList.length);
  });
  const [avatarName, setAvatarName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const avatar = useMemo(() => {
    return createAvatar(avataaars, {
      seed: seedList[seed],
      backgroundColor: ["ef4444"],
      skinColor: ["d08b5b"],
      accessoriesProbability: 100,
    });
  }, [seed]);

  const handleAvatarChange = (direction: string) => {
    setSeed((seed) => {
      if (direction === "right") return (seed + 1) % seedList.length;
      else if (seed === 0) return seedList.length - 1;
      else return (seed - 1) % seedList.length;
    });
  };

  const handleSaveAvatar = () => {
    // Check if avatar name is empty and set error message
    if (avatarName.length === 0) {
      setErrorMessage("Avatar name cannot be empty");
      return;
    }

    // Save avatar if name is nonempty
    saveAvatar(avatar.toJson().extra, session?.user.id as string, avatarName)
      .then(() => {
        // Clear error message if save is successful
        setErrorMessage("");
        // Redirect to dashboard
        navigate("/dashboard");
      })
      .catch((error) => {
        // Handle any errors and show a message
        console.error("Failed to save avatar:", error);
        setErrorMessage("An error occurred while saving the avatar.");
      });
  };

  return (
    <div className="mx-auto h-screen w-[700px]">
      <div className="flex flex-col items-center">
        {/* Character Creation Title */}
        <h1 className="mb-6 font-mono text-3xl font-semibold">
          Character Creation
        </h1>

        <figure className="flex items-center">
          {/* Left Arrow */}
          <button
            onClick={() => handleAvatarChange("left")}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <div
              className="h-0 w-0 border-b-8 border-l-8 border-r-8 border-b-gray-800 border-l-transparent border-r-transparent"
              style={{ transform: "rotate(270deg)" }}
            />
          </button>

          <img src={avatar.toDataUri()} alt="avatar" className="w-72" />

          {/* Right Arrow */}
          <button
            onClick={() => handleAvatarChange("right")}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <div
              className="h-0 w-0 border-b-8 border-l-8 border-r-8 border-b-gray-800 border-l-transparent border-r-transparent"
              style={{ transform: "rotate(90deg)" }}
            />
          </button>
        </figure>

        {/* Avatar Name Input */}
        <input
          type="text"
          placeholder="Enter Avatar Name"
          className="rounded-lg border-2 border-blue-300 bg-blue-100 px-4 py-2 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={avatarName}
          onChange={(e) => setAvatarName(e.target.value)}
        />

        {errorMessage && (
          <div className="mt-2 text-red-500">{errorMessage}</div>
        )}

        {/* Save Avatar Button */}
        <button
          onClick={handleSaveAvatar}
          className="mt-4 rounded-lg bg-green-500 px-6 py-3 font-mono font-semibold text-white transition duration-200 hover:bg-green-600"
        >
          Save Avatar
        </button>
      </div>
    </div>
  );
}

export default CharacterCreation;
