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
        </main>
      </div>
    </>
  );
}

export default Dashboard;
