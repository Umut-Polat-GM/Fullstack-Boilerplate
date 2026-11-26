import "@fontsource/poppins/latin-400.css";
import "@fontsource/poppins/latin-500.css";
import "@fontsource/poppins/latin-600.css";
import "@fontsource/poppins/latin-700.css";

import CssBaseline from "@mui/material/CssBaseline";
import GlobalStyles from "@mui/material/GlobalStyles";
import { StyledEngineProvider, ThemeProvider } from "@mui/material/styles";
import { QueryClientProvider } from "@tanstack/react-query";
import { SnackbarProvider } from "notistack";
import { queryClient } from "@/lib/queryClient";
import { theme } from "@/theme/theme";

/**
 * All app-wide providers in one place.
 *
 * MUI ↔ Tailwind: `enableCssLayer` puts MUI styles in `@layer mui`. The layer
 * order must be declared by Emotion itself (GlobalStyles below), because
 * Emotion injects its <style> tags before index.css — whichever declares a
 * layer first fixes the order. Result: Tailwind preflight (base) < MUI <
 * Tailwind utilities, so `className` utilities override MUI defaults.
 */
const LAYER_ORDER = "@layer theme, base, mui, components, utilities;";

export function AppProviders({ children }) {
  return (
    <StyledEngineProvider enableCssLayer>
      <GlobalStyles styles={LAYER_ORDER} />
      <ThemeProvider theme={theme} defaultMode="system">
        <CssBaseline />
        <QueryClientProvider client={queryClient}>
          <SnackbarProvider
            maxSnack={3}
            autoHideDuration={3500}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
          >
            {children}
          </SnackbarProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}
