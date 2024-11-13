import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSession } from "../contexts/SessionContext";
import { supabase } from "../supabase/supabase";
import { getCustomizationOptionsOwnership } from "../supabase/userCustomizationOwnershipService";
import TodoList from "./TodoList";
import { createAvatar, Result } from "@dicebear/core";
import { avataaars } from "@dicebear/collection";
import HamburgerBars from "../components/icons/HamburgerBars";
import HomeSidebar from "../components/HomeSidebar";

function Dashboard() {
  //If you need the current session, use the useSession hook
  const { session } = useSession();
  const [avatarOptions, setAvatarOptions] = useState({});
  const [isLoadingAvatar, setIsLoadingAvatar] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  let userAvatar: Result;
  if (!isLoadingAvatar) {
    userAvatar = createAvatar(avataaars, {
      accessories: [`${avatarOptions.accessories}`],
      //exclude the # at the beginning
      backgroundColor: [avatarOptions.backgroundColor.slice(1)],
      accessoriesProbability: avatarOptions.accessories ? 100 : 0,
      accessoriesColor: [avatarOptions.accessoriesColor.slice(1)],
      clothesColor: [avatarOptions.clothesColor.slice(1)],
      clothing: [`${avatarOptions.clothing}`],
      clothingGraphic: [`${avatarOptions.clothingGraphic}`],
      eyebrows: [`${avatarOptions.eyebrows}`],
      eyes: [`${avatarOptions.eyes}`],
      facialHair: [`${avatarOptions.facialHair}`],
      facialHairProbability: avatarOptions.facialHair ? 100 : 0,
      facialHairColor: [`${avatarOptions.facialHairColor.slice(1)}`],
      hairColor: [avatarOptions.hairColor.slice(1)],
      hatColor: [avatarOptions.hatColor.slice(1)],
      mouth: [`${avatarOptions.mouth}`],
      nose: [`${avatarOptions.nose}`],
      skinColor: [avatarOptions.skinColor.slice(1)],
      top: [`${avatarOptions.top}`],
      topProbability: avatarOptions.top ? 100 : 0,
    });
  }

  const handleSidebarToggle = () => setIsSidebarOpen(true);
  const handleSidebarClose = () => setIsSidebarOpen(false);

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
    // Page container
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Sidebar */}

      <HomeSidebar
        className={isSidebarOpen ? "w-56" : "w-0 overflow-x-hidden"}
        onClose={handleSidebarClose}
      />

      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-10 backdrop-blur-sm"></div>
      )}

      {/* Main content of page */}
      <div>
        <header>
          <h1 className="mb-6 text-4xl font-bold">Dashboard</h1>
          {!isLoadingAvatar && (
            <img src={userAvatar.toDataUri()} alt="avatar" className="w-28" />
          )}
          <button onClick={handleSidebarToggle}>
            <HamburgerBars />
          </button>
        </header>

        <main className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
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
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
/*
{
    "primaryBackgroundColor": "#ef4444",
    "secondaryBackgroundColor": "#ef4444",
    "backgroundType": "solid",
    "backgroundRotation": 60,
    "style": "default",
    "base": "default",
    "clothing": "shirtScoopNeck",
    "mouth": "grimace",
    "nose": "default",
    "eyes": "cry",
    "eyebrows": "raisedExcited",
    "top": "frizzle",
    "facialHair": "moustacheMagnum",
    "accessories": "sunglasses",
    "clothingGraphic": "resist",
    "accessoriesColor": "#929598",
    "clothesColor": "#ffffff",
    "hatColor": "#b1e2ff",
    "hairColor": "#c93305",
    "skinColor": "#d08b5b",
    "facialHairColor": "#d6b370",
    "backgroundColor": "#ef4444"
} */
