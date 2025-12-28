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
} from "@mantine/core";
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
      email: "a@mail.com",
      password: "a@mail.com",
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
    } catch {
      // Error is handled in the auth store
    } finally {
      setLoading(false);
    }
  };

  return (
    <Center h={"100vh"}>
      <Paper radius="md" p="lg" withBorder maw={"320px"}>
        <Text size="lg" fw={500} mb={"md"}>
          Welcome back, login with
        </Text>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <TextInput
              label="Email"
              placeholder="hello@mantine.dev"
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
              Don't have an account? Register
            </Anchor>
            <Button type="submit" radius="xl" loading={loading}>
              Login
            </Button>
          </Group>
        </form>
      </Paper>
    </Center>
  );
}
