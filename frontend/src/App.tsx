// Routing
import { Route, Routes } from "react-router";

// Layouts
import PrivateRoute from "./layouts/PrivateRoute";
import GuestOnlyLayout from "./layouts/GuestOnlyLayout";

// Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Tasks from "./pages/Tasks";

function App() {
  return (
    <Routes>
      {/* Routes that only work when the user is not logged in */}
      <Route element={<GuestOnlyLayout />}>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>

      {/* Routes that only work when the user is logged in */}
      <Route element={<PrivateRoute />}>
        <Route path="" element={<Tasks />} />
      </Route>
    </Routes>
  );
}

export default App;
