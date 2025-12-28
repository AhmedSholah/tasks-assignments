import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "../stores/authStore";

export default function GuestOnlyLayout() {
  const userIsLoggedIn = useAuthStore((state) => state.userIsLoggedIn);

  if (userIsLoggedIn()) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
