import { useQuery } from "@tanstack/react-query";
import { useSession } from "../contexts/SessionContext";
import { getUserInfo } from "../supabase/userService";
import HamburgerBars from "./icons/HamburgerBars";

type NavigationBarProps = {
  onSidebarToggle: () => void;
};

function NavigationBar({ onSidebarToggle }: NavigationBarProps) {
  const { session } = useSession();
  const userId = session?.user.id;

  const { data: userInfoData } = useQuery({
    queryKey: ["user_info", userId],
    queryFn: async () => {
      return await getUserInfo(userId as string);
    },
    enabled: userId ? true : false, //Query only runs when the session is truthy
  });
  const coinBalance = userInfoData?.coin_balance;

  return (
    <div>
      <nav className="bg-blue-600 p-4 text-white">
        <div className="flex items-center justify-between">
          {/* Left Section: Logo and Title */}
          <div className="flex items-center">
            <img
              src="/1logo.svg"
              alt="Company Logo"
              className="mr-4 h-12 w-auto"
            />
            <div className="text-4xl font-bold">Balance Buddy</div>
          </div>

          {/* Right Section: Coin Balance and Sidebar Button. This content should only display if the user is inside a private route, i.e. user is logged in */}
          {session && (
            <div className="flex items-center">
              <img
                src="/coin.svg"
                alt="Coin Image"
                className="mr-2 h-12 w-auto"
              />
              <div className="mr-6 text-4xl font-bold">
                {coinBalance ?? "Loading..."}
              </div>
              <button
                onClick={onSidebarToggle}
                className="flex items-center justify-center"
              >
                <HamburgerBars className="h-12 w-12 stroke-[4] text-white" />
              </button>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}

export default NavigationBar;
