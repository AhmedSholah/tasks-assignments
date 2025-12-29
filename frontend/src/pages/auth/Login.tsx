import {
  Anchor,
  Button,
  Center,
  Group,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Box,
  ThemeIcon,
} from "@mantine/core";
import { IconLogin2 } from "@tabler/icons-react";
import { useForm } from "@mantine/form";
import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { useAuthStore } from "../../stores/authStore";

export default function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },

    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : "Invalid email"),
      password: (val) =>
        val.length < 8 ? "Password should include at least 8 characters" : null,
    },
  });

  const handleSubmit = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      await login(values);
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      style={{
        background: "linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)",
      }}
      h="100vh"
    >
      <Center h="100%" mx={"xs"}>
        <Paper radius="lg" p={40} shadow="xl" withBorder maw={"380px"} w="100%">
          <Stack align="center" mb="lg">
            <ThemeIcon
              size={60}
              radius={60}
              variant="gradient"
              gradient={{ from: "indigo", to: "cyan" }}
            >
              <IconLogin2 size={30} />
            </ThemeIcon>
            <Text
              size="xl"
              fw={700}
              style={{ fontFamily: "var(--font-outfit)" }}
            >
              Welcome Back
            </Text>
            <Text size="sm" c="dimmed">
              Sign in to continue to TaskMaster
            </Text>
          </Stack>

          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack>
              <TextInput
                label="Email"
                placeholder="hello@example.com"
                value={form.values.email}
                onChange={(event) =>
                  form.setFieldValue("email", event.currentTarget.value)
                }
                error={form.errors.email && "Invalid email"}
                radius="md"
              />

              <PasswordInput
                label="Password"
                placeholder="Your password"
                value={form.values.password}
                onChange={(event) =>
                  form.setFieldValue("password", event.currentTarget.value)
                }
                error={
                  form.errors.password &&
                  "Password should include at least 8 characters"
                }
                radius="md"
              />
            </Stack>

            <Group justify="space-between" mt="xl">
              <Anchor component={Link} to="/register" c="dimmed" size="xs">
                Create account
              </Anchor>
              <Button
                type="submit"
                radius="md"
                loading={loading}
                fullWidth
                mt="sm"
              >
                Sign In
              </Button>
            </Group>
          </form>
        </Paper>
      </Center>
    </Box>
  );
}
