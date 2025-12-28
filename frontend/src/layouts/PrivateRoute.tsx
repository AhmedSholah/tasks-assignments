import { Navigate, Outlet, Link } from "react-router";
import { useAuthStore } from "../stores/authStore";
import {
  AppShell,
  Container,
  Group,
  Text,
  Menu,
  Avatar,
  UnstyledButton,
  rem,
} from "@mantine/core";
import { IconLogout } from "@tabler/icons-react";

export default function PrivateRoute() {
  const userIsLoggedIn = useAuthStore((state) => state.userIsLoggedIn);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  if (!userIsLoggedIn()) return <Navigate to="/login" />;

  return (
    <AppShell header={{ height: 60 }}>
      <AppShell.Header>
        <Container size="lg" h="100%">
          <Group justify="space-between" h="100%">
            <UnstyledButton component={Link} to="/">
              <Text
                fw={700}
                size="xl"
                variant="gradient"
                gradient={{ from: "blue", to: "cyan" }}
              >
                TaskMaster
              </Text>
            </UnstyledButton>

            <Menu shadow="md" width={200}>
              <Menu.Target>
                <UnstyledButton>
                  <Group gap={7}>
                    <Avatar
                      src={null}
                      alt={user?.name || "User"}
                      radius="xl"
                      size={35}
                      color="blue"
                    >
                      {user?.name?.charAt(0) || "U"}
                    </Avatar>
                    <Text fw={500} size="sm" visibleFrom="xs">
                      {user?.name || "User"}
                    </Text>
                  </Group>
                </UnstyledButton>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Item disabled>
                  <Text size="xs" c="dimmed">
                    {user?.email || "No email"}
                  </Text>
                </Menu.Item>
                <Menu.Divider />
                <Menu.Label>Actions</Menu.Label>
                <Menu.Item
                  color="red"
                  leftSection={
                    <IconLogout style={{ width: rem(14), height: rem(14) }} />
                  }
                  onClick={logout}
                >
                  Logout
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Container>
      </AppShell.Header>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
