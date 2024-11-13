import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabase/supabase"; // Make sure this path matches your project structure
import {
  format,
  isToday,
  isTomorrow,
  differenceInCalendarDays,
} from "date-fns";

function TodoList() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch tasks from Supabase
  useEffect(() => {
    async function fetchTasks() {
      setLoading(true);
      const { data, error } = await supabase.from("tasks").select("*");

      if (error) {
        console.error("Error fetching tasks:", error);
      } else {
        setTasks(data);
      }
      setLoading(false);
    }

    fetchTasks();
  }, []);

  // Function to get the relative label for a due date
  function getDueLabel(dueDate) {
    const parsedDate = new Date(dueDate);
    if (isToday(parsedDate)) {
      return "Due Today";
    } else if (isTomorrow(parsedDate)) {
      return "Due Tomorrow";
    } else {
      const daysDifference = differenceInCalendarDays(parsedDate, new Date());
      if (daysDifference > 0) {
        return `Due in ${daysDifference} days`;
      } else {
        return `Overdue by ${Math.abs(daysDifference)} days`;
      }
    }
  }

  // Toggle completion
  function toggleCompletion(id) {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  }

  // Delete task
  function deleteTask(id) {
    setTasks(tasks.filter((task) => task.id !== id));
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="mx-auto max-w-lg rounded bg-white p-6 shadow-lg">
      <h1 className="mb-4 text-2xl font-bold">Your Todos</h1>
      <div className="mb-4 flex justify-end space-x-2">
        <button className="rounded bg-gray-200 px-4 py-2">Sort</button>
        <button className="rounded bg-gray-200 px-4 py-2">Filter</button>
      </div>

      {tasks.map((task) => (
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
            <span
              className={`rounded px-2 py-1 text-xs font-semibold ${
                isToday(new Date(task.due))
                  ? "bg-red-400 text-white"
                  : isTomorrow(new Date(task.due))
                    ? "bg-yellow-300"
                    : "bg-gray-300"
              }`}
            >
              {getDueLabel(task.due)}
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <span
              className={`rounded px-2 py-1 text-xs font-semibold text-white ${
                task.category === "Happiness"
                  ? "bg-blue-500"
                  : task.category === "Self Actualization"
                    ? "bg-purple-500"
                    : task.category === "Connection"
                      ? "bg-red-500"
                      : "bg-green-500"
              }`}
            >
              {task.category}
            </span>
            <span className="text-sm font-semibold">
              Complexity: {task.complexity}/5
            </span>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => deleteTask(task.id)}
              className="h-8 w-8 rounded bg-red-400 text-white"
            >
              D
            </button>
            <button className="h-8 w-8 rounded bg-yellow-300 text-black">
              E
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
