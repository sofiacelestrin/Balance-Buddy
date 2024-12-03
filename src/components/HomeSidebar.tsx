import { Link } from "react-router-dom";
import { supabase } from "../supabase/supabase";
import { twMerge } from "tailwind-merge";

function HomeSidebar({
  className,
  onClose,
}: {
  className: string;
  onClose: () => void;
}) {
  async function signOutUser() {
    const { error } = await supabase.auth.signOut();
    console.log(error);
  }

  return (
    <aside
      className={twMerge(
        "fixed right-0 top-0 z-10 flex h-full flex-col items-center justify-between bg-white transition-all duration-300",
        className,
      )}
    >
      <button
        className="absolute left-2 top-0 text-3xl text-red-400"
        onClick={onClose}
      >
        ×
      </button>
      <div className="flex flex-col whitespace-nowrap pt-20 text-xl font-bold space-y-4">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/customize-buddy">Customize Buddy</Link>
        <Link to="/add-task">Add Task</Link>

      </div>


      <button className="whitespace-nowrap text-red-500" onClick={signOutUser}>
        LOG OUT
      </button>
    </aside>
  );
}

export default HomeSidebar;
