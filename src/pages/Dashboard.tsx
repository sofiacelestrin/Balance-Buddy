import { supabase } from "../supabase/supabase";
import { useEffect, useState } from "react";

import TodoList from "./TodoList";
import { Link } from "react-router-dom";
import { useSession } from "../contexts/SessionContext";

function Dashboard() {
  //If you need the current session, use the useSession hook
  const { session } = useSession();

  async function signOutUser() {
    const { error } = await supabase.auth.signOut();
    console.log(error);
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="mb-6 text-4xl font-bold">Dashboard</h1>
      <h1>Welcome {session?.user.email}</h1>
      <button className="bg-red-400 p-4 text-white" onClick={signOutUser}>
        LOG OUT
      </button>
      <Link to="/login">Login Page</Link>
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
