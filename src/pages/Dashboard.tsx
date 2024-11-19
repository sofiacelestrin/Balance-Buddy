import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import HomeSidebar from "../components/HomeSidebar";
import HamburgerBars from "../components/icons/HamburgerBars";
import { useSession } from "../contexts/SessionContext";
import { getCustomizationOptionsOwnership } from "../supabase/userCustomizationOwnershipService";
import createAvatarFromOptions, { avatarOptions } from "../util/createAvatar";
import TodoList from "./TodoList";

function Dashboard() {
  //If you need the current session, use the useSession hook
  const { session } = useSession();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { isPending: isLoadingAvatar, data: avatarOptions } = useQuery({
    queryKey: ["user_avatar"],
    queryFn: async () => {
      const options = await getCustomizationOptionsOwnership(
        session?.user.id as string,
      );
      //Parse the results that come from supabase into an avatarOptions object that can be passed to the utility function createAvatarFromOptions that creates an avatar
      const parsedOptions: avatarOptions = options?.reduce(
        (optionsObject, option) => {
          const category = option?.category as string;
          const optionValue = option?.option_value as string;
          optionsObject[category] = optionValue;
          return optionsObject;
        },
        {},
      );

      return parsedOptions;
    },
  });

  const userAvatar = useMemo(() => {
    if (isLoadingAvatar) return null;

    return createAvatarFromOptions(avatarOptions);
  }, [avatarOptions, isLoadingAvatar]);

  if (isLoadingAvatar) return <p>Loading Avatar</p>;

  const handleSidebarToggle = () => setIsSidebarOpen(true);
  const handleSidebarClose = () => setIsSidebarOpen(false);

  return (
    <>
      <header className="bg-blue-600 p-4 text-white">
        <div className="flex items-center">
          <img
            src="/src/1logo.svg"
            alt="Company Logo"
            className="mr-4 h-12 w-auto"
          />
          <div className="text-4xl font-bold">Balance Buddy</div>
        </div>
      </header>
      {/* // Page container */}
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
    </>
  );
}

export default Dashboard;
