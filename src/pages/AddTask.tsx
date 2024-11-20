import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { supabase } from "../supabase/supabase"; // Import the Supabase client

function AddTask() {
  const location = useLocation();
  const task = location.state || {};

  // Initialize form fields with task data if available
  const [taskTitle, setTaskTitle] = useState(task.description || "");
  const [taskDescription, setTaskDescription] = useState(
    task.description || "",
  );
  const [taskCategory, setTaskCategory] = useState(
    task.category || "Happiness",
  );
  const [taskDue, setTaskDue] = useState(task.due || "Due Today");
  const [taskComplexity, setTaskComplexity] = useState(task.complexity || 3);
  const [userId, setUserId] = useState<string | null>(null); // State to store user ID
  const [loading, setLoading] = useState(true); // State to track loading status
  const navigate = useNavigate();

  // Get the current user ID from Supabase auth when the component mounts
  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching user:", error.message);
      } else {
        setUserId(data?.id || null); // Set user ID from auth data
      }
      setLoading(false); // Set loading to false once the user is fetched
    };

    fetchUser();
  }, []);

  const categories = [
    "Happiness",
    "Self Actualization",
    "Connection",
    "Growth",
  ];
  const dueDates = ["Due Today", "This Week", "Next Week"];
  const complexities = [1, 2, 3, 4, 5];

  // Handle form submission and add task
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if user is logged in before proceeding
    if (loading) {
      console.log("Waiting for user data...");
      return;
    }

    if (!userId) {
      console.error("User not logged in");
      return;
    }

    // Insert task into Supabase
    try {
      const { data, error } = await supabase.from("tasks").insert([
        {
          description: taskTitle,
          category: taskCategory,
          due: taskDue,
          complexity: taskComplexity,
          user_id: userId, // Set the logged-in user's ID here
        },
      ]);

      if (error) {
        console.error("Error adding task:", error);
      } else {
        console.log("Task added successfully:", data);
        navigate("/dashboard"); // Navigate to dashboard after adding task
      }
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="mb-6 text-4xl font-bold">Add Task</h1>
      <form
        onSubmit={handleSubmit}
        className="mx-auto w-96 rounded bg-white p-6 shadow-lg"
      >
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-semibold">
            Task Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            className="w-full rounded border p-2"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-semibold">
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
          <label htmlFor="category" className="block text-sm font-semibold">
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
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="due" className="block text-sm font-semibold">
            Due Date
          </label>
          <select
            id="due"
            name="due"
            value={taskDue}
            onChange={(e) => setTaskDue(e.target.value)}
            className="w-full rounded border p-2"
          >
            {dueDates.map((due, index) => (
              <option key={index} value={due}>
                {due}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="complexity" className="block text-sm font-semibold">
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
          className="w-full rounded bg-blue-500 py-2 text-white hover:bg-blue-600"
        >
          {loading ? "Loading..." : "Add Task"}
        </button>
      </form>
    </div>
  );
}

export default AddTask;
