import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "../stores/authStore";

export default function GuestOnlyLayout() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  if (isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
