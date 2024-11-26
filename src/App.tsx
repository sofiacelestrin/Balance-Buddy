import "./index.css";

import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Outlet,
  Route,
  RouterProvider,
} from "react-router-dom";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import Dashboard from "./pages/Dashboard";
import { SessionProvider, useSession } from "./contexts/SessionContext";
import CharacterCreation from "./pages/CharacterCreation";
import EditTask from "./pages/EditTask";
import AddTask from "./pages/AddTask";
import Journal from "./pages/Journal";
import CustomizeBuddy from "./pages/CustomizeBuddy";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";

function PrivateRoutes() {
  const { session, isLoading } = useSession();
  if (isLoading) return <div className="text-3xl">Loading...</div>;
  if (!session) return <Navigate to="/login" />;
  return <Outlet />;
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route index element={<Navigate to="login" replace />} />
      <Route path="login" element={<Login />} />
      <Route path="new-account" element={<Registration />} />

      <Route element={<PrivateRoutes />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="create-character" element={<CharacterCreation />} />

        <Route path="add-task" element={<AddTask />} />
        <Route path="edit-task" element={<EditTask />} />
        <Route path="journal" element={<Journal />} />
        <Route path="customize-buddy" element={<CustomizeBuddy />} />
      </Route>
    </>,
  ),
);

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <ReactQueryDevtools />
      <SessionProvider>
        <RouterProvider router={router} />
      </SessionProvider>
    </QueryClientProvider>
  );
}

export default App;
