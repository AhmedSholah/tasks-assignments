import { Link } from "react-router";
import {
  Container,
  Group,
  Text,
  Menu,
  Avatar,
  UnstyledButton,
  rem,
  ThemeIcon,
  Box,
} from "@mantine/core";
import { IconLogout, IconChecklist } from "@tabler/icons-react";
import { useAuthStore } from "../stores/authStore";

export function Navbar() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  return (
    <Container size="lg" h="100%">
      <Group justify="space-between" h="100%">
        <UnstyledButton component={Link} to="/">
          <Group gap="xs">
            <ThemeIcon
              size="lg"
              variant="gradient"
              gradient={{ from: "indigo", to: "cyan" }}
              radius="md"
            >
              <IconChecklist size={20} />
            </ThemeIcon>
            <Text
              fw={800}
              size="xl"
              style={{
                fontFamily: "var(--font-outfit)",
                letterSpacing: "-0.5px",
              }}
            >
              TaskMaster
            </Text>
          </Group>
        </UnstyledButton>

        <Menu
          shadow="xl"
          width={220}
          withArrow
          transitionProps={{ transition: "pop-top-right" }}
        >
          <Menu.Target>
            <UnstyledButton
              py={4}
              px={8}
              style={{ borderRadius: "8px", transition: "background 0.2s" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.03)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              <Group gap={10}>
                <Box style={{ textAlign: "right" }} visibleFrom="xs">
                  <Text fw={600} size="sm" lh={1.2}>
                    {user?.name || "User"}
                  </Text>
                </Box>
                <Avatar
                  src={null}
                  alt={user?.name || "User"}
                  radius="md"
                  size={40}
                  variant="gradient"
                  gradient={{ from: "indigo", to: "cyan" }}
                >
                  {user?.name?.charAt(0) || "U"}
                </Avatar>
              </Group>
            </UnstyledButton>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item disabled>
              <Text size="xs" c="dimmed">
                Signed in as <br />
                <Text span fw={600} c="dark">
                  {user?.email || "No email"}
                </Text>
              </Text>
            </Menu.Item>
            <Menu.Divider />
            <Menu.Label>Settings</Menu.Label>
            <Menu.Item
              color="red"
              leftSection={
                <IconLogout style={{ width: rem(16), height: rem(16) }} />
              }
              onClick={logout}
            >
              Logout
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
    </Container>
  );
}
