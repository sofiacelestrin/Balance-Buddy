import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { supabase } from "../supabase/supabase";
import { useQuery } from "@tanstack/react-query";
import HomeSidebar from "../components/HomeSidebar";
import HamburgerBars from "../components/icons/HamburgerBars";

function AddTask() {
  const location = useLocation();
  const task = location.state || {};

  const [taskDescription, setTaskDescription] = useState(task.description || "");
  const [taskCategory, setTaskCategory] = useState(
    task.category || "Happiness"
  );
  const [taskDue, setTaskDue] = useState(
    task.due ? new Date(task.due).toISOString().split("T")[0] : "" // Default to today's date
  );
  const [taskComplexity, setTaskComplexity] = useState(task.complexity || 3);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const categories = [
    { displayName: "Happiness", value: "happiness" },
    { displayName: "Self Actualization", value: "self_actualization" },
    { displayName: "Social Connection", value: "social_connection" },
    { displayName: "Health", value: "health" },
  ];
  const complexities = [1, 2, 3, 4, 5];

  // Fetch the current user's ID from the session
  useEffect(() => {
    async function fetchUserId() {
      try {
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

        setUserId(session.user.id);
      } catch (err) {
        console.error("Error fetching user session:", err);
        setError("Error fetching user session.");
      } finally {
        setLoading(false);
      }
    }

    fetchUserId();
  }, []);

  // Insert the task into the database
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (loading) {
      console.log("Waiting for user session...");
      return;
    }

    if (!userId) {
      console.error("User not authenticated");
      setError("User not authenticated. Please log in.");
      return;
    }

    const selectedCategory = categories.find(
      (cat) => cat.displayName === taskCategory
    )?.value;

    if (!selectedCategory) {
      console.error("Invalid category selected.");
      setError("Invalid category selected.");
      return;
    }

    try {
      const { data, error } = await supabase.from("tasks").insert([
        {
          description: taskDescription,
          category: selectedCategory,
          due: taskDue,
          complexity: taskComplexity,
          user_id: userId,
          completed: false,
        },
      ]);

      if (error) {
        throw error;
      }

      console.log("Task added successfully:", data);
      navigate("/dashboard");
    } catch (err) {
      console.error("Error adding task:", err);
      setError("Error adding task. Please try again.");
    }

  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { data: coinBalance } = useQuery({
    queryKey: ["coin_balance"],
    queryFn: async () => await getUserCoinBalance(session?.user.id as string),
  });

  const handleSidebarToggle = () => setIsSidebarOpen(true);
  const handleSidebarClose = () => setIsSidebarOpen(false);

  if (loading) return <div>Loading...</div>;


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
            <div className="mr-6 text-4xl font-bold">
              {coinBalance ?? "Loading..."}
            </div>
            <button
              onClick={handleSidebarToggle}
              className="flex items-center justify-center"
            >
              <HamburgerBars className="h-12 w-12 stroke-[4] text-white" />
            </button>
          </div>
        </div>
      </header>
      <HomeSidebar
          className={isSidebarOpen ? "w-56" : "w-0 overflow-x-hidden"}
          onClose={handleSidebarClose}
        />
        {isSidebarOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-10 backdrop-blur-sm"></div>
        )}
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="mb-6 text-4xl font-bold">Add Task</h1>
      <form
        onSubmit={handleSubmit}
        className="mx-auto w-1/2 rounded bg-white p-6 shadow-lg"
      >
        <div className="mb-4">
          <label htmlFor="description" className="block text-xl font-semibold">
            Task Description
          </label>
          <textarea
            id="description"
            name="description"
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            className="w-full rounded border p-2"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="category" className="block text-xl font-semibold">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={taskCategory}
            onChange={(e) => setTaskCategory(e.target.value)}
            className="w-full rounded border p-2"
          >
            {categories.map((category, index) => (
              <option key={index} value={category.displayName}>
                {category.displayName}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="due" className="block text-xl font-semibold">
            Due Date
          </label>
          <input
            type="date"
            id="due"
            name="due"
            value={taskDue}
            onChange={(e) => setTaskDue(e.target.value)}
            className="w-full rounded border p-2"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="complexity" className="block text-xl font-semibold">
            Complexity
          </label>
          <select
            id="complexity"
            name="complexity"
            value={taskComplexity}
            onChange={(e) => setTaskComplexity(Number(e.target.value))}
            className="w-full rounded border p-2"
          >
            {complexities.map((complexity, index) => (
              <option key={index} value={complexity}>
                {complexity}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="w-full rounded bg-blue-500 py-2 text-white text-xl hover:bg-blue-600 font-semibold"
        >
          Add Task
        </button>
      </form>
      {error && <p className="mt-4 text-red-500">{error}</p>}
    </div>
    </>
  );
}

export default AddTask;