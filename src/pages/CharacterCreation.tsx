import { avataaars } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";
import { useMemo, useState } from "react";
import { useSession } from "../contexts/SessionContext";
import { saveAvatar } from "../supabase/userCustomizationOwnershipService";

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
  const { session } = useSession();
  const [seed, setSeed] = useState(() => {
    return Math.floor(Math.random() * seedList.length);
  });
  const [avatarName, setAvatarName] = useState("");

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
    //TODO display error message if avatar name is empty
    if (avatarName.length === 0) return;
    saveAvatar(avatar.toJson().extra, session?.user.id as string, avatarName);
  };

  return (
    <div className="mx-auto h-screen w-[700px]">
      <div className="flex flex-col items-center">
        <h1>Character Creation</h1>
        <figure className="flex items-center">
          <button onClick={() => handleAvatarChange("left")}>{"<"}</button>
          <img src={avatar.toDataUri()} alt="avatar" className="w-72" />
          <button onClick={() => handleAvatarChange("right")}>{">"}</button>
        </figure>
        <input
          type="text"
          placeholder="avatar name"
          className="bg-blue-100"
          value={avatarName}
          onChange={(e) => setAvatarName(e.target.value)}
        />
        <button onClick={handleSaveAvatar}>Save Avatar</button>
      </div>
    </div>
  );
}

export default CharacterCreation;