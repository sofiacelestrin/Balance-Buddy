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

//TODO: Implement logic for inserting data into users table where we insert the avatar name given by the user. Additionally, I need to examine the list of all active style options on the user's avatar and match each customization option to a row from the customization_options table. The id for each customization option is needed to then make the insertion into user_customization_ownership table. After completing this, test the functionality by recreating the exact same avatar for a user in the dashboard page. The same style options on the avatar when the finished building his avatar in the initial phase has to be successfully recreated in the dashboard page. After doing this, I need to add all the tuples for all the different customization options
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
        <h1 className="text-3xl font-semibold mb-6 font-mono">Character Creation</h1>

        <figure className="flex items-center">

          {/* Left Arrow */} 
          <button
            onClick={() => handleAvatarChange("left")}
            className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <div
              className="w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-b-8 border-b-gray-800"
              style={{ transform: 'rotate(270deg)' }}
            />
          </button>

          <img src={avatar.toDataUri()} alt="avatar" className="w-72" />

          {/* Right Arrow */} 
          <button
            onClick={() => handleAvatarChange("left")}
            className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <div
              className="w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-b-8 border-b-gray-800"
              style={{ transform: 'rotate(90deg)' }}
            />
          </button>
        </figure>

        {/* Avatar Name Input */}
        <input
          type="text"
          placeholder="Enter Avatar Name"
          className="bg-blue-100 px-4 py-2 rounded-lg border-2 border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
          value={avatarName}
          onChange={(e) => setAvatarName(e.target.value)}
        />

        {errorMessage && (
          <div className="text-red-500 mt-2">{errorMessage}</div>
        )}

        {/* Save Avatar Button */}
        <button
          onClick={handleSaveAvatar}
          className="px-6 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition duration-200 mt-4 font-mono"
        >
          Save Avatar
        </button>
      </div>
    </div>
  );
}

export default CharacterCreation;