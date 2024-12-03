import { Result } from "@dicebear/core";
import { useEffect, useState } from "react";
import { supabase } from "../supabase/supabase";
import createAvatarFromOptions from "../util/createAvatar";

function Buddy({ buddyName, avatarOptions, isLoadingAvatar }) {
  const [meters, setMeters] = useState({
    health: 0,
    self_actualization: 0,
    happiness: 0,
    social_connection: 0,
  });

  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [coinBalance, setCoinBalance] = useState(0);

  let userAvatar: Result;

  // Create Avatar
  if (!isLoadingAvatar) {
    userAvatar = createAvatarFromOptions(avatarOptions);
  }

  // Fetch user ID
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        if (!session) {
          setError("User not authenticated.");
          return;
        }
        setUserId(session.user.id);
      } catch (err) {
        console.error("Error fetching user session:", err);
        setError("Error fetching user session.");
      } finally {
        setLoading(false);
      }
    };
    fetchUserId();
  }, []);

  // Fetch meter values from Supabase
  useEffect(() => {
    const fetchMeters = async () => {
      if (!userId) return;
      try {
        const { data, error } = await supabase
          .from("meters")
          .select("health, self_actualization, happiness, social_connection")
          .eq("user_id", userId)
          .single();

        if (error) throw error;
        setMeters(data);
      } catch (err) {
        console.error("Error fetching meters:", err);
        setError("Error fetching meters.");
      }
    };
    fetchMeters();
  }, [userId]);

  // Real-time subscription to listen for changes to meters table
  useEffect(() => {
    if (!userId) return;

    console.log("Setting up real-time subscription...");

    const channel = supabase.channel(`meters:user_id=eq.${userId}`);

    channel.on(
      "postgres_changes",
      { event: "UPDATE", schema: "public", table: "meters" },
      (payload) => {
        console.log("Real-time update received:", payload);

        // Destructure the payload to exclude user_id and only update the meters values
        const { user_id, ...meterData } = payload.new; // Remove user_id from the data
        setMeters(meterData); // Update the meters state with the filtered data
      },
    );

    // Subscribe to the channel
    channel.subscribe((status) => {
      console.log("Subscription status: ", status); // Log subscription status
      if (status === "SUBSCRIBED") {
        console.log("Successfully subscribed to changes.");
      }
    });

    // Cleanup when the component unmounts or userId changes
    return () => {
      channel.unsubscribe();
    };
  }, [userId]);

  if (loading) return <div>Loading...</div>;

  // Fixed order for displaying the meters
  const orderedCategories = [
    "health",
    "self_actualization",
    "happiness",
    "social_connection",
  ];

  return (
    <div className="mb-6 flex flex-col items-center rounded bg-white p-6 shadow-lg">
      <h2 className="mb-4 text-2xl font-bold">{buddyName}</h2>
      {/* Avatar Image */}
      {!isLoadingAvatar && (
        <img
          src={userAvatar?.toDataUri()}
          alt="Buddy Avatar"
          className="w-28"
        />
      )}
      <div className="mt-4 flex flex-col items-center">
        {/* Meters */}
        {orderedCategories.map((category) => {
          const value = meters[category] || 0; // Fallback to 0 if no value is found
          return (
            <div className="mb-2 w-full max-w-xs" key={category}>
              <h3 className="text-lg font-semibold">
                {formatCategoryName(category)}
              </h3>
              <div className="h-2 w-full rounded-full bg-gray-200">
                <div
                  className={`h-2 rounded-full ${
                    category === "health"
                      ? "bg-green-500"
                      : category === "self_actualization"
                        ? "bg-purple-500"
                        : category === "happiness"
                          ? "bg-blue-500"
                          : "bg-red-500"
                  }`}
                  style={{ width: `${value}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Buddy;

// Helper function to format category name
const formatCategoryName = (key: string) => {
  return key
    .split("_")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
};
