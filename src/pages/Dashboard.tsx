import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import HomeSidebar from "../components/HomeSidebar";
import HamburgerBars from "../components/icons/HamburgerBars";
import { useSession } from "../contexts/SessionContext";
import { getCustomizationOptionsOwnership } from "../supabase/userCustomizationOwnershipService";
import createAvatarFromOptions, { avatarOptions } from "../util/createAvatar";
import TodoList from "./TodoList";
import Buddy from "./Buddy"; // Import Buddy component
import { supabase } from "../supabase/supabase";
import {
  getUserCoinBalance,
  purchaseCustomizationOptions as purchaseCustomizationOptionsSupabase,
} from "../supabase/userService";

function Dashboard() {
  const { session } = useSession();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [coinBalance, setCoinBalance] = useState<number | null>(null);

  async function signOutUser() {
    const { error } = await supabase.auth.signOut();
    console.log(error);
  }

  const { isPending: isLoadingAvatar, data: avatarOptions } = useQuery({
    queryKey: ["user_avatar"],
    queryFn: async () => {
      const options = await getCustomizationOptionsOwnership(
        session?.user.id as string,
      );
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

  // Initial coin balance fetch using React Query
  const { data: initialCoinBalance } = useQuery({
    queryKey: ["coin_balance"],
    queryFn: async () => await getUserCoinBalance(session?.user.id as string),
    onSuccess: (data) => setCoinBalance(data), // Sync initial value with state
  });

  // Real-time subscription for coin balance updates
  useEffect(() => {
    if (!session?.user.id) return;

    const channel = supabase
      .channel(`public:users:id=eq.${session.user.id}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "users" },
        (payload) => {
          const updatedBalance = payload.new.coin_balance;
          setCoinBalance(updatedBalance); // Update the state
        },
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      channel.unsubscribe();
    };
  }, [session?.user.id]);

  const userAvatar = useMemo(() => {
    if (isLoadingAvatar) return null;
    return createAvatarFromOptions(avatarOptions);
  }, [avatarOptions, isLoadingAvatar]);

  if (isLoadingAvatar) return <p>Loading Avatar...</p>;

  const handleSidebarToggle = () => setIsSidebarOpen(true);
  const handleSidebarClose = () => setIsSidebarOpen(false);

  return (
    <>
      <header className="bg-blue-600 p-4 text-white">
        <div className="flex items-center justify-between">
          {/* Left Section: Logo and Title */}
          <div className="flex items-center">
            <img
              src="/src/1logo.svg"
              alt="Company Logo"
              className="mr-4 h-12 w-auto"
            />
            <div className="text-4xl font-bold">Balance Buddy</div>
          </div>

          {/* Right Section: Coin Balance and Sidebar Button */}
          <div className="flex items-center">
            <img
              src="/src/coin.svg"
              alt="Coin Image"
              className="mr-2 h-12 w-auto"
            />
            <div className="text-4xl font-bold mr-6">
              {coinBalance ?? "Loading..."}
            </div>
            <button
              onClick={handleSidebarToggle}
              className="flex items-center justify-center"
            >
              <HamburgerBars className="h-12 w-12 text-white stroke-[4]" />
            </button>
          </div>
        </div>
      </header>

      <div className="min-h-screen bg-gray-100 p-8">
        <header>
          <h1 className="mb-6 text-4xl font-bold">Dashboard</h1>
        </header>

        {/* Sidebar */}
        <HomeSidebar
          className={isSidebarOpen ? "w-56" : "w-0 overflow-x-hidden"}
          onClose={handleSidebarClose}
        />
        {isSidebarOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-10 backdrop-blur-sm"></div>
        )}

        {/* Main Content */}
        <main className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Buddy Component */}
          <div className="col-span-1">
            <Buddy
              avatarOptions={avatarOptions}
              isLoadingAvatar={isLoadingAvatar}
            />
          </div>

          {/* TodoList Component */}
          <div className="col-span-1">
            <TodoList />
          </div>

          {/* Messages */}
          <div className="col-span-1 rounded bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-2xl font-bold">Messages</h2>
            <p>No new messages.</p>
          </div>
        </main>
      </div>
    </>
  );
}

export default Dashboard;
