import { createTheme } from "@mui/material/styles";

/**
 * MUI theme with CSS variables + light/dark color schemes.
 * `colorSchemeSelector: "class"` puts `.light` / `.dark` on <html>,
 * which Tailwind's `dark:` variant also listens to (see index.css).
 */
export const theme = createTheme({
  cssVariables: { colorSchemeSelector: "class" },
  colorSchemes: {
    light: {
      palette: {
        primary: { main: "#4f46e5" },
        secondary: { main: "#db2777" },
        background: { default: "#f8fafc" },
      },
    },
    dark: {
      palette: {
        primary: { main: "#818cf8" },
        secondary: { main: "#f472b6" },
        background: { default: "#0b0f19", paper: "#111827" },
      },
    },
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    button: { textTransform: "none", fontWeight: 600 },
  },
  components: {
    MuiButton: { defaultProps: { disableElevation: true } },
    MuiTextField: { defaultProps: { size: "small", fullWidth: true } },
    MuiPaper: { styleOverrides: { root: { backgroundImage: "none" } } },
  },
});
