import { createTheme, rem, type MantineTheme } from "@mantine/core";

export const theme = createTheme({
  fontFamily: "'Inter', sans-serif",
  headings: {
    fontFamily: "'Outfit', sans-serif",
    sizes: {
      h1: { fontSize: rem(36), lineHeight: "1.2" },
    },
  },
  primaryColor: "indigo",
  defaultRadius: "md",
  cursorType: "pointer",
  shadows: {
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  },
  components: {
    Button: {
      defaultProps: {
        radius: "md",
        fw: 500,
      },
    },
    Card: {
      defaultProps: {
        radius: "md",
        shadow: "sm",
        withBorder: true,
      },
      styles: (themes: MantineTheme) => ({
        root: {
          backgroundColor: "var(--mantine-color-body)",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: themes.shadows.md,
          },
        },
      }),
    },
    Badge: {
      defaultProps: {
        radius: "sm",
        tt: "uppercase",
        fw: 700,
      },
    },
    Container: {
      defaultProps: {
        size: "lg",
      },
    },
  },
});
