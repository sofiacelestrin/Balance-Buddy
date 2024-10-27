import { useState } from "react";

function TodoList() {
  // Hard coded tasks, replace with supabase fetch
  const [tasks, setTasks] = useState([
    {
      id: 1,
      description: "Meet Beth for lunch",
      category: "Connection",
      due: "Due Today",
      complexity: 2,
      completed: false,
    },
    {
      id: 2,
      description: "Study for Stats Quiz",
      category: "Self Actualization",
      due: "Due Tomorrow",
      complexity: 1,
      completed: true,
    },
    {
      id: 3,
      description: "Go for a walk",
      category: "Health",
      due: "Due Tomorrow",
      complexity: 1,
      completed: false,
    },
    {
      id: 4,
      description: "Read novel",
      category: "Happiness",
      due: "Due Tomorrow",
      complexity: 1,
      completed: false,
    },
  ]);

  // Toggle completion
  function toggleCompletion(id) {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  }

  return (
    // Styling for TodoList component - overall and sort/filter
    <div className="mx-auto max-w-lg rounded bg-white p-6 shadow-lg">
      <h1 className="mb-4 text-2xl font-bold">Your Todos</h1>
      <div className="mb-4 flex justify-end space-x-2">
        <button className="rounded bg-gray-200 px-4 py-2">Sort</button>
        <button className="rounded bg-gray-200 px-4 py-2">Filter</button>
      </div>

      {tasks.map((task) => (
        // Styling for each task
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
                className={`${task.completed ? "text-gray-500 line-through" : ""} text-lg font-semibold`}
              >
                {task.description}
              </span>
            </div>
            <span
              className={`rounded px-2 py-1 text-xs font-semibold ${task.due === "Due Today" ? "bg-red-400 text-white" : "bg-yellow-300"}`}
            >
              {task.due}
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <span
              className={`rounded px-2 py-1 text-xs font-semibold text-white ${task.category === "Happiness" ? "bg-blue-500" : task.category === "Self Actualization" ? "bg-purple-500" : task.category === "Connection" ? "bg-red-500" : "bg-green-500"}`}
            >
              {task.category}
            </span>
            <span className="text-sm font-semibold">
              Complexity: {task.complexity}/5
            </span>
          </div>
          <div className="flex space-x-2">
            <button className="h-8 w-8 rounded bg-red-400 text-white">D</button>
            <button className="h-8 w-8 rounded bg-yellow-300 text-black">
              E
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default TodoList;
