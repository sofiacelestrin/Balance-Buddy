import { useQuery } from "@tanstack/react-query";
import { useSession } from "../contexts/SessionContext";
import { getCustomizationOptionsOwnership } from "../supabase/userCustomizationOwnershipService";
import { getUserInfo } from "../supabase/userService";
import { avatarOptions } from "../util/createAvatar";
import Buddy from "./Buddy"; // Import Buddy component
import TodoList from "./TodoList";
import { Link } from "react-router-dom";

function Dashboard() {
  const { session } = useSession();
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

  const userId = session?.user.id;
  const { data: userInfoData } = useQuery({
    queryKey: ["user_info", userId],
    queryFn: async () => await getUserInfo(userId as string),
  });
  const buddyName = userInfoData?.avatar_name;
  const coinBalance = userInfoData?.coin_balance;
  return (
    <>
      <div className="min-h-screen bg-gray-100 p-8">
        <header>
          <h1 className="mb-6 text-4xl font-bold">Dashboard</h1>
        </header>

        {/* Main Content */}
        <main className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Buddy Component */}
          <div className="col-span-1">
            <Buddy
              avatarOptions={avatarOptions}
              isLoadingAvatar={isLoadingAvatar}
              buddyName={buddyName}
            />
          </div>
          {/* TodoList Component */}
          <div className="col-span-1">
            <TodoList />
          </div>
          {/* Messages */}
          <div className="col-span-1 rounded bg-white p-6 shadow-lg">
            <h2 className="mb-6 text-2xl font-bold text-gray-800">
              Customize Your Buddy
            </h2>
            <p className="mb-4 text-gray-600">
              Good job balancing! You have a total of
            </p>

            <div className="mb-6 flex items-center">
              <img
                src="/src/coin.svg"
                alt="Coin Image"
                className="mr-3 h-12 w-auto"
              />
              <div className="text-4xl font-bold text-gray-800">
                {coinBalance} coins
              </div>
            </div>

            <p className="mb-6 text-gray-600">
              Use these coins to customize your buddy in the shop!
            </p>

            <div className="flex justify-center">
              <Link to="/customize-buddy">
                <button className="rounded bg-green-500 px-6 py-3 text-white hover:bg-green-600">
                  Customize Your Buddy
                </button>
              </Link>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export default Dashboard;
