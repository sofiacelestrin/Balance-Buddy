import { supabase } from "@supabase/auth-ui-shared";
import { useState } from "react";
import "./Dashboard.css";
import TodoList from "./TodoList";

function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="mb-6 text-4xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* TodoList component */}
        <div className="col-span-1">
          <TodoList />
        </div>

        {/* Messages from character - WIP */}
        <div className="col-span-1 rounded bg-white p-6 shadow-lg">
          <h2 className="mb-4 text-2xl font-bold">Messages</h2>
          <p>No new messages.</p>
        </div>

        {/* Character stats - WIP */}
        <div className="col-span-1 rounded bg-white p-6 shadow-lg">
          <h2 className="mb-4 text-2xl font-bold">Stats</h2>
          <p>Current character stats will be displayed here.</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
