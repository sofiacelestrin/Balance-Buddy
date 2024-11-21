import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../supabase/supabase";

function EditTask() {
  const location = useLocation();
  const task = location.state?.task; // Retrieve task from state

  const [taskDescription, setTaskDescription] = useState(
    task?.description || "",
  );
  const [taskCategory, setTaskCategory] = useState(
    task?.category || "happiness",
  );
  const [taskDue, setTaskDue] = useState(
    task?.due ? new Date(task.due).toISOString().split("T")[0] : "",
  );
  const [taskComplexity, setTaskComplexity] = useState(task?.complexity || 3);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const categories = [
    { displayName: "Happiness", value: "happiness" },
    { displayName: "Self-Actualization", value: "self_actualization" },
    { displayName: "Social Connection", value: "social_connection" },
    { displayName: "Health", value: "health" },
  ];
  const complexities = [1, 2, 3, 4, 5];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!task) {
      setError("Task not found. Cannot update.");
      return;
    }

    try {
      const { error } = await supabase
        .from("tasks")
        .update({
          description: taskDescription,
          category: categories.find((cat) => cat.displayName === taskCategory)
            ?.value,
          due: taskDue,
          complexity: taskComplexity,
        })
        .eq("id", task.id);

      if (error) throw error;

      console.log("Task updated successfully");
      navigate("/dashboard");
    } catch (err) {
      console.error("Error updating task:", err);
      setError("Error updating task. Please try again.");
    }
  };

  return (
    <>
    <header className="bg-blue-600 p-4 text-white">
    <div className="flex items-center">
      <img
        src="/src/1logo.svg"
        alt="Company Logo"
        className="h-12 w-auto mr-4"
      />
      <div className="text-4xl font-bold">Balance Buddy</div>
    </div>
  </header>
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="mb-6 text-4xl font-bold">Edit Task</h1>
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
          Update Task
        </button>
      </form>
      {error && <p className="mt-4 text-red-500">{error}</p>}
    </div>
    </>
  );
}

export default EditTask;
