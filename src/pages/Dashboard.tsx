import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSession } from "../contexts/SessionContext";
import { supabase } from "../supabase/supabase";
import { getCustomizationOptionsOwnership } from "../supabase/userCustomizationOwnershipService";
import TodoList from "./TodoList";
import { createAvatar, Result } from "@dicebear/core";
import { avataaars } from "@dicebear/collection";

function Dashboard() {
  //If you need the current session, use the useSession hook
  const { session } = useSession();
  const [avatarOptions, setAvatarOptions] = useState({});
  const [isLoadingAvatar, setIsLoadingAvatar] = useState(true);

  let userAvatar: Result;
  if (!isLoadingAvatar) {
    userAvatar = createAvatar(avataaars, {
      seed: "Jocelyn",
      accessories: [`${avatarOptions.accessories}`],
      //exclude the # at the beginning
      backgroundColor: [avatarOptions.backgroundColor.slice(1)],
      accessoriesProbability: avatarOptions.accessories ? 100 : 0,
      accessoriesColor: [avatarOptions.accessoriesColor.slice(1)],
      clothesColor: [avatarOptions.clothesColor.slice(1)],
      clothing: [avatarOptions.clothing],
    });
  }

  async function signOutUser() {
    const { error } = await supabase.auth.signOut();
    console.log(error);
  }

  useEffect(() => {
    async function getAvatarStyleSettings() {
      setIsLoadingAvatar(true);
      const customizationOptions = await getCustomizationOptionsOwnership(
        session?.user.id as string,
      );

      if (!customizationOptions) return;

      const options = customizationOptions.reduce(
        (avatarOptions, option) => {
          const category = option?.category as string;
          const optionValue = option?.option_value as string;
          avatarOptions[category] = optionValue;
          return avatarOptions;
        },
        {} as Record<string, string>,
      );

      setAvatarOptions(options);
      setIsLoadingAvatar(false);
    }
    getAvatarStyleSettings();
  }, [session?.user.id]);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="mb-6 text-4xl font-bold">Dashboard</h1>
      <h1>Welcome {session?.user.email}</h1>
      <button className="bg-red-400 p-4 text-white" onClick={signOutUser}>
        LOG OUT
      </button>
      {!isLoadingAvatar && (
        <img src={userAvatar.toDataUri()} alt="avatar" className="w-28" />
      )}
      <Link to="/login">Login Page</Link>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* TodoList component */}
        <div className="col-span-1">
          <TodoList />
        </div>

        {/* Messages from character - WIP */}
        <div className="col-span-1 rounded bg-white p-6 shadow-lg">
          <h2 className="mb-4 text-2xl font-bold">Messages</h2>
          <p>No new messages.</p>
        </div>

        {/* Character stats - WIP */}
        <div className="col-span-1 rounded bg-white p-6 shadow-lg">
          <h2 className="mb-4 text-2xl font-bold">Stats</h2>
          <p>Current character stats will be displayed here.</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
