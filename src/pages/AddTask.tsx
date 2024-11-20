import { useState, useEffect } from "react";
import { supabase } from "../supabase/supabase";
import { useLocation, useNavigate } from "react-router-dom"; // Import useNavigate and useLocation

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

function AddTask() {
  const location = useLocation();
  const taskToEdit = location.state?.task;
  const [task, setTask] = useState<Task | null>(taskToEdit || null);
  const [description, setDescription] = useState<string>("");
  const [category, setCategory] = useState<Category>("happiness");
  const [complexity, setComplexity] = useState<number>(1);
  const [due, setDue] = useState<string>("");

  const navigate = useNavigate(); // useNavigate hook for navigation

  useEffect(() => {
    if (taskToEdit) {
      setDescription(taskToEdit.description);
      setCategory(taskToEdit.category);
      setComplexity(taskToEdit.complexity);
      setDue(taskToEdit.due);
    }
  }, [taskToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (task) {
        // Editing existing task
        const { error } = await supabase
          .from("tasks")
          .update({ description, category, complexity, due })
          .eq("id", task.id);

        if (error) {
          console.error("Error updating task:", error);
          return;
        }

        alert("Task updated successfully!");
      } else {
        // Adding new task
        const { error } = await supabase
          .from("tasks")
          .insert([{ description, category, complexity, due }]);

        if (error) {
          console.error("Error adding task:", error);
          return;
        }

        alert("New task added successfully!");
      }

      // Navigate back to the dashboard after task update
      navigate("/dashboard"); // Change this route if needed
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (
    <div className="mx-auto max-w-lg rounded bg-white p-6 shadow-lg">
      <h1 className="mb-4 text-2xl font-bold">
        {task ? "Edit Task" : "Add New Task"}
      </h1>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium">
            Task Description
          </label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-2 block w-full rounded border px-4 py-2"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="category" className="block text-sm font-medium">
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
            className="mt-2 block w-full rounded border px-4 py-2"
            required
          >
            <option value={Category.Happiness}>Happiness</option>
            <option value={Category.Health}>Health</option>
            <option value={Category.SelfActualization}>
              Self-Actualization
            </option>
            <option value={Category.Connection}>Connection</option>
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="complexity" className="block text-sm font-medium">
            Complexity
          </label>
          <input
            type="number"
            id="complexity"
            value={complexity}
            onChange={(e) => setComplexity(Number(e.target.value))}
            min="1"
            max="5"
            className="mt-2 block w-full rounded border px-4 py-2"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="due" className="block text-sm font-medium">
            Due Date
          </label>
          <input
            type="date"
            id="due"
            value={due}
            onChange={(e) => setDue(e.target.value)}
            className="mt-2 block w-full rounded border px-4 py-2"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
        >
          {task ? "Update Task" : "Add Task"}
        </button>
      </form>
    </div>
  );
}

export default AddTask;
