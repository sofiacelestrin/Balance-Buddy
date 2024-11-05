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
      </Route>
    </>,
  ),
);

function App() {
  return (
    <SessionProvider>
      <RouterProvider router={router} />
    </SessionProvider>
  );
}

export default App;
