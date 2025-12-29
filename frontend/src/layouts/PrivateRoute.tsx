import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "../stores/authStore";
import { AppShell } from "@mantine/core";
import { Navbar } from "../components/Navbar";

export default function PrivateRoute() {
  const userIsLoggedIn = useAuthStore((state) => state.userIsLoggedIn);

  if (!userIsLoggedIn()) return <Navigate to="/login" />;

  return (
    <AppShell
      header={{ height: 70 }}
      padding="md"
      styles={{
        main: {
          backgroundColor: "#f8f9fa",
        },
      }}
    >
      <AppShell.Header
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(0,0,0,0.05)",
        }}
      >
        <Navbar />
      </AppShell.Header>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}

