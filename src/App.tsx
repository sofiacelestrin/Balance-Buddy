import "./App.css";

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import Dashboard from "./pages/Dashboard";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Login />} />
      <Route path="new-account" element={<Registration />} />
      <Route path="dashboard" element={<Dashboard />} />
      
    </>,
  ),
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
