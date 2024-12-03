import { Outlet } from "react-router-dom";
import NavigationBar from "./NavigationBar";
import { useState } from "react";
import HomeSidebar from "./HomeSidebar";

function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const handleSidebarToggle = () => setIsSidebarOpen((state) => !state);
  return (
    <div>
      <NavigationBar onSidebarToggle={handleSidebarToggle} />
      {/* Sidebar */}
      <HomeSidebar
        className={isSidebarOpen ? "w-56" : "w-0 overflow-x-hidden"}
        onClose={handleSidebarToggle}
      />
      {isSidebarOpen && (
        <div className="fixed inset-0 z-10 bg-black bg-opacity-10 backdrop-blur-sm"></div>
      )}
      <Outlet />
    </div>
  );
}

export default AppLayout;
