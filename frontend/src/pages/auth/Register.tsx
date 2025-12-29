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
import { IconUserPlus } from "@tabler/icons-react";
import { useForm } from "@mantine/form";
import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { useAuthStore } from "../../stores/authStore";

export default function Register() {
  const navigate = useNavigate();
  const register = useAuthStore((state) => state.register);
  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: {
      name: "",
      email: "",
      password: "",
      passwordConfirm: "",
    },

    validate: {
      name: (val) =>
        val.trim().length < 3
          ? "Name should include at least 3 characters"
          : null,
      email: (val) => (/^\S+@\S+$/.test(val) ? null : "Invalid email"),
      password: (val) =>
        val.length < 8 ? "Password should include at least 8 characters" : null,
      passwordConfirm: (val, values) =>
        val !== values.password ? "Passwords do not match" : null,
    },
  });

  const handleSubmit = async (values: {
    name: string;
    email: string;
    password: string;
  }) => {
    setLoading(true);
    try {
      await register({
        name: values.name,
        email: values.email,
        password: values.password,
      });
      navigate("/");
    } catch {
      // Error is handled in the auth store
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box style={{ background: "linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)" }} h="100vh">
      <Center h="100%">
        <Paper radius="lg" p={40} shadow="xl" withBorder maw={"380px"} w="100%">
          <Stack align="center" mb="lg">
            <ThemeIcon size={60} radius={60} variant="gradient" gradient={{ from: 'indigo', to: 'cyan' }}>
               <IconUserPlus size={30} />
            </ThemeIcon>
            <Text size="xl" fw={700} style={{ fontFamily: 'var(--font-outfit)' }}>
              Create Account
            </Text>
            <Text size="sm" c="dimmed">
              Join TaskMaster today
            </Text>
          </Stack>

          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack>
              <TextInput
                label="Name"
                placeholder="Your name"
                value={form.values.name}
                onChange={(event) =>
                  form.setFieldValue("name", event.currentTarget.value)
                }
                error={form.errors.name}
                radius="md"
              />

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

              <PasswordInput
                label="Confirm Password"
                placeholder="Confirm your password"
                value={form.values.passwordConfirm}
                onChange={(event) =>
                  form.setFieldValue("passwordConfirm", event.currentTarget.value)
                }
                error={form.errors.passwordConfirm}
                radius="md"
              />
            </Stack>

            <Group justify="space-between" mt="xl">
              <Anchor component={Link} to="/login" c="dimmed" size="xs">
                Already have an account? Login
              </Anchor>
              <Button type="submit" radius="md" loading={loading} fullWidth mt="sm">
                Register
              </Button>
            </Group>
          </form>
        </Paper>
      </Center>
    </Box>
  );
}
