import { Button, Container, Group, Text, Title, Box } from "@mantine/core";
import { Link } from "react-router";
import { Illustration } from "../components/Illustration";

export function NothingFoundBackground() {
  return (
    <Container pt={80} pb={80}>
      <Box style={{ position: "relative" }}>
        <Illustration
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.75,
            color: "light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-6))",
          }}
        />
        <Box
          pt={{ base: 120, sm: 220 }}
          style={{ position: "relative", zIndex: 1 }}
        >
          <Title
            ta="center"
            fw={500}
            fz={{ base: 32, sm: 38 }}
          >
            Nothing to see here
          </Title>
          <Text
            c="dimmed"
            size="lg"
            ta="center"
            maw={540}
            mx="auto"
            mt="xl"
            mb="calc(var(--mantine-spacing-xl) * 1.5)"
          >
            Page you are trying to open does not exist. You may have mistyped
            the address, or the page has been moved to another URL. If you think
            this is an error contact support.
          </Text>
          <Group justify="center">
            <Button component={Link} to="/" size="md">
              Take me back to home page
            </Button>
          </Group>
        </Box>
      </Box>
    </Container>
  );
}
