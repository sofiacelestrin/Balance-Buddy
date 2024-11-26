import { useState, useEffect } from "react";
import { supabase } from "../supabase/supabase";
import { Link } from "react-router-dom"; // Import Link

enum Category {
  Happiness = "happiness",
  Health = "health",
  SelfActualization = "self_actualization",
  Connection = "social_connection",
}

type Task = {
  id: number;
  user_id: string;
  category: Category;
  complexity: number;
  description: string;
  due: string;
  completed: boolean;
};

const calculateStandardDeviation = (meterValues: number[]): number => {
  const mean = meterValues.reduce((acc, value) => acc + value, 0) / meterValues.length;
  const variance = meterValues.reduce((acc, value) => acc + Math.pow(value - mean, 2), 0) / meterValues.length;
  return Math.sqrt(variance);
};

// Helper function to map enum to display-friendly names
function getCategoryDisplayName(category: Category): string {
  switch (category) {
    case Category.Happiness:
      return "Happiness";
    case Category.Health:
      return "Health";
    case Category.SelfActualization:
      return "Self-Actualization";
    case Category.Connection:
      return "Connection";
    default:
      return category; // Default case for unknown categories
  }
}

function TodoList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "completed" | "uncompleted">(
    "all",
  ); // Filter state to control showing all tasks or only completed tasks

  // Fetch tasks from Supabase for the current user
  useEffect(() => {
    async function fetchTasks() {
      try {
        setLoading(true);

        // Get the current user's ID from the session
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) throw sessionError;

        if (!session) {
          console.error("User session not found.");
          setError("User not authenticated.");
          return;
        }

        const userId = session.user.id;

        // Fetch tasks filtered by user_id
        const { data, error } = await supabase
          .from("tasks")
          .select("*")
          .eq("user_id", userId);

        console.log("Fetched tasks:", data);

        if (error) throw error;

        setTasks(data || []);
      } catch (err) {
        console.error("Error fetching tasks:", err);
        setError("Error fetching tasks.");
      } finally {
        setLoading(false);
      }
    }

    fetchTasks();
  }, []);

  let isPending = false;

  // Toggle completion
  // Toggle completion
async function toggleCompletion(id: number) {
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError) throw sessionError;

  if (!session) {
    console.error("User session not found.");
    setError("User not authenticated.");
    isPending = false; // Reset the flag on error
    return;
  }

  const userId = session.user.id;

  const updatedTask = tasks.find((task) => task.id === id);
  if (!updatedTask) {
    isPending = false; // Reset the flag if no task is found
    return;
  }

  const { category, complexity } = updatedTask;

  try {
    // Fetch all meter categories for this user
    const { data: allMeterData, error: allMeterFetchError } = await supabase
      .from("meters")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (allMeterFetchError) throw allMeterFetchError;

    // Fetch the current coin balance
    const { data: currentUserData, error: userFetchError } = await supabase
      .from("users")
      .select("coin_balance")
      .eq("id", userId)
      .single();

    if (userFetchError) throw userFetchError;

    let totalCombinedMeter = 0;

    // Add all categories to totalCombinedMeter
    if (allMeterData) {
      if ('health' in allMeterData) totalCombinedMeter += allMeterData.health;
      if ('happiness' in allMeterData) totalCombinedMeter += allMeterData.happiness;
      if ('self_actualization' in allMeterData) totalCombinedMeter += allMeterData.self_actualization;
      if ('social_connection' in allMeterData) totalCombinedMeter += allMeterData.social_connection;
    }

    console.log("Total Combined Meter: ", totalCombinedMeter);

    // Calculate the base coin gain
    const baseCoinGain = updatedTask.completed ? -complexity : complexity;

    // Multiply base coin gain by the total combined meter value / 100
    const coinGain = baseCoinGain * (totalCombinedMeter / 100);

    // Round the final coin balance
    const newCoinBalance = Math.round(
      (currentUserData?.coin_balance || 0) + coinGain
    );

    if (newCoinBalance < 0) {
      console.error("Insufficient coins to complete this operation.");
      throw new Error("Insufficient coins.");
    }

    // Update the coin balance
    const { error: coinUpdateError } = await supabase
      .from("users")
      .update({ coin_balance: newCoinBalance })
      .eq("id", userId);

    if (coinUpdateError) throw coinUpdateError;

    // Fetch the current meter value only after the coin is updated
    const { data: currentMeterData, error: meterFetchError } = await supabase
      .from("meters")
      .select(`${category}`)
      .eq("user_id", userId)
      .single();

    if (meterFetchError) throw meterFetchError;

    // Calculate the new meter value based on task completion status (decrease if uncheck, increase if check)
    const meterValues = [];
    if ('health' in allMeterData) meterValues.push(allMeterData.health);
    if ('happiness' in allMeterData) meterValues.push(allMeterData.happiness);
    if ('self_actualization' in allMeterData) meterValues.push(allMeterData.self_actualization);
    if ('social_connection' in allMeterData) meterValues.push(allMeterData.social_connection);

    // Calculate the standard deviation of meter values
    const stddev = calculateStandardDeviation(meterValues);

    // Calculate the meter gain multiplier using 1 + (50 - stddev) / 15
    const meterGainMultiplier = 1 + (50 - stddev) / 15;

    // Adjust complexity based on whether task is being checked or unchecked
    const adjustedComplexity = updatedTask.completed ? -complexity : complexity;

    // Apply the adjusted complexity and multiplier to calculate the new meter value
    const newMeterValue = Math.round(
      Math.max(
        0,
        Math.min(
          100,
          currentMeterData[category] + adjustedComplexity * meterGainMultiplier
        )
      )
    );

    // Update the meter
    const { error: meterError } = await supabase
      .from("meters")
      .update({ [category]: newMeterValue })
      .eq("user_id", userId);

    if (meterError) throw meterError;

    // Update the task completion status now that coins and meter are updated
    const { error: taskError } = await supabase
      .from("tasks")
      .update({ completed: !updatedTask.completed })
      .eq("id", id);

    if (taskError) throw taskError;

    // Update local state to reflect task completion toggle
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
    setErrorMessage("");
  } catch (err) {
    console.error("Error updating task, meter, or coin balance:", err);
    setErrorMessage("Insufficient coin balance to uncheck task.");
  }
}

  // Delete task
  async function deleteTask(id: number) {
    try {
      const { error } = await supabase.from("tasks").delete().eq("id", id);
      if (error) throw error;

      setTasks(tasks.filter((task) => task.id !== id));
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  }

  // Filter tasks based on the filter state
  const filteredTasks = tasks.filter((task) => {
    if (filter === "all") return true; // Show all tasks
    if (filter === "completed") return task.completed; // Show only completed tasks
    if (filter === "uncompleted") return !task.completed; // Show only uncompleted tasks
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="mx-auto max-w-lg rounded bg-white p-6 shadow-lg">
      <h1 className="mb-4 text-2xl font-bold">Your Todos</h1>

      {/* Show error message if any */}
      {errorMessage && (
        <div className="error-message" style={{ color: "red", margin: "10px 0" }}>
          {errorMessage}
        </div>
      )}

      {/* Filter Buttons */}
      <div className="mb-4 flex justify-end space-x-2">
        <button
          onClick={() => setFilter("all")}
          className="rounded bg-gray-200 px-4 py-2"
        >
          Show All
        </button>
        <button
          onClick={() => setFilter("completed")}
          className="rounded bg-gray-200 px-4 py-2"
        >
          Show Completed
        </button>
        <button
          onClick={() => setFilter("uncompleted")}
          className="rounded bg-gray-200 px-4 py-2"
        >
          Show Uncompleted
        </button>
      </div>

      {filteredTasks.map((task) => (
        <div
          key={task.id}
          className="mb-4 flex flex-col space-y-2 rounded border p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleCompletion(task.id)}
                className="h-5 w-5"
              />
              <span
                className={`${
                  task.completed ? "text-gray-500 line-through" : ""
                } text-lg font-semibold`}
              >
                {task.description}
              </span>
            </div>
            <span className="text-sm">{task.due}</span>
          </div>
          <div className="flex items-center space-x-4">
            <span
              className={`rounded px-2 py-1 text-xs font-semibold text-white ${
                task.category === Category.Happiness
                  ? "bg-blue-500"
                  : task.category === Category.SelfActualization
                    ? "bg-purple-500"
                    : task.category === Category.Connection
                      ? "bg-red-500"
                      : "bg-green-500"
              }`}
            >
              {getCategoryDisplayName(task.category)}{" "}
              {/* Display the formatted name */}
            </span>
            <span className="text-sm font-semibold">
              Complexity: {task.complexity}/5
            </span>
            {/* Edit Button */}
            <Link
              to="/edit-task"
              state={{ task }} // Pass task data to the AddTask page
              className="rounded bg-yellow-500 px-4 py-2 text-white hover:bg-yellow-600"
            >
              Edit
            </Link>
            {/* Delete Button */}
            <button
              onClick={() => deleteTask(task.id)}
              className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      ))}

      {/* Add New Task Button */}
      <div className="col-span-1 mt-4 flex justify-center">
        <Link to="/add-task">
          <button className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600">
            Add New Task
          </button>
        </Link>
      </div>
    </div>
  );
}

export default TodoList;